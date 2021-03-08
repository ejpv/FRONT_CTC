<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de Lugares
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un Lugar"
          single-line
          hide-details
        ></v-text-field>
        <v-row>
          <v-col cols="7" sm="5" md="4">
            <v-switch v-model="erased" label="Lugares Borrados"></v-switch>
          </v-col>
        </v-row>
      </v-card-title>
      <activePlace v-show="!erased" :texto="search" :activator="erased" />
      <erasedPlace v-show="erased" :texto="search" :activator="erased" />
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