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
    CONFIGURATION_OUTPUT_EXECUTE_BEFORE_ALL,
    CONFIGURATION_OUTPUT_EXECUTE_BEFORE_EACH,
    CONFIGURATION_OUTPUT_EXECUTE_AFTER_EACH,
    CONFIGURATION_OUTPUT_EXECUTE_AFTER_ALL,
    PROCESSING_FILE_PATH_FIELD,
    PROCESSING_FILE_NAME_FIELD,
    PROCESSING_FILE_EXTENSION_FIELD
} from "../constants";
import { AppConfiguration } from "../types/app-configuration";
import { ProcessList } from "../types/process-list";
import { objectUtils } from "../utils/object-utils";
import { fileUtils } from "../utils/file-utils";
import { markdownUtils } from "../utils/markdown-utils";
import { MarkdownRenderer } from "../content/markdown-renderer";
import { HtmlService } from "../content/html-service";
import { TocService } from "../content/toc-service";
import { TagReplacerService } from "../replace/tag-replace-service";
import { IgnoreFileService } from "../files/ignore-file-service";
import { ScriptExecutionService} from "../execute/script-execution-service";
import { MDTagReplacerService } from "../replace/md-tag-replace-service";

export class ProcessorService {

    private appConfiguration: AppConfiguration;
    private ignoreFileService: IgnoreFileService;
    private tocService: TocService = new TocService();
    private htmlService: HtmlService = new HtmlService();
    private markdownRenderer: MarkdownRenderer = new MarkdownRenderer();
    private mdTagReplacerService: MDTagReplacerService = new MDTagReplacerService();
    private tagReplacerService: TagReplacerService = new TagReplacerService();
    private scriptExecutionService: ScriptExecutionService = new ScriptExecutionService();

    constructor(appConfiguration: AppConfiguration) {
        this.appConfiguration = appConfiguration;
        this.ignoreFileService = new IgnoreFileService(appConfiguration);
    }

    process(filesToProcess: ProcessList) {
        this.executeScriptFiles(CONFIGURATION_OUTPUT_EXECUTE_BEFORE_ALL, this.appConfiguration.configuration);

        filesToProcess.files.forEach((fileName) => {
            const file = this.appConfiguration.inputDirectory + fileName;
            this.processFile(file);
        });

        filesToProcess.directories.forEach((directoryName) => {
            this.processDirectory(directoryName);
        });

        this.executeScriptFiles(CONFIGURATION_OUTPUT_EXECUTE_AFTER_ALL, this.appConfiguration.configuration);

        if(filesToProcess.isDirectory) {
            this.processFilesToCopy();
        }
    }

    private processFile(file: string) {
        if(this.ignoreFileService.checkIfHasToIgnore(file)) {
            console.log(`INFO - Ignoring file ${file}`);
            return;
        }

        const extension = fileUtils.getFileExtension(file).toLowerCase();

        if (extension === MD_EXTENSION) {
            console.log(`INFO - Processing ${extension} file: ${file}`);
            try {
                this.processMarkdownFile(file);
            } catch(err) {
                console.error(err);
            }
        } else {
            console.log(`INFO - Copying ${extension} file: ${file}`);
            this.processOtherFile(file);
        }
    }

    private processDirectory(directoryName: string) {
        if(this.ignoreFileService.checkIfHasToIgnore(directoryName)) {
            console.log(`INFO - Ignoring directory ${directoryName}`);
            return;
        }

        const directory = fileUtils.endPath(
            this.appConfiguration.inputDirectory + directoryName
        );
        const listOfFiles = fileUtils.listFilesIn(directory)
            .filter((file) => !fileUtils.isSystemFile(file));

        console.log(`INFO - Processing directory ${directory} (${listOfFiles.length} file(s) found)`);

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
                console.log(`Not possible to include file ${origin}. File not found`);
                return;
            }

