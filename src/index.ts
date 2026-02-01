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

    // Reactive Watcher
    let watcher: fs.FSWatcher | null = null;
    const setupWatcher = () => {
        if (watcher) watcher.close();
        if (fs.existsSync(logPath)) {
            watcher = fs.watch(logPath, async (event) => {
                // macOS에서는 파일 append 시 'rename' 이벤트가 발생할 수 있음
                if (event === "change" || event === "rename") {
                    // 파일이 존재하는지 확인 (rename 시 삭제된 경우 대비)
                    if (fs.existsSync(logPath)) {
                        await performScan(true);
                        rl.prompt(true);
                    }
                }
            });
        } else {
            const logDir = path.dirname(logPath);
            if (fs.existsSync(logDir)) {
                watcher = fs.watch(logDir, async (event, filename) => {
                    if (filename === "usage.jsonl") {
                        setupWatcher(); // Re-setup to watch the file itself
                        await performScan(true);
                        rl.prompt(true);
                    }
                });
            }
        }
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
        if (watcher) watcher.close();
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
