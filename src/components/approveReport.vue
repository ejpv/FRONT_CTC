<template>
  <div>
    <v-card-title class="d-block text-center">
      <span class="headline">Informes por revisar</span>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="fa-search"
        label="Busque un Informe"
        single-line
        hide-details
        class="pa-4"
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="informs"
      class="elevation-1"
      :loading="loading"
      :search="search"
      item-key="_id"
      single-expand
      loading-text="Obteniendo todos los Informes..."
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="pa-2 pb-4">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline"
                >Informe del {{ formatFecha(item.fechaCreacion) }}
              </span>
              <v-spacer></v-spacer>
              <v-chip class="edit white--text" style="margin-left: -5px">
                Pendiente
              </v-chip>
            </v-card-title>
          </v-card>

          <v-card-text class="pl-5 pr-5 pt-2">
            <h3 class="pt-2 pb-1">Diagnósticos</h3>
            <div v-for="(ITEM, index) in item.diagnostico" :key="index">
              <h3 class="pl-4 pb-3">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="mr-2 info--text"
                      v-on="on"
                      v-bind="attrs"
                      @click="seeDiagnostic(ITEM)"
                    >
                      fa-eye
                    </v-icon>
                  </template>
                  <span> Ver diagnóstico </span>
                </v-tooltip>

                {{ ITEM.formulario.nombre }} - {{ formatFecha(ITEM.fecha) }} -
                <span :class="getColorTotal(ITEM) + '--text'">
                  {{ ITEM.total }}
                </span>
              </h3>
            </div>

            <h3 class="pt-2 pb-1">Resumen de diagnosticos</h3>

            <v-row>
              <v-col></v-col>
              <v-col
                v-for="(ITEM, index) in item.diagnostico"
                :key="index + 'DiagnosticoInInform'"
                align="center"
              >
                <h4 class="pb-2">
                  {{ ITEM.formulario.nombre }}
                </h4>
              </v-col>
            </v-row>

            <v-row class="pa-0 ma-0">
              <v-col class="pt-8">
                <span> Servicios Turísticos </span>
              </v-col>
              <v-col
                v-for="(column, index) in item.diagnostico"
                :key="index + 'Service'"
                align="center"
              >
                <v-switch
                  :label="yesNoLabel(item.servicio[index])"
                  filled
                  readonly
                  rounded
                  dense
                  v-model="item.servicio[index]"
                />
              </v-col>
            </v-row>

            <v-row class="pa-0 ma-0">
              <v-col class="pt-5">
                <span> Clasificación / Tipo </span>
              </v-col>
              <v-col
                v-for="(column, index) in item.diagnostico"
                :key="index + 'Clasification'"
                align="center"
              >
                <v-text-field
                  v-if="column"
                  readonly
                  filled
                  rounded
                  dense
                  v-model="item.clasificacion[index]"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="pa-0 ma-0">
              <v-col>
                <span> Condición Porcentual </span>
              </v-col>
              <v-col
                v-for="(column, index) in item.diagnostico"
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
                v-for="(column, index) in item.diagnostico"
                :key="index + 'Personal'"
                align="center"
              >
                <v-text-field
                  filled
                  rounded
                  dense
                  readonly
                  v-model="item.personal[index]"
                ></v-text-field>
              </v-col>
              <span class="pt-5 ml-0 pl-0"> /{{ item.actualPersonal }} </span>
            </v-row>

            <h3 class="pt-2">Actividades Turísticas</h3>
            <v-row class="pa-0 ma-0" v-if="item.actividad.length > 0">
              <v-col
                v-for="(column, index) in item.actividad"
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
              v-for="(ITEM, index) in item.diagnostico"
              :key="index + 'ProductosTuristicos'"
            >
              <div v-if="ITEM.formulario.mostrarEnInforme != null">
                <v-divider></v-divider>
                <v-row class="ma-0 pa-0">
                  <v-col
                    v-for="(header, idHeader) in ITEM.formulario.pregunta[
                      ITEM.formulario.mostrarEnInforme
                    ].encabezado"
                    :key="idHeader + 'H'"
                    align="center"
                  >
                    <span class="font-weight-medium">{{ header }}</span>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row
                  v-for="(res, idRes) in ITEM.respuesta[ITEM.formulario.mostrarEnInforme]
                    .valor"
                  :key="idRes + 'R'"
                  class="ma-0 pa-0"
                  align="center"
                >
                  <v-col
                    v-for="(format, idFormat) in ITEM.formulario.pregunta[
                      ITEM.formulario.mostrarEnInforme
                    ].formato"
                    :key="idFormat + 'F'"
                    class="d-flex child-flex pa-1"
                    align="center"
                  >
                    <div v-if="format.tipo === 'SN'">
                      {{
                        getRespuesta(
                          'SN',
                          ITEM.respuesta[ITEM.formulario.mostrarEnInforme].valor[idRes][
                            idFormat
                          ]
                        )
                      }}
                    </div>

                    <div v-else-if="format.tipo === 'ABIERTA'">
                      {{
                        getRespuesta(
                          'ABIERTA',
                          ITEM.respuesta[ITEM.formulario.mostrarEnInforme].valor[idRes][
                            idFormat
                          ]
                        )
                      }}
                    </div>

                    <div v-else-if="format.tipo === 'SELECCION'">
                      <v-radio-group
                        v-model="
                          ITEM.respuesta[ITEM.formulario.mostrarEnInforme].valor[idRes][
                            idFormat
                          ]
                        "
                        style="margin-bottom: -10px; margin-top: -2px"
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
                            ITEM.respuesta[ITEM.formulario.mostrarEnInforme].valor[idRes][
                              idFormat
                            ][checkIndex]
                          "
                          disabled
                          class="pa-0"
                          style="margin-bottom: -35px"
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

            <h3 class="pt-2">Conclusiones</h3>
            <v-textarea
              readonly
              v-for="(ITEM, indice) in item.conclusion"
              :key="'C' + indice"
              v-model="item.conclusion[indice]"
              auto-grow
              filled
              rounded
              dense
              rows="1"
              style="margin-bottom: -10px"
            >
            </v-textarea>

            <h3 class="pt-2">Recomendaciones</h3>
            <v-textarea
              readonly
              v-for="(ITEM, indice) in item.recomendacion"
              :key="'A' + indice"
              v-model="item.recomendacion[indice]"
              auto-grow
              filled
              rounded
              dense
              rows="1"
              style="margin-bottom: -10px"
            >
            </v-textarea>

            <h3 class="pt-2">Observaciones</h3>
            <v-textarea
              readonly
              v-for="(ITEM, indice) in item.observacion"
              :key="'B' + indice"
              v-model="item.observacion[indice]"
              auto-grow
              filled
              rounded
              dense
              rows="1"
              style="margin-bottom: -10px"
            ></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-row>
              <v-col
                cols="6"
                class="d-flex justify-space-around pa-0"
                @click="rejectInform(item)"
                ><v-btn> Rechazar</v-btn></v-col
              >
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn class="success" @click="approve(item)"> Aprobar</v-btn></v-col
              >
            </v-row>
          </v-card-actions>
        </td>
      </template>

      <template v-slot:item.estado="">
        <v-chip color="edit" dark> Pendiente </v-chip>
      </template>

      <template v-slot:item.fechaCreacion="{ item }">
        {{ formatFecha(item.fechaCreacion) }}
      </template>
    </v-data-table>

    <v-dialog v-model="dialogReject" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-container>
            <div class="text-center pb-2">
              <span class="headline"> Escriba el motivo del Rechazo</span>
            </div>
            <v-textarea
              v-model="editedInform.retroalimentacion"
              auto-grow
              filled
              rounded
              dense
              rows="1"
            ></v-textarea>
            <v-row>
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="closeDialog">Cancelar</v-btn></v-col
              >
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="rejectConfirm">Continuar</v-btn>
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
import { getFecha } from '@/utils/moment'

