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
      <div v-else-if="activate">
        <v-btn
          block
          class="new white--text"
          :disabled="verifiPass"
          @click="activateAccount"
        >
          Establacer Contraseña
        </v-btn>
      </div>
      <div v-else>
        <v-btn block class="new white--text" :disabled="verifiPass" @click="restorePass">
          Guardar
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
export default {
  props: ['cancel', 'token', 'activate'],
  data() {
    return {
      loading: false,
      passwordRules: [v => !!v || 'Contraseña es necesaria'],
      show1: false,
      show: false,
      password: '',
      secondPassword: ''
    }
  },
  methods: {
    async changePass() {
      this.loading = true
      swalLoading('Actualizando contraseña')
      try {
        await this.$http
          .post('api/usuario/changePass', { password: this.password })
          .then(() => {
            this.loading = false
            swalConfirm('Contraseña actualizada')
          })
        this.changeSection()
      } catch (error) {
        this.loading = false
        swalError(
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        )
      }
    },

    changeSection() {
      this.$emit('accion')
      this.password = ''
      this.secondPassword = ''
    },

    async restorePass() {
      swalLoading('Actualizando contraseña')
      let headers = {
        'Content-Type': 'application/json;charset=utf-8'
      }

      if (this.token !== '') {
        headers['token'] = this.token
      }

      this.loading = true
      try {
        await this.$http
          .post('api/usuario/password', { password: this.password }, { headers })
          .then(() => {
            this.loading = false
            swalConfirm('Contraseña actualizada')
            this.$emit('accion')
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

    async activateAccount() {
      let headers = {
        'Content-Type': 'application/json;charset=utf-8'
      }

      if (this.token !== '') {
        headers['token'] = this.token
      }
      this.loading = true
      swalLoading('Estableciendo contraseña')
      try {
        await this.$http
          .post('api/usuario/activar', { password: this.password }, { headers })
          .then(() => {
            this.loading = false
            swalConfirm('Contraseña establecida')
            this.$emit('accion')
          })
      } catch (error) {
        this.loading = false
        swalError(
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        )
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
