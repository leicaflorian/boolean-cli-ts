import Conf, { Schema } from 'conf'
import * as inquirer from 'inquirer'
import logs from '../utilities/logs'
import { InquirerConfirmAnswer } from '../@types/InquirerConfirmAnswer'
// @ts-ignore
import * as  CliTable from 'cli-table'

/**
 * Global settings for the CLI
 * Using a Static class for a "singleton" like pattern
 */
export class GlobalSettings {
  static config: Conf
  static cliName = 'boolean-cli'
  
  /**
   * Initialize the config by setting the schema and migrations
   * @param name
   */
  static init (name?: string) {
    this.config = new Conf({
      configName: name ?? this.cliName,
      projectName: name ?? this.cliName,
      schema: this.configSchema,
      migrations: this.configMigrations
    })
  }
  
  /**
   * The schema for the config
   */
  static get configSchema (): Schema<any> {
    return {
      // TODO:: make each module section registered by its own module
      videoRename: {
        type: 'object',
        properties: {
          driveFolder: {
            type: 'string'
          },
          multipartFiles: {
            type: 'boolean',
            default: false
          }
        },
        default: {
          driveFolder: '',
          multipartFiles: false
        }
      }
    }
  }
  
  /**
   * Migrations for the config
   */
  static get configMigrations () {
    return {
      /*'0.0.1': store => {
        store.set('debugPhase', true)
      },
      '1.0.0': store => {
        store.delete('debugPhase')
        store.set('phase', '1.0.0')
      },
      '1.0.2': store => {
        store.set('phase', '1.0.2')
      },
      '>=2.0.0': store => {
        store.set('phase', '>=2.0.0')
      }*/
    }
  }
  
  /**
   * Read a key from the config
   * @param {string} key
   */
  static readKeyValue (key: string): any {
    return this.config.get(key) as any
  }
  
  /**
   * Write value to a key in the config
   * @param {string} key
   * @param {any} value
   */
  static assignKeyValue (key: string, value: any): any {
    this.config.set(key, value)
    
    return this.readKeyValue(key)
  }
  
  /**
   * Read all settings
   * If a key is provided, it will only return the settings for that key
   * @param {string} keyToSearchFor
   */
  static readAll<T> (keyToSearchFor?: string): T {
    let toReturn = {}
    
    Object.keys(this.configSchema).forEach(key => {
      toReturn[key] = this.config.get(key) as any
    })
    
    if (keyToSearchFor) {
      toReturn = toReturn[keyToSearchFor]
    }
    
    return toReturn as any
  }
  
  /**
   * Reset all settings after asking for confirmation
   */
  static reset () {
    inquirer.prompt([
      {
        type: 'confirm',
        message: 'Are you sure you want to reset all configurations? This can\'t be undone.',
        name: 'confirm',
        default: false
      }
    ]).then((answers: InquirerConfirmAnswer) => {
      if (answers.confirm) {
        this.config.clear()
        
        logs.info('All configurations have been reset.')
      }
    })
  }
  
  /**
   * Read all settings and print them in console as a table
   * If a key is provided, it will only return the settings for that key
   * @param keyToSearchFor
   *
   * @see readKeyValue
   */
  static readAllAndPrint (keyToSearchFor?: string) {
    let settings = GlobalSettings.readAll(keyToSearchFor)
    
    if (keyToSearchFor) {
      settings = { [keyToSearchFor]: settings }
    }
    
    const table = new CliTable({
      head: ['Section', 'Property', 'Value'],
      rows: Object.keys(settings).reduce((acc, section) => {
        const toReturn: any[] = []
        
        Object.keys(settings[section]).map((property, i) => {
          if (i === 0) {
            toReturn.push([section, property, settings[section][property]])
          } else {
            toReturn.push(['', property, settings[section][property]])
          }
        })
        
        acc.push(...toReturn)
        
        return acc
      }, [])
    })
    
    console.log(table.toString())
  }
}
