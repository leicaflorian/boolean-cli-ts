"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRenamerConfigCommand = void 0;
const GlobalSettings_1 = require("../../classes/GlobalSettings");
const chalk = require("chalk");
const fs = require("fs");
const logs_1 = require("../../utilities/logs");
class VideoRenamerConfigCommand {
    constructor(program) {
        this.command = program.command('video-rename')
            .description('Settings for video-rename command')
            .option('-s, --show-all', 'Read all existing settings for video-rename command')
            .option('--drive-folder [path]', 'Path to local sync of Google Drive video folder')
            .option('--multipart-files [bool]', 'If true, when renaming a video, will be prompted with the right name suggestion')
            .action((options) => this.action(options));
    }
    action(options) {
        if (Object.keys(options).length === 0) {
            this.command.help();
        }
        const prefix = 'videoRename';
        if (options.showAll) {
            return GlobalSettings_1.GlobalSettings.readAllAndPrint(prefix);
        }
        Object.keys(options).forEach((key) => {
            let result;
            if (typeof options[key] === 'string') {
                let value = options[key];
                if (key === 'multipartFiles') {
                    value = value === 'true';
                }
                result = GlobalSettings_1.GlobalSettings.assignKeyValue(prefix + '.' + key, value);
                if (key === 'driveFolder' && !fs.existsSync(result)) {
                    logs_1.default.error(`The folder "${chalk.red(result)}" does not exist.`);
                    GlobalSettings_1.GlobalSettings.assignKeyValue(prefix + '.' + key, '');
                    return;
                }
            }
            else {
                result = GlobalSettings_1.GlobalSettings.readKeyValue(prefix + '.' + key);
            }
            logs_1.default.info(chalk.cyan(key) + ': ' + (chalk.green(result) || chalk.italic('undefined')));
        });
    }
}
exports.VideoRenamerConfigCommand = VideoRenamerConfigCommand;
