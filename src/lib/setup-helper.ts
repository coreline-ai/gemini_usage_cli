import fs from "fs";
import path from "path";
import os from "os";
import { colors, success, info } from "./ui.js";

const LOGGING_RULE = `
### 🤖 Antigravity Logging Rule
- Antigravity MUST automatically log its usage to \`~/.gemini/usage.jsonl\` after completing any significant task.
- Format: JSONL with keys: \`timestamp\`, \`project\`, \`model\`, \`usage\` (input_tokens, output_tokens).
`;

export function setupProjectLogging(projectRoot: string) {
    const antigravityDir = path.join(projectRoot, ".antigravity");
    const rulesFile = path.join(antigravityDir, "rules.md");

    if (!fs.existsSync(antigravityDir)) {
        fs.mkdirSync(antigravityDir, { recursive: true });
    }

    let content = "";
    if (fs.existsSync(rulesFile)) {
        content = fs.readFileSync(rulesFile, "utf-8");
    }

    if (!content.includes("Antigravity Logging Rule")) {
        fs.appendFileSync(rulesFile, LOGGING_RULE);
        console.log(`  ${success("Project rules updated at")} ${colors.dim(".antigravity/rules.md")}`);
    } else {
        console.log(`  ${info("Logging rule already exists in this project.")}`);
    }
}

export function setupGlobalLogging() {
    const globalDir = path.join(os.homedir(), ".antigravity");
    const globalRules = path.join(globalDir, "rules.md");

    if (!fs.existsSync(globalDir)) {
        fs.mkdirSync(globalDir, { recursive: true });
    }

    let content = "";
    if (fs.existsSync(globalRules)) {
        content = fs.readFileSync(globalRules, "utf-8");
    }

    if (!content.includes("Antigravity Logging Rule")) {
        fs.appendFileSync(globalRules, LOGGING_RULE);
        console.log(`  ${success("Global rules updated at")} ${colors.dim("~/.antigravity/rules.md")}`);
    } else {
        console.log(`  ${info("Global logging rule already exists.")}`);
    }
}
