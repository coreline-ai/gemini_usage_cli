import fs from "fs";
import path from "path";
import os from "os";

/**
 * Example of how an AI agent (like Antigravity) can automatically 
 * log its own usage to a local file.
 */
export function logAgentUsage(data: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    projectName: string;
}) {
    const logDir = path.join(os.homedir(), ".gemini");
    const logFile = path.join(logDir, "usage.jsonl");

    // Ensure directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        project: data.projectName,
        model: data.model,
        usage: {
            input_tokens: data.inputTokens,
            output_tokens: data.outputTokens,
        },
        // Adding a unique session ID to prevent duplicates
        session_id: `antigravity_${Date.now()}`
    };

    fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");
    console.log(`[AutoLog] Usage recorded to ${logFile}`);
}

// Example usage
// logAgentUsage({
//   model: "gemini-2.0-flash",
//   inputTokens: 1500,
//   outputTokens: 800,
//   projectName: "gemini_usage_cli"
// });
