<template>
  <div>
    <v-container>
      <v-card class="mx-auto">
        <v-card-title class="title primary white--text">
          <span class="headline">Selecciona un formulario</span>
        </v-card-title>
        <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
        <v-container>
          <v-container>
            <v-row>
              <v-col :cols="editedForm.nombre != '' ? '11' : '12'" class="pa-0"
                ><v-autocomplete
                  v-model="editedForm"
                  :items="forms"
                  item-text="nombre"
                  persistent-hint
                  return-object
                  single-line
                  filled
                  rounded
                  dense
                >
                </v-autocomplete
              ></v-col>
              <v-col
                cols="1"
                v-if="editedForm.nombre != ''"
                class="d-flex justify-center pa-0 pl-2 pt-1"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" v-bind="attrs" icon @click="$vuetify.goTo(9999)">
                      <v-icon> fa-angle-down </v-icon>
                    </v-btn>
                  </template>
                  <span> Ir al final </span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
          <v-card v-if="editedForm.nombre != ''" flat>
            <v-card-title class="secondary white--text">
              <span class="headline">{{ editedForm.nombre }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row v-for="(quest, index) in editedForm.pregunta" :key="index">
                  <v-col cols="12" md="10">
                    <span class="d-block text-truncate text--secondary">
                      <span class="font-weight-black"> {{ index + 1 }}.- </span>
                      {{ quest.enunciado }}
                    </span>
                  </v-col>
                  <v-col cols="12" md="2">
                    <span class="font-weight-black"> {{ type(quest.tipo) }} </span>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-container class="ml-4">
              <span class="font-weight-black">Realizado por:</span>
            </v-container>

            <v-card-actions>
              <v-list-item class="grow">
                <v-list-item-avatar color="grey darken-3">
                  <v-img
                    class="elevation-6"
                    :src="editedForm.realizadoPor.avatar || '/image-gallery.svg'"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    >{{ editedForm.realizadoPor.nombre }}
                    {{ editedForm.realizadoPor.apellido }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-container>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="6" md="6" class="d-flex justify-space-around pa-0"> </v-col>
              <v-col cols="5" class="d-flex justify-space-around pa-0">
                <v-btn :disabled="disabled" @click="redirect(editedForm)" class="primary">
                  Siguiente
                </v-btn>
              </v-col>
              <v-col
                cols="1"
                v-if="editedForm.nombre != ''"
                class="d-flex justify-center pa-0 pl-1"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" v-bind="attrs" icon @click="$vuetify.goTo(0)">
                      <v-icon> fa-angle-up </v-icon>
                    </v-btn>
                  </template>
                  <span> Ir al inicio </span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      forms: [],
      editedForm: {
        nombre: '',
        pregunta: [{ enunciado: '', tipo: 'ABIERTA' }],
        realizadoPor: {
          avatar: '',
          nombre: '',
          apellido: ''
        }
      }
    }
  },

  methods: {
    async getForms() {
      this.loading = true
      this.forms = []
      await this.$http
        .get('api/formularios')
        .then(res => {
          this.loading = false
          this.forms = res.data.data
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

    type(critery) {
      if (critery === 'SN') {
        return 'Pregunta de Si y No'
      } else {
        if (critery === 'MULTIPLE') {
          return 'Pregunta de Opción múltiple'
        } else {
          if (critery === 'ABIERTA') {
            return 'Pregunta Abierta'
          } else {
            if (critery === 'COMPLEX') {
              return 'Pregunta Compuesta'
            } else {
              return 'Pregunta de Selección múltiple'
            }
          }
        }
      }
    },

    redirect(form) {
      this.$router.push(`/test/${form._id}/${this.establishment._id}`)
    }
  },

  async created() {
    await this.getForms()
  },

  computed: {
    ...mapState(['establishment']),

    disabled() {
      return this.editedForm.nombre != '' ? false : true
    }
  }
}
</script>
