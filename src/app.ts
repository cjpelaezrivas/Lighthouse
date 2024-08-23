#!/usr/bin/env node

import {
    HEADER,
    CONFIGURATION_FILE_NAME,
    DEFAULT_OUTPUT_DIRECTORY,
    CONFIGURATION_OUTPUT_DIRECTORY,
    DEBUG_FLAG,
    MINIFY_FLAG
} from "./constants";
import { AppConfiguration } from "./types/app-configuration";
import { ProcessList } from "./types/process-list";
import { ProcessorService } from "./process/processor-service";
import { fileUtils } from "./utils/file-utils";
import { objectUtils } from "./utils/object-utils";
import { validationUtils } from "./utils/validation-utils";

const pjson = require("../package.json");
(async function () {
    console.info(`${HEADER}`);
    console.info(`version ${pjson.version}\n`);

    start();
})();

function start() {
    console.info("===");
    const inputPath = getInputPath();
    const inputDirectory = getInputDirectory(inputPath);
    console.info(`INFO - input directory: ${inputDirectory}`);

    const globalConfiguration = getConfiguration(inputDirectory);
    //console.debug({globalConfiguration});

    const debug = getDebugOption();
    const minify = getMinifyOption();
    console.info(`INFO - debug: ${debug}`);
    console.info(`INFO - minify: ${minify}`);

    const fileToProcess = getFileToProcess();
    if(!!fileToProcess) {
        console.info(`INFO - fileToProcess: ${fileToProcess}`);
    }

    const outputDirectory = getOutputDirectory(
        inputDirectory,
        globalConfiguration
    );
    console.info(`INFO - output directory: ${outputDirectory}`);
    console.info("===");

    cleanOutputDirectory(outputDirectory, fileToProcess);
    const filesToProcess = getFilesToProcess(inputDirectory, fileToProcess);

    console.info(
        `INFO - Starting process... ${filesToProcess.files.length} files and ${filesToProcess.directories.length} directories found`
    );

    let appConfiguration: AppConfiguration = {
        inputDirectory,
        outputDirectory,
        appFlags: {
            debug,
            minify
        },
        configuration: globalConfiguration,
    };

    const startTime = Date.now();

    const processorService: ProcessorService = new ProcessorService(appConfiguration);
    processorService.process(filesToProcess)

    const executionTime = (Date.now() - startTime) / 1000;

    console.info("===");
    console.info(`INFO - Process finished in ${executionTime} seconds`);
    console.info(`INFO - Site generated in: ${outputDirectory}`);
}

function getInputPath() {
    let inputPath = fileUtils.convertPath(getParameter(2) || '.');
    validationUtils.checkFileExists(inputPath);

    return inputPath;
}

function getFileToProcess() {
    let fileToProcess = getParameter(3);

    if(!!fileToProcess) {
        fileToProcess = fileUtils.convertPath(fileToProcess);
        validationUtils.checkFileExists(fileToProcess);
    }

    return fileToProcess;
}

function getParameter(index: number) {
    let parameter = process.argv[index];

    if(parameter?.startsWith('--')) {
       return undefined;
    }

    return parameter;
}

function getDebugOption() {
    return process.argv.some(element => element === DEBUG_FLAG);
}

function getMinifyOption() {
    return process.argv.some(element => element === MINIFY_FLAG);
}

function getInputDirectory(path: string) {
    if (fileUtils.isFile(path)) {
        path = fileUtils.getParent(path);
    }

    return fileUtils.endPath(path);
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
        console.info(`INFO - Skipping cleaning on output directory`);
    }

    fileUtils.mkdirs(outputDirectory);
}

function getFilesToProcess(inputDirectory: string, fileToProcess: string| undefined): ProcessList {
    if (!!fileToProcess) {
        return { isDirectory: false, files: [ fileToProcess ], directories: [] };
    }

    const validFiles = fileUtils
        .listFilesIn(inputDirectory)
        .filter((file) => !fileUtils.isSystemFile(file));

    return {
        isDirectory: true,
        files: validFiles.filter((file) => fileUtils.isFile(inputDirectory + file)),
        directories: validFiles.filter((file) => !fileUtils.isFile(inputDirectory + file)
        ),
    };
}
