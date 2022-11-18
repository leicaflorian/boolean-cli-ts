#!/usr/bin/env node

import { Command as CommandType } from 'commander'
import { ConfigCommand } from './commands/config'
import { VideoRenameCommand } from './commands/videoRename'

const { Command } = require('commander')

const program: CommandType = new Command()

program
  .name('boolean')
  .description('CLI for Boolean Careers tutors and teachers')
  .version('1.0.0')

// Register each command
new ConfigCommand(program)
new VideoRenameCommand(program)

program.parse()
