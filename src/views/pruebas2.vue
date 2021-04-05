<template>
  <div>
    <v-toolbar>
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
          <v-btn @click="searchDialog = true" v-on="on" v-bind="attrs" icon>
            <v-icon> fa-search </v-icon>
          </v-btn>
        </template>
        <span> Buscar una pregunta para agregar</span>
      </v-tooltip>

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
          <v-btn @click="form.pregunta.push({})" v-on="on" v-bind="attrs" icon>
            <v-icon class="info--text"> fa-plus </v-icon>
          </v-btn>
        </template>
        <span> Agregar una pregunta </span>
      </v-tooltip>
    </v-toolbar>

    <v-progress-linear indeterminate v-show="loading" color="primary"></v-progress-linear>

    <v-card v-if="!(form.pregunta.length > 0) && loading === false">
      <p class="text-center pa-4 headline">No se han encontrado preguntas, agrega una.</p>
    </v-card>

    <v-card height="100%" v-else>
      <v-btn @click="mostrar()" class="warning"></v-btn>
      <v-card-text>
        <!-- <ctc-question
          class="mb-5"
          v-for="(item, index) in form.pregunta"
          :key="index"
          v-model.trim="form.pregunta[index]"
          @click:delete="v => deleteQuestion(v)"
        > -->
        <!-- <template slot="header">
            <span class="ml-4 subtitle-1 white--text">Pregunta {{ index + 1 }}</span>
          </template>

          <template slot="actions"> </template>
        </ctc-question> -->
        <tmpQuestions v-model="form.pregunta"/>
      </v-card-text>
    </v-card>

    <v-dialog v-model="searchDialog" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Busque una pregunta</span>
        </v-card-title>
        <v-card-text>
          <h4 class="pb-1 pt-2">Preguntas:</h4>
          <v-select
            v-model="editedQuest"
            :items="questions"
            item-text="enunciado"
            persistent-hint
            return-object
            single-line
            filled
            rounded
            dense
          ></v-select>
          <div v-if="editedQuest.tipo">
            <h4 class="pb-1">Enunciado</h4>
            <span>{{ editedQuest.enunciado }}</span>
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
import { mapState } from 'vuex'
export default {
  data() {
    return {
      tmp: 'holanda',
      form: {
        pregunta: []
      },
      errors: {
        err: 0,
        idErr: [],
        notOptions: 0,
        idNotOptions: [],
        dbError: 0,
        idDbError: []
      },
      editedItem: {},
      questions: [],
      editedQuest: {},
      seatch: {},
      searchDialog: false,
      loading: false,
      problem: false,
      editedIndex: this.$route.params.form
    }
  },
  methods: {
    mostrar() {
      this.form.pregunta.forEach(v => {
        console.log(v.enunciado)
      })
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
        return 'Pregunta de Si y No'
      } else {
        if (critery === 'MULTIPLE') {
          return 'Pregunta de Opción Múltiple'
        } else {
          if (critery === 'ABIERTA') {
            return 'Pregunta Abierta'
          } else {
            return 'Pregunta de Selección Múltiple'
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

      formObject.realizadoPor = this.user._id

      return formObject
    },

    async addForm() {
      var item = this.middlewareForm()
      delete item._id
      this.loading = true
      swalLoading('Ingresando Formulario')
      try {
        await this.$http.post('/api/formulario', item).then(async res => {
          this.loading = false
          swalConfirm('Formulario nuevo ingresado')
          this.problem = false
          this.form = res.data.data
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
      console.log('Borrar aún en desarrollo')
      console.log('item')
      console.log(item)
      console.log('buscandolo en el formulario')
      console.log(this.form.pregunta.indexOf(item))
      console.log('objeto en esa posicion')
      console.log(this.form.pregunta[this.form.pregunta.indexOf(item)])

      const { pregunta } = this.form
      const index = pregunta.indexOf(item)
      pregunta.splice(index, 1)
      Object.assign(this.form, { pregunta })

      // if (this.form.pregunta[this.form.pregunta.indexOf(item)] === item) {
      //   console.log('es el mismo objeto')
      // }
      // // this.form.pregunta.splice(this.form.pregunta.indexOf(item), 1)
      // console.log("**********************borrado************************");
      // console.log("Formulario despues de haber sido borrado");
      // console.log(this.form.pregunta)
    }
  },

  async created() {
    if (this.editedIndex != -1) {
      await this.getForm()
    }
    await this.getQuestions()
  },

  computed: {
    ...mapState(['user']),
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