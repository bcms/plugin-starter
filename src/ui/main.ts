import type {} from '@becomes/cms-ui';
import App from './App.svelte';

const app = new App({
	target: document.getElementById('PLUGIN_NAME'),
	hydrate: true,
});

export default app;