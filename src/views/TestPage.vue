<template>
  <div>
    <v-toolbar dense>
      <v-toolbar-title>Formulario</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn @click="save" icon>
        <v-icon>fa-save</v-icon>
      </v-btn>
      <v-btn @click="questions.push({})" icon>
        <v-icon>fa-plus</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card class=" grey lighten-5" height="100%">
      <v-card-text>
        <ctc-question
          class="mb-5"
          v-for="(item, index) in questions"
          :key="index"
          v-model.trim="questions[index]"
          @click:delete="v => questions.splice(index, 1)"
        >
          <template slot="header"> Pregunta {{ index + 1 }} </template>
          <template slot="actions">
            <v-btn
              v-if="questions.length > 1 && index >= 0 && index + 1 !== questions.length"
              icon
            >
              <v-icon>fa-chevron-circle-down</v-icon>
            </v-btn>

            <v-btn v-if="questions.length > 1 && index !== 0" icon>
              <v-icon>fa-chevron-circle-up</v-icon>
            </v-btn>
          </template>
        </ctc-question>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  data: () => ({
    questions: [
      /*
      { type: 'ABIERTA', question: 'Nombre' },
      { type: 'SN', question: 'Posee enfermedad terminal' },
      {
        type: 'SELECCION',
        question: 'Tipo de vivienda',
        items: ['Propia', 'Arendada', 'Prestada']
      },
      {
        type: 'MULTIPLE',
        question: 'Miembros de la familia',
        items: ['Papá', 'Mamá', 'Hermanos', 'Abuelos']
      }*/
    ]
  }),
  methods: {
    save: function() {
      console.log(this.questions)
    }
  }
}
</script>
