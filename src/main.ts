#!/usr/bin/env node

import { Command as CommandType } from 'commander'
import { ConfigCommand } from './commands/config'
import { VideoRenamerCommand } from './modules/video-renamer/video-renamer.command'
import { GlobalSettings } from './classes/GlobalSettings'
import { writeMainLogo } from './utilities/ui'
import { ScaffoldCommand } from './modules/scaffold/scaffold.command'
import { RepoCreatorCommand } from './modules/repo-creator/repo-creator.command'
import { checkVersion } from './utilities/version'

const { Command } = require('commander')
const program: CommandType = new Command

// before starting, check if a new version is available

program
  .name(GlobalSettings.cliName)
  .description('CLI for Boolean Careers tutors and teachers')
  
// Register all command modules
registerCommands(program)

// Write an ASCII logo
writeMainLogo()

const version = checkVersion()


program.version(version)

program.parse(process.argv)

/**
 * Register all command modules
 *
 * @param {Command} program
 */
export function registerCommands (program: CommandType) {
  // Register each command
  (new ConfigCommand()).register(program);
  (new ScaffoldCommand()).register((program));
  (new VideoRenamerCommand()).register((program));
  (new RepoCreatorCommand()).register((program))
}
