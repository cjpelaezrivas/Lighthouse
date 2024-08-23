import { fileUtils } from "../utils/file-utils";
import { markdownUtils } from "../utils/markdown-utils";

export class FileService {
    private rootPath: string;

    constructor(rootPath: string = "") {
        this.rootPath = rootPath;
    }

    exists(path: string) {
        return fileUtils.exists(this.getCompletePath(path));
    }

    readFile(path: string) {
        return fileUtils.readFile(this.getCompletePath(path));
    }

    writeFile(path: string, content: string) {
        fileUtils.writeFile(this.getCompletePath(path), content);
    }

    copyFile(originalPath: string, destinationPath: string) {
        fileUtils.copyFile(this.getCompletePath(originalPath), this.getCompletePath(destinationPath));
    }

    listFiles(path: string) {
        return fileUtils.listFilesIn(this.getCompletePath(path));
    }

    getMetadata(path: string) {
        return markdownUtils.getMetadata(this.getCompletePath(path));
    }

    getBody(path: string) {
        return markdownUtils.getBody(this.getCompletePath(path));
    }

    private getCompletePath(path: string) {
        return `${this.rootPath}/${path}`;
    }
}
