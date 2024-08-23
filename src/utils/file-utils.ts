import fs from "fs-extra";

const PATH_SEPARATOR = "/";
const EXTENSION_SEPARATOR = ".";

export const fileUtils = {
    getPathSeparator() {
        return PATH_SEPARATOR;
    },

    convertPath(path: string) {
        return path.replaceAll("\\", PATH_SEPARATOR) ;
    },

    exists(path: string) {
        return fs.existsSync(path);
    },

    isFile(path: string) {
        const stat = fs.lstatSync(path);
        return stat.isFile();
    },

    isSystemFile(file: string) {
        return file.startsWith("_") || file.startsWith(".");
    },

    endPath(path: string) {
        return path.endsWith(PATH_SEPARATOR) ? path : `${path}${PATH_SEPARATOR}`;
    },

    mkdirs(directory: string) {
        fs.mkdirsSync(directory);
    },

    remove(path: string) {
        fs.removeSync(path);
    },

    readFile(filePath: string, codification: BufferEncoding = "utf8") {
        return fs.readFileSync(filePath, codification);
    },

    readYmlFile(filePath: string) {
        try {
            const YAML = require("yamljs");
            return YAML.load(filePath);
        } catch (error) {
            throw new Error(error as string);
        }
    },

    writeFile(
        path: string,
        content: string,
        codification: BufferEncoding = "utf8"
    ) {
        this.mkdirs(this.getParent(path));
        fs.writeFileSync(path, content, codification);
    },

    /**
     * Returns the parent path of the file/directory passed in the parameters
     */
    getParent(path: string) {
        return path.substring(0, path.lastIndexOf(PATH_SEPARATOR) + 1);
    },

    /**
     * Returns the name of the file passed in the parameters without the extension
     */
    getFileName(path: string) {
        return path.substring(path.lastIndexOf(PATH_SEPARATOR) + 1, path.lastIndexOf(EXTENSION_SEPARATOR));
    },

    getFileExtension(path: string) {
        return path.substring(path.lastIndexOf(EXTENSION_SEPARATOR) + 1);
    },

    /**
     * Returns the name of the file passed in the parameters including the extension
     */
    getFile(path: string) {
        return path.substring(path.lastIndexOf(PATH_SEPARATOR) + 1);
    },

    copyFile(
        originalFile: string,
        destinationFile: string,
        options: Object = { overwrite: true }
    ) {
        fs.copySync(originalFile, destinationFile, options);
    },

    listFilesIn(directory: string) {
        return fs.readdirSync(directory);
    },
};
