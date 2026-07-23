class Configuration {
    constructor(key, defaultValue) {
        this.key = key;
        this.defaultValue = defaultValue;
    }
}

export const DARK_MODE = new Configuration("dark-mode", "");

export const ALL_CONFIGURATIONS = [
    DARK_MODE,
];
