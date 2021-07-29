<template>
  <div>
    <v-card>
      <v-card-title>
        <v-col class="d-flex child-flex">
          <v-img contain src="/img/gobierno-diagnostico.png" aspect-ratio="4">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>

        <v-col class="d-flex child-flex">
          <v-img contain src="/img/unach-diagnostico.jpeg" aspect-ratio="4">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>

        <v-col class="d-flex child-flex">
          <v-img contain src="/img/municipio-diagnostico.jpeg" aspect-ratio="4">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-card-title>
      <v-container>
        <v-row>
          <v-col align="center" justify="center" class="primary white--text">
            <h2>{{ editedForm.nombre }}</h2>
          </v-col>
        </v-row>
      </v-container>

      <v-form ref="testForm">
        <v-card-text>
          <v-card
            v-for="(item, index) in editedForm.pregunta"
            :key="index"
            :color="isValid(item, index)"
            class="mb-3"
          >
            <v-system-bar height="30" color="primary">
              <span class="ml-4 subtitle-1 white--text">Pregunta {{ index + 1 }}</span>
            </v-system-bar>

            <v-container style="margin-bottom: -20px; margin-top: -5px">
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="8"
                    md="10"
                    style="margin-bottom: -25px; margin-top: -10px"
                  >
                    <h3 class="pt-2 pb-1">Pregunta</h3>
                    <v-text-field
                      v-model="item.enunciado"
                      autocomplete="off"
                      filled
                      rounded
                      dense
                      readonly
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    xs="12"
                    v-if="item.tipo === 'ABIERTA'"
                    style="margin-bottom: -25px"
                  >
                    <h3 class="pt-2 pb-1">Respuesta</h3>
                    <v-text-field
                      autocomplete="off"
                      filled
                      rounded
                      dense
                      @change="getPoint(item, index)"
                      v-model="editedItem.respuesta[index].valor"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    xs="12"
                    v-else-if="item.tipo === 'SN'"
                    style="margin-bottom: -25px"
                  >
                    <h3 class="pt-2 pb-1">Respuesta</h3>
                    <v-switch
                      class="pa-1"
                      :label="yesNoLabel(editedItem.respuesta[index].valor)"
                      filled
                      rounded
                      dense
                      @change="getPoint(item, index)"
                      v-model="editedItem.respuesta[index].valor"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    xs="12"
                    v-else-if="item.tipo === 'SELECCION'"
                    style="margin-bottom: -40px"
                  >
                    <h3 class="pt-2 pb-1">Respuesta</h3>
                    <v-radio-group v-model="editedItem.respuesta[index].valor">
                      <v-radio
                        v-for="(option, number) in item.opciones"
                        :key="number"
                        :label="option"
                        :value="number"
                        class="mb-4"
                        @change="getPoint(item, index)"
                      >
                      </v-radio>
                    </v-radio-group>
                  </v-col>

                  <v-col
                    cols="12"
                    xs="12"
                    v-else-if="item.tipo === 'MULTIPLE'"
                    style="margin-bottom: -10px"
                  >
                    <h3 class="pt-2 pb-1">Respuesta</h3>
                    <div v-for="(check, checkIndex) in item.opciones" :key="checkIndex">
                      <v-checkbox
                        v-model="editedItem.respuesta[index].valor[checkIndex]"
                        :label="check"
                        style="margin-bottom: -25px"
                        :value="item.peso / editedItem.respuesta[index].valor.length"
                        @change="getPoint(item, index)"
                      ></v-checkbox>
                    </div>
                  </v-col>

                  <v-col
                    cols="12"
                    xs="12"
                    v-else-if="item.tipo === 'COMPLEX'"
                    style="margin-bottom: -10px"
                  >
                    <h3 class="pt-2 pb-1">
                      Respuesta
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            @click="editedItem.respuesta[index].valor.push(addSlot(item))"
                            small
                            v-on="on"
                            v-bind="attrs"
                          >
                            <v-icon class="info--text" small> fa-plus </v-icon>
                          </v-btn>
                        </template>
                        <span> Agregar una respuesta </span>
                      </v-tooltip>
                    </h3>
                    <v-row class="pa-0 ma-0">
                      <v-col
                        v-for="(header, idHeader) in item.encabezado"
                        :key="idHeader + 'H'"
                        class="d-flex child-flex pa-1"
                        align="center"
                      >
                        <span class="font-weight-bold">{{ header }}</span>
                      </v-col>
                    </v-row>

                    <v-row
                      v-for="(res, idRes) in editedItem.respuesta[index].valor"
                      :key="idRes + 'R'"
                      class="pa-0 ma-0"
                    >
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            @click="editedItem.respuesta[index].valor.splice(idRes, 1)"
                            small
                            v-on="on"
                            v-bind="attrs"
                            class="pa-0 ma-0 error--text"
                            v-show="editedItem.respuesta[index].valor.length > 1"
                          >
                            <v-icon> fa-times</v-icon>
                          </v-btn>
                        </template>
                        <span> Eliminar esta respuesta </span>
                      </v-tooltip>

                      <v-col
                        v-for="(format, idFormat) in item.formato"
                        :key="idFormat + 'F'"
                        class="d-flex child-flex pa-1 pb-0 mb-0 pt-0 mt-0"
                      >
                        <div v-if="format.tipo === 'SN'">
                          <v-switch
                            class="pa-1"
                            :label="
                              yesNoLabel(
                                editedItem.respuesta[index].valor[idRes][idFormat]
                              )
                            "
                            filled
                            rounded
                            dense
                            v-model="editedItem.respuesta[index].valor[idRes][idFormat]"
                          />
                        </div>
                        <div v-else-if="format.tipo === 'ABIERTA'">
                          <v-text-field
                            class="pt-4"
                            autocomplete="off"
                            filled
                            rounded
                            dense
                            v-model="editedItem.respuesta[index].valor[idRes][idFormat]"
                          />
                        </div>
                        <div v-else-if="format.tipo === 'SELECCION'">
                          <v-radio-group
                            v-model="editedItem.respuesta[index].valor[idRes][idFormat]"
                          >
                            <v-radio
                              v-for="(option, number) in format.opciones"
                              :key="number"
                              :label="option"
                              :value="number"
                              class="mb-4"
                            >
                            </v-radio>
                          </v-radio-group>
                        </div>
                        <div v-else-if="format.tipo === 'MULTIPLE'" class="pb-4">
                          <div
                            v-for="(check, checkIndex) in format.opciones"
                            :key="checkIndex"
                          >
                            <v-checkbox
                              v-model="
                                editedItem.respuesta[index].valor[idRes][idFormat][
                                  checkIndex
                                ]
                              "
                              :label="check"
                              style="margin-bottom: -25px"
                              :value="
                                item.peso / editedItem.respuesta[index].valor.length
                              "
                            ></v-checkbox>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-container>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-divider vertical class="mx-2" />
              <v-btn
                plain
                icon
                class="info"
                v-if="editedItem.respuesta[index].puntaje === 0"
                @click="changePoint(index, item.peso)"
              >
                {{ item.peso }}
              </v-btn>
              <v-btn icon class="edit" plain v-else @click="changePoint(index, 0)"
                >0</v-btn
              >
              <h3 class="pl-2">Puntaje</h3>
              <v-col cols="4" sm="2" md="2">
                <v-text-field
                  style="margin-bottom: -30px"
                  filled
                  rounded
                  dense
                  :rules="numberRules"
                  v-model="editedItem.respuesta[index].puntaje"
                />
              </v-col>
            </v-card-actions>
          </v-card>
        </v-card-text>
      </v-form>
      <v-footer padless>
        <v-col class="text-center" cols="8" sm="10" md="10">
          <h3>Total:</h3>
          {{ getTotal }}
        </v-col>
        <v-col cols="1">
          <v-btn class="success" @click="save" :disabled="disableSave()"> Guardar </v-btn>
        </v-col>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
