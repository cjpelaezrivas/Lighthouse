export type RegexObject = {
    regex: RegExp;
    function: Function;
};

export type RegexResult = {
    regexName: string;
    regexResult: RegExpExecArray;
};

export const FOREACH_TAG = /(?:{{foreach\s([^\s]+?)\s([^\s]+?)}})(?:\s+?)?(.*?)(?:\s+?)?(?:{{foreach-end(?:\s(?:\2))}})/gs;
export const FOREACH =     /(?:{{foreach\s([^\s]+?)\s([^\s]+?)}})(?:\s+?)?((?:(?!{{foreach).)*?)(?:\s+?)?(?:{{foreach-end}})/gs;
export const IF_TAG =      /(?:{{if\s([^\s]+?)}})(?:\s+?)?((?:(?!{{if).)*?)(?:\s+?)?(?:{{if-else}}(?:\s+?)?((?:(?!{{if).)*?)(?:\s+?)?)?(?:{{if-end(?:\s(?:\1))}})/gs;
export const IF =          /(?:{{if\s([^\s]+?)}})(?:\s+?)?((?:(?!{{if).)*?)(?:\s+?)?(?:{{if-else}}(?:\s+?)?((?:(?!{{if).)*?)(?:\s+?)?)?(?:{{if-end}})/gs;
export const VARIABLE =    /(?!{{(?:if-(?:else|end)|foreach-end)}}){{([^\s]*?)}}/gs;
export const INCLUDE =     /(?:{{i(?:nclude)?\s)((?:(?!{{).)+?)(?:}})/gs;
export const GENERATE =    /(?:{{g(?:enerate)?\s)((?:(?!{{).)+?)(?:::(.+?))?(?:}})/;
