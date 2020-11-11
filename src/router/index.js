import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'AppLayout',
    component: () => import('../layouts/AppLayout.vue'),
    children: [
      {
        path: '/test',
        name: 'TestPage',
        component: () => import('../views/TestPage.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
