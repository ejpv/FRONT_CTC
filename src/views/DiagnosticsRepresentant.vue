<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Diagnosticos </span>
        </v-card-title>

        <v-card-text class="pa-0">
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
                <div v-for="(item, index) in diagnostics" :key="'A' + index">
                  <div v-if="item.fecha.includes(fecha)">
                    <v-row>
                      <v-col
                        ><h3 class="pt-2">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                class="mr-2 info--text"
                                v-on="on"
                                v-bind="attrs"
                                @click="seeDiagnostic(item)"
                              >
                                fa-eye
                              </v-icon>
                            </template>
                            <span> Ver diagnóstico </span>
                          </v-tooltip>
                          {{ item.formulario.nombre }} - {{ item.fecha }} -
                          <span :class="getColor(item.total) + '--text'">{{
                            item.total
                          }}</span>
                        </h3></v-col
                      >
                      <v-col cols="4">
                        <h4>Realizado Por:</h4>
                        {{ item.ejecutadoPor.nombre }}</v-col
                      >
                    </v-row>
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
    </v-container>

    <v-dialog v-model="dialogDiagnostic" max-width="700px">
      <seeDiagnostic :diagnostic="diagnostic" @accion="closeDiagnostic" />
    </v-dialog>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      dialogDiagnostic: false,
      diagnostic: {
        formulario: {
          nombre: ''
        }
      },
      diagnostics: [],
      dateNotRepeted: []
    }
  },
  methods: {
    async getDiagnostics() {
      this.loading = true
      this.diagnostics = []
      this.dateNotRepeted = []
      await this.$http
        .get(`/api/diagnosticos/${this.user._id}`)
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

    getColor(item) {
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
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async created() {
    await this.getDiagnostics()
  }
}
</script>

<style>
</style>