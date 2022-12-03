"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const chalk = require("chalk");
function formatMessage(message, prefix) {
    return message.replace(/^\s{1,}/gm, ' '.repeat(prefix ? prefix.length + 3 : 0));
}
exports.default = {
    info(message, prefix) {
        let prefixString = chalk.yellow(prefix ? prefix : '[INFO]');
        if (prefix === false) {
            prefixString = ''.padStart(6, ' ');
        }
        console.info(prefixString, '-', formatMessage(message, prefixString));
    },
    log(message) {
        console.info(formatMessage(message, ''));
    },
    warn(message) {
        const prefix = '[WARN]';
        let prefixString = prefix ? chalk.yellow(prefix) : '|';
        console.info(prefixString, '-', formatMessage(message, prefix));
    },
    error(message) {
        const prefix = '[ERR]';
        let prefixString = prefix ? chalk.red(prefix) : '|';
        console.info(prefixString, '-', formatMessage(message, prefix));
    },
    warnNoFileFound(fileName) {
        console.warn(`   ![WARN]! ${fileName} not found!`);
    },
    logStarting(prefix) {
        this.info(`Processing ${prefix}...`, `[${prefix.toUpperCase()}]`);
    },
    logFileCreated(file) {
        this.info(`${chalk.cyan(file)} file created!`, false);
    }
};
//# sourceMappingURL=logs.js.map