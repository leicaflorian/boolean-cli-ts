#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./commands/config");
const videoRename_1 = require("./commands/videoRename");
const { Command } = require('commander');
const program = new Command();
program
    .name('boolean')
    .description('CLI for Boolean Careers tutors and teachers')
    .version('1.0.0');
// Register each command
new config_1.ConfigCommand(program);
new videoRename_1.VideoRenameCommand(program);
program.parse();
//# sourceMappingURL=main.js.map