import * as shell from 'shelljs'
import * as fs from 'fs'
import * as path from 'path'
import * as chalk from 'chalk'
import logs from './logs'

function getVersion (): string {
  const version = fs.readFileSync(path.resolve(__dirname, '../version.txt'), 'utf8')
  
  return version
}

/**
 * Check if a new version is available
 * and return the current version
 */
function checkVersion (): string {
  logs.info('Checking for updates...', null)
  
  const remoteVersion = shell.exec('npm show boolean-cli version', { silent: true }).stdout.trim()
  const rawVersion = getVersion()
  const currentVersion = rawVersion.trim().replace('v', '')
  
  if (remoteVersion !== currentVersion) {
    logs.info(`A new version is available: ${currentVersion} -> ${remoteVersion}
                        Please run ${chalk.green('npm update boolean-cli -g')} to update.
                        ------------------------------------------------------------------\n`, '[ ‼ ]', "red")
  } else {
    logs.info('You are using the latest version', '[ ✓ ]', "green")
  }
  
  return currentVersion
}

export {
  checkVersion,
  getVersion
}
