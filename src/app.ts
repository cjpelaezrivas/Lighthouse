#!/usr/bin/env node

import {
    APP_COMMAND,
    APP_DESCRIPTION,
    APP_VERSION_INFO,
    HEADER,
    CONFIGURATION_FILE_NAME,
    DEFAULT_OUTPUT_DIRECTORY,
    CONFIGURATION_OUTPUT_DIRECTORY,
} from "./constants";
import { AppConfiguration } from "./types/app-configuration";
import { ProcessList } from "./types/process-list";
import { ProcessorService } from "./process/processor-service";
import { fileUtils } from "./utils/file-utils";
import { objectUtils } from "./utils/object-utils";
import { validationUtils } from "./utils/validation-utils";
import { logUtils } from "./utils/log-utils";
import { OptionValues, Command } from 'commander';

const pjson = require("../package.json");
const version = pjson.version;

(async function () {

    const program = new Command()
        .name(APP_COMMAND)
        .description(APP_DESCRIPTION)
        .version(version, '-v, --version', 'output the version number')
        .argument('<source-directory-path>', 'source directory path, where _configuration.yml file is')
        .argument('[file-to-process]', '(optional) relative file path to process, does not clean the output directory')
        .option('-m, --minify', 'minify output HTML files, prettier formatter applied if not used')
        .option('-d, --debug', 'enables debug mode for verbose outputs')
        .showHelpAfterError();

    program.parse();
    start(program.args, program.opts());
})();

function start(args: string[], options: OptionValues) {
    logUtils.log(`${HEADER}`);
    logUtils.log(`version ${version}\n`);
    logUtils.horizontalSeparator();

    const inputDirectory = getInputDirectory(args);
    logUtils.info(`input directory: ${inputDirectory}`);

    const globalConfiguration = getConfiguration(inputDirectory);

    const outputDirectory = getOutputDirectory(inputDirectory, globalConfiguration);
    logUtils.info(`output directory: ${outputDirectory}`);

    const debug = !!options.debug;
    const minify = !!options.minify;
    logUtils.info(`debug: ${debug}`);
    logUtils.info(`minify: ${minify}`);
    logUtils.horizontalSeparator();

    const [inputFile, isFile] = getInputFile(inputDirectory, args);
    cleanOutputDirectory(outputDirectory, inputFile);
    const filesToProcess = getFilesToProcess(inputDirectory, inputFile, isFile);

    logUtils.info(
        `Starting process... ${filesToProcess.files.length} files and ${filesToProcess.directories.length} directories found`
    );

    let appConfiguration: AppConfiguration = {
        inputDirectory,
        outputDirectory,
        appFlags: {
            debug,
            minify
        },
        version: `${APP_VERSION_INFO}-${version}`,
        versionNumber: version,
        configuration: globalConfiguration,
    };

    const startTime = Date.now();

    const processorService: ProcessorService = new ProcessorService(appConfiguration);
    processorService.process(filesToProcess)

    const executionTime = (Date.now() - startTime) / 1000;

    logUtils.horizontalSeparator();
    logUtils.success(`Process finished in ${executionTime} seconds`);
    logUtils.success(`Site generated in: ${outputDirectory}`);
    logUtils.horizontalSeparator();
}

function getInputDirectory(args: string[]){
    let inputPath = args[0];
    validationUtils.checkIsDirectory(inputPath);

    return fileUtils.endPath(fileUtils.convertPath(inputPath));
}

function getInputFile(inputDirectory: string, args: string[]): [string | undefined , boolean] {
    let inputFile = args[1];

    if (!inputFile) {
        return [undefined, false];
    }

    inputFile = fileUtils.convertPath(inputFile);
    validationUtils.checkFileExists(inputDirectory + inputFile);

    logUtils.info(`Processing input: ${inputFile}`);

    return [ inputFile, fileUtils.isFile(inputDirectory + inputFile) ];
}

function getConfiguration(inputDirectory: string): object {
    const configurationFile = inputDirectory + CONFIGURATION_FILE_NAME;

    return fileUtils.exists(configurationFile)
        ? fileUtils.readYmlFile(configurationFile)
        : {};
}

function getOutputDirectory(inputDirectory: string, configuration: any) {
    const outputPath = objectUtils.getAsString(CONFIGURATION_OUTPUT_DIRECTORY, configuration) || DEFAULT_OUTPUT_DIRECTORY;

    return fileUtils.endPath(inputDirectory + outputPath);
}

function cleanOutputDirectory(outputDirectory: string, fileToProcess: string | undefined) {
    if (!fileToProcess) {
        fileUtils.remove(outputDirectory);
    } else {
        logUtils.info(`Skipping cleaning output directory`);
    }

    fileUtils.mkdirs(outputDirectory);
}

function getFilesToProcess(inputDirectory: string, fileToProcess: string | undefined, isFile: boolean): ProcessList {
    if (!!fileToProcess) {
        return {
            isProcessingDirectory: false,
            files: isFile ? [ fileToProcess ] : [] ,
            directories: !isFile ? [ fileToProcess ] : []
        };
    }

    const validFiles = fileUtils
        .listFilesIn(inputDirectory)
        .filter((file) => !fileUtils.isSystemFile(file));

    return {
        isProcessingDirectory: true,
        files: validFiles.filter((file) => fileUtils.isFile(inputDirectory + file)),
        directories: validFiles.filter((file) => !fileUtils.isFile(inputDirectory + file))
    };
}
