<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="establishments"
      class="elevation-1"
      :loading="loading"
      :search="this.texto"
      loading-text="Obteniendo todos los Establecimientos..."
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-container>
            <v-row>
              <v-col align="start" cols="3" sm="2"> </v-col>
              <v-col align="end" cols="0" sm="10">
                <v-btn color="new" class="mb-2" medium disabled>
                  Nuevo Establecimiento
                  <v-icon right>fa-store-alt</v-icon>
                </v-btn>
                <v-btn color="info" class="mb-2 ml-2" medium icon>
                  <v-icon medium @click="getEstablishments()">fa-sync-alt</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-toolbar>
      </template>

      <template v-slot:item.representante="{ item }">
        <div v-if="item.representante">
          <v-chip color="success" dark>
            Asignado: {{ item.representante.nombre }}
          </v-chip>
        </div>
        <div v-else>
          <v-chip color="warning" dark> Sin Asignar </v-chip>
        </div>
      </template>

      <template v-slot:item.areaProtegida="{ item }">
        <div v-if="item.areaProtegida">
          <v-chip color="success" dark>
            Asignado: {{ item.areaProtegida.nombre }}
          </v-chip>
        </div>
        <div v-else>
          <v-chip color="warning" dark> Sin Asignar </v-chip>
        </div>
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
          <span> Restaurar un Establecimiento </span>
        </v-tooltip>
      </template>

      <template v-slot:item.lugar="{ item }">
        <v-chip :color="placeColor(item)" dark> {{ placeTitle(item) }} </v-chip>
      </template>

      <template v-slot:item.servicios="{ item }">
        <v-chip :color="serviceColor(item)" dark> {{ serviceTitle(item) }} </v-chip>
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
                <span class="headline"> ¿Está seguro de restaurar este Lugar?</span>
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
      establishments: [],
      headers: [
        {
          text: 'Nombre',
          value: 'nombre',
          align: 'start'
        },
        {
          text: 'Administrador',
          value: 'administrador'
        },
        {
          text: 'Representante',
          value: 'representante',
          align: 'center'
        },
        {
          text: 'Correo',
          value: 'email'
        },
        {
          text: 'Nacionalidad / Pueblo',
          value: 'nacionalidad',
          align: 'center'
        },
        {
          text: 'Registro',
          value: 'registro'
        },
        {
          text: 'LUAF',
          value: 'LUAF'
        },
        {
          text: 'Página web',
          value: 'web',
          align: 'center'
        },
        {
          text: 'Teléfono',
          value: 'telefono'
        },
        {
          text: 'Lugar',
          value: 'lugar',
          align: 'center',
          sortable: false
        },
        {
          text: 'Servicios Básicos',
          value: 'servicios',
          align: 'center',
          sortable: false
        },
        {
          text: 'Área Protegida',
          value: 'areaProtegida',
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
      dialogRestore: false,
      problem: false,
      editedIndex: -1,
      editedItem: {
        _id: '',
        nombre: '',
        administrador: '',
        representante: { nombre: '' },
        nacionalidad: '',
        registro: '',
        LUAF: 'No',
        email: '',
        web: '',
        telefono: [''],
        comunidad: '',
        ciudad: '',
        parroquia: '',
        canton: 'Riobamba',
        provincia: 'Chimborazo',
        lat: 0,
        lng: 0,
        agua: '',
        saneamiento: '',
        energia: '',
        desechos: '',
        personal: 0,
        areaProtegida: {},
        estado: false
      },
      defaultItem: {
        _id: '',
        nombre: '',
        administrador: '',
        representante: { nombre: '' },
        nacionalidad: '',
        registro: '',
        LUAF: 'No',
        email: '',
        web: '',
        telefono: [''],
        comunidad: '',
        ciudad: '',
        parroquia: '',
        canton: 'Riobamba',
        provincia: 'Chimborazo',
        lat: 0,
        lng: 0,
        agua: '',
        saneamiento: '',
        energia: '',
        desechos: '',
        personal: 0,
        areaProtegida: {},
        estado: false
      }
    }
  },
  methods: {
    async getEstablishments() {
      this.loading = true
      this.establishments = []
      await this.$http
        .get('/api/establecimientos?estado=false')
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

    restoreItem(item) {
      this.editedIndex = this.establishments.indexOf(item)
      this.editedItem = item
      this.dialogRestore = true
    },

    async restoreItemConfirm() {
      await this.restoreEstablishment()
      if (!this.problem) {
        this.establishments.splice(this.editedIndex, 1)
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

    async restoreEstablishment() {
      this.loading = true
      swalLoading('Restaurando establecimiento')
      try {
        await this.$http
          .put(`/api/establecimiento/${this.editedItem._id}/restaurar`)
          .then(() => {
            this.loading = false
            swalConfirm('Establecimiento restaurado')
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

    serviceTitle(item) {
      return item.agua && item.saneamiento && item.desechos && item.energia
        ? 'Completo'
        : item.agua || item.saneamiento || item.desechos || item.energia
        ? 'Incompleto'
        : 'Sin Información'
    },

    serviceColor(item) {
      return item.agua && item.saneamiento && item.desechos && item.energia
        ? 'success'
        : item.agua || item.saneamiento || item.desechos || item.energia
        ? 'edit'
        : 'error'
    },

    placeTitle(item) {
      return item.parroquia && item.ciudad && item.canton && item.provincia
        ? 'Completo'
        : item.parroquia && item.ciudad && item.canton && item.provincia
        ? 'Incompleto'
        : 'Sin Información'
    },

    placeColor(item) {
      return item.parroquia && item.ciudad && item.canton && item.provincia
        ? 'success'
        : item.parroquia && item.ciudad && item.canton && item.provincia
        ? 'edit'
        : 'error'
    }
  },

  watch: {
    dialogRestore(val) {
      val || this.closeRestore()
    },
    activator(val) {
      if (val) this.getEstablishments()
    }
  }
}
</script>
