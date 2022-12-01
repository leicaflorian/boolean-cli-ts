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
exports.VideoRenamer = void 0;
const fs_1 = require("../../utilities/fs");
const logs_1 = require("../../utilities/logs");
const fs = require("fs");
const path = require("path");
// @ts-ignore
const chalk = require("chalk");
// @ts-ignore
const inquirer = require("inquirer");
const DriveFiles_1 = require("../../classes/DriveFiles");
const ModuleWithSettings_1 = require("../../classes/ModuleWithSettings");
class VideoRenamer extends ModuleWithSettings_1.ModuleWithSettings {
    constructor() {
        super();
        this.settingsPrefix = 'videoRename';
        this.rootFolder = (0, fs_1.getPath)();
    }
    revert(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = dir !== null && dir !== void 0 ? dir : this.rootFolder;
            const jsonFilePath = path.join(folder, '.rename.json');
            if (!fs.existsSync(jsonFilePath)) {
                logs_1.default.error('Nothing to revert.');
                return;
            }
            // read the json file
            const jsonFile = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
            const confirmRename = yield inquirer.prompt([
                {
                    name: 'confirm',
                    type: 'confirm',
                    message: 'Are you sure you want to revert the following files?' +
                        `\n   - ${jsonFile.files.map(file => `${chalk.grey(file.new)} -> ${chalk.green(file.old)}`).join('\n   - ')} `
                }
            ]);
            if (confirmRename.confirm) {
                jsonFile.files.forEach((file) => {
                    const oldPath = path.join(folder, file.old);
                    const newPath = path.join(folder, file.new);
                    if (fs.existsSync(newPath)) {
                        fs.renameSync(newPath, oldPath);
                        logs_1.default.info(`Restored file: ${chalk.grey(file.new)} -> ${chalk.green(file.old)}`);
                    }
                });
                fs.rmSync(jsonFilePath);
            }
        });
    }
    rename(mustUpload, dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = dir !== null && dir !== void 0 ? dir : this.rootFolder;
            logs_1.default.info(`Searching for video files in folder "${chalk.green(folder)}".`);
            const videoFiles = (0, fs_1.getFolderFiles)(folder, '.mp4');
            // check if the folder contains video files
            if (videoFiles.length === 0) {
                return logs_1.default.error(`Can't find any "${chalk.yellow.bold('.mp4')}" file to rename.`);
            }
            logs_1.default.info(`Found ${videoFiles.length} files: ${videoFiles.map(file => chalk.bold.green(file)).join(', ')}`);
            if (mustUpload && !this.moduleSettings.driveFolder) {
                return logs_1.default.error(chalk.red(`Cartella Google Drive non configurata.
      Per configurarla usa il comando:
      ${chalk.yellow('boolean config video-rename --drive-folder [folder_path]')}`));
            }
            const answers = yield this.promptRenameQuestions(videoFiles);
            const fileNames = this.prepareFileNames(videoFiles, answers);
            const confirmRename = yield inquirer.prompt([
                {
                    name: 'confirm',
                    type: 'confirm',
                    message: 'Confermi di voler rinominare i seguenti file?' +
                        `\n   - ${fileNames.map(file => file.formatted).join('\n   - ')} `
                }
            ]);
            if (confirmRename.confirm) {
                this.createInternalRenameDetails(fileNames, dir);
                fileNames.forEach((file) => {
                    const oldPath = path.join(folder, file.old);
                    const newPath = path.join(folder, file.new);
                    fs.renameSync(oldPath, newPath);
                    if (this.readSetting('driveFolder') && mustUpload) {
                        logs_1.default.info(`Uploading file ${chalk.green(file.new)} to Drive folder`);
                        const filePath = path.join(this.readSetting('driveFolder'), file.new);
                        fs.copyFileSync(newPath, filePath);
                        logs_1.default.info(`File uploaded to ${chalk.cyan(filePath)} `, '|    |');
                    }
                });
            }
        });
    }
    promptRenameQuestions(filesList) {
        return __awaiter(this, void 0, void 0, function* () {
            return inquirer.prompt([
                {
                    name: 'video_number',
                    message: `Specify the ${chalk.bold.green('video number')} of the ${chalk.bold.green('video')} ------------------:`,
                    type: 'number',
                    default: DriveFiles_1.DriveFiles.getVideoNumber(this.moduleSettings.driveFolder),
                    validate: (input) => {
                        if (!input || Number.isNaN(+input)) {
                            // Pass the return value in the done callback
                            return 'You need to provide a video number';
                        }
                        else {
                            return true;
                        }
                    }
                },
                {
                    name: 'video_part_number',
                    message: `Indica la ${chalk.bold.green('parte')} del ${chalk.bold.green('video')}.\n  ${chalk.italic('(Scrivere 0 in caso di parte unica)')} ---------:`,
                    type: 'number',
                    default: DriveFiles_1.DriveFiles.getVideoPart(filesList, this.moduleSettings.multipartFiles, this.moduleSettings.driveFolder),
                    transformer: (input) => {
                        return Number.isNaN(input) ? '' : input;
                    }
                },
                {
                    name: 'lesson_code',
                    message: `Indica il ${chalk.bold.green('numero')} della ${chalk.bold.green('lezione')}\n  ${chalk.italic('(Lasciare vuoto in caso non serva)')} ----------:`,
                    type: 'number',
                    transformer: (input) => {
                        return Number.isNaN(input) ? '' : input;
                    }
                },
                {
                    name: 'lesson_name',
                    message: `Indica il ${chalk.bold.green('titolo')} da assegnare alla ${chalk.bold.green('lezione')} --:`,
                    type: 'input',
                    validate: (input) => {
                        if (!input || !input.trim()) {
                            // Pass the return value in the done callback
                            return 'E\' necessario assegnare un titolo alla lezione';
                        }
                        else {
                            return true;
                        }
                    }
                }
            ]);
        });
    }
    prepareFileNames(videoFiles, answers) {
        const toRename = [];
        for (let index = 0; index < videoFiles.length; index++) {
            const file = videoFiles[index];
            const newName = this.createVideoFileName(answers, index, videoFiles.length > 1);
            toRename.push({
                old: file,
                new: newName,
                formatted: `${chalk.bold.grey(file)} -> ${chalk.bold.green(newName)}`
            });
        }
        return toRename;
    }
    createVideoFileName(answers, index, autoIncludePartNumber = false) {
        const { video_number, video_part_number, lesson_code, lesson_name } = answers;
        const date = new Intl.DateTimeFormat('it-IT', {
            day: '2-digit',
            month: 'short'
        })
            .format(new Date())
            .replace(' ', '')
            .toUpperCase();
        const newName = [];
        let videoNum = [video_number.toString().padStart(2, '0')];
        if (video_part_number) {
            videoNum.push((video_part_number + index).toString());
        }
        else if (autoIncludePartNumber) {
            videoNum.push((index + 1).toString());
        }
        newName.push(videoNum.join('_'));
        newName.push(date);
        if (lesson_code) {
            newName.push(lesson_code);
        }
        newName.push(lesson_name.toLowerCase().replace(/ /g, '_'));
        return newName.join('-') + '.mp4';
    }
    createInternalRenameDetails(filesToRename, folder) {
        fs.writeFileSync(path.join(folder, '.rename.json'), JSON.stringify({
            date: new Date(),
            files: filesToRename
        }));
    }
}
exports.VideoRenamer = VideoRenamer;
//# sourceMappingURL=video-renamer.js.map