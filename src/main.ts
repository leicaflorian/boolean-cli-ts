#!/usr/bin/env node

import { Command as CommandType } from 'commander'
import { ConfigCommand } from './commands/config'
import { VideoRenamerCommand } from './modules/video-renamer/video-renamer.command'
import { GlobalSettings } from './classes/GlobalSettings'
import { writeMainLogo } from './utilities/ui'

const { Command } = require('commander')

const program: CommandType = new Command()

program
  .name(GlobalSettings.cliName)
  .description('CLI for Boolean Careers tutors and teachers')
  .version('1.0.0')

registerCommands(program)

writeMainLogo()

program.parse(process.argv)

export function registerCommands (program: CommandType) {
  // Register each command
  (new ConfigCommand()).register(program);
  (new VideoRenamerCommand()).register((program))
}
