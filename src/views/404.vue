<template>
  <v-dialog persistent width="500" v-model="dialog">
    <v-card>
      <v-card-text class="primary white--text" align="center">
        <h2 class="pt-6">ERROR 404</h2>
      </v-card-text>
      <v-card-text>
        <h2 class="mb-2 mt-4">
          Parece que te has perdido, da click en el botón para ir a otro lugar.
        </h2>
      </v-card-text>
      <v-card-actions>
        <v-btn block class="primary" @click="redirect"> Ir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dialog: true
    }
  },
  methods: {
    redirect() {
      if (this.user.rol != '') {
        this.$router.replace('/')
      } else {
        this.$router.replace('/login')
      }   
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style>
</style>