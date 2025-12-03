<template>
  <div class="project-comparison-chart">
    <div v-if="loading" class="chart-loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      ></v-progress-circular>
      <p class="text-body-2 mt-2">Cargando datos...</p>
    </div>
    
    <div v-else-if="!hasData" class="chart-empty">
      <v-icon size="64" color="grey-lighten-1">mdi-chart-bar</v-icon>
      <p class="text-body-2 text-grey-darken-1 mt-2">Selecciona proyectos para comparar</p>
    </div>
    
    <div v-else class="chart-container">
      <!-- Chart Header -->
      <div class="chart-header mb-4">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div>
            <h4 class="text-h6 font-weight-medium">Comparación de Proyectos</h4>
            <p class="text-caption text-grey-darken-1">
              {{ selectedProjects.length }} proyecto(s) seleccionado(s)
            </p>
          </div>
          <div class="d-flex gap-2">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
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
      </div>

      <!-- Chart Type Toggle -->
      <div class="chart-type-toggle mb-4">
        <v-btn-toggle
          v-model="chartType"
          mandatory
          variant="outlined"
          density="compact"
          size="small"
        >
          <v-btn value="bar">
            <v-icon start>mdi-chart-bar</v-icon>
            Barras
          </v-btn>
          <v-btn value="line">
            <v-icon start>mdi-chart-line</v-icon>
            Líneas
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- Metric Selector -->
      <div class="metric-selector mb-4">
        <v-select
          v-model="selectedMetric"
          :items="metricOptions"
          label="Métrica a Comparar"
          variant="outlined"
          density="compact"
          hide-details
        ></v-select>
      </div>

      <!-- Chart -->
      <div class="chart-wrapper" style="height: 400px;">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Legend -->
      <div class="chart-legend mt-4">
        <div class="legend-grid">
          <div
            v-for="(project, index) in selectedProjects"
            :key="project.id"
            class="legend-item"
          >
            <div
              class="legend-color"
              :style="{ backgroundColor: getProjectColor(index) }"
            ></div>
            <div class="legend-content">
              <span class="legend-label">{{ project.nombre || project.name }}</span>
              <span class="legend-value">{{ getProjectValue(project) }}</span>
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

Chart.register(...registerables);

const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  selectedProjects: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh', 'export', 'project-select']);

// Refs
const chartCanvas = ref(null);
const chartInstance = ref(null);
const chartType = ref('bar');
const selectedMetric = ref('horas');

// Metric options
const metricOptions = [
  { title: 'Horas Totales', value: 'horas' },
  { title: 'Progreso (%)', value: 'progreso' },
  { title: 'Voluntarios Activos', value: 'voluntarios' },
  { title: 'Tareas Completadas', value: 'tareas' },
  { title: 'Fases Completadas', value: 'fases' }
];

// Computed
const hasData = computed(() => {
  return props.selectedProjects && props.selectedProjects.length > 0;
});

const chartData = computed(() => {
  if (!hasData.value) return null;

  const labels = props.selectedProjects.map(p => p.nombre || p.name || 'Sin nombre');
  const data = props.selectedProjects.map(p => getProjectMetricValue(p, selectedMetric.value));

  return {
    labels,
    datasets: [{
      label: getMetricLabel(selectedMetric.value),
      data,
      backgroundColor: props.selectedProjects.map((_, index) => getProjectColor(index)),
      borderColor: props.selectedProjects.map((_, index) => getProjectColor(index)),
      borderWidth: 2,
      tension: chartType.value === 'line' ? 0.4 : 0
    }]
  };
});

// Methods
const getProjectColor = (index) => {
  const colors = [
    'rgba(33, 150, 243, 0.8)',   // Blue
    'rgba(76, 175, 80, 0.8)',    // Green
    'rgba(255, 152, 0, 0.8)',    // Orange
    'rgba(156, 39, 176, 0.8)',  // Purple
    'rgba(244, 67, 54, 0.8)',    // Red
    'rgba(0, 188, 212, 0.8)',    // Cyan
    'rgba(255, 87, 34, 0.8)',    // Deep Orange
    'rgba(63, 81, 181, 0.8)'     // Indigo
  ];
  return colors[index % colors.length];
};

