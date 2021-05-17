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
        name: 'Áreas Protegidas',
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
        name: 'Seleccionar Formulario',
        component: () => import('../views/SelectForm.vue')
      },
      {
        path: '/technicalInform',
        name: 'Crear un Informe',
        component: () => import('../views/TechnicalInform.vue')
      },
      {
        path: '/statusInform',
        name: 'Ver estado de los Informes',
        component: () => import('../views/StatusInform.vue')
      },
      {
        path: '/reports',
        name: 'Aprobar o Rechazar Informes',
        component: () => import('../views/Reports.vue')
      },
      {
        path: '/informationRepresentant',
        name: 'Información Básica',
        component: () => import('../views/InformationRepresentant.vue')
      },
      {
        path: '/diagnosticRepresentant',
        name: 'Ver Diagnósticos',
        component: () => import('../views/DiagnosticsRepresentant.vue')
      },
      {
        path: '/reportRepresentant',
        name: 'Ver Informes',
        component: () => import('../views/ReportRepresentant.vue')
      },
      {
        path: '/category',
        name: 'Categorías',
        component: () => import('../views/Category.vue')
      },
      {
        path: '/editEstablishment',
        name: 'Establecimiento e Información básica',
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
    path: '/pruebas',
    name: 'Pruebas',
    component: () => import('../views/pruebas.vue')
  },
  {
    path: '/selectEstablishment',
    name: 'Seleccionar Establecimiento',
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
    name: 'Reestablecer Contraseña',
    path: '/restorePass/:token/:exp',
    component: () => import('../views/RestorePass.vue')
  },
  {
    name: 'Activar Cuenta',
    path: '/activateAccount/:token/:password',
    component: () => import('../views/ActivateAccount.vue')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
