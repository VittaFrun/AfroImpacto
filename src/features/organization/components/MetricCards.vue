
<template>
  <v-row>
    <v-col cols="12" sm="6" md="3" v-for="(metric, i) in metrics" :key="i">
      <v-card class="pa-4 rounded-lg fill-height elevation-0 metric-card" hover>
        <div class="d-flex align-center mb-3">
          <v-icon size="36" :color="getMetricColor(metric.color)" class="mr-3">{{ metric.icon }}</v-icon>
          <h3 class="text-body-1 font-weight-bold">{{ metric.title }}</h3>
        </div>
        <p :class="['text-h3', 'font-weight-bold', `text-${getMetricColor(metric.color)}`]">{{ metric.value }}</p>
        <v-card-actions class="pa-0 mt-auto">
          <v-btn :color="getMetricColor(metric.color)" variant="text" class="rounded-pill px-3 text-capitalize">
            Ver Detalles
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  metrics: {
    type: Array,
    required: true,
  },
});

// Consistent color mapping for metrics
function getMetricColor(colorName) {
  const colorMap = {
    'primary': 'primary',
    'info': 'info', 
    'success': 'success',
    'warning': 'warning',
    'error': 'error'
  };
  return colorMap[colorName] || 'primary';
}
</script>

<style scoped>
.metric-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1) !important;
}
</style>
