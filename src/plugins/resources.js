import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.options.root = process.env.PROXY

const token = sessionStorage.getItem('token')
Vue.http.headers.common['token'] = token
