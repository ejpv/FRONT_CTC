<template>
  <div>
    <v-card>
      <v-card-title class="accent white--text">
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

            <div v-if="diagnostic.formulario.pregunta[index].tipo === 'COMPLEX'">
              <h4>Respuesta:</h4>
              <div class="pb-5" style="margin-top: -10px">
                <v-row>
                  <v-col
                    v-for="(header, idHeader) in diagnostic.formulario.pregunta[index]
                      .encabezado"
                    :key="idHeader + 'H'"
                    class="d-flex child-flex pt-2"
                    align="center"
                  >
                    <span class="font-weight-medium">{{ header }}</span>
                  </v-col>
                </v-row>

                <v-row
                  v-for="(res, idRes) in item.valor"
                  :key="idRes + 'R'"
                  align="center"
                >
                  <v-col
                    v-for="(format, idFormat) in diagnostic.formulario.pregunta[index]
                      .formato"
                    :key="idFormat + 'F'"
                    class="d-flex child-flex pa-1"
                    align="center"
                  >
                    <div v-if="format.tipo === 'SN'">
                      {{ getRespuesta('SN', item.valor[idRes][idFormat]) }}
                    </div>

                    <div v-else-if="format.tipo === 'ABIERTA'">
                      {{ getRespuesta('ABIERTA', item.valor[idRes][idFormat]) }}
                    </div>

                    <div v-else-if="format.tipo === 'SELECCION'">
                      <v-radio-group
                        v-model="item.valor[idRes][idFormat]"
                        style="margin-bottom: -10px; margin-top: -2px"
                      >
                        <v-radio
                          v-for="(option, number) in format.opciones"
                          :label="option"
                          disabled
                          :key="'SV' + number"
                        >
                        </v-radio>
                      </v-radio-group>
                    </div>

                    <div v-else-if="format.tipo === 'MULTIPLE'">
                      <div
                        v-for="(check, checkIndex) in format.opciones"
                        :key="checkIndex"
                      >
                        <v-checkbox
                          v-model="item.valor[idRes][idFormat][checkIndex]"
                          disabled
                          class="pa-0"
                          style="margin-bottom: -10px; margin-top: -2px"
                        >
                          <template v-slot:label>
                            <span class="subtitle-2">{{ check }}</span>
                          </template>
                        </v-checkbox>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>

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

            <span class="subtitle-2">Puntaje de la pregunta:</span> {{ item.puntaje }} /
            {{ diagnostic.formulario.pregunta[index].peso }}
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
          return 'Opción múltiple'
        } else {
          if (item === 'SELECCION') {
            return 'Selección'
          } else {
            if (item === 'COMPLEX') {
              return 'Compuesta'
            } else {
              return 'Abierta'
            }
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
