<template>
  <div>
    <v-tabs fixed-tabs v-model="tabs">
      <v-tab>Formularios Activos</v-tab>
      <v-tab>Formularios Borrados</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <activeForm v-show="!erased" :activator="erased" />
      </v-tab-item>
      <v-tab-item>
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
  computed: {
    erased() {
      return this.tabs === 0 ? false : true
    }
  }
}
</script>
