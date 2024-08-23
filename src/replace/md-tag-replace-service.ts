import { AppConfiguration } from "../types/app-configuration";
import { AbstractTagReplacerService } from "./abstract-tag-replacer-service";
import { INCLUDE, RegexResult } from "./tag_regexs";

export class MDTagReplacerService extends AbstractTagReplacerService {

    protected initialize() {
        this.setFunctions(new Map([
            ["include", {
                regex: INCLUDE,
                function: this.applyInclude
            }]
        ]));
    }

    private applyInclude(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`MD INCLUDE - FUNCTION INCLUDE - ${JSON.stringify(result)}`,appConfiguration);

        const filePath = result.regexResult[1];
        let content = super.getFileContent(filePath, appConfiguration)?.trim();

        return content;
    }
}
