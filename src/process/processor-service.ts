import {
    MD_EXTENSION,
    DEFAULT_TEMPLATE,
    BODY_TAG_REGEX,
    CONFIGURATION_DOCUMENT_TEMPLATE,
    CONFIGURATION_DOCUMENT_OUTPUT_NAME,
    CONFIGURATION_DOCUMENT_OUTPUT_PATH,
    HTML_EXTENSION,
    INCLUDE_ITEM_REGEX,
    EXECUTE_SCRIPT_FILE_REGEX,
    CONFIGURATION_OUTPUT_COPY_FILES,
    CONFIGURATION_EXECUTE_BEFORE_ALL,
    CONFIGURATION_EXECUTE_BEFORE_EACH,
    CONFIGURATION_EXECUTE_BEFORE_SAVE_EACH,
    CONFIGURATION_EXECUTE_AFTER_EACH,
    CONFIGURATION_EXECUTE_AFTER_ALL,
    CONFIGURATION_PROCESSING_FILE_PATH,
    CONFIGURATION_PROCESSING_FILE_NAME,
    CONFIGURATION_PROCESSING_FILE_EXTENSION,
    PROCESSING_FILE_CONTENT_FIELD,
} from "../constants";
import { AppConfiguration } from "../types/app-configuration";
import { logUtils } from "../utils/log-utils";
import { ProcessList } from "../types/process-list";
import { objectUtils } from "../utils/object-utils";
import { fileUtils } from "../utils/file-utils";
import { markdownUtils } from "../utils/markdown-utils";
import { MarkdownRenderer } from "../content/markdown-renderer";
import { ContentProcessor } from "../content/content-processor";
import { TocService } from "../content/toc-service";
import { TagReplacerService } from "../replace/tag-replace-service";
import { IgnoreFileService } from "../files/ignore-file-service";
import { ScriptExecutionService} from "../execute/script-execution-service";
import { SitemapService } from "./sitemap-service";

export class ProcessorService {

    private static readonly SKIP_TAG_REPLACEMENTS: string[] = [ "toc" ];

    private appConfiguration: AppConfiguration;
    private ignoreFileService: IgnoreFileService;
    private tocService: TocService = new TocService();
    private contentProcessor: ContentProcessor = new ContentProcessor();
    private markdownRenderer: MarkdownRenderer = new MarkdownRenderer();
    private tagReplacerService: TagReplacerService = new TagReplacerService();
    private scriptExecutionService: ScriptExecutionService = new ScriptExecutionService();
    private sitemapService: SitemapService = new SitemapService();

    private processedFiles: string[] = [];

    constructor(appConfiguration: AppConfiguration) {
        this.appConfiguration = appConfiguration;
        this.ignoreFileService = new IgnoreFileService(appConfiguration);
    }

    process(filesToProcess: ProcessList) {
        this.executeScriptFiles(CONFIGURATION_EXECUTE_BEFORE_ALL, this.appConfiguration);

        filesToProcess.files.forEach((fileName) => {
            const file = this.appConfiguration.inputDirectory + fileName;
            this.processFile(file);
        });

        filesToProcess.directories.forEach((directoryName) => {
            this.processDirectory(directoryName);
        });

        this.executeScriptFiles(CONFIGURATION_EXECUTE_AFTER_ALL, this.appConfiguration);

        if(filesToProcess.isProcessingDirectory) {
            this.processFilesToCopy();
        }

        this.sitemapService.generateSitemapIfEnabled(this.processedFiles, this.appConfiguration);
    }

    private processFile(file: string) {
        if(this.ignoreFileService.checkIfHasToIgnore(file)) {
            logUtils.info(`Ignoring file ${file}`);
            return;
        }

        const extension = fileUtils.getFileExtension(file).toLowerCase();

        if (extension === MD_EXTENSION) {
            logUtils.info(`Processing ${extension} file: ${file}`);
            try {
                this.processMarkdownFile(file);
            } catch(e) {
                logUtils.err(e);
            }
        } else {
            logUtils.info(`Copying ${extension} file: ${file}`);
            this.processOtherFile(file);
        }
    }

    private processDirectory(directoryName: string) {
        if(this.ignoreFileService.checkIfHasToIgnore(directoryName)) {
            logUtils.info(`Ignoring directory ${directoryName}`);
            return;
        }

        const directory = fileUtils.endPath(
            this.appConfiguration.inputDirectory + directoryName
        );
        const listOfFiles = fileUtils.listFilesIn(directory)
            .filter((file) => !fileUtils.isSystemFile(file));

        logUtils.info(`Processing directory ${directory} (${listOfFiles.length} file(s) found)`);
        logUtils.increaseIndentation();

        listOfFiles.forEach((fileName) => {
            const file = directory + fileName;

            if (fileUtils.isFile(file)) {
                this.processFile(file);
            } else {
                const innerDirectoryName =
                    directoryName + fileUtils.getPathSeparator() + fileName;
                this.processDirectory(innerDirectoryName);
            }
        });

        logUtils.reduceIndentation();
    }

