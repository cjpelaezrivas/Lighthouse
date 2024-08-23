import { log } from "console";
import { AppConfiguration } from "../types/app-configuration";
import { fileUtils } from "../utils/file-utils";
import { RegexObject, RegexResult } from "./tag_regexs";

export abstract class AbstractTagReplacerService {

    private functions: Map<String, RegexObject> = new Map();
    private outputHistory: string[] = [];

    constructor() {
        this.initialize();
    }

    replace(input: string, appConfiguration: AppConfiguration) {
        let output = input;
        this.outputHistory = [];

        let regex = undefined;
        while ((regex = this.searchRegex(output))) {
            const replacement = this.getReplacement(regex, appConfiguration);
            output = this.applyReplacement(output, regex.regexResult[0], replacement);

            if(this.detectIfLoopOnReplacement(input, output)) {
                return output;
            }
        }

        return output;
    }

    private searchRegex(text: string) {
        for (let [regexName, regexObject] of this.functions.entries()) {
            const regexResult = regexObject.regex.exec(text);
            if (regexResult) {
                regexObject.regex.lastIndex = 0; //Reset search index after each find out
                return { regexName, regexResult } as RegexResult;
            }
        }

        return undefined;
    }

    private getReplacement(regex: RegexResult, appConfiguration: AppConfiguration) {
        const replacement = this.functions.get(regex.regexName)?.function.call(this, regex, appConfiguration);

        return !!replacement ? replacement : "";
    }

    private applyReplacement(text: string, search: string, replacement: string) {
        return text.replaceAll(search, replacement);
    }

    private detectIfLoopOnReplacement(input: string, text: string) {
        if(this.outputHistory.includes(text)) {
            this.warn(`Skipping method execution - Detected loop replacing tags on: ${input}`);
            return true;
        }

        this.outputHistory.push(text);

        return false;
    }

    protected abstract initialize(): void;

    protected setFunctions(functions: Map<String, RegexObject>) {
        this.functions = functions;
    }

    protected getFileContent(path: string, appConfiguration: AppConfiguration) {
        try {
            return fileUtils.readFile(`${appConfiguration.inputDirectory}${path}`);
        } catch (exception) {
            this.warn(`File not found: ${path}`);
            return "";
        }
    }

    protected debug(log: string, appConfiguration: AppConfiguration) {
        if(appConfiguration.appFlags.debug) {
            console.info(`DEBUG - ${log}`);
        }
    }

    protected warn(log: string) {
        console.warn(`WARN - ${log}`);
    }
}
