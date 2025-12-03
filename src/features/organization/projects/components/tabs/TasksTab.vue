<template>
  <v-row>
    <v-col cols="12">
      <!-- Header con controles -->
      <v-card class="mb-4 elevation-2" rounded="xl" variant="flat">
        <v-card-title class="tasks-header-modern pa-6">
          <div class="d-flex align-center justify-space-between w-100 flex-wrap gap-3">
            <div class="d-flex align-center">
              <div class="header-icon-wrapper">
                <v-icon color="white" size="28">mdi-view-list</v-icon>
              </div>
              <div class="ml-4">
                <h2 class="text-h5 font-weight-bold mb-1">Fases y Tareas</h2>
                <p class="text-caption text-grey-darken-1 mb-0">
                  {{ getTotalTasks() }} tarea(s) en {{ project.phases?.length || 0 }} fase(s)
                </p>
              </div>
            </div>
            <div class="d-flex align-center gap-2 flex-wrap">
              <v-chip color="primary" variant="flat" size="small" class="stats-chip">
                <v-icon start size="16">mdi-check-circle</v-icon>
                {{ getCompletedTasksCount() }} completadas
              </v-chip>
              <ModernButton
                color="primary"
                variant="flat"
                prepend-icon="mdi-plus"
                size="small"
                @click="$emit('open-add-phase')"
              >
                Nueva Fase
              </ModernButton>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <!-- Filtros y búsqueda mejorados -->
          <div class="filters-section-modern mb-6">
            <v-row dense>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="Buscar tareas o fases..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                  @input="saveFilters"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="2">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions"
                  label="Estado"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                  @update:model-value="saveFilters"
                ></v-select>
              </v-col>
              <v-col cols="6" md="2">
                <v-select
                  v-model="filters.priority"
                  :items="priorityOptions"
                  label="Prioridad"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                  @update:model-value="saveFilters"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center gap-2">
                <v-btn
                  icon="mdi-filter-off"
                  variant="text"
                  color="grey"
                  size="small"
                  @click="clearFilters"
                  :disabled="!hasActiveFilters"
                >
                  <v-icon>mdi-filter-off</v-icon>
                  <v-tooltip activator="parent">Limpiar filtros</v-tooltip>
                </v-btn>
                <v-spacer></v-spacer>
                <v-chip
                  v-if="hasActiveFilters"
                  color="info"
                  variant="tonal"
                  size="small"
                >
                  {{ filteredTasks.length }} resultado(s)
                </v-chip>
              </v-col>
            </v-row>
          </div>

          <!-- Vista de Fases y Tareas Mejorada -->
          <div v-if="sortedPhases.length === 0" class="empty-state-modern">
            <div class="empty-icon-wrapper">
              <v-icon size="100" color="grey-lighten-1">mdi-view-list</v-icon>
            </div>
            <h3 class="text-h5 mt-6 mb-2">No hay fases definidas</h3>
            <p class="text-body-1 text-grey mb-6">
              Comienza creando la primera fase de tu proyecto
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

          <div v-else class="phases-container-modern">
            <div
              v-for="(phase, phaseIndex) in sortedPhases"
              :key="phase.id || phase.id_fase || phaseIndex"
              class="phase-section-modern mb-4"
            >
              <!-- Phase Card -->
              <v-card
                class="phase-card-modern"
                :class="getPhaseCardClass(phase)"
                variant="flat"
                rounded="xl"
                elevation="2"
              >
                <!-- Phase Header -->
                <v-card-title class="phase-header-modern pa-6">
                  <div class="d-flex align-center justify-space-between w-100 flex-wrap gap-3">
                    <div class="d-flex align-center gap-4">
                      <div class="phase-number-modern">
                        {{ phaseIndex + 1 }}
                      </div>
                      <div>
                        <h3 class="phase-title-modern mb-2">
                          {{ phase.name || phase.nombre }}
                        </h3>
                        <div class="d-flex align-center flex-wrap gap-2">
                          <v-chip
                            :color="getPhaseStatusColor(phase)"
                            size="small"
                            variant="flat"
                          >
                            <v-icon start size="14">{{ getPhaseStatusIcon(phase) }}</v-icon>
                            {{ getPhaseStatus(phase) }}
                          </v-chip>
                          <v-chip
                            color="info"
                            size="small"
                            variant="tonal"
                          >
                            <v-icon start size="14">mdi-format-list-checks</v-icon>
                            {{ getPhaseTasksCount(phase) }} tarea(s)
                          </v-chip>
                          <v-chip
                            v-if="phase.fecha_inicio && phase.fecha_fin"
                            color="grey"
                            size="small"
                            variant="tonal"
                          >
                            <v-icon start size="14">mdi-calendar-range</v-icon>
                            {{ formatDateRange(phase.fecha_inicio, phase.fecha_fin) }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <!-- Progress Circle -->
                      <div class="progress-circle-wrapper">
                        <v-progress-circular
                          :model-value="getPhaseProgress(phase)"
                          :size="56"
                          :width="6"
                          :color="getPhaseStatusColor(phase)"
                          class="mr-2"
                        >
                          <span class="text-caption font-weight-bold">
                            {{ getPhaseProgress(phase) }}%
                          </span>
                        </v-progress-circular>
                      </div>
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
                          <v-list-item @click="$emit('edit-phase', phase)">
                            <v-list-item-title>
                              <v-icon start>mdi-pencil</v-icon>
                              Editar Fase
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="$emit('add-task-to-phase', phase)">
                            <v-list-item-title>
                              <v-icon start>mdi-plus</v-icon>
                              Agregar Tarea
                            </v-list-item-title>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item @click="$emit('delete-phase', phase)" class="text-error">
                            <v-list-item-title>
                              <v-icon start>mdi-delete</v-icon>
                              Eliminar Fase
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                </v-card-title>

                <v-divider></v-divider>

                <!-- Phase Description -->
                <v-card-text v-if="phase.description || phase.descripcion" class="phase-description-section pa-4">
                  <p class="text-body-2 text-grey-darken-1 mb-0">
                    {{ phase.description || phase.descripcion }}
                  </p>
                </v-card-text>

                <!-- Tasks Grid -->
                <v-card-text class="tasks-grid-section pa-6">
                  <div v-if="getPhaseTasks(phase).length === 0" class="empty-tasks-state">
                    <v-icon size="48" color="grey-lighten-1">mdi-format-list-checks</v-icon>
                    <p class="text-body-2 text-grey mt-3 mb-0">No hay tareas en esta fase</p>
                    <ModernButton
                      color="primary"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-plus"
                      class="mt-3"
                      @click="$emit('add-task-to-phase', phase)"
                    >
                      Agregar Tarea
                    </ModernButton>
                  </div>

                  <div v-else class="tasks-grid-modern">
                    <v-card
                      v-for="task in getPhaseTasks(phase)"
                      :key="task.id || task.id_tarea"
                      class="task-card-modern"
                      :class="getTaskCardClass(task)"
                      variant="flat"
                      rounded="lg"
                      elevation="1"
                      @click="$emit('task-clicked', task)"
                    >
                      <v-card-text class="pa-4">
                        <div class="task-header-modern">
                          <div class="d-flex align-center justify-space-between mb-2">
                            <div class="d-flex align-center gap-2">
                              <v-icon
                                :color="getTaskStatusColor(task.id_estado)"
                                size="20"
                              >
                                {{ getTaskStatusIcon(task.id_estado) }}
                              </v-icon>
                              <span class="text-caption font-weight-medium text-grey">
                                {{ getTaskStatus(task.id_estado) }}
                              </span>
                            </div>
                            <v-menu>
                              <template v-slot:activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  icon
                                  variant="text"
                                  size="x-small"
                                  @click.stop
                                >
                                  <v-icon size="16">mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-item @click="$emit('edit-task', task)">
                                  <v-list-item-title>
                                    <v-icon start size="16">mdi-pencil</v-icon>
                                    Editar
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="$emit('delete-task', task)" class="text-error">
                                  <v-list-item-title>
                                    <v-icon start size="16">mdi-delete</v-icon>
                                    Eliminar
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </div>

                        <p class="task-description-modern mb-3">
                          {{ task.descripcion || 'Sin descripción' }}
                        </p>

                        <div class="task-meta-modern">
                          <div class="d-flex flex-wrap gap-2 mb-2">
                            <v-chip
                              :color="getPriorityColor(task.prioridad)"
                              size="x-small"
                              variant="tonal"
                            >
                              {{ task.prioridad || 'Media' }}
                            </v-chip>
                            <v-chip
                              color="grey"
                              size="x-small"
                              variant="tonal"
                            >
                              {{ task.complejidad || 'Media' }}
                            </v-chip>
                          </div>
                          <div v-if="task.fecha_inicio || task.fecha_fin" class="task-dates-modern">
                            <div v-if="task.fecha_inicio" class="date-item-small">
                              <v-icon size="12" class="mr-1">mdi-calendar-start</v-icon>
                              <span class="text-caption">{{ formatDate(task.fecha_inicio) }}</span>
                            </div>
                            <div v-if="task.fecha_fin" class="date-item-small">
                              <v-icon size="12" class="mr-1">mdi-calendar-end</v-icon>
                              <span class="text-caption">{{ formatDate(task.fecha_fin) }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Task Assignments -->
                        <div v-if="task.asignaciones && task.asignaciones.length > 0" class="task-assignments mt-3">
                          <div class="d-flex align-center gap-2">
                            <v-icon size="16" color="primary">mdi-account-group</v-icon>
                            <div class="d-flex align-center gap-1">
                              <v-avatar
                                v-for="(assignment, idx) in task.asignaciones.slice(0, 3)"
                                :key="assignment.id_asignacion || idx"
                                size="24"
                                color="primary"
                              >
                                <span class="text-caption">
                                  {{ getVolunteerInitials(assignment) }}
                                </span>
                              </v-avatar>
                              <span
                                v-if="task.asignaciones.length > 3"
                                class="text-caption text-grey"
                              >
                                +{{ task.asignaciones.length - 3 }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import { formatDate, formatDateRange } from '@/utils/formatters';

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
  getCompletedTasksCount: {
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
  getPhaseStatusIcon: {
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
  getPhaseName: {
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
  'task-clicked',
  'reorder-phases'
]);

// Estado de filtros
const searchQuery = ref('');
const filters = ref({
  status: null,
  priority: null
});

// Ordenar fases
const sortedPhases = computed(() => {
  if (!props.project.phases || props.project.phases.length === 0) return [];
  return [...props.project.phases].sort((a, b) => {
    if (a.orden && b.orden) return a.orden - b.orden;
    if (a.fecha_inicio && b.fecha_inicio) {
      return new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
    }
    return 0;
  });
});

// Obtener tareas de una fase
const getPhaseTasks = (phase) => {
  const allTasks = props.getAllTasks();
  const phaseTasks = allTasks.filter(task => {
    const taskPhaseId = task.id_fase || task.fase?.id_fase || task.fase?.id;
    const phaseId = phase.id_fase || phase.id;
    return taskPhaseId === phaseId;
  });

  // Aplicar filtros
  let filtered = phaseTasks;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(task => {
      const desc = (task.descripcion || '').toLowerCase();
      return desc.includes(query);
    });
  }

  if (filters.value.status) {
    filtered = filtered.filter(task => {
      const status = props.getTaskStatus(task.id_estado);
      return status === filters.value.status;
    });
  }

  if (filters.value.priority) {
    filtered = filtered.filter(task => task.prioridad === filters.value.priority);
  }

  return filtered;
};

// Tareas filtradas (para estadísticas)
const filteredTasks = computed(() => {
  return sortedPhases.value.flatMap(phase => getPhaseTasks(phase));
});

// Opciones de filtros
const statusOptions = computed(() => {
  const statuses = new Set();
  props.getAllTasks().forEach(task => {
    if (task.id_estado) {
      statuses.add(props.getTaskStatus(task.id_estado));
    }
  });
  return [
    { title: 'Todos los estados', value: null },
    ...Array.from(statuses).map(s => ({ title: s, value: s }))
  ];
});

const priorityOptions = computed(() => {
  const priorities = new Set();
  props.getAllTasks().forEach(task => {
    if (task.prioridad) {
      priorities.add(task.prioridad);
    }
  });
  return [
    { title: 'Todas las prioridades', value: null },
    ...Array.from(priorities).map(p => ({ title: p, value: p }))
  ];
});

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || filters.value.status || filters.value.priority);
});

