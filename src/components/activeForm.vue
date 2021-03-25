<template>
  <div>
    <v-container>
      <v-row v-for="item in rows" :key="item._id">
        <template v-for="n in 2">
          <v-col :key="n">
            <v-card v-if="forms[counter]">
              {{ forms[counter].nombre }}
              {{counter++}}
            </v-card>
          </v-col>
          <v-responsive v-if="n === 2" :key="`width-${n}`" width="100%"></v-responsive>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { swalError } from '@/utils/notify'
export default {
  props: ['activator'],
  data() {
    return {
      forms: [],
      loading: false,
      counter: 0
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
    }
  },
  created() {
    this.getForms()
  },
  computed: {
    rows() {
      return (this.forms.length % 2) === 1 ? (this.forms.length + 1) /2 : this.forms.length/2
    }
  },
  watch: {
    activator(val) {
      if (!val) {
        this.getForms()
      }
    }
  }
}
</script>