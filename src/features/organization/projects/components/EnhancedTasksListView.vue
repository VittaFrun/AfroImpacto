<template>
  <div class="enhanced-tasks-view">
    <!-- Botón flotante para agregar fase -->
    <v-fab
      v-if="phases.length > 0"
      location="bottom end"
      size="large"
      color="primary"
      icon="mdi-plus"
      @click="$emit('open-add-phase')"
      class="fab-add-phase"
    >
      <v-tooltip activator="parent" location="left">Nueva Fase</v-tooltip>
    </v-fab>

    <!-- Empty State: Sin fases -->
    <div v-if="!phases || phases.length === 0" class="empty-state">
      <v-card class="empty-state-card" rounded="xl">
        <v-card-text class="text-center pa-8">
          <v-icon size="120" color="primary" class="mb-4">mdi-view-list-outline</v-icon>
          <h3 class="text-h5 font-weight-bold mb-2">No hay fases definidas</h3>
          <p class="text-body-1 text-grey mb-6">
            Comienza organizando tu proyecto en fases para una mejor gestión
          </p>
          <ModernButton
            color="primary"
            variant="flat"
            size="large"
            prepend-icon="mdi-plus"
            @click="$emit('open-add-phase')"
          >
            Crear Primera Fase
          </ModernButton>
        </v-card-text>
      </v-card>
    </div>

    <!-- Lista de Fases con Drag & Drop -->
    <div v-else class="phases-container">
      <draggable
        v-model="localPhases"
        :animation="200"
        handle=".drag-handle"
        ghost-class="ghost-phase"
        chosen-class="chosen-phase"
        @end="onPhaseDragEnd"
        :item-key="(item) => item.id_fase || item.id"
      >
        <template #item="{ element: phase, index }">
          <div 
            class="phase-card-wrapper"
            :key="phase.id_fase || phase.id || index"
          >
            <v-card class="phase-card" rounded="xl" elevation="2">
          <!-- Header de la Fase -->
          <v-card-title class="phase-header">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center flex-grow-1 gap-3">
                <!-- Handle para arrastrar -->
                <v-icon 
                  class="drag-handle" 
                  color="grey"
                  size="24"
                  style="cursor: grab;"
                >
                  mdi-drag-vertical
                </v-icon>
                
                <!-- Número de fase -->
                <v-avatar 
                  :color="getPhaseColor(index)" 
                  size="48"
                  class="phase-number-avatar"
                >
                  <span class="text-h6 font-weight-bold text-white">{{ index + 1 }}</span>
                </v-avatar>

                <!-- Información de la fase -->
                <div class="flex-grow-1">
                  <div class="d-flex align-center gap-2 mb-1">
                    <h3 class="text-h6 font-weight-bold mb-0">{{ phase.name || phase.nombre }}</h3>
                    <v-chip 
                      :color="getPhaseStatusColor(phase)" 
                      size="small"
                      variant="tonal"
                    >
                      <v-icon start size="14">{{ getPhaseStatusIcon(phase) }}</v-icon>
                      {{ getPhaseStatus(phase) }}
                    </v-chip>
                  </div>
                  
                  <!-- Estadísticas rápidas -->
                  <div class="d-flex align-center gap-4 mt-2">
                    <div class="d-flex align-center gap-1">
                      <v-icon size="16" color="info">mdi-format-list-checks</v-icon>
                      <span class="text-caption text-grey">
                        {{ getPhaseTasksCount(phase) }} tarea(s)
                      </span>
                    </div>
                    <div class="d-flex align-center gap-1">
                      <v-icon size="16" color="success">mdi-check-circle</v-icon>
                      <span class="text-caption text-grey">
                        {{ getCompletedTasksByPhase(getPhaseId(phase)) }} completada(s)
                      </span>
                    </div>
                    <div class="d-flex align-center gap-1">
                      <v-icon size="16" color="primary">mdi-progress-check</v-icon>
                      <span class="text-caption font-weight-medium">
                        {{ getPhaseProgress(getPhaseId(phase)) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Acciones de la fase -->
              <div class="d-flex align-center gap-1">
                <v-tooltip text="Editar Fase">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pencil"
                      variant="text"
                      color="warning"
                      size="small"
                      @click="$emit('edit-phase', phase)"
                    ></v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="Eliminar Fase">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
                      @click="confirmDeletePhase(phase)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-card-title>

          <!-- Barra de progreso -->
          <v-card-subtitle class="phase-progress-section">
            <v-progress-linear
              :model-value="getPhaseProgress(getPhaseId(phase))"
              :color="getPhaseProgressColor(getPhaseId(phase))"
              height="8"
              rounded
              class="mb-2"
            ></v-progress-linear>
            <div class="d-flex justify-space-between align-center">
              <span class="text-caption text-grey">
                {{ phase.description || 'Sin descripción' }}
              </span>
              <span class="text-caption font-weight-medium">
                {{ getPhaseProgress(getPhaseId(phase)) }}% completado
              </span>
            </div>
          </v-card-subtitle>

          <v-divider></v-divider>

          <!-- Contenido: Tareas -->
          <v-card-text class="phase-content">
            <div class="d-flex align-center justify-space-between mb-4">
              <h4 class="text-subtitle-1 font-weight-bold">Tareas</h4>
              <ModernButton
                color="primary"
                variant="flat"
                size="small"
                prepend-icon="mdi-plus"
                @click="handleAddTaskToPhase(phase)"
              >
                Nueva Tarea
              </ModernButton>
            </div>

            <!-- Lista de tareas -->
            <div v-if="getFilteredTasksByPhase(getPhaseId(phase)).length === 0" class="empty-tasks-state">
              <v-icon size="64" color="grey-lighten-1">mdi-format-list-checks</v-icon>
              <p class="text-body-2 text-grey mt-2">
                {{ searchQuery ? 'No hay tareas que coincidan con la búsqueda' : 'No hay tareas en esta fase' }}
              </p>
              <ModernButton
                color="primary"
                variant="outlined"
                size="small"
                prepend-icon="mdi-plus"
                class="mt-3"
                @click="handleAddTaskToPhase(phase)"
              >
                Agregar Primera Tarea
              </ModernButton>
            </div>

            <!-- Grid de tareas -->
            <div v-else class="tasks-grid">
              <v-card
                v-for="task in getFilteredTasksByPhase(getPhaseId(phase))"
                :key="task.id_tarea || task.id"
                class="task-card"
                variant="outlined"
                rounded="lg"
                @click="$emit('edit-task', task)"
              >
                <v-card-text class="pa-3">
                  <div class="d-flex align-start justify-space-between">
                    <div class="flex-grow-1">
                      <div 
                        class="text-body-1 font-weight-medium mb-2 task-description"
                        v-html="highlightText(task.descripcion || task.description)"
                      ></div>
                      
                      <div class="d-flex align-center gap-2 flex-wrap mb-2">
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
                          <v-icon start size="12">mdi-flag</v-icon>
                          {{ task.prioridad }}
                        </v-chip>

                        <v-chip 
                          v-if="task.complejidad"
                          color="info"
                          variant="tonal"
                          size="x-small"
                        >
                          {{ task.complejidad }}
                        </v-chip>
                      </div>

                      <div class="d-flex align-center gap-2 text-caption text-grey">
                        <v-icon size="14">mdi-calendar-range</v-icon>
                        <span>{{ formatDateRange(task.fecha_inicio, task.fecha_fin) }}</span>
                      </div>
                    </div>

                    <div class="d-flex align-center gap-1 ml-2 task-actions">
                      <v-tooltip text="Editar">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-pencil"
                            variant="text"
                            color="warning"
                            size="x-small"
                            @click.stop="$emit('edit-task', task)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                      <v-tooltip text="Eliminar">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-delete"
                            variant="text"
                            color="error"
                            size="x-small"
                            @click.stop="confirmDeleteTask(task)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
            </v-card>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Diálogo de confirmación de eliminación de fase -->
    <v-dialog v-model="deletePhaseDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Confirmar Eliminación
        </v-card-title>
        <v-card-text>
          <p class="text-body-1 mb-2">
            ¿Estás seguro de que deseas eliminar la fase <strong>{{ phaseToDelete?.name || phaseToDelete?.nombre }}</strong>?
          </p>
          <v-alert type="warning" variant="tonal" class="mt-3">
            Esta acción eliminará todas las tareas asociadas a esta fase y no se puede deshacer.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deletePhaseDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDeletePhaseAction">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación de tarea -->
    <v-dialog v-model="deleteTaskDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Confirmar Eliminación
        </v-card-title>
        <v-card-text>
          <p class="text-body-1">
            ¿Estás seguro de que deseas eliminar esta tarea?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteTaskDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDeleteTaskAction">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import ModernButton from '@/components/ui/ModernButton.vue';
import { useNotifications } from '@/composables/useNotifications';

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

const emit = defineEmits([
  'edit-task',
  'delete-task',
  'add-task-to-phase',
  'edit-phase',
  'delete-phase',
  'open-add-phase',
  'reorder-phases'
]);

// Fases locales para drag & drop
const localPhases = ref([...props.phases]);

// Sincronizar cuando cambian las fases desde el padre
watch(() => props.phases, (newPhases) => {
  if (newPhases && newPhases.length > 0) {
    localPhases.value = [...newPhases];
  }
}, { deep: true, immediate: true });

const { showError } = useNotifications();

const deletePhaseDialog = ref(false);
const deleteTaskDialog = ref(false);
const phaseToDelete = ref(null);
const taskToDelete = ref(null);

// Obtener ID de fase (soporta diferentes formatos)
function getPhaseId(phase) {
  return phase.id_fase || phase.id;
}

// Obtener color de fase basado en índice
function getPhaseColor(index) {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
  return colors[index % colors.length];
}

// Obtener icono de estado de fase
function getPhaseStatusIcon(phase) {
  const status = props.getPhaseStatus(phase);
  if (status.includes('Completada')) return 'mdi-check-circle';
  if (status.includes('En Progreso')) return 'mdi-progress-clock';
  return 'mdi-clock-outline';
}

// Obtener color de progreso
function getPhaseProgressColor(phaseId) {
  const progress = getPhaseProgress(phaseId);
  if (progress === 100) return 'success';
  if (progress >= 50) return 'info';
  if (progress > 0) return 'warning';
  return 'grey';
}

// Contar tareas de una fase
function getPhaseTasksCount(phase) {
  return props.tasksByPhase(getPhaseId(phase)).length;
}

// Calcular progreso de fase
function getPhaseProgress(phaseId) {
  const total = props.tasksByPhase(phaseId).length;
  if (total === 0) return 0;
  const completed = props.getCompletedTasksByPhase(phaseId);
  return Math.round((completed / total) * 100);
}

// Filtrar tareas por fase
function getFilteredTasksByPhase(phaseId) {
  const phaseTasks = props.tasksByPhase(phaseId);
  if (!props.searchQuery) return phaseTasks;
  
  const query = props.searchQuery.toLowerCase();
  return phaseTasks.filter(task => {
    const description = (task.descripcion || task.description || '').toLowerCase();
    return description.includes(query);
  });
}

// Resaltar texto de búsqueda
function highlightText(text) {
  if (!props.searchQuery || !text) return text;
  const query = props.searchQuery;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="highlight">$1</mark>');
}

// Manejar agregar tarea a fase
function handleAddTaskToPhase(phase) {
  const phaseId = getPhaseId(phase);
  if (!phaseId) {
    showError('Error: No se pudo identificar la fase. Por favor, recarga la página.');
    return;
  }
  emit('add-task-to-phase', phaseId);
}

// Confirmar eliminación de fase
function confirmDeletePhase(phase) {
  phaseToDelete.value = phase;
  deletePhaseDialog.value = true;
}

// Confirmar acción de eliminación de fase
function confirmDeletePhaseAction() {
  if (phaseToDelete.value) {
    const phaseId = getPhaseId(phaseToDelete.value);
    emit('delete-phase', phaseId);
    deletePhaseDialog.value = false;
    phaseToDelete.value = null;
  }
}

// Confirmar eliminación de tarea
function confirmDeleteTask(task) {
  taskToDelete.value = task;
  deleteTaskDialog.value = true;
}

// Confirmar acción de eliminación de tarea
function confirmDeleteTaskAction() {
  if (taskToDelete.value) {
    const taskId = taskToDelete.value.id_tarea || taskToDelete.value.id;
    emit('delete-task', taskId);
    deleteTaskDialog.value = false;
    taskToDelete.value = null;
  }
}

// Manejar el final del arrastre de fases
function onPhaseDragEnd() {
  // Crear array de ordenes basado en la nueva posición
  const ordenes = localPhases.value.map((phase, index) => ({
    id_fase: getPhaseId(phase),
    orden: index + 1
  }));
  
  // Emitir evento para reordenar
  emit('reorder-phases', ordenes);
}
</script>

<style scoped>
.enhanced-tasks-view {
  position: relative;
  padding-bottom: 80px; /* Espacio para el FAB */
}

.empty-state {
  padding: 40px 20px;
}

.empty-state-card {
  max-width: 600px;
  margin: 0 auto;
}

.phases-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.phase-card-wrapper {
  animation: fadeInUp 0.3s ease-out;
  margin-bottom: 24px;
}

/* Estilos para drag & drop */
.ghost-phase {
  opacity: 0.5;
  background: rgba(var(--v-theme-primary), 0.1);
  border: 2px dashed rgba(var(--v-theme-primary), 0.5);
}

.chosen-phase {
  cursor: grabbing !important;
}

.drag-handle {
  cursor: grab !important;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.phase-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.phase-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.phase-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
  padding: 20px 24px !important;
}

.phase-header h3 {
  color: rgba(0, 0, 0, 0.87) !important; /* Color oscuro para contraste */
}

.phase-header .text-grey {
  color: rgba(0, 0, 0, 0.6) !important; /* Color gris oscuro para mejor legibilidad */
}

.phase-number-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.phase-progress-section {
  padding: 16px 24px !important;
  background: rgba(var(--v-theme-surface), 0.5);
}

.phase-content {
  padding: 24px !important;
}

.empty-tasks-state {
  text-align: center;
  padding: 40px 20px;
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.3);
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.task-card {
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff !important;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

.task-description {
  min-height: 40px;
  line-height: 1.5;
}

.task-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.task-card:hover .task-actions {
  opacity: 1;
}

/* Asegurar que los botones con iconos se vean correctamente */
.task-actions .v-btn,
.phase-header .v-btn {
  min-width: 32px !important;
  width: 32px !important;
  height: 32px !important;
}

.task-actions .v-btn .v-icon,
.phase-header .v-btn .v-icon {
  color: inherit !important;
  opacity: 1 !important;
  display: block !important;
}

/* Asegurar visibilidad de iconos en botones */
.task-actions .v-btn:deep(.v-icon),
.phase-header .v-btn:deep(.v-icon) {
  opacity: 1 !important;
  visibility: visible !important;
}

.fab-add-phase {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

:deep(.highlight) {
  background-color: #FFEB3B;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>

