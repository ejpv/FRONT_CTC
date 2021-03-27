<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$route.params.form
    }
  },
  created() {
    if (this.form != -1) {
        console.log("obtener usuario");
    }
  }
}
</script>