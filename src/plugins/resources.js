import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.options.root = process.env.VUE_APP_DOMAIN

console.log("el dominio");

console.log(process.env.VUE_APP_DOMAIN);

const token = sessionStorage.getItem('token')
Vue.http.headers.common['token'] = token
