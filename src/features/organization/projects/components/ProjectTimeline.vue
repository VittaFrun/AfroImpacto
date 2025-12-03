<template>
  <v-card class="project-timeline-card modern-timeline" variant="outlined" rounded="xl" elevation="2">
    <v-card-title class="timeline-header pa-4">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <div class="timeline-icon-wrapper">
            <v-icon color="white" size="20">mdi-timeline-clock</v-icon>
          </div>
          <div class="ml-3">
            <h3 class="text-subtitle-1 font-weight-bold mb-0">Linea de tiempo</h3>
            <p class="text-caption text-grey-darken-1 mb-0">
              {{ phases?.length || 0 }} fase(s)
            </p>
          </div>
        </div>
        <v-btn-toggle
          v-model="viewMode"
          mandatory
          variant="flat"
          density="compact"
          color="primary"
          size="x-small"
          class="view-toggle"
        >
          <v-btn value="compact">
            Compacto
          </v-btn>
          <v-btn value="detailed">
            Detallado
          </v-btn>
        </v-btn-toggle>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <div v-if="!phases || phases.length === 0" class="empty-timeline">
        <div class="empty-icon-wrapper">
          <v-icon size="80" color="grey-lighten-1">mdi-timeline-outline</v-icon>
        </div>
        <h4 class="text-h6 mt-4 mb-2">No hay fases definidas</h4>
        <p class="text-body-2 text-grey">Comienza agregando fases a tu proyecto</p>
      </div>
      
      <div v-else class="modern-timeline-container">
        <!-- Timeline Line con gradiente mejorado -->
        <div class="timeline-line-modern" :style="{ height: `${timelineHeight}px` }">
          <div class="timeline-line-gradient"></div>
        </div>
        
        <!-- Timeline Items -->
        <div class="timeline-items-modern">
          <div
            v-for="(phase, index) in sortedPhases"
            :key="phase.id || phase.id_fase || index"
            class="timeline-item-modern"
            :class="{ 
              'active': hoveredPhase === (phase.id || phase.id_fase),
              'completed': getPhaseStatus(phase).includes('Completada'),
              'in-progress': getPhaseStatus(phase).includes('progreso')
            }"
            :style="getTimelineItemStyle(phase, index)"
            @mouseenter="hoveredPhase = phase.id || phase.id_fase"
            @mouseleave="hoveredPhase = null"
            @click="handlePhaseClick(phase)"
          >
            <!-- Phase Node mejorado -->
            <div class="timeline-node-modern" :class="getPhaseStatusClass(phase)">
              <div class="node-outer-ring"></div>
              <div class="node-inner-modern" style="background-color: white;">
                <div class="node-icon-wrapper">
                <v-icon :color="getNodeIconColor(phase)" size="18">
                  {{ getPhaseStatusIcon(phase) }}
                </v-icon>
                </div>
              </div>
              <div class="node-pulse-modern" v-if="isPhaseActive(phase)"></div>
              <div class="node-number-badge">{{ index + 1 }}</div>
            </div>
            
            <!-- Phase Content Card -->
            <div class="timeline-content-modern" :class="{ 'expanded': viewMode === 'detailed' || hoveredPhase === (phase.id || phase.id_fase) }">
              <v-card 
                class="phase-card" 
                :class="getPhaseCardClass(phase)"
                variant="flat"
                rounded="lg"
                elevation="hover"
              >
                <v-card-text class="pa-3">
                  <div class="phase-header-modern">
                    <div class="phase-title-section">
                      <h4 class="phase-name-modern">{{ phase.name || phase.nombre }}</h4>
                      <div class="phase-meta-modern">
                        <v-chip
                          :color="getPhaseStatusColor(phase)"
                          size="x-small"
                          variant="flat"
                          class="mr-2"
                        >
                          <v-icon start size="10">{{ getPhaseStatusIcon(phase) }}</v-icon>
                          {{ getPhaseStatus(phase) }}
                        </v-chip>
                        <v-chip
                          color="info"
                          size="x-small"
                          variant="tonal"
                        >
                          <v-icon start size="10">mdi-format-list-checks</v-icon>
                          {{ getPhaseTasksCount(phase) }} tarea(s)
                        </v-chip>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="viewMode === 'detailed' || hoveredPhase === (phase.id || phase.id_fase)" class="phase-details-modern mt-2">
                    <p v-if="phase.description || phase.descripcion" class="phase-description-modern">
                      {{ phase.description || phase.descripcion }}
                    </p>
                    
                    <!-- Fechas -->
                    <div class="phase-dates-modern mt-2">
                      <div class="date-item-modern" v-if="phase.fecha_inicio">
                        <v-icon size="14" color="primary" class="mr-1">mdi-calendar-start</v-icon>
                        <span class="text-caption">{{ formatDate(phase.fecha_inicio) }}</span>
                      </div>
                      <div class="date-item-modern" v-if="phase.fecha_fin">
                        <v-icon size="14" color="primary" class="mr-1">mdi-calendar-end</v-icon>
                        <span class="text-caption">{{ formatDate(phase.fecha_fin) }}</span>
                      </div>
                    </div>
                    
                    <!-- Progress Bar mejorado -->
                    <div class="phase-progress-modern mt-2">
                      <div class="d-flex justify-space-between align-center mb-1">
                        <span class="text-caption font-weight-medium">Progreso</span>
                        <span class="text-caption font-weight-bold" :style="{ color: getProgressColor(phase) }">
                          {{ getPhaseProgress(phase) }}%
                        </span>
                      </div>
                      <div class="progress-bar-container">
                        <div 
                          class="progress-bar-fill" 
                          :style="{ 
                            width: `${getPhaseProgress(phase)}%`,
                            background: getProgressGradient(phase)
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { formatDate } from '@/utils/formatters';

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
  getPhaseStatusIcon: {
    type: Function,
    required: true
  },
  getPhaseTasksCount: {
    type: Function,
    required: true
  },
  getPhaseProgress: {
    type: Function,
    required: true
  },
  getCompletedTasksByPhase: {
    type: Function,
    default: () => 0
  }
});

