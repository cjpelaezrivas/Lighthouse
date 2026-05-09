import { AppConfiguration } from "../types/app-configuration";
import { fileUtils } from "../utils/file-utils";
import { logUtils } from "../utils/log-utils";
import { objectUtils } from "../utils/object-utils";
import { RegexObject, RegexResult } from "./tag_regexs";
import { YAML_EXTENSIONS } from "../constants";

type ReplaceConfig = {
    skipTags?: string[],
    isReplacingConfigValue?: boolean
};

export abstract class AbstractTagReplacerService {

    private readonly IGNORE_REPLACEMENT_REGEX = /LH_IGNORE_([0-9]+)_LH/gs;

    private functions: Map<string, RegexObject> = new Map();
    private ignoreBlocks: Map<string, string> = new Map();
    private outputHistory: string[] = [];

    constructor() {
        this.initialize();
    }

    replace(input: any, appConfiguration: AppConfiguration, {skipTags: ignoreTags = [], isReplacingConfigValue = false}: ReplaceConfig = {}): any {
        if(!this.isInputString(input)) {
            return input;
        }

        let output = input;
        this.outputHistory = [];

        let regex = undefined;
        while ((regex = this.searchRegex(output, ignoreTags))) {
            const replaced = regex.regexResult[0];
            const replacement = this.getReplacement(regex, appConfiguration);
            const extension = regex.regexResult[2];

            // If the match is replacing a configuration value
            // And if the match is replacing the whole value
            // And if the replacement is a YAML object
            // Then, return as an object, to be assigned to the configuration
            // But before, replace any tag inside it
            if(isReplacingConfigValue && replaced === output
                && !!extension && fileUtils.isExtension(YAML_EXTENSIONS, extension)) {

                return objectUtils.applyFunctionToProperties(
                    objectUtils.parseYaml(replacement),
                    value => this.replace(value, appConfiguration, {skipTags: ignoreTags, isReplacingConfigValue}));
            }

            output = this.applyReplacement(output, replaced, replacement);

            if(this.detectIfLoopOnReplacement(input, output)) {
                break;
            }
        }

        return output;
    }

    restoreIgnoreBlocks(input: string): string {
        let output = input;
        this.outputHistory = [];

        let regexResult = undefined;
        while (regexResult = this.IGNORE_REPLACEMENT_REGEX.exec(output)) {
            this.IGNORE_REPLACEMENT_REGEX.lastIndex = 0; //Reset search index after each find out

            let replace = regexResult[0];
            let replacement = this.ignoreBlocks.get(replace);

            if(!replacement) {
                logUtils.warn(`Key not found when restoring ignored block. Key: ${replace}`);

                const id = regexResult[1];
                const index = regexResult[2];
                replacement = `##ERROR - Key not found: ${id}_${index}##`;
            }

            output = output.replace(replace, replacement);

            if(this.detectIfLoopOnReplacement(input, output)) {
                break;
            }
        }

        this.ignoreBlocks.clear();

        return output;
    }

    private isInputString(input: any) {
        return typeof input === "string";
    }

    private searchRegex(text: string, ignoreTags: string[]) {
        for (let [regexName, regexObject] of this.functions.entries()) {
            const regexResult = regexObject.regex.exec(text);

            if (!!regexResult && !ignoreTags.includes(regexResult[1])) {
                regexObject.regex.lastIndex = 0; //Reset search index after each find out
                return { regexName, regexResult } as RegexResult;
            }
        }

        return undefined;
    }

    private getReplacement(regex: RegexResult, appConfiguration: AppConfiguration) {
        return this.functions.get(regex.regexName)?.function.call(this, regex, appConfiguration);
    }

    private applyReplacement(text: string, search: string, replacement: string = "") {
        return text.replaceAll(search, replacement);
    }

    private detectIfLoopOnReplacement(input: string, text: string) {
        if(this.outputHistory.includes(text)) {
            logUtils.warn(`Skipping method execution - Detected loop replacing tags on: ${input}`);
            return true;
        }

        this.outputHistory.push(text);

        return false;
    }

    protected abstract initialize(): void;

    protected setFunctions(functions: Map<string, RegexObject>) {
        this.functions = functions;
    }

    protected getIgnoreBlocks() {
        return this.ignoreBlocks;
    }

    protected getFileContent(path: string, appConfiguration: AppConfiguration) {
        try {
            return fileUtils.readFile(`${appConfiguration.inputDirectory}${path}`);
        } catch (exception) {
            logUtils.warn(`File not found: ${path}`);
            return "";
        }
    }

    protected debug(log: string, appConfiguration: AppConfiguration) {
        if(appConfiguration.appFlags.debug) {
            logUtils.debug(log);
        }
    }
}
