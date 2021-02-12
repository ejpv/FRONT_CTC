<template>
  <div>
    <v-app>
      <v-app-bar color="primary" app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title> {{ this.$route.name }} </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon small class="info mr-1">
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
              @click="profileUser"
            >
              <v-icon small> fa-pen </v-icon>
            </v-btn>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <div v-for="(item, n) in links" :key="n">
              <v-list-item
                @click="redirect(item.link)"
                :class="`${n != 0 ? 'mt-2' : ''}`"
              >
                <v-list-item-icon class="d-block text-center">
                  <v-icon>{{ item.icon }} </v-icon>
                </v-list-item-icon>
                <v-list-item-title class="d-block text-left">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
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
    drawer: false,
    links: [
      {
        title: 'Inicio',
        icon: 'fa-home',
        link: '/'
      },
      {
        title: 'Usuarios',
        icon: 'fa-users',
        link: '/users'
      },
      {
        title: 'Prueba',
        icon: 'fa-vial',
        link: '/test'
      }
    ]
  }),
  methods: {
    ...mapActions(['closeSesion']),
    profileUser() {
      this.$router.replace('/profile')
    },
    logOut() {
      this.closeSesion()
      this.$router.replace('/login')
    },
    redirect(item) {
      this.$router.push(item)
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
    ...mapState(['user'])
  },
  created() {
    if (this.user.rol == '') {
      this.$router.replace('/login')
    }
  }
}
</script>
