<template>
  <div class="project-status-chart">
    <div v-if="loading" class="chart-loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      ></v-progress-circular>
      <p class="text-body-2 mt-2">Cargando...</p>
    </div>
    
    <div v-else-if="!hasData" class="chart-empty">
      <v-icon size="48" color="grey-lighten-1">mdi-chart-donut</v-icon>
      <p class="text-body-2 text-grey-darken-1 mt-2">No hay proyectos</p>
    </div>
    
    <div v-else class="chart-container">
      <!-- Chart -->
      <div class="chart-wrapper">
        <canvas ref="chartCanvas" width="250" height="250"></canvas>
        
        <!-- Center Text -->
        <div class="chart-center-text">
          <div class="center-number">{{ totalProjects }}</div>
          <div class="center-label">Proyectos</div>
        </div>
      </div>

      <!-- Status List -->
      <div class="status-list mt-4">
        <div
          v-for="(item, index) in statusItems"
          :key="index"
          class="status-item"
        >
          <div class="status-indicator">
            <div
              class="status-dot"
              :style="{ backgroundColor: item.color }"
            ></div>
            <span class="status-label">{{ item.label }}</span>
          </div>
          <div class="status-values">
            <span class="status-count">{{ item.value }}</span>
            <span class="status-percentage">({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  data: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Refs
const chartCanvas = ref(null);
const chartInstance = ref(null);

// Computed properties
const hasData = computed(() => {
  return props.data && props.data.datasets && props.data.datasets[0]?.data?.length > 0;
});

const totalProjects = computed(() => {
  if (!hasData.value) return 0;
  return props.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
});

const statusItems = computed(() => {
  if (!hasData.value) return [];
  
  const dataset = props.data.datasets[0];
  const total = totalProjects.value;
  
  return props.data.labels.map((label, index) => ({
    label,
    value: dataset.data[index],
    percentage: total > 0 ? Math.round((dataset.data[index] / total) * 100) : 0,
    color: dataset.backgroundColor[index]
  }));
});

// Methods
const createChart = async () => {
  if (!chartCanvas.value || !hasData.value) return;

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
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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
              return `${label}: ${value} proyectos (${percentage}%)`;
            }
          }
        }
      },
      cutout: '70%',
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
.project-status-chart {
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

.chart-wrapper {
  position: relative;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-number {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1;
}

.center-label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  margin-top: 4px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
}

.status-values {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

.status-percentage {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>
