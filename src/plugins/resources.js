import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

// User authorization token
const token = sessionStorage.getItem('token')
// eslint-disable-next-line
Vue.http.headers.common['token'] = token
