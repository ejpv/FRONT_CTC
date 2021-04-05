<template>
  <v-card :color="!isValid ? 'secondary lighten-3' : ''">
    <v-system-bar v-if="$slots.header" height="30" color="primary">
      <slot name="header" />
    </v-system-bar>

    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="4" md="2" class="pa-4">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" color="primary" block x-large>
                <v-icon left>{{ qItem.icon }}</v-icon> {{ qItem.title }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in questionItems"
                @click="changeQuestionType(item)"
                :key="index"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>

        <v-col cols="12" sm="8" md="10">
          <h3 class="pt-2 pb-1">Pregunta</h3>
          <v-text-field
            v-model="question.enunciado"
            autocomplete="off"
            filled
            rounded
            dense
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" v-if="qItem.tipo === 'ABIERTA'">
          <h3 class="pt-2 pb-1 text--disabled">Respuesta</h3>
          <v-text-field autocomplete="off" disabled filled rounded dense />
        </v-col>

        <v-col cols="12" xs="12" v-else-if="qItem.tipo === 'SN'">
          <h3 class="pt-2 pb-1 text--disabled">Respuesta</h3>
          <v-switch
            class="pa-1"
            v-model="question"
            label="Si/no"
            disabled
            filled
            rounded
            dense
          />
        </v-col>

        <v-col
          cols="12"
          xs="12"
          v-else-if="qItem.tipo === 'SELECCION' || qItem.tipo === 'MULTIPLE'"
        >
          <div v-for="(item, index) in question.opciones" :key="index">
            <h3 class="pt-2 pb-1">
              Opción {{ index + 1 }}
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-if="index === 0"
                    @click="addOption"
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
              @keyup.enter="addOption"
              autocomplete="off"
              v-model.trim="question.opciones[index]"
              filled
              rounded
              dense
            >
              <template v-if="question.opciones.length > 1" v-slot:append>
                <v-icon @click="removeOption(index)">far fa-times-circle</v-icon>
              </template>
            </v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-spacer />
      <slot name="actions" />
      <v-divider vertical class="mx-2" />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="handleClick('delete')" v-on="on" v-bind="attrs" icon>
            <v-icon class="error--text"> fa-trash </v-icon>
          </v-btn>
        </template>
        <span> Eliminar un Lugar </span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['value'],
  data: () => ({
    isValid: false,
    qItem: {},
    editedQuest: {},
    questionItems: [
      { tipo: 'ABIERTA', title: 'Abierta', icon: 'fa-spell-check' },
      { tipo: 'SN', title: 'Si/No', icon: 'fa-check' },
      { tipo: 'SELECCION', title: 'Selección', icon: 'fa-chevron-circle-down' },
      { tipo: 'MULTIPLE', title: 'Opción multiple', icon: 'fa-check-square' }
    ],
    question: {}
  }),
  
  created() {
    if (this.value && this.value.opciones) {
      this.qItem = this.questionItems.find(v => v.tipo === this.value.tipo)
      this.question = this.value
      this.editedQuest = this.value
    } else {
      this.qItem = this.questionItems[0]
      this.question.tipo = this.questionItems[0].tipo
    }
  },
  methods: {
    changeQuestionType(qItem) {
      this.qItem = qItem
      var edited = this.question
      switch (qItem.tipo) {
        case 'ABIERTA':
          if (edited.enunciado) {
            this.question = { tipo: 'ABIERTA', enunciado: edited.enunciado }
          } else {
            this.question = { tipo: 'ABIERTA', enunciado: '' }
          }
          break
        case 'SN':
          if (edited.enunciado) {
            this.question = { tipo: 'SN', enunciado: edited.enunciado }
          } else {
            this.question = { tipo: 'SN', enunciado: '' }
          }
          break
        case 'SELECCION':
          if (edited.enunciado) {
            if (edited.opciones) {
              this.question = {
                tipo: 'SELECCION',
                enunciado: edited.enunciado,
                opciones: edited.opciones
              }
            } else {
              this.question = {
                tipo: 'SELECCION',
                enunciado: edited.enunciado,
                opciones: ['']
              }
            }
          } else {
            if (edited.opciones) {
              this.question = {
                tipo: 'SELECCION',
                enunciado: '',
                opciones: edited.opciones
              }
            } else {
              this.question = { tipo: 'SELECCION', enunciado: '', opciones: [''] }
            }
          }

          break
        case 'MULTIPLE':
          if (edited.enunciado) {
            if (edited.opciones) {
              this.question = {
                tipo: 'MULTIPLE',
                enunciado: edited.enunciado,
                opciones: edited.opciones
              }
            } else {
              this.question = {
                tipo: 'MULTIPLE',
                enunciado: edited.enunciado,
                opciones: ['']
              }
            }
          } else {
            if (edited.opciones) {
              this.question = {
                tipo: 'MULTIPLE',
                enunciado: '',
                opciones: edited.opciones
              }
            } else {
              this.question = { tipo: 'MULTIPLE', enunciado: '', opciones: [''] }
            }
          }
          break
      }
      this.handleInput()
    },

    addOption() {
      this.question.opciones.push('')
    },

    removeOption(item) {
      this.question.opciones.splice(item, 1)
      this.question._id = ''
    },

    handleInput() {
      this.isValid = false
      if (this.question.tipo === 'ABIERTA' || this.question.tipo === 'SN')
        if (this.question.enunciado !== '') this.isValid = true

      if (this.question.tipo === 'SELECCION' || this.question.tipo === 'MULTIPLE')
        if (
          this.question.enunciado !== '' &&
          this.question.opciones.length > 0 &&
          this.question.opciones[0] !== ''
        ) {
          this.isValid = true
        }

      //VERIFICAR SI LA PREGUNTA HA CAMBIADO O ES LA MISMA
      //si ha cambiado le borra el id y si vuelve a ser la misma, le restaura el id
      if (this.question != this.editedQuest) {
        if (
          this.question.enunciado === this.editedQuest.enunciado &&
          this.question.tipo === this.editedQuest.tipo
        ) {
          if (this.question.tipo === 'MULTIPLE' || this.question.tipo === 'SELECCION') {
            if (this.question.opciones === this.editedQuest.opciones) {
              this.question._id = this.editedQuest._id
            } else {
              this.question._id = ''
            }
          } else {
            this.question._id = this.editedQuest._id
          }
        } else {
          this.question._id = ''
        }
      }

      if (this.isValid) this.$emit('input', this.question)
    },

    handleClick(tipo) {
      this.$emit(`click:${tipo}`, this.question)
    }
  },
  watch: {
    'question.tipo': function () {
      this.handleInput()
    },
    'question.enunciado': function () {
      this.handleInput()
    },
    'question.opciones': function () {
      this.handleInput()
    }
  }
}
</script>
