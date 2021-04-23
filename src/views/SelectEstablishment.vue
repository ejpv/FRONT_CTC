<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title class="primary white--text">
          <span class="headline">Seleccione un Establecimiento</span>
        </v-card-title>
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
          >
          </v-autocomplete>
        </v-container>
        <v-card-actions>
          <v-container>
            <v-btn text block @click="passHome()" :disabled="disableBtn">
              Siguiente
            </v-btn>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { swalError } from '@/utils/notify'

export default {
  data() {
    return {
      establishments: {},
      editedEstablishment: { _id: '', nombre: '' },
      loading: false
    }
  },

  methods: {
    ...mapActions(['prepareEnvironment']),

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

    async middlewareEstablishment() {
      if (this.editedEstablishment) {
        sessionStorage.setItem('establishment', JSON.stringify(this.editedEstablishment))
        await this.prepareEnvironment()
      }
    },

    async passHome() {
      await this.middlewareEstablishment()
      this.$router.push('/')
    }
  },

  computed: {
    ...mapState(['user']),

    disableBtn() {
      return this.editedEstablishment.nombre === '' ? true : false
    }
  },

  async created() {
    if (!this.user.rol === 'TECHNICAL_ROLE') {
      if (this.user.rol === '') {
        this.$router.replace('/login')
      } else {
        this.$router.replace('/')
      }
    } else {
      await this.getEstablishments()
    }
  }
}
</script>