<template>
  <div class="hours-trend-chart">
    <div v-if="loading" class="chart-loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      ></v-progress-circular>
      <p class="text-body-2 mt-2">Cargando datos...</p>
    </div>
    
    <div v-else-if="!hasData" class="chart-empty">
      <v-icon size="48" color="grey-lighten-1">mdi-chart-line-variant</v-icon>
      <p class="text-body-2 text-grey-darken-1 mt-2">No hay datos disponibles</p>
    </div>
    
    <div v-else class="chart-container">
      <!-- Chart Header -->
      <div class="chart-header mb-4">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h4 class="text-h6 font-weight-medium">Distribución de Horas</h4>
            <p class="text-body-2 text-grey-darken-1">
              Total: {{ formatHours(totalHours) }} horas
            </p>
          </div>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                size="small"
                v-bind="props"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item @click="exportChart">
                <v-list-item-title>Exportar Gráfico</v-list-item-title>
              </v-list-item>
              <v-list-item @click="refreshData">
                <v-list-item-title>Actualizar Datos</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <!-- Doughnut Chart -->
      <div class="chart-wrapper">
        <canvas ref="chartCanvas" :width="chartWidth" :height="chartHeight"></canvas>
      </div>

      <!-- Legend -->
      <div class="chart-legend mt-4">
        <div class="legend-grid">
          <div
            v-for="(item, index) in legendItems"
            :key="index"
            class="legend-item"
          >
            <div
              class="legend-color"
              :style="{ backgroundColor: item.color }"
            ></div>
            <div class="legend-content">
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ formatHours(item.value) }}h</span>
              <span class="legend-percentage">({{ item.percentage }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const props = defineProps({
  data: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 300
  }
});

const emit = defineEmits(['refresh', 'export']);

// Refs
const chartCanvas = ref(null);
const chartInstance = ref(null);

// Computed properties
const hasData = computed(() => {
  return props.data && props.data.datasets && props.data.datasets[0]?.data?.length > 0;
});

const totalHours = computed(() => {
  if (!hasData.value) return 0;
  return props.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
});

const chartWidth = computed(() => 400);
const chartHeight = computed(() => props.height);

const legendItems = computed(() => {
  if (!hasData.value) return [];
  
  const dataset = props.data.datasets[0];
  const total = totalHours.value;
  
  return props.data.labels.map((label, index) => ({
    label,
    value: dataset.data[index],
    percentage: total > 0 ? Math.round((dataset.data[index] / total) * 100) : 0,
    color: dataset.backgroundColor[index]
  }));
});

// Methods
const formatHours = (hours) => {
  if (hours >= 1000) {
    return `${(hours / 1000).toFixed(1)}k`;
  }
  return Math.round(hours * 100) / 100;
};

const createChart = async () => {
  if (!chartCanvas.value || !hasData.value) return;

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  await nextTick();

  const ctx = chartCanvas.value.getContext('2d');
  
  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: props.data.labels,
      datasets: [{
        data: props.data.datasets[0].data,
        backgroundColor: props.data.datasets[0].backgroundColor,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // We'll use custom legend
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${formatHours(value)}h (${percentage}%)`;
            }
          }
        }
      },
      cutout: '60%',
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: 'easeOutCubic'
      },
      interaction: {
        intersect: false
      }
    }
  });
};

const exportChart = () => {
  if (chartInstance.value) {
    const url = chartInstance.value.toBase64Image();
    const link = document.createElement('a');
    link.download = 'hours-trend-chart.png';
    link.href = url;
    link.click();
  }
  emit('export');
};

const refreshData = () => {
  emit('refresh');
};

// Watchers
watch(() => props.data, () => {
  if (hasData.value) {
    createChart();
  }
}, { deep: true });

watch(() => props.loading, (newLoading) => {
  if (!newLoading && hasData.value) {
    nextTick(() => {
      createChart();
    });
  }
});

// Lifecycle
onMounted(() => {
  if (hasData.value) {
    createChart();
  }
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});
</script>

<style scoped>
.hours-trend-chart {
  width: 100%;
  height: 100%;
}

.chart-loading,
.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: rgba(0, 0, 0, 0.6);
}

.chart-container {
  width: 100%;
}

.chart-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.chart-wrapper {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-legend {
  margin-top: 24px;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.legend-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
}

.legend-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.legend-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.875rem;
}

.legend-value {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
}

.legend-percentage {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>
