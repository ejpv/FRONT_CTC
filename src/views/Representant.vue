<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de representantes
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un representante"
          single-line
          hide-details
        ></v-text-field>
        <v-switch v-model="erased" label="Representantes borrados"></v-switch>
      </v-card-title>
      <activeRepresentant v-show="!erased" :texto="search" :activator="erased" />
      <erasedRepresentant v-show="erased" :texto="search" :activator="erased" />
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      erased: false,
      search: ''
    }
  }
}
</script>
