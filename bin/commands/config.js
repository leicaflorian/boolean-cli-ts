"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCommand = void 0;
const GlobalSettings_1 = require("../classes/GlobalSettings");
const video_renamer_config_command_1 = require("../modules/video-renamer/video-renamer.config.command");
class ConfigCommand {
    constructor() {
        GlobalSettings_1.GlobalSettings.init();
    }
    register(program) {
        this.command = program
            .command('config')
            .description('Read and write ClI\'s settings.')
            .option('-a, --all', 'Read all existing settings')
            .option('-r, --reset', 'Reset and remove all existing settings')
            .action((options) => this.action(options))
            .showHelpAfterError('(add --help for additional information)');
        this.videoRenameCommands = new video_renamer_config_command_1.VideoRenamerConfigCommand(this.command);
    }
    action(options) {
        // If no options are specified, show help
        if (Object.keys(options).length === 0) {
            return this.command.help();
        }
        if (options.reset) {
            return GlobalSettings_1.GlobalSettings.reset();
        }
        if (options.all) {
            return GlobalSettings_1.GlobalSettings.readAllAndPrint();
        }
    }
}
exports.ConfigCommand = ConfigCommand;
//# sourceMappingURL=config.js.map