    private processMarkdownFile(mdFile: string) {
        let [metadata, mdBody] = markdownUtils.splitMetadataAndBody(mdFile);
        const appConfigurationMerged = this.mergeMetadataIntoAppConfiguration(metadata);
        const mdRenderer = this.markdownRenderer.configure(appConfigurationMerged);

        this.setProcessingFile(mdFile, appConfigurationMerged);
        this.replaceTagsInConfiguration(appConfigurationMerged);
        this.executeScriptFiles(CONFIGURATION_EXECUTE_BEFORE_EACH, appConfigurationMerged);

        if(appConfigurationMerged.appFlags.debug) {
            logUtils.debug(JSON.stringify(appConfigurationMerged));
        }

        const relativeDestinationPath = this.getRelativeDestinationPath(mdFile, appConfigurationMerged);
        const destinationPath = this.getDestinationPath(relativeDestinationPath, appConfigurationMerged);
        const destinationFileName = this.getDestinationFileName(mdFile, appConfigurationMerged);
        const template = this.getTemplate(appConfigurationMerged);

        mdBody = this.tocService.includeTocIfEnabled(mdBody, appConfigurationMerged);
        mdBody = this.tagReplacerService.replace(mdBody, appConfigurationMerged, {skipTags: ProcessorService.SKIP_TAG_REPLACEMENTS});
        mdBody = this.contentProcessor.postProcessMD(mdBody);

        let rendererBody = mdRenderer.render(mdBody);
        rendererBody = this.tocService.extractTocIfExists(rendererBody, appConfigurationMerged);

        let rawHtml = this.joinTemplateAndBody(template, rendererBody);
        rawHtml = this.contentProcessor.preprocessRawHtml(rawHtml);

        if(appConfigurationMerged.appFlags.debug) {
            const joinFile = fileUtils.getFileName(destinationFileName) + `_join` + `.${HTML_EXTENSION}`;
            fileUtils.writeFile(destinationPath + joinFile, rawHtml);
        }

        rawHtml = this.tagReplacerService.replace(rawHtml, appConfigurationMerged);
        rawHtml = this.tagReplacerService.restoreIgnoreBlocks(rawHtml);
        rawHtml = this.contentProcessor.postProcessRawHtml(rawHtml);

        if(appConfigurationMerged.appFlags.debug) {
            const rawFile = fileUtils.getFileName(destinationFileName) + `_raw` + `.${HTML_EXTENSION}`;
            fileUtils.writeFile(destinationPath + rawFile, rawHtml);
        }

        this.setProcessingFileContent(rawHtml, appConfigurationMerged);
        this.executeScriptFiles(CONFIGURATION_EXECUTE_BEFORE_SAVE_EACH, appConfigurationMerged);
        const processedHtml = this.getProcessingFileContent(appConfigurationMerged);

        const formattedHtml = appConfigurationMerged.appFlags.minify ? this.minify(processedHtml) : this.prettify(processedHtml);
        fileUtils.writeFile(destinationPath + destinationFileName, formattedHtml);
        this.processedFiles.push(relativeDestinationPath + destinationFileName);

        this.executeScriptFiles(CONFIGURATION_EXECUTE_AFTER_EACH, appConfigurationMerged);
    }

    /**
     * Processing any not MD file is equivalent to be copied to the output directory
     */
    private processOtherFile(originalFile: string) {
        const destinationFile = this.appConfiguration.outputDirectory +
            this.getRelativePath (originalFile, this.appConfiguration.inputDirectory);
        fileUtils.copyFile(originalFile, destinationFile);
    }

    private processFilesToCopy() {
        const filesToCopy = objectUtils.get(CONFIGURATION_OUTPUT_COPY_FILES, this.appConfiguration.configuration) as string[];
        filesToCopy?.forEach((fileToCopy) => {
            const regexResult = INCLUDE_ITEM_REGEX.exec(fileToCopy);
            INCLUDE_ITEM_REGEX.lastIndex = 0; //Reset search index after each find out

            if(!regexResult) {
                return; //Continue
            }

            const origin = regexResult[1].trim();
            const originFile = this.appConfiguration.inputDirectory + origin;
            const destination = regexResult[2].trim();
            const destinationFile = this.appConfiguration.outputDirectory + destination;

            if(!fileUtils.exists(originFile)) {
                logUtils.warn(`Not possible to include file ${origin}. File not found`);
                return;
            }

            logUtils.info(`Copying file ${origin} to ${destination}`);
            fileUtils.copyFile(originFile, destinationFile);
        });
    }

