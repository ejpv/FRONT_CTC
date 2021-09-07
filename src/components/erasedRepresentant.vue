<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="representants"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todos los representantes..."
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col align="start" cols="3" sm="2"> </v-col>
              <v-col align="end" cols="0" sm="10">
                <v-btn color="new" class="mb-2" medium disabled>
                  Nuevo representante
                  <v-icon right>fa-user-tag</v-icon>
                </v-btn>
                <v-btn color="info" class="mb-2 ml-4" medium icon>
                  <v-icon medium @click="getRepresentants()">fa-sync-alt</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
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
          <span> Restaurar un representante </span>
        </v-tooltip>
      </template>

      <template v-slot:item.asignado="{ item }">
        <v-chip :color="item.asignado ? 'success' : 'edit'" dark>
          {{ getText(item) }}
        </v-chip>
      </template>

      <template v-slot:item.estado>
        <v-chip color="error" dark> Borrado </v-chip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogRestore" max-width="500px">
      <v-card>
        <v-container class="primary">
          <v-row text-centerd>
            <v-col cols="12" class="text-center">
              <v-icon dark large> fa-exclamation-triangle </v-icon>
            </v-col>
            <v-col cols="12" class="white--text justify-center">
              <div class="text-center primary">
                <span class="headline">
                  ¿Está seguro de restaurar este representante?</span
                >
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
  props: ['texto', 'activator'],
  data() {
    return {
      loading: true,
      representants: [],
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
      establishments: [],
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
    async getRepresentants() {
      this.loading = true
      this.representants = []
      await this.$http
        .get('api/representantes?estado=false')
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

    restoreItem(item) {
      this.editedIndex = this.representants.indexOf(item)
      this.editedItem = item
      this.dialogRestore = true
    },

    async restoreItemConfirm() {
      await this.restoreRepresentant()
      if (!this.problem) {
        this.representants.splice(this.editedIndex, 1)
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

    async restoreRepresentant() {
      this.loading = true
      swalLoading('Restaurando representante')
      try {
        await this.$http
          .put(`api/representante/${this.editedItem._id}/restaurar`)
          .then(() => {
            this.loading = false
            swalConfirm('Representante restaurado')
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

    getText(item) {
      var establecimiento = this.establishments.filter(v => {
        if (v.representante) return v.representante._id === item._id
      })
      return item.asignado ? 'Asignado:' + ' ' + establecimiento[0].nombre : 'Sin asignar'
    }
  },
  watch: {
    dialogRestore(val) {
      val || this.closeRestore()
    },
    activator(val) {
      if (val) {
        this.getEstablishments()
        this.getRepresentants()
      }
    }
  }
}
</script>
