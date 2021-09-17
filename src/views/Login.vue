<template>
  <v-container fluid fill-height class="loginOverlay">
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm9 md7 lg4>
        <v-row class="mb-2 mt-0 pt-0">
          <v-col class="d-flex child-flex" style="margin-right: -20px">
            <v-img contain src="/img/municipio-login.png" aspect-ratio="2">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
          <v-col class="d-flex child-flex" style="margin-left: -20px">
            <v-img contain src="/img/unach-login.png" aspect-ratio="2">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
        <v-card color="primary" outlined elevation-6> 
          <v-card-text class="white--text" align="center">
            <h2 class="pa-0 ma-0">
              <v-avatar class="profile pa-0 ma-0" size="64" tile>
                <v-img contain src="/img/logo.png"> </v-img>
              </v-avatar>
              SPT - Sistema de Prestadores Turísticos
            </h2>
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
                  autocomplete="off"
                  v-model.trim="email"
                  :rules="emailRules"
                ></v-text-field>
                <h3>Contraseña</h3>
                <v-text-field
                  autocomplete="off"
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
      email: '',
      password: '',
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
          .post('api/login', {
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
            if (this.user.rol === 'TECHNICAL_ROLE') {
              this.$router.replace('/selectEstablishment')
            } else {
              this.$router.replace('/')
            }
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

<style lang="scss">
.loginOverlay {
  background-image: url('../../public/img/riobamba-fondo-login.png');
  background-size: 13% 40%;
  background-repeat: space round;
}
</style>