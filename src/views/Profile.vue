<template>
  <div>
    <v-container fluid fill-height class="loginOverlay">
      <v-layout flex align-center justify-center>
        <v-row align="center">
          <v-col cols="12" sm="12" md="5" lg="4" order-sm="1">
            <v-card outlined elevation="12">
              <v-card-title class="primary white--text mb-2">
                <span class="headline">Avatar y Contraseña</span>
              </v-card-title>
              <div align="center">
                <v-btn class="primary mt-4" elevation="12" fab absolute small>
                  <v-icon> fa-pen </v-icon>
                </v-btn>
                <v-avatar size="200">
                  <v-img src="https://picsum.photos/350/165?random">
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular
                          indeterminate
                          color="new"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-avatar>
              </div>
              <v-row class="pt-2">
                <v-col></v-col>
                <v-col align="center" class="mr-2">
                  <v-btn
                    @click="changeSectionPass"
                    v-if="!passSection"
                    color="edit"
                    dark
                    class="mb-2"
                    >Cambiar Contraseña
                    <v-icon right>fa-pen </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-container v-if="passSection" fluid>
                <v-card :loading="loadingPass" elevation="0">
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
                    Contraseñas deben ser iguales
                  </div>
                  <v-row>
                    <v-col cols="6" align="center">
                      <v-btn v-if="passSection" @click="changeSectionPass" text>
                        Cancelar
                      </v-btn>
                    </v-col>
                    <v-col cols="6" align="center">
                      <v-btn text :disabled="verifiPass" @click="changePass">
                        Guardar
                      </v-btn></v-col
                    >
                  </v-row>
                </v-card>
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="7" lg="8" order-sm="-1">
            <v-card outlined elevation="12" :loading="loadingUser">
              <v-card-title class="primary white--text mb-2">
                <span class="headline">Información Personal</span>
              </v-card-title>
              <v-card :loading="loadingUser" elevation="0">
                <v-container>
                  <h3 class="pt-2 pb-1">Nombre</h3>
                  <v-text-field
                    filled
                    rounded
                    dense
                    v-model="editUser.nombre"
                    :rules="fieldRules"
                  ></v-text-field>

                  <h3 class="pb-1">Apellido</h3>
                  <v-text-field
                    filled
                    rounded
                    dense
                    v-model="editUser.apellido"
                    :rules="fieldRules"
                  ></v-text-field>

                  <h3 class="pb-1">Correo</h3>
                  <v-text-field
                    filled
                    rounded
                    dense
                    v-model="editUser.email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-container>
              </v-card>
              <v-row>
                <v-col cols="6" align="center">
                  <v-btn @click="restore" text> Reestablecer </v-btn>
                </v-col>
                <v-col cols="6" align="center">
                  <v-btn text @click="changeUser"> Guardar </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-layout>
    </v-container>
    <div class="text-center">
      <v-snackbar v-model="snackbar" color="error" :timeout="-1">
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn color="" text v-bind="attrs" @click="snackbar = false"> Cerrar </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Vue from 'vue'

export default {
  data() {
    return {
      passSection: false,
      password: '',
      secondPassword: '',
      message: '',
      show: false,
      snackbar: false,
      show1: false,
      passwordRules: [v => !!v || 'Contraseña es necesaria'],
      editUser: {
        _id: '',
        avatar: '',
        nombre: '',
        apellido: '',
        email: '',
        activado: true
      },
      fieldRules: [
        v => !!v || 'Campo necesario',
        v => (v && v.length >= 3) || 'Debe tener mas de 3 letras'
      ],
      emailRules: [
        v => !!v || 'Correo es necesario',
        v => /.+@.+\..+/.test(v) || 'El correo tiene que ser válido'
      ],
      loadingUser: false,
      loadingPass: false,
      problem: false
    }
  },
  methods: {
    ...mapActions(['loadUserLoged']),
    changeSectionPass() {
      this.passSection = !this.passSection
      this.password = ''
      this.secondPassword = ''
    },
    async changePass() {
      this.snackbar = false
      this.loadingPass = true
      try {
        await this.$http
          .post('/api/usuario/changePass', { password: this.password })
          .then(() => {
            this.loadingPass = false
            this.$swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              icon: 'success',
              title: 'Contraseña Actualizada'
            })
          })
      } catch (error) {
        this.loadingPass = false
        this.message =
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        this.snackbar = true
      }
    },

    async changeUser() {
      this.snackbar = false
      this.loadingUser = true
      try {
        await this.$http
          .put(`/api/usuario/${this.editUser._id}`, this.editUser)
          .then(res => {
            this.loadingUser = false
            this.$swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              icon: 'success',
              title: 'Usuario editado'
            })
            sessionStorage.setItem('token', res.body.token)
            sessionStorage.setItem('user', JSON.stringify(res.body.usuario))
            sessionStorage.setItem('expira', res.body.expireAt)
            Vue.http.headers.common['token'] = res.body.token
            //aqui estoy cargando el usuario en storage con lo que se tiene en el sesionstorage
            this.loadUserLoged()
            this.restore()
          })
      } catch (error) {
        this.loadingUser = false
        this.message =
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        this.snackbar = true
      }
    },
    restore() {
      let { nombre, _id, apellido, email, activado } = this.user
      this.editUser.nombre = nombre
      this.editUser._id = _id
      this.editUser.apellido = apellido
      this.editUser.email = email
      this.editUser.activado = activado
    }
  },
  computed: {
    verifiPass() {
      return this.password === this.secondPassword ? false : true
    },
    ...mapState(['user'])
  },
  created() {
    this.restore()
  }
}
</script>
