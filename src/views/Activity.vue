<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de Actividades
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque una Actividad"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="activities"
        class="elevation-1"
        :loading="loading"
        :search="search"
        loading-text="Obteniendo todas las Actividades..."
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-container>
              <v-row>
                <v-col align="start" cols="3" sm="2"> </v-col>
                <v-col align="end" cols="0" sm="10">
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="new"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        medium
                      >
                        Nueva Actividad
                        <v-icon right>fa-hiking</v-icon>
                      </v-btn>
                      <v-btn color="info" class="mb-2 ml-4" medium icon>
                        <v-icon medium @click="getActivities()">fa-sync-alt</v-icon>
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title class="primary white--text">
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <h3 class="pt-2 pb-1">
                            <strong class="error--text">*</strong> Nombre
                          </h3>
                          <v-text-field
                            v-model="editedItem.nombre"
                            filled
                            rounded
                            dense
                          ></v-text-field>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-container>
                          <v-row>
                            <v-col cols="6" class="d-flex justify-space-around pa-0">
                              <v-btn text @click="close">Cancelar</v-btn>
                            </v-col>
                            <v-col cols="6" class="d-flex justify-space-around pa-0">
                              <v-btn text @click="save">Guardar</v-btn>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-container>
          </v-toolbar>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="mr-2 edit--text"
                @click="editItem(item)"
                v-on="on"
                v-bind="attrs"
              >
                fa-pen
              </v-icon>
            </template>
            <span> Editar una Actividad </span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="ma-2 delete--text"
                @click="deleteItem(item)"
                v-on="on"
                v-bind="attrs"
              >
                fa-trash
              </v-icon>
            </template>
            <span> Eliminar una Actividad </span>
          </v-tooltip>
        </template>
      </v-data-table>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-container class="primary">
            <v-row text-centerd>
              <v-col cols="12" class="text-center">
                <v-icon dark large> fa-exclamation-triangle </v-icon>
              </v-col>
              <v-col cols="12" class="white--text justify-center">
                <div class="text-center primary">
                  <span class="headline"> ¿Está seguro de borrar esta Actividad?</span>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-container>
              <v-row>
                <v-col cols="6" class="d-flex justify-space-around pa-0"
                  ><v-btn text @click="closeDelete">Cancelar</v-btn></v-col
                >
                <v-col cols="6" class="d-flex justify-space-around pa-0"
                  ><v-btn text @click="deleteItemConfirm">Continuar</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script>
import { swalError, swalLoading, swalConfirm } from '@/utils/notify'

export default {
  data() {
    return {
      search: '',
      editedIndex: -1,
      loading: false,
      problem: false,
      dialog: false,
      dialogDelete: false,
      editedItem: { _id: '', nombre: '' },
      defaultItem: { _id: '', nombre: '' },
      activities: [],
      headers: [
        {
          text: 'Nombre',
          value: 'nombre',
          align: 'center'
        },
        {
          text: 'Acciones',
          value: 'actions',
          align: 'center',
          sortable: false
        }
      ]
    }
  },

  methods: {
    async getActivities() {
      this.loading = true
      this.activities = []
      await this.$http
        .get('/api/actividades')
        .then(res => {
          this.loading = false
          this.activities = res.data.data
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

    deleteItem(item) {
      this.editedIndex = this.activities.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      await this.removeActivity()
      if (!this.problem) {
        this.activities.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    editItem(item) {
      this.editedIndex = this.activities.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.changeActivity()
        if (!this.problem) {
          Object.assign(this.activities[this.editedIndex], this.editedItem)
        }
      } else {
        await this.addActivity()
        if (!this.problem) {
          this.activities.push(this.editedItem)
        }
      }
      this.problem = false
      this.close()
    },

    async addActivity() {
      this.loading = true
      swalLoading('Ingresando Actividad')
      try {
        await this.$http.post('/api/actividad', this.editedItem).then(async res => {
          this.loading = false
          swalConfirm('Actividad nueva ingresada')
          this.problem = false
          this.editedItem = res.data.data
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

    async removeActivity() {
      this.loading = true
      swalLoading('Eliminando Actividad')
      try {
        await this.$http.delete(`/api/actividad/${this.editedItem._id}`).then(() => {
          this.loading = false
          swalConfirm('Actividad Eliminada')
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

    async changeActivity() {
      this.loading = true
      swalLoading('Editando Actividad')
      try {
        await this.$http
          .put(`/api/actividad/${this.editedItem._id}`, this.editedItem)
          .then(async () => {
            this.loading = false
            swalConfirm('Actividad editada')
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
    }
  },

  async created() {
    await this.getActivities()
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    dialogDelete(val) {
      val || this.closeDelete()
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear una Actividad' : 'Editar una Actividad'
    }
  }
}
</script>