const emit = defineEmits(['phase-click', 'phase-hover']);

const viewMode = ref('detailed');
const hoveredPhase = ref(null);
const timelineHeight = ref(400);

// Ordenar fases por orden o fecha
const sortedPhases = computed(() => {
  if (!props.phases || props.phases.length === 0) return [];
  
  return [...props.phases].sort((a, b) => {
    if (a.orden && b.orden) {
      return a.orden - b.orden;
    }
    if (a.fecha_inicio && b.fecha_inicio) {
      return new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
    }
    return 0;
  });
});

// Calcular altura del timeline
const calculateTimelineHeight = () => {
  const baseHeight = 60;
  const phaseHeight = viewMode.value === 'detailed' ? 140 : 100;
  const totalHeight = baseHeight + (sortedPhases.value.length * phaseHeight);
  timelineHeight.value = Math.max(300, totalHeight);
};

// Obtener estilo para cada item
const getTimelineItemStyle = (phase, index) => {
  const top = 20 + (index * (viewMode.value === 'detailed' ? 140 : 100));
  return {
    top: `${top}px`
  };
};

// Obtener clase de estado
const getPhaseStatusClass = (phase) => {
  const status = props.getPhaseStatus(phase);
  if (status.includes('Completada')) return 'status-completed';
  if (status.includes('progreso')) return 'status-active';
  return 'status-pending';
};

// Obtener clase de card
const getPhaseCardClass = (phase) => {
  const status = props.getPhaseStatus(phase);
  if (status.includes('Completada')) return 'card-completed';
  if (status.includes('progreso')) return 'card-active';
  return 'card-pending';
};

// Verificar si fase está activa
const isPhaseActive = (phase) => {
  const status = props.getPhaseStatus(phase);
  return status.includes('progreso');
};

// Obtener color del icono del nodo
const getNodeIconColor = (phase) => {
  const status = props.getPhaseStatus(phase);
  if (status.includes('Completada')) return '#4CAF50';
  if (status.includes('progreso')) return '#2196F3';
  return '#9E9E9E';
};

// Obtener color de progreso
const getProgressColor = (phase) => {
  const progress = props.getPhaseProgress(phase);
  if (progress === 100) return '#4CAF50';
  if (progress >= 50) return '#2196F3';
  if (progress > 0) return '#FF9800';
  return '#9E9E9E';
};

