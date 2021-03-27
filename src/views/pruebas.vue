<template>
  <div>
    <v-tabs
      show-arrows
      v-model="tabs"
      next-icon="fa-angle-right"
      prev-icon="fa-angle-left"
      fixed-tabs
    >
      <v-tab>Formularios Activos</v-tab>
      <v-tab>Formularios Borrados</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              dark
              large
              color="info"
              fixed
              right
              bottom
              v-on="on"
              v-bind="attrs"
              @click="redirect()"
            >
              <v-icon dark> fa-plus </v-icon>
            </v-btn>
          </template>
          <span> Nuevo Formulario </span>
        </v-tooltip>
        <activeForm v-show="!erased" :activator="erased" />
      </v-tab-item>
      <v-tab-item>
        <v-btn fab large disabled fixed right bottom>
          <v-icon dark> fa-plus </v-icon>
        </v-btn>
        <erasedForm v-show="erased" :activator="erased" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: null
    }
  },
  methods: {
    redirect() {
      //this.$router.push('/editedForm/-1')
      this.$router.push('/pruebas2/-1')
    }
  },
  computed: {
    erased() {
      return this.tabs === 0 ? false : true
    }
  }
}
</script>
