"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalSettings = void 0;
const conf_1 = require("conf");
const inquirer = require("inquirer");
const logs_1 = require("../utilities/logs");
const CliTable = require("cli-table");
class GlobalSettings {
    static init(name) {
        this.config = new conf_1.default({
            configName: name !== null && name !== void 0 ? name : this.cliName,
            projectName: name !== null && name !== void 0 ? name : this.cliName,
            schema: this.configSchema,
            migrations: this.configMigrations
        });
    }
    static get configSchema() {
        return {
            videoRename: {
                type: 'object',
                properties: {
                    driveFolder: {
                        type: 'string'
                    },
                    multipartFiles: {
                        type: 'boolean',
                        default: false
                    }
                },
                default: {
                    driveFolder: '',
                    multipartFiles: false
                }
            }
        };
    }
    static get configMigrations() {
        return {};
    }
    static readKeyValue(key) {
        return this.config.get(key);
    }
    static assignKeyValue(key, value) {
        this.config.set(key, value);
        return this.readKeyValue(key);
    }
    static readAll(keyToSearchFor) {
        let toReturn = {};
        Object.keys(this.configSchema).forEach(key => {
            toReturn[key] = this.config.get(key);
        });
        if (keyToSearchFor) {
            toReturn = toReturn[keyToSearchFor];
        }
        return toReturn;
    }
    static reset() {
        inquirer.prompt([
            {
                type: 'confirm',
                message: 'Are you sure you want to reset all configurations? This can\'t be undone.',
                name: 'confirm',
                default: false
            }
        ]).then((answers) => {
            if (answers.confirm) {
                this.config.clear();
                logs_1.default.info('All configurations have been reset.');
            }
        });
    }
    static readAllAndPrint(keyToSearchFor) {
        let settings = GlobalSettings.readAll(keyToSearchFor);
        if (keyToSearchFor) {
            settings = { [keyToSearchFor]: settings };
        }
        const table = new CliTable({
            head: ['Section', 'Property', 'Value'],
            rows: Object.keys(settings).reduce((acc, section) => {
                const toReturn = [];
                Object.keys(settings[section]).map((property, i) => {
                    if (i === 0) {
                        toReturn.push([section, property, settings[section][property]]);
                    }
                    else {
                        toReturn.push(['', property, settings[section][property]]);
                    }
                });
                acc.push(...toReturn);
                return acc;
            }, [])
        });
        console.log(table.toString());
    }
}
exports.GlobalSettings = GlobalSettings;
GlobalSettings.cliName = 'boolean-cli';
