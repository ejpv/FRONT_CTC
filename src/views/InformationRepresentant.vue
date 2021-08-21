<template>
  <div>
    <v-row>
      <v-col cols="12" sm="7">
        <v-card>
          <v-card-title class="primary white--text">
            Información del Establecimiento
          </v-card-title>
          <v-container>
            <v-container>
              <div v-if="establishment._id">
                <h3 class="pt-1">Información General</h3>
                <v-divider class="pb-2"></v-divider>

                <h4 class="pb-2 pt-1">Nombre</h4>
                {{ getRespuesta(establishment.nombre) }}

                <h4 class="pb-2 pt-1">Administrador</h4>
                {{ getRespuesta(establishment.administrador) }}

                <h4 class="pb-2 pt-1">Correo</h4>
                {{ getRespuesta(establishment.correo) }}

                <h4 class="pb-2 pt-1">Registro</h4>
                {{ getRespuesta(establishment.registro) }}

                <h4 class="pb-2 pt-1">LUAF</h4>
                {{ getRespuesta(establishment.luaf) }}

                <h4 class="pb-2 pt-1">Teléfono</h4>
                {{ getArray(establishment.telefono) }}

                <h4 class="pb-2 pt-1">Comunidad</h4>
                {{ getRespuesta(establishment.comunidad) }}

                <h4 class="pb-2 pt-1">Nacionalidad / Pueblo</h4>
                {{ getRespuesta(establishment.nacionalidad) }}

                <h4 class="pb-2 pt-1">Página web</h4>
                {{ getRespuesta(establishment.web) }}

                <h3 class="pt-2 pb-1">Área Protegida</h3>
                <v-divider class="pb-2"></v-divider>
                <v-row v-if="establishment.areaProtegida" class="pb-0 mb-0">
                  <v-col class="pb-0 mb-0">
                    <h4 class="pl-2">Nombre</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.areaProtegida.nombre) }}
                    </p>
                    <h4 class="pl-2">Tipo</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.areaProtegida.tipo) }}
                    </p>
                  </v-col>
                </v-row>
                <v-row v-else> No pertenece a un Área Protegida</v-row>

                <h3 class="pt-2 pb-1">Ubicación</h3>
                <v-divider></v-divider>
                <v-row class="pb-0 mb-0">
                  <v-col class="pb-0 mb-0">
                    <h4 class="pb-1 pt-1">Provincia</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.provincia) }}
                    </p>

                    <h4 class="pb-1 pt-1">Cantón</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.canton) }}
                    </p>

                    <h4 class="pb-1 pt-1">Ciudad o Localidad Próxima</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.ciudad) }}
                    </p>

                    <h4 class="pb-1 pt-1">Parroquia</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.parroquia) }}
                    </p>

                    <v-row class="mt-0 mb-0 pb-0">
                      <v-col class="pb-0 mt-0 mb-0">
                        <h3>Coordenadas</h3>
                      </v-col>
                      <v-col align="end" class="pb-0 mt-0 mb-0">
                        <v-tooltip left>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              class="edit--text"
                              v-on="on"
                              v-bind="attrs"
                              @click="dialogMap = true"
                            >
                              fa-map-marker-alt
                            </v-icon>
                          </template>
                          <span> Ver localización actual </span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                    <v-divider class="pb-1"></v-divider>

                    <h4 class="pb-1 pt-1">Latitud</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.lat) }}
                    </p>

                    <h4 class="pb-1 pt-1">Longitud</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.lng) }}
                    </p>

                    <span class="text--secondary pt-1 pl-2">Fuente: Google Maps</span>
                  </v-col>
                </v-row>

                <h3 class="pt-2 pb-1">Servicios Básicos</h3>
                <v-divider></v-divider>
                <v-row class="pb-0 mb-0">
                  <v-col class="pb-0 mb-0">
                    <h4 class="pb-1 pt-1">Agua</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.agua) }}
                    </p>

                    <h4 class="pb-1 pt-1">Saneamiento</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.saneamiento) }}
                    </p>

                    <h4 class="pb-1 pt-1">Energía Eléctrica</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.energia) }}
                    </p>

                    <h4 class="pb-1 pt-1">Disposición de Desechos</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.desechos) }}
                    </p>
                  </v-col>
                </v-row>

                <h3>Personal</h3>
                <v-divider class="pb-1"></v-divider>
                <v-row class="pb-0 mb-0">
                  <v-col class="pb-0 mb-0">
                    <h4 class="pb-1 pt-1">Total Colaboradores</h4>
                    <p class="pl-2">
                      {{ getRespuesta(establishment.personal) }}
                    </p>
                  </v-col>
                </v-row>

                <h3>Actividades Turísticas</h3>
                <v-divider class="pb-1"></v-divider>
                <v-row v-if="establishment.actividad.length > 0">
                  <v-col class="ml-4">
                    <p class="pl-2">
                      {{ getArray(establishment.actividad) }}
                    </p>
                  </v-col>
                </v-row>
                <v-row v-else class="ml-4 mt-4">
                  No Aplica, el establecimiento no tiene Actividades
                </v-row>
              </div>
              <div v-else>No tiene un Establecimiento Asignado</div>
            </v-container>
          </v-container>
        </v-card>

        <v-card class="pt-1 pb-1" flat v-if="loading">
          <v-progress-linear
            indeterminate
            color="primary"
            v-show="loading"
          ></v-progress-linear>
        </v-card>
      </v-col>

      <v-col cols="12" sm="5">
        <v-container>
          <v-card>
            <v-card-title class="primary white--text">
              Información del Representante
            </v-card-title>
            <v-container>
              <v-container v-if="representant.nombre">
                <h3 class="pb-2 pt-1">Nombre</h3>
                {{ getRespuesta(representant.nombre) }}
                <h3 class="pb-2 pt-1">Apellido</h3>
                {{ getRespuesta(representant.apellido) }}
                <h3 class="pb-2 pt-1">Direccion</h3>
                {{ getRespuesta(representant.direccion) }}
                <h3 class="pb-2 pt-1">Correo</h3>
                {{ getRespuesta(representant.Correo) }}
                <h3 class="pb-2 pt-1">Teléfono</h3>
                {{ getRespuesta(representant.telefono) }}
              </v-container>
              <div v-else>No tiene un Representante Asignado</div>
            </v-container>
          </v-card>
          <v-card class="pt-1 pb-1" flat v-if="loading">
            <v-progress-linear
              indeterminate
              color="primary"
              v-show="loading"
            ></v-progress-linear>
          </v-card>
        </v-container>
      </v-col>
    </v-row>

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
      establishment: {}
    }
  },
  methods: {
    async getRepresentant() {
      this.loading = true
      await this.$http
        .get(`api/representante/${this.user._id}`)
        .then(res => {
          this.loading = false
          this.representant = res.data.data.representante
          if (res.data.data.establecimiento) {
            this.establishment = res.data.data.establecimiento
            this.coordinates.lat = this.establishment.lat
            this.coordinates.lng = this.establishment.lng
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
    },

    getRespuesta(item) {
      return item ? item : 'Vacío'
    },

    getArray(item) {
      if (item.length > 0) {
        var cadena = ''
        if (item[0].nombre) {
          for (let i = 0; i < item.length; i++) {
            i === 0
              ? (cadena = item[i].nombre)
              : i === item.length - 1
              ? (cadena = cadena + ', ' + item[i].nombre + '.')
              : (cadena = cadena + ', ' + item[i].nombre)
          }
          return cadena
        } else {
          for (let i = 0; i < item.length; i++) {
            i === 0
              ? (cadena = item[i])
              : i === item.length - 1
              ? (cadena = cadena + ', ' + item[i] + '.')
              : (cadena = cadena + ', ' + item[i])
          }
          return cadena
        }
      } else {
        return 'Vacío'
      }
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
