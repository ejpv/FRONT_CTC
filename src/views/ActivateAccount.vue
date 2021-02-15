<template>
  <v-container fluid fill-height class="loginOverlay">
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm9 md7 lg4 elevation-6 v-if="!this.pass">
        <v-card outlined>
          <v-card-text class="primary white--text" align="center">
            <h2 class="pt-2">Activación de Cuenta</h2>
          </v-card-text>
          <v-card-text>
            <h3>
              Hola nuevo usuario, Bienvenido al equipo de CTC, por favor establezca una
              contraseña para su cuenta.
            </h3>
          </v-card-text>
          <passUser :token="tokenUrl" @accion="redirect" :activate="!this.pass"/>
        </v-card>
      </v-flex>
      <v-dialog v-model="dialog" persistent width="500">
        <v-card v-show="loading">
          <v-container>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-row>
          </v-container>
        </v-card>
        <v-card v-show="dialog" v-if="!loading">
          <v-card-text class="primary white--text" align="center">
            <h2 class="pt-6">Confirmación de Correo Electrónico</h2>
          </v-card-text>
          <v-container>
            <v-row>
              <v-col cols="2"
                ><v-avatar size="60" class="pl-2">
                  <v-icon color="primary" size="50">fa-check-circle</v-icon>
                </v-avatar></v-col
              >
              <v-col cols="10"
                ><span class="primary--text">
                  Gracias por confirmar tu dirección de correo electrónico, puedes
                  continar dando click en el botón.
                </span></v-col
              >
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="onClose"> Continuar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <div class="text-center">
      <v-snackbar v-model="snackbar" color="error" :timeout="-1">
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false"> Cerrar </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      tokenUrl: this.$route.params.token,
      dialog: false,
      loading: false,
      snackbar: false,
      message: ''
    }
  },
  async created() {
    if (this.pass) {
      this.dialog = true
      this.snackbar = false
      this.loading = true

      let headers = {
        'Content-Type': 'application/json;charset=utf-8'
      }

      if (this.tokenUrl !== '') {
        headers['token'] = this.tokenUrl
      }

      try {
        await this.$http
          .post('/api/usuario/confirmarEmail', null, { headers })
          .then(() => {
            this.loading = false
            this.dialog = true
          })
      } catch (error) {
        this.loading = false
        this.message =
          error.body.err != undefined
            ? error.body.err.message +
              ', recargue la página o intente enviar el correo nuevamente.'
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        this.snackbar = true
        this.dialog = false
      }
    }
  },
  methods: {
    onClose() {
      if (this.user.rol != '') {
        this.$router.replace('/')
      } else {
        this.$router.replace('/login')
      }
    },
    redirect() {
      this.$router.replace('/login')
    }
  },
  computed: {
    ...mapState(['user']),
    pass() {
      return this.$route.params.password === 'true' ? true : false
    }
  }
}
</script>
