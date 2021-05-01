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
              <span class="headline">Informe {{ item.fechaCreacion }} </span>
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

                {{ ITEM.formulario.nombre }} - {{ ITEM.fecha }} --
                <span :class="getColorTotal(ITEM) + '--text'">
                  {{ ITEM.total }}
                </span>
              </h3>
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
                disabled
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

      <template v-slot:item.conclusion.length="{ item }">
        {{ item.conclusion.length }} Conclusiones
      </template>

      <template v-slot:item.recomendacion.length="{ item }">
        {{ item.recomendacion.length }} Recomendaciones
      </template>

      <template v-slot:item.observacion.length="{ item }">
        {{ item.observacion.length }} Observaciones
      </template>

      <template v-slot:item.diagnostico.length="{ item }">
        {{ item.diagnostico.length }} Diagnosticos
      </template>
    </v-data-table>

    <v-dialog v-model="dialogDiagnostic" max-width="700px">
      <seeDiagnostic :diagnostic="diagnostic" @accion="closeDiagnostic" />
    </v-dialog>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'

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
          text: '# de Diagnósticos',
          value: 'diagnostico.length'
        },
        {
          text: '# de Conclusiones',
          value: 'conclusion.length'
        },
        {
          text: '# de Recomendaciones',
          value: 'recomendacion.length'
        },
        {
          text: '# de Observaciones',
          value: 'observacion.length'
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
        .get('/api/informes?estado=false')
        .then(res => {
          this.loading = false
          this.informs = res.data.data
          console.log(this.informs[0])
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