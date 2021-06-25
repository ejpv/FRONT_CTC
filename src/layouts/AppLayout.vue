<template>
  <div>
    <v-app>
      <ctc-session-out />

      <v-app-bar color="primary" app>
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
          class="white--text"
        ></v-app-bar-nav-icon>
        <v-toolbar-title class="white--text"> {{ this.$route.name }} </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-autocomplete
          v-if="user.rol === 'TECHNICAL_ROLE'"
          v-model="editedEstablishment"
          :items="establishments"
          item-text="nombre"
          persistent-hint
          @input="changeEstablishement"
          return-object
          single-line
          filled
          rounded
          dense
          dark
          :loading="loading"
          class="mt-7"
        ></v-autocomplete>
        <v-btn
          v-if="user.rol === 'TECHNICAL_ROLE'"
          icon
          @click="getEstablishments()"
          class="pa-0 ma-0 white--text"
        >
          <v-icon> fa-sync-alt </v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" class="pt-4" color="secondary" app>
        <template v-slot:prepend>
          <v-list-item>
            <v-list-item-avatar size="70" :tile="!user.avatar">
              <v-img :src="user.avatar || '/image-gallery.svg'">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ user.nombre }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.apellido }}</v-list-item-subtitle>
              <div class="d-flex justify-left">
                <v-chip text-color="white" :color="colorChip" draggable small fill>
                  <v-avatar left>
                    <v-icon small> fa-user </v-icon>
                  </v-avatar>
                  {{ textoRol }}
                </v-chip>
              </div>
            </v-list-item-content>
            <v-btn
              class="primary mt-4"
              elevation="0"
              fab
              right
              bottom
              absolute
              x-small
              to="/profile"
            >
              <v-icon small> fa-pen </v-icon>
            </v-btn>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list nav dense shaped>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <div v-for="(item, n) in links" :key="n">
              <div v-if="verifyRol(item)">
                <v-list-item :to="item.link" exact :class="`${n != 0 ? 'mt-2' : ''}`">
                  <v-list-item-icon class="d-block text-center">
                    <v-icon>{{ item.icon }} </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="d-block text-left">
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
              </div>
            </div>
          </v-list-item-group>
        </v-list>
        <template v-slot:append>
          <v-divider></v-divider>
          <v-btn block @click="logOut" right text large tile class="primary black--text">
            <v-spacer></v-spacer>
            <h3>Salir</h3>
            <v-icon right>fa-sign-out-alt</v-icon>
          </v-btn>
        </template>
      </v-navigation-drawer>

      <v-main>
        <v-container fluid fill-height v-if="this.$route.path === '/'">
          <v-layout flex align-center justify-center>
            <v-flex xs12>
              <v-img contain src="/img/logo.png" aspect-ratio="4">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <h1 class="text-center">CTC</h1>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container v-else>
          <router-view class="app-container" tag="v-container" fluid fill-height />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'
