const isObject = (item: any) =>
    item && typeof item === "object" && !Array.isArray(item);
const isArray = (item: any) =>
    item && typeof item === "object" && Array.isArray(item);

export const objectUtils = {
    isObject(item: any) {
        return item && typeof item === "object" && !Array.isArray(item);
    },

    isArray(item: any) {
        return item && typeof item === "object" && Array.isArray(item);
    },

    isString(item: any) {
        return (item && typeof item === "string") || item instanceof String;
    },

    getAsString(path: string, object: object) {
        const value = objectUtils.get(path, object);
        return !!value ? String(value) : value;
    },

    get(path: string, object: object, defaultValue: any = null) {
        if (!path || !object) {
            return defaultValue;
        }

        let value = object;
        const parts = path.replaceAll(/(?:\[)(\d+)(?:\])/g, ".$1").split(".");

        for (let i = 0; i < parts.length; i++) {
            value = value[parts[i] as keyof typeof value];

            if (!value) {
                return defaultValue;
            }
        }

        return value;
    },

    set(path: string, value: any, object: Record<string, any>) {
        if (!path || !object) {
            return;
        }

        let current = object;
        const parts = path.replaceAll(/(?:\[)(\d+)(?:\])/g, ".$1").split(".");

        for (let i = 0; i < parts.length; i++) {
            if (i < parts.length - 1) {
                current[parts[i]] = current[parts[i]] || {};
                current = current[parts[i]];
            } else { // Destination field
                current[parts[i]] = value;
            }
        }
    },

    parseYaml(yaml: string): object {
        if (!yaml) {
            return {};
        }

        const YAML = require("yamljs");
        return YAML.parse(yaml.trim());
    },

    deepClone(source: object) {
        // https://www.npmjs.com/package/lodash
        return require('lodash').cloneDeep(source);
    },

    deepMerge(destination: object, ...sources: object[]) {
        sources.forEach((source) => {
            if (isObject(destination) && isObject(source)) {
                for (const k in source) {
                    const key = k as keyof object;

                    if (isObject(source[key])) {
                        if (!destination[key]) {
                            Object.assign(destination, { [key]: {} });
                        }

                        this.deepMerge(destination[key], source[key]);
                        // } else if(isArray(source[key])) {
                        //     Object.assign(destination, { [key]: this.arrayDeepMerge(destination[key], source[key])});
                    } else {
                        Object.assign(destination, { [key]: source[key] });
                    }
                }
            }
        });

        return destination;
    },

    arrayDeepMerge(destination: object[], source: object[]) {
        if (!destination) {
            destination = [];
        }

        source.forEach((item, i) => {
            if (isObject(item)) {
                if (!destination[i]) {
                    destination[i] = {};
                }

                this.deepMerge(destination[i], item);
            } else if (isArray(item)) {
                destination[i] = this.arrayDeepMerge(
                    destination[i] as [],
                    item as []
                );
            } else {
                destination[i] = item;
            }
        });

        return destination;
    },

    /**
     * Gets an object and applies the given function to all the properties.
     * This function modifies the original object.
     * @param object Object whose properties are going to be modified
     * @param func Function to apply over all object properties
     * @returns The modified object
     */
    applyFunctionToProperties(object: any, func: (arg0: string) => string) {
        // const newObject = JSON.parse(JSON.stringify(object)); // Clone object to avoid modifying the original one

        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                if (isObject(object[key]) || isArray(object[key])) {
                    object[key] = this.applyFunctionToProperties(object[key], func);
                } else {
                    object[key] = func(object[key]);
                }
            }
        }

        return object;
    }
};
