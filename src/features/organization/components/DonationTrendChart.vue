
<template>
  <v-card class="pa-4 rounded-lg h-100 elevation-0 donation-chart-card" hover>
    <v-card-title class="text-h6 font-weight-bold d-flex align-center">
      <v-icon class="mr-2" color="success">mdi-chart-line</v-icon>
      Tendencia de Donaciones
    </v-card-title>
    <v-card-text class="d-flex justify-center align-center" style="height: 200px;">
      <v-sparkline
        :model-value="chartData"
        :gradient="gradient"
        :smooth="10"
        :padding="8"
        :line-width="3"
        stroke-linecap="round"
        :fill="true"
        auto-draw
        height="150"
        color="success"
      ></v-sparkline>
    </v-card-text>
    <div class="d-flex justify-center mt-2 text-body-2 text-grey-darken-1">
      <span class="mr-4">Últimos 6 meses</span>
      <span>Total: {{ formatCurrency(totalAmount) }}</span>
    </div>
    
    <!-- Monthly breakdown -->
    <v-card-text class="pt-0">
      <v-row>
        <v-col cols="6" v-for="(month, index) in monthlyData" :key="index">
          <div class="text-caption text-grey">{{ month.month }}</div>
          <div class="text-body-2 font-weight-bold text-success">
            {{ formatCurrency(month.amount) }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  donationTrendData: {
    type: Array,
    required: true,
  },
});

// Gradient colors matching the theme
const gradient = ['#00b894', '#27ae60', '#2ecc71'];

// Computed properties
const chartData = computed(() => {
  return props.donationTrendData.map(item => item.amount);
});

const totalAmount = computed(() => {
  return props.donationTrendData.reduce((sum, item) => sum + item.amount, 0);
});

const monthlyData = computed(() => {
  return props.donationTrendData.slice(-6); // Last 6 months
});

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
</script>

<style scoped>
.donation-chart-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.donation-chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1) !important;
}
</style>
