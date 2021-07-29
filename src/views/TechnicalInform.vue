<template>
  <div>
    <v-row>
      <v-col cols="12" :sm="sm">
        <v-card>
          <v-card-title class="primary white--text">
            <span class="headline">Diagnosticos </span>
            <v-spacer></v-spacer>
            <v-btn icon @click="seeDiagnostics = !seeDiagnostics">
              <v-icon v-if="seeDiagnostics"> fa-angle-up </v-icon>
              <v-icon v-else> fa-angle-down</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text v-if="seeDiagnostics" class="pa-0">
            <div v-if="!loading && diagnostics.length > 0">
              <div v-for="(fecha, i) in dateNotRepeted" :key="i + 'Date'">
                <v-card-title class="secondary lighten-1">
                  <span class="headline">{{ fecha }}</span>
                </v-card-title>

                <v-card-text
                  v-for="(item, index) in diagnostics"
                  :key="index + 'diagnostics'"
                  class="pa-0 ma-0"
                >
                  <div v-show="formatFecha(item.fecha).includes(fecha.toLowerCase())">
                    <v-row class="pa-0 ma-0">
                      <v-col cols="2" align="center">
                        <v-btn
                          icon
                          class="info--text"
                          v-if="existInInform(item)"
                          @click="addDiagnostic(item._id)"
                        >
                          <v-icon> fa-plus</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          class="error--text"
                          v-else
                          @click="removeDiagnostic(item._id, index)"
                        >
                          <v-icon> fa-times</v-icon>
                        </v-btn>
                      </v-col>

                      <v-col cols="7" class="pt-4">
                        <h3>
                          {{ item.formulario.nombre }} - {{ formatFecha(item.fecha) }} -
                          <span :class="getColorTotal(item.total) + '--text'">
                            {{ item.total }}
                          </span>
                        </h3>
                      </v-col>

                      <v-col cols="3" align="center">
                        <v-btn icon @click="seeDiagnostic(item)">
                          <v-icon class="info--text"> fa-eye</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                  </div>
                </v-card-text>
              </div>
            </div>

            <div v-if="!loading && diagnostics.length === 0">
              <v-card-title class="secondary lighten-1">
                <span class="headline"
                  >No se han realizado Diagnósticos para este Establecimiento</span
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
        <v-card>
          <v-card-title class="primary white--text">
            <span class="headline">Informe</span>
          </v-card-title>

          <v-card-text class="pl-5 pr-5 pt-2">
            <h3 class="pt-2 pb-1">Diagnosticos seleccionados</h3>

            <div v-for="item in editedInform.diagnostico" :key="item + 'DiagnosticoID'">
              <div
                v-for="(diagnostic, index) in diagnostics"
                :key="index + 'diagnisticosInInform'"
              >
                <div v-if="diagnostic._id.includes(item)" class="pb-2">
                  {{ diagnostic.formulario.nombre }} --
                  {{ formatFecha(diagnostic.fecha) }} --
                  <span :class="getColorTotal(diagnostic.total) + '--text pa-0 ma-0'">
                    {{ diagnostic.total }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="editedInform.diagnostico.length == 0">
              Agregue Diagnósticos para continuar
            </div>

            <div v-else>
              <h3 class="pt-2 pb-1">Resumen de diagnosticos</h3>

              <v-row>
                <v-col></v-col>
                <v-col
                  v-for="item in editedInform.diagnostico"
                  :key="item + 'DiagnosticoInInform'"
                  align="center"
                >
                  <div
                    v-for="(diagnostic, index) in diagnostics"
                    :key="index + 'diagnisticosInAbstract'"
                  >
                    <h4 v-if="diagnostic._id.includes(item)" class="pb-2">
                      {{ diagnostic.formulario.nombre }}
                    </h4>
                  </div>
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
                  v-for="column in editedInform.diagnostico"
                  :key="column + 'total'"
                  align="center"
                >
                  {{ getTotal(column) }}
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
                    v-model="editedInform.personal[index]"
                    :rules="numberRules"
                  ></v-text-field>
                </v-col>
                <span class="pt-5 ml-0 pl-0"> /{{ establishment.personal }} </span>
              </v-row>

              <div class="error">
                <h4 v-if="!maxPeople" class="ml-4 white--text">
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
                v-for="(item, index) in diagnostics"
                :key="index + 'ProductosTuristicos'"
              >
                <div
                  class="pa-0 ma-0"
                  v-for="(id, i) in editedInform.diagnostico"
                  :key="i"
                >
                  <div v-if="id === item._id">
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
                                item.respuesta[item.formulario.mostrarEnInforme].valor[
                                  idRes
                                ][idFormat]
                              )
                            }}
                          </div>

                          <div v-else-if="format.tipo === 'ABIERTA'">
                            {{
                              getRespuesta(
                                'ABIERTA',
                                item.respuesta[item.formulario.mostrarEnInforme].valor[
                                  idRes
                                ][idFormat]
                              )
                            }}
                          </div>

                          <div v-else-if="format.tipo === 'SELECCION'">
                            <v-radio-group
                              v-model="
                                item.respuesta[item.formulario.mostrarEnInforme].valor[
                                  idRes
                                ][idFormat]
                              "
                            >
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
                </div>
              </div>

              <h3 class="pt-2">
                Conclusiones
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
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
                v-for="(item, indice) in editedInform.conclusion"
                :key="indice"
                v-model="editedInform.conclusion[indice]"
                auto-grow
                filled
                rounded
                dense
                rows="1"
                style="margin-bottom: -10px"
              >
                <template v-if="editedInform.conclusion.length > 1" v-slot:append>
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
                <template v-if="editedInform.recomendacion.length > 1" v-slot:append>
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
                <template v-if="editedInform.observacion.length > 1" v-slot:append>
                  <v-icon @click="removeOption('observacion', indice)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-textarea>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              class="success"
              @click="save"
              block
              :disabled="editedInform.diagnostico.length === 0 ? true : !maxPeople"
            >
              Enviar Informe
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDiagnostic" max-width="700px">
      <seeDiagnostic :diagnostic="diagnostic" @accion="closeDiagnostic" />
    </v-dialog>
  </div>
