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
exports.GlobalSettings = exports.ConfigCommand = void 0;
const conf_1 = require("conf");
const chalk = require("chalk");
const inquirer = require("inquirer");
class ConfigCommand {
    constructor(program) {
        GlobalSettings.init();
        //TODO:: would be nice to create settings as commands like this:
        // video-rename.videos-folder
        // video-rename.multipart-videos
        this.command = program
            .command('config')
            .description('Read and write ClI\'s settings.')
            .option('-f, --videos-folder [path]', 'Path to local sync of Google Drive video folder')
            .option('-m, --multipart-videos [bool]', 'If true, when renaming a video, will be prompted with the right name suggestion')
            .option('-a, --all', 'Read all existing settings')
            .option('-r, --reset', 'Reset and remove all existing settings')
            .action((options) => this.action(options))
            .showHelpAfterError('(add --help for additional information)');
    }
    action(options) {
        // If no options are specified, show help
        if (Object.keys(options).length === 0) {
            this.command.help();
        }
        if (options.reset) {
            GlobalSettings.reset().then();
        }
        if (options.all) {
            GlobalSettings.readAll();
        }
        if (options.videosFolder) {
            if (typeof options.videosFolder === 'string') {
                GlobalSettings.assignKeyValue('videosFolder', options.videosFolder);
            }
            else {
                GlobalSettings.readKeyValue('videosFolder');
            }
        }
        if (options.multipartVideos) {
            if (typeof options.multipartVideos === 'string') {
                GlobalSettings.assignKeyValue('multipartVideos', options.multipartVideos === 'true');
            }
            else {
                GlobalSettings.readKeyValue('multipartVideos');
            }
        }
    }
}
exports.ConfigCommand = ConfigCommand;
class GlobalSettings {
    static init() {
        this.config = new conf_1.default({
            configName: 'boolean',
            projectName: 'boolean',
            schema: this.configSchema,
            migrations: this.configMigrations
        });
    }
    static get configSchema() {
        return {
            videosFolder: {
                type: 'string'
            },
            multipartVideos: {
                type: 'boolean',
                default: false
            }
        };
    }
    static get configMigrations() {
        return {
        /*'0.0.1': store => {
          store.set('debugPhase', true)
        },
        '1.0.0': store => {
          store.delete('debugPhase')
          store.set('phase', '1.0.0')
        },
        '1.0.2': store => {
          store.set('phase', '1.0.2')
        },
        '>=2.0.0': store => {
          store.set('phase', '>=2.0.0')
        }*/
        };
    }
    static readKeyValue(key) {
        const result = this.config.get(key);
        console.log(chalk.bold(key) + ':', result);
    }
    static assignKeyValue(key, value) {
        this.config.set(key, value);
        this.readKeyValue(key);
    }
    static readAll() {
        Object.keys(this.configSchema).forEach(key => {
            const value = this.config.get(key);
            console.log(`- ${chalk.bold(key)}:`, chalk.green(value));
        });
    }
    static reset() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield inquirer.prompt([
                {
                    type: 'confirm',
                    message: 'Are you sure you want to reset all configurations? This can\'t be undone.',
                    name: 'confirm',
                    default: false
                }
            ]);
            if (result.confirm) {
                this.config.clear();
            }
        });
    }
}
exports.GlobalSettings = GlobalSettings;
//# sourceMappingURL=config.js.map