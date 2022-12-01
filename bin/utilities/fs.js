"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderFiles = exports.getPath = exports.prepareFileName = exports.makeFolder = exports.readTemplate = void 0;
const path = require("path");
const fs = require("fs");
// @ts-ignore
const Mustache = require("mustache");
/**
 * Reaad a template and render it with mustache syntax and data
 *
 * @param {string} file
 * @param {{}} data
 *
 * @return {string}
 */
function readTemplate(file, data = {}) {
    const templatePath = path.resolve(__dirname, '../templates/' + file);
    let tmpl = fs.readFileSync(templatePath, 'utf-8');
    if (data) {
        tmpl = Mustache.render(tmpl, data);
    }
    return tmpl;
}
exports.readTemplate = readTemplate;
/**
 * Create a folder if this does not exist
 *
 * @param {string} folder
 */
function makeFolder(folder) {
    if (!folder) {
        return;
    }
    const cssFolderPath = path.resolve(folder);
    if (!fs.existsSync(cssFolderPath)) {
        fs.mkdirSync(cssFolderPath);
    }
}
exports.makeFolder = makeFolder;
/**
 *
 * @param {string} name
 * @param {string} extension
 * @param {string|null} defaultName
 */
function prepareFileName(name, extension, defaultName = null) {
    var _a;
    let fileName = (_a = name !== null && name !== void 0 ? name : defaultName) !== null && _a !== void 0 ? _a : '';
    if (!fileName.endsWith('.' + extension)) {
        fileName += '.' + extension;
    }
    return fileName;
}
exports.prepareFileName = prepareFileName;
function getPath(...pathSections) {
    return path.resolve(...pathSections);
}
exports.getPath = getPath;
/**
 * Get all files from a folder
 * @param {string} folder
 * @param {string} extension
 */
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
//# sourceMappingURL=fs.js.map