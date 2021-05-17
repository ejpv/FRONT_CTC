<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="establishments"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todos los Establecimientos..."
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
                      Nuevo Establecimiento
                      <v-icon right>fa-store-alt</v-icon>
                    </v-btn>
                    <v-btn color="info" class="mb-2 ml-2" medium icon>
                      <v-icon medium @click="getEstablishments()">fa-sync-alt</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="primary white--text">
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <h3 class="pt-2 pb-1">
                          <strong class="error--text">*</strong> Nombre
                        </h3>

                        <v-text-field
                          v-model="editedItem.nombre"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h3 class="pb-1">
                          <strong class="error--text">*</strong> Administrador
                        </h3>
                        <v-text-field
                          v-model="editedItem.administrador"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h3 class="pb-1">Correo</h3>
                        <v-text-field
                          v-model="editedItem.email"
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

                        <h3 class="pb-1">Registro</h3>
                        <v-text-field
                          v-model="editedItem.registro"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h3 class="pb-1">LUAF</h3>
                        <v-text-field
                          v-model="editedItem.LUAF"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h3 class="pb-1">Página web</h3>
                        <v-text-field
                          v-model="editedItem.web"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h3 class="pb-1">Teléfono</h3>
                        <v-text-field
                          v-model="editedItem.telefono"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h3 class="pb-1">Lugar</h3>
                        <v-divider></v-divider>
                        <h4 class="pt-2 pb-1">Provincia</h4>
                        <v-text-field
                          v-model="editedItem.provincia"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h4 class="pb-1">Cantón</h4>
                        <v-text-field
                          v-model="editedItem.canton"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h4 class="pb-1">Ciudad o Localidad Próxima</h4>
                        <v-text-field
                          v-model="editedItem.ciudad"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <h4 class="pb-1">Parroquia</h4>
                        <v-text-field
                          v-model="editedItem.parroquia"
                          filled
                          rounded
                          dense
                        ></v-text-field>

                        <v-row style="margin-top: -15px">
                          <v-col>
                            <h4 class="pb-3">Coordenadas</h4>
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
                                  fa-map-marker-alt
                                </v-icon>
                              </template>
                              <span> Elegir punto en mapa </span>
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

                        <h3 class="pb-1">Servicios Básicos</h3>
                        <v-divider></v-divider>
                        <h4 class="pb-1">Agua</h4>
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

                        <h4 class="pb-1">Energía Eléctrica</h4>
                        <v-combobox
                          v-model="editedItem.energia"
                          :items="energies"
                          filled
                          rounded
                          dense
                          :loading="loading"
                          tags
                        ></v-combobox>

                        <h4 class="pb-1">Disposición de Desechos</h4>
                        <v-combobox
                          v-model="editedItem.desechos"
                          :items="waste"
                          filled
                          rounded
                          dense
                          :loading="loading"
                        ></v-combobox>

                        <v-divider></v-divider>

                        <h3 class="pb-1 pt-1">Área Protegida</h3>
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

                        <h3 class="pb-1">Representante</h3>
                        <v-autocomplete
                          v-model="editedItem.representante"
                          :items="representants"
                          item-text="nombre"
                          return-object
                          filled
                          rounded
                          dense
                          clearable
                          :loading="loading"
                        ></v-autocomplete>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-container>
                        <v-row>
                          <v-col cols="6" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="close">Cancelar</v-btn>
                          </v-col>
                          <v-col cols="6" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="save"> Guardar </v-btn>
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

      <template v-slot:item.estado="">
        <v-chip color="success" dark> Activo </v-chip>
      </template>

      <template v-slot:item.representante="{ item }">
        <div v-if="item.representante">
          <v-row class="pa-0 ma-0">
            <v-col cols="10" class="ma-0 pa-0">
              <v-chip color="success" dark> Asignado </v-chip>
            </v-col>
            <v-col cols="2" class="ma-0 pa-0 pt-1 pl-1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="info--text"
                    v-on="on"
                    v-bind="attrs"
                    @click="showObject('representant', item)"
                  >
                    fa-eye
                  </v-icon>
                </template>
                <span> Ver Representante</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <v-chip color="warning" dark> Sin Asignar </v-chip>
        </div>
      </template>

      <template v-slot:item.areaProtegida="{ item }">
        <div v-if="item.areaProtegida">
          <v-row class="pa-0 ma-0">
            <v-col cols="10" class="ma-0 pa-0">
              <v-chip color="success" dark> Asignado </v-chip>
            </v-col>
            <v-col cols="2" class="ma-0 pa-0 pt-1 pl-1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="info--text"
                    v-on="on"
                    v-bind="attrs"
                    @click="showObject('area', item)"
                  >
                    fa-eye
                  </v-icon>
                </template>
                <span> Ver Área Protegida</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <v-chip color="warning" dark> Sin Asignar </v-chip>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-row class="pa-0 ma-0">
          <v-col cols="6" class="pa-0 ma-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="edit--text ma-1 mr-2"
                  @click="editItem(item)"
                  v-on="on"
                  v-bind="attrs"
                >
                  fa-pen
                </v-icon>
              </template>
              <span> Editar un Establecimiento </span>
            </v-tooltip>
          </v-col>

          <v-col cols="6" class="pa-0 ma-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="delete--text ma-1 ml-2"
                  @click="deleteItem(item)"
                  v-on="on"
                  v-bind="attrs"
                >
                  fa-trash
                </v-icon>
              </template>
              <span> Eliminar un Establecimiento </span>
            </v-tooltip>
          </v-col>
        </v-row>
      </template>

      <template v-slot:item.lugar="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.lat || item.lng"
              class="info--text pa-1"
              @click="showObject('place', item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-eye
            </v-icon>
            <v-icon v-else class="gray--text pa-1" v-on="on" v-bind="attrs">
              fa-eye-slash
            </v-icon>
          </template>
          <span v-if="item.lat || item.lng"> Ver Información de Ubicación </span>
          <span v-else>No se encuentra Información de Ubicación</span>
        </v-tooltip>
      </template>

      <template v-slot:item.servicios="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.energia || item.agua || item.saneamiento || item.desechos"
              class="info--text pa-1"
              @click="showObject('service', item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-eye
            </v-icon>
            <v-icon v-else class="gray--text pa-1" v-on="on" v-bind="attrs">
              fa-eye-slash
            </v-icon>
          </template>
          <span v-if="item.energia || item.agua || item.saneamiento || item.desechos">
            Ver Servicios Básicos
          </span>
          <span v-else>No se han registrado Servicios Básicos</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogService" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Servicios Básicos</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h3 class="pb-1">Agua</h3>
            <v-text-field
              v-model="editedItem.agua"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Saneamiento</h3>
            <v-text-field
              v-model="editedItem.saneamiento"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Energía Eléctrica</h3>
            <v-text-field
              v-model="editedItem.energia"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Disposición de Desechos</h3>
            <v-text-field
              v-model="editedItem.desechos"
              filled
              rounded
              dense
              disabled
            ></v-text-field>
          </v-container>

          <v-card-actions>
            <v-row>
              <v-col cols="12" class="d-flex justify-space-around pa-0">
                <v-btn text @click="closeObject('service')">Cerrar</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline">
                  ¿Está seguro de borrar este Establecimiento?</span
                >
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

    <v-dialog v-model="dialogRepresentant" max-width="500px">
      <v-card v-if="editedItem.representante">
        <v-card-title class="primary white--text">
          <span class="headline">Representante</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h3 class="pb-1">Nombre</h3>
            <v-text-field
              v-model="editedItem.representante.nombre"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Apellido</h3>
            <v-text-field
              v-model="editedItem.representante.apellido"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Cédula</h3>
            <v-text-field
              v-model="editedItem.representante.cedula"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Correo</h3>
            <v-text-field
              v-model="editedItem.representante.email"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Teléfono</h3>
            <v-text-field
              v-model="editedItem.representante.telefono"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Dirección</h3>
            <v-textarea
              auto-grow
              filled
              rounded
              dense
              rows="1"
              row-height="15"
              v-model="editedItem.representante.direccion"
              disabled
            ></v-textarea>

            <h3 class="pb-1">Usuario Asignado</h3>
            <div v-if="editedItem.representante.usuario">
              <v-chip color="success" dark> Tiene un Usuario asignado </v-chip>
            </div>
            <div v-else>
              <v-chip color="warning" dark> No tiene Usuario asignado </v-chip>
            </div>
          </v-container>
        </v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-around pa-0">
              <v-btn text @click="closeObject('representant')">Cerrar</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogArea" max-width="500px">
      <v-card v-if="editedItem.areaProtegida">
        <v-card-title class="primary white--text">
          <span class="headline">Área Protegida</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h3 class="pt-2 pb-1">Nombre</h3>
            <v-text-field
              v-model="editedItem.areaProtegida.nombre"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3>Tipo</h3>
            <v-text-field
              v-model="editedItem.areaProtegida.tipo"
              filled
              rounded
              dense
              disabled
            ></v-text-field>
          </v-container>

          <v-card-actions>
            <v-row>
              <v-col cols="12" class="d-flex justify-space-around pa-0">
                <v-btn text @click="closeObject('area')">Cerrar</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPlace" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Lugar</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h3 class="pb-1">Provincia</h3>
            <v-text-field
              v-model="editedItem.provincia"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Cantón</h3>
            <v-text-field
              v-model="editedItem.canton"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Ciudad</h3>
            <v-text-field
              v-model="editedItem.ciudad"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h3 class="pb-1">Parroquia</h3>
            <v-text-field
              v-model="editedItem.parroquia"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <v-row style="margin-top: -15px">
              <v-col>
                <h3 class="pb-3">Coordenadas</h3>
              </v-col>
              <v-col align="end">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="edit--text"
                      @click="showMap(false)"
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

            <h4 class="pb-1">Latitud</h4>
            <v-text-field
              v-model="editedItem.lat"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h4 class="pb-1">Longitud</h4>
            <v-text-field
              v-model="editedItem.lng"
              filled
              rounded
              dense
              disabled
            ></v-text-field>

            <h4>Fuente: Google Maps</h4>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="12" class="d-flex justify-space-around pa-0">
                <v-btn text @click="closeObject('place')">Cerrar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMap" max-width="600px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline"> {{ mapTitle }} </span>
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
      editedIndex: -1,
      loading: false,
      dialog: false,
      dialogDelete: false,
      dialogArea: false,
      dialogRepresentant: false,
      dialogPlace: false,
      dialogMap: false,
      dialogService: false,
      problem: false,
      editMap: false,
      establishments: [],
      areas: [],
      representants: [],
      waters: [],
      energies: [],
      sanitation: [],
      waste: [],
      headers: [
        {
          text: 'Nombre',
          value: 'nombre',
          align: 'start'
        },
        {
          text: 'Administrador',
          value: 'administrador'
        },
        {
          text: 'Representante',
          value: 'representante',
          align: 'center'
        },
        {
          text: 'Correo',
          value: 'email'
        },
        {
          text: 'Nacionalidad / Pueblo',
          value: 'nacionalidad',
          align: 'center'
        },
        {
          text: 'Registro',
          value: 'registro'
        },
        {
          text: 'LUAF',
          value: 'LUAF'
        },
        {
          text: 'Página web',
          value: 'web',
          align: 'center'
        },
        {
          text: 'Teléfono',
          value: 'telefono'
        },
        {
          text: 'Lugar',
          value: 'lugar',
          align: 'center',
          sortable: false
        },
        {
          text: 'Servicios Básicos',
          value: 'servicios',
          align: 'center',
          sortable: false
        },
        {
          text: 'Área Protegida',
          value: 'areaProtegida',
          align: 'center'
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
      ],
      editedItem: {
        _id: '',
        nombre: '',
        administrador: '',
        representante: { nombre: '' },
        nacionalidad: '',
        registro: '',
        LUAF: 'No',
        email: '',
        web: '',
        telefono: '',
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
        areaProtegida: {},
        estado: false
      },
      defaultItem: {
        _id: '',
        nombre: '',
        administrador: '',
        representante: { nombre: '' },
        nacionalidad: '',
        registro: '',
        LUAF: 'No',
        email: '',
        web: '',
        telefono: '',
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
        areaProtegida: {},
        estado: false
      },
      coordinates: {
        lat: 0,
        lng: 0
      },
      editedRepresentant: {
        _id: '',
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        telefono: '',
        direccion: '',
        usuario: {
          nombre: ''
        }
      },
      defaultRepresentant: {
        _id: '',
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        telefono: '',
        direccion: '',
        usuario: {
          nombre: ''
        }
      },
      editedArea: {
        _id: '',
        nombre: '',
        tipo: ''
      },
      defaultArea: {
        _id: '',
        nombre: '',
        tipo: ''
      }
    }
  },

  methods: {
    async getEstablishments() {
      this.loading = true
      this.establishments = []
      await this.$http
        .get('/api/establecimientos')
        .then(res => {
          this.loading = false
          this.establishments = res.data.data
          this.getBasicServices()
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

    async getAreas() {
      this.loading = true
      await this.$http
        .get('/api/areasProtegidas')
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

    async getRepresentants() {
      this.loading = true
      await this.$http
        .get('/api/representantes/noAsignados')
        .then(res => {
          this.loading = false
          this.representants = res.data.data
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
      this.dialog = false
      if (this.editedItem.representante) {
        this.representants.splice(
          this.representants.indexOf(this.editedItem.representante)
        )
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedRepresentant = Object.assign({}, this.defaultRepresentant)
        this.editedArea = Object.assign({}, this.defaultArea)
        this.editedIndex = -1
      })
    },

    editItem(item) {
      this.editedIndex = this.establishments.indexOf(item)
      this.editedItem = Object.assign({}, item)
      if (this.editedItem.representante) {
        this.representants.push(this.editedItem.representante)
        this.editedRepresentant = Object.assign({}, this.editedItem.representante)
      }
      if (this.editedItem.areaProtegida) {
        this.editedArea = Object.assign({}, this.editedItem.areaProtegida)
      }
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.establishments.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async deleteItemConfirm() {
      await this.removeEstablishment()
      if (!this.problem) {
        this.establishments.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    showObject(critery, item) {
      this.editedItem = item
      switch (critery) {
        case 'representant':
          this.dialogRepresentant = true
          break
        case 'area':
          this.dialogArea = true
          break
        case 'place':
          this.dialogPlace = true
          break
        case 'service':
          this.dialogService = true
          break
      }
    },

    closeObject(critery) {
      switch (critery) {
        case 'representant':
          this.dialogRepresentant = false
          break
        case 'area':
          this.dialogArea = false
          break
        case 'place':
          this.dialogPlace = false
          break
        case 'service':
          this.dialogService = false
          break
      }

      this.editedItem = Object.assign({}, this.defaultItem)
    },

    showMap(data, item) {
      this.editMap = data
      if (item) {
        this.coordinates.lat = item.lat
        this.coordinates.lng = item.lng
      } else {
        this.coordinates.lat = this.editedItem.lat
        this.coordinates.lng = this.editedItem.lng
      }
      this.dialogMap = true
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

    getBasicServices() {
      //waters
      this.waters = this.establishments.map(v => {
        return v.agua
      }).filter(v => {
        return v != undefined
      })

      //energies
      this.energies = this.establishments.map(v => {
        return v.energia
      }).filter(v => {
        return v != undefined
      })

      //waste
      this.waste = this.establishments.map(v => {
        return v.desechos
      }).filter(v => {
        return v != undefined
      })

      //sanitation
      this.sanitation = this.establishments.map(v => {
        return v.saneamiento
      }).filter(v => {
        return v != undefined
      })
    },

    async save() {
      if (this.editedIndex > -1) {

        if (this.editedRepresentant._id && !this.editedItem.representante) {
          await this.eraseRepresentant()
        }

        if (this.editedArea._id && !this.editedItem.areaProtegida) {
          await this.eraseAreaProtegida()
        }

        if (!this.problem) {
          await this.changeEstablishment()
        }
        
        if (!this.problem) {
          Object.assign(this.establishments[this.editedIndex], this.editedItem)
          this.close()
          this.getBasicServices()
        }
      } else {
        await this.addEstablishment()
        if (!this.problem) {
          this.establishments.push(this.editedItem)
          this.close()
          this.getBasicServices()
        }
      }
      this.problem = false
    },

    async addEstablishment() {
      this.loading = true
      swalLoading('Ingresando Establecimiento')
      if (!this.editedItem.areaProtegida._id) delete this.editedItem.areaProtegida
      if (!this.editedItem.representante._id) delete this.editedItem.representante
      try {
        await this.$http.post('/api/establecimiento', this.editedItem).then(async res => {
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

    async eraseRepresentant() {
      this.loading = true
      swalLoading('Quitando Representante')
      try {
        await this.$http
          .put('/api/establecimiento/removerRepresentante/' + this.editedItem._id)
          .then(() => {
            this.loading = false
            swalConfirm('Represenante quitado')
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
    },

    async eraseAreaProtegida() {
      this.loading = true
      swalLoading('Quitando AreaProtegida')
      try {
        await this.$http
          .put('/api/establecimiento/removerArea/' + this.editedItem._id)
          .then(() => {
            this.loading = false
            swalConfirm('Area Protegida quitada')
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
    },

    async removeEstablishment() {
      this.loading = true
      swalLoading('Eliminando establecimiento')
      try {
        await this.$http
          .delete(`/api/establecimiento/${this.editedItem._id}`)
          .then(() => {
            this.loading = false
            swalConfirm('Establecimiento Eliminado')
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

    async changeEstablishment() {
      this.loading = true
      swalLoading('Editando establecimiento')
      var establishmentEdit = Object.assign({}, this.editedItem)

      if (establishmentEdit.areaProtegida) {
        establishmentEdit.areaProtegida = establishmentEdit.areaProtegida._id
      }

      if (establishmentEdit.representante) {
        if (this.editedRepresentant._id === this.editedItem.representante._id) {
          delete establishmentEdit.representante
        } else {
          establishmentEdit.representante = establishmentEdit.representante._id
        }
      }

      try {
        await this.$http
          .put(`/api/establecimiento/${establishmentEdit._id}`, establishmentEdit)
          .then(async () => {
            this.loading = false
            swalConfirm('Establecimiento editado')
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
    await this.getEstablishments()
    await this.getAreas()
    await this.getRepresentants()
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Crear un Establecimiento'
        : 'Editar un Establecimiento'
    },

    mapTitle() {
      return this.editMap ? 'Elija un punto en el mapa' : 'Localización Actual'
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
      if (!val) this.getEstablishments()
    },

    dialogRepresentant(val) {
      val || this.closeObject('representant')
    },

    dialogArea(val) {
      val || this.closeObject('area')
    },

    dialogPlace(val) {
      val || this.closeObject('place')
    },

    dialogService(val) {
      val || this.closeObject('service')
    },

    dialogMap(val) {
      val || this.closeMap()
    }
  }
}
</script>
