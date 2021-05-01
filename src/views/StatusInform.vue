<template>
  <div>
    <v-row>
      <v-col cols="12" :sm="sm">
        <v-card>
          <v-card-title class="primary white--text">
            <span class="headline">Informes </span>
            <v-spacer></v-spacer>
            <v-btn icon @click="seeInforms = !seeInforms">
              <v-icon v-if="seeInforms"> fa-angle-up </v-icon>
              <v-icon v-else> fa-angle-down</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text v-if="seeInforms" class="pa-0">
            <div v-if="informs.length > 0 && !loading">
              <div
                v-for="(fecha, i) in dateNotRepeted"
                :key="i"
                style="margin-bottom: -15px"
              >
                <v-card-title class="secondary lighten-1">
                  <span class="headline">{{ fecha }}</span>
                </v-card-title>

                <v-card-text>
                  <div v-for="(item, index) in informs" :key="item._id">
                    <div v-if="item.fechaCreacion.includes(fecha)">
                      <v-row>
                        <v-col>
                          <h4 class="pt-2">
                            Informe del
                            <span class="font-weight-black">
                              {{ informs[index].fechaCreacion }}
                            </span>
                            --
                            <span class="font-weight-black">
                              {{ informs[index].diagnostico.length }}
                            </span>
                            Diagnosticos,
                            <span class="font-weight-black">
                              {{ informs[index].conclusion.length }}
                            </span>
                            Conclusiones,
                            <span class="font-weight-black">
                              {{ informs[index].recomendacion.length }}
                            </span>
                            Recomendaciones y
                            <span class="font-weight-black">
                              {{ informs[index].observacion.length }}</span
                            >
                            Observaciones
                          </h4>
                        </v-col>

                        <v-col
                          cols="4"
                          sm="2"
                          class="d-flex align-content-center flex-wrap"
                        >
                          <v-chip
                            :class="`${getColor(item.estado)} white--text`"
                            style="margin-right: -10px; margin-left: -15px"
                          >
                            {{ getText(item.estado) }}
                          </v-chip>
                          <v-spacer> </v-spacer>
                          <v-menu offset-y tile>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn text v-bind="attrs" v-on="on" icon>
                                <v-icon> fa-ellipsis-v </v-icon>
                              </v-btn>
                            </template>

                            <v-list flat tile>
                              <v-list-item @click="prepareWorkStation(item, 'see')">
                                <v-list-item-icon>
                                  <v-icon class="ml-2 blue--text">fa-eye </v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>
                                  <span> Ver este Informe </span>
                                </v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                @click="prepareWorkStation(item, 'edit')"
                                :disabled="item.estado"
                              >
                                <v-list-item-icon>
                                  <v-icon class="ml-2 edit--text" :disabled="item.estado"
                                    >fa-pen
                                  </v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>
                                  <span> Editar este Informe </span>
                                </v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                @click="deleteItem(item)"
                                :disabled="item.estado"
                              >
                                <v-list-item-icon>
                                  <v-icon
                                    class="ml-2 delete--text"
                                    :disabled="item.estado"
                                  >
                                    fa-trash
                                  </v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>
                                  <span> Eliminar este Informe </span>
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-card-text>
              </div>
            </div>

            <div v-else>
              <v-card-title class="secondary lighten-1">
                <span class="headline"
                  >No has realizado Informes para este Establecimiento</span
                >
              </v-card-title>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="pt-1 pb-1" flat>
          <v-progress-linear
            indeterminate
            color="primary"
            v-show="loading"
          ></v-progress-linear>
        </v-card>
      </v-col>

      <v-col cols="12" :sm="sm">
        <div v-if="action != ''">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">Informe {{ editedInform.fechaCreacion }} </span>
              <v-spacer></v-spacer>
              <v-chip
                :class="`${getColor(editedInform.estado)} white--text`"
                style="margin-left: -5px"
              >
                {{ getText(editedInform.estado) }}
              </v-chip>
              <v-btn icon @click="restoreDefault" style="margin-left: -5px">
                <v-icon> fa-times</v-icon></v-btn
              >
            </v-card-title>

            <v-card-text class="pl-5 pr-5 pt-2">
              <h3 class="pt-2 pb-1">Diagnosticos</h3>
              <div v-for="(item, index) in editedInform.diagnostico" :key="index">
                <h3 class="pl-4 pb-3">
                  {{ item.formulario.nombre }} - {{ item.fecha }} --
                  <span :class="getColorTotal(item) + '--text'">
                    {{ item.total }}
                  </span>
                </h3>
              </div>

              <h3 class="pt-2">
                Conclusiones
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :disabled="disableItem"
                      icon
                      @click="editedInform.conclusion.push('')"
                      small
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon class="info--text" small> fa-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> Agregar una conclusion </span>
                </v-tooltip>
              </h3>

              <v-textarea
                :disabled="disableItem"
                v-for="(item, indice) in editedInform.conclusion"
                :key="'C' + indice"
                v-model="editedInform.conclusion[indice]"
                auto-grow
                filled
                rounded
                dense
                rows="1"
                style="margin-bottom: -10px"
              >
                <template
                  v-if="editedInform.conclusion.length > 1 && !disableItem"
                  v-slot:append
                >
                  <v-icon @click="removeOption('conclusion', indice)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-textarea>

              <h3 class="pt-2">
                Recomendaciones
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      :disabled="disableItem"
                      @click="editedInform.recomendacion.push('')"
                      small
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon class="info--text" small> fa-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> Agregar una recomendacion </span>
                </v-tooltip>
              </h3>

              <v-textarea
                :disabled="disableItem"
                v-for="(item, indice) in editedInform.recomendacion"
                :key="'A' + indice"
                v-model="editedInform.recomendacion[indice]"
                auto-grow
                filled
                rounded
                dense
                rows="1"
                style="margin-bottom: -10px"
              >
                <template
                  v-if="editedInform.recomendacion.length > 1 && !disableItem"
                  v-slot:append
                >
                  <v-icon @click="removeOption('recomendacion', indice)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-textarea>

              <h3 class="pt-2">
                Observaciones
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      :disabled="disableItem"
                      @click="editedInform.observacion.push('')"
                      small
                      v-on="on"
                      v-bind="attrs"
                    >
                      <v-icon class="info--text" small> fa-plus </v-icon>
                    </v-btn>
                  </template>
                  <span> Agregar una observacion </span>
                </v-tooltip>
              </h3>

              <v-textarea
                :disabled="disableItem"
                v-for="(item, indice) in editedInform.observacion"
                :key="'B' + indice"
                v-model="editedInform.observacion[indice]"
                auto-grow
                filled
                rounded
                dense
                rows="1"
                style="margin-bottom: -10px"
              >
                <template
                  v-if="editedInform.observacion.length > 1 && !disableItem"
                  v-slot:append
                >
                  <v-icon @click="removeOption('observacion', indice)"
                    >far fa-times-circle</v-icon
                  >
                </template>
              </v-textarea>
              <v-card v-if="editedInform.estado === false">
                <v-container>
                  <h3 class="pt-2">Retroalimentación:</h3>
                  <v-textarea
                    disabled
                    v-model="editedInform.retroalimentacion"
                    :label="
                      editedInform.retroalimentacion ? '' : 'No existe retroalimentación'
                    "
                    auto-grow
                    filled
                    rounded
                    dense
                    rows="1"
                    style="margin-bottom: -10px"
                  >
                  </v-textarea>
                </v-container>
              </v-card>
            </v-card-text>

            <v-card-actions v-if="!disableItem">
              <v-btn class="success" @click="save" block> Guardar Informe </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline"> ¿Está seguro de borrar este Informe?</span>
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
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      seeInforms: true,
      dialogDelete: false,
      problem: false,
      sm: '',
      action: '',
      editedIndex: -1,
      informs: [
        {
          diagnostico: [],
          recomendacion: [],
          observacion: [],
          conclusion: []
        }
      ],
      dateNotRepeted: [],
      editedInform: {
        diagnostico: [],
        recomendacion: [],
        observacion: [],
        conclusion: []
      },
      defaultItem: {
        diagnostico: [],
        recomendacion: [],
        observacion: [],
        conclusion: []
      }
    }
  },
  methods: {
    async getInforms() {
      this.loading = true
      this.informs = []
      this.dateNotRepeted = []
      await this.$http
        .get(`/api/informes/${this.user._id}/${this.establishment._id}`)
        .then(res => {
          this.loading = false
          this.informs = res.data.data
          this.getDate()
          this.editedInform = this.defaultItem
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

    getDate() {
      var dates = this.informs.map(item => {
        return item.fechaCreacion.split('/')[1] + '/' + item.fechaCreacion.split('/')[2]
      })
      this.dateNotRepeted.push(dates[0])
      for (let i = 0; i < dates.length; i++) {
        if (dates[i + 1]) {
          if (dates[i] != dates[i + 1]) {
            this.dateNotRepeted.push(dates[i + 1])
          }
        }
      }
    },

    getColor(item) {
      if (item) {
        return 'success'
      } else {
        if (item === false) {
          return 'error'
        } else {
          return 'edit'
        }
      }
    },

    getColorTotal(item) {
      var total = parseInt(item.total.split('%')[0])
      if (total < 50) {
        return 'error'
      } else {
        if (total >= 50 && total < 90) {
          return 'edit'
        } else {
          return 'success'
        }
      }
    },

    getText(item) {
      if (item) {
        return 'Aprobado'
      } else {
        if (item === false) {
          return 'Rechazado'
        } else {
          return 'Pendiente'
        }
      }
    },

    prepareWorkStation(item, critery) {
      this.action = critery
      this.editedInform = item
    },

    restoreDefault() {
      this.action = ''
      this.editedInform = this.defaultItem
    },

    deleteItem(item) {
      this.editedIndex = this.informs.indexOf(item)
      this.editedInform = item
      this.dialogDelete = true
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedInform = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async deleteItemConfirm() {
      await this.removeInform()
      if (!this.problem) {
        this.informs.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    save() {
      this.changeInform()
      if (!this.problem) {
        var indice = this.informs.indexOf(this.editedInform)
        this.informs[indice].estado = null
        this.editedInform = this.defaultItem
        this.action = ''
      }
    },

    async removeInform() {
      this.loading = true
      swalLoading('Eliminando Informe')
      try {
        await this.$http.delete(`/api/informe/${this.editedItem._id}`).then(() => {
          this.loading = false
          swalConfirm('Informe Eliminado')
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

    async changeInform() {
      this.loading = true
      swalLoading('Editando Informe')
      try {
        await this.$http
          .put(`/api/informe/${this.editedInform._id}`, this.editedInform)
          .then(async () => {
            this.loading = false
            swalConfirm('Informe editado')
            this.problem = false
          })
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

  computed: {
    ...mapState(['user', 'establishment']),
    disableItem() {
      return this.action === 'edit' ? false : true
    }
  },

  created() {
    this.getInforms()
  },

  watch: {
    seeInforms(v) {
      if (v) {
        this.sm = '6'
      } else {
        this.sm = '12'
      }
    },

    establishment() {
      this.getInforms()
    },

    dialogDelete(val) {
      val || this.closeDelete()
    }
  }
}
</script>