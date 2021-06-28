<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="representants"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todos los Representantes..."
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col align="start" cols="3" sm="2"> </v-col>
              <v-col align="end" cols="0" sm="10">
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="new" dark class="mb-2" v-bind="attrs" v-on="on" medium>
                      Nuevo Representante
                      <v-icon right>fa-user-tag</v-icon>
                    </v-btn>
                    <v-btn color="info" class="mb-2 ml-4" medium icon>
                      <v-icon medium @click="getRepresentants()">fa-sync-alt</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="primary white--text">
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-form ref="form">
                          <h3 class="pt-2 pb-1">
                            <strong class="error--text">*</strong> Nombre
                          </h3>
                          <v-text-field
                            v-model="editedItem.nombre"
                            filled
                            rounded
                            dense
                            :rules="fieldRules"
                          ></v-text-field>

                          <h3 class="pb-1">
                            <strong class="error--text">*</strong> Apellido
                          </h3>
                          <v-text-field
                            v-model="editedItem.apellido"
                            filled
                            rounded
                            dense
                            :rules="fieldRules"
                          ></v-text-field>

                          <h3 class="pb-1">
                            <strong class="error--text">*</strong> Cedula
                          </h3>
                          <v-text-field
                            v-model="editedItem.cedula"
                            filled
                            rounded
                            dense
                            :rules="numberRules"
                          ></v-text-field>

                          <h3 class="pb-1">
                            <strong class="error--text">*</strong> Correo
                          </h3>
                          <v-text-field
                            v-model="editedItem.email"
                            filled
                            rounded
                            dense
                            :rules="emailRules"
                          ></v-text-field>

                          <h3 class="pb-1">Telefono</h3>
                          <v-text-field
                            v-model="editedItem.telefono"
                            filled
                            rounded
                            dense
                          ></v-text-field>

                          <h3 class="pb-1">Dirección</h3>
                          <v-textarea
                            auto-grow
                            filled
                            rounded
                            dense
                            rows="1"
                            row-height="15"
                            v-model="editedItem.direccion"
                          ></v-textarea>

                          <h3 class="pb-1">Usuario Asignado</h3>
                          <div v-if="!editedItem.usuario">
                            <div v-if="messageUnassign">
                              <h4 class="mt-4 ml-4 error--text">
                                Guarde para efectuar los cambios.
                              </h4>
                            </div>
                            <div v-else>
                              <v-bottom-sheet v-model="sheet" max-width="700px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-container>
                                    <v-row>
                                      <v-col
                                        cols="6"
                                        class="d-flex justify-space-around pa-0"
                                      >
                                        <h4 v-if="editedIndex === -1">
                                          Asigne un Usuario
                                        </h4>
                                        <h4 v-else>No tiene un usuario asignado</h4>
                                      </v-col>
                                      <v-col
                                        cols="6"
                                        class="d-flex justify-space-around pa-0"
                                      >
                                        <v-btn color="primary" v-bind="attrs" v-on="on">
                                          Seleccionar
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </v-container>
                                </template>
                                <v-list shaped>
                                  <v-subheader>Lista de Usuarios</v-subheader>
                                  <v-list-item
                                    v-for="usuario in users"
                                    :key="usuario._id"
                                    @click="asignUser(usuario)"
                                  >
                                    <v-list-item-avatar>
                                      <v-avatar size="32px" tile>
                                        <img
                                          :src="usuario.avatar || '/image-gallery.svg'"
                                        />
                                      </v-avatar>
                                    </v-list-item-avatar>
                                    <v-list-item-title
                                      >{{ usuario.nombre }} {{ usuario.apellido }}
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-bottom-sheet>
                            </div>
                          </div>
                          <div v-else>
                            <v-list>
                              <v-list-item>
                                <v-list-item-avatar>
                                  <v-avatar size="32px" tile>
                                    <img
                                      :src="
                                        editedItem.usuario.avatar || '/image-gallery.svg'
                                      "
                                    />
                                  </v-avatar>
                                </v-list-item-avatar>
                                <v-list-item-title
                                  >{{ editedItem.usuario.nombre }}
                                  {{ editedItem.usuario.apellido }}
                                </v-list-item-title>

                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      class="ml-2 info--text"
                                      v-on="on"
                                      v-bind="attrs"
                                      @click="seeUser(editedItem.usuario)"
                                    >
                                      fa-eye
                                    </v-icon>
                                  </template>
                                  <span> Ver Usuario asignado</span>
                                </v-tooltip>

                                <v-tooltip bottom v-if="editedIndex != -1">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      class="ml-4 error--text"
                                      v-on="on"
                                      v-bind="attrs"
                                      @click="unassignUser(editedItem.usuario)"
                                    >
                                      fa-times-circle
                                    </v-icon>
                                  </template>
                                  <span>Quitar Usuario asignado</span>
                                </v-tooltip>
                              </v-list-item>
                            </v-list>
                          </div>
                        </v-form>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-container>
                        <v-row>
                          <v-col cols="6" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="close">Cancelar</v-btn>
                          </v-col>
                          <v-col cols="6" class="d-flex justify-space-around pa-0">
                            <v-btn text @click="save">Guardar</v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2 edit--text"
              @click="editItem(item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-pen
            </v-icon>
          </template>
          <span> Editar un Representante </span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="ma-2 delete--text"
              @click="deleteItem(item)"
              v-on="on"
              v-bind="attrs"
            >
              fa-trash
            </v-icon>
          </template>
          <span> Eliminar un Representante </span>
        </v-tooltip>
      </template>

      <template v-slot:item.estado="{ item }">
        <v-chip :color="getColor(item, 'estado')" dark>
          {{ getText(item, 'estado') }}
        </v-chip>
      </template>

      <template v-slot:item.asignado="{ item }">
        <v-chip :color="getColor(item, 'asignado')" dark>
          {{ getText(item, 'asignado') }}
        </v-chip>
      </template>

      <template v-slot:item.usuario="{ item }">
        <v-chip :color="getColor(item, 'usuario')" dark>
          {{ getText(item, 'usuario') }}
        </v-chip>

        <v-tooltip bottom v-if="item.usuario">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="info--text ml-2"
              v-on="on"
              v-bind="attrs"
              @click="seeUser(item.usuario)"
            >
              fa-eye
            </v-icon>
          </template>
          <span> Ver Usuario asignado</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline"> ¿Está seguro de borrar este Representante?</span>
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

    <v-dialog v-model="dialogUnassign" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline"> ¿Está seguro quitar este Usuario asignado?</span>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="closeUser">Cancelar</v-btn></v-col
              >
              <v-col cols="6" class="d-flex justify-space-around pa-0"
                ><v-btn text @click="unassignConfirm">Continuar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent max-width="500" v-model="dialogUser">
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Usuario asignado a {{ usuario.nombre }}</span>
        </v-card-title>
        <v-container>
          <v-container>
            <h3>Avatar</h3>
            <div class="text-center">
              <v-avatar size="200" :tile="!usuario.avatar">
                <v-img :src="usuario.avatar || '/image-gallery.svg'">
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-avatar>
            </div>

            <h3 class="pt-2 pb-1">Nombre</h3>
            <v-text-field
              filled
              rounded
              dense
              disabled
              v-model="usuario.nombre"
            ></v-text-field>

            <h3 class="pb-1">Apellido</h3>
            <v-text-field
              filled
              rounded
              dense
              disabled
              v-model="usuario.apellido"
            ></v-text-field>

            <h3 class="pb-1">Correo</h3>
            <v-text-field
              disabled
              filled
              rounded
              dense
              v-model="usuario.email"
            ></v-text-field>
            <h3 class="pb-1">Rol</h3>
            <span class="font-weight-bold pl-2">Representante</span>
          </v-container>
        </v-container>
        <v-card-actions>
          <v-container>
            <v-btn text block @click="closeUser">Cerrar</v-btn>
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
  props: ['texto', 'activator'],
  data() {
    return {
      loading: true,
      asign: false,
      sheet: false,
      dialogUser: false,
      dialog: false,
      dialogDelete: false,
      problem: false,
      dialogUnassign: false,
      messageUnassign: false,
      message: '',
      editedIndex: -1,
      emailRules: [
        v => !!v || 'Correo es necesario',
        v => /.+@.+\..+/.test(v) || 'El correo tiene que ser válido'
      ],
      fieldRules: [
        v => !!v || 'Campo necesario',
        v => (v && v.length >= 3) || 'Debe tener mas de 3 letras'
      ],
      numberRules: [
        v => !!v || 'Campo necesario',
        v => Number.isInteger(parseInt(v)) || 'Solo se permiten números',
        v => (v && v.length === 10) || 'Debe tener 10 números'
      ],
      headers: [
        {
          text: 'Nombre',
          value: 'nombre',
          align: 'start'
        },
        {
          text: 'Apellido',
          value: 'apellido'
        },
        {
          text: 'Correo',
          value: 'email'
        },
        {
          text: 'Cédula',
          value: 'cedula'
        },
        {
          text: 'Teléfono',
          value: 'telefono'
        },
        {
          text: 'Direccion',
          value: 'direccion',
          sortable: false
        },
        {
          text: 'Establecimiento',
          value: 'asignado'
        },
        {
          text: 'Usuario',
          value: 'usuario',
          align: 'center'
        },
        {
          text: 'Estado',
          value: 'estado',
          align: 'center',
          sortable: false
        },
        {
          text: 'Acciones',
          value: 'actions',
          align: 'center',
          sortable: false
        }
      ],
      representants: [],
      establishments: [],
      users: [],
      usuario: {
        _id: '',
        nombre: '',
        apellido: '',
        avatar: '',
        rol: '',
        email: ''
      },
      usuarioDefault: {
        _id: '',
        nombre: '',
        apellido: '',
        avatar: '',
        rol: '',
        email: ''
      },
      editedItem: {},
      defaultItem: {}
    }
  },

  methods: {
    getColor(item, detail) {
      if (detail === 'estado') {
        return 'success'
      } else {
        if (detail === 'asignado') {
          return item.asignado ? 'success' : 'edit'
        } else {
          return item.usuario ? 'success' : 'error'
        }
      }
    },

    getText(item, detail) {
      if (detail === 'estado') {
        return 'Activo'
      } else {
        if (detail === 'asignado') {
          var establecimiento = this.establishments.filter(v => {
            if (v.representante) return v.representante._id === item._id
          })
          return item.asignado
            ? 'Asignado:' + ' ' + establecimiento[0].nombre
            : 'Sin asignar'
        } else {
          return item.usuario ? 'Asignado' : 'Sin asignar'
        }
      }
    },

    seeUser(item) {
      this.usuario = item
      this.dialogUser = true
    },

    unassignUser(item) {
      this.usuario = item
      this.dialogUnassign = true
    },

    unassignConfirm() {
      this.editedItem.usuario = null
      this.asign = true
      this.dialogUnassign = false
      this.messageUnassign = true
    },

    closeUser() {
      this.usuario = Object.assign({}, this.usuarioDefault)
      this.dialogUser = false
      this.dialogUnassign = false
    },

    asignUser(item) {
      this.editedItem.usuario = Object.assign({}, item)
      this.sheet = false
      this.asign = true
    },

    async getUsers() {
      this.loading = true
      this.users = []
      await this.$http
        .get('api/usuarios/representantes/noAsignados')
        .then(res => {
          this.loading = false
          this.users = res.data.data
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

    async getRepresentants() {
      this.loading = true
      this.representants = []
      await this.$http
        .get('api/representantes')
        .then(res => {
          this.loading = false
          this.representants = res.data.data
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

    async getEstablishments() {
      this.loading = true
      this.establishments = []
      await this.$http
        .get('api/establecimientos')
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

    editItem(item) {
      this.editedIndex = this.representants.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.representants.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      await this.removeRepresentant()
      if (!this.problem) {
        this.representants.splice(this.editedIndex, 1)
        this.getUsers()
      }
      this.closeDelete()
      this.problem = false
    },

    close() {
      this.messageUnassign = false
      this.asign = false
      this.dialog = false
      this.$refs.form.resetValidation()
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.changeRepresentant()
        if (!this.problem) {
          Object.assign(this.representants[this.editedIndex], this.editedItem)
          this.getUsers()
          this.close()
        }
      } else {
        await this.addRepresentant()
        if (!this.problem) {
          this.representants.push(this.editedItem)
          this.getUsers()
          this.close()
        }
      }
      this.problem = false
    },

    async addRepresentant() {
      this.loading = true
      swalLoading('Ingresando representante')
      try {
        await this.$http.post('api/representante', this.editedItem).then(async res => {
          this.loading = false
          swalConfirm('Representante nuevo ingresado')
          this.problem = false
          if (this.asign) {
            this.loading = true
            try {
              let usuarioID = this.editedItem.usuario
              this.editedItem = res.data.data
              await this.$http
                .put(`api/representante/asignar/${this.editedItem._id}`, {
                  usuario: usuarioID._id
                })
                .then(res => {
                  swalConfirm('Usuario asignado')
                  this.editedItem.usuario = res.data.data
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
          } else {
            this.editedItem = res.data.data
          }
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
    },

    async removeRepresentant() {
      this.loading = true
      swalLoading('Eliminando representante')
      try {
        await this.$http.delete(`api/representante/${this.editedItem._id}`).then(() => {
          this.loading = false
          swalConfirm('Representante Eliminado')
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

    async changeRepresentant() {
      this.loading = true
      swalLoading('Editando representante')
      try {
        await this.$http
          .put(`api/representante/${this.editedItem._id}`, this.editedItem)
          .then(async () => {
            this.loading = false
            swalConfirm('Representante editado')
            this.problem = false
            if (this.asign) {
              if (this.editedItem.usuario) {
                swalLoading('Asignando usuario')
                try {
                  await this.$http
                    .put(`api/representante/asignar/${this.editedItem._id}`, {
                      usuario: this.editedItem.usuario._id
                    })
                    .then(res => {
                      this.loading = false
                      swalConfirm('Usuario Asignado')
                      this.editedItem.usuario = res.data.data
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
              } else {
                swalLoading('Quitando usuario')
                try {
                  await this.$http
                    .delete(`api/representante/desasignar/${this.editedItem._id}`)
                    .then(() => {
                      this.loading = false
                      swalConfirm('Usuario quitado')
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
            }
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
    ...mapState(['user']),
    formTitle() {
      return this.editedIndex === -1
        ? 'Crear un Representante'
        : 'Editar un Representante'
    }
  },

  async created() {
    await this.getUsers()
    await this.getEstablishments()
    await this.getRepresentants()
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    activator(val) {
      if (!val) {
        this.getRepresentants()
      }
    }
  }
}
</script>
