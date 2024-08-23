import { AppConfiguration } from "../types/app-configuration";
import { fileUtils } from "../utils/file-utils";
import { objectUtils } from "../utils/object-utils";
import { ScriptExecutionService} from "../execute/script-execution-service";
import { MD_EXTENSION } from "../constants";
import { MarkdownRenderer } from "../content/markdown-renderer";
import { FOREACH, FOREACH_TAG, GENERATE, IF, IF_TAG, INCLUDE, RegexResult, VARIABLE } from "./tag_regexs";
import { AbstractTagReplacerService } from "./abstract-tag-replacer-service";

export class TagReplacerService extends AbstractTagReplacerService {

    private markdownRenderer: MarkdownRenderer = new MarkdownRenderer();
    private scriptExecutionService: ScriptExecutionService = new ScriptExecutionService();

    protected initialize() {
        this.setFunctions(new Map([
            ["foreach-tag", {
                regex: FOREACH_TAG,
                function: this.applyExpansion
            }],
            ["foreach", {
                regex: FOREACH,
                function: this.applyExpansion
            }],
            ["if-tag", {
                regex: IF_TAG,
                function: this.applySelection
            }],
            ["if", {
                regex: IF,
                function: this.applySelection
            }],
            ["variable", {
                regex: VARIABLE,
                function: this.applySubstitution
            }],
            ["include", {
                regex: INCLUDE,
                function: this.applyInclude
            }],
            ["generate", {
                regex: GENERATE,
                function: this.applyGenerate
            }]
        ]));
    }

    private applyExpansion(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`EXPANSION - FUNCTION FOREACH - ${result}`, appConfiguration);

        const item = result.regexResult[1];
        const field = result.regexResult[2];
        const content = result.regexResult[3]?.trim();
        const listFromConfig = this.getListFromConfig(field, appConfiguration);

        if(!listFromConfig) {
            super.warn(`List not found: ${field}`);

            return appConfiguration.appFlags.debug ?
                `##ERROR - List not found: ${field}##` : "";
        }

        let replacement = ``;
        const itemRegex = new RegExp(`({{.*?)(${item})(.*?}})`, "g");

        if(listFromConfig.length === 1) {
            replacement += content.replaceAll(itemRegex, `$1${field}$3`);
        } else {
            listFromConfig.forEach((v, i, list) => {
                replacement += content
                    .replaceAll(itemRegex, `$1${field}[${i}]$3`) ;
                replacement += (i !== list.length - 1 ? '\n' : '');
            });
        }

        return replacement;
    }

    private getListFromConfig(field: string, appConfiguration: AppConfiguration): string[] | null {
        let value = objectUtils.get(field, appConfiguration.configuration) as any | null;

        if(value && !Array.isArray(value)) {
            value = [value];
        }

        return value as string[];
    }

    private applySelection(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`SELECTION - FUNCTION IF - ${JSON.stringify(result)}`, appConfiguration);

        const field = result.regexResult[1];
        const configValue = objectUtils.get(field, appConfiguration.configuration);

        return !!configValue ? result.regexResult[2] : result.regexResult[3];
    }

    private applySubstitution(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`SUBSTITUTION - FUNCTION VARIABLE - ${JSON.stringify(result)}`, appConfiguration);

        const field = result.regexResult[1];
        let value = objectUtils.get(field, appConfiguration.configuration);

        if(!value) {
            super.warn(`Variable not found: ${field}`);

            return appConfiguration.appFlags.debug ?
                `##ERROR - Variable not found: ${field}##` : "";
        }

        if(objectUtils.isObject(value)) {
            value = JSON.stringify(value);
        }

        return value.toString();
    }

    private applyInclude(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`INCLUDE - FUNCTION INCLUDE - ${JSON.stringify(result)}`, appConfiguration);

        const filePath = result.regexResult[1];
        let content = super.getFileContent(filePath, appConfiguration)?.trim();

        if(fileUtils.getFileExtension(filePath).toLowerCase() === MD_EXTENSION) {
            content = this.markdownRenderer.configure(appConfiguration).render(content);
        }

        return content;
    }

    private applyGenerate(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`GENERATE - FUNCTION GENERATE - ${JSON.stringify(result)}`, appConfiguration);

        return this.scriptExecutionService.loadAndExecuteScript(result.regexResult, true, appConfiguration)?.trim();
    }
}
