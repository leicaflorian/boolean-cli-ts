"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalSettings = void 0;
const conf_1 = require("conf");
const inquirer = require("inquirer");
const logs_1 = require("../utilities/logs");
// @ts-ignore
const CliTable = require("cli-table");
class GlobalSettings {
    static init(name) {
        this.config = new conf_1.default({
            configName: name !== null && name !== void 0 ? name : 'boolean',
            projectName: name !== null && name !== void 0 ? name : 'boolean',
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
        return this.config.get(key);
    }
    static assignKeyValue(key, value) {
        this.config.set(key, value);
        return this.readKeyValue(key);
    }
    static readAll(keyToSearchFor) {
        let toReturn = {};
        Object.keys(this.configSchema).forEach(key => {
            let value = this.config.get(key);
            toReturn[key] = value;
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
//# sourceMappingURL=GlobalSettings.js.map