import dotenv from 'dotenv'
dotenv.config()
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/google'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './plugins/resources'
import './plugins/sweetAlert'
import './components'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
