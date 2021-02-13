<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card v-show="dialog">
      <v-system-bar color="primary" class="pa-4 white--text"
        >Sesión expirada<v-spacer></v-spacer>
        <v-icon @click="onClose()" color="white" size="22">far fa-times-circle</v-icon>
      </v-system-bar>

      <v-avatar size="60">
        <v-icon color="primary" size="50">fa-info-circle</v-icon>
      </v-avatar>

      <span class="primary--text">
        Para extender la sesión por favor ingrese nuevamente.
      </span>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="onClose"> volver a ingresar </v-btn>
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
