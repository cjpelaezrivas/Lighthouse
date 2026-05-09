import vm from "vm";
import { objectUtils } from "../utils/object-utils";
import { fileUtils } from "../utils/file-utils";
import { logUtils } from "../utils/log-utils";
import { FileService } from "../files/file-service";
import { AppConfiguration } from "../types/app-configuration";
import { markdownUtils } from "../utils/markdown-utils";

export class ScriptExecutionService {

    loadAndExecuteScript(regexResult: RegExpExecArray, returnScriptOutput: boolean = true, appConfiguration: AppConfiguration) {
        let path = regexResult[1];
        let script = this.getFileContent(path, appConfiguration);
        let call = regexResult[3];
        if (!script) {
            return  returnScriptOutput && appConfiguration.appFlags.debug ?
                `##⚠ File not found: ${path}##` : "";
        }

        const scriptOutput = this.executeScript(path, script, call, appConfiguration);

        return returnScriptOutput ? scriptOutput : "";
    }

    executeScript(
        path: string,
        script: string,
        call: string = `main()`,
        appConfiguration: AppConfiguration
    ) {
        script = `${script}\n//\n${call}`;

        let context = {
            require: require,
            console: console,
            objectUtils: objectUtils,
            fileUtils: fileUtils,
            fileService: new FileService(appConfiguration.inputDirectory),
            markdownUtils: markdownUtils,
            lighthouse: appConfiguration // Not need to clone, as this configuration comes from the file processing -- Allows to modify on JS env
        };

        module.paths.unshift(appConfiguration.inputDirectory);

        this.debug(`Executing script: ${call}`, appConfiguration);
        this.debug(`context.lighthouse:`, appConfiguration);
        this.debug(JSON.stringify(context.lighthouse), appConfiguration);

        let result = undefined;
        try {
            vm.createContext(context);
            result = vm.runInContext(script, context);
        } catch (e) {
            logUtils.err(`${path}::${call}\n${e}`);
        }

        this.debug(`End of script execution`, appConfiguration);

        module.paths.shift();

        return result;
    }

    private getFileContent(path: string, appConfiguration: AppConfiguration) {
        try {
            return fileUtils.readFile(`${appConfiguration.inputDirectory}${path}`);
        } catch (exception) {
            logUtils.warn(`File not found: ${path}`);
            return "";
        }
    }

    private debug(log: string, appConfiguration: AppConfiguration) {
        if(appConfiguration.appFlags.debug) {
            logUtils.info(log);
        }
    }
}
