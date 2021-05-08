<template>
  <div>
    <v-card>
      <v-card-title class="primary white--text">
        <span class="headline">
          {{ diagnostic.formulario.nombre }} - {{ diagnostic.total }}
        </span>
      </v-card-title>
      <v-container>
        <div v-for="(item, index) in diagnostic.respuesta" :key="index">
          <v-card-text>
            <span class="subtitle-2">{{ index + 1 }} </span>-
            {{ diagnostic.formulario.pregunta[index].enunciado }} -
            {{ getType(diagnostic.formulario.pregunta[index].tipo) }}
            <div v-if="diagnostic.formulario.pregunta[index].tipo === 'MULTIPLE'">
              <h4>Respuesta:</h4>
              <div class="pb-5" style="margin-top: -10px">
                <div
                  v-for="(opcion, indice) in diagnostic.formulario.pregunta[index]
                    .opciones"
                  :key="'A' + indice"
                >
                  <v-checkbox
                    v-model="diagnostic.respuesta[indice]"
                    disabled
                    class="pa-0"
                    style="margin-bottom: -35px"
                  >
                    <template v-slot:label>
                      <span class="subtitle-2">{{ opcion }}</span>
                    </template>
                  </v-checkbox>
                </div>
              </div>
            </div>

            <div v-if="diagnostic.formulario.pregunta[index].tipo === 'SELECCION'">
              <h4>Respuesta:</h4>
              <v-radio-group
                v-model="item.valor"
                style="margin-bottom: -10px; margin-top: -2px"
              >
                <v-radio
                  v-for="(opcion, indice) in diagnostic.formulario.pregunta[index]
                    .opciones"
                  :label="opcion"
                  disabled
                  :key="'B' + indice"
                >
                </v-radio>
              </v-radio-group>
            </div>

            <div v-if="diagnostic.formulario.pregunta[index].tipo === 'SN'">
              <h4>Respuesta:</h4>
              {{ getRespuesta('SN', item.valor) }}
            </div>

            <div v-if="diagnostic.formulario.pregunta[index].tipo === 'ABIERTA'">
              <h4>Respuesta:</h4>
              {{ getRespuesta('ABIERTA', item.valor) }}
            </div>

            <span class="subtitle-2">Puntaje de la pregunta:</span> {{ item.puntaje }}
          </v-card-text>
        </div>
      </v-container>

      <v-card-actions>
        <v-btn text block @click="cerrar"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ['diagnostic'],
  methods: {
    cerrar() {
      this.$emit('accion')
    },

    getType(item) {
      if (item === 'SN') {
        return 'Si y No'
      } else {
        if (item === 'MULTIPLE') {
          return 'Opción Múltiple'
        } else {
          if (item === 'SELECCION') {
            return 'Selección'
          } else {
            return 'Abierta'
          }
        }
      }
    },

    getRespuesta(critery, item) {
      if (item === null) {
        return 'No se ha respondido'
      } else {
        if (critery === 'SN') {
          return item ? 'Si' : 'No'
        } else {
          return item
        }
      }
    }
  }
}
</script>

