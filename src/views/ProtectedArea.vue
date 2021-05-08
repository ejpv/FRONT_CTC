<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de Áreas Protegidas
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un Área"
          single-line
          hide-details
        ></v-text-field>
        <v-row>
          <v-col cols="7" sm="5" md="4">
            <v-switch v-model="erased" label="Áreas Borradas"></v-switch>
          </v-col>
        </v-row>
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
