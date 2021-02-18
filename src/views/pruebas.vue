<template>
  <v-card class="mx-auto">
    <v-container>
      <v-card-title class="d-block text-center">
        Tabla de Representantes
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="fa-search"
          label="Busque un Representante"
          single-line
          hide-details
        ></v-text-field>
        <v-row>
          <v-col cols="7" sm="5" md="3">
            <v-switch v-model="erased" label="Representantes Borrados"></v-switch>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="representants"
        class="elevation-1"
        :loading="loading"
        :search="search"
        loading-text="Obteniendo todos los Representantes..."
      >
        <template v-slot:item.estado="{ item }">
          <v-chip :color="getColor(item, 'estado')" dark>
            {{ getText(item, 'estado') }}
          </v-chip>
        </template>
        <template v-slot:item.usuario="{ item }">
          <v-chip :color="getColor(item, 'usuario')" dark>
            {{ getText(item, 'usuario') }}
          </v-chip>
          <v-dialog persistent width="500" v-model="dialog">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="ml-2 info--text"
                v-if="item.usuario"
                v-on="on"
                v-bind="attrs"
                @click="seeUser(item)"
              >
                fa-eye
              </v-icon>
            </template>
            <v-card>
              <v-card-title class="primary white--text">
                <span class="headline">Usuario asignado a {{ item.nombre }}</span>
              </v-card-title>
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
                Representante
              </v-container>
              <v-card-actions>
                <v-container>
                  <v-btn text block @click="close">Cerrar</v-btn>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
    </v-container>
    <div class="text-center">
      <v-snackbar v-model="snackbar" color="error" :timeout="-1">
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false"> Cerrar </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      erased: false,
      search: '',
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
          text: 'Usuario',
          value: 'usuario',
          sortable: false
        },
        {
          text: 'Estado',
          value: 'estado',
          sortable: false
        },
        {
          text: 'Acciones',
          value: 'actions',
          sortable: false
        }
      ],
      representants: [],
      usuario: {},
      loading: false,
      snackbar: false,
      message: '',
      dialog: false
    }
  },
  methods: {
    async getRepresentants() {
      this.snackbar = false
      this.loading = true
      this.representants = []
      await this.$http
        .get('/api/representantes')
        .then(res => {
          this.loading = false
          this.representants = res.data.data
          console.log(this.representants)
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

    getColor(item, detail) {
      if (detail === 'estado') {
        return 'success'
      } else {
        return item.usuario ? 'success' : 'error'
      }
    },

    getText(item, detail) {
      if (detail === 'estado') {
        return 'Activo'
      } else {
        return item.usuario ? 'Asignado' : 'Sin asignar'
      }
    },

    seeUser(item) {
      this.usuario = item.usuario
    },

    close() {
      this.usuario = {}
      this.dialog = !this.dialog
    }
  },
  created() {
    this.getRepresentants()
  },
  computed: {}
}
</script>