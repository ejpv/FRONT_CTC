<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de áreas protegidas
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un área"
          single-line
          hide-details
        ></v-text-field>
        <v-switch v-model="erased" label="Áreas borradas"></v-switch>
      </v-card-title>
      <activeProtectedArea v-show="!erased" :texto="search" :activator="erased" />
      <erasedProtectedArea v-show="erased" :texto="search" :activator="erased" />
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
