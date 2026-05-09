import {
    CONFIGURATION_OUTPUT_SITEMAP_ENABLED,
    CONFIGURATION_OUTPUT_SITEMAP_EXTRA_LINKS,
    CONFIGURATION_OUTPUT_SITEMAP_LASTMOD,
    CONFIGURATION_SITE_BASE_URL,
} from "../constants";
import { AppConfiguration } from "../types/app-configuration";
import { objectUtils } from "../utils/object-utils";
import { fileUtils } from "../utils/file-utils";


export class SitemapService {

    private static readonly SITEMAP_FILE_NAME = "sitemap.xml";
    private static readonly XML_OPENING_TAG = `<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
    private static readonly XML_CLOSING_TAG = `</urlset>`;

    generateSitemapIfEnabled(processedFiles: string[], appConfiguration: AppConfiguration) {
        const enabled = objectUtils.get(CONFIGURATION_OUTPUT_SITEMAP_ENABLED, appConfiguration.configuration) as boolean;
        if (!enabled) return;

        const baseUrl = fileUtils.endPath(objectUtils.get(CONFIGURATION_SITE_BASE_URL, appConfiguration.configuration) as string);
        const lastmod = objectUtils.getAsString(CONFIGURATION_OUTPUT_SITEMAP_LASTMOD, appConfiguration.configuration)
            ?? new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");

        const extraLinks = objectUtils.get(CONFIGURATION_OUTPUT_SITEMAP_EXTRA_LINKS, appConfiguration.configuration) as string[];
        const urlEntries = processedFiles.concat(extraLinks ?? [])
            .map((link) => `<url>\n<loc>${baseUrl}${link}</loc>\n<lastmod>${lastmod}</lastmod>\n</url>`)
            .join("\n");

        const content = [
            SitemapService.XML_OPENING_TAG,
            urlEntries,
            SitemapService.XML_CLOSING_TAG,
        ].join("\n");

        fileUtils.writeFile(appConfiguration.outputDirectory + SitemapService.SITEMAP_FILE_NAME, content);
    }
}
