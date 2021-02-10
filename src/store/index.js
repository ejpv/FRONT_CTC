import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) :
      {
        _id:'',
        avatar: '',
        rol: '',
        nombre: '',
        apellido: '',
        password: '',
        verificacionToken: '',
        email: '',
        activado: true
      },
    token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '',
    expira: sessionStorage.getItem('expira') ? sessionStorage.getItem('expira') : '',
  },
  mutations: {
    changeSesion(state, payload) {
      state.user = payload.user
      state.token = payload.token
      state.expira = payload.expira
    },
  },
  actions: {
    loadUserLoged({ commit }) {
      if (JSON.parse(sessionStorage.getItem('user'))) {
        var data = {
          user: {},
          token: '',
          expira: ''
        }
        data.user = JSON.parse(sessionStorage.getItem('user'));
        data.token = sessionStorage.getItem('token');
        data.exp = sessionStorage.getItem('expira');
        commit('changeSesion', data)
        return
      }
    },

    closeSesion({ commit }) {
      sessionStorage.clear()
      var data = {
        user: {
          _id:'',
          avatar: '',
          rol: '',
          nombre: '',
          apellido: '',
          password: '',
          verificacionToken: '',
          email: '',
          activado: true
        },
        token: '',
        expira: ''
      }
      commit('changeSesion', data)
      return
    }
  },
  modules: {}
})
