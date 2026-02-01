import Conf from "conf";

export interface CliConfig {
    apiToken?: string;
    apiUrl: string;
    verbose: boolean;
}

const defaults: CliConfig = {
    apiUrl: "https://gemini-usage.example.com/api",
    verbose: false,
};

let configInstance: Conf<CliConfig> | null = null;

export function getConfig(): Conf<CliConfig> {
    if (!configInstance) {
        configInstance = new Conf<CliConfig>({
            projectName: "gemini-usage-cli",
            defaults,
        });
    }
    return configInstance;
}
