
<template>
  <v-card class="pa-4 rounded-lg h-100 elevation-0">
    <v-card-title class="text-h6 font-weight-bold">Estado de Proyectos</v-card-title>
    <v-card-text class="d-flex justify-center align-center" style="height: 200px;">
      <v-sparkline
        :model-value="projectStatusData"
        :gradient="sparklineGradient"
        :smooth="10"
        :padding="8"
        :line-width="3"
        stroke-linecap="round"
        :fill="true"
        auto-draw
        height="150"
        color="primary"
      ></v-sparkline>
    </v-card-text>
    <div class="d-flex justify-center mt-2 text-body-2 text-grey-darken-1">
      <div class="mx-2 d-flex align-center">
        <v-sheet class="w-3 h-3 rounded-circle bg-green-lighten-2 mr-1"></v-sheet> Activos: 0%
      </div>
      <div class="mx-2 d-flex align-center">
        <v-sheet class="w-3 h-3 rounded-circle bg-blue-lighten-2 mr-1"></v-sheet> Completados: 0%
      </div>
      <div class="mx-2 d-flex align-center">
        <v-sheet class="w-3 h-3 rounded-circle bg-orange-lighten-2 mr-1"></v-sheet> Pendientes: 0%
      </div>
    </div>
  </v-card>
</template>

<script setup>


defineProps({
  projectStatusData: {
    type: Array,
    required: true,
  },
  sparklineGradient: {
    type: Array,
    required: true,
  },
});
</script>


