<template>
  <div>
    <v-card-title class="d-block text-center">
      <span class="headline">Informes rechazados</span>
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
              <v-chip class="error white--text" style="margin-left: -5px">
                Rechazado
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
                <v-row>
                  <v-col
                    v-for="(header, idHeader) in ITEM.formulario.pregunta[
                      ITEM.formulario.mostrarEnInforme
                    ].encabezado"
                    :key="idHeader + 'H'"
                    class="d-flex child-flex pt-2"
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

            <v-container>
              <h3 class="pt-2">Retroalimentación:</h3>
              <v-textarea
                readonly
                v-model="item.retroalimentacion"
                :label="item.retroalimentacion ? '' : 'No existe retroalimentación'"
                auto-grow
                filled
                rounded
                dense
                rows="1"
                style="margin-bottom: -10px"
              >
              </v-textarea>
            </v-container>
          </v-card-text>
        </td>
      </template>

      <template v-slot:item.estado="">
        <v-chip color="error" dark> Rechazado </v-chip>
      </template>

      <template v-slot:item.fechaCreacion="{ item }">
        {{ formatFecha(item.fechaCreacion) }}
      </template>

      <template v-slot:item.fechaFinal="{ item }">
        {{ formatFecha(item.fechaFinal) }}
      </template>
    </v-data-table>

    <v-dialog v-model="dialogDiagnostic" max-width="700px">
      <seeDiagnostic :diagnostic="diagnostic" @accion="closeDiagnostic" />
    </v-dialog>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'
import { getFecha } from '@/utils/moment'

export default {
  props: ['activator'],

  data() {
    return {
      search: '',
      dialogDiagnostic: false,
      loading: false,
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
          text: 'Rechazado Por',
          value: 'responsable.nombre'
        },
        {
          text: 'Retroalimentación',
          value: 'retroalimentacion'
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
          text: 'Fecha Final',
          value: 'fechaFinal'
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
        .get('api/informes?estado=false')
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

    formatFecha(item) {
      return getFecha(item)
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

  async created() {
    await this.getInforms()
  },

  watch: {
    dialogDiagnostic(val) {
      val || this.closeDiagnostic()
    },

    async activator(val) {
      if (val === 2) {
        await this.getInforms()
      }
    }
  }
}
</script>