const getMetricLabel = (metric) => {
  const labels = {
    horas: 'Horas Totales',
    progreso: 'Progreso (%)',
    voluntarios: 'Voluntarios Activos',
    tareas: 'Tareas Completadas',
    fases: 'Fases Completadas'
  };
  return labels[metric] || metric;
};

const getProjectMetricValue = (project, metric) => {
  switch (metric) {
    case 'horas':
      // Calcular horas totales del proyecto
      if (project.horas_totales) return parseFloat(project.horas_totales);
      // Si no está disponible, calcular desde fases/tareas
      return 0; // Se puede mejorar obteniendo datos reales
    case 'progreso':
      // Calcular progreso del proyecto
      if (project.progreso) return parseFloat(project.progreso);
      // Calcular desde tareas
      if (project.phases) {
        const allTasks = project.phases.flatMap(p => p.tareas || []);
        if (allTasks.length === 0) return 0;
        const completed = allTasks.filter(t => t.id_estado === 3).length;
        return Math.round((completed / allTasks.length) * 100);
      }
      return 0;
    case 'voluntarios':
      // Contar voluntarios únicos
      if (project.voluntarios_count) return project.voluntarios_count;
      if (project.phases) {
        const allAssignments = project.phases.flatMap(p => 
          (p.tareas || []).flatMap(t => t.asignaciones || [])
        );
        const uniqueVolunteers = new Set(
          allAssignments.map(a => a.id_voluntario || a.voluntario?.id_voluntario)
        );
        return uniqueVolunteers.size;
      }
      return 0;
    case 'tareas':
      if (project.phases) {
        const allTasks = project.phases.flatMap(p => p.tareas || []);
        return allTasks.filter(t => t.id_estado === 3).length;
      }
      return 0;
    case 'fases':
      if (project.phases) {
        return project.phases.filter(p => {
          const tasks = p.tareas || [];
          if (tasks.length === 0) return false;
          return tasks.every(t => t.id_estado === 3);
        }).length;
      }
      return 0;
    default:
      return 0;
  }
};

const getProjectValue = (project) => {
  const value = getProjectMetricValue(project, selectedMetric.value);
  if (selectedMetric.value === 'progreso') {
    return `${value}%`;
  }
  return value.toLocaleString();
};

const createChart = async () => {
  if (!chartCanvas.value || !hasData.value || !chartData.value) return;

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  await nextTick();

  const ctx = chartCanvas.value.getContext('2d');
  
  chartInstance.value = new Chart(ctx, {
    type: chartType.value,
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Usamos leyenda personalizada
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
              const label = context.dataset.label || '';
              const value = context.parsed.y || context.parsed;
              const formattedValue = selectedMetric.value === 'progreso' 
                ? `${value}%` 
                : value.toLocaleString();
              return `${label}: ${formattedValue}`;
            }
          }
        }
      },
      scales: chartType.value === 'bar' ? {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              if (selectedMetric.value === 'progreso') {
                return value + '%';
              }
              return value.toLocaleString();
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      } : {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              if (selectedMetric.value === 'progreso') {
                return value + '%';
              }
              return value.toLocaleString();
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutCubic'
      }
    }
  });
};

const exportChart = () => {
  if (chartInstance.value) {
    const url = chartInstance.value.toBase64Image();
    const link = document.createElement('a');
    link.download = `project-comparison-${selectedMetric.value}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = url;
    link.click();
  }
  emit('export');
};

const refreshData = () => {
  emit('refresh');
};

// Watchers
watch(() => props.selectedProjects, () => {
  if (hasData.value) {
    nextTick(() => {
      createChart();
    });
  }
}, { deep: true });

watch([chartType, selectedMetric], () => {
  if (hasData.value) {
    nextTick(() => {
      createChart();
    });
  }
});

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
  window.removeEventListener('resize', () => {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  });
});
</script>

<style scoped>
.project-comparison-chart {
  width: 100%;
}

.chart-loading,
.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.chart-container {
  width: 100%;
}

.chart-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 16px;
}

.chart-type-toggle {
  display: flex;
  justify-content: center;
}

.metric-selector {
  max-width: 300px;
}

.chart-wrapper {
  position: relative;
  width: 100%;
}

.chart-legend {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 16px;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.legend-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.legend-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.legend-value {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 600;
}

@media (max-width: 600px) {
  .legend-grid {
    grid-template-columns: 1fr;
  }
}
</style>

