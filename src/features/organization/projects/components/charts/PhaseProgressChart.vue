<template>
  <div class="phase-progress-chart">
    <div v-if="loading" class="chart-loading">
      <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
      <p class="text-body-2 mt-2">Cargando datos...</p>
    </div>
    
    <div v-else-if="!hasData" class="chart-empty">
      <v-icon size="64" color="grey-lighten-1">mdi-chart-timeline</v-icon>
      <p class="text-body-2 text-grey-darken-1 mt-2">No hay fases para mostrar</p>
    </div>
    
    <div v-else class="chart-container">
      <!-- Chart Header -->
      <div class="chart-header mb-4">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <div>
            <h4 class="text-h6 font-weight-medium">Progreso por Fase</h4>
            <p class="text-caption text-grey-darken-1">
              {{ phases.length }} fase(s) del proyecto
            </p>
          </div>
          <div class="d-flex gap-2">
            <v-btn-toggle
              v-model="chartType"
              mandatory
              variant="outlined"
              density="compact"
              size="small"
            >
              <v-btn value="bubble">
                <v-icon start>mdi-chart-scatter-plot</v-icon>
                Burbujas
              </v-btn>
              <v-btn value="bar">
                <v-icon start>mdi-chart-bar</v-icon>
                Barras
              </v-btn>
              <v-btn value="gantt">
                <v-icon start>mdi-chart-timeline</v-icon>
                Gantt
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </div>

      <!-- Bubble Chart -->
      <div v-if="chartType === 'bubble'" class="chart-wrapper" style="height: 400px;">
        <canvas ref="bubbleCanvas"></canvas>
      </div>

      <!-- Bar Chart -->
      <div v-else-if="chartType === 'bar'" class="chart-wrapper" style="height: 400px;">
        <canvas ref="barCanvas"></canvas>
      </div>

      <!-- Gantt Chart -->
      <div v-else-if="chartType === 'gantt'" class="gantt-chart">
        <div class="gantt-container">
          <div
            v-for="(phase, index) in sortedPhases"
            :key="phase.id || phase.id_fase || index"
            class="gantt-row"
          >
            <div class="gantt-label">
              <div class="phase-name">{{ phase.name || phase.nombre }}</div>
              <div class="phase-meta">
                <span class="text-caption text-grey">
                  {{ getPhaseTasksCount(phase) }} tarea(s)
                </span>
              </div>
            </div>
            <div class="gantt-bar-container">
              <div class="gantt-bar-wrapper">
                <div
                  class="gantt-bar"
                  :class="getPhaseStatusClass(phase)"
                  :style="getGanttBarStyle(phase)"
                >
                  <div class="gantt-bar-progress" :style="getProgressStyle(phase)"></div>
                  <div class="gantt-bar-label">
                    {{ getPhaseProgress(phase) }}%
                  </div>
                </div>
              </div>
              <div class="gantt-dates">
                <span class="text-caption">{{ formatDate(phase.fecha_inicio) }}</span>
                <span class="text-caption">{{ formatDate(phase.fecha_fin) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="chart-legend mt-4">
        <div class="legend-grid">
          <div class="legend-item">
            <div class="legend-color status-completed"></div>
            <span class="legend-label">Completada</span>
          </div>
          <div class="legend-item">
            <div class="legend-color status-active"></div>
            <span class="legend-label">En Progreso</span>
          </div>
          <div class="legend-item">
            <div class="legend-color status-pending"></div>
            <span class="legend-label">Pendiente</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '@/utils/formatters';

Chart.register(...registerables);

const props = defineProps({
  phases: {
    type: Array,
    default: () => []
  },
  projectStartDate: {
    type: String,
    default: null
  },
  projectEndDate: {
    type: String,
    default: null
  },
  getPhaseStatus: {
    type: Function,
    required: true
  },
  getPhaseStatusColor: {
    type: Function,
    required: true
  },
  getPhaseProgress: {
    type: Function,
    required: true
  },
  getPhaseTasksCount: {
    type: Function,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Refs
const bubbleCanvas = ref(null);
const barCanvas = ref(null);
const bubbleChartInstance = ref(null);
const barChartInstance = ref(null);
const chartType = ref('bubble');

// Computed
const hasData = computed(() => {
  return props.phases && props.phases.length > 0;
});

const sortedPhases = computed(() => {
  if (!props.phases || props.phases.length === 0) return [];
  return [...props.phases].sort((a, b) => {
    if (a.orden && b.orden) return a.orden - b.orden;
    if (a.fecha_inicio && b.fecha_inicio) {
      return new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
    }
    return 0;
  });
});

const bubbleChartData = computed(() => {
  if (!hasData.value) return null;

  return {
    datasets: sortedPhases.value.map((phase, index) => {
      const progress = props.getPhaseProgress(phase);
      const taskCount = props.getPhaseTasksCount(phase);
      const status = props.getPhaseStatus(phase);
      
      return {
        label: phase.name || phase.nombre,
        data: [{
          x: index + 1,
          y: progress,
          r: Math.max(10, Math.min(30, taskCount * 2))
        }],
        backgroundColor: getStatusColor(status),
        borderColor: getStatusColor(status),
        borderWidth: 2
      };
    })
  };
});

const barChartData = computed(() => {
  if (!hasData.value) return null;

  return {
    labels: sortedPhases.value.map(p => p.name || p.nombre),
    datasets: [{
      label: 'Progreso (%)',
      data: sortedPhases.value.map(p => props.getPhaseProgress(p)),
      backgroundColor: sortedPhases.value.map(p => {
        const status = props.getPhaseStatus(p);
        return getStatusColor(status);
      }),
      borderColor: sortedPhases.value.map(p => {
        const status = props.getPhaseStatus(p);
        return getStatusColor(status);
      }),
      borderWidth: 2
    }]
  };
});

// Methods
const getStatusColor = (status) => {
  if (status.includes('Completada')) return 'rgba(76, 175, 80, 0.8)';
  if (status.includes('progreso')) return 'rgba(33, 150, 243, 0.8)';
  return 'rgba(158, 158, 158, 0.8)';
};

const getPhaseStatusClass = (phase) => {
  const status = props.getPhaseStatus(phase);
  if (status.includes('Completada')) return 'status-completed';
  if (status.includes('progreso')) return 'status-active';
  return 'status-pending';
};

const getGanttBarStyle = (phase) => {
  if (!props.projectStartDate || !props.projectEndDate || !phase.fecha_inicio || !phase.fecha_fin) {
    return { width: '100%' };
  }

  const projectStart = new Date(props.projectStartDate);
  const projectEnd = new Date(props.projectEndDate);
  const phaseStart = new Date(phase.fecha_inicio);
  const phaseEnd = new Date(phase.fecha_fin);

  const projectDuration = projectEnd - projectStart;
  const phaseStartOffset = phaseStart - projectStart;
  const phaseDuration = phaseEnd - phaseStart;

  const startPercent = (phaseStartOffset / projectDuration) * 100;
  const widthPercent = (phaseDuration / projectDuration) * 100;

  return {
    left: `${startPercent}%`,
    width: `${widthPercent}%`
  };
};

const getProgressStyle = (phase) => {
  const progress = props.getPhaseProgress(phase);
  return {
    width: `${progress}%`
  };
};

const createBubbleChart = async () => {
  if (!bubbleCanvas.value || !hasData.value || !bubbleChartData.value) return;

  if (bubbleChartInstance.value) {
    bubbleChartInstance.value.destroy();
  }

  await nextTick();

  const ctx = bubbleCanvas.value.getContext('2d');
  
  bubbleChartInstance.value = new Chart(ctx, {
    type: 'bubble',
    data: bubbleChartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const phase = sortedPhases.value[context.dataIndex];
              const progress = props.getPhaseProgress(phase);
              const tasks = props.getPhaseTasksCount(phase);
              return [
                `Fase: ${phase.name || phase.nombre}`,
                `Progreso: ${progress}%`,
                `Tareas: ${tasks}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Orden de Fase'
          },
          min: 0,
          max: sortedPhases.value.length + 1
        },
        y: {
          title: {
            display: true,
            text: 'Progreso (%)'
          },
          min: 0,
          max: 100
        }
      }
    }
  });
};

const createBarChart = async () => {
  if (!barCanvas.value || !hasData.value || !barChartData.value) return;

  if (barChartInstance.value) {
    barChartInstance.value.destroy();
  }

  await nextTick();

  const ctx = barCanvas.value.getContext('2d');
  
  barChartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: barChartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Progreso: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
};

// Watchers
watch([chartType, () => props.phases], () => {
  if (hasData.value) {
    nextTick(() => {
      if (chartType.value === 'bubble') {
        createBubbleChart();
      } else if (chartType.value === 'bar') {
        createBarChart();
      }
    });
  }
}, { deep: true });

watch(() => props.loading, (newLoading) => {
  if (!newLoading && hasData.value) {
    nextTick(() => {
      if (chartType.value === 'bubble') {
        createBubbleChart();
      } else if (chartType.value === 'bar') {
        createBarChart();
      }
    });
  }
});

// Lifecycle
onMounted(() => {
  if (hasData.value) {
    if (chartType.value === 'bubble') {
      createBubbleChart();
    } else if (chartType.value === 'bar') {
      createBarChart();
    }
  }
});

onUnmounted(() => {
  if (bubbleChartInstance.value) {
    bubbleChartInstance.value.destroy();
  }
  if (barChartInstance.value) {
    barChartInstance.value.destroy();
  }
});
</script>

<style scoped>
.phase-progress-chart {
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

.chart-wrapper {
  position: relative;
  width: 100%;
}

/* Gantt Chart Styles */
.gantt-chart {
  width: 100%;
  padding: 20px 0;
}

.gantt-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gantt-row {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 60px;
}

.gantt-label {
  min-width: 200px;
  max-width: 200px;
}

.phase-name {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.phase-meta {
  font-size: 0.75rem;
}

.gantt-bar-container {
  flex: 1;
  position: relative;
  min-height: 40px;
}

.gantt-bar-wrapper {
  position: relative;
  width: 100%;
  height: 40px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.gantt-bar {
  position: absolute;
  height: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.gantt-bar-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s ease;
}

.gantt-bar-label {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.status-completed .gantt-bar-progress {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.status-active .gantt-bar-progress {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
}

.status-pending .gantt-bar-progress {
  background: linear-gradient(135deg, #9E9E9E 0%, #BDBDBD 100%);
}

.gantt-dates {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 4px;
}

.chart-legend {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 16px;
}

.legend-grid {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.status-completed {
  background: #4CAF50;
}

.legend-color.status-active {
  background: #2196F3;
}

.legend-color.status-pending {
  background: #9E9E9E;
}

.legend-label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
}

@media (max-width: 960px) {
  .gantt-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .gantt-label {
    min-width: 100%;
    max-width: 100%;
  }
}
</style>

