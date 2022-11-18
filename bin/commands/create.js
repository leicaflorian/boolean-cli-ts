"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCreateCommand = void 0;
function registerCreateCommand(program) {
    program
        .command('create')
        .description('Create a new Node.js CLI project')
        .action(() => {
        console.log('create');
    });
}
exports.registerCreateCommand = registerCreateCommand;
//# sourceMappingURL=create.js.map