export default {
  props: ['activator'],

  data() {
    return {
      loading: false,
      problem: false,
      dialogReject: false,
      dialogDiagnostic: false,
      search: '',
      editedIndex: -1,
      editedInform: {},
      editedDefault: {},
      diagnostic: {
        formulario: {
          nombre: ''
        }
      },
      informs: [],
      headers: [
        {
          text: 'Realizado Por',
          value: 'realizadoPor.nombre'
        },
        {
          text: 'Establecimiento',
          value: 'diagnostico[0].establecimiento.nombre',
          align: 'center'
        },
        {
          text: 'Fecha Creación',
          value: 'fechaCreacion'
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'center',
          sortable: false
        },
        { text: '', value: 'data-table-expand' }
      ]
    }
  },
  methods: {
    async getInforms() {
      this.loading = true
      this.informs = []
      await this.$http
        .get('api/informes')
        .then(res => {
          this.loading = false
          this.informs = res.data.data
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

    rejectInform(item) {
      this.editedIndex = this.informs.indexOf(item)
      this.editedInform = item
      this.dialogReject = true
    },

    async rejectConfirm() {
      await this.changeEstado(false)
      if (!this.problem) {
        this.informs.splice(this.editedIndex, 1)
      }
      this.closeDialog()
      this.problem = false
    },

    async approve(item) {
      this.editedIndex = this.informs.indexOf(item)
      this.editedInform = item
      await this.changeEstado(true)
      if (!this.problem) {
        this.informs.splice(this.editedIndex, 1)
      }
      this.problem = false
    },

    closeDialog() {
      this.dialogReject = false
      this.$nextTick(() => {
        this.editedInform = Object.assign({}, this.editedDefault)
        this.editedIndex = -1
      })
    },

    async changeEstado(estado) {
      this.loading = true
      if (estado) {
        swalLoading('Aprobando Informe')
      } else {
        swalLoading('Rechazando Informe')
      }
      try {
        await this.$http
          .put(
            `api/informe/cambiarEstado/${this.editedInform._id}/${estado}`,
            this.editedInform
          )
          .then(() => {
            this.loading = false
            if (estado) {
              swalConfirm('Informe Aprobado')
            } else {
              swalConfirm('Informe Rechazado')
            }
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
    },

    formatFecha(item) {
      return getFecha(item)
    }
  },

  async created() {
    await this.getInforms()
  },

  watch: {
    dialogReject(val) {
      val || this.closeDialog()
    },

    dialogDiagnostic(val) {
      val || this.closeDiagnostic()
    },

    async activator(val) {
      if (val === 0) {
        await this.getInforms()
      }
    }
  }
}
</script>
