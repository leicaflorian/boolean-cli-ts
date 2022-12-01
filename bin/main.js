#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const config_1 = require("./commands/config");
const video_renamer_command_1 = require("./modules/video-renamer/video-renamer.command");
const { Command } = require('commander');
const program = new Command();
program
    .name('boolean')
    .description('CLI for Boolean Careers tutors and teachers')
    .version('1.0.0');
registerCommands(program);
program.parse(process.argv);
function registerCommands(program) {
    // Register each command
    (new config_1.ConfigCommand()).register(program);
    (new video_renamer_command_1.VideoRenamerCommand()).register((program));
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=main.js.map