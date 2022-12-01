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
exports.VideoRenamerCommand = void 0;
const BasicCommand_1 = require("../../classes/BasicCommand");
// @ts-ignore
const chalk = require("chalk");
const video_renamer_1 = require("./video-renamer");
class VideoRenamerCommand extends BasicCommand_1.default {
    constructor() {
        super();
        this.module = new video_renamer_1.VideoRenamer();
    }
    register(program) {
        this.command = program.command('video-rename')
            .description('Rename Zoom video files using the Boolean pattern and eventually copy them to a specific folder like Google Drive.\n' +
            'To be able to copy the file to a folder, first that folder must be configured. To do so, just run\n' +
            chalk.yellow('boolean config video-rename --drive-folder [folder_path]'))
            .option('-r, --revert', 'Revert the rename operation.')
            .option('-u, --upload', 'Upload renamed files to Google Drive folder, if this is configured.')
            .option('-d, --dir [path]', 'Specify folder where to perform the action.')
            .action((options) => this.action(options));
    }
    action(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // writeSection('RENAME')
            let dir = typeof options.dir === 'string' ? options.dir : undefined;
            if (options.revert) {
                this.module.revert(dir);
            }
            else {
                yield this.module.rename(options.upload, dir);
            }
        });
    }
}
exports.VideoRenamerCommand = VideoRenamerCommand;
//# sourceMappingURL=video-renamer.command.js.map