
<template>
  <v-card class="pa-4 rounded-lg h-100 elevation-0 project-chart-card" hover>
    <v-card-title class="text-h6 font-weight-bold d-flex align-center">
      <v-icon class="mr-2" color="primary">mdi-chart-pie</v-icon>
      Estado de Proyectos
    </v-card-title>
    <v-card-text class="d-flex justify-center align-center" style="height: 200px;">
      <div class="text-center">
        <div class="text-h3 font-weight-bold text-primary mb-2">
          {{ totalProjects }}
        </div>
        <div class="text-body-2 text-grey">Total Proyectos</div>
      </div>
    </v-card-text>
    
    <!-- Status breakdown -->
    <v-card-text class="pt-0">
      <v-row>
        <v-col cols="6" v-for="status in projectStatusData" :key="status.name">
          <div class="d-flex align-center mb-2">
            <v-sheet 
              class="w-3 h-3 rounded-circle mr-2" 
              :style="{ backgroundColor: status.color }"
            ></v-sheet>
            <span class="text-caption text-grey">{{ status.name }}</span>
          </div>
          <div class="text-body-2 font-weight-bold" :style="{ color: status.color }">
            {{ status.value }} proyectos
          </div>
          <v-progress-linear
            :model-value="getPercentage(status.value)"
            :color="status.color"
            height="4"
            rounded
            class="mt-1"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  projectStatusData: {
    type: Array,
    required: true,
  },
  sparklineGradient: {
    type: Array,
    required: true,
  },
});

// Computed properties
const totalProjects = computed(() => {
  return props.projectStatusData.reduce((sum, status) => sum + status.value, 0);
});

// Helper function to calculate percentage
function getPercentage(value) {
  if (totalProjects.value === 0) return 0;
  return (value / totalProjects.value) * 100;
}
</script>

<style scoped>
.project-chart-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.project-chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1) !important;
}
</style>
