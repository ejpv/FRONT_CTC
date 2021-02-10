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
                <v-btn color="new" class="mb-2" medium disabled>
                  Nuevo Usuario
                  <v-icon right>fa-user-plus</v-icon>
                </v-btn>

                <v-btn color="info" class="mb-2 ml-4" medium icon>
                  <v-icon medium @click="getUsers()">fa-sync-alt</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-dialog v-model="dialogRestore" max-width="450px">
            <v-card>
              <div class="text-center primary pt-6">
                <v-icon dark large> fa-exclamation-triangle </v-icon>
              </div>
              <v-card-title class="primary pa-2 white--text justify-center">
                <span class="headline"> ¿Está seguro de restaurar este Usuario?</span>
              </v-card-title>
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
        </v-toolbar>
      </template>

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
          <span> Restaurar un Usuario </span>
        </v-tooltip>
      </template>

      <template v-slot:item.activado="{ item }">
        <v-chip :color="getColor(item)" dark :class="getText(item, 'activado')">
          {{ getText(item, 'activado') }}
        </v-chip>
      </template>

      <template v-slot:item.estado>
        <v-chip color="error" dark> Borrado </v-chip>
      </template>

      <template v-slot:item.rol="{ item }">
        <p class="font-weight-black">{{ getText(item, 'rol') }}</p>
      </template>
    </v-data-table>

    <div class="text-center">
      <v-snackbar v-model="snackbar" color="error" :timeout="-1">
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false"> Cerrar </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
export default {
  props: ['texto', 'activator'],
  data() {
    return {
      loading: true,
      snackbar: false,
      message: '',
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
          value: 'rol'
        },
        {
          text: 'Estado del correo',
          value: 'activado',
          sortable: false
        },
        {
          text: 'Estado de cuenta',
          value: 'estado',
          sortable: false
        },
        {
          text: 'Acciones',
          value: 'actions',
          sortable: false
        }
      ],
      dialogRestore: false,
      problem: false,
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
      }
    }
  },
  methods: {
    getColor(item) {
      return item.activado ? 'info' : 'warning'
    },

    getText(item, detail) {
      if (detail === 'activado') {
        return item.activado ? 'Verificado' : 'Aún sin verificar'
      } else {
        return item.rol == 'ADMIN_ROLE'
          ? 'Administrador'
          : item.rol == 'TECHNICAL_ROLE'
          ? 'Técnico'
          : 'Representante'
      }
    },

    async getUsers() {
      this.snackbar = false
      this.loading = true
      this.users = []
      await this.$http
        .get('/api/usuarios?estado=false')
        .then(res => {
          this.loading = false
          this.users = res.data.data
        })
        .catch(error => {
          this.loading = false
          this.message =
            error.body.err != undefined
              ? error.body.err.message
              : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
          this.snackbar = true
        })
    },

    restoreItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = item
      this.dialogRestore = true
    },

    async restoreItemConfirm() {
      await this.restoreUser()
      if (!this.problem) {
        this.users.splice(this.editedIndex, 1)
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

    async restoreUser() {
      this.snackbar = false
      this.loading = true
      try {
        await this.$http.put(`/api/usuario/${this.editedItem._id}/restaurar`).then(() => {
          this.loading = false
          this.$swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'success',
            title: 'Usuario restaurado'
          })
        })
        this.problem = false
      } catch (error) {
        this.loading = false
        this.message =
          error.body.err != undefined
            ? error.body.err.message
            : 'Ha ocurrido un error, por favor inténtelo de nuevo más tarde'
        this.snackbar = true
        this.problem = true
      }
    }
  },
  watch: {
    dialogRestore(val) {
      val || this.closeRestore()
    },
    activator(val) {
      if (val) {
        this.getUsers()
      }
    }
  }
}
</script>
