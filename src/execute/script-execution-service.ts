import vm from "vm";
import { objectUtils } from "../utils/object-utils";
import { fileUtils } from "../utils/file-utils";
import { FileService } from "../files/file-service";
import { AppConfiguration } from "../types/app-configuration";
import { markdownUtils } from "../utils/markdown-utils";

export class ScriptExecutionService {

    loadAndExecuteScript(regexResult: RegExpExecArray, returnScriptOutput: boolean = true, appConfiguration: AppConfiguration) {
        let script = this.getFileContent(regexResult[1], appConfiguration);
        let call = regexResult[2];
        if (!script) {
            return  returnScriptOutput && appConfiguration.appFlags.debug ?
                `##WARN - File not found: ${regexResult[1]}##` : "";
        }

        const scriptOutput = this.executeScript(script, call, appConfiguration);

        return returnScriptOutput ? scriptOutput : "";
    }

    executeScript(
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
            lighthouse: objectUtils.deepClone(appConfiguration)
        };

        module.paths.unshift(appConfiguration.inputDirectory);

        this.debug(`DEBUG - Executing script: ${call}`, appConfiguration);
        this.debug(`DEBUG - context.lighthouse:`, appConfiguration);
        this.debug(context.lighthouse, appConfiguration);

        let result = undefined;
        try {
            vm.createContext(context);
            result = vm.runInContext(script, context);
        } catch (e) {
            console.error(e);
        }

        this.debug(`DEBUG - End of script execution`, appConfiguration);

        module.paths.shift();

        return result;
    }

    private getFileContent(path: string, appConfiguration: AppConfiguration) {
        try {
            return fileUtils.readFile(`${appConfiguration.inputDirectory}${path}`);
        } catch (exception) {
            this.warn(`WARN - File not found: ${path}`);
            return "";
        }
    }

    private debug(log: string, appConfiguration: AppConfiguration) {
        if(appConfiguration.appFlags.debug) {
            console.info(log);
        }
    }

    private warn(log: string) {
        console.warn(log);
    }
}
