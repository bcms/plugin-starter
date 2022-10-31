import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/home';
import Page2 from './views/page-2';

const router = createRouter({
  history: createWebHashHistory('/dashboard/plugin/bcms-plugin---name'),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/page-2',
      name: 'Page2',
      component: Page2,
    },
  ],
});

export default router;
