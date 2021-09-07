<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de usuarios
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un usuario"
          single-line
          hide-details
        ></v-text-field>
        <v-row>
          <v-col cols="7" sm="5" md="3">
            <v-switch v-model="erased" label="Usuarios borrados"></v-switch>
          </v-col>
        </v-row>
      </v-card-title>
      <activeUser v-show="!erased" :texto="search" :activator="erased" />
      <erasedUser v-show="erased" :texto="search" :activator="erased" />
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
  },
  methods: {
    change() {
      this.erased = !this.erased
    }
  }
}
</script>
