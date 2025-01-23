import chalk from "chalk";

const log = console.log;
const info = console.info;
const err = console.error;

let depth = 0;

export const logUtils = {
    log(output: any, ...options: string[]) {
        log(`${indentation()}${applyStyles(output, options)}`);
    },

    info(output: any, ...options: string[]) {
        info(`${indentation()}🔵 ${applyStyles(output, options)}`);
    },

    warn(output: any, ...options: string[]) {
        options.push(`yellow`);

        info(`${indentation()}🔶 ${applyStyles(output, options)}`);
    },

    err(output: (Error | any), ...options: string[]) {
        options.push(`bold`);
        options.push(`red`);

        err(`${indentation()}🟥 ${applyStyles(output instanceof Error ? output.stack : output, options)}`);
    },

    debug(output: any, ...options: string[]) {
        log(`${indentation()}🟢 ${applyStyles(output, options)}`);
    },

    success(output: any, ...options: string[]) {
        options.push(`bold`);
        options.push(`green`);

        log(`${indentation()}✔  ${applyStyles(output, options)}`);
    },

    horizontalSeparator() {
        log("――――――――――――――――――――――――――――――――――――――――――――――――――――――");
    },

    increaseIndentation() {
        depth++;
    },

    reduceIndentation() {
        depth--;
    },
};

function indentation() {
    return "⎸  ".repeat(depth);
}

function applyStyles(output: any, options: string[] = []) {
    return options.reduce((acc, style) => {
        if ((chalk as any)[style]) {
            return (chalk as any)[style](acc);
        }
        return acc;
    }, output);
}
