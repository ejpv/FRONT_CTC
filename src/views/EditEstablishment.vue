<template>
  <v-container>
    <v-col>
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Información del Representante</span>
          <v-chip :color="getColor" dark class="ml-1">
            {{ getText }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn icon @click="representant = !representant">
            <v-icon v-if="representant">fa-angle-up</v-icon>
            <v-icon v-else>fa-angle-down</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text v-show="representant">
          <v-row>
            <v-col class="ml-4 mr-4">
              <h3 class="pt-2 pb-1"><strong class="error--text">*</strong> Nombre</h3>
              <v-text-field
                v-model="basicInformation.representante.nombre"
                filled
                rounded
                dense
                :rules="fieldRules"
              ></v-text-field>

              <h3 class="pb-1"><strong class="error--text">*</strong> Apellido</h3>
              <v-text-field
                v-model="basicInformation.representante.apellido"
                filled
                rounded
                dense
                :rules="fieldRules"
              ></v-text-field>

              <h3 class="pb-1"><strong class="error--text">*</strong> Cedula</h3>
              <v-text-field
                v-model="basicInformation.representante.cedula"
                filled
                rounded
                dense
                :rules="numberRules"
              ></v-text-field>

              <h3 class="pb-1"><strong class="error--text">*</strong> Correo</h3>
              <v-text-field
                v-model="basicInformation.representante.email"
                filled
                rounded
                dense
                :rules="emailRules"
              ></v-text-field>

              <h3 class="pb-1">Telefono</h3>
              <v-text-field
                v-model="basicInformation.representante.telefono"
                filled
                rounded
                dense
              ></v-text-field>

              <h3 class="pb-1">Dirección</h3>
              <v-textarea
                auto-grow
                filled
                rounded
                dense
                rows="1"
                row-height="15"
                v-model="basicInformation.representante.direccion"
              ></v-textarea>
            </v-col>
          </v-row>

          <v-card-actions>
            <v-row>
              <v-col cols="6" align="center">
                <v-btn text @click="sync()">Reestablecer</v-btn>
              </v-col>
              <v-col align="center">
                <v-btn text @click="saveRepresentant()">Guardar</v-btn>
              </v-col></v-row
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col>
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Información del Establecimiento </span>
          <v-spacer></v-spacer>
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" @click="newEstablishment()" icon>
                <v-icon> fa-plus</v-icon>
              </v-btn>
            </template>
            <span> Crear un Nuevo Establecimiento </span>
          </v-tooltip>
        </v-card-title>

        <v-card-text>
          <v-row class="pa-0 ma-0">
            <v-col><h2>Información General</h2></v-col>
            <v-col cols="2" align="end">
              <v-btn icon @click="general = !general">
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

              <h3 class="pt-2 pb-1">Administrador</h3>
              <v-text-field
                v-model="basicInformation.administrador"
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

              <h3 class="pb-1">
                Teléfono
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      @click="basicInformation.telefono.push('')"
                      small
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon class="info--text" small> fa-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> Agregar una Actividad Turística </span>
                </v-tooltip>
              </h3>
              <v-text-field
                v-for="(item, index) in basicInformation.telefono"
                :key="index"
                v-model="basicInformation.telefono[index]"
                filled
                rounded
                dense
              >
                <template v-if="basicInformation.telefono.length > 1" v-slot:append>
                  <v-icon @click="removeItem('telefono', index)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-text-field>

              <h3 class="pb-1">Comunidad u Organización</h3>
              <v-text-field
                v-model="basicInformation.comunidad"
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

              <h3 class="pb-1">LUAF</h3>
              <v-text-field
                v-model="basicInformation.LUAF"
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

          <v-row class="pa-0 ma-0">
            <v-col><h2>Ubicación</h2></v-col>
            <v-col cols="2" align="end">
              <v-btn icon @click="place = !place">
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

              <h3 class="pb-1">Ciudad o Localidad Próxima</h3>
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

          <v-row class="ma-0 pa-0">
            <v-col><h2>Servicios Básicos</h2></v-col>
            <v-col cols="2" align="end">
              <v-btn icon @click="basic = !basic">
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

          <v-row class="ma-0 pa-0">
            <v-col><h2>Personal</h2></v-col>
            <v-col cols="2" align="end">
              <v-btn icon @click="people = !people">
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

          <v-row class="ma-0 pa-0">
            <v-col>
              <h2>
                Actividades Turísticas
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      @click="basicInformation.actividad.push('')"
                      small
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon class="info--text" small> fa-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> Agregar una Actividad Turística </span>
                </v-tooltip>
              </h2>
            </v-col>
            <v-col cols="2" align="end">
              <v-btn icon @click="activity = !activity">
                <v-icon v-if="activity">fa-angle-up</v-icon>
                <v-icon v-else>fa-angle-down</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="pb-5"></v-divider>

          <div v-if="activity">
            <div v-if="basicInformation.actividad.length > 0" class="ml-4 mt-4">
              <v-row
                class="ml-4 mr-4"
                v-for="(item, index) in basicInformation.actividad"
                :key="index + 'Activities'"
              >
                <v-autocomplete
                  v-model="basicInformation.actividad[index]"
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
              <h4>No Aplica, el establecimiento no tiene Actividades</h4>
            </v-row>
          </div>
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
    </v-col>
  </v-container>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      basic: true,
      people: true,
      activity: true,
      place: true,
      general: true,
      problem: false,
      dialogMap: false,
      representant: true,
      basicInformation: {},
      coordinates: {
        lat: 0,
        lng: 0
      },
      numberRules: [
        v => !!v || 'Campo necesario',
        v => Number.isInteger(parseInt(v)) || 'Solo se permiten números'
      ],
      activities: [],
      emailRules: [
        v => !!v || 'Correo es necesario',
        v => /.+@.+\..+/.test(v) || 'El correo tiene que ser válido'
      ],
      fieldRules: [
        v => !!v || 'Campo necesario',
        v => (v && v.length >= 3) || 'Debe tener mas de 3 letras'
      ]
    }
  },

  methods: {
    ...mapActions(['prepareEnvironment', 'updateBasicService']),

    sync() {
      this.basicInformation = Object.assign({}, this.establishment)
      this.basicInformation.actividad = this.establishment.actividad.map(v => {
        return v
      })
      this.basicInformation.representante = Object.assign(
        {},
        this.establishment.representante
      )
    },

    newEstablishment() {
      this.$router.replace('/technicalEstablishment')
    },

    async save() {
      await this.changeEstablishment()
      if (!this.problem) {
        this.update()
      }
    },

    async saveRepresentant() {
      if (this.basicInformation.representante._id) {
        await this.changeRepresentant()
      } else {
        await this.addRepresentant()
        if (!this.problem) {
          await this.changeEstablishment(true)
        }
      }

      if (!this.problem) {
        this.update()
      }
    },

    //permite obtener la localización actual
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
      this.showMap()
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
      this.basicInformation.lat = data.lat()
      this.basicInformation.lng = data.lng()
      this.dialogMap = false
    },

    update() {
      if (this.basicInformation) {
        sessionStorage.setItem('establishment', JSON.stringify(this.basicInformation))
        this.prepareEnvironment()
      }
    },

    removeItem(critery, indice) {
      if (critery === 'actividad') {
        this.basicInformation.actividad.splice(indice, 1)
      } else {
        if (critery === 'telefono') {
          this.basicInformation.telefono.splice(indice, 1)
        }
      }
    },

    async changeEstablishment(existId) {
      this.basicInformation.actividad = this.basicInformation.actividad.filter(v => {
        if (v) {
          return v
        }
      })

      var tmp = Object.assign({}, this.basicInformation)
      this.loading = true
      swalLoading('Guardando Información')

      if (existId) {
        tmp.representante = this.basicInformation.representante._id
      } else {
        delete tmp.representante
      }
      delete tmp.areaProtegida

      tmp.actividad = tmp.actividad.map(v => {
        return v._id
      })

      if (tmp.waters === '') delete tmp.waters
      if (tmp.energies === '') delete tmp.energies
      if (tmp.sanitation === '') delete tmp.sanitation
      if (tmp.waste === '') delete tmp.waste

      try {
        await this.$http.put(`api/establecimiento/${tmp._id}`, tmp).then(async () => {
          this.loading = false
          swalConfirm('Información actualizada')
          this.problem = false
          this.updateBasicService(this.basicInformation)
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

    async addRepresentant() {
      this.loading = true
      swalLoading('Ingresando representante')
      try {
        await this.$http
          .post('api/representante', this.basicInformation.representante)
          .then(async res => {
            this.loading = false
            swalConfirm('Representante nuevo ingresado')
            this.problem = false
            this.basicInformation.representante = res.data.data
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

    async changeRepresentant() {
      this.loading = true
      swalLoading('Editando representante')
      try {
        await this.$http
          .put(
            `api/representante/${this.basicInformation.representante._id}`,
            this.basicInformation.representante
          )
          .then(async () => {
            this.loading = false
            swalConfirm('Representante editado')
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
    this.getActivities()
    this.coordinates.lat = this.basicInformation.lat
    this.coordinates.lng = this.basicInformation.lng
  },

  computed: {
    ...mapState(['establishment', 'waters', 'energies', 'sanitation', 'waste']),

    getColor() {
      return this.basicInformation.representante._id
        ? this.basicInformation.representante.usuario
          ? 'success'
          : 'edit'
        : 'error'
    },

    getText() {
      return this.basicInformation.representante._id
        ? this.basicInformation.representante.usuario
          ? 'Usuario Asignado'
          : 'No tiene un Usuario Asignado'
        : 'Se necesita un Representante'
    }
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
