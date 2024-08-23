import { AppFlags } from "./app-flags";

export type AppConfiguration = {
    inputDirectory: string;
    outputDirectory: string;
    appFlags: AppFlags;
    configuration: object;
    processingFile?: {
        path: string,
        name: string,
        extension: string;
    };
}