import { swalError, swalLoading, swalConfirm } from '@/utils/notify'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      problem: false,
      questionItems: [
        { tipo: 'ABIERTA', title: 'Abierta', icon: 'fa-spell-check' },
        { tipo: 'SN', title: 'Si/No', icon: 'fa-check' },
        { tipo: 'SELECCION', title: 'Selección', icon: 'fa-chevron-circle-down' },
        { tipo: 'MULTIPLE', title: 'Opción multiple', icon: 'fa-check-square' }
      ],
      numberRules: [v => Number.isInteger(parseInt(v)) || 'Solo se permiten números'],
      codes: {
        form: this.$route.params.form,
        establishment: this.$route.params.establishment
      },
      editedItem: {
        respuesta: [{}],
        total: 0
      },
      editedForm: { pregunta: [] },
      editedEstablishment: {}
    }
  },
  methods: {
    async save() {
      this.editedItem.total = this.getTotal
      await this.addDiagnostic()
      if (!this.problem) {
        this.$router.replace('/selectForm')
      }
    },

    async addDiagnostic() {
      this.loading = true
      swalLoading('Ingresando Diagnóstico')
      try {
        await this.$http.post('api/diagnostico', this.editedItem).then(async () => {
          this.loading = false
          swalConfirm('Diagnostico nuevo ingresado')
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

    getPoint(item, index) {
      if (item.tipo === 'MULTIPLE') {
        var number = 0
        for (let i = 0; i < this.editedItem.respuesta[index].valor.length; i++) {
          number = number + this.editedItem.respuesta[index].valor[i]
        }
        this.editedItem.respuesta[index].puntaje = number
      } else {
        if (item.tipo === 'SN') {
          if (this.editedItem.respuesta[index].valor) {
            this.editedItem.respuesta[index].puntaje = item.peso
          } else {
            this.editedItem.respuesta[index].puntaje = 0
          }
        } else {
          if (item.tipo === 'ABIERTA') {
            if (this.editedItem.respuesta[index].valor.trim() != '') {
              this.editedItem.respuesta[index].puntaje = item.peso
            } else {
              this.editedItem.respuesta[index].puntaje = 0
            }
          } else {
            this.editedItem.respuesta[index].puntaje = item.peso
          }
        }
      }
    },

    changePoint(index, valor) {
      this.editedItem.respuesta[index].puntaje = valor
    },

    yesNoLabel(item) {
      return item ? 'Si' : 'No'
    },

    async getForm() {
      this.loading = true
      await this.$http
        .get(`api/formulario/${this.codes.form}`)
        .then(res => {
          this.loading = false
          this.editedForm = res.data.data
          this.getDiagnostic()
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

    async getEstablishment() {
      this.loading = true
      await this.$http
        .get(`api/establecimiento/${this.codes.establishment}`)
        .then(res => {
          this.loading = false
          this.editedEstablishment = res.data.data
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

    isValid(item, index) {
      if (item.tipo === 'MULTIPLE') {
        if (this.editedItem.respuesta[index].valor.length === 0) {
          return 'secondary lighten-4'
        } else {
          return ''
        }
      } else {
        if (this.editedItem.respuesta[index].valor != null) {
          return ''
        } else {
          return 'secondary lighten-4'
        }
      }
    },

    async getDiagnostic() {
      this.editedItem.establecimiento = this.codes.establishment
      this.editedItem.formulario = this.codes.form
      this.editedItem.respuesta = this.editedForm.pregunta.map(v => {
        var object = {
          pregunta: v._id,
          puntaje: 0
        }

        if (v.tipo === 'MULTIPLE') {
          object.valor = v.opciones.map(() => {
            return null
          })
        } else {
          if (v.tipo === 'COMPLEX') {
            object.valor = [this.addSlot(v)]
          } else {
            object.valor = null
          }
        }
        return object
      })
      this.editedItem.total = 0
    },

    addSlot(question) {
      return question.formato.map(v => {
        if (v.tipo === 'MULTIPLE') {
          return v.opciones.map(() => {
            return null
          })
        } else {
          return null
        }
      })
    },

    getIcon(item) {
      return this.questionItems.find(v => v.tipo === item).icon
    },

    getTitle(item) {
      return this.questionItems.find(v => v.tipo === item).title
    },

    disableSave() {
      if (this.$refs.testForm) {
        return this.$refs.testForm.validate() ? false : true
      } else {
        return true
      }
    }
  },

  async created() {
    if (this.user.rol != '') {
      if (this.user.rol === 'TECHNICAL_ROLE') {
        await this.getForm()
        await this.getEstablishment()
      } else {
        this.$router.replace('/')
      }
    } else {
      this.$router.replace('/login')
    }
  },

  computed: {
    getTotal() {
      var valorActual = 0
      var totalEsperado = 0
      this.editedItem.respuesta.forEach(v => {
        if (v.puntaje) {
          valorActual = parseFloat(valorActual) + parseFloat(v.puntaje.toString().replace(/,/g, '.'))
        }
      })
      this.editedForm.pregunta.forEach(v => {
        totalEsperado = parseInt(totalEsperado) + parseInt(v.peso)
      })
      return ((parseFloat(valorActual) / parseInt(totalEsperado)) * 100).toFixed(2) + '%'
    },

    ...mapState(['user'])
  }
}
</script>
