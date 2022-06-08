import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import CustomerPanel from '../views/CustomerPanel.vue'
import MachineryPanel from '../views/MachineryPanel.vue'
import MaintainerPanel from '../views/MaintainerPanel.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/customer',
      name: 'CustomerPanel',
      component: CustomerPanel,
    },
    {
      path: '/machinery',
      name: 'MachineryPanel',
      component: MachineryPanel,
    },
    {
      path: '/maintainer',
      name: 'MaintainerPanel',
      component: MaintainerPanel,
    },
  ],
})

export default router
