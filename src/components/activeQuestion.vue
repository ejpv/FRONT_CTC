<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="questions"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todas las Preguntas..."
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
                      Nueva Pregunta
                      <v-icon right>fa-list-ol</v-icon>
                    </v-btn>
                    <v-btn color="info" class="mb-2 ml-4" medium icon>
                      <v-icon medium @click="getQuestions()">fa-sync-alt</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="primary white--text">
                      <div v-if="!see">
                        <span class="headline">{{ formTitle }}</span>
                      </div>
                      <div v-else>
                        <span class="headline">Ver una Pregunta </span>
                      </div>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-form ref="form">
                          <h3 class="pt-2 pb-1">
                            <strong class="error--text">*</strong> Enunciado
                          </h3>
                          <v-text-field
                            v-model="editedItem.enunciado"
                            filled
                            rounded
                            dense
                            :rules="fieldRules"
                            :disabled="see"
                          ></v-text-field>

                          <h3 class="pt-2 pb-1">
                            <strong class="error--text">*</strong> Categoría
                          </h3>
                          <v-autocomplete
                            v-model="editedItem.categoria"
                            :items="categories"
                            item-text="nombre"
                            persistent-hint
                            return-object
                            single-line
                            filled
                            rounded
                            dense
                            :disabled="see"
                            :rules="objectRules"
                            :loading="loading"
                          ></v-autocomplete>

                          <h3 class="pb-1">
                            <strong class="error--text">*</strong> Tipo
                          </h3>
                          <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                v-bind="attrs"
                                v-on="on"
                                color="accent"
                                class="mb-5"
                                :disabled="see"
                              >
                                <v-icon left>{{ getIcon(editedItem.tipo) }} </v-icon>
                                {{ getTitle(editedItem.tipo) }}
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-item
                                v-for="(item, key) in questionItems"
                                @click="changeQuestionType(item)"
                                :key="key"
                              >
                                <v-list-item-icon>
                                  <v-icon v-text="item.icon"></v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                          <div v-if="editedItem.tipo === 'SN'">
                            <h3 class="pb-3">Vista Previa</h3>
                            <h4 class="pb-1">Respuesta</h4>
                            <v-switch
                              class="pa-1"
                              label="Si/no"
                              disabled
                              filled
                              rounded
                              dense
                            />
                          </div>
                          <div v-if="editedItem.tipo === 'ABIERTA'">
                            <h3 class="pb-3">Vista Previa</h3>
                            <h4 class="pb-1">Respuesta</h4>
                            <v-text-field
                              autocomplete="off"
                              disabled
                              filled
                              rounded
                              dense
                            />
                          </div>
                          <div
                            v-if="
                              editedItem.tipo === 'SELECCION' ||
                              editedItem.tipo === 'MULTIPLE'
                            "
                          >
                            <h3 class="pb-3">Opciones de Respuesta</h3>
                            <div
                              v-for="(option, number) in editedItem.opciones"
                              :key="number"
                            >
                              <h3 class="pt-2 pb-1">
                                <strong class="error--text">*</strong>
                                Opción {{ number + 1 }}
                                <v-tooltip right>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      icon
                                      v-if="number === 0"
                                      @click="editedItem.opciones.push('')"
                                      small
                                      v-on="on"
                                      v-bind="attrs"
                                      :disabled="see"
                                    >
                                      <v-icon class="info--text" small> fa-plus </v-icon>
                                    </v-btn>
                                  </template>
                                  <span> Agregar una opción </span>
                                </v-tooltip>
                              </h3>
                              <v-text-field
                                :disabled="see"
                                @keyup.enter="editedItem.opciones.push('')"
                                autocomplete="off"
                                v-model.trim="editedItem.opciones[number]"
                                filled
                                rounded
                                dense
                                style="margin-bottom: -15px"
                              >
                                <template
                                  v-if="editedItem.opciones.length > 1"
                                  v-slot:append
                                >
                                  <v-icon @click="editedItem.opciones.splice(number, 1)"
                                    >far fa-times-circle</v-icon
                                  >
                                </template>
                              </v-text-field>
                            </div>
                          </div>
                        </v-form>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-container v-if="!see">
                        <v-row>
                          <v-col cols="6" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="close">Cancelar</v-btn>
                          </v-col>
                          <v-col cols="6" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="save">Guardar</v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-container v-else>
                        <v-row>
                          <v-col cols="12" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="close">Cerrar</v-btn>
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

      <template v-slot:item.opciones="{ item }">
        <div v-if="item.tipo === 'SELECCION' || item.tipo === 'MULTIPLE'">
          <v-chip color="info" dark> {{ item.opciones.length }} Opciones</v-chip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="info--text mr-2 ml-2"
                v-on="on"
                v-bind="attrs"
                @click="editItem(item, true)"
              >
                fa-eye
              </v-icon>
            </template>
            <span> Ver Pregunta</span>
          </v-tooltip>
        </div>
        <div v-else>
          <v-chip color="secondary" dark> No requiere opciones</v-chip>
        </div>
      </template>

      <template v-slot:item.tipo="{ item }">
        {{ type(item.tipo) }}
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
          <span> Editar una Pregunta </span>
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
          <span> Eliminar una Pregunta </span>
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
                <span class="headline"> ¿Está seguro de borrar esta Pregunta?</span>
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
      loading: false,
      dialog: false,
      problem: false,
      dialogDelete: false,
      see: false,
      editedIndex: -1,
      questions: [],
      categories: [],
      headers: [
        {
          text: 'Enunciado',
          value: 'enunciado',
          align: 'start'
        },
        {
          text: 'Tipo de Pregunta',
          value: 'tipo',
          align: 'center'
        },
        {
          text: 'Opciones de Respuesta',
          value: 'opciones',
          sortable: false
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
      fieldRules: [
        v => !!v || 'Campo necesario',
        v => (v && v.length >= 3) || 'Debe tener mas de 3 letras'
      ],
      objectRules: [v => !!v || 'Campo necesario'],
      questionItems: [
        { tipo: 'ABIERTA', title: 'Abierta', icon: 'fa-spell-check' },
        { tipo: 'SN', title: 'Si/No', icon: 'fa-check' },
        { tipo: 'SELECCION', title: 'Selección', icon: 'fa-chevron-circle-down' },
        { tipo: 'MULTIPLE', title: 'Opción multiple', icon: 'fa-check-square' }
      ],
      editedItem: {
        enunciado: '',
        tipo: 'ABIERTA',
        opciones: [''],
        categoria: {
          nombre: ''
        }
      },
      defaultItem: {
        enunciado: '',
        tipo: 'ABIERTA',
        opciones: [''],
        categoria: {
          nombre: ''
        }
      }
    }
  },
  methods: {
    async getQuestions() {
      this.loading = true
      this.questions = []
      await this.$http
        .get('/api/preguntas')
        .then(res => {
          this.loading = false
          this.questions = res.data.data
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

    async getCategories() {
      this.loading = true
      this.categories = []
      await this.$http
        .get('/api/categorias')
        .then(res => {
          this.loading = false
          this.categories = res.data.data
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

    getIcon(item) {
      return this.questionItems.find(v => v.tipo === item).icon
    },

    getTitle(item) {
      return this.questionItems.find(v => v.tipo === item).title
    },

    changeQuestionType(item) {
      this.editedItem.tipo = item.tipo
      if (item.tipo === 'SELECCION' || item.tipo === 'MULTIPLE') {
        if (!this.editedItem.opciones || !this.editedItem.opciones[0]) {
          this.editedItem.opciones = ['']
        }
      }
    },

    close() {
      this.dialog = false
      this.$refs.form.resetValidation()
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.see = false
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    deleteItem(item) {
      this.editedIndex = this.questions.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },

    type(critery) {
      if (critery === 'SN') {
        return 'Si/No'
      } else {
        if (critery === 'MULTIPLE') {
          return 'Múltiple'
        } else {
          if (critery === 'ABIERTA') {
            return 'Abierta'
          } else {
            return 'Selección'
          }
        }
      }
    },

    async deleteItemConfirm() {
      await this.removeQuestion()
      if (!this.problem) {
        this.questions.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    editItem(item, critery) {
      this.editedIndex = this.questions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      if (critery) {
        this.see = critery
      }
      this.dialog = true
    },

    async save() {
      if (this.editedItem.tipo === 'ABIERTA' || this.editedItem.tipo === 'SN') {
        this.editedItem.opciones = ['']
      }
      if (this.editedIndex > -1) {
        await this.changeQuestion()
        if (!this.problem) {
          Object.assign(this.questions[this.editedIndex], this.editedItem)
        }
      } else {
        await this.addQuestion()
        if (!this.problem) {
          this.questions.push(this.editedItem)
        }
      }
      this.problem = false
      this.close()
    },

    async addQuestion() {
      this.loading = true
      swalLoading('Ingresando pregunta')
      try {
        await this.$http.post('/api/pregunta', this.editedItem).then(async res => {
          this.loading = false
          swalConfirm('Pregunta nueva ingresada')
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

    async removeQuestion() {
      this.loading = true
      swalLoading('Eliminando pregunta')
      try {
        await this.$http.delete(`/api/pregunta/${this.editedItem._id}`).then(() => {
          this.loading = false
          swalConfirm('Pregunta Eliminada')
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

    async changeQuestion() {
      this.loading = true
      swalLoading('Editando pregunta')
      try {
        await this.$http
          .put(`/api/pregunta/${this.editedItem._id}`, this.editedItem)
          .then(async () => {
            this.loading = false
            swalConfirm('Pregunta editada')
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

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Crear una Pregunta' : 'Editar una Pregunta'
    }
  },

  async created() {
    await this.getQuestions()
    await this.getCategories()
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
        this.getQuestions()
      }
    }
  }
}
</script>
