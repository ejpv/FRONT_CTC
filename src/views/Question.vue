<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de preguntas
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque una pregunta"
          single-line
          hide-details
        ></v-text-field>
        <v-row>
          <v-col cols="8" sm="5" md="4">
            <v-switch v-model="erased" label="Preguntas borradas"></v-switch>
          </v-col>
        </v-row>
      </v-card-title>
      <activeQuestion v-show="!erased" :texto="search" :activator="erased" />
      <erasedQuestion v-show="erased" :texto="search" :activator="erased" />
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
