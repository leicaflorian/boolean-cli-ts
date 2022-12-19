"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = exports.checkVersion = void 0;
const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const logs_1 = require("./logs");
function getVersion() {
    const version = fs.readFileSync(path.resolve(__dirname, '../version.txt'), 'utf8');
    return version;
}
exports.getVersion = getVersion;
function checkVersion() {
    logs_1.default.info('Checking for updates...', null);
    const remoteVersion = shell.exec('npm show boolean-cli version', { silent: true }).stdout.trim();
    const rawVersion = getVersion();
    const currentVersion = rawVersion.trim().replace('v', '');
    if (remoteVersion !== currentVersion) {
        logs_1.default.info(`A new version is available: ${currentVersion} -> ${remoteVersion}
                        Please run ${chalk.green('npm update boolean-cli -g')} to update.
                        ------------------------------------------------------------------\n`, '[ ‼ ]', "red");
    }
    else {
        logs_1.default.info('You are using the latest version', '[ ✓ ]', "green");
    }
    return currentVersion;
}
exports.checkVersion = checkVersion;
