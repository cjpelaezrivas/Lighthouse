import {
    VALUE_REQUIRED_EXCEPTION,
    FILE_NOT_FOUND_EXCEPTION,
    VALIDATION_EXCEPTION,
} from "../constants";
import { fileUtils } from "./file-utils";

export const validationUtils = {
    checkRequired(value: any, valueName: string) {
        if (!value) {
            throw new Error(
                `${VALUE_REQUIRED_EXCEPTION}: '${valueName}' requires to have a value`
            );
        }
    },

    checkFileExists(path: string) {
        if (!fileUtils.exists(path)) {
            throw new Error(
                `${FILE_NOT_FOUND_EXCEPTION}: '${path}' could not be found`
            );
        }
    },

    checkIsDirectory(path: string) {
        this.checkFileExists(path);

        if(fileUtils.isFile(path)) {
            throw new Error(
                `${VALIDATION_EXCEPTION}: '${path}' has to be a directory`
            );
        }
    }
};
