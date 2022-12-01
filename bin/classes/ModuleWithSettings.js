"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleWithSettings = void 0;
const GlobalSettings_1 = require("./GlobalSettings");
class ModuleWithSettings {
    constructor() {
        this.settingsPrefix = '';
        this.settings = GlobalSettings_1.GlobalSettings.config;
    }
    /**
     *
     * @param key
     * @protected
     */
    readSetting(key) {
        const selector = [key];
        if (this.settingsPrefix) {
            selector.unshift(this.settingsPrefix);
        }
        return this.settings.get(selector.join('.'));
    }
    /**
     *
     * @protected
     */
    get moduleSettings() {
        return GlobalSettings_1.GlobalSettings.readAll(this.settingsPrefix);
    }
}
exports.ModuleWithSettings = ModuleWithSettings;
//# sourceMappingURL=ModuleWithSettings.js.map