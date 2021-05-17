<template>
  <div style="margin: -10px; margin-top: 3px; margin-bottom: 20px" id="create">
    <v-toolbar flat>
      <v-toolbar-title>
        <h4 class="pb-1 pr-5">Nombre:</h4>
      </v-toolbar-title>

      <v-text-field
        autocomplete="off"
        v-model.trim="form.nombre"
        filled
        rounded
        dense
        class="font-weight-bold pl-2 pt-6"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="save" v-on="on" v-bind="attrs" icon :disabled="disabledSave">
            <v-icon class="success--text"> fa-save </v-icon>
          </v-btn>
        </template>
        <span> Guardar Formulario</span>
      </v-tooltip>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="searchDialog = true" v-on="on" v-bind="attrs" icon>
            <v-icon> fa-search </v-icon>
          </v-btn>
        </template>
        <span> Buscar una pregunta para agregar</span>
      </v-tooltip>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="
              form.pregunta.push({ tipo: 'SELECCION', enunciado: '', opciones: [''] })
            "
            v-on="on"
            v-bind="attrs"
            icon
          >
            <v-icon class="info--text"> fa-plus </v-icon>
          </v-btn>
        </template>
        <span> Agregar una pregunta </span>
      </v-tooltip>
    </v-toolbar>

    <v-progress-linear indeterminate v-show="loading" color="primary" />

    <v-card v-if="!(form.pregunta.length > 0) && loading === false">
      <p class="text-center pa-4 headline">No se han encontrado preguntas, agrega una.</p>
    </v-card>

    <v-card v-else flat>
      <v-card-text>
        <v-card
          v-for="(item, index) in form.pregunta"
          :key="index"
          :color="isValid(item)"
          class="mb-10"
        >
          <v-system-bar height="30" color="primary">
            <span class="ml-4 subtitle-1 white--text">Pregunta {{ index + 1 }}</span>
          </v-system-bar>

          <v-container style="margin-bottom: -20px">
            <v-row>
              <v-col cols="12" sm="3" md="2" class="pa-4 mt-3">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" color="accent" block x-large>
                      <v-icon left>{{ getIcon(item.tipo) }} </v-icon>
                      {{ getTitle(item.tipo) }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(question, key) in questionItems"
                      @click="changeQuestionType(index, question)"
                      :key="key"
                    >
                      <v-list-item-icon>
                        <v-icon v-text="question.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ question.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="7" md="6" style="margin-bottom: -20px">
                <h3 class="pt-2 pb-1">Pregunta</h3>
                <v-text-field
                  v-model="item.enunciado"
                  autocomplete="off"
                  filled
                  rounded
                  dense
                  @input="newQuest(index)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" md="4" style="margin-bottom: -20px">
                <h3 class="pt-2 pb-1">Categoría</h3>
                <v-text-field
                  v-model="item.categoria"
                  autocomplete="off"
                  filled
                  rounded
                  dense
                  @input="newQuest(index)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" xs="12" v-if="item.tipo === 'ABIERTA'">
                <h3 class="pt-2 pb-1 text--disabled">Respuesta</h3>
                <v-text-field autocomplete="off" disabled filled rounded dense />
              </v-col>

              <v-col cols="12" xs="12" v-else-if="item.tipo === 'SN'">
                <h3 class="pt-2 pb-1 text--disabled">Respuesta</h3>
                <v-switch class="pa-1" label="Si/no" disabled filled rounded dense />
              </v-col>

              <v-col
                cols="12"
                xs="12"
                v-else-if="item.tipo === 'SELECCION' || item.tipo === 'MULTIPLE'"
              >
                <div v-for="(option, number) in item.opciones" :key="number">
                  <h3 class="pt-2 pb-1">
                    Opción {{ number + 1 }}
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-if="number === 0"
                          @click="addOption(index)"
                          small
                          v-on="on"
                          v-bind="attrs"
                        >
                          <v-icon class="info--text" small> fa-plus </v-icon>
                        </v-btn>
                      </template>
                      <span> Agregar una opción </span>
                    </v-tooltip>
                  </h3>
                  <v-text-field
                    @keyup.enter="addOption(index)"
                    autocomplete="off"
                    v-model.trim="item.opciones[number]"
                    filled
                    rounded
                    dense
                    style="margin-bottom: -15px"
                  >
                    <template v-if="item.opciones.length > 1" v-slot:append>
                      <v-icon @click="removeOption(index, number)"
                        >far fa-times-circle</v-icon
                      >
                    </template>
                  </v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-container>

          <v-card-actions>
            <h3 class="pl-2">Peso de la pregunta</h3>
            <v-col cols="4" sm="2" md="2">
              <v-text-field
                style="margin-bottom: -30px"
                filled
                rounded
                dense
                @input="newQuest(index)"
                v-model="item.peso"
              />
            </v-col>
            <v-spacer></v-spacer>
            <v-divider vertical class="mx-2" />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="deleteQuestion(item)" v-on="on" v-bind="attrs" icon>
                  <v-icon class="delete--text"> fa-trash </v-icon>
                </v-btn>
              </template>
              <span> Eliminar un Lugar </span>
            </v-tooltip>
          </v-card-actions>

          {{ item }}
        </v-card>
      </v-card-text>
    </v-card>

    <v-speed-dial
      v-model="fab"
      bottom
      right
      direction="left"
      transition="scale-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" fab class="edit white--text">
          <v-icon v-if="fab"> fa-times </v-icon>
          <v-icon v-else> fa-ellipsis-v </v-icon>
        </v-btn>
      </template>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="
              form.pregunta.push({ tipo: 'SELECCION', enunciado: '', opciones: [''] })
            "
            v-on="on"
            v-bind="attrs"
            fab
            small
            icon
          >
            <v-icon class="info--text"> fa-plus </v-icon>
          </v-btn>
        </template>
        <span> Agregar una pregunta </span>
      </v-tooltip>

      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="searchDialog = true" v-on="on" v-bind="attrs" fab small icon>
            <v-icon> fa-search </v-icon>
          </v-btn>
        </template>
        <span> Buscar una pregunta para agregar</span>
      </v-tooltip>
    </v-speed-dial>

    <v-dialog v-model="searchDialog" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Busque una pregunta</span>
        </v-card-title>
        <v-card-text>
          <h4 class="pb-1 pt-2">Preguntas:</h4>
          <v-autocomplete
            v-model="editedQuest"
            :items="questions"
            item-text="enunciado"
            persistent-hint
            return-object
            single-line
            filled
            rounded
            dense
          >
            <template slot="item" slot-scope="data">
              <p class="body-2">{{ data.item.enunciado }}</p>
              <v-spacer></v-spacer>
              <p class="body-2 ml-2">{{ type(data.item.tipo) }}</p>
            </template>
          </v-autocomplete>
          <div v-if="editedQuest.tipo">
            <h4 class="pb-1">Enunciado</h4>
            <span>{{ editedQuest.enunciado }}</span>
            <h4 class="pb-1">Categoría</h4>
            <span>{{ editedQuest.categoria.nombre }}</span>
            <h4 class="pb-1 pt-2">Tipo</h4>
            <span>{{ type(editedQuest.tipo) }} </span>
            <div v-if="editedQuest.tipo === 'SN'">
              <v-switch class="pa-1" label="Si/no" disabled filled rounded dense />
            </div>
            <div v-if="editedQuest.tipo === 'ABIERTA'">
              <h4 class="pb-1">Respuesta</h4>
              <v-text-field autocomplete="off" disabled filled rounded dense />
            </div>
            <div
              v-if="editedQuest.tipo === 'SELECCION' || editedQuest.tipo === 'MULTIPLE'"
            >
              <div v-for="(item, index) in editedQuest.opciones" :key="index">
                <h4 class="pt-2 pb-1 pl-4">Opción {{ index + 1 }}</h4>
                <v-text-field
                  v-model.trim="editedQuest.opciones[index]"
                  filled
                  rounded
                  dense
                  disabled
                >
                </v-text-field>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="6" class="d-flex justify-space-around pa-0">
                <v-btn text @click="close">Cerrar</v-btn>
              </v-col>
              <v-col cols="6" class="d-flex justify-space-around pa-0">
                <v-btn text @click="addQuestForm" :disabled="disabled">Asignar</v-btn>
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
  data() {
    return {
      form: {
        pregunta: []
      },
      questionItems: [
        { tipo: 'ABIERTA', title: 'Abierta', icon: 'fa-spell-check' },
        { tipo: 'SN', title: 'Si/No', icon: 'fa-check' },
        { tipo: 'SELECCION', title: 'Selección', icon: 'fa-chevron-circle-down' },
        { tipo: 'MULTIPLE', title: 'Opción multiple', icon: 'fa-check-square' }
      ],
      questions: [],
      categories: [],
      editedQuest: {},
      fab: false,
      searchDialog: false,
      loading: false,
      problem: false,
      editedIndex: this.$route.params.form
    }
  },

  methods: {
    newQuest(index) {
      delete this.form.pregunta[index]._id
    },

    isValid(item) {
      if (item.tipo === 'SELECCION' || item.tipo === 'MULTIPLE') {
        return !item.enunciado || item.opciones[0] === '' ? 'secondary lighten-3' : ''
      } else {
        return !item.enunciado ? 'secondary lighten-3' : ''
      }
    },

    getIcon(item) {
      return this.questionItems.find(v => v.tipo === item).icon
    },

    getTitle(item) {
      return this.questionItems.find(v => v.tipo === item).title
    },

    changeQuestionType(index, item) {
      this.form.pregunta[index].tipo = item.tipo
      if (item.tipo === 'SELECCION' || item.tipo === 'MULTIPLE') {
        if (
          !this.form.pregunta[index].opciones ||
          !this.form.pregunta[index].opciones[0]
        ) {
          this.form.pregunta[index].opciones = ['']
        }
      }
      this.form.pregunta[index]._id = ''
    },

    mostrar() {
      this.form.pregunta.forEach(v => {
        console.log(v.enunciado)
      })
    },

    addOption(index) {
      this.form.pregunta[index].opciones.push('')
      this.newQuest(index)
    },

    removeOption(index, number) {
      this.form.pregunta[index].opciones.splice(number, 1)
      this.newQuest(index)
    },

    async getForm() {
      this.loading = true
      this.form = {
        pregunta: []
      }
      await this.$http
        .get(`/api/formulario/${this.editedIndex}`)
        .then(res => {
          this.loading = false
          this.form = res.data.data
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

    close() {
      this.searchDialog = false
      this.editedQuest = {}
    },

    addQuestForm() {
      this.form.pregunta.push(this.editedQuest)
      this.close()
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

    async save() {
      await this.middlewareQuestForm()
      if (this.editedIndex === '-1') {
        await this.addForm()
      } else {
        await this.changeForm()
      }
      if (!this.problem) {
        this.$router.replace('/form')
      }
      this.problem = false
    },

    async middlewareQuestForm() {
      var codeQuest = this.form.pregunta.map(v => {
        return v._id ? null : v
      })
      codeQuest = codeQuest.filter(v => v != null)
      codeQuest = codeQuest.filter(v => v.tipo)
      if (codeQuest.length > 0) {
        swalLoading('Ingresando Preguntas')
      }
      for (let i = 0; i < codeQuest.length; i++) {
        if (!this.problem) {
          await this.addQuest(codeQuest[i])
        } else {
          i = codeQuest.length
        }
      }
      if (!this.problem) {
        swalConfirm('Todas las preguntas han sido ingresadas')
      }
    },

    middlewareForm() {
      var formObject = {
        _id: this.form._id,
        nombre: this.form.nombre,
        pregunta: [],
        realizadoPor: ''
      }

      formObject.pregunta = this.form.pregunta.map(v => {
        return v._id
      })
      formObject.pregunta = formObject.pregunta.filter(v => v != undefined)

      if (!formObject.pregunta.length > 0) {
        delete formObject.pregunta
      }

      return formObject
    },

    async addForm() {
      var item = this.middlewareForm()
      delete item._id
      this.loading = true
      swalLoading('Ingresando Formulario')
      try {
        await this.$http.post('/api/formulario', item).then(async () => {
          this.loading = false
          swalConfirm('Formulario nuevo ingresado')
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

    async addQuest(item) {
      this.loading = true
      try {
        await this.$http.post('/api/pregunta', item).then(async res => {
          this.loading = false
          this.form.pregunta[this.form.pregunta.indexOf(item)] = res.data.data
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

    async changeForm() {
      var item = this.middlewareForm()
      this.loading = true
      swalLoading('Editando Formulario')
      try {
        await this.$http.put(`/api/formulario/${item._id}`, item).then(async () => {
          this.loading = false
          swalConfirm('Formulario editado')
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
    },

    deleteQuestion(item) {
      this.form.pregunta.splice(this.form.pregunta.indexOf(item), 1)
    }
  },

  async created() {
    if (this.editedIndex != -1) {
      await this.getForm()
    }
    await this.getQuestions()
    await this.getCategories()
  },

  computed: {
    disabled() {
      return this.editedQuest.tipo ? false : true
    },
    disabledSave() {
      return this.form.nombre && this.form.pregunta.length > 0 ? false : true
    }
  },

  watch: {
    searchDialog(val) {
      val || this.close()
    }
  }
}
</script>

<style>
#create .v-speed-dial {
  position: absolute;
}
</style>
