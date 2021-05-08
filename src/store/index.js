import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(sessionStorage.getItem('user'))
      ? JSON.parse(sessionStorage.getItem('user'))
      : {
          _id: '',
          avatar: '',
          rol: '',
          nombre: '',
          apellido: '',
          password: '',
          verificacionToken: '',
          email: '',
          activado: true
        },
    establishment: JSON.parse(sessionStorage.getItem('establishment'))
      ? JSON.parse(sessionStorage.getItem('establishment'))
      : {
          _id: '',
          nombre: '',
          administrador: '',
          lugar: {},
          areaProtegida: {},
          representante: {},
          registro: '',
          LUAF: '',
          email: '',
          nacionalidad: '',
          web: '',
          telefono: ''
        },
    token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '',
    expira: sessionStorage.getItem('expira') ? sessionStorage.getItem('expira') : ''
  },

  mutations: {
    changeSesion(state, payload) {
      state.user = payload.user
      state.token = payload.token
      state.expira = payload.expira
    },
    changeEstablishment(state, payload) {
      state.establishment = payload.establishment
    }
  },

  actions: {
    loadUserLoged({ commit }) {
      if (JSON.parse(sessionStorage.getItem('user'))) {
        var data = {
          user: {},
          token: '',
          expira: ''
        }
        data.user = JSON.parse(sessionStorage.getItem('user'))
        data.token = sessionStorage.getItem('token')
        data.exp = sessionStorage.getItem('expira')
        commit('changeSesion', data)
        return
      }
    },

    closeSesion({ commit }) {
      sessionStorage.clear()
      var data = {
        user: {
          _id: '',
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
        expira: '',
        establishment: {
          _id: '',
          nombre: '',
          administrador: '',
          lugar: {},
          areaProtegida: {},
          representante: {},
          registro: '',
          LUAF: '',
          email: '',
          nacionalidad: '',
          web: '',
          telefono: ''
        }
      }
      commit('changeSesion', data)
      commit('changeEstablishment', data)
      return
    },

    prepareEnvironment({ commit }) {
      if (JSON.parse(sessionStorage.getItem('establishment'))) {
        var data = {
          establishment: {}
        }
        data.establishment = JSON.parse(sessionStorage.getItem('establishment'))
        commit('changeEstablishment', data)
      }
      return
    }
  },

  modules: {}
})
