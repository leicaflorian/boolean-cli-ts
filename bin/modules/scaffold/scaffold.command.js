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
exports.ScaffoldCommand = void 0;
const BasicCommand_1 = require("../../classes/BasicCommand");
const scaffold_1 = require("./scaffold");
const logs_1 = require("../../utilities/logs");
const chalk = require("chalk");
const fs_1 = require("../../utilities/fs");
const ui_1 = require("../../utilities/ui");
class ScaffoldCommand extends BasicCommand_1.default {
    constructor() {
        super();
        this.module = new scaffold_1.Scaffold();
    }
    register(program) {
        this.command = program.command('scaffold')
            .description('Create basic scaffold for different projects.')
            .argument('[string]', 'file title', null)
            .usage('[file_name] [option] [value]')
            .option('-a, --all', 'Basic HTML, CSS and Imgs')
            .option('-h, --html [fileName]', 'Basic HTML (default: index.html)')
            .option('-c, --css [fileName]', 'Basic CSS (default: style.css)')
            .option('-j, --js [fileName]', 'Basic JS (default: main.js)')
            .option('-i, --img', 'Basic Imgs')
            .option('-r, --readme [fileName]', 'Readme file')
            .option('-d, --dir [path]', 'Specify folder where to perform the action.')
            .showHelpAfterError()
            .action((...args) => this.action(args[0], args[1]));
    }
    action(fileName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, ui_1.writeSection)('Scaffold');
            logs_1.default.info(`Working in folder "${chalk.green((0, fs_1.getWorkingFolderName)(options.dir))}".\n`);
            const keysToAvoidForWizard = ['all', 'html', 'css', 'js', 'readme', 'img'];
            if (!Object.keys(options).some(key => keysToAvoidForWizard.includes(key))) {
                const wizardResult = yield this.module.showWizard();
                wizardResult.filesToCreate.forEach(file => {
                    options[file] = wizardResult[`${file}FileName`] || true;
                });
            }
            let cdnLibraries;
            if (options.html || options.all) {
                cdnLibraries = yield this.module.askForCDNLibraries();
                yield this.module.html(options.dir, {
                    fileName: typeof options.html === 'string' ? options.html : fileName,
                    cssFileName: typeof options.css === 'string' ? options.css : fileName,
                    jsFileName: typeof options.js === 'string' ? options.js : fileName,
                    withCss: !!options.css || !!options.all,
                    withJs: !!options.js || !!options.all
                }, cdnLibraries);
            }
            if (options.css || options.all) {
                yield this.module.css(typeof options.css === 'string' ? options.css : fileName, options.dir, cdnLibraries);
            }
            if (options.js || options.all) {
                if (!cdnLibraries) {
                    cdnLibraries = yield this.module.askForCDNLibraries({ mustInitInJS: true });
                }
                yield this.module.js((typeof options.js === 'string' ? options.js : fileName), cdnLibraries, options.dir);
            }
            if (options.img || options.all) {
                yield this.module.img(options.dir);
            }
            if (options.readme || options.all) {
                yield this.module.readme((typeof options.readme === 'string' ? options.readme : fileName), options.dir);
            }
            this.module.askForInitialCommit(options.dir);
        });
    }
}
exports.ScaffoldCommand = ScaffoldCommand;
