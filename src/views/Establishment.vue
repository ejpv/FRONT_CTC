<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de Establecimientos
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un Establecimiento"
          single-line
          hide-details
        ></v-text-field>
        <v-row>
          <v-col cols="9" sm="7" md="4">
            <v-switch v-model="erased" label="Establecimientos Borrados"></v-switch>
          </v-col>
        </v-row>
      </v-card-title>
      <activeEstablishment v-show="!erased" :texto="search" :activator="erased" />
      <erasedEstablishment v-show="erased" :texto="search" :activator="erased" />
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
