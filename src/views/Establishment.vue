<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de establecimientos
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              class="mr-2 success--text"
              v-on="on"
              v-show="establishments.length > 0"
              :disabled="erased"
              v-bind="attrs"
              @click="download()"
            >
              <v-icon> fa-download </v-icon>
            </v-btn>
          </template>
          <span> Descargar listado de establecimientos</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un establecimiento"
          single-line
          hide-details
        ></v-text-field>
        <v-switch v-model="erased" label="Establecimientos borrados"></v-switch>
      </v-card-title>
      <activeEstablishment v-show="!erased" :texto="search" :activator="erased" />
      <erasedEstablishment v-show="erased" :texto="search" :activator="erased" />
    </v-container>
  </v-card>
</template>

<script>
import { Report } from '@/utils/pdfmake'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      erased: false,
      search: ''
    }
  },

  methods: {
    async download() {
      await Report.openPDF(this.establishments, 'Establecimientos')
    }
  },

  computed: {
    ...mapState(['establishments'])
  }
}
</script>
