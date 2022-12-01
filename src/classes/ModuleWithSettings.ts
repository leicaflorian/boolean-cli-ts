import Conf from 'conf'
import { GlobalSettings } from './GlobalSettings'

export class ModuleWithSettings<SettingsInterface> {
  private settings: Conf
  protected settingsPrefix = ''
  
  constructor () {
    this.settings = GlobalSettings.config
  }
  
  /**
   *
   * @param key
   * @protected
   */
  protected readSetting (key: keyof SettingsInterface): any {
    const selector: string[] = [key as string]
    
    if (this.settingsPrefix) {
      selector.unshift(this.settingsPrefix)
    }
    
    return this.settings.get(selector.join('.')) as any
  }
  
  /**
   *
   * @protected
   */
  protected get moduleSettings (): SettingsInterface {
    return GlobalSettings.readAll<SettingsInterface>(this.settingsPrefix)
  }
}
