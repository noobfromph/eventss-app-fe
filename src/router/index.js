import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


import EventsList from '@/pages/EventsList';
import UsersList from '@/pages/UsersList';

const routes = [
  {
    path: '/',
    name: 'home',
    component: EventsList
  },
  {
    path: '/users',
    name: 'users',
    component: UsersList
  }
];

const router = new Router({
  linkActiveClass: 'is-active',
  mode: 'history',
  routes
})

export default router