// Obtener gradiente de progreso
const getProgressGradient = (phase) => {
  const progress = props.getPhaseProgress(phase);
  if (progress === 100) return 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)';
  if (progress >= 50) return 'linear-gradient(90deg, #2196F3 0%, #42A5F5 100%)';
  if (progress > 0) return 'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)';
  return 'linear-gradient(90deg, #E0E0E0 0%, #BDBDBD 100%)';
};

// Manejar click en fase
const handlePhaseClick = (phase) => {
  emit('phase-click', phase);
};

// Watchers
watch(viewMode, () => {
  calculateTimelineHeight();
});

watch(() => props.phases, () => {
  calculateTimelineHeight();
}, { deep: true });

// Lifecycle
onMounted(() => {
  calculateTimelineHeight();
  window.addEventListener('resize', calculateTimelineHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateTimelineHeight);
});
</script>

<style scoped>
.modern-timeline {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.timeline-header {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.03) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.timeline-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.view-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.empty-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(158, 158, 158, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-timeline-container {
  position: relative;
  min-height: 300px;
  padding: 20px 0;
}

.timeline-line-modern {
  position: absolute;
  left: 30px;
  top: 0;
  width: 3px;
  z-index: 1;
}

.timeline-line-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(33, 150, 243, 0.2) 0%,
    rgba(33, 150, 243, 0.6) 20%,
    rgba(33, 150, 243, 0.8) 50%,
    rgba(33, 150, 243, 0.6) 80%,
    rgba(33, 150, 243, 0.2) 100%
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(33, 150, 243, 0.3);
}

.timeline-items-modern {
  position: relative;
  z-index: 2;
}

.timeline-item-modern {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-item-modern:hover {
  transform: translateX(8px);
}

.timeline-item-modern.active .phase-card {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.timeline-node-modern {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 3;
}

.node-outer-ring {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.node-inner-modern {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  z-index: 2;
}

.timeline-item-modern:hover .node-inner-modern {
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.node-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-pulse-modern {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid;
  animation: pulse-modern 2s infinite;
  z-index: 0;
}

@keyframes pulse-modern {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.node-number-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
  color: white;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.4);
  z-index: 4;
}

.status-completed .node-inner-modern {
  border-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
}

.status-completed .node-outer-ring {
  background: rgba(76, 175, 80, 0.1);
}

.status-active .node-inner-modern {
  border-color: #2196F3;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%);
}

.status-active .node-outer-ring {
  background: rgba(33, 150, 243, 0.1);
}

.status-active .node-pulse-modern {
  border-color: #2196F3;
}

.status-pending .node-inner-modern {
  border-color: #9E9E9E;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(158, 158, 158, 0.05) 100%);
}

.status-pending .node-outer-ring {
  background: rgba(158, 158, 158, 0.1);
}

.timeline-content-modern {
  flex: 1;
  min-width: 0;
  transition: all 0.3s ease;
}

.phase-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: white;
}

.phase-card:hover {
  border-color: rgba(33, 150, 243, 0.3);
}

.card-completed {
  border-left: 4px solid #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.02) 0%, #ffffff 100%);
}

.card-active {
  border-left: 4px solid #2196F3;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, #ffffff 100%);
}

.card-pending {
  border-left: 4px solid #9E9E9E;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.02) 0%, #ffffff 100%);
}

.phase-header-modern {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.phase-name-modern {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.3;
}

.phase-meta-modern {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.phase-details-modern {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.phase-description-modern {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.7);
  margin: 0;
  line-height: 1.6;
}

.phase-dates-modern {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px;
  background: rgba(33, 150, 243, 0.05);
  border-radius: 6px;
}

.date-item-modern {
  display: flex;
  align-items: center;
}

.phase-progress-modern {
  padding: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .timeline-item-modern {
    flex-direction: column;
    align-items: center;
  }
  
  .timeline-content-modern {
    width: 100%;
  }
  
  .timeline-line-modern {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .timeline-node-modern {
    margin: 0 auto;
  }
}

@media (max-width: 600px) {
  .view-toggle {
    display: none;
  }
  
  .timeline-header {
    padding: 16px !important;
  }
}
</style>
