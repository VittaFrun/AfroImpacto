<template>
  <div>
    <div v-if="!phases || phases.length === 0" class="text-center py-12">
      <v-icon size="120" color="grey-lighten-1">mdi-view-list-outline</v-icon>
      <h3 class="text-h5 text-grey mt-4">No hay fases definidas</h3>
      <p class="text-body-1 text-grey mb-4">
        Comienza agregando las fases principales de tu proyecto
      </p>
      <ModernButton
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="$emit('open-add-phase')"
      >
        Crear Primera Fase
      </ModernButton>
    </div>

    <div v-else>
      <v-expansion-panels variant="accordion" class="modern-expansion-panels">
        <v-expansion-panel 
          v-for="(phase, index) in phases" 
          :key="phase.id || index"
          class="phase-panel"
        >
          <v-expansion-panel-title class="phase-panel-title">
            <div class="d-flex justify-space-between align-center w-100">
              <div class="d-flex align-center flex-grow-1">
                <v-chip 
                  color="primary" 
                  size="small" 
                  class="mr-3"
                >
                  {{ index + 1 }}
                </v-chip>
                <div class="flex-grow-1">
                  <span class="font-weight-bold text-h6">{{ phase.name }}</span>
                  <div class="d-flex align-center gap-3 mt-1">
                    <div class="d-flex align-center">
                      <v-icon size="small" color="info" class="mr-1">mdi-format-list-checks</v-icon>
                      <span class="text-caption">
                        {{ tasksByPhase(phase.id).length }} tarea(s)
                      </span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="success" class="mr-1">mdi-check-circle</v-icon>
                      <span class="text-caption">
                        {{ getCompletedTasksByPhase(phase.id) }} completada(s)
                      </span>
                    </div>
                    <!-- Indicador de progreso -->
                    <div class="flex-grow-1" style="max-width: 200px;">
                      <v-progress-linear
                        :model-value="getPhaseProgress(phase.id)"
                        color="primary"
                        height="6"
                        rounded
                        class="mt-1"
                      ></v-progress-linear>
                      <span class="text-caption text-grey">{{ getPhaseProgress(phase.id) }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="d-flex align-center gap-2">
                <v-chip 
                  :color="getPhaseStatusColor(phase)" 
                  size="small"
                  variant="tonal"
                >
                  {{ getPhaseStatus(phase) }}
                </v-chip>
                
                <v-btn 
                  icon="mdi-pencil" 
                  variant="text" 
                  color="warning" 
                  size="small"
                  @click.stop="$emit('edit-phase', phase)"
                ></v-btn>
                
                <v-btn 
                  icon="mdi-delete" 
                  variant="text" 
                  color="error" 
                  size="small"
                  @click.stop="$emit('delete-phase', phase.id)"
                ></v-btn>
              </div>
            </div>
          </v-expansion-panel-title>
          
          <v-expansion-panel-text class="phase-panel-content">
            <div class="mb-4">
              <p class="text-body-1 text-grey-darken-1 mb-3">
                {{ phase.description || 'Sin descripción' }}
              </p>
            </div>
            
            <v-divider class="mb-4"></v-divider>
            
            <!-- Tasks List -->
            <div class="tasks-section">
              <h4 class="text-subtitle-1 font-weight-bold mb-3">Tareas de esta Fase</h4>
              
              <div v-if="getFilteredTasksByPhase(phase.id).length === 0" class="text-center py-4">
                <v-icon size="64" color="grey-lighten-1">mdi-format-list-checks</v-icon>
                <p class="text-body-2 text-grey mt-2">
                  {{ searchQuery ? 'No hay tareas que coincidan con la búsqueda' : 'No hay tareas en esta fase' }}
                </p>
              </div>
              
              <div v-else>
                <div 
                  v-for="task in getFilteredTasksByPhase(phase.id)" 
                  :key="task.id"
                  class="task-item mb-3"
                >
                  <v-card class="professional-task-card" variant="outlined" rounded="lg">
                    <v-card-text class="pa-3">
                      <div class="d-flex align-center justify-space-between">
                        <div class="flex-grow-1">
                          <div 
                            class="text-body-1 font-weight-medium mb-1"
                            v-html="highlightText(task.description)"
                          ></div>
                          <div class="text-caption text-grey mb-2">
                            {{ task.prioridad }} • {{ formatDateRange(task.fecha_inicio, task.fecha_fin) }}
                          </div>
                          <div class="d-flex align-center gap-2 flex-wrap">
                            <v-chip 
                              :color="getTaskStatusColor(task.id_estado)" 
                              size="small"
                              variant="tonal"
                            >
                              <v-icon start size="14">{{ getTaskStatusIcon(task.id_estado) }}</v-icon>
                              {{ getTaskStatus(task.id_estado) }}
                            </v-chip>
                            
                            <v-chip 
                              :color="getPriorityColor(task.prioridad)" 
                              variant="tonal"
                              size="x-small"
                            >
                              {{ task.prioridad }}
                            </v-chip>
                          </div>
                        </div>
                        
                        <div class="d-flex align-center gap-1 ml-3">
                          <v-btn 
                            icon="mdi-pencil" 
                            variant="text" 
                            color="warning" 
                            size="small"
                            @click="$emit('edit-task', task)"
                          ></v-btn>
                          
                          <v-btn 
                            icon="mdi-delete" 
                            variant="text" 
                            color="error" 
                            size="small"
                            @click="$emit('delete-task', task.id)"
                          ></v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
              
              <div class="text-center mt-4">
                <ModernButton
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-plus"
                  @click="$emit('add-task-to-phase', phase.id)"
                  size="small"
                >
                  Añadir Tarea a esta Fase
                </ModernButton>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  phases: {
    type: Array,
    default: () => []
  },
  searchQuery: {
    type: String,
    default: ''
  },
  tasksByPhase: {
    type: Function,
    required: true
  },
  getCompletedTasksByPhase: {
    type: Function,
    required: true
  },
  getPhaseStatus: {
    type: Function,
    required: true
  },
  getPhaseStatusColor: {
    type: Function,
    required: true
  },
  getTaskStatusColor: {
    type: Function,
    required: true
  },
  getTaskStatusIcon: {
    type: Function,
    required: true
  },
  getTaskStatus: {
    type: Function,
    required: true
  },
  getPriorityColor: {
    type: Function,
    required: true
  },
  formatDateRange: {
    type: Function,
    required: true
  },
  getPhaseName: {
    type: Function,
    required: true
  }
});

