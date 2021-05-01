<template>
  <div>
    <v-card>
      {{ diagnostic }}
      <v-card-actions>
        <v-btn text block @click="cerrar"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ['diagnostic'],
  methods: {
    cerrar() {
      this.$emit('accion')
    }
  }
}
</script>

<style>
</style>