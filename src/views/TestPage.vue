<template>
  <div>
    <v-toolbar dense>
      <v-toolbar-title>
        <span class="headline pl-4">Formulario</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="save" v-on="on" v-bind="attrs" icon>
            <v-icon class="success--text"> fa-save </v-icon>
          </v-btn>
        </template>
        <span> Guardar Formulario</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="questions.push({})" v-on="on" v-bind="attrs" icon>
            <v-icon class="info--text"> fa-plus </v-icon>
          </v-btn>
        </template>
        <span> Agregar una pregunta </span>
      </v-tooltip>
    </v-toolbar>

    <v-card height="100%">
      <v-card-text>
        <ctc-question
          class="mb-5"
          v-for="(item, index) in questions"
          :key="index"
          v-model.trim="questions[index]"
          @click:delete="v => questions.splice(index, 1)"
        >
          <template slot="header">
            <span class="ml-4 subtitle-1 white--text">Pregunta {{ index + 1 }}</span>
          </template>
          
          <template slot="actions">
            <v-btn
              v-if="questions.length > 1 && index >= 0 && index + 1 !== questions.length"
              icon
            >
              <v-icon class="edit--text">fa-chevron-circle-down</v-icon>
            </v-btn>

            <v-btn v-if="questions.length > 1 && index !== 0" icon>
              <v-icon class="edit--text">fa-chevron-circle-up</v-icon>
            </v-btn>
          </template>
        </ctc-question>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
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
    save() {
      console.log(this.questions)
    }
  }
}
</script>
