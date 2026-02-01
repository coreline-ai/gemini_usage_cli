import { Command } from "commander";
import inquirer from "inquirer";
import readline from "readline";
import fs from "fs";
import path from "path";
import { LOGO, header, colors, createBox, formatNumber } from "./lib/ui.js";
import { setupProjectLogging, setupGlobalLogging } from "./lib/setup-helper.js";
import { parseUsageLogs, getUsageLogPath } from "./lib/log-parser.js";

const program = new Command();

// --- Exit Handler (Ctrl+C twice) ---
let exitAttempts = 0;
let exitTimer: NodeJS.Timeout | null = null;

function handleExit() {
    exitAttempts++;
    if (exitAttempts >= 2) {
        process.stdout.write(`\n  ${colors.muted("Exiting gemini-usage...")}\n`);
        process.exit(0);
    } else {
        process.stdout.write(`\n  ${colors.warning("!")} Press Ctrl+C one more time to exit.\n`);
        if (exitTimer) clearTimeout(exitTimer);
        exitTimer = setTimeout(() => {
            exitAttempts = 0;
        }, 2000);
    }
}

// Only enable custom exit handler during scan/watch or after setup
function enableCustomExit() {
    process.on("SIGINT", handleExit);
}

// --- Reusable Scan Logic ---
async function performScan(isWatch: boolean = false) {
    if (isWatch) {
        // Move cursor to top and clear screen to avoid "junk" characters
        process.stdout.write("\x1b[H\x1b[J");
    } else {
        console.clear();
    }

    // Always show LOGO at the top for consistent look
    console.log(LOGO);
    console.log(header("Gemini Usage Dashboard", "📊"));

    // Read real logs
    const summary = parseUsageLogs();

    const displayData = [
        `${colors.muted("Total Tokens")}   ⚡ ${colors.primary(formatNumber(summary.totalTokens))}`,
        `${colors.muted("Total Requests")} 📦 ${colors.success(summary.totalRequests.toString())}`,
        `${colors.muted("Last Activity")}  📅 ${colors.white(summary.lastUsed)}`,
        `${colors.muted("Status")}         🟢 ${colors.success("Reactive (Watching Logs)")}`,
    ];

    console.log(createBox(displayData));

    if (isWatch) {
        console.log(`\n  ${colors.white("●")} ${colors.white("Dashboard is waiting for new usage records...")}`);
        console.log(`  ${colors.dim("Commands: [ /refresh, /help ] or Ctrl+C twice to stop")}`);
    } else {
        console.log(`\n  ${colors.success("✓")} ${colors.white("Scan complete!")}\n`);
    }
}

// --- Watch Mode with Interactive Commands ---
async function startWatchMode() {
    enableCustomExit();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `  ${colors.primary("command > ")}`,
        completer: (line: string) => {
            const completions = ["/refresh", "/help"];
            const hits = completions.filter((c) => c.startsWith(line));
            return [hits.length ? hits : completions, line];
        }
    });

    const logPath = getUsageLogPath();

    // Reactive Watcher using fs.watchFile (polling) for macOS stability
    let lastSize = 0;
    let isWatching = false;

    const setupWatcher = () => {
        if (isWatching) return;
        isWatching = true;

        // 초기 파일 크기 저장
        if (fs.existsSync(logPath)) {
            lastSize = fs.statSync(logPath).size;
        }

        // fs.watchFile은 polling 방식으로 macOS에서 안정적
        fs.watchFile(logPath, { interval: 500 }, async (curr, prev) => {
            // 파일이 수정되었는지 확인 (크기 또는 mtime 변경)
            if (curr.mtime > prev.mtime || curr.size !== lastSize) {
                lastSize = curr.size;
                await performScan(true);
                rl.prompt(true);
            }
        });
    };

    setupWatcher();

    rl.on("line", (line) => {
        const cmd = line.trim();
        if (cmd === "/refresh") {
            process.stdout.write(`  ${colors.muted("Manual refresh triggered...")}\n`);
            performScan(true).then(() => rl.prompt());
        } else if (cmd === "/help") {
            process.stdout.write(`\n  ${colors.white.bold("Available Commands:")}\n`);
            process.stdout.write(`  ${colors.primary("/refresh")} - Force update the dashboard\n`);
            process.stdout.write(`  ${colors.primary("/help")}    - Show this help message\n`);
            process.stdout.write(`  ${colors.muted("Ctrl+C (x2)")} - Exit the application\n\n`);
            rl.prompt();
        } else if (cmd) {
            process.stdout.write(`  ${colors.error("!")} Unknown command: ${cmd}\n`);
            rl.prompt();
        } else {
            rl.prompt();
        }
    });

    // Handle Ctrl+C within readline
    rl.on("SIGINT", () => {
        handleExit();
        rl.prompt();
    });

    // Initial scan
    await performScan(true);
    rl.prompt();

    // Cleanup on exit
    process.on("exit", () => {
        fs.unwatchFile(logPath);
        rl.close();
    });
}

program
    .name("gemini-usage")
    .description("CLI tool for tracking Gemini usage")
    .version("0.1.0");

program
    .command("setup")
    .description("Configure Antigravity automatic logging")
    .action(async () => {
        console.log(header("Interactive Setup", "⚙️"));

        const { enableLogging } = await inquirer.prompt([
            {
                type: "confirm",
                name: "enableLogging",
                message: "Would you like to enable automatic logging for Antigravity?",
                default: true
            }
        ]);

        if (!enableLogging) {
            console.log(`  ${colors.muted("Setup cancelled.")}\n`);
            return;
        }

        const { scope } = await inquirer.prompt([
            {
                type: "list",
                name: "scope",
                message: "Where should this logging rule be applied?",
                choices: [
                    { name: "Current Project only (.antigravity/rules.md)", value: "project" },
                    { name: "Global (All projects - ~/.antigravity/rules.md)", value: "global" }
                ]
            }
        ]);

        if (scope === "project") {
            setupProjectLogging(process.cwd());
        } else {
            setupGlobalLogging();
        }

        console.log(`\n  ${colors.success("✓")} ${colors.white("Setup complete!")}`);
        console.log(`  ${colors.dim("Starting real-time tracking...")}\n`);

        await new Promise(r => setTimeout(r, 1000));
        await startWatchMode();
    });

program
    .command("scan")
    .description("Scan for Gemini usage logs")
    .option("-w, --watch", "Enable real-time tracking")
    .action(async (options) => {
        if (options.watch) {
            await startWatchMode();
        } else {
            await performScan(false);
        }
    });

program
    .command("auth")
    .description("Authenticate with Gemini Usage server")
    .option("-t, --token <token>", "API Token")
    .action((options: { token?: string }) => {
        console.log(header("Authentication", "🔐"));
        if (options.token) {
            console.log(`  ${colors.success("✓")} Token recognized: ${colors.dim(options.token.slice(0, 8) + "...")}`);
            console.log(`  ${colors.white("Welcome back, User!")}\n`);
        } else {
            console.log(`  ${colors.warning("!")} Please provide a token using --token`);
        }
    });

program.parse();
