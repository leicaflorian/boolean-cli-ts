#!/usr/bin/env node

import { Command as CommandType } from 'commander'
import { ConfigCommand } from './commands/config'
import { VideoRenamerCommand } from './modules/video-renamer/video-renamer.command'

const { Command } = require('commander')

const program: CommandType = new Command()

program
  .name('boolean')
  .description('CLI for Boolean Careers tutors and teachers')
  .version('1.0.0')

registerCommands(program)

program.parse(process.argv)

export function registerCommands (program: CommandType) {
  // Register each command
  (new ConfigCommand()).register(program);
  (new VideoRenamerCommand()).register((program))
}
