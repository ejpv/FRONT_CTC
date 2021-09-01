<template>
  <div>
    <v-row>
      <v-col cols="12" :sm="sm">
        <v-card>
          <v-card-title class="primary white--text">
            <span class="headline">Informes de {{ establishment.nombre }} </span>
            <v-spacer></v-spacer>
            <v-btn icon @click="seeInforms = !seeInforms">
              <v-icon v-if="seeInforms"> fa-angle-up </v-icon>
              <v-icon v-else> fa-angle-down</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text v-if="seeInforms" class="pa-0">
            <div v-if="informs.length > 0 && !loading">
              <div v-for="(fecha, i) in dateNotRepeted" :key="i">
                <v-card-title class="secondary lighten-1">
                  <span class="headline">{{ fecha }}</span>
                </v-card-title>

                <div v-for="(item, index) in informs" :key="item._id">
                  <v-row
                    v-if="formatFecha(item.fechaCreacion).includes(fecha.toLowerCase())"
                    class="ma-0"
                  >
                    <v-col>
                      <h4>
                        Informe del
                        <span class="font-weight-black">
                          {{ formatFecha(informs[index].fechaCreacion) }}
                        </span>
                      </h4>
                    </v-col>

                    <v-col cols="6" sm="5" md="4" lg="3">
                      <v-chip :class="`${getColor(item.estado)} white--text mr-2`">
                        {{ getText(item.estado) }}
                      </v-chip>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon icon v-bind="attrs" v-on="on" class="pa-0 ma-0">
                            fa-ellipsis-v
                          </v-icon>
                        </template>

                        <v-list flat tile>
                          <v-list-item @click="prepareWorkStation(item, 'see')">
                            <v-list-item-icon>
                              <v-icon class="ml-2 info--text">fa-eye </v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                              <span> Ver este Informe </span>
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            @click="prepareWorkStation(item, 'edit')"
                            :disabled="item.estado"
                          >
                            <v-list-item-icon>
                              <v-icon class="ml-2 edit--text" :disabled="item.estado"
                                >fa-pen
                              </v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                              <span> Editar este Informe </span>
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="deleteItem(item)" :disabled="item.estado">
                            <v-list-item-icon>
                              <v-icon class="ml-2 delete--text" :disabled="item.estado">
                                fa-trash
                              </v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                              <span> Eliminar este Informe </span>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>

            <div v-else>
              <v-card-title class="secondary lighten-1">
                <span class="headline"
                  >No has realizado Informes para este Establecimiento</span
                >
              </v-card-title>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="pt-1 pb-1" flat v-show="loading">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </v-card>
      </v-col>

      <v-col cols="12" :sm="sm">
        <div v-if="action != ''">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline"
                >Informe del {{ formatFecha(editedInform.fechaCreacion) }}
              </span>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-show="editedInform.estado"
                    icon
                    class="mr-2 white--text"
                    v-on="on"
                    v-bind="attrs"
                    @click="download(editedInform)"
                  >
                    <v-icon> fa-download </v-icon>
                  </v-btn>
                </template>
                <span> Descargar como PDF </span>
              </v-tooltip>
              <v-chip
                :class="`${getColor(editedInform.estado)} white--text`"
              >
                {{ getText(editedInform.estado) }}
              </v-chip>
              <v-btn icon @click="restoreDefault">
                <v-icon> fa-times</v-icon></v-btn
              >
            </v-card-title>

            <v-card-text class="pl-5 pr-5 pt-2">
              <h3 class="pt-2 pb-1">Diagnosticos</h3>
              <div v-for="(item, index) in editedInform.diagnostico" :key="index">
                <h3 class="pl-4 pb-3">
                  <v-btn icon @click="seeDiagnostic(item)">
                    <v-icon class="info--text"> fa-eye</v-icon>
                  </v-btn>
                  {{ item.formulario.nombre }} - {{ formatFecha(item.fecha) }} -
                  <span :class="getColorTotal(item) + '--text'">
                    {{ item.total }}
                  </span>
                </h3>
              </div>

              <h3 class="pt-2 pb-1">Resumen de diagnosticos</h3>

              <v-row>
                <v-col></v-col>
                <v-col
                  v-for="(item, index) in editedInform.diagnostico"
                  :key="index + 'DiagnosticoInInform'"
                  align="center"
                >
                  <h4 class="pb-2">
                    {{ item.formulario.nombre }}
                  </h4>
                </v-col>
              </v-row>

              <v-row class="pa-0 ma-0">
                <v-col class="pt-8">
                  <span> Servicios Turísticos </span>
                </v-col>
                <v-col
                  v-for="(column, index) in editedInform.diagnostico"
                  :key="index + 'Service'"
                  align="center"
                >
                  <v-switch
                    :label="yesNoLabel(editedInform.servicio[index])"
                    filled
                    :disabled="disableItem"
                    rounded
                    dense
                    v-model="editedInform.servicio[index]"
                  />
                </v-col>
              </v-row>

              <v-row class="pa-0 ma-0">
                <v-col class="pt-5">
                  <span> Clasificación / Tipo </span>
                </v-col>
                <v-col
                  v-for="(column, index) in editedInform.diagnostico"
                  :key="index + 'Clasification'"
                  align="center"
                >
                  <v-text-field
                    v-if="column"
                    :disabled="disableItem"
                    filled
                    rounded
                    dense
                    v-model="editedInform.clasificacion[index]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="pa-0 ma-0">
                <v-col>
                  <span> Condición Porcentual </span>
                </v-col>
                <v-col
                  v-for="(column, index) in editedInform.diagnostico"
                  :key="index + 'total'"
                  align="center"
                >
                  {{ column.total }}
                </v-col>
              </v-row>

              <v-row class="pa-0 ma-0">
                <v-col class="pt-5">
                  <span> Personal </span>
                </v-col>
                <v-col
                  v-for="(column, index) in editedInform.diagnostico"
                  :key="index + 'Personal'"
                  align="center"
                >
                  <v-text-field
                    filled
                    rounded
                    dense
                    :disabled="disableItem"
                    v-model="editedInform.personal[index]"
                    :rules="numberRules"
                  ></v-text-field>
                </v-col>
                <span class="pt-5 ml-0 pl-0"> /{{ editedInform.actualPersonal }} </span>
              </v-row>

              <div class="error" v-if="!maxPeople && !editedInform.estado">
                <h4 class="ml-4 white--text">
                  El distribuido es: {{ currentPeople }}, la distribución no puede ser
                  menor o mayor a {{ establishment.personal }}.
                </h4>
              </div>

              <h3 class="pt-2">Actividades Turísticas</h3>
              <v-row class="pa-0 ma-0" v-if="editedInform.actividad.length > 0">
                <v-col
                  v-for="(column, index) in editedInform.actividad"
                  :key="index + 'Activities'"
                  align="center"
                  >{{ index + 1 }}.- {{ column }}
                </v-col>
              </v-row>
              <v-row v-else class="pa-0 ma-0">
                <h4 class="pa-3 ma-3">
                  No Aplica, el establecimiento no tiene Actividades
                </h4>
              </v-row>

              <h3 class="pt-2">Productos Turísticos</h3>
              <div
                v-for="(item, index) in editedInform.diagnostico"
                :key="index + 'ProductosTuristicos'"
              >
                <div v-if="item.formulario.mostrarEnInforme != null">
                  <v-divider></v-divider>
                  <v-row class="ma-0 pa-0">
                    <v-col
                      v-for="(header, idHeader) in item.formulario.pregunta[
                        item.formulario.mostrarEnInforme
                      ].encabezado"
                      :key="idHeader + 'H'"
                      align="center"
                    >
                      <span class="font-weight-medium">{{ header }}</span>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-row
                    v-for="(res, idRes) in item.respuesta[
                      item.formulario.mostrarEnInforme
                    ].valor"
                    :key="idRes + 'R'"
                    class="ma-0 pa-0"
                    align="center"
                  >
                    <v-col
                      v-for="(format, idFormat) in item.formulario.pregunta[
                        item.formulario.mostrarEnInforme
                      ].formato"
                      :key="idFormat + 'F'"
                      class="d-flex child-flex pa-1"
                      align="center"
                    >
                      <div v-if="format.tipo === 'SN'">
                        {{
                          getRespuesta(
                            'SN',
                            item.respuesta[item.formulario.mostrarEnInforme].valor[idRes][
                              idFormat
                            ]
                          )
                        }}
                      </div>

                      <div v-else-if="format.tipo === 'ABIERTA'">
                        {{
                          getRespuesta(
                            'ABIERTA',
                            item.respuesta[item.formulario.mostrarEnInforme].valor[idRes][
                              idFormat
                            ]
                          )
                        }}
                      </div>

                      <div v-else-if="format.tipo === 'SELECCION'">
                        <v-radio-group
                          v-model="
                            item.respuesta[item.formulario.mostrarEnInforme].valor[idRes][
                              idFormat
                            ]
                          "                        >
                          <v-radio
                            v-for="(option, number) in format.opciones"
                            :label="option"
                            disabled
                            :key="'SV' + number"
                          >
                          </v-radio>
                        </v-radio-group>
                      </div>

                      <div v-else-if="format.tipo === 'MULTIPLE'">
                        <div
                          v-for="(check, checkIndex) in format.opciones"
                          :key="checkIndex"
                        >
                          <v-checkbox
                            v-model="
                              item.respuesta[item.formulario.mostrarEnInforme].valor[
                                idRes
                              ][idFormat][checkIndex]
                            "
                            disabled
                            class="pa-0"
                          >
                            <template v-slot:label>
                              <span class="subtitle-2">{{ check }}</span>
                            </template>
                          </v-checkbox>
                        </div>
                      </div>
                      <v-divider vertical></v-divider>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <h3 class="pt-2">
                Conclusiones
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="disableItem"
                      icon
                      @click="editedInform.conclusion.push('')"
                      small
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon class="info--text" small> fa-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> Agregar una conclusion </span>
                </v-tooltip>
              </h3>

              <v-textarea
                :disabled="disableItem"
                v-for="(item, indice) in editedInform.conclusion"
                :key="'C' + indice"
                v-model="editedInform.conclusion[indice]"
                auto-grow
                filled
                rounded
                dense
                rows="1"
                style="margin-bottom: -10px"
              >
                <template
                  v-if="editedInform.conclusion.length > 1 && !disableItem"
                  v-slot:append
                >
                  <v-icon @click="removeOption('conclusion', indice)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-textarea>

              <h3 class="pt-2">
                Recomendaciones
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      :disabled="disableItem"
                      @click="editedInform.recomendacion.push('')"
                      small
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon class="info--text" small> fa-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> Agregar una recomendacion </span>
                </v-tooltip>
              </h3>

              <v-textarea
                :disabled="disableItem"
                v-for="(item, indice) in editedInform.recomendacion"
                :key="'A' + indice"
                v-model="editedInform.recomendacion[indice]"
                auto-grow
                filled
                rounded
                dense
                rows="1"
                style="margin-bottom: -10px"
              >
                <template
                  v-if="editedInform.recomendacion.length > 1 && !disableItem"
                  v-slot:append
                >
                  <v-icon @click="removeOption('recomendacion', indice)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-textarea>

              <h3 class="pt-2">
                Observaciones
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      :disabled="disableItem"
                      @click="editedInform.observacion.push('')"
                      small
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon class="info--text" small> fa-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> Agregar una observacion </span>
                </v-tooltip>
              </h3>

              <v-textarea
                :disabled="disableItem"
                v-for="(item, indice) in editedInform.observacion"
                :key="'B' + indice"
                v-model="editedInform.observacion[indice]"
                auto-grow
                filled
                rounded
                dense
                rows="1"
                style="margin-bottom: -10px"
              >
                <template
                  v-if="editedInform.observacion.length > 1 && !disableItem"
                  v-slot:append
                >
                  <v-icon @click="removeOption('observacion', indice)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-textarea>
              <v-card v-if="editedInform.estado === false">
                <v-container>
                  <h3 class="pt-2">Retroalimentación:</h3>
                  <v-textarea
                    disabled
                    v-model="editedInform.retroalimentacion"
                    :label="
                      editedInform.retroalimentacion ? '' : 'No existe retroalimentación'
                    "
                    auto-grow
                    filled
                    rounded
                    dense
                    rows="1"
                    style="margin-bottom: -10px"
                  >
                  </v-textarea>
                </v-container>
              </v-card>
            </v-card-text>

            <v-card-actions v-if="!disableItem && maxPeople">
              <v-btn class="success" @click="save" block> Guardar Informe </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline"> ¿Está seguro de borrar este Informe?</span>
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

    <v-dialog v-model="dialogDiagnostic" max-width="700px">
      <seeDiagnostic :diagnostic="diagnostic" @accion="closeDiagnostic" />
    </v-dialog>
  </div>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
