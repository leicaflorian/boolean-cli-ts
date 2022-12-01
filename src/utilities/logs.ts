// @ts-ignore
import * as chalk from 'chalk'

function formatMessage (message: string, prefix: string) {
  return message.replace(/^\s{1,}/gm, ' '.repeat(prefix ? prefix.length + 3 : 0))
}

export default {
  
  info (message: string, prefix?: string) {
    let prefixString = chalk.yellow(prefix ? prefix : '[INFO]')
    
    console.info(prefixString, '-', formatMessage(message, prefix))
  },
  
  log (message: string) {
    console.info(formatMessage(message, ''))
  },
  
  warn (message: string) {
    const prefix = '[WARN]'
    let prefixString = prefix ? chalk.yellow(prefix) : '|'
    
    console.info(prefixString, '-', formatMessage(message, prefix))
  },
  
  error (message: string) {
    const prefix = '[ERR]'
    let prefixString = prefix ? chalk.red(prefix) : '|'
    
    console.info(prefixString, '-', formatMessage(message, prefix))
  },
  
  warnNoFileFound (fileName: string) {
    console.warn(`   ![WARN]! ${fileName} not found!`)
  }
}
