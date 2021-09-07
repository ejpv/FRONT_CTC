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
        name: 'Áreas protegidas',
        component: () => import('../views/ProtectedArea.vue')
      },
      {
        path: '/form',
        name: 'Formularios',
        component: () => import('../views/Form.vue')
      },
      {
        path: '/editedForm/:form',
        name: 'Formulario',
        component: () => import('../views/EditedForm.vue')
      },
      {
        path: '/question',
        name: 'Preguntas',
        component: () => import('../views/Question.vue')
      },
      {
        path: '/selectForm',
        name: 'Seleccionar formulario',
        component: () => import('../views/SelectForm.vue')
      },
      {
        path: '/technicalInform',
        name: 'Crear un informe',
        component: () => import('../views/TechnicalInform.vue')
      },
      {
        path: '/statusInform',
        name: 'Ver estado de los informes',
        component: () => import('../views/StatusInform.vue')
      },
      {
        path: '/reports',
        name: 'Aprobar o rechazar informes',
        component: () => import('../views/Reports.vue')
      },
      {
        path: '/informationRepresentant',
        name: 'Información básica',
        component: () => import('../views/InformationRepresentant.vue')
      },
      {
        path: '/diagnosticRepresentant',
        name: 'Ver diagnósticos',
        component: () => import('../views/DiagnosticsRepresentant.vue')
      },
      {
        path: '/reportRepresentant',
        name: 'Ver informes',
        component: () => import('../views/ReportRepresentant.vue')
      },
      {
        path: '/activity',
        name: 'Actividades turísticas',
        component: () => import('../views/Activity.vue')
      },
      {
        path: '/editEstablishment',
        name: 'Establecimiento e información básica',
        component: () => import('../views/EditEstablishment.vue')
      }
    ]
  },
  {
    path: '/test/:form/:establishment',
    name: 'Diagnostico',
    component: () => import('../views/Test.vue')
  },
  {
    path: '/selectEstablishment',
    name: 'Seleccionar establecimiento',
    component: () => import('../views/SelectEstablishment.vue')
  },
  {
    name: 'Página no encontrada',
    path: '*',
    component: () => import('../views/404.vue')
  },
  {
    name: 'Ingreso',
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    name: '¿Olvidaste tu contraseña?',
    path: '/forgetPass',
    component: () => import('../views/ForgetPass.vue')
  },
  {
    name: 'Crear nuevo establecimiento',
    path: '/technicalEstablishment',
    component: () => import('../views/TechnicalEstablishment.vue')
  },
  {
    name: 'Reestablecer contraseña',
    path: '/restorePass/:token/:exp',
    component: () => import('../views/RestorePass.vue')
  },
  {
    name: 'Activar cuenta',
    path: '/activateAccount/:token/:password',
    component: () => import('../views/ActivateAccount.vue')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
