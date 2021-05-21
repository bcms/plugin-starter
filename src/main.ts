import { createApp } from 'vue';
import App from './App.vue';

console.log('HERE');

createApp(App).mount(`#bcms_plugin_${process.env.VUE_APP_PLUGIN_NAME}`);
