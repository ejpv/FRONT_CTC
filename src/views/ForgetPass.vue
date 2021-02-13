<template>
  <v-container fluid fill-height class="loginOverlay">
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-card color="primary" outlined>
          <v-card-text class="white--text" align="center">
            <h2 class="pt-2">Reestablecer Contraseña</h2>
          </v-card-text>
        </v-card>
        <v-form @submit.prevent="sendEmail" ref="form">
          <v-card :loading="loading">
            <v-container>
              <v-container>
                <p>Ingrese su correo electrónico:</p>
                <v-text-field
                  filled
                  rounded
                  dense
                  v-model.trim="email"
                  :rules="emailRules"
                ></v-text-field>
                <p>
                  Se enviará un email a este correo para que pueda reestablecer la
                  contraseña de su cuenta
                </p>
                <v-card-actions>
                  <v-btn type="submit" class="primary"> Enviar </v-btn>
                  <v-spacer></v-spacer>
                  <router-link to="/login" tag="button">
                    <v-btn class="warning" v-if="color === 'success'"> Volver </v-btn>
                  </router-link>
                </v-card-actions>
              </v-container>
            </v-container>
          </v-card>
        </v-form>
        <div class="text-center">
          <v-snackbar v-model="snackbar" :color="color" :timeout="-1">
            {{ message }}
            <template v-slot:action="{ attrs }">
              <v-btn color="" text v-bind="attrs" @click="snackbar = false">
                Cerrar
              </v-btn>
            </template>
          </v-snackbar>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      email: 'erickjpv@hotmail.es',
      message: '',
      loading: false,
      snackbar: false,
      color: '',
      emailRules: [
        v => !!v || 'Correo es necesario',
        v => /.+@.+\..+/.test(v) || 'El correo tiene que ser válido'
      ]
    }
  },
  methods: {
    sendEmail() {
      if (this.$refs.form.validate()) {
        this.snackbar = false
        this.loading = true
        this.$http
          .post('/api/email/restaura', {
            email: this.email
          })
          .then(() => {
            this.color = 'success'
            this.message = 'Mensaje enviado correctamente'
            this.snackbar = true
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.color = 'error'
            this.message =
              error.body.err != undefined
                ? error.body.err.message
                : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
            this.snackbar = true
            console.log(error.body)
          })
      } else {
        console.log('no valida')
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