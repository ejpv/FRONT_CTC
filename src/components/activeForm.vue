<template>
  <div>
    <v-container>
      <v-progress-linear
        indeterminate
        v-show="loading"
        color="primary"
      ></v-progress-linear>
      <div v-if="!forms[0] && !loading">
        <v-row>
          <v-col>
            <v-card>
              <v-card-title text-align-center>
                <span>
                  No se han encontrado formularios, cree uno o restaure uno eliminado.
                </span>
                <v-spacer></v-spacer>
                Volver a obtener formularios
                <v-btn color="info" class="ml-4" medium icon>
                  <v-icon medium @click="getForms()">fa-sync-alt</v-icon>
                </v-btn>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <v-row v-for="item in forms" :key="item._id">
        <v-col>
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline pl-6">{{ item.nombre }}</span>

              <v-spacer></v-spacer>

              <v-menu offset-y tile>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text v-bind="attrs" v-on="on">
                    <v-icon color="white"> fa-ellipsis-v </v-icon>
                  </v-btn>
                </template>

                <v-list flat tile>
                  <v-list-item @click="redirect(item)">
                    <v-list-item-icon
                      ><v-icon class="ml-2 edit--text">fa-pen </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      <span> Editar este Formulario </span></v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item @click="deleteItem(item)">
                    <v-list-item-icon
                      ><v-icon class="ml-2 delete--text"> fa-trash </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      <span> Eliminar este Formulario </span></v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row v-for="(quest, index) in item.pregunta" :key="quest._id">
                  <v-col cols="12" md="10">
                    <span class="d-block text-truncate text--secondary">
                      <span class="font-weight-black"> {{ index + 1 }}.- </span>
                      {{ quest.enunciado }}
                    </span>
                  </v-col>
                  <v-col cols="12" md="2">
                    <span class="font-weight-black"> {{ quest.tipo }} </span>
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
                    alt=""
                    :src="item.realizadoPor.avatar"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    >{{ item.realizadoPor.nombre }}
                    {{ item.realizadoPor.apellido }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline"> ¿Está seguro de borrar este Formulario?</span>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="closeDelete">Cancelar</v-btn></v-col
              >
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="deleteItemConfirm">Continuar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { swalError, swalLoading, swalConfirm } from '@/utils/notify'
export default {
  props: ['activator'],
  data() {
    return {
      forms: [],
      loading: false,
      dialogDelete: false,
      problem: false,
      editedItem: {},
      editedIndex: -1
    }
  },
  methods: {
    async getForms() {
      this.loading = true
      this.forms = []
      await this.$http
        .get('/api/formularios')
        .then(res => {
          this.loading = false
          this.forms = res.data.data
          console.log(this.forms);
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

    async removeForm() {
      this.loading = true
      swalLoading('Eliminando formulario')
      try {
        await this.$http.delete(`/api/formulario/${this.editedItem._id}`).then(() => {
          this.loading = false
          swalConfirm('Formulario Eliminado')
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

    deleteItem(item) {
      this.editedIndex = this.forms.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      await this.removeForm()
      if (!this.problem) {
        this.forms.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    redirect(item) {
      //this.$router.push(`/editedForm/${item._id}`)
      this.$router.push(`/pruebas2/${item._id}`)
    }
  },
  created() {
    this.getForms()
  },
  computed: {},
  watch: {
    activator(val) {
      if (!val) {
        this.getForms()
      }
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  }
}
</script>