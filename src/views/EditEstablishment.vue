<template>
  <v-card>
    <v-card-title class="primary white--text">
      <span class="headline">Información del Establecimiento </span>
    </v-card-title>

    <v-card-text>
      <v-row class="pb-0">
        <v-col class="pb-0"><h2>Información General</h2></v-col>
        <v-col cols="1" align="end" class="pb-0">
          <v-btn icon style="margin-left: -15px" @click="general = !general">
            <v-icon v-if="general">fa-angle-up</v-icon>
            <v-icon v-else>fa-angle-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-row v-if="general">
        <v-col class="ml-4 mr-4">
          <h3 class="pt-2 pb-1">Nombre</h3>
          <v-text-field
            v-model="basicInformation.nombre"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">Correo</h3>
          <v-text-field
            v-model="basicInformation.email"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">Registro</h3>
          <v-text-field
            v-model="basicInformation.registro"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">Teléfono</h3>
          <v-text-field
            v-model="basicInformation.telefono"
            filled
            rounded
            dense
          ></v-text-field>
          <h3 class="pt-2 pb-1">Administrador</h3>
          <v-text-field
            v-model="basicInformation.administrador"
            filled
            rounded
            dense
          ></v-text-field>
          <h3 class="pb-1">Nacionalidad / Pueblo</h3>
          <v-text-field
            v-model="basicInformation.nacionalidad"
            filled
            rounded
            dense
          ></v-text-field>
          <h3 class="pb-1">Página web</h3>
          <v-text-field
            v-model="basicInformation.web"
            filled
            rounded
            dense
          ></v-text-field>
          <h3 class="pb-1">Área Protegida</h3>
          <v-text-field
            v-if="basicInformation.areaProtegida"
            v-model="basicInformation.areaProtegida.nombre"
            filled
            rounded
            dense
            disabled
          ></v-text-field>
          <v-text-field v-else filled rounded dense disabled></v-text-field>
          <h3 class="pb-1">Representante</h3>
          <v-text-field
            v-if="basicInformation.representante"
            v-model="basicInformation.representante.nombre"
            filled
            rounded
            dense
            disabled
          ></v-text-field>
          <v-text-field v-else filled rounded dense disabled></v-text-field>
        </v-col>
      </v-row>

      <v-row class="pb-0">
        <v-col class="pb-0"><h2>Ubicación</h2></v-col>
        <v-col cols="1" align="end" class="pb-0">
          <v-btn icon style="margin-left: -15px" @click="place = !place">
            <v-icon v-if="place">fa-angle-up</v-icon>
            <v-icon v-else>fa-angle-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row v-if="place">
        <v-col class="ml-4 mr-4">
          <h3 class="pt-2 pb-1">Provincia</h3>
          <v-text-field
            v-model="basicInformation.provincia"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">Cantón</h3>
          <v-text-field
            v-model="basicInformation.canton"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">Ciudad</h3>
          <v-text-field
            v-model="basicInformation.ciudad"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">Parroquia</h3>
          <v-text-field
            v-model="basicInformation.parroquia"
            filled
            rounded
            dense
          ></v-text-field>

          <v-row style="margin-top: -15px">
            <v-col>
              <h3 class="pt-2 pb-1">Coordenadas</h3>
            </v-col>
            <v-col align="end">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="edit--text"
                    @click="getLocation()"
                    v-on="on"
                    v-bind="attrs"
                  >
                    fa-map-marker-alt
                  </v-icon>
                </template>
                <span> Ver localización actual </span>
              </v-tooltip>
            </v-col>
          </v-row>

          <h4 class="pb-1">Latitud</h4>
          <v-text-field
            v-model="basicInformation.lat"
            filled
            rounded
            dense
          ></v-text-field>

          <h4 class="pb-1">Longitud</h4>
          <v-text-field
            v-model="basicInformation.lng"
            filled
            rounded
            dense
          ></v-text-field>

          <h4 class="pb-4">Fuente: Google Maps</h4>
        </v-col>
      </v-row>

      <v-row class="pb-0">
        <v-col class="pb-0"><h2>Servicios Básicos</h2></v-col>
        <v-col cols="1" align="end" class="pb-0">
          <v-btn icon style="margin-left: -15px" @click="basic = !basic">
            <v-icon v-if="basic">fa-angle-up</v-icon>
            <v-icon v-else>fa-angle-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row v-if="basic">
        <v-col class="ml-4 mr-4">
          <h3 class="pt-2 pb-1">Agua</h3>
          <v-combobox
            v-model="basicInformation.agua"
            :items="waters"
            filled
            rounded
            dense
          ></v-combobox>

          <h3 class="pb-1">Saneamiento</h3>
          <v-combobox
            v-model="basicInformation.saneamiento"
            :items="sanitation"
            filled
            rounded
            dense
          ></v-combobox>

          <h3 class="pb-1">Energía Eléctrica</h3>
          <v-combobox
            v-model="basicInformation.energia"
            :items="energies"
            filled
            rounded
            dense
          ></v-combobox>

          <h3 class="pb-1">Disposición de Desechos</h3>
          <v-combobox
            v-model="basicInformation.desechos"
            :items="waste"
            filled
            rounded
            dense
          ></v-combobox>
        </v-col>
      </v-row>

      <v-row class="pb-0">
        <v-col class="pb-0"><h2>Personal</h2></v-col>
        <v-col cols="1" align="end" class="pb-0">
          <v-btn icon style="margin-left: -15px" @click="people = !people">
            <v-icon v-if="people">fa-angle-up</v-icon>
            <v-icon v-else>fa-angle-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row v-if="people">
        <v-col class="ml-4 mr-4">
          <h3 class="pt-2 pb-1">Total Colaboradores</h3>
          <v-text-field
            v-model="basicInformation.personal"
            filled
            rounded
            dense
            :rules="numberRules"
          ></v-text-field>
        </v-col>
      </v-row>
      
    </v-card-text>

    <v-card-actions>
      <v-row>
        <v-col cols="6" align="center">
          <v-btn text @click="sync()">Reestablecer</v-btn>
        </v-col>
        <v-col align="center">
          <v-btn text @click="save()">Guardar</v-btn>
        </v-col></v-row
      >
    </v-card-actions>

    <v-dialog v-model="dialogMap" max-width="600px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline"> Elige un punto en el mapa</span>
        </v-card-title>
        <ctcMap
          :coordinates="coordinates"
          @close="closeMap"
          @save="saveCoordinates"
          :mapChange="dialogMap"
          :edit="true"
        />
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      basic: true,
      people: true,
      place: true,
      general: true,
      problem: false,
      dialogMap: false,
      basicInformation: {},
      coordinates: {
        lat: 0,
        lng: 0
      },
      numberRules: [
        v => !!v || 'Campo necesario',
        v => Number.isInteger(parseInt(v)) || 'Solo se permiten números'
      ]
    }
  },

  methods: {
    ...mapActions(['prepareEnvironment']),

    sync() {
      this.basicInformation = Object.assign({}, this.establishment)
    },

    async save() {
      await this.changeEstablishment()
      if (!this.problem) {
        this.update()
      }
    },

    //permite obtener la localización actual
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          //Por si la acepta
          v => {
            this.coordinates.lat = v.coords.latitude
            this.coordinates.lng = v.coords.longitude
            this.showMap()
          },

          //Por si la deniega
          () => {
            swalError('El Usuario ha Denegado la Geolocalización')
          }
        )
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    },

    showMap() {
      this.dialogMap = true
    },

    closeMap() {
      this.coordinates.lat = this.basicInformation.lat
      this.coordinates.lng = this.basicInformation.lng
      this.dialogMap = false
    },

    saveCoordinates(data) {
      this.basicInformation.lat = data.lat
      this.basicInformation.lng = data.lng
      this.dialogMap = false
    },

    update() {
      if (this.basicInformation) {
        sessionStorage.setItem('establishment', JSON.stringify(this.basicInformation))
        this.prepareEnvironment()
      }
    },

    async changeEstablishment() {
      this.loading = true
      swalLoading('Guardando Información')

      delete this.basicInformation.representante
      delete this.basicInformation.areaProtegida

      try {
        await this.$http
          .put(`/api/establecimiento/${this.basicInformation._id}`, this.basicInformation)
          .then(async () => {
            this.loading = false
            swalConfirm('Información actualizada')
            this.problem = false
          })
      } catch (error) {
        this.loading = false
        swalError(
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        )
        this.problem = true
      }
    }
  },

  created() {
    this.sync()
    this.coordinates.lat = this.basicInformation.lat
    this.coordinates.lng = this.basicInformation.lng
  },

  computed: {
    ...mapState(['establishment', 'waters', 'energies', 'sanitation', 'waste'])
  },

  watch: {
    establishment(v) {
      if (v) {
        this.sync()
      }
    },

    dialogMap(val) {
      val || this.closeMap()
    }
  }
}
</script>