<template>
  <div>
    <v-btn @click="openReport()"> ver Reporte </v-btn>
  </div>
</template>

<script>
import { Report } from '@/utils/pdfmake'

export default {
  methods: {
    async openReport() {
      await Report.openPDF()
    }
  }
}
</script>
