import { IGNORE_FILE_NAME } from "../constants";
import { AppConfiguration } from "../types/app-configuration";
import { fileUtils } from "../utils/file-utils";

export class IgnoreFileService {
    private ignoringRules: RegExp[];

    constructor(configuration: AppConfiguration) {
        const rules = this.getIgnoreConfig(configuration);

        this.ignoringRules = [];
        rules.forEach((rule) => {
            this.ignoringRules.push(new RegExp(`^(${configuration.inputDirectory})?${rule}$`));
        });
    }

    checkIfHasToIgnore(file: string): boolean {
        for (let rule of this.ignoringRules) {
            rule.lastIndex = 0; //Reset search index after each find out
            const result = rule.exec(file);

            if(!!result) {
                return true;
            }
        }

        return false;
    }

    private getIgnoreConfig(configuration: AppConfiguration): string[] {
        const ignoreConfigurationFile =
            configuration.inputDirectory + IGNORE_FILE_NAME;

        return fileUtils.exists(ignoreConfigurationFile)
            ? fileUtils.readFile(ignoreConfigurationFile).trim()
                .split("\n").map(r => r.replaceAll(/[\t\r]/g, ""))
            : [];
    }
}
