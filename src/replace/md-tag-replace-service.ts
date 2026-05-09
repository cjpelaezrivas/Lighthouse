import { AppConfiguration } from "../types/app-configuration";
import { AbstractTagReplacerService } from "./abstract-tag-replacer-service";
import { INCLUDE_REGEX, RegexResult } from "./tag_regexs";

/** @deprecated Not used anymore after updating ProcessorService to call the same replaced before and after rendering */
export class MDTagReplacerService extends AbstractTagReplacerService {

    protected initialize() {
        this.setFunctions(new Map([
            ["include", {
                regex: INCLUDE_REGEX("md"),
                function: this.applyInclude
            }]
        ]));
    }

    private applyInclude(result: RegexResult, appConfiguration: AppConfiguration) {
        super.debug(`MD INCLUDE - FUNCTION INCLUDE - ${JSON.stringify(result)}`, appConfiguration);

        const filePath = result.regexResult[1];
        return super.getFileContent(filePath, appConfiguration)?.trim();
    }
}
