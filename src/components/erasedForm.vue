<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="forms"
            class="elevation-1"
            :loading="loading"
            loading-text="Obteniendo todos los Formularios..."
          >
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
                <span> Restaurar un Formulario </span>
              </v-tooltip>
            </template>

            <template v-slot:item.estado>
              <v-chip color="error" dark> Borrado </v-chip>
            </template>

            <template v-slot:item.realizadoPor="{ item }">
              <v-chip color="info" dark> {{ item.realizadoPor.nombre }} </v-chip>
            </template>

            <template v-slot:item.pregunta="{ item }">
              <v-chip color="info" dark> {{ item.pregunta.length }} </v-chip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialogRestore" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline"> ¿Está seguro de restaurar este Formulario?</span>
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
  </div>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'

export default {
  props: ['activator'],
  data() {
    return {
      forms: [],
      editedIndex: -1,
      editedItem: {},
      problem: false,
      dialogRestore: false,
      headers: [
        {
          text: 'Nombre del Formulario',
          value: 'nombre',
          align: 'start'
        },
        {
          text: 'Realizado Por',
          value: 'realizadoPor',
          align: 'start'
        },
        {
          text: 'Preguntas',
          value: 'pregunta',
          align: 'start'
        },
        {
          text: 'Estado',
          value: 'estado'
        },
        {
          text: 'Acciones',
          value: 'actions'
        }
      ]
    }
  },

  methods: {
    async getForms() {
      this.loading = true
      this.form = {}
      await this.$http
        .get(`/api/formularios?estado=false`)
        .then(res => {
          this.loading = false
          this.forms = res.data.data
          console.log(this.forms)
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

    restoreItem(item) {
      this.editedIndex = this.forms.indexOf(item)
      this.editedItem = item
      this.dialogRestore = true
    },

    async restoreItemConfirm() {
      await this.restoreForm()
      if (!this.problem) {
        this.forms.splice(this.editedIndex, 1)
      }
      this.closeRestore()
      this.problem = false
    },

    closeRestore() {
      this.dialogRestore = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async restoreForm() {
      this.loading = true
      swalLoading('Restaurando formulario')
      try {
        await this.$http
          .put(`/api/formulario/${this.editedItem._id}/restaurar`)
          .then(() => {
            this.loading = false
            swalConfirm('Formulario restaurado')
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
    }
  },

  async created() {
    await this.getForms()
  },

  watch: {
    activator(val) {
      if (val) {
        this.getForms()
      }
    }
  }
}
</script>
