<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de Representantes
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un Representante"
          single-line
          hide-details
        ></v-text-field>
        <v-row>
          <v-col cols="9" sm="5" md="5">
            <v-switch v-model="erased" label="Representantes Borrados"></v-switch>
          </v-col>
        </v-row>
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
