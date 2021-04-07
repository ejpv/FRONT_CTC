import Vue from 'vue'

Vue.component('ctc-session-out', () => import('./sessionOut.vue'))
Vue.component('activeUser', () => import('./activeUser'))
Vue.component('activeRepresentant', () => import('./activeRepresentant'))
Vue.component('activeEstablishment', () => import('./activeEstablishment'))
Vue.component('activePlace', () => import('./activePlace'))
Vue.component('activeProtectedArea', () => import('./activeProtectedArea'))
Vue.component('activeEstablishment', () => import('./activeEstablishment'))
Vue.component('activeForm', () => import('./activeForm'))
Vue.component('erasedUser', () => import('./erasedUser'))
Vue.component('erasedRepresentant', () => import('./erasedRepresentant'))
Vue.component('erasedPlace', () => import('./erasedPlace'))
Vue.component('erasedProtectedArea', () => import('./erasedProtectedArea'))
Vue.component('erasedEstablishment', () => import('./erasedEstablishment'))
Vue.component('erasedForm', () => import('./erasedForm'))
Vue.component('passUser', () => import('./passUser'))
Vue.component('ctcMap', () => import('./map'))

