import {
    CONFIGURATION_DOCUMENT_HEADERS_GENERATE_IDS,
    CONFIGURATION_DOCUMENT_HEADERS_SHOW_PERMALINKS,
    CONFIGURATION_DOCUMENT_HEADERS_PERMALINK_SYMBOL,
    CONFIGURATION_DOCUMENT_TOC_ENABLED,
    CONFIGURATION_DOCUMENT_TOC_LEVELS,
    CONFIGURATION_DOCUMENT_TOC_HEADER,
    CONFIGURATION_DOCUMENT_TOC_FOOTER,
} from "../constants";
import { AppConfiguration } from "../types/app-configuration";
import { objectUtils } from "../utils/object-utils";

import hljs from "highlight.js";
import MarkdownIt from "markdown-it";

export class MarkdownRenderer {
    configure(appConfiguration: AppConfiguration) {
        const idHeadersEnabled = objectUtils.get(
            CONFIGURATION_DOCUMENT_HEADERS_GENERATE_IDS,
            appConfiguration.configuration,
            false
        );
        const showPermalinks = objectUtils.get(
            CONFIGURATION_DOCUMENT_HEADERS_SHOW_PERMALINKS,
            appConfiguration.configuration,
            true
        );
        const permalinkSymbol = objectUtils.get(
            CONFIGURATION_DOCUMENT_HEADERS_PERMALINK_SYMBOL,
            appConfiguration.configuration,
            "#"
        );
        const tocEnabled = objectUtils.get(
            CONFIGURATION_DOCUMENT_TOC_ENABLED,
            appConfiguration.configuration,
            false
        );
        const tocLevels = objectUtils.get(
            CONFIGURATION_DOCUMENT_TOC_LEVELS,
            appConfiguration.configuration,
            [2]
        );
        const tocHeader = objectUtils.get(
            CONFIGURATION_DOCUMENT_TOC_HEADER,
            appConfiguration.configuration,
            ""
        );
        const tocFooter = objectUtils.get(
            CONFIGURATION_DOCUMENT_TOC_FOOTER,
            appConfiguration.configuration,
            ""
        );

        // https://www.npmjs.com/package/markdown-it
        const md: MarkdownIt = MarkdownIt({
            html: true, // Enable HTML tags in source
            breaks: false, // Convert '\n' in paragraphs into <br>
            linkify: false, // Autoconvert URL-like text to links
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return (
                            '<pre><code class="hljs">' +
                            hljs.highlight(str, {
                                language: lang,
                                ignoreIllegals: true,
                            }).value +
                            "</code></pre>"
                        );
                    } catch (__) {}
                }
                return (
                    '<pre><code class="hljs">' +
                    md.utils.escapeHtml(str) +
                    "</code></pre>"
                );
            },
        });

        md.disable(["code"]); // Disable code block render using indentation

        // https://www.npmjs.com/package/markdown-it-attrs
        md.use(require("markdown-it-attrs"), {
            leftDelimiter: "${",
            rightDelimiter: "}",
            allowedAttributes: ["id", "class", "style", /^lh_.*$/],
        });

        // https://www.npmjs.com/package/markdown-it-emoji
        md.use(require("markdown-it-emoji"));

        if (tocEnabled || idHeadersEnabled) {
            // https://www.npmjs.com/package/markdown-it-anchor
            const anchor = require('markdown-it-anchor')
            md.use(anchor, {
                level: tocLevels[0],
                tabIndex: false,
                permalink: showPermalinks ? anchor.permalink.linkInsideHeader({
                    symbol: permalinkSymbol,
                    placement: 'after'
                }) : undefined
            });
        }

        if (tocEnabled) {
            // https://www.npmjs.com/package/markdown-it-table-of-contents
            md.use(require("markdown-it-table-of-contents"), {
                includeLevel: tocLevels,
                containerHeaderHtml: !!tocHeader ? `<span class="table-of-contents-header">${tocHeader}</span>` : "",
                containerFooterHtml: !!tocFooter ? `<span class="table-of-contents-footer">${tocFooter}</span>`: "",
            });
        }

        return md;
    }
}
