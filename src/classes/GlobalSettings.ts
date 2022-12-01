import Conf, { Schema } from 'conf'
import * as inquirer from 'inquirer'
import logs from '../utilities/logs'
import { InquirerConfirmAnswer } from '../@types/InquirerConfirmAnswer'
// @ts-ignore
import * as  CliTable from 'cli-table'

export class GlobalSettings {
  static config: Conf
  static cliName = "boolean"
  
  static init (name?: string) {
    this.config = new Conf({
      configName: name ?? this.cliName,
      projectName: name ?? this.cliName,
      schema: this.configSchema,
      migrations: this.configMigrations
    })
  }
  
  static get configSchema (): Schema<any> {
    return {
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
  
  static readKeyValue (key: string) {
    return this.config.get(key) as any
  }
  
  static assignKeyValue (key: string, value: any) {
    this.config.set(key, value)
    
    return this.readKeyValue(key)
  }
  
  static readAll<T> (keyToSearchFor?: string): T {
    let toReturn = {}
    
    Object.keys(this.configSchema).forEach(key => {
      let value = this.config.get(key) as any
      
      toReturn[key] = value
    })
    
    if (keyToSearchFor) {
      toReturn = toReturn[keyToSearchFor]
    }
    
    return toReturn as any
  }
  
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
