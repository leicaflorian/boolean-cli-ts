// @ts-ignore
import * as chalk from 'chalk'

function formatMessage (message: string, prefix: string) {
  return message.replace(/^\s{1,}/gm, ' '.repeat(prefix ? prefix.length + 3 : 0))
}

export default {
  /**
   * Log a message to the console and adds a prefix
   * @param {string} message
   * @param {string} [prefix] - Default: 'INFO'
   */
  info (message: string, prefix?: string | boolean, color?: string) {
    let rawPrefix = prefix ? prefix.toString() : '[INFO]'
    
    if (prefix === false) {
      rawPrefix = ''.padStart(6, ' ')
    }
    
    let prefixString = chalk[color ?? 'yellow'](prefix ? prefix : '[INFO]')
    
    console.info(prefixString, '-', formatMessage(message, rawPrefix))
  },
  
  /**
   * Log a message to the console with a prefix
   * @param {string} message
   */
  log (message: string) {
    console.info(formatMessage(message, ''))
  },
  
  /**
   * Log a message to the console with a 'WARN' prefix
   * @param {string} message
   */
  warn (message: string) {
    const prefix = '[WARN]'
    let prefixString = prefix ? chalk.yellow(prefix) : '|'
    
    console.info(prefixString, '-', formatMessage(message, prefix))
  },
  
  /**
   * Log a message to the console with a 'ERR' prefix
   * @param {string} message
   */
  error (message: string) {
    const prefix = '[ERR]'
    let prefixString = prefix ? chalk.red(prefix) : '|'
    
    console.info(prefixString, '-', formatMessage(message, prefix))
  },
  
  /**
   * Log a message to the console when no file was found
   * @param {string} fileName
   */
  warnNoFileFound (fileName: string) {
    console.warn(`   ![WARN]! ${fileName} not found!`)
  },
  
  /**
   * Log a message to the console when starting a task
   * @param {string} prefix
   */
  logStarting (prefix: string) {
    this.info(`Processing ${prefix}...`, `[${prefix.toUpperCase()}]`)
  },
  
  /**
   * Log a message to the console when a task is done
   * @param {string} file
   */
  logFileCreated (file: string) {
    this.info(`${chalk.cyan(file)} file created!`, false)
  }
}
