import fs from "fs";
import path from "path";
import os from "os";

export interface UsageSummary {
    totalTokens: number;
    totalRequests: number;
    lastUsed: string;
}

export function getUsageLogPath(): string {
    return path.join(os.homedir(), ".gemini", "usage.jsonl");
}

export function parseUsageLogs(): UsageSummary {
    const logPath = getUsageLogPath();

    if (!fs.existsSync(logPath)) {
        return {
            totalTokens: 0,
            totalRequests: 0,
            lastUsed: "Never"
        };
    }

    const content = fs.readFileSync(logPath, "utf-8");
    const lines = content.trim().split("\n").filter(line => line.length > 0);

    let totalTokens = 0;
    let totalRequests = lines.length;
    let lastUsed = "Never";

    for (const line of lines) {
        try {
            const entry = JSON.parse(line);
            if (entry.usage) {
                totalTokens += (entry.usage.input_tokens || 0) + (entry.usage.output_tokens || 0);
            }
            if (entry.timestamp) {
                lastUsed = new Date(entry.timestamp).toLocaleDateString();
            }
        } catch (e) {
            // Ignore malformed lines
        }
    }

    return {
        totalTokens,
        totalRequests,
        lastUsed
    };
}