// Obtener clase de card de fase
const getPhaseCardClass = (phase) => {
  const status = props.getPhaseStatus(phase);
  if (status.includes('Completada')) return 'phase-completed';
  if (status.includes('progreso')) return 'phase-active';
  return 'phase-pending';
};

// Obtener clase de card de tarea
const getTaskCardClass = (task) => {
  const status = props.getTaskStatus(task.id_estado);
  if (status.includes('Completada')) return 'task-completed';
  if (status.includes('Progreso')) return 'task-active';
  return 'task-pending';
};

// Obtener iniciales del voluntario
const getVolunteerInitials = (assignment) => {
  const name = assignment.voluntario?.usuario?.nombre || assignment.voluntario?.nombre || 'V';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

// Guardar filtros
function saveFilters() {
  const filterData = {
    searchQuery: searchQuery.value,
    filters: filters.value
  };
  localStorage.setItem('tasksFilters', JSON.stringify(filterData));
}

// Cargar filtros
function loadFilters() {
  try {
    const saved = localStorage.getItem('tasksFilters');
    if (saved) {
      const data = JSON.parse(saved);
      searchQuery.value = data.searchQuery || '';
      filters.value = { ...filters.value, ...data.filters };
    }
  } catch (error) {
    console.error('Error loading filters:', error);
  }
}

function clearFilters() {
  searchQuery.value = '';
  filters.value = {
    status: null,
    priority: null
  };
  saveFilters();
}

watch([searchQuery, filters], () => {
  saveFilters();
}, { deep: true });

onMounted(() => {
  loadFilters();
});
</script>

<style scoped>
.tasks-header-modern {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.header-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.stats-chip {
  backdrop-filter: blur(10px);
}

.filters-section-modern {
  background: rgba(0, 0, 0, 0.02);
  padding: 20px;
  border-radius: 12px;
}

.empty-state-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon-wrapper {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(158, 158, 158, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.phases-container-modern {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.phase-section-modern {
  animation: fadeInUp 0.4s ease;
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

.phase-card-modern {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: white;
}

.phase-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.phase-completed {
  border-left: 6px solid #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.02) 0%, #ffffff 100%);
}

.phase-active {
  border-left: 6px solid #2196F3;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, #ffffff 100%);
}

.phase-pending {
  border-left: 6px solid #9E9E9E;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.02) 0%, #ffffff 100%);
}

.phase-header-modern {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.03) 0%, rgba(33, 150, 243, 0.01) 100%);
}

.phase-number-modern {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
  color: white;
  font-size: 24px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  flex-shrink: 0;
}

.phase-title-modern {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
}

.phase-description-section {
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.tasks-grid-section {
  background: rgba(0, 0, 0, 0.01);
}

.empty-tasks-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.tasks-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.task-card-modern {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: white;
}

.task-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(33, 150, 243, 0.3);
}

.task-completed {
  border-left: 4px solid #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.02) 0%, #ffffff 100%);
}

.task-active {
  border-left: 4px solid #2196F3;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, #ffffff 100%);
}

.task-pending {
  border-left: 4px solid #9E9E9E;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.02) 0%, #ffffff 100%);
}

.task-description-modern {
  font-size: 0.9375rem;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta-modern {
  margin-top: 12px;
}

.task-dates-modern {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.date-item-small {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}

.task-assignments {
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.progress-circle-wrapper {
  position: relative;
}

/* Responsive */
@media (max-width: 960px) {
  .tasks-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .phase-header-modern {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .progress-circle-wrapper {
    margin-top: 16px;
  }
}

@media (max-width: 600px) {
  .phase-number-modern {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .phase-title-modern {
    font-size: 1.25rem;
  }
}
</style>
