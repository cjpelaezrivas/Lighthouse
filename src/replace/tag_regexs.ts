const ANY_EXTENSION_REGEX = "[^\\.\\:]+?";

export type RegexObject = {
    regex: RegExp;
    function: Function;
};

export type RegexResult = {
    regexName: string;
    regexResult: RegExpExecArray;
};

export const FOREACH_TAG_REGEX = /(?:{{foreach\s([^\s]+?)\s([^\s]+?)}})(.*?)(?:{{foreach-end(?:\s(?:\2))}})/gs;
export const FOREACH_REGEX     = /(?:{{foreach\s([^\s]+?)\s([^\s]+?)}})((?:(?!{{foreach).)*?)(?:{{foreach-end}})/gs;
export const IF_REGEX          = /(?:{{if\s([^\s]+?)}})((?:(?!{{if).)*?)(?:{{if-else}}((?:(?!{{if).)*?))?(?:{{if-end(?:\s(?:\1))?}})/gs;
export const IGNORE_REGEX      = /(?:{{ignore}})((?:(?!{{ignore}}).)*?)(?:{{ignore-end}})/gs;
export const VARIABLE_REGEX    = /(?!{{(?:if-(?:else|end)|foreach-end|ignore-end)}}){{([^\s]*?)}}/gs;

export const INCLUDE_REGEX = function(extension?: string) {
    return new RegExp(`(?:{{i(?:nclude)?\\s)((?:(?!{{).)+?(?:\\.(${getExtensionRegex(extension)}))?)(?:}})`, 'gs')
};

export const GENERATE_REGEX = function(extension?: string) {
    return new RegExp(`(?:{{g(?:enerate)?\\s)((?:(?!{{).)+?(?:\\.(${getExtensionRegex(extension)}))?)(?:::([^\\}]+?))?(?:}})`, 'gs')
};

function getExtensionRegex(ext?: string) {
    return ext ? `${ext.toLowerCase()}|${ext.toUpperCase()}` : ANY_EXTENSION_REGEX;
}