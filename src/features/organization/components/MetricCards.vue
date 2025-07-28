
<template>
  <v-row>
    <v-col cols="12" sm="6" md="3" v-for="(metric, i) in metrics" :key="i">
      <v-card class="pa-4 rounded-lg fill-height elevation-0">
        <div class="d-flex align-center mb-3">
          <v-icon size="36" :color="metric.color" class="mr-3">{{ metric.icon }}</v-icon>
          <h3 class="text-body-1 font-weight-bold">{{ metric.title }}</h3>
        </div>
        <p :class="['text-h3', 'font-weight-bold', `text-${metric.color}`]">{{ metric.value }}</p>
        <v-card-actions class="pa-0 mt-auto">
          <v-btn :color="metric.color" variant="text" class="rounded-pill px-3 text-capitalize">Ver Detalles</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  metrics: {
    type: Array,
    required: true,
  },
});
</script>


