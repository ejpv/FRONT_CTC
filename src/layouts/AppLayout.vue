<template>
  <div>
    <v-app>
      <v-app-bar color="primary" app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title> Home </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon small>
          <v-icon>fa-info-circle</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" class="pt-4" color="secondary" app>
        <template v-slot:prepend>
          <v-list-item>
            <v-list-item-avatar size="64">
              <v-img src="https://picsum.photos/350/165?random">
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
              @click.native="profileUser"
            >
              <v-icon small> fa-pen </v-icon>
            </v-btn>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <v-list-item @click="redirect">
              <v-list-item-icon class="d-block text-center">
                <v-icon> fa-keyboard</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="d-block text-left"> Teclado</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-icon class="d-block text-center">
                <v-icon> fa-home </v-icon>
              </v-list-item-icon>
              <v-list-item-title class="d-block text-left"> Principal</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-icon class="d-block text-center">
                <v-icon> fa-info </v-icon>
              </v-list-item-icon>
              <v-list-item-title class="d-block text-left">
                Información</v-list-item-title
              >
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-icon class="d-block text-center">
                <v-icon> fa-share </v-icon>
              </v-list-item-icon>
              <v-list-item-title class="d-block text-left"> Compartir</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <template v-slot:append>
          <v-divider></v-divider>
          <v-btn block @click="logOut" right text large tile>
            <v-spacer></v-spacer>
            <h3>Salir</h3>
            <v-icon right>fa-sign-out-alt</v-icon>
          </v-btn>
        </template>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <router-view class="app-container" tag="v-container" fluid fill-height />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data: () => ({
    drawer: false
  }),
  methods: {
    ...mapActions(['closeSesion']),
    profileUser() {
      console.log('aqui redirecciona we')
    },
    logOut() {
      this.closeSesion()
      this.$router.replace('/login')
    },
    redirect() {
      console.log('aqui redirecciona we')
    }
  },
  computed: {
    colorChip() {
      return this.user.rol == 'ADMIN_ROLE'
        ? 'blue'
        : this.user.rol == 'TECHNICAL_ROLE'
        ? 'green'
        : 'orange'
    },
    textoRol() {
      return this.user.rol == 'ADMIN_ROLE'
        ? 'Administrador'
        : this.user.rol == 'TECHNICAL_ROLE'
        ? 'Técnico'
        : 'Representante'
    },
    ...mapState(['user'])
  },
  created() {
    if (this.user.rol == '') {
      this.$router.replace('/login')
    }
  }
}
</script>
