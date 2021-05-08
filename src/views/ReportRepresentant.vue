<template>
  <div>
    <v-row>
      <v-col cols="12" :sm="sm">
        <v-card>
          <v-card-title class="primary white--text">
            <span class="headline">Informes </span>
            <v-spacer></v-spacer>
            <v-btn icon @click="seeInforms = !seeInforms">
              <v-icon v-if="seeInforms"> fa-angle-up </v-icon>
              <v-icon v-else> fa-angle-down</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text v-if="seeInforms" class="pa-0">
            <div v-if="informs.length > 0 && !loading">
              <div
                v-for="(fecha, i) in dateNotRepeted"
                :key="i"
                style="margin-bottom: -15px"
              >
                <v-card-title class="secondary lighten-1">
                  <span class="headline">{{ fecha }}</span>
                </v-card-title>

                <v-card-text>
                  <div v-for="(item, index) in informs" :key="item._id">
                    <div v-if="item.fechaCreacion.includes(fecha)">
                      <v-row>
                        <v-col>
                          <h4 class="pt-2">
                            Informe del
                            <span class="font-weight-black">
                              {{ informs[index].fechaCreacion }}
                            </span>
                            --
                            <span class="font-weight-black">
                              {{ informs[index].diagnostico.length }}
                            </span>
                            Diagnosticos,
                            <span class="font-weight-black">
                              {{ informs[index].conclusion.length }}
                            </span>
                            Conclusiones,
                            <span class="font-weight-black">
                              {{ informs[index].recomendacion.length }}
                            </span>
                            Recomendaciones y
                            <span class="font-weight-black">
                              {{ informs[index].observacion.length }}</span
                            >
                            Observaciones
                          </h4>
                        </v-col>

                        <v-col
                          cols="5"
                          sm="3"
                          class="d-flex align-content-center flex-wrap"
                        >
                          <v-chip class="success white--text"> Aprobado </v-chip>
                          <v-btn @click="prepareWorkStation(item, 'see')" icon>
                            <v-icon class="info--text">fa-eye </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-card-text>
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

        <v-card class="pt-1 pb-1" flat>
          <v-progress-linear
            indeterminate
            color="primary"
            v-show="loading"
          ></v-progress-linear>
        </v-card>
      </v-col>

      <v-col cols="12" :sm="sm">
        <div v-if="action != ''">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">Informe {{ editedInform.fechaCreacion }} </span>
              <v-spacer></v-spacer>
              <v-chip class="success white--text"> Aprobado </v-chip>
              <v-btn icon @click="restoreDefault"> <v-icon> fa-times</v-icon></v-btn>
            </v-card-title>

            <v-card-text class="pl-5 pr-5 pt-2">
              <h3 class="pt-2 pb-1">Diagnosticos</h3>
              <div v-for="(item, index) in editedInform.diagnostico" :key="index">
                <h3 class="pl-4 pb-3">
                  {{ item.formulario.nombre }} - {{ item.fecha }} --
                  <span :class="getColorTotal(item) + '--text'">
                    {{ item.total }}
                  </span>
                </h3>
              </div>

              <h3 class="pt-2">Conclusiones</h3>

              <v-textarea
                disabled
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
              </v-textarea>

              <h3 class="pt-2">Recomendaciones</h3>

              <v-textarea
                disabled
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
              </v-textarea>

              <h3 class="pt-2">Observaciones</h3>
              <v-textarea
                disabled
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
              </v-textarea>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'
export default {
  data() {
    return {
      loading: false,
      seeInforms: true,
      action: '',
      sm: '',
      informs: [],
      dateNotRepeted: [],
      editedInform: {}
    }
  },

  methods: {
    async getInforms() {
      this.loading = true
      this.informs = []
      this.dateNotRepeted = []
      await this.$http
        .get(`/api/informes/representante`)
        .then(res => {
          console.log('todo bien')
          this.loading = false
          this.informs = res.data.data
          this.getDate()
          this.editedInform = this.defaultItem
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
      var dates = this.informs.map(item => {
        return item.fechaCreacion.split('/')[1] + '/' + item.fechaCreacion.split('/')[2]
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

    prepareWorkStation(item, critery) {
      this.action = critery
      this.editedInform = item
    },

    restoreDefault() {
      this.action = ''
      this.editedInform = {}
    }
  },

  async created() {
    await this.getInforms()
  },

  watch: {
    seeInforms(v) {
      if (v) {
        this.sm = '6'
      } else {
        this.sm = '12'
      }
    }
  }
}
</script>
