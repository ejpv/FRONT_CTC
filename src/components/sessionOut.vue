<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card v-show="dialog">
      <v-card-text class="primary white--text" align="center">
        <h2 class="pt-2">Sesión expirada</h2>
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
              Para extender la sesión por favor ingrese nuevamente.
            </span></v-col
          >
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="onClose"> Volver a ingresar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { timeLeft } from '@/utils/auth'
import { hasValidToken } from '@/utils/auth'

export default {
  data() {
    return { dialog: false }
  },

  created: function() {
    this.launch()
  },

  methods: {
    ...mapActions(['closeSesion']),

    launch() {
      setTimeout(() => {
        if (!hasValidToken()) this.dialog = true
      }, timeLeft())
    },

    onClose() {
      this.closeSesion()
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>