import { mapActions, mapState } from 'vuex'
export default {
  data: () => ({
    drawer: false,
    links: [
      {
        title: 'Inicio',
        icon: 'fa-home',
        rol: 'noMatter',
        link: '/'
      },
      {
        title: 'Usuarios',
        icon: 'fa-users',
        rol: 'ADMIN_ROLE',
        link: '/users'
      },
      {
        title: 'Establecimientos',
        icon: 'fa-store-alt',
        rol: 'ADMIN_ROLE',
        link: '/establishment'
      },
      {
        title: 'Representantes',
        icon: 'fa-user-tag',
        rol: 'ADMIN_ROLE',
        link: '/representant'
      },
      {
        title: 'Áreas Protegidas',
        icon: 'fa-map-marked-alt',
        rol: 'ADMIN_ROLE',
        link: '/protectedArea'
      },
      {
        title: 'Formularios',
        icon: 'fa-clipboard-list',
        rol: 'ADMIN_ROLE',
        link: '/form'
      },
      {
        title: 'Preguntas',
        icon: 'fa-list-ol',
        rol: 'ADMIN_ROLE',
        link: '/question'
      },
      {
        title: 'Información básica',
        rol: 'TECHNICAL_ROLE',
        icon: 'fa-store-alt',
        link: '/editEstablishment'
      },
      {
        title: 'Diagnósticos',
        icon: 'fa-file-medical-alt',
        rol: 'TECHNICAL_ROLE',
        link: '/selectForm'
      },
      {
        title: 'Informes',
        rol: 'ADMIN_ROLE',
        icon: 'fa-book-open',
        link: '/reports'
      },
      {
        title: 'Realizar Informes',
        rol: 'TECHNICAL_ROLE',
        icon: 'fa-book-open',
        link: '/technicalInform'
      },
      {
        title: 'Estado de Informes',
        rol: 'TECHNICAL_ROLE',
        icon: 'fa-folder-open',
        link: '/statusInform'
      },
      {
        title: 'Información Básica',
        rol: 'REPRESENTANT_ROLE',
        icon: 'fa-user-tag',
        link: '/informationRepresentant'
      },
      {
        title: 'Diagnósticos',
        rol: 'REPRESENTANT_ROLE',
        icon: 'fa-file-medical-alt',
        link: '/diagnosticRepresentant'
      },
      {
        title: 'Informes',
        rol: 'REPRESENTANT_ROLE',
        icon: 'fa-folder-open',
        link: '/reportRepresentant'
      },
      {
        title: 'Actividades Turísticas',
        icon: 'fa-hiking',
        rol: 'ADMIN_ROLE',
        link: '/activity'
      }
    ],
    establishments: [],
    editedEstablishment: {}
  }),
  methods: {
    ...mapActions(['closeSesion', 'prepareEnvironment']),

    profileUser() {
      this.$router.replace('/profile')
    },

    logOut() {
      this.closeSesion()
      this.$router.replace('/login')
    },

    verifyRol(item) {
      return this.user.rol == item.rol ? true : item.rol === 'noMatter' ? true : false
    },

    async getEstablishments() {
      this.loading = true
      this.establishments = []
      await this.$http
        .get('api/establecimientos')
        .then(res => {
          this.loading = false
          this.establishments = res.data.data
        })
        .catch(error => {
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        })
    },

    changeEstablishement() {
      if (this.editedEstablishment) {
        sessionStorage.setItem('establishment', JSON.stringify(this.editedEstablishment))
        this.prepareEnvironment()
      }
    },

    security(item) {
      var actualPage = this.links.filter(v => {
        return v.link === item ? v : false
      })
      if (actualPage[0]) {
        if (actualPage[0].rol != this.user.rol && actualPage[0].rol != 'noMatter') {
          this.$router.replace('/unknowPage')
        }
      }
    }
  },

  computed: {
    colorChip() {
      return this.user.rol == 'ADMIN_ROLE'
        ? 'blue accent-4'
        : this.user.rol == 'TECHNICAL_ROLE'
        ? 'green accent-4'
        : 'orange accent-4'
    },

    textoRol() {
      return this.user.rol == 'ADMIN_ROLE'
        ? 'Administrador'
        : this.user.rol == 'TECHNICAL_ROLE'
        ? 'Técnico'
        : 'Representante'
    },
    ...mapState(['user', 'establishment'])
  },

  async created() {
    if (this.user.rol == '') {
      this.$router.replace('/login')
    } else {
      if (this.user.rol === 'TECHNICAL_ROLE') {
        if (JSON.parse(sessionStorage.getItem('establishment'))) {
          await this.getEstablishments()
          this.editedEstablishment = JSON.parse(sessionStorage.getItem('establishment'))
        } else {
          this.$router.replace('/selectEstablishment')
        }
      }
    }
  },

  watch: {
    '$route.path'(v) {
      this.security(v)
    },

    establishment(v) {
      if (v) {
        this.getEstablishments()
        this.editedEstablishment = this.establishment
      }
    }
  }
}
</script>
