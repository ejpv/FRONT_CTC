import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../layouts/AppLayout.vue'),
    children: [
      {
        path: '/test',
        name: 'TestPage',
        component: () => import('../views/TestPage.vue')
      },
      {
        path: '/users',
        name: 'Usuarios',
        component: () => import('../views/Users.vue')
      },
      {
        path: '/profile',
        name: 'Perfil',
        component: () => import('../views/Profile.vue')
      },
      {
        path: '/establishment',
        name: 'Establecimientos',
        component: () => import('../views/Establishment.vue')
      },
      {
        path: '/representant',
        name: 'Representantes',
        component: () => import('../views/Representant.vue')
      },
      {
        path: '/protectedArea',
        name: 'Áreas Protegidas',
        component: () => import('../views/ProtectedArea.vue')
      },
      {
        path: '/place',
        name: 'Lugares',
        component: () => import('../views/Place.vue')
      },
      {
        path: '/form',
        name: 'Formularios',
        component: () => import('../views/Form.vue')
      },
      {
        path: '/editedForm/:form',
        name: 'Formulario',
        component: () => import('../views/EditedForm.vue'),
      },
    ]
  },
  {
    path: "*", component: () => import('../views/404.vue')
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/forgetPass',
    component: () => import('../views/ForgetPass.vue'),
  },
  {
    path: '/restorePass/:token/:exp',
    component: () => import('../views/RestorePass.vue'),
  },
  {
    path: '/activateAccount/:token/:password',
    component: () => import('../views/ActivateAccount.vue'),
  },
  {
    path: '/pruebas',
    component: () => import('../views/pruebas.vue')
  },
  {
    path: '/pruebas2/:form',
    component: () => import('../views/pruebas2.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
