<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="areas"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todas las Areas..."
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col align="start" cols="3" sm="2"> </v-col>
              <v-col align="end" cols="0" sm="10">
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="new" dark class="mb-2" v-bind="attrs" v-on="on" medium>
                      Nueva Área
                      <v-icon right>fa-map-marked-alt</v-icon>
                    </v-btn>
                    <v-btn color="info" class="mb-2 ml-4" medium icon>
                      <v-icon medium @click="getAreas()">fa-sync-alt</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="primary white--text">
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-form ref="form">
                          <h3 class="pt-2 pb-1">
                            <strong class="error--text">*</strong> Nombre
                          </h3>
                          <v-text-field
                            v-model="editedItem.nombre"
                            filled
                            rounded
                            dense
                            :rules="fieldRules"
                          ></v-text-field>

                          <h3><strong class="error--text">*</strong> Tipo</h3>
                          <v-row>
                            <v-col align="end" cols="10">
                              <v-text-field
                                v-model="editedItem.tipo"
                                filled
                                rounded
                                dense
                                :rules="fieldRules"
                              ></v-text-field>
                            </v-col>
                            <v-col align="start" cols="2">
                              <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    text
                                    rounded
                                    dense
                                    style="margin-left: -15px"
                                    :disabled="type.length === 0"
                                  >
                                    <v-icon>fa-caret-down</v-icon>
                                  </v-btn>
                                </template>
                                <v-list>
                                  <v-list-item v-for="(item, index) in type" :key="index">
                                    <v-list-item-title @click="selectType(item)">{{
                                      item
                                    }}</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-form>
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
          <span> Editar un Área </span>
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
          <span> Eliminar un Área </span>
        </v-tooltip>
      </template>

      <template v-slot:item.estado="{}">
        <v-chip color="success" dark> Activado </v-chip>
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
                <span class="headline"> ¿Está seguro de borrar esta Área Protegida?</span>
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
  </div>
</template>

<script>
import { swalError, swalLoading, swalConfirm } from '@/utils/notify'
export default {
  props: ['texto', 'activator'],
  data() {
    return {
      areas: [],
      loading: false,
      dialogDelete: false,
      dialog: false,
      editedIndex: -1,
      pastType: '',
      problem: false,
      type: [],
      fieldRules: [
        v => !!v || 'Campo necesario',
        v => (v && v.length >= 3) || 'Debe tener mas de 3 letras'
      ],
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
      editedItem: {
        _id: '',
        nombre: '',
        tipo: ''
      },
      defaultItem: {
        _id: '',
        nombre: '',
        tipo: ''
      }
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear un Área' : 'Editar un Área'
    }
  },
  methods: {
    async getAreas() {
      this.loading = true
      this.areas = []
      await this.$http
        .get('/api/areasProtegidas')
        .then(res => {
          this.loading = false
          this.areas = res.data.data
          this.areas.map(v => {
            this.updateType(v.tipo, true)
          })
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

    close() {
      this.dialog = false
      this.pastType = ''
      this.$refs.form.resetValidation()
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

    selectType(item) {
      this.editedItem.tipo = item
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.changeArea()
        if (!this.problem) {
          Object.assign(this.areas[this.editedIndex], this.editedItem)
          if (!(this.pastType === this.editedItem.tipo)) {
            this.updateType(this.editedItem.tipo, true)
            this.updateType(this.pastType, false)
          }
        }
      } else {
        await this.addArea()
        if (!this.problem) {
          this.areas.push(this.editedItem)
          this.updateType(this.editedItem.tipo, true)
        }
      }
      this.problem = false
      this.pastType = ''
      this.$refs.form.resetValidation()
      this.close()
    },

    deleteItem(item) {
      this.editedIndex = this.areas.indexOf(item)
      this.editedItem = item
      this.pastType = this.editedItem.tipo
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      await this.removeArea()
      if (!this.problem) {
        this.areas.splice(this.editedIndex, 1)
        this.updateType(this.pastType, false)
      }
      this.closeDelete()
      this.problem = false
      this.pastType = ''
      try {
        this.$refs.form.resetValidation()
      } catch {
        console.log('error')
      }
    },

    editItem(item) {
      this.editedIndex = this.areas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.pastType = this.editedItem.tipo
      this.dialog = true
    },

    updateType(item, critery) {
      let count = 0
      if (critery) {
        for (let i = 0; i < this.type.length; i++) {
          if (this.type[i] != item) {
            count = count + 1
          }
        }
        if (count == this.type.length && item != '') {
          this.type.push(item)
        }
      } else {
        for (let i = 0; i < this.areas.length; i++) {
          if (this.areas[i].tipo === item) {
            count = count + 1
          }
        }
        if (count === 0) {
          this.type.splice(this.type.indexOf(item), 1)
        }
      }
    },

    async addArea() {
      this.loading = true
      swalLoading('Ingresando área')
      try {
        await this.$http.post('/api/areaProtegida', this.editedItem).then(async res => {
          this.loading = false
          swalConfirm('Área nueva ingresada')
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

    async removeArea() {
      this.loading = true
      swalLoading('Eliminando área')
      try {
        await this.$http.delete(`/api/areaProtegida/${this.editedItem._id}`).then(() => {
          this.loading = false
          swalConfirm('Área Eliminada')
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

    async changeArea() {
      this.loading = true
      swalLoading('Editando área')
      try {
        await this.$http
          .put(`/api/areaProtegida/${this.editedItem._id}`, this.editedItem)
          .then(async () => {
            this.loading = false
            swalConfirm('Área editada')
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
    await this.getAreas()
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    activator(val) {
      if (!val) {
        this.getAreas()
      }
    }
  }
}
</script>
