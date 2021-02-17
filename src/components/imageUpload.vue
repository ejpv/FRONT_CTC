<template>
  <div>
    <v-avatar :size="size" :tile="!src">
      <v-img :src="src || '/image-gallery.svg'" contain>
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
    <v-file-input
      style="margin-top: -40px; margin-left: 75%;"
      @change="selected"
      prepend-icon="fa-camera secondary--text"
      accept="image/png, image/jpeg"
      hide-input
      :disabled="disabled"
    />
  </div>
</template>

<script>
export default {
  props: ['src', 'size', 'endpoint', 'disabled'],
  data() {
    return {}
  },
  methods: {
    selected: async function(file) {
      if (!this.endpoint) throw new Error('Endpoint null.')
      if (file) {
        var formData = new FormData()
        formData.append('avatar', file)

        const res = await this.$http.post(this.endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const data = await res.json()
        console.log(data)
        this.$emit('onUpload', data.url)
      }
    }
  }
}
</script>
