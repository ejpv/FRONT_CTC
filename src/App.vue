<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  watch: {
    '$route.name'(v) {
      document.title = 'SPT - ' + v
    }
  }
}
</script>
