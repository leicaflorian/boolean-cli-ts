"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRenameCommand = void 0;
const chalk = require("chalk");
class VideoRenameCommand {
    constructor(program) {
        program.command('video-rename')
            .description('Rename Zoom video files using the Boolean pattern and eventually copy them to a specific folder like Google Drive.\n' +
            'To be able to copy the file to a folder, first that folder must be configured. To do so, just run\n' +
            chalk.yellow('boolean config -f [folder_path]'))
            .option('-r, --revert', 'Revert the rename operation.')
            .option('-u, --upload', 'Upload renamed files to Google Drive folder, if this is configured.')
            .action((options) => {
            // writeSection('RENAME')
            if (options.revert) {
                // revert()
            }
            else {
                // rename(options.upload)
            }
        });
    }
}
exports.VideoRenameCommand = VideoRenameCommand;
//# sourceMappingURL=videoRename.js.map