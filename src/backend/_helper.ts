import { BCMSPlugin, BCMSPluginConfig } from './types/_helper';

export function createBcmsPlugin(config: BCMSPluginConfig): BCMSPlugin {
  return {
    name: config.name,
    controllers: config.controllers ? config.controllers : [],
    middleware: config.middleware ? config.middleware : [],
  };
}
