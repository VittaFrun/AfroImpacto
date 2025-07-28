
<template>
  <v-card class="pa-4 rounded-lg h-100 elevation-0">
    <v-card-title class="text-h6 font-weight-bold">Tendencia de Donaciones</v-card-title>
    <v-card-text class="d-flex justify-center align-center" style="height: 200px;">
      <v-sparkline
        :model-value="donationTrendData"
        :gradient="['#FFC107', '#FFEB3B']"
        :smooth="10"
        :padding="8"
        :line-width="3"
        stroke-linecap="round"
        :fill="true"
        auto-draw
        height="150"
        color="secondary"
      ></v-sparkline>
    </v-card-text>
      <div class="d-flex justify-center mt-2 text-body-2 text-grey-darken-1">
      <span class="mr-4">Últimos 6 meses</span>
      <span>Total: $15,300</span>
    </div>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  donationTrendData: {
    type: Array,
    required: true,
  },
});
</script>