</template>

<script>
import { swalConfirm, swalLoading, swalError } from '@/utils/notify'
import { mapState } from 'vuex'
import { getFecha } from '@/utils/moment'

export default {
  data() {
    return {
      problem: false,
      loading: false,
      seeDiagnostics: true,
      dialogDiagnostic: false,
      sm: '6',
      diagnostic: {
        formulario: {
          nombre: ''
        }
      },
      editedInform: {
        diagnostico: [],
        conclusion: [''],
        recomendacion: [''],
        observacion: [''],
        servicio: [],
        clasificacion: [],
        personal: [],
        actividad: [],
        actualPersonal: 0
      },
      defaultInform: {
        diagnostico: [],
        conclusion: [''],
        recomendacion: [''],
        observacion: [''],
        servicio: [],
        clasificacion: [],
        personal: [],
        actividad: [],
        actualPersonal: 0
      },
      diagnostics: [],
      dateNotRepeted: [],
      numberRules: [
        v => !!v || 'Campo necesario',
        v => Number.isInteger(parseInt(v)) || 'Solo se permiten números',
        v => Number.isInteger(parseFloat(v.toString().replace(/,/g, '.'))) || 'Solo se permiten números enteros',
      ]
    }
  },

  computed: {
    ...mapState(['user', 'establishment']),

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

  methods: {
    async getDiagnostics() {
      this.loading = true
      this.diagnostics = []
      this.dateNotRepeted = []
      await this.$http
        .get(`api/diagnosticos/${this.user._id}/${this.establishment._id}`)
        .then(res => {
          this.loading = false
          this.diagnostics = res.data.data
          this.getDate()
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

    closeDiagnostic() {
      this.diagnostic = {
        formulario: {
          nombre: ''
        }
      }
      this.dialogDiagnostic = false
    },

    getDate() {
      this.dateNotRepeted = this.diagnostics.map(item => {
        var date = getFecha(item.fecha).split(' ')
        return date[2].toUpperCase() + ' ' + date[3]
      })

      //algoritmo para eliminar iguales copiado de internet
      for (var i = this.dateNotRepeted.length - 1; i >= 0; i--) {
        if (this.dateNotRepeted.indexOf(this.dateNotRepeted[i]) !== i)
          this.dateNotRepeted.splice(i, 1)
      }
    },

    seeDiagnostic(item) {
      this.diagnostic = item
      this.dialogDiagnostic = true
    },

    getColorTotal(item) {
      var total = parseInt(item.split('%')[0])
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

    existInInform(item) {
      var indice = this.editedInform.diagnostico.indexOf(item._id)
      if (indice > -1) {
        return false
      } else {
        return true
      }
    },

    async save() {
      await this.addInform()
      if (!this.problem) {
        this.editedInform = Object.assign({}, this.defaultInform)
      }
    },

    removeOption(critery, index) {
      if (critery === 'conclusion') {
        this.editedInform.conclusion.splice(index, 1)
      } else {
        if (critery === 'recomendacion') {
          this.editedInform.recomendacion.splice(index, 1)
        } else {
          this.editedInform.observacion.splice(index, 1)
        }
      }
    },

    getTotal(item) {
      var itemInforme = this.diagnostics.filter(v => {
        return v._id === item
      })
      if (itemInforme[0]) {
        return itemInforme[0].total
      }
    },

    yesNoLabel(item) {
      return item ? 'Si' : 'No'
    },

    addDiagnostic(id) {
      this.editedInform.diagnostico.push(id)
      this.editedInform.servicio.push(false)
      this.editedInform.clasificacion.push('')
      this.editedInform.personal.push(0)
    },

    removeDiagnostic(id, index) {
      this.editedInform.diagnostico.splice(this.editedInform.diagnostico.indexOf(id), 1)
      this.editedInform.clasificacion.splice(index, 1)
      this.editedInform.servicio.splice(index, 1)
      this.editedInform.personal.splice(index, 1)
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
    },

    async addInform() {
      this.loading = true
      swalLoading('Enviando Informe')
      this.editedInform.actualPersonal = this.establishment.personal
      try {
        await this.$http.post('api/informe', this.editedInform).then(async () => {
          this.loading = false
          swalConfirm('Informe nuevo enviado')
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

    formatFecha(item) {
      return getFecha(item)
    }
  },

  async created() {
    this.getDiagnostics()
    if (this.establishment.actividad.length > 0) {
      this.editedInform.actividad = this.establishment.actividad.map(v => {
        return v.nombre
      })
    }
  },

  watch: {
    seeDiagnostics(v) {
      if (v) {
        this.sm = '6'
      } else {
        this.sm = '12'
      }
    },

    establishment() {
      this.getDiagnostics()
      this.editedInform = {
        diagnostico: [],
        conclusion: [''],
        recomendacion: [''],
        observacion: [''],
        servicio: [],
        clasificacion: [],
        personal: [],
        actividad: [],
        actualPersonal: 0
      }
    }
  }
}
</script>
