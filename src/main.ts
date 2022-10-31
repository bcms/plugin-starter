import { createApp } from 'vue';
import type { BCMSGlobalScopeMain } from '@becomes/cms-ui/types';
import { cy, clickOutside, tooltip } from '@becomes/cms-ui/directives';
import App from './ui/app';
import router from './ui/router';
import '@becomes/cms-ui/styles/_main.scss';
import './ui/styles/_main.scss';

declare global {
  interface Window {
    editorNodeEnter(data: { element: HTMLElement }): void;
    editorNodeLeave(data: { element: HTMLElement }): void;

    bcms: BCMSGlobalScopeMain;
    pluginName: string;
  }
}

window.pluginName = 'bcms-plugin---name';
window.bcms = window.parent.bcms;

const app = createApp(App);
app.directive('cy', cy);
app.directive('clickOutside', clickOutside);
app.directive('tooltip', tooltip);
app.use(router).mount(`#bcms_plugin_bcms-plugin---name`);
