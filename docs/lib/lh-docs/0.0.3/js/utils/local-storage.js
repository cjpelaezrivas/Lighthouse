export function getValue(configuration) {
    return localStorage.getItem(configuration.key) || configuration.defaultValue;
}

export function setValue(configuration, value) {
    return localStorage.setItem(configuration.key, value);
}
