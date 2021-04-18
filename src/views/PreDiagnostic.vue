<template>
  <div>
    <v-container>
      <v-card class="mx-auto" flat>
        <v-card-title class="title primary white--text">
          <span class="headline">{{ currentTitle }}</span>
        </v-card-title>
        <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
        <v-stepper v-model="step">
          <v-stepper-content step="1">
            <v-container>
              <v-autocomplete
                v-model="editedEstablishment"
                :items="establishments"
                item-text="nombre"
                persistent-hint
                return-object
                single-line
                filled
                rounded
                dense
                :disabled="disabledAutocomplete"
              >
              </v-autocomplete>
            </v-container>
            <v-card v-if="editedEstablishment.nombre != ''" flat>
              <v-row>
                <v-col>
                  <h3 class="pb-1">Nombre</h3>
                  <v-text-field
                    v-model="editedEstablishment.nombre"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>

                  <h3 class="pb-1">Correo</h3>
                  <v-text-field
                    v-model="editedEstablishment.email"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>

                  <h3 class="pb-1">Registro</h3>
                  <v-text-field
                    v-model="editedEstablishment.registro"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>

                  <h3 class="pb-1">Teléfono</h3>
                  <v-text-field
                    v-model="editedEstablishment.telefono"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>

                  <h3 class="pb-1">Lugar</h3>
                  <v-text-field
                    v-model="editedEstablishment.lugar.parroquia"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col>
                  <h3 class="pb-1">Administrador</h3>
                  <v-text-field
                    v-model="editedEstablishment.administrador"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>
                  <h3 class="pb-1">Nacionalidad / Pueblo</h3>
                  <v-text-field
                    v-model="editedEstablishment.nacionalidad"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>
                  <h3 class="pb-1">Página web</h3>
                  <v-text-field
                    v-model="editedEstablishment.web"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>
                  <h3 class="pb-1">Área Protegida</h3>
                  <v-text-field
                    v-if="editedEstablishment.areaProtegida"
                    v-model="editedEstablishment.areaProtegida.nombre"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>
                  <v-text-field v-else filled rounded dense disabled></v-text-field>
                  <h3 class="pb-1">Representante</h3>
                  <v-text-field
                    v-if="editedEstablishment.representante"
                    v-model="editedEstablishment.representante.nombre"
                    filled
                    rounded
                    dense
                    disabled
                  ></v-text-field>
                  <v-text-field v-else filled rounded dense disabled></v-text-field>
                </v-col>
              </v-row>
            </v-card>
            <v-card-actions>
              <v-container>
                <v-row>
                  <v-col cols="6" class="d-flex justify-space-around pa-0">
                    <v-btn :disabled="step === 1" text @click="step--"> Volver </v-btn>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-space-around pa-0">
                    <v-btn :disabled="disabled" text @click="step++">
                      Siguiente
                    </v-btn></v-col
                  >
                </v-row>
              </v-container>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-container>
              <v-autocomplete
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
              </v-autocomplete>
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
                <span class="font-weight-black">Realizado Por:</span>
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
            <v-card-actions>
              <v-container>
                <v-row>
                  <v-col cols="6" class="d-flex justify-space-around pa-0">
                    <v-btn :disabled="step === 1" text @click="step--"> Volver </v-btn>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-space-around pa-0">
                    <v-btn
                      :disabled="disabled"
                      @click="redirect(editedForm, editedEstablishment)"
                      class="primary"
                    >
                      Siguiente
                    </v-btn></v-col
                  >
                </v-row>
              </v-container>
            </v-card-actions>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'

export default {
  data() {
    return {
      loading: false,
      step: 1,
      establishments: [],
      forms: [],
      editedEstablishment: {
        nombre: '',
        email: '',
        registro: '',
        web: '',
        nacionalidad: '',
        telefono: '',
        administrador: '',
        areaProtegida: { nombre: '' },
        representante: { nombre: '' },
        lugar: { parroquia: '' }
      },
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
    async getEstablishments() {
      this.loading = true
      this.establishments = []
      await this.$http
        .get('/api/establecimientos')
        .then(res => {
          this.loading = false
          this.establishments = res.data.data
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

    async getForms() {
      this.loading = true
      this.forms = []
      await this.$http
        .get('/api/formularios')
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

    redirect(form, establishment) {
      this.$router.push(`/test/${form._id}/${establishment._id}`)
    }
  },

  async created() {
    await this.getForms()
    await this.getEstablishments()
  },

  computed: {
    currentTitle() {
      return this.step === 1
        ? 'Selecciona un Establecimiento'
        : this.step === 2
        ? 'Selecciona un Formulario'
        : 'Diagnóstico'
    },

    disabled() {
      if (this.step === 1 && this.editedEstablishment.nombre != '') {
        return false
      } else {
        if (this.step === 2 && this.editedForm.nombre != '') {
          return false
        } else {
          return true
        }
      }
    },

    disabledAutocomplete() {
      return this.establishments[0] ? false : true
    }
  }
}
</script>