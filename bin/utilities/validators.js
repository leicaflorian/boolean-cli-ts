"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choicesValidator = exports.stringValidator = void 0;
function stringValidator(str) {
    if (!str || !str.trim()) {
        return 'Please enter a value';
    }
    return true;
}
exports.stringValidator = stringValidator;
function choicesValidator(choices) {
    if (!choices || !Object.keys(choices).length) {
        return 'Please choose at least one option';
    }
    return true;
}
exports.choicesValidator = choicesValidator;
//# sourceMappingURL=validators.js.map