import { AppFlags } from "./app-flags";

export type AppConfiguration = {
    inputDirectory: string;
    outputDirectory: string;
    appFlags: AppFlags;
    version: string;
    versionNumber: string;
    configuration: object;
    processingFile?: {
        path: string;
        name: string;
        extension: string;
        content?: string;
    };
}
