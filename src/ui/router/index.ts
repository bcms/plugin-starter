import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';

const baseUri = '/dashboard/plugin/hello---world';
const routes: Array<RouteRecordRaw> = [
  {
    path: `${baseUri}`,
    name: 'Home',
    component: Home,
  },
  {
    path: `${baseUri}#page-2`,
    name: 'Page 2',
    component: () =>
      import(
        /* webpackChunkName: "hello---world-home" */ '../views/page-2.vue'
      ),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