            console.log(`INFO - Copying file ${origin} to ${destination}`);
            fileUtils.copyFile(originFile, destinationFile);
        });
    }

    private processMarkdownFile(mdFile: string) {
        this.setProcessingFile(mdFile);

        let [metadata, mdBody] = markdownUtils.splitMetadataAndBody(mdFile);
        const appConfigurationMerged = this.mergeMetadataIntoAppConfiguration(metadata);

        this.executeScriptFiles(CONFIGURATION_OUTPUT_EXECUTE_BEFORE_EACH, appConfigurationMerged.configuration);

        const destinationPath = this.getDestinationFilePath(mdFile, appConfigurationMerged);
        const destinationFile = this.getDestinationFileName(mdFile, appConfigurationMerged);
        const template = this.getTemplate(appConfigurationMerged);

        mdBody = this.tocService.includeTocIfEnabled(mdBody, appConfigurationMerged);
        mdBody = this.mdTagReplacerService.replace(mdBody, appConfigurationMerged);
        let rendererBody = this.markdownRenderer.configure(appConfigurationMerged).render(mdBody);
        rendererBody = this.tocService.extractTocIfExists(rendererBody, appConfigurationMerged);

        let rawHtml = this.joinTemplateAndBody(template, rendererBody);
        rawHtml = this.htmlService.preprocessRawHtml(rawHtml);

        if(appConfigurationMerged.appFlags.debug) {
            const joinFile = fileUtils.getFileName(destinationFile) + `_join` + `.${HTML_EXTENSION}`;
            fileUtils.writeFile(destinationPath + joinFile, rawHtml);
        }

        rawHtml = this.tagReplacerService.replace(rawHtml, appConfigurationMerged);
        rawHtml = this.htmlService.postProcessRawHtml(rawHtml);

        if(appConfigurationMerged.appFlags.debug) {
            const rawFile = fileUtils.getFileName(destinationFile) + `_raw` + `.${HTML_EXTENSION}`;
            fileUtils.writeFile(destinationPath + rawFile, rawHtml);
        }

        const formattedHtml = appConfigurationMerged.appFlags.minify ? this.minify(rawHtml) : this.prettify(rawHtml);


        fileUtils.writeFile(destinationPath + destinationFile, formattedHtml);

        this.executeScriptFiles(CONFIGURATION_OUTPUT_EXECUTE_AFTER_EACH, appConfigurationMerged.configuration);
        this.unsetProcessingFile();
    }

    private setProcessingFile(mdFile:string) {
        //Used on external scripts
        this.appConfiguration.processingFile = {
            path: mdFile,
            name: fileUtils.getFileName(mdFile),
            extension: fileUtils.getFileExtension(mdFile).toLocaleLowerCase()
        };

        //Used on tags replacements
        this.setInConfiguration(PROCESSING_FILE_PATH_FIELD, this.appConfiguration.processingFile.path);
        this.setInConfiguration(PROCESSING_FILE_NAME_FIELD, this.appConfiguration.processingFile.name);
        this.setInConfiguration(PROCESSING_FILE_EXTENSION_FIELD, this.appConfiguration.processingFile.extension);
    }

    private setInConfiguration(field: string, value: string) {
        objectUtils.set(field, value, this.appConfiguration.configuration);
    }

    private unsetProcessingFile() {
        delete this.appConfiguration.processingFile;

        this.deleteFromConfigurationIfExist(PROCESSING_FILE_PATH_FIELD);
        this.deleteFromConfigurationIfExist(PROCESSING_FILE_NAME_FIELD);
        this.deleteFromConfigurationIfExist(PROCESSING_FILE_EXTENSION_FIELD);
    }

    private deleteFromConfigurationIfExist(field: string) {
        if (field in this.appConfiguration.configuration) {
            delete this.appConfiguration.configuration[field as keyof Object];
        }
    }

    private mergeMetadataIntoAppConfiguration(metadata: object) {
        const appConfigurationMerged = objectUtils.deepClone(this.appConfiguration);
        appConfigurationMerged.configuration = objectUtils.deepMerge(appConfigurationMerged.configuration, metadata);

        return this.replaceTagsInConfiguration(appConfigurationMerged);
    }

    private replaceTagsInConfiguration(appConfigurationMerged: AppConfiguration) {
        return objectUtils.applyFunctionToProperties(
            appConfigurationMerged,
            value => this.tagReplacerService.replace(value, appConfigurationMerged));
    }

    private joinTemplateAndBody(template: string, body: string) {
        return template.replaceAll(BODY_TAG_REGEX, body);
    }

    private getDestinationFileName(mdFile: string, appConfiguration: AppConfiguration) {
        return (objectUtils.get(CONFIGURATION_DOCUMENT_OUTPUT_NAME, appConfiguration.configuration)
            || fileUtils.getFileName(mdFile)) + `.${HTML_EXTENSION}`;
    }

    private getDestinationFilePath(mdFile: string, appConfiguration: AppConfiguration) {
        let path = objectUtils.get(CONFIGURATION_DOCUMENT_OUTPUT_PATH, appConfiguration.configuration);

        if(!!path) {
            path = appConfiguration.outputDirectory + path;
        } else {
            path =  this.convertToOutputPath(fileUtils.getParent(mdFile), appConfiguration);
        }

        return fileUtils.endPath(path);
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
                console.warn(`WARN - Template file: ${templatePath} was not found. Using default template value`);
            }
        }

        return template;
    }

    private executeScriptFiles(type: string, configuration: object) {
        const scriptFilesToExecute = objectUtils.get(type, configuration) as string[];

        scriptFilesToExecute?.forEach(scriptFile => {
            const typeOfExecution = type.split('.')[2];
            console.log(`INFO - Executing ${typeOfExecution} file ${scriptFile}`);

            const regexResult = EXECUTE_SCRIPT_FILE_REGEX.exec(scriptFile);
            EXECUTE_SCRIPT_FILE_REGEX.lastIndex = 0; //Reset search index after each find out

            if(!regexResult) {
                return; //Continue
            }

            this.scriptExecutionService.loadAndExecuteScript(regexResult, false, this.appConfiguration);
        });
    }

    private  prettify(html: string) {
        // https://www.npmjs.com/package/pretty
        const pretty = require('pretty');

        return pretty(html, {
            ocd: true
        });
    }

    private minify(html: string) {
        // https://www.npmjs.com/package/html-minifier
        const minify = require('html-minifier').minify;

        return minify(html, {
            removeAttributeQuotes: true
        });
    }

    /**
     * Process of any not MD file is to be copied to the output directory
     */
    private processOtherFile(originalFile: string) {
        const destinationFile = this.convertToOutputPath (originalFile, this.appConfiguration);
        fileUtils.copyFile(originalFile, destinationFile);
    }

    private convertToOutputPath(file: string, appConfiguration: AppConfiguration) {
        return file.replace(
            appConfiguration.inputDirectory,
            appConfiguration.outputDirectory
        );
    }
}
