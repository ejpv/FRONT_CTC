<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todos los Usuarios..."
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
                      Nuevo Usuario
                      <v-icon right>fa-users</v-icon>
                    </v-btn>
                    <v-btn color="info" class="mb-2 ml-4" medium icon>
                      <v-icon medium @click="getUsers()">fa-sync-alt</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="primary white--text">
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-form ref="form">
                          <h3>Avatar</h3>
                          <div class="text-center">
                            <v-avatar size="200" :tile="!editedItem.avatar">
                              <v-img :src="editedItem.avatar || '/image-gallery.svg'">
                                <template v-slot:placeholder>
                                  <v-row
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                  >
                                    <v-progress-circular
                                      indeterminate
                                      color="grey lighten-5"
                                    ></v-progress-circular>
                                  </v-row>
                                </template>
                              </v-img>
                            </v-avatar>
                          </div>

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
                            <strong class="error--text">*</strong> Correo
                          </h3>
                          <v-text-field
                            v-model="editedItem.email"
                            filled
                            rounded
                            dense
                            :rules="emailRules"
                          ></v-text-field>
                          <h3 class="pb-1"><strong class="error--text">*</strong> Rol</h3>
                          <v-radio-group v-model="editedItem.rol" class="ma-0">
                            <v-radio :value="roles.admin" label="Administrador">
                            </v-radio>
                            <v-radio :value="roles.representant" label="Representante">
                            </v-radio>
                            <v-radio :value="roles.technical" label="Técnico"> </v-radio>
                          </v-radio-group>
                          <v-checkbox
                            v-if="editedIndex === -1"
                            v-model="sendMail"
                            label="Enviar email al correo para verificación."
                          ></v-checkbox>
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
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-container class="primary">
                <v-row text-centerd>
                  <v-col cols="12" class="text-center">
                    <v-icon dark large> fa-exclamation-triangle </v-icon>
                  </v-col>
                  <v-col cols="12" class="white--text justify-center">
                    <div class="text-center primary">
                      <span class="headline"> ¿Está seguro de borrar este Usuario?</span>
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
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom v-if="user._id != item._id">
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
          <span> Editar un Usuario </span>
        </v-tooltip>
        <v-tooltip bottom v-if="user._id != item._id">
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
          <span> Eliminar un Usuario </span>
        </v-tooltip>
        <h3 v-if="user._id === item._id" class="primary--text">Este eres tú</h3>
      </template>
      <template v-slot:item.activado="{ item }">
        <v-chip
          :color="getColor(item, 'activado')"
          dark
          :class="getText(item, 'activado') === 'Verificado' ? 'ml-4' : ''"
        >
          {{ getText(item, 'activado') }}
        </v-chip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="ml-2 blue--text"
              v-on="on"
              v-bind="attrs"
              v-if="!item.activado"
              @click="sendMailtoEmail(item)"
            >
              fa-envelope
            </v-icon>
          </template>
          <span> Enviar correo para verificación </span>
        </v-tooltip>
      </template>
      <template v-slot:item.estado="{ item }">
        <v-chip :color="getColor(item, 'estado')" dark>
          {{ getText(item, 'estado') }}
        </v-chip>
      </template>
      <template v-slot:item.rol="{ item }">
        <p class="font-weight-black">{{ getText(item, 'rol') }}</p>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { swalError, swalConfirm, swalLoading } from '@/utils/notify'
import { mapState } from 'vuex'
export default {
  props: ['texto', 'activator'],
  data() {
    return {
      roles: {
        admin: 'ADMIN_ROLE',
        representant: 'REPRESENTANT_ROLE',
        technical: 'TECHNICAL_ROLE'
      },
      sendMail: '',
      loading: true,
      users: [],
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
          text: 'Rol',
          value: 'rol',
          align: 'center'
        },
        {
          text: 'Estado del correo',
          value: 'activado',
          align: 'center',
          sortable: false
        },
        {
          text: 'Estado de cuenta',
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
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        _id: '',
        avatar: '',
        rol: '',
        nombre: '',
        apellido: '',
        email: '',
        estado: true,
        activado: false
      },
      defaultItem: {
        _id: '',
        avatar: '',
        rol: '',
        nombre: '',
        apellido: '',
        email: '',
        estado: true,
        activado: false
      },
      new: false,
      problem: false,
      emailRules: [
        v => !!v || 'Correo es necesario',
        v => /.+@.+\..+/.test(v) || 'El correo tiene que ser válido'
      ],
      fieldRules: [
        v => !!v || 'Campo necesario',
        v => (v && v.length >= 3) || 'Debe tener mas de 3 letras'
      ]
    }
  },
  methods: {
    getColor(item, detail) {
      if (detail === 'activado') {
        return item.activado ? 'info' : 'warning'
      } else {
        return 'success'
      }
    },

    getText(item, detail) {
      if (detail === 'activado') {
        return item.activado ? 'Verificado' : 'Aún sin verificar'
      } else {
        if (detail === 'estado') {
          return 'Activo'
        } else {
          return item.rol == 'ADMIN_ROLE'
            ? 'Administrador'
            : item.rol == 'TECHNICAL_ROLE'
            ? 'Técnico'
            : 'Representante'
        }
      }
    },

    async getUsers() {
      this.loading = true
      this.users = []
      await this.$http
        .get('/api/usuarios')
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

    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = item
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      await this.removeUser()
      if (!this.problem) {
        this.users.splice(this.editedIndex, 1)
      }
      this.closeDelete()
      this.problem = false
    },

    close() {
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
        await this.changeUser()
        if (!this.problem) {
          Object.assign(this.users[this.editedIndex], this.editedItem)
        }
      } else {
        await this.addUser()
        if (!this.problem) {
          this.users.push(this.editedItem)
        }
      }
      this.problem = false
      this.close()
    },

    async addUser() {
      this.loading = true
      swalLoading('Ingresando usuario')
      try {
        await this.$http.post('/api/usuario', this.editedItem).then(async res => {
          this.loading = false
          if (this.sendMail) {
            this.editedItem = res.data.data
            this.new = true
            await this.sendMailtoEmail(this.editedItem)
          } else {
            this.editedItem = res.data.data
            swalConfirm('Usuario nuevo ingresado')
          }
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
      this.new = false
    },

    async removeUser() {
      this.loading = true
      swalLoading('Eliminando usuario')
      try {
        await this.$http.delete(`/api/usuario/${this.editedItem._id}`).then(() => {
          this.loading = false
          swalConfirm('Usuario eliminado')
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

    async changeUser() {
      this.loading = true
      swalLoading('Editando usuario')
      try {
        await this.$http
          .put(`/api/usuario/${this.editedItem._id}`, this.editedItem)
          .then(() => {
            this.loading = false
            swalConfirm('Usuario editado')
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

    async sendMailtoEmail(item) {
      this.loading = true
      swalLoading('Enviando correo')
      await this.$http
        .post('/api/email/verifica', {
          id: item._id
        })
        .then(() => {
          this.loading = false
          swalConfirm(this.getTitleToastEmail)
        })
        .catch(error => {
          this.$swal.close()
          this.loading = false
          swalError(
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          )
        })
    }
  },
  computed: {
    ...mapState(['user']),
    formTitle() {
      return this.editedIndex === -1 ? 'Crear un Usuario' : 'Editar un Usuario'
    },
    getTitleToastEmail() {
      return this.new ? 'Usuario ingresado y Correo enviado' : 'Correo enviado'
    }
  },
  async created() {
    await this.getUsers()
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
        this.getUsers()
      }
    }
  }
}
</script>
