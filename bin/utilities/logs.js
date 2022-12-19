"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function formatMessage(message, prefix) {
    return message.replace(/^\s{1,}/gm, ' '.repeat(prefix ? prefix.length + 3 : 0));
}
exports.default = {
    info(message, prefix, color) {
        let rawPrefix = prefix ? prefix.toString() : '[INFO]';
        if (prefix === false) {
            rawPrefix = ''.padStart(6, ' ');
        }
        let prefixString = chalk[color !== null && color !== void 0 ? color : 'yellow'](prefix ? prefix : '[INFO]');
        console.info(prefixString, '-', formatMessage(message, rawPrefix));
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
