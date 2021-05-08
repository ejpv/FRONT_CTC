<template>
  <div>
    <v-card-text class="pt-6">
      <h3 class="pb-1">Coordenadas actuales: {{ this.marker }}</h3>
      <GmapMap
        :center="center"
        :zoom="12"
        style="height: 500px; width: 100%"
        :options="options"
        @click="updateCoordinates"
      >
        <GmapMarker
          :position="marker"
          :draggable="editable"
          @position_changed="updatePosition"
        />
      </GmapMap>
    </v-card-text>
    <v-card-actions v-if="editable">
      <v-container>
        <v-row>
          <v-col cols="6" class="d-flex justify-space-around pa-0">
            <v-btn text @click="closeComponent">Cancelar</v-btn>
          </v-col>
          <v-col cols="6" class="d-flex justify-space-around pa-0">
            <v-btn text @click="saveData">Guardar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
    <v-card-actions v-else>
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex justify-space-around pa-0">
            <v-btn text @click="closeComponent">Cerrar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  props: ['coordinates', 'mapChange', 'edit'],
  data() {
    return {
      editable: false,
      options: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false
      },
      marker: {},
      center: {}
    }
  },
  methods: {
    updateCoordinates(data) {
      if (this.editable) {
        this.marker = data.latLng
      }
      this.center = data.latLng
    },
    updatePosition(latLng) {
      this.marker = latLng
    },
    closeComponent() {
      this.$emit('close')
    },
    saveData() {
      let data = {
        lat: this.marker.lat(),
        lng: this.marker.lng()
      }
      this.$emit('save', data)
    },
    sync() {
      this.editable = this.edit
      this.marker = {
        lat: parseFloat(this.coordinates.lat),
        lng: parseFloat(this.coordinates.lng)
      }
      this.center = this.marker
    }
  },
  created() {
    this.sync()
  },
  watch: {
    mapChange(val) {
      if (val) {
        this.sync()
      }
    }
  }
}
</script>
