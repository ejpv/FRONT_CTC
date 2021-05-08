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
                    <v-btn class="warning"> Volver </v-btn>
                  </router-link>
                </v-card-actions>
              </v-container>
            </v-container>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { swalError, swalLoading, swalConfirm } from '@/utils/notify'
export default {
  data() {
    return {
      email: 'erickjpv@hotmail.es',
      loading: false,
      emailRules: [
        v => !!v || 'Correo es necesario',
        v => /.+@.+\..+/.test(v) || 'El correo tiene que ser válido'
      ]
    }
  },
  methods: {
    sendEmail() {
      if (this.$refs.form.validate()) {
        this.loading = true
        swalLoading('Enviando correo')
        this.$http
          .post('/api/email/restaura', {
            email: this.email
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
