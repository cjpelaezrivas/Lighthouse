import chalk from "chalk";

const log = console.log;
const info = console.info;
const err = console.error;

let indentationDepth = 0;

export const logUtils = {
    log(msg: any, ...options: string[]) {
       let output = indentAdditionalLines(msg);
        log(`${indentation()}${applyStyles(output, options)}`);
    },

    info(msg: any, ...options: string[]) {
        let output = indentAdditionalLines(msg);
        info(`${indentation()}🔵 ${applyStyles(output, options)}`);
    },

    warn(msg: any, ...options: string[]) {
        options.push(`yellow`);

        let output = indentAdditionalLines(msg);
        info(`${indentation()}🔶 ${applyStyles(output, options)}`);
    },

    err(msg: (Error | any), ...options: string[]) {
        options.push(`bold`);
        options.push(`red`);

        let output = String(msg instanceof Error && !!msg.stack ? msg.stack : msg);
        output = indentAdditionalLines(output);

        err(`${indentation()}🟥 ${applyStyles(output, options)}`);
    },

    debug(msg: any, ...options: string[]) {
        let output = indentAdditionalLines(msg);
        log(`${indentation()}🟢 ${applyStyles(output, options)}`);
    },

    success(msg: any, ...options: string[]) {
        options.push(`bold`);
        options.push(`green`);

        let output = indentAdditionalLines(msg);
        log(`${indentation()}✔  ${applyStyles(output, options)}`);
    },

    horizontalSeparator() {
        log("――――――――――――――――――――――――――――――――――――――――――――――――――――――");
    },

    increaseIndentation() {
        indentationDepth++;
    },

    reduceIndentation() {
        indentationDepth--;
    },
};

function indentAdditionalLines(output: string) {
    return output.replaceAll("\n", `\n${indentation()}`);
}

function indentation(depth: number = indentationDepth) {
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
