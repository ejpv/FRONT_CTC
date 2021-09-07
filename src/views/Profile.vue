<template>
  <div>
    <v-container fluid fill-height class="loginOverlays">
      <v-layout flex align-center justify-center>
        <v-row>
          <v-col cols="12" sm="12" md="6" lg="4" order-sm="1">
            <v-card outlined elevation="12">
              <v-card-title class="primary white--text mb-2">
                <span class="headline">Avatar y cambio de contraseña</span>
              </v-card-title>
              <div align="center">
                <div>
                  <v-avatar size="200" :tile="!editUser.avatar" class="mt-4">
                    <v-img :src="editUser.avatar || '/image-gallery.svg'">
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-avatar>
                  <v-file-input
                    style="margin-top: -40px; margin-left: 65%"
                    @change="changeAvatar"
                    prepend-icon="fa-pen primary--text"
                    accept="image/png, image/jpeg"
                    hide-input
                  />
                  <v-progress-linear
                    indeterminate
                    v-show="loadingAvatar"
                    color="primary"
                  ></v-progress-linear>
                </div>
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
                    >Cambiar contraseña
                    <v-icon right>fa-pen </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <passUser
                v-if="passSection"
                :cancel="passSection"
                @accion="changeSectionPass"
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="8" order-sm="-1">
            <v-card outlined elevation="12" :loading="loading">
              <v-card-title class="primary white--text mb-2">
                <span class="headline">Información personal</span>
              </v-card-title>
              <v-card :loading="loading" elevation="0">
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
                  <v-row>
                    <v-col>
                      <v-text-field
                        filled
                        rounded
                        dense
                        v-model="editUser.email"
                        :rules="emailRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" sm="1" md="1" lg="1" v-if="!this.user.activado">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-on="on"
                            v-bind="attrs"
                            @click="sendMail()"
                            class="mt-2 blue--text"
                          >
                            fa-envelope
                          </v-icon>
                        </template>
                        <span> Enviar correo para verificación </span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
import Vue from 'vue'
import passUser from '../components/passUser.vue'

export default {
  components: { passUser },
  data() {
    return {
      passSection: false,
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
      loading: false,
      loadingAvatar: false,
      problem: false
    }
  },
  methods: {
    ...mapActions(['loadUserLoged']),
    changeSectionPass() {
      this.passSection = !this.passSection
    },

    async changeUser() {
      this.loading = true
      swalLoading('Editando usuario')
      try {
        await this.$http.put('api/usuario', this.editUser).then(res => {
          this.loading = false
          swalConfirm('Usuario editado')
          sessionStorage.setItem('token', res.body.token)
          sessionStorage.setItem('user', JSON.stringify(res.body.usuario))
          sessionStorage.setItem('expira', res.body.expireAt)
          Vue.http.headers.common['token'] = res.body.token
          //aqui estoy cargando el usuario en storage con lo que se tiene en el sesionstorage
          this.loadUserLoged()
          this.restore()
        })
      } catch (error) {
        this.loading = false
        swalError(
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        )
      }
    },

    async sendMail() {
      this.loading = true
      swalLoading('Enviando correo')
      await this.$http
        .post('api/email/verifica', {
          id: this.user._id
        })
        .then(() => {
          this.loading = false
          swalConfirm('Correo enviado')
        })
        .catch(error => {
          this.$swal.close()
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        })
    },

    restore() {
      const { nombre, _id, apellido, email, activado, avatar } = this.user
      this.editUser.nombre = nombre
      this.editUser._id = _id
      this.editUser.avatar = avatar
      this.editUser.apellido = apellido
      this.editUser.email = email
      this.editUser.activado = activado
    },

    async changeAvatar(file) {
      if (file) {
        this.loadingAvatar = true
        var formData = new FormData()
        formData.append('avatar', file)
        swalLoading('Editando avatar')
        try {
          await this.$http
            .post(`api/avatar/usuario/${this.editUser._id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(res => {
              this.loadingAvatar = false
              swalConfirm('Avatar editado')
              res.json()
              sessionStorage.setItem('user', JSON.stringify(res.body.usuario))
              this.loadUserLoged()
              this.restore()
            })
        } catch (error) {
          this.loadingAvatar = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        }
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.restore()
  }
}
</script>
