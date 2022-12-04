"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSection = exports.writeMainLogo = void 0;
const chalk = require('chalk');
const mainLogo = `
   ____              _                     ____ _     ___
  | __ )  ___   ___ | | ___  __ _ _ __    / ___| |   |_ _|
  |  _ \\ / _ \\ / _ \\| |/ _ \\/ _\` | '_ \\  | |   | |    | |
  | |_) | (_) | (_) | |  __/ (_| | | | | | |___| |___ | |
  |____/ \\___/ \\___/|_|\\___|\\__,_|_| |_|  \\____|_____|___|
  `;
function writeMainLogo() {
    console.log(chalk.yellow(mainLogo));
}
exports.writeMainLogo = writeMainLogo;
function writeSection(section) {
    const length = 60;
    const sectionTitle = ` ${section.trim()} `;
    const padLength = (length - sectionTitle.length) / 2;
    const padText = '*'.repeat(padLength);
    const text = padText + sectionTitle + padText;
    console.log('\n', text, '\n');
}
exports.writeSection = writeSection;
