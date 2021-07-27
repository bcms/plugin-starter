import { Controller, Middleware } from '@becomes/purple-cheetah/types';

export interface BCMSPluginConfig {
  name: string;
  controllers?: Controller[];
  middleware?: Middleware[];
}

export interface BCMSPlugin {
  name: string;
  controllers: Controller[];
  middleware: Middleware[];
}
