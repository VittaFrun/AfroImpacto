<template>
  <div class="volunteer-workspace-view">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="afro-body mt-4">Cargando área de trabajo...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-alert type="error" prominent>
        <template #title>Error al cargar el proyecto</template>
        {{ error }}
        <template #append>
          <v-btn color="error" variant="text" @click="goBack">Volver</v-btn>
        </template>
      </v-alert>
    </div>

    <!-- Main Content -->
    <div v-else-if="project">
      <!-- Header Section -->
      <div class="workspace-header afro-card-elevated mb-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="goBack"
              class="mr-4"
            ></v-btn>
            <div>
              <h1 class="afro-heading-2 mb-1">{{ project.nombre || project.name }}</h1>
              <div class="d-flex align-center gap-2 flex-wrap">
                <v-chip
                  :color="getStatusColor(project.id_estado || project.estado?.id_estado)"
                  size="small"
                  variant="tonal"
                  prepend-icon="mdi-circle"
                >
                  {{ getStatusText(project.id_estado || project.estado?.id_estado) }}
                </v-chip>
                <span class="text-grey">•</span>
                <span class="text-grey">{{ project.organizacion?.nombre || project.organization }}</span>
                <span class="text-grey">•</span>
                <span class="text-grey">{{ formatDateRange(project.fecha_inicio || project.startDate, project.fecha_fin || project.endDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Roles Asignados -->
        <div v-if="project.rolesAsignados && project.rolesAsignados.length > 0" class="roles-section">
          <span class="text-caption text-grey mr-2">Mis Roles:</span>
          <v-chip
            v-for="rol in project.rolesAsignados"
            :key="rol.id_rol"
            color="info"
            size="small"
            variant="tonal"
            prepend-icon="mdi-account-tie"
            class="mr-2"
          >
            {{ rol.nombre }}
          </v-chip>
        </div>
      </div>

      <!-- Progress Section -->
      <div class="afro-grid afro-grid-3 mb-6">
        <!-- Progreso General del Proyecto -->
        <div class="afro-card-elevated">
          <div class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-body-2 text-grey">Progreso del Proyecto</span>
              <span class="text-h6 font-weight-bold">{{ projectProgress }}%</span>
            </div>
            <v-progress-linear
              :model-value="projectProgress"
              color="primary"
              height="12"
              rounded
            ></v-progress-linear>
          </div>
        </div>

        <!-- Progreso Personal -->
        <div class="afro-card-elevated">
          <div class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-body-2 text-grey">Mi Progreso</span>
              <span class="text-h6 font-weight-bold">{{ personalProgress.porcentajeCompletado }}%</span>
            </div>
            <v-progress-linear
              :model-value="personalProgress.porcentajeCompletado"
              color="success"
              height="12"
              rounded
            ></v-progress-linear>
            <div class="text-caption text-grey mt-2">
              {{ personalProgress.tareasCompletadas }} de {{ personalProgress.tareasAsignadas }} tareas completadas
            </div>
          </div>
        </div>

        <!-- Horas Trabajadas -->
        <div class="afro-card-elevated">
          <div class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-body-2 text-grey">Horas Trabajadas</span>
              <span class="text-h6 font-weight-bold">{{ resumenHoras.totalHoras }}h</span>
            </div>
            <div class="text-caption text-grey">
              <span class="text-success">{{ resumenHoras.horasVerificadas }}h verificadas</span>
              <span class="mx-1">•</span>
              <span class="text-warning">{{ resumenHoras.horasPendientes }}h pendientes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="afro-grid afro-grid-4 mb-6">
        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-content">
            <div class="afro-metric-value">{{ personalProgress.tareasAsignadas }}</div>
            <div class="afro-metric-label">Tareas Asignadas</div>
            <div class="metric-icon">
              <v-icon size="32" color="primary">mdi-format-list-checks</v-icon>
            </div>
          </div>
        </div>
        
        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-content">
            <div class="afro-metric-value">{{ personalProgress.tareasCompletadas }}</div>
            <div class="afro-metric-label">Tareas Completadas</div>
            <div class="metric-icon">
              <v-icon size="32" color="success">mdi-check-circle</v-icon>
            </div>
          </div>
        </div>
        
        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-content">
            <div class="afro-metric-value">{{ resumenHoras.totalHoras }}</div>
            <div class="afro-metric-label">Horas Totales</div>
            <div class="metric-icon">
              <v-icon size="32" color="info">mdi-clock</v-icon>
            </div>
          </div>
        </div>
        
        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-content">
            <div class="afro-metric-value">{{ resumenHoras.registrosVerificados }}</div>
            <div class="afro-metric-label">Registros Verificados</div>
            <div class="metric-icon">
              <v-icon size="32" color="success">mdi-check-all</v-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <v-row>
        <!-- Left Column: Tareas -->
        <v-col cols="12" md="8">
          <!-- Tasks Section -->
          <div class="afro-card-elevated mb-6">
            <div class="card-header pa-4">
              <div class="d-flex align-center justify-space-between">
                <h2 class="afro-heading-4 mb-0">Mis Tareas</h2>
                <v-btn-toggle
                  v-model="taskFilter"
                  mandatory
                  variant="outlined"
                  density="compact"
                >
                  <v-btn value="all" size="small">Todas</v-btn>
                  <v-btn value="pending" size="small">Pendientes</v-btn>
                  <v-btn value="in-progress" size="small">En Progreso</v-btn>
                  <v-btn value="completed" size="small">Completadas</v-btn>
                </v-btn-toggle>
              </div>
            </div>
            <v-divider></v-divider>
            <div class="card-content pa-4">
              <div v-if="loadingTasks" class="text-center py-8">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <div v-else-if="filteredTasks.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1">mdi-format-list-checks</v-icon>
                <p class="text-grey mt-4">No hay tareas {{ taskFilter !== 'all' ? 'con este filtro' : 'asignadas' }}</p>
              </div>
              <div v-else>
                <div
                  v-for="asignacion in filteredTasks"
                  :key="asignacion.id_asignacion"
                  class="task-item mb-4"
                >
                  <v-card variant="outlined" class="task-card">
                    <v-card-text>
                      <div class="d-flex align-start justify-space-between">
                        <div class="flex-grow-1">
                          <div class="d-flex align-center mb-2">
                            <v-chip
                              :color="getPriorityColor(asignacion.tarea?.prioridad)"
                              size="small"
                              variant="tonal"
                              class="mr-2"
                            >
                              {{ asignacion.tarea?.prioridad || 'Media' }}
                            </v-chip>
                            <v-chip
                              :color="getStatusColor(asignacion.tarea?.estado?.id_estado || asignacion.tarea?.id_estado)"
                              size="small"
                              variant="tonal"
                            >
                              {{ asignacion.tarea?.estado?.nombre || 'Pendiente' }}
                            </v-chip>
                          </div>
                          <h4 class="text-h6 mb-2">{{ asignacion.tarea?.descripcion || 'Tarea sin descripción' }}</h4>
                          <div class="text-caption text-grey mb-2">
                            <span v-if="asignacion.tarea?.fase">
                              Fase: {{ asignacion.tarea.fase.nombre }}
                            </span>
                            <span v-if="asignacion.rol" class="ml-2">
                              • Rol: {{ asignacion.rol.nombre }}
                            </span>
                          </div>
                          <div v-if="asignacion.tarea?.fecha_inicio || asignacion.tarea?.fecha_fin" class="text-caption text-grey">
                            <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                            {{ formatDateRange(asignacion.tarea.fecha_inicio, asignacion.tarea.fecha_fin) }}
                          </div>
                        </div>
                        <div class="task-actions ml-4">
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
                              <v-list-item
                                v-for="action in getTaskActions(asignacion.tarea?.estado?.id_estado || asignacion.tarea?.id_estado)"
                                :key="action.value"
                                @click="updateTaskStatus(asignacion.tarea.id_tarea, action.value)"
                              >
                                <template v-slot:prepend>
                                  <v-icon>{{ action.icon }}</v-icon>
                                </template>
                                <v-list-item-title>{{ action.label }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Right Column: Horas y Info -->
        <v-col cols="12" md="4">
          <!-- Register Hours Section -->
          <div class="afro-card-elevated mb-6">
            <div class="card-header pa-4">
              <h2 class="afro-heading-4 mb-0">Registrar Horas</h2>
            </div>
            <v-divider></v-divider>
            <div class="card-content pa-4">
              <v-form ref="horasForm" @submit.prevent="registerHoras">
                <v-text-field
                  v-model="horasForm.fecha"
                  type="date"
                  label="Fecha"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'La fecha es requerida']"
                  class="mb-3"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.number="horasForm.horas_trabajadas"
                  type="number"
                  label="Horas trabajadas"
                  variant="outlined"
                  density="compact"
                  step="0.5"
                  min="0.5"
                  max="24"
                  :rules="[v => !!v || 'Las horas son requeridas', v => v >= 0.5 || 'Mínimo 0.5 horas', v => v <= 24 || 'Máximo 24 horas']"
                  class="mb-3"
                  required
                ></v-text-field>
                <v-select
                  v-model="horasForm.id_tarea"
                  :items="taskOptions"
                  item-title="label"
                  item-value="value"
                  label="Tarea (opcional)"
                  variant="outlined"
                  density="compact"
                  clearable
                  class="mb-3"
                ></v-select>
                <v-textarea
                  v-model="horasForm.descripcion"
                  label="Descripción (opcional)"
                  variant="outlined"
                  density="compact"
                  rows="3"
                  class="mb-3"
                ></v-textarea>
                <v-btn
                  type="submit"
                  color="primary"
                  variant="flat"
                  block
                  :loading="registeringHoras"
                >
                  Registrar Horas
                </v-btn>
              </v-form>
            </div>
          </div>

          <!-- Recent Hours Section -->
          <div class="afro-card-elevated mb-6">
            <div class="card-header pa-4">
              <div class="d-flex align-center justify-space-between">
                <h2 class="afro-heading-4 mb-0">Horas Registradas</h2>
                <v-btn
                  icon="mdi-refresh"
                  variant="text"
                  size="small"
                  @click="refreshHoras"
                ></v-btn>
              </div>
            </div>
            <v-divider></v-divider>
            <div class="card-content pa-4">
              <div v-if="loadingHoras" class="text-center py-4">
                <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
              </div>
              <div v-else-if="horas.length === 0" class="text-center py-4">
                <v-icon size="48" color="grey-lighten-1">mdi-clock-outline</v-icon>
                <p class="text-caption text-grey mt-2">No hay horas registradas</p>
              </div>
              <div v-else>
                <div
                  v-for="hora in horas.slice(0, 5)"
                  :key="hora.id_horas"
                  class="hora-item mb-3"
                >
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-body-2 font-weight-medium">{{ formatDate(hora.fecha) }}</div>
                      <div class="text-caption text-grey">{{ hora.horas_trabajadas }}h</div>
                      <div v-if="hora.tarea" class="text-caption text-grey">{{ hora.tarea.descripcion?.substring(0, 30) }}...</div>
                    </div>
                    <v-chip
                      :color="hora.verificada ? 'success' : 'warning'"
                      size="small"
                      variant="tonal"
                    >
                      {{ hora.verificada ? 'Verificada' : 'Pendiente' }}
                    </v-chip>
                  </div>
                </div>
                <v-btn
                  v-if="horas.length > 5"
                  variant="text"
                  block
                  size="small"
                  @click="showAllHoras = true"
                >
                  Ver todas ({{ horas.length }})
                </v-btn>
              </div>
            </div>
          </div>

          <!-- Project Info -->
          <div class="afro-card-elevated">
            <div class="card-header pa-4">
              <h2 class="afro-heading-4 mb-0">Información del Proyecto</h2>
            </div>
            <v-divider></v-divider>
            <div class="card-content pa-4">
              <div class="info-item mb-3">
                <div class="text-caption text-grey mb-1">Descripción</div>
                <div class="text-body-2">{{ project.descripcion || project.description }}</div>
              </div>
              <div class="info-item mb-3">
                <div class="text-caption text-grey mb-1">Objetivo</div>
                <div class="text-body-2">{{ project.objetivo || project.objective }}</div>
              </div>
              <div class="info-item mb-3">
                <div class="text-caption text-grey mb-1">Ubicación</div>
                <div class="text-body-2">
                  <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                  {{ project.ubicacion || project.location }}
                </div>
              </div>
              <div v-if="project.organizacion" class="info-item">
                <div class="text-caption text-grey mb-1">Organización</div>
                <div class="text-body-2">{{ project.organizacion.nombre }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- All Hours Dialog -->
    <v-dialog v-model="showAllHoras" max-width="800px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-clock</v-icon>
          Todas las Horas Registradas
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="showAllHoras = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <div v-if="horas.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-clock-outline</v-icon>
            <p class="text-grey mt-4">No hay horas registradas</p>
          </div>
          <div v-else>
            <div
              v-for="hora in horas"
              :key="hora.id_horas"
              class="hora-item-full mb-4"
            >
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="text-h6">{{ formatDate(hora.fecha) }}</div>
                    <v-chip
                      :color="hora.verificada ? 'success' : 'warning'"
                      size="small"
                      variant="tonal"
                    >
                      {{ hora.verificada ? 'Verificada' : 'Pendiente' }}
                    </v-chip>
                  </div>
                  <div class="text-body-1 font-weight-medium mb-2">{{ hora.horas_trabajadas }} horas trabajadas</div>
                  <div v-if="hora.tarea" class="text-body-2 text-grey mb-2">
                    Tarea: {{ hora.tarea.descripcion }}
                  </div>
                  <div v-if="hora.descripcion" class="text-body-2">{{ hora.descripcion }}</div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Success/Error Snackbars -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';
import { useHorasVoluntariadasStore } from '@/features/volunteer/stores/horasVoluntariadasStore';
import api from '@/plugins/axios';
import { formatDate, formatDateRange } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';

const route = useRoute();
const router = useRouter();
const volunteerStore = useVolunteerStore();
const horasStore = useHorasVoluntariadasStore();

// Reactive state
const project = ref(null);
const loading = ref(true);
const error = ref(null);
const loadingTasks = ref(false);
const loadingHoras = ref(false);
const registeringHoras = ref(false);
const taskFilter = ref('all');
const showAllHoras = ref(false);
const snackbar = ref({ show: false, message: '', color: 'success' });

// Horas form
const horasForm = ref({
  fecha: new Date().toISOString().split('T')[0],
  horas_trabajadas: null,
  id_tarea: null,
  descripcion: ''
});

// Computed properties
const projectId = computed(() => parseInt(route.params.id));

const projectProgress = computed(() => {
  if (!project.value || !project.value.fases) return 0;
  const allTasks = project.value.fases.flatMap(fase => fase.tareas || []);
  if (allTasks.length === 0) return 0;
  const completedTasks = allTasks.filter(t => {
    const estado = t.estado?.nombre?.toLowerCase() || '';
    return estado.includes('complet') || estado.includes('finaliz');
  }).length;
  return Math.round((completedTasks / allTasks.length) * 100);
});

const personalProgress = computed(() => {
  if (!project.value || !project.value.progresoPersonal) {
    return { tareasAsignadas: 0, tareasCompletadas: 0, porcentajeCompletado: 0 };
  }
  return project.value.progresoPersonal;
});

const resumenHoras = computed(() => {
  if (!project.value || !project.value.resumenHoras) {
    return {
      totalHoras: 0,
      horasVerificadas: 0,
      horasPendientes: 0,
      totalRegistros: 0,
      registrosVerificados: 0,
      registrosPendientes: 0
    };
  }
  return project.value.resumenHoras;
});

const asignaciones = computed(() => {
  return project.value?.asignaciones || [];
});

const filteredTasks = computed(() => {
  if (taskFilter.value === 'all') return asignaciones.value;
  
  return asignaciones.value.filter(a => {
    const estadoId = a.tarea?.estado?.id_estado || a.tarea?.id_estado;
    const estadoNombre = a.tarea?.estado?.nombre?.toLowerCase() || '';
    
    if (taskFilter.value === 'pending') {
      return estadoNombre.includes('pendiente') || estadoNombre.includes('nuevo');
    }
    if (taskFilter.value === 'in-progress') {
      return estadoNombre.includes('progreso') || estadoNombre.includes('en curso');
    }
    if (taskFilter.value === 'completed') {
      return estadoNombre.includes('complet') || estadoNombre.includes('finaliz');
    }
    return true;
  });
});

const taskOptions = computed(() => {
  return asignaciones.value.map(a => ({
    label: a.tarea?.descripcion?.substring(0, 50) || 'Tarea',
    value: a.tarea?.id_tarea
  }));
});

const horas = computed(() => {
  return horasStore.getHorasByProject(projectId.value);
});

// Methods
const loadProject = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/projects/${projectId.value}`);
    project.value = response.data;
    
    // Cargar tareas y horas
    await Promise.all([
      loadTasks(),
      loadHoras()
    ]);
  } catch (err) {
    console.error('Error loading project:', err);
    error.value = err.response?.data?.message || 'Error al cargar el proyecto';
  } finally {
    loading.value = false;
  }
};

const loadTasks = async () => {
  loadingTasks.value = true;
  try {
    await volunteerStore.fetchProjectTasks(projectId.value);
  } catch (err) {
    console.error('Error loading tasks:', err);
  } finally {
    loadingTasks.value = false;
  }
};

const loadHoras = async () => {
  loadingHoras.value = true;
  try {
    await horasStore.fetchHorasByProject(projectId.value);
    await horasStore.fetchResumenByProject(projectId.value);
  } catch (err) {
    console.error('Error loading horas:', err);
  } finally {
    loadingHoras.value = false;
  }
};

const refreshHoras = () => {
  loadHoras();
};

const registerHoras = async () => {
  if (!horasForm.value.fecha || !horasForm.value.horas_trabajadas) {
    showSnackbar('Por favor completa todos los campos requeridos', 'error');
    return;
  }

  registeringHoras.value = true;
  try {
    await horasStore.registerHoras({
      id_proyecto: projectId.value,
      fecha: horasForm.value.fecha,
      horas_trabajadas: parseFloat(horasForm.value.horas_trabajadas),
      id_tarea: horasForm.value.id_tarea || null,
      descripcion: horasForm.value.descripcion || null
    });

    // Reset form
    horasForm.value = {
      fecha: new Date().toISOString().split('T')[0],
      horas_trabajadas: null,
      id_tarea: null,
      descripcion: ''
    };

    showSnackbar('Horas registradas correctamente', 'success');
    
    // Reload project to update resumen
    await loadProject();
  } catch (err) {
    console.error('Error registering horas:', err);
    showSnackbar(err.response?.data?.message || 'Error al registrar las horas', 'error');
  } finally {
    registeringHoras.value = false;
  }
};

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    await volunteerStore.updateTaskStatus(taskId, newStatus);
    showSnackbar('Estado de tarea actualizado', 'success');
    await loadProject();
  } catch (err) {
    console.error('Error updating task status:', err);
    showSnackbar(err.response?.data?.message || 'Error al actualizar la tarea', 'error');
  }
};

const getTaskActions = (estadoId) => {
  // This should return available status transitions based on current state
  // For now, return common actions
  return [
    { label: 'Marcar como En Progreso', value: 2, icon: 'mdi-play' },
    { label: 'Marcar como Completada', value: 3, icon: 'mdi-check' }
  ];
};

const getStatusColor = (estadoId) => {
  if (!estadoId) return 'grey';
  // Map estado IDs to colors (adjust based on your estado table)
  const colorMap = {
    1: 'success', // Activo
    2: 'info', // En progreso
    3: 'success', // Completado
    4: 'warning', // Pausado
    5: 'error' // Cancelado
  };
  return colorMap[estadoId] || 'grey';
};

const getStatusText = (estadoId) => {
  if (!estadoId) return 'Desconocido';
  // This should fetch from estado table, for now use a map
  const textMap = {
    1: 'Activo',
    2: 'En Progreso',
    3: 'Completado',
    4: 'Pausado',
    5: 'Cancelado'
  };
  return textMap[estadoId] || 'Desconocido';
};

const getPriorityColor = (prioridad) => {
  const colorMap = {
    'Alta': 'error',
    'Media': 'warning',
    'Baja': 'info'
  };
  return colorMap[prioridad] || 'grey';
};

const showSnackbar = (message, color = 'success') => {
  snackbar.value = { show: true, message, color };
};

const goBack = () => {
  router.push(ROUTES.VOLUNTEER.MY_PROJECTS);
};

// Lifecycle
onMounted(() => {
  loadProject();
});
</script>

<style scoped>
.volunteer-workspace-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.workspace-header {
  padding: 24px;
}

.roles-section {
  margin-top: 16px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.task-item {
  transition: transform 0.2s;
}

.task-item:hover {
  transform: translateY(-2px);
}

.task-card {
  cursor: pointer;
}

.hora-item {
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
}

.hora-item-full {
  transition: transform 0.2s;
}

.hora-item-full:hover {
  transform: translateY(-2px);
}

.info-item {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.card-content {
  min-height: 100px;
}
</style>

