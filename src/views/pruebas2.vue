<template>
  <div>
    <v-card>
      <v-card-title> Titulo ejemplo </v-card-title>
      <v-card-text> </v-card-text>
    </v-card>
  </div>
</template>

<script>
//import { swalError, swalLoading, swalConfirm } from '@/utils/notify'
import { swalError } from '@/utils/notify'
export default {
  data() {
    return {
      form: {},
      editedItem: {},
      editedIndex: this.$route.params.form
    }
  },
  methods: {
    async getForm() {
      this.loading = true
      this.form = {}
      await this.$http
        .get(`/api/formulario/${this.editedIndex}`)
        .then(res => {
          this.loading = false
          this.form = res.data.data
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
  async created() {
    if (this.editedIndex != -1) {
      await this.getForm()
    }
    console.log(this.form)
  }
}
</script>