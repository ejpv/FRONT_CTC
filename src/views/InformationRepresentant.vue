<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6">
        <v-container>
          <v-card>
            <v-card-title class="primary white--text">
              Información del Representante
            </v-card-title>
            <v-container v-if="representant.nombre">
              <v-container>
                <h3 class="pb-2 pt-1">Nombre</h3>
                {{ representant.nombre }}
                <h3 class="pb-2 pt-1">Apellido</h3>
                {{ representant.apellido }}
                <h3 class="pb-2 pt-1">Direccion</h3>
                {{ representant.direccion }}
                <h3 class="pb-2 pt-1">Correo</h3>
                {{ representant.email }}
                <h3 class="pb-2 pt-1">Teléfono</h3>
                {{ representant.telefono }}
              </v-container>
            </v-container>
          </v-card>
          <v-card class="pt-1 pb-1" flat>
            <v-progress-linear
              indeterminate
              color="primary"
              v-show="loading"
            ></v-progress-linear>
          </v-card>
        </v-container>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title class="primary white--text">
            Información del Establecimiento
          </v-card-title>
          <v-container>
            <v-container>
              <div v-if="establishment._id">
                <h3 class="pb-2 pt-1">Nombre</h3>
                {{ establishment.nombre }}
                <h3 class="pb-2 pt-1">Correo</h3>
                {{ establishment.email ? establishment.email : 'No tiene Correo' }}
                <h3 class="pb-2 pt-1">Registro</h3>
                {{
                  establishment.registro ? establishment.registro : 'No tiene Registro'
                }}
                <h3 class="pb-2 pt-1">LUAF</h3>
                {{ establishment.LUAF ? establishment.LUAF : 'No tiene LUAF' }}
                <h3 class="pb-2 pt-1">Teléfono</h3>
                {{ establishment.telefono }}
                <h3 class="pb-2 pt-1">Lugar</h3>
                {{ establishment.lugar.parroquia }}
                <v-btn icon class="info--text" @click="dialogPlace = true">
                  <v-icon> fa-eye</v-icon>
                </v-btn>
                <h3 class="pb-2 pt-1">Administrador</h3>
                {{ establishment.administrador }}
                <h3 class="pb-2 pt-1">Nacionalidad / Pueblo</h3>
                {{
                  establishment.nacionalidad
                    ? establishment.nacionalidad
                    : 'No tiene Nacionalidad / Pueblo'
                }}
                <h3 class="pb-2 pt-1">Página web</h3>
                {{ establishment.web ? establishment.web : 'No tiene una Página web' }}
                <h3 class="pb-2 pt-1">Área Protegida</h3>
                <span v-if="establishment.areaProtegida">
                  <h4 class="pl-2">Nombre</h4>
                  <p class="pl-2">{{ establishment.areaProtegida.nombre }}</p>
                  <h4 class="pl-2">Tipo</h4>
                  <p class="pl-2">{{ establishment.areaProtegida.tipo }}</p>
                </span>
                <span v-else> No pertenece a un Área Protegida</span>
              </div>
              <div v-else>No tiene un Establecimiento Asignado</div>
            </v-container>
          </v-container>
        </v-card>
        <v-card class="pt-1 pb-1" flat>
          <v-progress-linear
            indeterminate
            color="primary"
            v-show="loading"
          ></v-progress-linear>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogPlace" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Lugar</span>
        </v-card-title>
        <v-container>
          <v-container>
            <h3 class="pb-2 pt-1">Provincia</h3>
            {{ establishment.lugar.provincia }}
            <h3 class="pb-2 pt-1">Cantón</h3>
            {{ establishment.lugar.canton }}
            <h3 class="pb-2 pt-1">Ciudad</h3>
            {{ establishment.lugar.ciudad }}
            <h3 class="pb-2 pt-1">Parroquia</h3>
            {{ establishment.lugar.parroquia }}
            <v-row>
              <v-col>
                <h3>Coordenadas</h3>
              </v-col>
              <v-col align="end">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="edit--text"
                      @click="dialogMap = true"
                      v-on="on"
                      v-bind="attrs"
                    >
                      fa-map-marker-alt
                    </v-icon>
                  </template>
                  <span> Ver en el mapa </span>
                </v-tooltip>
              </v-col>
            </v-row>
            <h4 class="pb-2 pt-1">Latitud</h4>
            {{ establishment.lugar.lat }}
            <h4 class="pb-2 pt-1">Longitud</h4>
            {{ establishment.lugar.lng }}
          </v-container>
        </v-container>
        <v-card-actions>
          <v-btn text block @click="dialogPlace = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMap" max-width="600px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Punto en el mapa</span>
        </v-card-title>
        <ctcMap
          :coordinates="coordinates"
          @close="dialogMap = false"
          :mapChange="false"
          :edit="false"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      dialogPlace: false,
      dialogArea: false,
      dialogMap: false,
      coordinates: {
        lat: 0,
        lng: 0
      },
      representant: {},
      establishment: {
        lugar: {
          provincia: ''
        }
      }
    }
  },
  methods: {
    async getRepresentant() {
      this.loading = true
      await this.$http
        .get(`/api/representante/${this.user._id}`)
        .then(res => {
          this.loading = false
          this.representant = res.data.data.representante
          if (res.data.data.establecimiento) {
            this.establishment = res.data.data.establecimiento
            this.coordinates.lat = this.establishment.lugar.lat
            this.coordinates.lng = this.establishment.lugar.lng
          }
        })
        .catch(error => {
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        })
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getRepresentant()
  }
}
</script>

<style>
</style>