<template>
  <div>
    <v-container>
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
              <div v-if="diagnostics.length > 0 && !loading">
                <div
                  v-for="(fecha, i) in dateNotRepeted"
                  :key="i"
                  style="margin-bottom: -15px"
                >
                  <v-card-title class="secondary lighten-1">
                    <span class="headline">{{ fecha }}</span>
                  </v-card-title>
                  <v-card-text>
                    <div v-for="(item, index) in diagnostics" :key="item._id">
                      <div v-if="item.fecha.includes(fecha)">
                        <v-checkbox
                          v-model="editedInform.diagnostico[index]"
                          :value="item._id"
                          :label="
                            `${item.formulario.nombre} -- ${item.fecha} -- ${item.total}`
                          "
                        ></v-checkbox>
                      </div>
                    </div>
                  </v-card-text>
                </div>
              </div>
              <div v-else>
                <v-card-title class="secondary lighten-1">
                  <span class="headline"
                    >No se han realizado Diagnósticos para este Establecimiento</span
                  >
                </v-card-title>
              </div>
            </v-card-text>
          </v-card>
          <v-card class="pt-1 pb-1" flat>
            <v-progress-linear
              indeterminate
              color="primary"
              v-show="loading"
            ></v-progress-linear>
          </v-card>
        </v-col>

        <v-col cols="12" :sm="sm">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">Informe</span>
            </v-card-title>

            <v-card-text class="pl-5 pr-5 pt-2">
              <h3 class="pt-2 pb-1">Diagnosticos</h3>
              <div v-if="thereIsDiagnostics">
                <div v-for="item in editedInform.diagnostico" :key="item">
                  <h3 class="pl-4 pb-3" v-if="getItem(item)">
                    {{ getItem(item) }}
                    <span :class="getColor(item) + '--text'"> {{ getTotal(item) }} </span>
                  </h3>
                </div>
              </div>
              <div v-else>No tiene Diagnosticos agregados</div>
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
            </v-card-text>

            <v-card-actions>
              <v-btn class="success" @click="save" block :disabled="!thereIsDiagnostics">
                Enviar Informe
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { swalConfirm, swalLoading, swalError } from '@/utils/notify'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      seeDiagnostics: true,
      problem: false,
      diagnostics: [],
      fechas: [],
      dateNotRepeted: [],
      sm: '',
      editedInform: {
        diagnostico: [],
        conclusion: [''],
        recomendacion: [''],
        observacion: ['']
      },
      defaultInform: {
        diagnostico: [],
        conclusion: [''],
        recomendacion: [''],
        observacion: ['']
      }
    }
  },

  methods: {
    async getDiagnostics() {
      this.loading = true
      this.diagnostics = []
      this.dateNotRepeted = []
      await this.$http
        .get(`/api/diagnosticos/${this.user._id}/${this.establishment._id}`)
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

    getDate() {
      var dates = this.diagnostics.map(item => {
        return item.fecha.split('/')[1] + '/' + item.fecha.split('/')[2]
      })
      this.dateNotRepeted.push(dates[0])
      for (let i = 0; i < dates.length; i++) {
        if (dates[i + 1]) {
          if (dates[i] != dates[i + 1]) {
            this.dateNotRepeted.push(dates[i + 1])
          }
        }
      }
    },

    getItem(item) {
      var itemInforme = this.diagnostics.filter(v => {
        return v._id === item
      })
      if (itemInforme[0]) {
        return `${itemInforme[0].formulario.nombre} - ${itemInforme[0].fecha} - `
      } else {
        return ''
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

    getColor(item) {
      var itemInforme = this.diagnostics.filter(v => {
        return v._id === item
      })
      if (itemInforme[0]) {
        var total = parseInt(itemInforme[0].total.split('%')[0])
        if (total < 50) {
          return 'error'
        } else {
          if (total >= 50 && total < 90) {
            return 'edit'
          } else {
            return 'success'
          }
        }
      }
    },

    async save() {
      await this.middlewareDiagnostics()
      await this.addInform()
      if (!this.problem) {
        this.editedInform = this.defaultInform
      }
    },

    async middlewareDiagnostics() {
      var diagnosticosNotNull = []
      diagnosticosNotNull = this.editedInform.diagnostico.filter(v => {
        return v != null
      })
      this.editedInform.diagnostico = diagnosticosNotNull
    },

    async addInform() {
      this.loading = true
      swalLoading('Enviando Informe')
      try {
        await this.$http.post('/api/informe', this.editedInform).then(async () => {
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

    removeOption(critery, index) {
      console.log('entra')
      if (critery === 'conclusion') {
        this.editedInform.conclusion.splice(index, 1)
      } else {
        if (critery === 'recomendacion') {
          this.editedInform.recomendacion.splice(index, 1)
        } else {
          this.editedInform.observacion.splice(index, 1)
        }
      }
    }
  },

  computed: {
    ...mapState(['user', 'establishment']),

    thereIsDiagnostics() {
      var thereIs = false
      this.editedInform.diagnostico.forEach(v => {
        if (v != null) {
          thereIs = true
        }
      })
      return thereIs
    }
  },

  async created() {
    this.getDiagnostics()
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
    }
  }
}
</script>
