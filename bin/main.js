#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const config_1 = require("./commands/config");
const video_renamer_command_1 = require("./modules/video-renamer/video-renamer.command");
const GlobalSettings_1 = require("./classes/GlobalSettings");
const ui_1 = require("./utilities/ui");
const scaffold_command_1 = require("./modules/scaffold/scaffold.command");
const repo_creator_command_1 = require("./modules/repo-creator/repo-creator.command");
const { Command } = require('commander');
const program = new Command();
program
    .name(GlobalSettings_1.GlobalSettings.cliName)
    .description('CLI for Boolean Careers tutors and teachers')
    .version('2.3.1');
registerCommands(program);
(0, ui_1.writeMainLogo)();
program.parse(process.argv);
function registerCommands(program) {
    (new config_1.ConfigCommand()).register(program);
    (new scaffold_command_1.ScaffoldCommand()).register((program));
    (new video_renamer_command_1.VideoRenamerCommand()).register((program));
    (new repo_creator_command_1.RepoCreatorCommand()).register((program));
}
exports.registerCommands = registerCommands;
