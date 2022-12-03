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
exports.Scaffold = void 0;
const inquirer = require("inquirer");
const shell = require("shelljs");
const logs_1 = require("../../utilities/logs");
const ModuleWithSettings_1 = require("../../classes/ModuleWithSettings");
const validators_1 = require("../../utilities/validators");
const fs_1 = require("../../utilities/fs");
class Scaffold extends ModuleWithSettings_1.ModuleWithSettings {
    /**
     * Create necessary files for html projects
     *
     * @param {string|null} dir
     * @param {ScaffoldHTMLSettings} settings
     * @param {ScaffoldCDNLibraries[]} cdnLibraries
     */
    html(dir, settings, cdnLibraries) {
        return __awaiter(this, void 0, void 0, function* () {
            logs_1.default.logStarting('HTML');
            // options for the mustache template
            const mustacheOptions = Object.assign({ title: (0, fs_1.prepareTitle)(dir, settings.fileName), css: settings.withCss, cssFileName: (0, fs_1.prepareFileName)(settings.cssFileName, 'css', 'style'), js: settings.withJs, jsFileName: (0, fs_1.prepareFileName)(settings.jsFileName, 'js', 'main'), libraries: cdnLibraries !== null && cdnLibraries !== void 0 ? cdnLibraries : [] }, this.prepareTemplateCDNLibraries(cdnLibraries));
            const htmlFile = (0, fs_1.prepareFileName)(settings.fileName, 'html', 'index');
            const template = (0, fs_1.readTemplate)('index.html', mustacheOptions);
            const result = yield (0, fs_1.writeToFile)(htmlFile, template, dir);
            if (result) {
                logs_1.default.logFileCreated(htmlFile);
            }
            yield this.addFavIcon(dir);
            logs_1.default.info('Completed!\n', false);
        });
    }
    /**
     * Create necessary files for CSS
     *
     * @param {string} fileName
     * @param {string} [dest]
     * @param cdnLibraries
     */
    css(fileName, dest = '', cdnLibraries) {
        return __awaiter(this, void 0, void 0, function* () {
            logs_1.default.logStarting('CSS');
            const cssFile = (0, fs_1.prepareFileName)(fileName, 'css', 'style');
            const template = (0, fs_1.readTemplate)('style.css', {
                hasBS: !!(cdnLibraries === null || cdnLibraries === void 0 ? void 0 : cdnLibraries.find(lib => lib.name === 'bootstrap'))
            });
            const result = yield (0, fs_1.writeToFile)(`css/${cssFile}`, template, dest);
            if (result) {
                logs_1.default.logFileCreated(`css/${cssFile}`);
            }
            logs_1.default.info('Completed!\n', false);
        });
    }
    /**
     * Create necessary files for JS
     *
     * @param {string} fileName
     * @param {ScaffoldCDNLibraries} cdnLibraries
     * @param {string} [dest]
     */
    js(fileName, cdnLibraries, dest = '') {
        return __awaiter(this, void 0, void 0, function* () {
            logs_1.default.logStarting('JS');
            const jsFile = (0, fs_1.prepareFileName)(fileName, 'js', 'main');
            const template = (0, fs_1.readTemplate)('main.js', Object.assign({}, this.prepareTemplateCDNLibraries(cdnLibraries)));
            const result = yield (0, fs_1.writeToFile)(`js/${jsFile}`, template, dest);
            if (result) {
                logs_1.default.logFileCreated(`js/${jsFile}`);
            }
            logs_1.default.info('Completed!\n', false);
        });
    }
    /**
     * Copy default IMG files
     * @param {string} [dest]
     */
    img(dest = '') {
        return __awaiter(this, void 0, void 0, function* () {
            logs_1.default.logStarting('IMG');
            const copiedFiles = yield (0, fs_1.copyFolderFromTemplates)('imgs', 'imgs', dest);
            copiedFiles.forEach(file => logs_1.default.logFileCreated(file));
            logs_1.default.info('Completed!\n', false);
        });
    }
    /**
     *
     */
    addFavIcon(dir = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = 'imgs/favicon.ico';
            yield (0, fs_1.copyFromTemplates)('favicon.ico', filePath, dir);
            logs_1.default.logFileCreated(filePath);
        });
    }
    /**
     *
     * @param fileName
     * @param {string} [dest]
     */
    readme(fileName, dest = '') {
        return __awaiter(this, void 0, void 0, function* () {
            logs_1.default.logStarting('README');
            const readmeFile = (0, fs_1.prepareFileName)(fileName, 'md', 'README');
            const template = (0, fs_1.readTemplate)('README.md', {
                title: (0, fs_1.prepareTitle)(dest)
            });
            const result = yield (0, fs_1.writeToFile)(readmeFile, template, dest);
            if (result) {
                logs_1.default.logFileCreated(readmeFile);
            }
            logs_1.default.info('Completed!\n', false);
        });
    }
    /**
     * Show a wizard for scaffolding a new project
     *
     * @return {Promise<ScaffoldWizardResult>}
     */
    showWizard() {
        return __awaiter(this, void 0, void 0, function* () {
            logs_1.default.log(`Welcome to the HTML Scaffold Wizard!
    This wizard will help you create the basic scaffold for your project.\n`);
            return inquirer.prompt([
                // currently not used
                /*
                {
                  name: 'projectName',
                  message: `Specify the project name:`,
                  type: 'string',
                  default: path.basename(path.resolve('.')),
                  validate: stringValidator
                },*/
                {
                    name: 'filesToCreate',
                    message: `Choose which type of file you want to create:`,
                    type: 'checkbox',
                    choices: [
                        {
                            name: 'HTML',
                            value: 'html'
                        }, {
                            name: 'CSS',
                            value: 'css'
                        }, {
                            name: 'JS',
                            value: 'js'
                        }, {
                            name: 'Images',
                            value: 'img'
                        },
                        new inquirer.Separator(),
                        {
                            name: 'README',
                            value: 'readme',
                            checked: true
                        }
                    ],
                    validate: validators_1.choicesValidator
                },
                {
                    name: 'htmlFileName',
                    message: `Specify HTML file name:`,
                    type: 'string',
                    default: 'index',
                    when: (answers) => answers.filesToCreate.includes('html')
                },
                {
                    name: 'cssFileName',
                    message: `Specify CSS file name:`,
                    type: 'string',
                    default: 'style',
                    when: (answers) => answers.filesToCreate.includes('css')
                },
                {
                    name: 'jsFileName',
                    message: `Specify JS file name:`,
                    type: 'string',
                    default: 'main',
                    when: (answers) => answers.filesToCreate.includes('js')
                },
                {
                    name: 'readmeFileName',
                    message: `Specify README file name:`,
                    type: 'string',
                    default: 'README',
                    when: (answers) => answers.filesToCreate.includes('readme')
                }
            ]);
        });
    }
    /**
     * Ask to initialize git repository
     */
    askForInitialCommit(dir) {
        if (dir) {
            shell.cd(dir);
        }
        // if git command not available OR git already initialized, skip
        if (!shell.which('git') || shell.exec('git log --reverse', { silent: true }).code === 0) {
            return;
        }
        inquirer.prompt([
            {
                name: 'make_commit',
                message: `Si desidera creare un commit iniziale con i file appena creati?`,
                type: 'confirm',
                default: true
            }
        ]).then(answers => {
            if (answers.make_commit) {
                shell.exec('git add .');
                shell.exec('git commit -m "Initial scaffolding"');
                logs_1.default.info(`Commit creato.\n`);
                shell.exec('git push');
                logs_1.default.info(`Dati inviati al repository remoto.\n`);
            }
        });
    }
    /**
     * Ask user for CDN libraries to include
     */
    askForCDNLibraries(filterBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const choices = [
                {
                    name: 'Bootstrap 5',
                    value: {
                        isLink: true,
                        name: 'bootstrap',
                        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css'
                    }
                }, {
                    name: 'Font Awesome 5',
                    value: {
                        isLink: true,
                        name: 'fontawesome',
                        src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'
                    }
                }, {
                    name: 'Vue 3',
                    value: {
                        isScript: true,
                        mustInitInJS: true,
                        name: 'vue',
                        src: 'https://unpkg.com/vue@3/dist/vue.global.js'
                    }
                }, {
                    name: 'Axios',
                    value: {
                        isScript: true,
                        name: 'axios',
                        src: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
                    }
                }
            ].filter((entry) => {
                const filterKeys = Object.keys(filterBy !== null && filterBy !== void 0 ? filterBy : {});
                if (!filterKeys.length) {
                    return true;
                }
                let toReturn = false;
                filterKeys.forEach(key => {
                    toReturn = entry.value[key] === filterBy[key];
                });
                return toReturn;
            });
            if (!choices.length) {
                return [];
            }
            const result = yield inquirer.prompt([{
                    name: 'libraries',
                    message: `Si desidera aggiungere qualche libreria di terze parti? Lasciare deselezionato per saltare.`,
                    type: 'checkbox',
                    choices
                }]);
            return result.libraries;
        });
    }
    /**
     *
     * @param libraries
     */
    prepareTemplateCDNLibraries(libraries) {
        if (!libraries || !libraries.length) {
            libraries = [];
        }
        return {
            hasVue: !!libraries.find(lib => lib.name === 'vue'),
            hasBS: !!libraries.find(lib => lib.name === 'bootstrap')
        };
    }
}
exports.Scaffold = Scaffold;
//# sourceMappingURL=scaffold.js.map