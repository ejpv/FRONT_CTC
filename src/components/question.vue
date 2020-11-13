<template>
  <v-card :color="!isValid ? 'amber lighten-5' : ''">
    <v-system-bar v-if="$slots.header" height="30" color="primary">
      <slot name="header" />
    </v-system-bar>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="4" md="2">
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
          <v-text-field
            v-model="question.question"
            autocomplete="off"
            label="Pregunta"
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" xs="12" v-if="qItem.type === 'ABIERTA'">
          <v-text-field autocomplete="off" label="Respuesta" disabled />
        </v-col>
        <v-col cols="12" xs="12" v-else-if="qItem.type === 'SN'">
          <v-switch v-model="question" label="Si/no" disabled />
        </v-col>
        <v-col
          cols="12"
          xs="12"
          v-else-if="qItem.type === 'SELECCION' || qItem.type === 'MULTIPLE'"
        >
          <v-text-field
            v-for="(item, index) in question.items"
            :label="`Opción ${index + 1}`"
            @keyup.enter="addOption"
            autocomplete="off"
            v-model.trim="question.items[index]"
            :key="index"
            outlined
            dense
          >
            <template v-if="question.items.length > 1" v-slot:append>
              <v-icon @click="rmOption(index)">far fa-times-circle</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <slot name="actions" />
      <v-divider vertical class="mx-2" />
      <v-btn @click="handleClick('delete')" icon> <v-icon>fa-trash</v-icon> </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['value'],
  data: () => ({
    isValid: false,
    qItem: {},
    questionItems: [
      { type: 'ABIERTA', title: 'Abierta', icon: 'fa-spell-check' },
      { type: 'SN', title: 'Si/no', icon: 'fa-check' },
      { type: 'SELECCION', title: 'Selección', icon: 'fa-chevron-circle-down' },
      { type: 'MULTIPLE', title: 'Opción multiple', icon: 'fa-check-square' }
    ],
    question: {}
  }),
  created: function() {
    if (this.value && this.value.item) {
      this.qItem = this.questionItems.find(v => v.type === this.value.type)
      this.question = this.value
    } else {
      this.qItem = this.questionItems[0]
      this.question.type = this.questionItems[0].type
    }
  },
  methods: {
    changeQuestionType: function(qItem) {
      this.qItem = qItem
      switch (qItem.type) {
        case 'ABIERTA':
          this.question = { type: 'ABIERTA', question: '' }
          break
        case 'SN':
          this.question = { type: 'SN', question: '' }
          break
        case 'SELECCION':
          this.question = { type: 'SELECCION', question: '', items: [''] }

          break
        case 'MULTIPLE':
          this.question = { type: 'MULTIPLE', question: '', items: [''] }
          break
      }
      this.handleInput()
    },
    addOption: function() {
      this.question.items.push('')
    },
    rmOption: function(item) {
      this.question.items.splice(item, 1)
    },
    handleInput() {
      this.isValid = false
      if (this.question.type === 'ABIERTA' || this.question.type === 'SN')
        if (this.question.question !== '') this.isValid = true

      if (this.question.type === 'SELECCION' || this.question.type === 'MULTIPLE')
        if (
          this.question.question !== '' &&
          this.question.items.length > 0 &&
          this.question.items[0] !== ''
        ) {
          this.isValid = true
        }

      if (this.isValid) this.$emit('input', this.question)
    },

    handleClick(type) {
      this.$emit(`click:${type}`, this.question)
    }
  },
  watch: {
    'question.type': function() {
      this.handleInput()
    },
    'question.question': function() {
      this.handleInput()
    },
    'question.items': function() {
      this.handleInput()
    }
  }
}
</script>
