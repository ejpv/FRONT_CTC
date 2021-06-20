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
                  <div v-if="formatFecha(item.fecha).includes(fecha.toLowerCase())">
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
                          {{ item.formulario.nombre }} - {{ formatFecha(item.fecha) }} -
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
import { getFecha } from '@/utils/moment'

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
    },

    formatFecha(item) {
      return getFecha(item)
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
