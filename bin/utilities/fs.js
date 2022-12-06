"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = exports.writeToFile = exports.copyFolderFromTemplates = exports.copyFromTemplates = exports.getWorkingFolderName = exports.getFolderFiles = exports.getPath = exports.prepareTitle = exports.prepareFileName = exports.makeFolder = exports.readTemplate = void 0;
const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");
const Mustache = require("mustache");
const inquirer = require("inquirer");
const chalk = require("chalk");
const lodash_1 = require("lodash");
function readTemplate(file, data = {}) {
    const templatePath = path.resolve(__dirname, '../templates/' + file);
    let tmpl = fs.readFileSync(templatePath, 'utf-8');
    if (data) {
        tmpl = Mustache.render(tmpl, data);
    }
    return tmpl;
}
exports.readTemplate = readTemplate;
function makeFolder(folder) {
    if (!folder) {
        return;
    }
    const folderPath = path.resolve(folder);
    fsExtra.ensureDirSync(folderPath);
    return folderPath;
}
exports.makeFolder = makeFolder;
function prepareFileName(name, extension, defaultName = null, dir) {
    var _a;
    let fileName = (_a = name !== null && name !== void 0 ? name : defaultName) !== null && _a !== void 0 ? _a : '';
    if (!fileName.endsWith('.' + extension)) {
        fileName += '.' + extension;
    }
    if (dir) {
        fileName = path.resolve(dir, fileName);
    }
    return fileName;
}
exports.prepareFileName = prepareFileName;
function prepareTitle(dest, fileName) {
    const toReturn = [];
    const folderName = getWorkingFolderName(dest);
    toReturn.push((0, lodash_1.startCase)(folderName));
    if (fileName) {
        toReturn.push((0, lodash_1.startCase)(fileName));
    }
    return toReturn.join(' | ');
}
exports.prepareTitle = prepareTitle;
function getPath(...pathSections) {
    return path.resolve(...pathSections);
}
exports.getPath = getPath;
function getFolderFiles(folder, extension = null) {
    return fs.readdirSync(folder).reduce((acc, file) => {
        const ext = path.extname(file);
        if (!extension || (extension && ext === extension)) {
            acc.push(file);
        }
        return acc;
    }, []);
}
exports.getFolderFiles = getFolderFiles;
function getWorkingFolderName(dir) {
    return dir !== null && dir !== void 0 ? dir : path.basename(process.cwd());
}
exports.getWorkingFolderName = getWorkingFolderName;
function copyFromTemplates(from, to, destination = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const fromPath = path.resolve(__dirname, '../templates/' + from);
        const destPath = path.resolve(destination, to);
        fsExtra.copySync(fromPath, destPath, {
            overwrite: yield askIfOverwrite(destPath)
        });
    });
}
exports.copyFromTemplates = copyFromTemplates;
function copyFolderFromTemplates(from, to, destination = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const fromPath = path.resolve(__dirname, '../templates/' + from);
        const filesList = fs.readdirSync(fromPath);
        const copiedFiles = [];
        yield Promise.all(filesList.map((file) => __awaiter(this, void 0, void 0, function* () {
            const toPath = to + '/' + file;
            copiedFiles.push(toPath);
            return copyFromTemplates(from + '/' + file, toPath, destination);
        })));
        return copiedFiles;
    });
}
exports.copyFolderFromTemplates = copyFolderFromTemplates;
function writeToFile(fileName, content, destination = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const destPath = path.resolve(destination, fileName);
        const eventuallyOverwrite = yield askIfOverwrite(destPath);
        if (eventuallyOverwrite) {
            fsExtra.outputFileSync(destPath, content);
            return true;
        }
        else {
            return false;
        }
    });
}
exports.writeToFile = writeToFile;
function askIfOverwrite(destPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(destPath)) {
            const result = yield inquirer.prompt({
                type: 'confirm',
                name: 'overwrite',
                message: `File '${chalk.red(destPath)}' already exists. Do you want to overwrite it?`
            });
            return result.overwrite;
        }
        return true;
    });
}
function getVersion() {
    const version = fs.readFileSync(path.resolve(__dirname, '../version.txt'), 'utf8');
    return version;
}
exports.getVersion = getVersion;
