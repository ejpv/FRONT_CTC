<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="areas"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todos los Áreas..."
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col align="start" cols="3" sm="2"> </v-col>
              <v-col align="end" cols="0" sm="10">
                <v-btn color="new" class="mb-2" medium disabled>
                  Nueva Área
                  <v-icon right>fa-map-marked-alt</v-icon>
                </v-btn>
                <v-btn color="info" class="mb-2 ml-4" medium icon>
                  <v-icon medium @click="getAreas()">fa-sync-alt</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="ma-2 success--text"
              @click="restoreItem(item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-trash-restore
            </v-icon>
          </template>
          <span> Restaurar un Área Protegida </span>
        </v-tooltip>
      </template>

      <template v-slot:item.estado>
        <v-chip color="error" dark> Borrado </v-chip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogRestore" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline">
                  ¿Está seguro de restaurar esta Área Protegida?</span
                >
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="closeRestore">Cancelar</v-btn></v-col
              >
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="restoreItemConfirm">Continuar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
export default {
  props: ['texto', 'activator'],
  data() {
    return {
      loading: true,
      areas: [],
      headers: [
        {
          text: 'Nombre',
          value: 'nombre',
          align: 'start'
        },
        {
          text: 'Tipo',
          value: 'tipo'
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'center',
          sortable: false
        },
        {
          text: 'Acciones',
          value: 'actions',
          align: 'center',
          sortable: false
        }
      ],
      dialogRestore: false,
      problem: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {}
    }
  },
  methods: {
    async getAreas() {
      this.loading = true
      this.areas = []
      await this.$http
        .get('/api/areasProtegidas?estado=false')
        .then(res => {
          this.loading = false
          this.areas = res.data.data
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

    restoreItem(item) {
      this.editedIndex = this.areas.indexOf(item)
      this.editedItem = item
      this.dialogRestore = true
    },

    async restoreItemConfirm() {
      await this.restorePlace()
      if (!this.problem) {
        this.areas.splice(this.editedIndex, 1)
      }
      this.closeRestore()
      this.problem = false
    },

    closeRestore() {
      this.dialogRestore = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async restorePlace() {
      this.loading = true
      swalLoading('Restaurando área')
      try {
        await this.$http
          .put(`/api/areaProtegida/${this.editedItem._id}/restaurar`)
          .then(() => {
            this.loading = false
            swalConfirm('Área restaurada')
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
    }
  },
  watch: {
    dialogRestore(val) {
      val || this.closeRestore()
    },
    activator(val) {
      if (val) {
        this.getAreas()
      }
    }
  }
}
</script>
