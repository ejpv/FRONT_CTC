<template>
  <div>
    <v-tabs
      show-arrows
      v-model="tabs"
      next-icon="fa-angle-right"
      prev-icon="fa-angle-left"
      fixed-tabs
    >
      <v-tab>Calificar informes</v-tab>
      <v-tab>Informes aprobados</v-tab>
      <v-tab>Informes rechazados</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-container>
          <approveReport :activator="tabs" />
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <approvedInform :activator="tabs" />
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <rejectedInform :activator="tabs" />
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: null
    }
  }
}
</script>
