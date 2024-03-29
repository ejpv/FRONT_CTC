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
        telefono: '',
        ciudad: '',
        parroquia: '',
        canton: 'Riobamba',
        provincia: 'Chimborazo',
        lat: 0,
        lng: 0,
        agua: '',
        saneamiento: '',
        energia: '',
        desechos: '',
        personal: 0,
        actividad: []
      },
    establishments: JSON.parse(sessionStorage.getItem('establishments')) ? JSON.parse(sessionStorage.getItem('establishments')) : [],
    token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '',
    expira: sessionStorage.getItem('expira') ? sessionStorage.getItem('expira') : '',

    waters: JSON.parse(sessionStorage.getItem('waters'))
      ? JSON.parse(sessionStorage.getItem('waters'))
      : [],
    energies: JSON.parse(sessionStorage.getItem('energies'))
      ? JSON.parse(sessionStorage.getItem('energies'))
      : [],
    sanitation: JSON.parse(sessionStorage.getItem('sanitation'))
      ? JSON.parse(sessionStorage.getItem('sanitation'))
      : [],
    waste: JSON.parse(sessionStorage.getItem('waste'))
      ? JSON.parse(sessionStorage.getItem('waste'))
      : []
  },

  mutations: {
    changeSesion(state, payload) {
      state.user = payload.user
      state.token = payload.token
      state.expira = payload.expira
    },

    changeEstablishment(state, payload) {
      state.establishment = payload.establishment
    },

    syncOptions(state, payload) {
      state.waters = payload
        .map(v => {
          return v.agua
        })
        .filter(v => {
          return v != undefined
        })
      sessionStorage.setItem('waters', JSON.stringify(state.waters))

      //energies
      state.energies = payload
        .map(v => {
          return v.energia
        })
        .filter(v => {
          return v != undefined
        })
      sessionStorage.setItem('energies', JSON.stringify(state.energies))

      //waste
      state.waste = payload
        .map(v => {
          return v.desechos
        })
        .filter(v => {
          return v != undefined
        })
      sessionStorage.setItem('waste', JSON.stringify(state.waste))

      //sanitation
      state.sanitation = payload
        .map(v => {
          return v.saneamiento
        })
        .filter(v => {
          return v != undefined
        })
      sessionStorage.setItem('sanitation', JSON.stringify(state.sanitation))
    },

    verifyOptions(state, payload) {
      var index = 0
      if (payload.agua) {
        index = state.waters.indexOf(payload.agua)
        if (index === -1) {
          state.waters.push(payload.agua)
          sessionStorage.setItem('waters', JSON.stringify(state.waters))
        }
      }

      index = 0
      if (payload.energia) {
        index = state.energies.indexOf(payload.energia)
        if (index === -1) {
          state.energies.push(payload.energia)
          sessionStorage.setItem('waters', JSON.stringify(state.energies))
        }
      }

      index = 0
      if (payload.desechos) {
        index = state.waste.indexOf(payload.desechos)
        if (index === -1) {
          state.waste.push(payload.desechos)
          sessionStorage.setItem('waters', JSON.stringify(state.waste))
        }
      }

      index = 0
      if (payload.saneamiento) {
        index = state.sanitation.indexOf(payload.saneamiento)
        if (index === -1) {
          state.sanitation.push(payload.saneamiento)
          sessionStorage.setItem('waters', JSON.stringify(state.sanitation))
        }
      }
    },

    establishmentReport(state, payload) {
      state.establishments = payload
      sessionStorage.setItem('establishments', JSON.stringify(state.establishments))
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
          telefono: '',
          ciudad: '',
          parroquia: '',
          canton: 'Riobamba',
          provincia: 'Chimborazo',
          lat: 0,
          lng: 0,
          agua: '',
          saneamiento: '',
          energia: '',
          desechos: '',
          personal: 0
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
    },

    prepareBasicService({ commit }, establishments) {
      commit('syncOptions', establishments)
      return
    },

    updateBasicService({ commit }, establishment) {
      commit('verifyOptions', establishment)
      return
    },

    syncBodyReport({commit}, body){
      commit('establishmentReport', body)
      return
    }
  },

  modules: {}
})