defineEmits([
  'edit-task',
  'delete-task',
  'add-task-to-phase',
  'edit-phase',
  'delete-phase',
  'open-add-phase'
]);

function getFilteredTasksByPhase(phaseId) {
  const phaseTasks = props.tasksByPhase(phaseId);
  if (!props.searchQuery) return phaseTasks;
  
  const query = props.searchQuery.toLowerCase();
  return phaseTasks.filter(task => {
    const description = (task.description || '').toLowerCase();
    return description.includes(query);
  });
}

function getPhaseProgress(phaseId) {
  const total = props.tasksByPhase(phaseId).length;
  if (total === 0) return 0;
  const completed = props.getCompletedTasksByPhase(phaseId);
  return Math.round((completed / total) * 100);
}

function highlightText(text) {
  if (!props.searchQuery || !text) return text;
  const query = props.searchQuery;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="highlight">$1</mark>');
}
</script>

<style scoped>
.modern-expansion-panels {
  border-radius: 12px;
  overflow: hidden;
}

.phase-panel {
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.phase-panel-title {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
  padding: 16px 20px;
}

.phase-panel-content {
  padding: 20px;
  background: rgba(var(--v-theme-surface), 0.5);
}

.professional-task-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease;
}

.professional-task-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-1px);
}

.task-item {
  transition: all 0.3s ease;
}

.task-item:hover {
  transform: translateY(-2px);
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

:deep(.highlight) {
  background-color: #FFEB3B;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}
</style>