import { Report } from '@/utils/pdfmake'
import { mapState } from 'vuex'
import { getFecha } from '@/utils/moment'

export default {
  data() {
    return {
      loading: false,
      seeInforms: true,
      dialogDelete: false,
      seeDiagnostics: true,
      dialogDiagnostic: false,
      problem: false,
      sm: 6,
      action: '',
      editedIndex: -1,
      informs: [
        {
          diagnostico: [],
          recomendacion: [],
          observacion: [],
          conclusion: []
        }
      ],
      dateNotRepeted: [],
      numberRules: [
        v => !!v || 'Campo necesario',
        v => Number.isInteger(parseInt(v)) || 'Solo se permiten números'
      ],
      editedInform: {
        diagnostico: [],
        conclusion: [''],
        recomendacion: [''],
        observacion: [''],
        servicio: [],
        clasificacion: [],
        personal: [],
        actividad: []
      },
      defaultItem: {
        diagnostico: [],
        conclusion: [''],
        recomendacion: [''],
        observacion: [''],
        servicio: [],
        clasificacion: [],
        personal: [],
        actividad: []
      },
      diagnostic: {
        formulario: {
          nombre: ''
        }
      }
    }
  },
  methods: {
    async getInforms() {
      this.loading = true
      this.informs = []
      this.dateNotRepeted = []
      await this.$http
        .get(`api/informes/${this.user._id}/${this.establishment._id}`)
        .then(res => {
          this.loading = false
          this.informs = res.data.data
          this.getDate()
          this.editedInform = Object.assign({}, this.defaultItem)
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

    getDate() {
      this.dateNotRepeted = this.informs.map(item => {
        var date = getFecha(item.fechaCreacion).split(' ')
        return date[2].toUpperCase() + ' ' + date[3]
      })

      //algoritmo para eliminar iguales copiado de internet
      for (var i = this.dateNotRepeted.length - 1; i >= 0; i--) {
        if (this.dateNotRepeted.indexOf(this.dateNotRepeted[i]) !== i)
          this.dateNotRepeted.splice(i, 1)
      }
    },

    formatFecha(item) {
      return getFecha(item)
    },

    getColor(item) {
      if (item) {
        return 'success'
      } else {
        if (item === false) {
          return 'error'
        } else {
          return 'edit'
        }
      }
    },

    getColorTotal(item) {
      var total = parseInt(item.total.split('%')[0])
      if (total < 50) {
        return 'error'
      } else {
        if (total >= 50 && total < 90) {
          return 'edit'
        } else {
          return 'success'
        }
      }
    },

    getText(item) {
      if (item) {
        return 'Aprobado'
      } else {
        if (item === false) {
          return 'Rechazado'
        } else {
          return 'Pendiente'
        }
      }
    },

    prepareWorkStation(item, critery) {
      this.action = critery
      this.editedInform = item
    },

    restoreDefault() {
      this.action = ''
      this.editedInform = Object.assign({}, this.defaultItem)
    },

    deleteItem(item) {
      this.editedIndex = this.informs.indexOf(item)
      this.editedInform = item
      this.dialogDelete = true
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedInform = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async deleteItemConfirm() {
      await this.removeInform()
      if (!this.problem) {
        this.informs.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    save() {
      this.changeInform()
      if (!this.problem) {
        var indice = this.informs.indexOf(this.editedInform)
        this.informs[indice].estado = null
        this.editedInform = Object.assign({}, this.defaultItem)
        this.action = ''
      }
    },

    async removeInform() {
      this.loading = true
      swalLoading('Eliminando Informe')
      try {
        await this.$http.delete(`api/informe/${this.editedInform._id}`).then(() => {
          this.loading = false
          swalConfirm('Informe Eliminado')
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

    async changeInform() {
      this.loading = true
      swalLoading('Editando Informe')
      try {
        await this.$http
          .put(`api/informe/${this.editedInform._id}`, this.editedInform)
          .then(async () => {
            this.loading = false
            swalConfirm('Informe editado')
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

    async download(item) {
      await Report.openPDF(item)
    },

    seeDiagnostic(item) {
      this.diagnostic = item
      this.dialogDiagnostic = true
    },

    closeDiagnostic() {
      this.diagnostic = {
        formulario: {
          nombre: ''
        }
      }
      this.dialogDiagnostic = false
    },

    yesNoLabel(item) {
      return item ? 'Si' : 'No'
    },

    getRespuesta(critery, item) {
      if (item === null) {
        return 'No se ha respondido'
      } else {
        if (critery === 'SN') {
          return item ? 'Si' : 'No'
        } else {
          return item
        }
      }
    }
  },

  computed: {
    ...mapState(['user', 'establishment']),

    disableItem() {
      return this.action === 'edit' ? false : true
    },

    maxPeople() {
      if (
        this.currentPeople > this.establishment.personal ||
        this.currentPeople < this.establishment.personal
      ) {
        return false
      } else {
        return true
      }
    },

    currentPeople() {
      var num = 0
      this.editedInform.personal.map(v => {
        if (parseInt(v)) {
          num = num + parseInt(v)
        } else {
          num = num + 0
        }
      })
      return num
    }
  },

  created() {
    this.getInforms()
  },

  watch: {
    seeInforms(v) {
      if (v) {
        this.sm = '6'
      } else {
        this.sm = '12'
      }
    },

    establishment() {
      this.getInforms()
      this.action = ''
    },

    dialogDelete(val) {
      val || this.closeDelete()
    },

    seeDiagnostics(v) {
      if (v) {
        this.sm = '6'
      } else {
        this.sm = '12'
      }
    }
  }
}
</script>
