<template>
  <div>
    <v-card>
      <v-card-title>
        <v-col class="d-flex child-flex">
          <v-img contain src="..\assets\unach.png" aspect-ratio="2">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col cols="8" align="center" justify="center" class="primary white--text">
          <span class="headline">{{ editedForm.nombre }}</span>
        </v-col>
        <v-col class="d-flex child-flex">
          <v-img contain src="..\assets\turismo.png" aspect-ratio="2">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-card-title>
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

          <v-container style="margin-bottom: -20px">
            <v-container>
              <v-row>
                <v-col cols="12" sm="8" md="10" style="margin-bottom: -20px">
                  <h3 class="pt-2 pb-1">Pregunta</h3>
                  <v-text-field
                    v-model="item.enunciado"
                    autocomplete="off"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>
                </v-col>

                <v-col cols="12" xs="12" v-if="item.tipo === 'ABIERTA'">
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

                <v-col cols="12" xs="12" v-else-if="item.tipo === 'SN'">
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

                <v-col cols="12" xs="12" v-else-if="item.tipo === 'SELECCION'">
                  <h3 class="pt-2 pb-1">Respuesta</h3>
                  <v-radio-group v-model="editedItem.respuesta[index].valor">
                    <div v-for="(option, number) in item.opciones" :key="number">
                      <v-radio
                        :label="option"
                        :value="number"
                        class="mb-4"
                        @change="getPoint(item, index)"
                      >
                      </v-radio>
                    </div>
                  </v-radio-group>
                </v-col>

                <v-col cols="12" xs="12" v-else-if="item.tipo === 'MULTIPLE'">
                  <h3 class="pt-2 pb-1">Respuesta</h3>
                  <div v-for="(check, checkIndex) in item.opciones" :key="checkIndex">
                    <v-checkbox
                      v-model="editedItem.respuesta[index].valor[checkIndex]"
                      :label="check"
                      style="margin-bottom: -15px"
                      :value="1 / editedItem.respuesta[index].valor.length"
                      @change="getPoint(item, index)"
                    ></v-checkbox>
                  </div>
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
              @click="changePoint(index, 1)"
              >1</v-btn
            >
            <v-btn icon class="edit" plain v-else @click="changePoint(index, 0)">0</v-btn>
            <h3 class="pl-2">Puntaje</h3>
            <v-col cols="4" sm="2" md="2">
              <v-text-field
                style="margin-bottom: -30px"
                filled
                rounded
                dense
                v-model="editedItem.respuesta[index].puntaje"
              />
            </v-col>
          </v-card-actions>
        </v-card>
      </v-card-text>
      <v-footer padless>
        <v-col class="text-center" cols="8" sm="10" md="10">
          <h3>Total:</h3>
          {{ getTotal }}
        </v-col>
        <v-col cols="1" >
          <v-btn class="success"> Guardar </v-btn>
        </v-col>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'

export default {
  data() {
    return {
      loading: false,
      problem: false,
      codes: {
        form: this.$route.params.form,
        establishment: this.$route.params.establishment
      },
      questionItems: [
        { tipo: 'ABIERTA', title: 'Abierta', icon: 'fa-spell-check' },
        { tipo: 'SN', title: 'Si/No', icon: 'fa-check' },
        { tipo: 'SELECCION', title: 'Selección', icon: 'fa-chevron-circle-down' },
        { tipo: 'MULTIPLE', title: 'Opción multiple', icon: 'fa-check-square' }
      ],
      editedItem: {
        respuesta: [{}]
      },
      editedForm: {},
      editedEstablishment: {}
    }
  },
  methods: {
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
            this.editedItem.respuesta[index].puntaje = 1
          } else {
            this.editedItem.respuesta[index].puntaje = 0
          }
        } else {
          if (item.tipo === 'ABIERTA') {
            if (this.editedItem.respuesta[index].valor.trim() != '') {
              this.editedItem.respuesta[index].puntaje = 1
            } else {
              this.editedItem.respuesta[index].puntaje = 0
            }
          } else {
            this.editedItem.respuesta[index].puntaje = 1
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
        .get(`/api/formulario/${this.codes.form}`)
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
        .get(`/api/establecimiento/${this.codes.establishment}`)
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
        if (this.editedItem.respuesta[index].puntaje === 0) {
          return 'secondary lighten-3'
        } else {
          return ''
        }
      } else {
        if (this.editedItem.respuesta[index].valor != null) {
          return ''
        } else {
          return 'secondary lighten-3'
        }
      }
    },

    getDiagnostic() {
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
          object.valor = null
        }
        return object
      })
      this.editedItem.total = 0
    },

    getIcon(item) {
      return this.questionItems.find(v => v.tipo === item).icon
    },

    getTitle(item) {
      return this.questionItems.find(v => v.tipo === item).title
    }
  },
  async created() {
    await this.getForm()
    await this.getEstablishment()
  },
  computed: {
    getTotal() {
      var valor = 0
      this.editedItem.respuesta.forEach(v => {
        valor = valor + v.puntaje
      })
      return ((valor / this.editedItem.respuesta.length) * 100).toFixed(2) + '%'
    }
  }
}
</script>