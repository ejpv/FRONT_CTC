<template>
  <v-container fluid fill-height class="loginOverlay">
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm9 md7 lg4 elevation-6>
        <v-card color="primary" outlined>
          <v-card-text class="white--text" align="center">
            <h2 class="pt-2">Reestablecer contraseña</h2>
          </v-card-text>
        </v-card>
        <passUser :token="tokenUrl" @accion="redirect" />
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" persistent width="500">
      <v-card v-show="dialog">
        <v-card-text class="primary white--text" align="center">
          <h2 class="pt-6">Restauración de contraseña expirada</h2>
        </v-card-text>
        <v-container>
          <v-row>
            <v-col cols="2"
              ><v-avatar size="60" class="pl-2">
                <v-icon color="primary" size="50">fa-info-circle</v-icon>
              </v-avatar></v-col
            >
            <v-col cols="10"
              ><span class="primary--text">
                El mensaje de restauración de contraseña ya expiró, por favor envie el
                mensaje nuevamente.
              </span></v-col
            >
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="onClose"> Volver a enviar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      tokenUrl: this.$route.params.token,
      expiresAt: this.$route.params.exp,
      dialog: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    redirect() {
      this.$router.replace('/login')
    },
    launch() {
      if (this.expiresAt) {
        const now = new Date()
        this.dialog = !(now.getTime() < Number(this.expiresAt) * 1000)
      }
    },
    onClose() {
      this.$router.replace('/forgetPass')
    }
  },
  created() {
    if (this.user.rol != '') {
      this.$router.replace('/')
    }
    this.launch()
  }
}
</script>
