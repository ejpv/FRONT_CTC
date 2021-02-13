<template>
  <v-container fluid>
    <v-card :loading="loading" elevation="0">
      <h3 class="mt-4">Nueva Contraseña</h3>
      <v-text-field
        filled
        rounded
        dense
        :rules="passwordRules"
        v-model="password"
        :type="show ? 'text' : 'password'"
        :append-icon="show ? 'fa-eye' : 'fa-eye-slash'"
        @click:append="show = !show"
      ></v-text-field>
      <h3>Repita su Contraseña</h3>
      <v-text-field
        filled
        rounded
        dense
        :rules="passwordRules"
        v-model="secondPassword"
        :type="show1 ? 'text' : 'password'"
        :append-icon="show1 ? 'fa-eye' : 'fa-eye-slash'"
        @click:append="show1 = !show1"
      ></v-text-field>
      <div v-if="verifiPass" class="error--text">
        <span v-if="password != ''">Contraseñas deben ser iguales</span>
      </div>
      <div v-if="cancel">
        <v-row>
          <v-col cols="6" align="center">
            <v-btn @click="changeSection" text> Cancelar </v-btn>
          </v-col>
          <v-col cols="6" align="center">
            <v-btn text :disabled="verifiPass" @click="changePass">
              Guardar
            </v-btn></v-col
          >
        </v-row>
      </div>
      <div v-else align="center">
        <v-btn block class="new white--text" :disabled="verifiPass" @click="restorePass">
          Guardar
        </v-btn>
      </div>
    </v-card>
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
export default {
  props: ['cancel', 'token'],
  data() {
    return {
      loading: false,
      passwordRules: [v => !!v || 'Contraseña es necesaria'],
      show1: false,
      show: false,
      password: '',
      secondPassword: '',
      message: '',
      snackbar: ''
    }
  },
  methods: {
    async changePass() {
      this.snackbar = false
      this.loading = true
      try {
        await this.$http
          .post('/api/usuario/changePass', { password: this.password })
          .then(() => {
            this.loading = false
            this.$swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              icon: 'success',
              title: 'Contraseña Actualizada'
            })
          })
          this.changeSection()
      } catch (error) {
        this.loading = false
        this.message =
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        this.snackbar = true
      }
    },
    changeSection() {
      this.$emit('accion')
      this.password = ''
      this.secondPassword = ''
    },
    async restorePass() {
      let headers = {
        'Content-Type': 'application/json;charset=utf-8'
      }

      if (this.token !== '') {
        headers['token'] = this.token
      }

      this.snackbar = false
      this.loading = true
      try {
        await this.$http
          .post('/api/usuario/password', { password: this.password }, { headers })
          .then(() => {
            this.loading = false
            this.$swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              icon: 'success',
              title: 'Contraseña Actualizada'
            })
            this.$emit('accion')
          })
      } catch (error) {
        this.loading = false
        this.message =
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        this.snackbar = true
      }
    }
  },
  computed: {
    verifiPass() {
      return this.password === this.secondPassword && this.password != '' ? false : true
    }
  }
}
</script>