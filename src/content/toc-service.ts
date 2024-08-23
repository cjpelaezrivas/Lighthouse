import { CONFIGURATION_DOCUMENT_TOC_ENABLED } from "../constants";
import { AppConfiguration } from "../types/app-configuration";
import { objectUtils } from "../utils/object-utils";

export class TocService {

    includeTocIfEnabled(
        mdBody: string,
        appConfiguration: AppConfiguration
    ) {
        const TOC_TAG = "\n[[TOC]]";
        const tocEnabled = objectUtils.get(
            CONFIGURATION_DOCUMENT_TOC_ENABLED,
            appConfiguration.configuration,
            false
        );

        return mdBody + (tocEnabled ? TOC_TAG : "");
    }

    extractTocIfExists(
        html: string,
        appConfiguration: AppConfiguration
    ) {
        const TOC_REGEX = /(<div class=\"table-of-contents\">.*?<ul>(.*)<\/ul>.*?<\/div>)/g;
        let regexResult = TOC_REGEX.exec(html);

        if (!regexResult) {
            return html;
        }

        if(regexResult[2] !== "") { // There is no headers to show in the TOC
            objectUtils.set("toc", regexResult[1], appConfiguration.configuration);
        }

        return html.replaceAll(regexResult[1], "").trim();
    }
}
