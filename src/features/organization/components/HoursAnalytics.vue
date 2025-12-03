<template>
  <v-card class="hours-analytics-card" variant="outlined" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-chart-bar</v-icon>
        <span class="text-h6 font-weight-bold">Análisis de Horas</span>
      </div>
      <v-btn-toggle
        v-model="period"
        mandatory
        variant="outlined"
        density="compact"
        size="small"
      >
        <v-btn value="week">Semana</v-btn>
        <v-btn value="month">Mes</v-btn>
        <v-btn value="year">Año</v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 300px;">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="chartData.length === 0" class="d-flex flex-column justify-center align-center" style="height: 300px;">
        <v-icon size="64" color="grey-lighten-1">mdi-chart-line-variant</v-icon>
        <p class="text-grey mt-4">No hay datos para mostrar</p>
      </div>
      <div v-else ref="chartContainer" style="height: 300px; width: 100%;"></div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  hours: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const period = ref('month');
const chartContainer = ref(null);
let chartInstance = null;

const chartData = computed(() => {
  if (!props.hours || props.hours.length === 0) return [];

  const now = new Date();
  let days = 7;
  if (period.value === 'month') days = 30;
  if (period.value === 'year') days = 365;

  const labels = [];
  const verified = [];
  const pending = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const hoursForDay = props.hours.filter(h => {
      const hDate = new Date(h.fecha);
      return hDate.toISOString().split('T')[0] === dateStr;
    });

    const verifiedHours = hoursForDay
      .filter(h => h.verificada)
      .reduce((sum, h) => sum + (parseFloat(h.horas_trabajadas) || 0), 0);
    
    const pendingHours = hoursForDay
      .filter(h => !h.verificada)
      .reduce((sum, h) => sum + (parseFloat(h.horas_trabajadas) || 0), 0);

    labels.push(period.value === 'week' 
      ? date.toLocaleDateString('es-ES', { weekday: 'short' })
      : period.value === 'month'
      ? date.getDate().toString()
      : date.toLocaleDateString('es-ES', { month: 'short' })
    );
    verified.push(verifiedHours);
    pending.push(pendingHours);
  }

  return { labels, verified, pending };
});

const initChart = async () => {
  if (!chartContainer.value) return;

  await nextTick();

  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartContainer.value);

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: ['Verificadas', 'Pendientes'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.labels,
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      name: 'Horas',
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666',
        formatter: '{value}h'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [
      {
        name: 'Verificadas',
        type: 'bar',
        stack: 'hours',
        data: chartData.value.verified,
        itemStyle: {
          color: '#4caf50'
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'Pendientes',
        type: 'bar',
        stack: 'hours',
        data: chartData.value.pending,
        itemStyle: {
          color: '#ff9800'
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };

  chartInstance.setOption(option);

  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

watch(() => props.hours, () => {
  if (chartInstance && chartData.value.labels.length > 0) {
    initChart();
  }
}, { deep: true });

watch(period, () => {
  if (chartInstance && chartData.value.labels.length > 0) {
    initChart();
  }
});

onMounted(() => {
  if (chartData.value.labels.length > 0) {
    initChart();
  }
});

onBeforeUnmount(() => {
  if (chartInstance) {
    window.removeEventListener('resize', handleResize);
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
.hours-analytics-card {
  transition: box-shadow 0.3s ease;
}

.hours-analytics-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>

