import Vue from 'vue'

Vue.component('ctc-question', () => import('./question.vue'))
Vue.component('ctc-session-out', () => import('./sessionOut.vue'))
Vue.component('activeUser', () => import('./activeUser'))
Vue.component('activeRepresentant', () => import('./activeRepresentant'))
Vue.component('erasedUser', () => import('./erasedUser'))
Vue.component('erasedRepresentant', () => import('./erasedRepresentant'))
Vue.component('passUser', () => import('./passUser'))
