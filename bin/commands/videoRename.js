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
exports.VideoRenameCommand = void 0;
const chalk = require("chalk");
const inquirer = require("inquirer");
const fs_1 = require("../utilities/fs");
const logs_1 = require("../utilities/logs");
const BasicCommand_1 = require("../classes/BasicCommand");
const DriveFiles_1 = require("../classes/DriveFiles");
class VideoRenameCommand extends BasicCommand_1.default {
    constructor() {
        super();
        this.rootFolder = (0, fs_1.getPath)();
    }
    register(program) {
        this.command = program.command('video-rename')
            .description('Rename Zoom video files using the Boolean pattern and eventually copy them to a specific folder like Google Drive.\n' +
            'To be able to copy the file to a folder, first that folder must be configured. To do so, just run\n' +
            chalk.yellow('boolean config video-rename --drive-folder [folder_path]'))
            .option('-r, --revert', 'Revert the rename operation.')
            .option('-u, --upload', 'Upload renamed files to Google Drive folder, if this is configured.')
            .action((options) => this.action(options));
    }
    action(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // writeSection('RENAME')
            if (options.revert) {
                this.revert();
            }
            else {
                yield this.rename(options.upload);
            }
        });
    }
    revert() {
        console.log('revert');
    }
    rename(mustUpload) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoFiles = (0, fs_1.getFolderFiles)(this.rootFolder, '.mp4');
            // check if the folder contains video files
            if (videoFiles.length === 0) {
                return logs_1.default.warn(`Can\'t find any ${chalk.yellow.bold('".mp4"')} file to rename.`);
            }
            if (mustUpload) {
                //
            }
            const answers = yield this.promptRenameQuestions(videoFiles);
            console.log(answers);
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
}
exports.VideoRenameCommand = VideoRenameCommand;
//# sourceMappingURL=videoRename.js.map