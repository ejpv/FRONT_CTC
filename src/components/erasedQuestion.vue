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
                <v-btn color="new" class="mb-2" medium disabled>
                  Nueva Pregunta
                  <v-icon right>fa-list-ol</v-icon>
                </v-btn>
                <v-btn color="info" class="mb-2 ml-4" medium icon>
                  <v-icon medium @click="getQuestions()">fa-sync-alt</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-toolbar>
      </template>

      <template v-slot:item.tipo="{ item }">
        {{ type(item.tipo) }}
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
                @click="seeItem(item)"
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
          <span> Restaurar una Pregunta </span>
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
                <span class="headline"> ¿Está seguro de restaurar esta Pregunta?</span>
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

    <v-dialog v-model="see" max-width="500px">
      <v-card>
        <v-card-title class="primary white--text">
          <div>
            <span class="headline">Ver una Pregunta </span>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <h3 class="pt-2 pb-1">Enunciado</h3>
              <v-text-field
                v-model="editedItem.enunciado"
                filled
                rounded
                dense
                disabled
              ></v-text-field>

              <h3 class="pb-1">Tipo</h3>

              <v-btn color="accent" class="mb-5" disabled>
                <v-icon left>{{ getIcon(editedItem.tipo) }} </v-icon>
                {{ getTitle(editedItem.tipo) }}
              </v-btn>

              <div v-if="editedItem.tipo === 'SN'">
                <h3 class="pb-3">Vista Previa</h3>
                <h4 class="pb-1">Respuesta</h4>
                <v-switch class="pa-1" label="Si/no" disabled filled rounded dense />
              </div>
              <div v-if="editedItem.tipo === 'ABIERTA'">
                <h3 class="pb-3">Vista Previa</h3>
                <h4 class="pb-1">Respuesta</h4>
                <v-text-field autocomplete="off" disabled filled rounded dense />
              </div>
              <div
                v-if="editedItem.tipo === 'SELECCION' || editedItem.tipo === 'MULTIPLE'"
              >
                <h3 class="pb-3">Opciones de Respuesta</h3>
                <div v-for="(option, number) in editedItem.opciones" :key="number">
                  <h3 class="pt-2 pb-1">Opción {{ number + 1 }}</h3>
                  <v-text-field
                    disabled
                    autocomplete="off"
                    v-model.trim="editedItem.opciones[number]"
                    filled
                    rounded
                    dense
                    style="margin-bottom: -15px"
                  >
                  </v-text-field>
                </div>
              </div>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="12" class="d-flex justify-space-around pa-0">
                <v-btn text @click="close">Cerrar</v-btn>
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
      questions: [],
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
      questionItems: [
        { tipo: 'ABIERTA', title: 'Abierta', icon: 'fa-spell-check' },
        { tipo: 'SN', title: 'Si/No', icon: 'fa-check' },
        { tipo: 'SELECCION', title: 'Selección', icon: 'fa-chevron-circle-down' },
        { tipo: 'MULTIPLE', title: 'Opción multiple', icon: 'fa-check-square' }
      ],
      dialogRestore: false,
      problem: false,
      see: false,
      editedIndex: -1,
      editedItem: {
        tipo: 'ABIERTA'
      },
      defaultItem: {
        tipo: 'ABIERTA'
      }
    }
  },
  methods: {
    async getQuestions() {
      this.loading = true
      this.questions = []
      await this.$http
        .get('api/preguntas?estado=false')
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

    seeItem(item) {
      this.editedItem = item
      this.see = true
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

    restoreItem(item) {
      this.editedIndex = this.questions.indexOf(item)
      this.editedItem = item
      this.dialogRestore = true
    },

    async restoreItemConfirm() {
      await this.restoreQuestion()
      if (!this.problem) {
        this.questions.splice(this.editedIndex, 1)
      }
      this.closeRestore()
      this.problem = false
    },

    close() {
      this.see = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeRestore() {
      this.dialogRestore = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async restoreQuestion() {
      this.loading = true
      swalLoading('Restaurando pregunta')
      try {
        await this.$http
          .put(`api/pregunta/${this.editedItem._id}/restaurar`)
          .then(() => {
            this.loading = false
            swalConfirm('Pregunta restaurada')
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

    getIcon(item) {
      return this.questionItems.find(v => v.tipo === item).icon
    },

    getTitle(item) {
      return this.questionItems.find(v => v.tipo === item).title
    }
  },
  watch: {
    dialogRestore(val) {
      val || this.closeRestore()
    },
    see(val) {
      val || this.close()
    },
    activator(val) {
      if (val) {
        this.getQuestions()
      }
    }
  }
}
</script>
