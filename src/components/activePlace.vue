<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="places"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todos los Lugares..."
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col align="start" cols="3" sm="2"> </v-col>
              <v-col align="end" cols="0" sm="10">
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="new" dark class="mb-2" v-bind="attrs" v-on="on" medium>
                      Nuevo Lugar
                      <v-icon right>fa-globe-americas</v-icon>
                    </v-btn>
                    <v-btn color="info" class="mb-2 ml-4" medium icon>
                      <v-icon medium @click="getPlaces()">fa-sync-alt</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="primary white--text">
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-form ref="form">
                          <h3 class="pt-2 pb-1">
                            <strong class="error--text">*</strong> Provincia
                          </h3>
                          <v-text-field
                            v-model="editedItem.provincia"
                            filled
                            rounded
                            dense
                            :rules="fieldRules"
                          ></v-text-field>

                          <h3 class="pb-1">
                            <strong class="error--text">*</strong> Cantón
                          </h3>
                          <v-text-field
                            v-model="editedItem.canton"
                            filled
                            rounded
                            dense
                            :rules="fieldRules"
                          ></v-text-field>

                          <h3 class="pb-1">Ciudad</h3>
                          <v-text-field
                            v-model="editedItem.ciudad"
                            filled
                            rounded
                            dense
                          ></v-text-field>

                          <h3 class="pb-1">
                            <strong class="error--text">*</strong> Parroquia
                          </h3>
                          <v-text-field
                            v-model="editedItem.parroquia"
                            filled
                            rounded
                            dense
                            :rules="fieldRules"
                          ></v-text-field>

                          <v-row style="margin-top: -15px">
                            <v-col>
                              <h3 class="pb-3">
                                <strong class="error--text">*</strong> Coordenadas
                              </h3>
                            </v-col>
                            <v-col align="end">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon
                                    class="mr-2 edit--text"
                                    @click="showMap(true)"
                                    v-on="on"
                                    v-bind="attrs"
                                  >
                                    fa-map-marked-alt
                                  </v-icon>
                                </template>
                                <span> Elegir punto en mapa </span>
                              </v-tooltip>
                            </v-col>
                          </v-row>

                          <h4 class="pb-1">Latitud</h4>
                          <v-text-field
                            v-model="editedItem.lat"
                            filled
                            rounded
                            dense
                            :rules="numberRules"
                          ></v-text-field>

                          <h4 class="pb-1">Longitud</h4>
                          <v-text-field
                            v-model="editedItem.lng"
                            filled
                            rounded
                            dense
                            :rules="numberRules"
                          ></v-text-field>
                        </v-form>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-container>
                        <v-row>
                          <v-col cols="6" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="close">Cancelar</v-btn>
                          </v-col>
                          <v-col cols="6" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="save">Guardar</v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2 edit--text"
              @click="editItem(item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-pen
            </v-icon>
          </template>
          <span> Editar un Lugar </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="ma-2 delete--text"
              @click="deleteItem(item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-trash
            </v-icon>
          </template>
          <span> Eliminar un Lugar </span>
        </v-tooltip>
      </template>

      <template v-slot:item.estado="">
        <v-chip color="success" dark> Activo </v-chip>
      </template>

      <template v-slot:item.coords="{ item }">
        <span> {{ item.lat + ', ' + item.lng }} </span>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="info--text ml-2"
              v-on="on"
              v-bind="attrs"
              @click="showMap(false, item)"
            >
              fa-eye
            </v-icon>
          </template>
          <span> Ver en el mapa</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline"> ¿Está seguro de borrar este Lugar?</span>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="closeDelete">Cancelar</v-btn></v-col
              >
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="deleteItemConfirm">Continuar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMap" max-width="600px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Elija un punto en el mapa</span>
        </v-card-title>
        <ctcMap
          :coordinates="coordinates"
          @close="closeMap"
          @save="saveCoordinates"
          :mapChange="dialogMap"
          :edit="editMap"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'

