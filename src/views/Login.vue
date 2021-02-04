<template>
  <v-container fluid fill-height class="loginOverlay">
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-card color="primary" outlined>
          <v-card-text class="white--text" align="center">
            <h2 class="pt-4">CTC - Calidad Turismo Comunitario</h2>
          </v-card-text>
        </v-card>
        <v-card :loading="loading">
          <v-card-text class="pt-4">
            <v-container>
              <v-form @submit.prevent="login" ref="form">
                <h3>Correo</h3>
                <v-text-field
                  filled
                  rounded
                  dense
                  v-model.trim="email"
                  :rules="emailRules"
                ></v-text-field>
                <h3>Contraseña</h3>
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
                <v-card-actions>
                  <v-btn type="submit" class="primary"> Ingresar </v-btn>
                  <v-spacer></v-spacer>
                  <router-link to="/forgetPass"> Olvidaste tu contraseña? </router-link>
                </v-card-actions>
              </v-form>
              <div class="text-center">
                <v-snackbar v-model="snackbar" color="error" :timeout="-1">
                  {{ message }}
                  <template v-slot:action="{ attrs }">
                    <v-btn color="" text v-bind="attrs" @click="snackbar = false">
                      Cerrar
                    </v-btn>
                  </template>
                </v-snackbar>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      email: 'user@prueba.com',
      password: 'passADM',
      message: '',
      show: false,
      snackbar: false,
      loading: false,
      emailRules: [
        v => !!v || 'Correo es necesario',
        v => /.+@.+\..+/.test(v) || 'El correo tiene que ser válido'
      ],
      passwordRules: [v => !!v || 'Contraseña es necesaria']
    }
  },
  methods: {
    ...mapActions(['loadUserLoged']),
    login() {
      if (this.$refs.form.validate()) {
        this.snackbar = false
        this.loading = true
        this.$http
          .post('/api/login', {
            email: this.email,
            password: this.password
          })
          .then(data => {
            this.loading = false
            sessionStorage.setItem('token', data.body.token)
            sessionStorage.setItem('user', JSON.stringify(data.body.usuario))
            sessionStorage.setItem('expira', data.body.expireAt)
            //aqui estoy cargando el usuario en storage con lo que se tiene en el sesionstorage
            this.loadUserLoged()
            this.$router.replace('/')
          })
          .catch(error => {
            this.loading = false
            this.message =
              error.body.err != undefined
                ? error.body.err.message
                : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
            this.snackbar = true
          })
      }
    }
  },
  computed: {
    name() {
      return this.data
    }
  }
}
</script>

<style>
</style>