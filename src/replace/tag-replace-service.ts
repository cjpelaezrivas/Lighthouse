import { AppConfiguration } from "../types/app-configuration";
import { objectUtils } from "../utils/object-utils";
import { logUtils } from "../utils/log-utils";
import { ScriptExecutionService} from "../execute/script-execution-service";
import { IGNORE_REGEX, FOREACH_REGEX, FOREACH_TAG_REGEX, GENERATE_REGEX, IF_REGEX, INCLUDE_REGEX, VARIABLE_REGEX, RegexResult } from "./tag_regexs";
import { AbstractTagReplacerService } from "./abstract-tag-replacer-service";

export class TagReplacerService extends AbstractTagReplacerService {

    private scriptExecutionService: ScriptExecutionService = new ScriptExecutionService();

    protected initialize() {
        this.setFunctions(new Map([
            ["ignore-tag", {
                regex: IGNORE_REGEX,
                function: this.applyIgnore
            }],
            ["foreach-tag", {
                regex: FOREACH_TAG_REGEX,
                function: this.applyExpansion
            }],
            ["foreach", {
                regex: FOREACH_REGEX,
                function: this.applyExpansion
            }],
            ["if", {
                regex: IF_REGEX,
                function: this.applySelection
            }],
            ["variable", {
                regex: VARIABLE_REGEX,
                function: this.applySubstitution
            }],
            ["include", {
                regex: INCLUDE_REGEX(),
                function: this.applyInclude
            }],
            ["generate", {
                regex: GENERATE_REGEX(),
                function: this.applyGenerate
            }]
        ]));
    }

    private applyIgnore(result: RegexResult, appConfiguration: AppConfiguration) {
        this.debug(`IGNORE - FUNCTION EXTRACT BLOCK IGNORE - ${JSON.stringify(result)}`, appConfiguration);

        const key = `LH_IGNORE_${this.getIgnoreBlocks().size}_LH`;
        const content = result.regexResult[1];

        this.getIgnoreBlocks().set(key, content?.trim());

        return key;
    }

    private applyExpansion(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`EXPANSION - FUNCTION FOREACH - ${JSON.stringify(result)}`, appConfiguration);

        const item = result.regexResult[1];
        const field = result.regexResult[2];
        const content = result.regexResult[3]?.trim();
        const listFromConfig = this.getListFromConfig(field, appConfiguration);

        if(!listFromConfig) {
            logUtils.warn(`List not found: ${field}`);

            return appConfiguration.appFlags.debug ?
                `##ERROR - List not found: ${field}##` : "";
        }

        let replacement = ``;
        const itemRegex = new RegExp(`({{.*?)(${item})(.*?}})`, "g");

        if(this.isSingleElement(listFromConfig)) {
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

    private isSingleElement(list: any[]) {
        return objectUtils.isPrimitive(list) || objectUtils.isString(list) || objectUtils.isObject(list);
    }

    private getListFromConfig(field: string, appConfiguration: AppConfiguration) {
        return objectUtils.get(field, appConfiguration.configuration) as any[] | null;
    }

    private applySelection(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`SELECTION - FUNCTION IF - ${JSON.stringify(result)}`, appConfiguration);

        const field = result.regexResult[1];
        const configValue = objectUtils.get(field, appConfiguration.configuration);

        return !!configValue ? result.regexResult[2]?.trim() : result.regexResult[3]?.trim();
    }

    private applySubstitution(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`SUBSTITUTION - FUNCTION VARIABLE - ${JSON.stringify(result)}`, appConfiguration);

        const field = result.regexResult[1];
        let value = objectUtils.get(field, appConfiguration.configuration);

        if(!value) {
            logUtils.warn(`Variable not found: ${field}`);

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
        return super.getFileContent(filePath, appConfiguration)?.trim();
    }

    private applyGenerate(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`GENERATE - FUNCTION GENERATE - ${JSON.stringify(result)}`, appConfiguration);

        return this.scriptExecutionService.loadAndExecuteScript(result.regexResult, true, appConfiguration)?.trim();
    }
}
