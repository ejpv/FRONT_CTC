<template>
  <v-app id="inspire">
    <v-navigation-drawer class="pt-4" color="grey lighten-3" mini-variant permanent app>
      <v-avatar
        v-for="n in 6"
        :key="n"
        :color="`grey ${n === 1 ? 'darken' : 'lighten'}-1`"
        :size="n === 1 ? 36 : 20"
        class="d-block text-center mx-auto mb-9"
      />
    </v-navigation-drawer>

    <v-main>
      <router-view class="app-container" tag="v-container" fluid fill-height />
    </v-main>
  </v-app>
</template>

<script>
export default {
  //
}
</script>