    private setProcessingFile(mdFile:string, appConfiguration: AppConfiguration) {
        //Used on external scripts
        appConfiguration.processingFile = {
            path: mdFile,
            name: fileUtils.getFileName(mdFile),
            extension: fileUtils.getFileExtension(mdFile).toLocaleLowerCase()
        };

        //Used on tags replacements
        objectUtils.set(CONFIGURATION_PROCESSING_FILE_PATH, appConfiguration.processingFile.path, appConfiguration.configuration);
        objectUtils.set(CONFIGURATION_PROCESSING_FILE_NAME, appConfiguration.processingFile.name, appConfiguration.configuration);
        objectUtils.set(CONFIGURATION_PROCESSING_FILE_EXTENSION, appConfiguration.processingFile.extension, appConfiguration.configuration);
    }

    private getProcessingFileContent(appConfiguration: AppConfiguration) {
        return appConfiguration.processingFile?.content as string;
    }

    private mergeMetadataIntoAppConfiguration(metadata: object) {
        const appConfigurationMerged = objectUtils.deepClone(this.appConfiguration);
        appConfigurationMerged.configuration = objectUtils.deepMerge(appConfigurationMerged.configuration, metadata);

        return appConfigurationMerged;
    }

    private setProcessingFileContent(html: string, appConfiguration: AppConfiguration) {
        objectUtils.set(PROCESSING_FILE_CONTENT_FIELD, html, appConfiguration);
    }

    private replaceTagsInConfiguration(appConfigurationMerged: AppConfiguration) {
        return objectUtils.applyFunctionToProperties(
            appConfigurationMerged.configuration,
            value => this.tagReplacerService.replace(value, appConfigurationMerged, {isReplacingConfigValue: true}));
    }

    private joinTemplateAndBody(template: string, body: string) {
        return template.replaceAll(BODY_TAG_REGEX, body);
    }

    private getRelativeDestinationPath(filePath: string, appConfiguration: AppConfiguration) {
        const path = fileUtils.endPath(objectUtils.get(CONFIGURATION_DOCUMENT_OUTPUT_PATH, appConfiguration.configuration) as string
            || this.getRelativePath(fileUtils.getParent(filePath), appConfiguration.inputDirectory));

        return path === fileUtils.getPathSeparator() ? "" : path;
    }

    private getDestinationPath(relativePath: string, appConfiguration: AppConfiguration) {
        return fileUtils.endPath(appConfiguration.outputDirectory + relativePath);
    }

    private getDestinationFileName(mdFile: string, appConfiguration: AppConfiguration) {
        return (objectUtils.get(CONFIGURATION_DOCUMENT_OUTPUT_NAME, appConfiguration.configuration)
            || fileUtils.getFileName(mdFile)) + `.${HTML_EXTENSION}`;
    }

    private getTemplate(appConfiguration: AppConfiguration) {
        let templatePath = objectUtils.getAsString(
            CONFIGURATION_DOCUMENT_TEMPLATE,
            appConfiguration.configuration
        );

        let template = DEFAULT_TEMPLATE;
        if(!!templatePath) {
            try {
                template = fileUtils.readFile(appConfiguration.inputDirectory + templatePath)
            } catch (e) {
                logUtils.warn(`Template file: ${templatePath} was not found. Using default template value`);
            }
        }

        return template;
    }

    private executeScriptFiles(type: string, appConfiguration: AppConfiguration) {
        const scriptFilesToExecute = objectUtils.get(type, appConfiguration.configuration) as string[];
        scriptFilesToExecute?.forEach(scriptFile => {
            const typeOfExecution = type.split('.')[1];
            logUtils.info(`Executing ${typeOfExecution} file ${scriptFile}`);

            const regexResult = EXECUTE_SCRIPT_FILE_REGEX.exec(scriptFile);
            EXECUTE_SCRIPT_FILE_REGEX.lastIndex = 0; //Reset search index after each find out

            if(!regexResult) {
                return; //Continue
            }

            this.scriptExecutionService.loadAndExecuteScript(regexResult, false, appConfiguration);
        });
    }

    private  prettify(html: string) {
        // https://www.npmjs.com/package/js-beautify
        const beautify = require('js-beautify').html;

        return beautify(html, {
            unformatted: ['code', 'pre', 'em', 'strong', 'span'],
            indent_char: ' ',
            indent_size: 2,
            indent_inner_html: true,
            indent_empty_lines: true,
            max_preserve_newlines: 0,
            preserve_newlines: true,
        });
    }

    private minify(html: string) {
        // https://www.npmjs.com/package/@minify-html/node
        const minifyHtml = require('@minify-html/node');
        const Buffer = require('node:buffer').Buffer;

        return minifyHtml.minify(Buffer.from(html), {
            keep_spaces_between_attributes: true,
            keep_comments: true
        }).toString();
    }

    private getRelativePath(path: string,  inputDirectory: string) {
        return path.replace(inputDirectory, "");
    }
}