export default {
  props: ['texto', 'activator'],
  data() {
    return {
      loading: true,
      dialogDelete: false,
      dialog: false,
      editedIndex: -1,
      dialogMap: false,
      editMap: false,
      coordinates: {
        lat: 0,
        lng: 0
      },
      editedItem: {
        canton: 'Riobamba',
        provincia: 'Chimborazo',
        lat: -1.6519177088279544,
        lng: -78.64296128376385
      },
      defaultItem: {
        canton: 'Riobamba',
        provincia: 'Chimborazo',
        lat: -1.6519177088279544,
        lng: -78.64296128376385
      },
      problem: false,
      places: [],
      headers: [
        {
          text: 'Provincia',
          value: 'provincia',
          align: 'start'
        },
        {
          text: 'Cantón',
          value: 'canton'
        },
        {
          text: 'Ciudad',
          value: 'ciudad'
        },
        {
          text: 'Parroquia',
          value: 'parroquia'
        },
        {
          text: 'Coordenadas',
          value: 'coords',
          align: 'center',
          sortable: false
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'center',
          sortable: false
        },
        {
          text: 'Acciones',
          value: 'actions',
          align: 'center',
          sortable: false
        }
      ],
      fieldRules: [
        v => !!v || 'Campo necesario',
        v => (v && v.length >= 3) || 'Debe tener mas de 3 letras'
      ],
      numberRules: [
        v => !!v || 'Campo necesario',
        v => Number.isInteger(parseInt(v)) || 'Solo se permiten números'
      ]
    }
  },

  methods: {
    async getPlaces() {
      this.loading = true
      this.places = []
      await this.$http
        .get('/api/lugares')
        .then(res => {
          this.loading = false
          this.places = res.data.data
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

    deleteItem(item) {
      this.editedIndex = this.places.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      await this.removePlace()
      if (!this.problem) {
        this.places.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    close() {
      this.dialog = false
      this.$refs.form.resetValidation()
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeMap() {
      this.coordinates.lat = 0
      this.coordinates.lng = 0
      this.dialogMap = false
    },

    saveCoordinates(data) {
      this.editedItem.lat = data.lat
      this.editedItem.lng = data.lng
      this.dialogMap = false
    },

    showMap(data, item) {
      this.editMap = data
      if (!data) {
        this.coordinates.lat = item.lat
        this.coordinates.lng = item.lng
      } else {
        this.coordinates.lat = this.editedItem.lat
        this.coordinates.lng = this.editedItem.lng
      }
      this.dialogMap = true
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    editItem(item) {
      this.editedIndex = this.places.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.changePlace()
        if (!this.problem) {
          Object.assign(this.places[this.editedIndex], this.editedItem)
        }
      } else {
        await this.addPlace()
        if (!this.problem) {
          this.places.push(this.editedItem)
        }
      }
      this.problem = false
      this.close()
    },

    async addPlace() {
      this.loading = true
      swalLoading('Ingresando Lugar')
      try {
        await this.$http.post('/api/lugar', this.editedItem).then(async res => {
          this.loading = false
          swalConfirm('Lugar nuevo ingresado')
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

    async removePlace() {
      this.loading = true
      swalLoading('Eliminando lugar')
      try {
        await this.$http.delete(`/api/lugar/${this.editedItem._id}`).then(() => {
          this.loading = false
          swalConfirm('Lugar Eliminado')
        })
        this.problem = false
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

    async changePlace() {
      this.loading = true
      swalLoading('Editando lugar')
      try {
        await this.$http
          .put(`/api/lugar/${this.editedItem._id}`, this.editedItem)
          .then(async () => {
            this.loading = false
            swalConfirm('Lugar editado')
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

  async created() {
    await this.getPlaces()
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear un Lugar' : 'Editar un Lugar'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    activator(val) {
      if (!val) {
        this.getPlaces()
      }
    }
  }
}
</script>