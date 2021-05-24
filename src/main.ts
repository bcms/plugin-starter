import { createApp } from 'vue';
import type { BCMSGlobalScopeMain } from '@becomes/cms-ui/types';
import App from './ui/App.vue';
import './ui/assets/styles/main.scss';

declare global {
  interface Window {
    bcms: BCMSGlobalScopeMain;
  }
}

createApp(App).mount(`#bcms_plugin_${process.env.VUE_APP_PLUGIN_NAME}`);
