<template>
  <v-row>
    <v-col cols="12">
      <!-- Kanban Board -->
      <v-card class="mb-4 elevation-1" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
              <div class="professional-card-icon primary">
                <v-icon color="white" size="20">mdi-view-kanban</v-icon>
              </div>
              <div class="ml-3">
                <h2 class="text-h6 font-weight-bold mb-0">Tablero de Tareas</h2>
                <p class="text-caption text-grey mb-0">Vista Kanban de todas las tareas</p>
              </div>
            </div>
            <v-chip color="primary" variant="tonal" size="small">
              {{ getTotalTasks() }} tareas
            </v-chip>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <div v-if="getAllTasks().length === 0" class="text-center py-12">
            <v-icon size="120" color="grey-lighten-1">mdi-format-list-checks</v-icon>
            <h3 class="text-h5 text-grey mt-4">No hay tareas definidas</h3>
            <p class="text-body-1 text-grey mb-4">
              Comienza agregando tareas a las fases de tu proyecto
            </p>
            <ModernButton
              color="primary"
              variant="flat"
              prepend-icon="mdi-plus"
              @click="$emit('open-add-task')"
            >
              Crear Primera Tarea
            </ModernButton>
          </div>
          <kanban-board 
            v-else
            :tasks="getAllTasks()" 
            :phases="project.phases || []"
            @update:taskStatus="$emit('update-task-status', $event)" 
            @task-clicked="$emit('task-clicked', $event)"
          ></kanban-board>
        </v-card-text>
      </v-card>

      <!-- Project Phases Management -->
      <v-card class="professional-section-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
              <div class="professional-card-icon info">
                <v-icon color="white" size="20">mdi-view-list</v-icon>
              </div>
              <div class="ml-3">
                <h3 class="text-h6 font-weight-bold mb-1">Fases del Proyecto</h3>
                <p class="text-body-2 text-grey mb-0">Gestiona las etapas del proyecto</p>
              </div>
            </div>
            <ModernButton
              color="primary"
              variant="flat"
              prepend-icon="mdi-plus"
              @click="$emit('open-add-phase')"
              size="small"
            >
              Añadir Fase
            </ModernButton>
          </div>
        </v-card-title>
        <v-card-text class="pa-4 pa-md-6">
          <div v-if="!project.phases || project.phases.length === 0" class="text-center py-8">
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
                v-for="(phase, index) in project.phases" 
                :key="phase.id || index"
                class="phase-panel"
              >
                <v-expansion-panel-title class="phase-panel-title">
                  <div class="d-flex justify-space-between align-center w-100">
                    <div class="d-flex align-center">
                      <v-chip 
                        color="primary" 
                        size="small" 
                        class="mr-3"
                      >
                        {{ index + 1 }}
                      </v-chip>
                      <span class="font-weight-bold text-h6">{{ phase.name }}</span>
                    </div>
                    
                    <div class="d-flex align-center gap-2">
                      <v-chip 
                        :color="getPhaseStatusColor(phase)" 
                        size="small"
                        class="mr-2"
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
                    
                    <div class="d-flex align-center gap-4 mb-4">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2" color="info" size="small">mdi-format-list-checks</v-icon>
                        <span class="text-body-2">
                          {{ tasksByPhase(phase.id).length }} tarea(s)
                        </span>
                      </div>
                      
                      <div class="d-flex align-center">
                        <v-icon class="mr-2" color="success" size="small">mdi-check-circle</v-icon>
                        <span class="text-body-2">
                          {{ getCompletedTasksByPhase(phase.id) }} completada(s)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <v-divider class="mb-4"></v-divider>
                  
                  <!-- Tasks List -->
                  <div class="tasks-section">
                    <h4 class="text-subtitle-1 font-weight-bold mb-3">Tareas de esta Fase</h4>
                    
                    <div v-if="tasksByPhase(phase.id).length === 0" class="text-center py-4">
                      <v-icon size="64" color="grey-lighten-1">mdi-format-list-checks</v-icon>
                      <p class="text-body-2 text-grey mt-2">No hay tareas en esta fase</p>
                    </div>
                    
                    <div v-else>
                      <div 
                        v-for="task in tasksByPhase(phase.id)" 
                        :key="task.id"
                        class="task-item mb-3"
                      >
                        <v-card class="professional-task-card mb-2" variant="outlined" rounded="lg">
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center justify-space-between">
                              <div class="flex-grow-1">
                                <div class="text-body-1 font-weight-medium mb-1">{{ task.description }}</div>
                                <div class="text-caption text-grey mb-2">
                                  {{ task.prioridad }} • {{ formatDateRange(task.fecha_inicio, task.fecha_fin) }}
                                </div>
                                <div class="d-flex align-center gap-2">
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
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import KanbanBoard from '../KanbanBoard.vue';
import { formatDateRange } from '@/utils/formatters';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  getAllTasks: {
    type: Function,
    required: true
  },
  getTotalTasks: {
    type: Function,
    required: true
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
  }
});

const emit = defineEmits([
  'open-add-phase',
  'edit-phase',
  'delete-phase',
  'open-add-task',
  'add-task-to-phase',
  'edit-task',
  'delete-task',
  'update-task-status',
  'task-clicked'
]);
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

.professional-card-header {
  padding: 16px 20px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  background: #fafafa !important;
}

.professional-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.professional-card-icon.primary {
  background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%);
}

.professional-card-icon.info {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
}
</style>

