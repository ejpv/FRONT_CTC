<template>
  <v-container fluid fill-height class="loginOverlay primary">
    <v-layout flex align-center justify-center class="secondary">
      <v-flex xs12 sm9 md7 lg4 elevation-6>
        <v-card color="primary" outlined>
          <v-card-text class="white--text" align="center">
            <h2 class="pt-2">CTC - Calidad Turismo Comunitario</h2>
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
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import { swalError } from '@/utils/notify'
import { mapActions, mapState } from 'vuex'
import Vue from 'vue'

export default {
  data() {
    return {
      email: 'erickjpv@hotmail.es',
      password: 'passADM',
      message: '',
      show: false,
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
        this.loading = true
        this.$http
          .post('/api/login', {
            email: this.email,
            password: this.password
          })
          .then(res => {
            this.loading = false
            sessionStorage.setItem('token', res.body.token)
            sessionStorage.setItem('user', JSON.stringify(res.body.usuario))
            sessionStorage.setItem('expira', res.body.expireAt)
            Vue.http.headers.common['token'] = res.body.token
            //aqui estoy cargando el usuario en storage con lo que se tiene en el sesionstorage
            this.loadUserLoged()
            this.$router.replace('/')
          })
          .catch(error => {
            swalError(
              error.body.err != undefined
                ? error.body.err.message
                : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
            )
            this.loading = false
          })
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    if (this.user.rol != '') {
      this.$router.replace('/')
    }
  }
}
</script>

<style>
</style>