<template>
  <div>
    <v-card>
      <v-card-title class="primary white--text">
        <span class="headline">Nuevo establecimiento</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <h3 class="pt-2 pb-1"><strong class="error--text">*</strong> Nombre</h3>

          <v-text-field v-model="editedItem.nombre" filled rounded dense></v-text-field>

          <h3 class="pb-1"><strong class="error--text">*</strong> Administrador</h3>
          <v-text-field
            v-model="editedItem.administrador"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">Correo</h3>
          <v-text-field v-model="editedItem.email" filled rounded dense></v-text-field>

          <h3 class="pb-1">Registro</h3>
          <v-text-field v-model="editedItem.registro" filled rounded dense></v-text-field>

          <h3 class="pb-1">
            Teléfono
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  @click="editedItem.telefono.push('')"
                  small
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon class="info--text" small> fa-plus </v-icon>
                </v-btn>
              </template>
              <span> Agregar un teléfono </span>
            </v-tooltip>
          </h3>
          <v-text-field
            v-for="(item, index) in editedItem.telefono"
            :key="index"
            v-model="editedItem.telefono[index]"
            filled
            rounded
            dense
          >
            <template v-if="editedItem.telefono.length > 1" v-slot:append>
              <v-icon @click="removeItem('telefono', index)">far fa-times-circle</v-icon>
            </template>
          </v-text-field>

          <h3 class="pb-1">Comunidad u Organización</h3>
          <v-text-field
            v-model="editedItem.comunidad"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">Nacionalidad / Pueblo</h3>
          <v-text-field
            v-model="editedItem.nacionalidad"
            filled
            rounded
            dense
          ></v-text-field>

          <h3 class="pb-1">LUAF</h3>
          <v-text-field v-model="editedItem.LUAF" filled rounded dense></v-text-field>

          <h3 class="pb-1">Página web</h3>
          <v-text-field v-model="editedItem.web" filled rounded dense></v-text-field>

          <h3 class="pb-1 pt-2">Área Protegida</h3>
          <v-divider class="pb-2"></v-divider>

          <v-autocomplete
            v-model="editedItem.areaProtegida"
            :items="areas"
            item-text="nombre"
            return-object
            filled
            rounded
            dense
            clearable
            :loading="loading"
          ></v-autocomplete>

          <h3 class="pb-1">Ubicación</h3>
          <v-divider></v-divider>
          <h4 class="pt-2 pb-1">Provincia</h4>
          <v-text-field
            v-model="editedItem.provincia"
            filled
            rounded
            dense
          ></v-text-field>

          <h4 class="pb-1">Cantón</h4>
          <v-text-field v-model="editedItem.canton" filled rounded dense></v-text-field>

          <h4 class="pb-1">Ciudad o Localidad próxima</h4>
          <v-text-field v-model="editedItem.ciudad" filled rounded dense></v-text-field>

          <h4 class="pb-1">Parroquia</h4>
          <v-text-field
            v-model="editedItem.parroquia"
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

          <h5 class="pb-1">Latitud</h5>
          <v-text-field
            v-model="editedItem.lat"
            filled
            rounded
            dense
            :rules="numberRules"
          ></v-text-field>

          <h5 class="pb-1">Longitud</h5>
          <v-text-field
            v-model="editedItem.lng"
            filled
            rounded
            dense
            :rules="numberRules"
          ></v-text-field>

          <h3 class="pb-1">Servicios básicos</h3>
          <v-divider></v-divider>
          <h4 class="pt-2 pb-1">Agua</h4>
          <v-combobox
            v-model="editedItem.agua"
            :items="waters"
            filled
            rounded
            dense
            :loading="loading"
          ></v-combobox>

          <h4 class="pb-1">Saneamiento</h4>
          <v-combobox
            v-model="editedItem.saneamiento"
            :items="sanitation"
            filled
            rounded
            dense
            :loading="loading"
          ></v-combobox>

          <h4 class="pb-1">Energía eléctrica</h4>
          <v-combobox
            v-model="editedItem.energia"
            :items="energies"
            filled
            rounded
            dense
            :loading="loading"
            tags
          ></v-combobox>

          <h4 class="pb-1">Disposición de desechos</h4>
          <v-combobox
            v-model="editedItem.desechos"
            :items="waste"
            filled
            rounded
            dense
            :loading="loading"
          ></v-combobox>

          <h3 class="pb-1">Personal</h3>
          <v-divider></v-divider>

          <h4 class="pt-2 pb-1">Total colaboradores</h4>
          <v-text-field
            v-model="editedItem.personal"
            filled
            rounded
            dense
            :rules="numberRules"
          ></v-text-field>

          <h3>
            Actividades turísticas
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  @click="editedItem.actividad.push('')"
                  small
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon class="info--text" small> fa-plus </v-icon>
                </v-btn>
              </template>
              <span> Agregar una actividad turística </span>
            </v-tooltip>
          </h3>

          <div v-if="editedItem.actividad.length > 0" class="ml-4 mt-4">
            <v-row
              class="ml-4 mr-4"
              v-for="(item, index) in editedItem.actividad"
              :key="index + 'Activities'"
            >
              <v-autocomplete
                v-model="editedItem.actividad[index]"
                filled
                rounded
                dense
                :items="activities"
                item-value="_id"
                item-text="nombre"
                return-object
              >
                <template v-slot:append>
                  <v-icon @click="removeItem('actividad', index)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-autocomplete>
            </v-row>
          </div>

          <v-row v-else class="ml-4 mt-1">
            <h4>No aplica, el establecimiento no tiene actividades</h4>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-container>
          <v-row>
            <v-col cols="6" class="d-flex justify-space-around pa-0">
              <v-btn text @click="close">Regresar</v-btn>
            </v-col>
            <v-col cols="6" class="d-flex justify-space-around pa-0">
              <v-btn text @click="save"> Guardar </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialogMap" max-width="600px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline"> Elige un punto en el mapa </span>
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
  </div>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      dialogMap: false,
      problem: false,
      editedItem: {
        nombre: '',
        administrador: '',
        nacionalidad: '',
        registro: '',
        LUAF: 'No',
        email: '',
        web: '',
        telefono: [''],
        actividad: [],
        comunidad: '',
        ciudad: '',
        parroquia: '',
        canton: 'Riobamba',
        provincia: 'Chimborazo',
        lat: 0,
        lng: 0,
        agua: '',
        saneamiento: '',
        energia: '',
        desechos: '',
        personal: 0,
        areaProtegida: {},
        estado: false
      },
      coordinates: {
        lat: 0,
        lng: 0
      },
      numberRules: [
        v => !!v || 'Campo necesario',
        v => Number.isInteger(parseInt(v)) || 'Solo se permiten números'
      ],
      areas: [],
      activities: []
    }
  },
  methods: {
    getLocation() {
      if (!navigator.geolocation) {
        swalError('Geolocation no es soportada por este navegador.')
        return
      }

      navigator.geolocation.getCurrentPosition(this.onSucccess, this.onError)
    },

    onError(e) {
      if (e) {
        swalError(e.message)
      } else {
        swalError('Ocurrio un error o no hay permisos para ver la ubicación')
      }
    },

    onSucccess(position) {
      this.coordinates.lat = position.coords.latitude
      this.coordinates.lng = position.coords.longitude
      this.dialogMap = true
    },

    closeMap() {
      this.coordinates.lat = 0
      this.coordinates.lng = 0
      this.dialogMap = false
    },

    saveCoordinates(data) {
      this.editedItem.lat = data.lat()
      this.editedItem.lng = data.lng()
      this.dialogMap = false
    },

    async getAreas() {
      this.loading = true
      await this.$http
        .get('api/areasProtegidas')
        .then(res => {
          this.loading = false
          this.areas = res.data.data
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

    getBasicServices() {
      //waters
      this.waters = this.establishments
        .map(v => {
          return v.agua
        })
        .filter(v => {
          return v != undefined
        })

      //energies
      this.energies = this.establishments
        .map(v => {
          return v.energia
        })
        .filter(v => {
          return v != undefined
        })

      //waste
      this.waste = this.establishments
        .map(v => {
          return v.desechos
        })
        .filter(v => {
          return v != undefined
        })

      //sanitation
      this.sanitation = this.establishments
        .map(v => {
          return v.saneamiento
        })
        .filter(v => {
          return v != undefined
        })
    },

    async getActivities() {
      this.loading = true
      this.activities = []
      await this.$http
        .get('api/actividades')
        .then(res => {
          this.loading = false
          this.activities = res.data.data
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

    close() {
      this.$router.replace('/editEstablishment')
    },

    removeItem(critery, indice) {
      if (critery === 'actividad') {
        this.editedItem.actividad.splice(indice, 1)
      } else {
        if (critery === 'telefono') {
          this.editedItem.telefono.splice(indice, 1)
        }
      }
    },

    async save() {
      await this.addEstablishment()
      if (!this.problem) {
        sessionStorage.setItem('establishment', JSON.stringify(this.editedItem))
        await this.prepareEnvironment()
        await this.updateBasicService(this.editedItem)
        this.close()
      }
      this.problem = false
    },

    async addEstablishment() {
      this.loading = true
      swalLoading('Ingresando establecimiento')
      if (!this.editedItem.areaProtegida._id) delete this.editedItem.areaProtegida
      try {
        await this.$http.post('api/establecimiento', this.editedItem).then(async res => {
          this.loading = false
          swalConfirm('Establecimiento nuevo ingresado')
          this.problem = false
          this.editedItem = res.data.data
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
    },

    ...mapActions(['prepareEnvironment', 'updateBasicService'])
  },

  created() {
    this.getActivities()
    this.getAreas()
  },

  computed: {
    ...mapState(['waters', 'energies', 'sanitation', 'waste'])
  }
}
</script>
