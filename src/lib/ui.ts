import chalk from "chalk";
import stringWidth from "string-width";

export const colors = {
    primary: chalk.hex("#4285F4"), // Google Blue
    secondary: chalk.hex("#EA4335"), // Google Red
    success: chalk.hex("#34A853"), // Google Green
    warning: chalk.hex("#FBBC05"), // Google Yellow
    error: chalk.hex("#EF4444"),
    muted: chalk.hex("#71717A"),
    dim: chalk.hex("#52525B"),
    white: chalk.visible,
    cyan: chalk.cyan,
};

export const LOGO = `
    ${colors.primary(" ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗")}
    ${colors.secondary("██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║")}
    ${colors.warning("██║ ███╗ █████╗  ██╔████╔██║██║██╔██╗ ██║██║")}
    ${colors.success("██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║")}
    ${colors.primary("╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║")}
    ${colors.secondary(" ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝")}
`;

export function header(title: string, icon: string = ""): string {
    const iconPart = icon ? `${icon} ` : "";
    return `\n${colors.primary("━".repeat(50))}\n  ${iconPart}${colors.white.bold(title)}\n${colors.primary("━".repeat(50))}`;
}

export function formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toLocaleString();
}

export function getDisplayWidth(str: string): number {
    return stringWidth(str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, ""));
}

export function createBox(lines: string[], width: number = 47): string {
    const top = colors.dim(`  ┌${"─".repeat(width)}┐`);
    const bottom = colors.dim(`  └${"─".repeat(width)}┘`);
    const paddedLines = lines.map((line) => {
        const visibleLength = getDisplayWidth(line);
        const padding = width - 2 - visibleLength;
        return colors.dim("  │ ") + line + " ".repeat(Math.max(0, padding)) + colors.dim(" │");
    });
    return [top, ...paddedLines, bottom].join("\n");
}

export function success(message: string): string {
    return `${colors.success("✓")} ${message}`;
}

export function error(message: string): string {
    return `${colors.error("✗")} ${message}`;
}

export function info(message: string): string {
    return `${colors.cyan("ℹ")} ${message}`;
}

export function warning(message: string): string {
    return `${colors.warning("⚠")} ${message}`;
}
