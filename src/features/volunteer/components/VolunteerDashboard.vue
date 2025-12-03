<template>
  <div class="volunteer-dashboard">
    <!-- Welcome Header -->
    <ProfessionalCard
      title="¡Bienvenido de vuelta!"
      :subtitle="`${user?.nombre || 'Voluntario'}`"
      header-icon="mdi-hand-wave"
      header-icon-color="warning"
      class="mb-6"
      variant="tonal"
      color="primary"
    >
      <template #headerActions>
        <v-chip
          :color="volunteerStatusColor"
          variant="tonal"
          size="small"
        >
          <v-icon start size="small">{{ volunteerStatusIcon }}</v-icon>
          {{ volunteerStatusText }}
        </v-chip>
      </template>

      <v-row>
        <v-col cols="12" md="8">
          <p class="text-body-1 mb-4">
            Aquí tienes un resumen de tu actividad como voluntario y las próximas tareas pendientes.
          </p>
          
          <!-- Quick Stats -->
          <div class="quick-stats">
            <v-row>
              <v-col cols="6" sm="3">
                <div class="stat-item">
                  <v-icon color="success" size="large">mdi-check-circle</v-icon>
                  <div class="stat-content">
                    <h3 class="stat-number">{{ stats.completedTasks }}</h3>
                    <p class="stat-label">Tareas Completadas</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="stat-item">
                  <v-icon color="info" size="large">mdi-progress-clock</v-icon>
                  <div class="stat-content">
                    <h3 class="stat-number">{{ stats.activeTasks }}</h3>
                    <p class="stat-label">Tareas Activas</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="stat-item">
                  <v-icon color="warning" size="large">mdi-clock</v-icon>
                  <div class="stat-content">
                    <h3 class="stat-number">{{ stats.totalHours }}</h3>
                    <p class="stat-label">Horas Registradas</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="stat-item">
                  <v-icon color="primary" size="large">mdi-folder-multiple</v-icon>
                  <div class="stat-content">
                    <h3 class="stat-number">{{ stats.activeProjects }}</h3>
                    <p class="stat-label">Proyectos Activos</p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        
        <v-col cols="12" md="4">
          <!-- Quick Actions -->
          <div class="quick-actions">
            <h4 class="text-subtitle-1 font-weight-medium mb-3">Acciones Rápidas</h4>
            <v-btn
              color="primary"
              variant="elevated"
              block
              class="mb-2"
              @click="navigateToProjects"
            >
              <v-icon start>mdi-folder-open</v-icon>
              Ver Mis Proyectos
            </v-btn>
            <v-btn
              color="success"
              variant="outlined"
              block
              class="mb-2"
              @click="openHoursDialog"
            >
              <v-icon start>mdi-clock-plus</v-icon>
              Registrar Horas
            </v-btn>
            <v-btn
              color="info"
              variant="outlined"
              block
              @click="navigateToOrganizations"
            >
              <v-icon start>mdi-domain</v-icon>
              Explorar Organizaciones
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </ProfessionalCard>

    <!-- Main Content Grid -->
    <v-row>
      <!-- Left Column -->
      <v-col cols="12" lg="8">
        <!-- Active Projects -->
        <ProfessionalCard
          title="Mis Proyectos Activos"
          header-icon="mdi-folder-multiple"
          class="mb-6"
          :loading="loadingProjects"
          :empty="activeProjects.length === 0"
          empty-title="Sin proyectos activos"
          empty-text="No tienes proyectos activos en este momento. ¡Explora organizaciones para unirte a nuevos proyectos!"
          empty-icon="mdi-folder-plus"
        >
          <template #headerActions>
            <v-btn
              icon="mdi-refresh"
              size="small"
              variant="text"
              @click="refreshProjects"
            />
          </template>

          <template #emptyActions>
            <v-btn
              color="primary"
              variant="elevated"
              @click="navigateToOrganizations"
            >
              <v-icon start>mdi-magnify</v-icon>
              Explorar Proyectos
            </v-btn>
          </template>

          <div v-if="activeProjects.length > 0" class="projects-grid">
            <ProjectCard
              v-for="project in activeProjects"
              :key="project.id_proyecto"
              :project="project"
              :show-organization="true"
              :show-role="true"
              class="mb-4"
              @click="navigateToProject(project)"
            />
          </div>
        </ProfessionalCard>

        <!-- Pending Tasks -->
        <ProfessionalCard
          title="Tareas Pendientes"
          header-icon="mdi-format-list-checks"
          class="mb-6"
          :loading="loadingTasks"
          :empty="pendingTasks.length === 0"
          empty-title="Sin tareas pendientes"
          empty-text="¡Excelente! No tienes tareas pendientes en este momento."
          empty-icon="mdi-check-all"
        >
          <template #headerActions>
            <v-chip
              v-if="urgentTasks > 0"
              color="error"
              size="small"
              variant="tonal"
            >
              {{ urgentTasks }} urgente{{ urgentTasks !== 1 ? 's' : '' }}
            </v-chip>
          </template>

          <div v-if="pendingTasks.length > 0">
            <TaskCard
              v-for="task in pendingTasks.slice(0, 5)"
              :key="task.id_tarea"
              :task="task"
              :show-project="true"
              :show-phase="true"
              class="mb-3"
              @click="navigateToTask(task)"
              @status-changed="handleTaskStatusChange"
            />
            
            <v-btn
              v-if="pendingTasks.length > 5"
              variant="text"
              block
              @click="navigateToAllTasks"
            >
              Ver todas las tareas ({{ pendingTasks.length - 5 }} más)
            </v-btn>
          </div>
        </ProfessionalCard>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" lg="4">
        <!-- Recent Activity -->
        <ProfessionalCard
          title="Actividad Reciente"
          header-icon="mdi-history"
          class="mb-6"
          :loading="loadingActivity"
          :empty="recentActivity.length === 0"
          empty-title="Sin actividad reciente"
          empty-text="Tu actividad aparecerá aquí cuando realices acciones en los proyectos."
          empty-icon="mdi-timeline"
        >
          <div v-if="recentActivity.length > 0" class="activity-list">
            <div
              v-for="activity in recentActivity.slice(0, 8)"
              :key="activity.id"
              class="activity-item"
            >
              <v-avatar
                :color="activity.color"
                size="32"
                class="mr-3"
              >
                <v-icon color="white" size="small">{{ activity.icon }}</v-icon>
              </v-avatar>
              <div class="activity-content">
                <p class="activity-text">{{ activity.description }}</p>
                <p class="activity-time">{{ formatRelativeTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </ProfessionalCard>

        <!-- Upcoming Deadlines -->
        <ProfessionalCard
          title="Próximas Fechas Límite"
          header-icon="mdi-calendar-alert"
          class="mb-6"
          :empty="upcomingDeadlines.length === 0"
          empty-title="Sin fechas límite próximas"
          empty-text="No tienes tareas con fechas límite en los próximos días."
          empty-icon="mdi-calendar-check"
        >
          <div v-if="upcomingDeadlines.length > 0" class="deadlines-list">
            <div
              v-for="deadline in upcomingDeadlines"
              :key="deadline.id"
              class="deadline-item"
              :class="{ 'deadline-urgent': deadline.isUrgent }"
            >
              <div class="deadline-date">
                <div class="date-number">{{ deadline.dayNumber }}</div>
                <div class="date-month">{{ deadline.monthName }}</div>
              </div>
              <div class="deadline-content">
                <h4 class="deadline-title">{{ deadline.title }}</h4>
                <p class="deadline-project">{{ deadline.project }}</p>
                <v-chip
                  :color="deadline.priorityColor"
                  size="x-small"
                  variant="tonal"
                >
                  {{ deadline.priority }}
                </v-chip>
              </div>
              <div class="deadline-actions">
                <v-btn
                  icon="mdi-arrow-right"
                  size="small"
                  variant="text"
                  @click="navigateToTask(deadline)"
                />
              </div>
            </div>
          </div>
        </ProfessionalCard>

        <!-- Achievements -->
        <ProfessionalCard
          title="Logros Recientes"
          header-icon="mdi-trophy"
          :empty="achievements.length === 0"
          empty-title="Sin logros aún"
          empty-text="Completa tareas y proyectos para desbloquear logros."
          empty-icon="mdi-medal"
        >
          <div v-if="achievements.length > 0" class="achievements-list">
            <div
              v-for="achievement in achievements.slice(0, 3)"
              :key="achievement.id"
              class="achievement-item"
            >
              <v-avatar
                :color="achievement.color"
                size="40"
                class="mr-3"
              >
                <v-icon color="white">{{ achievement.icon }}</v-icon>
              </v-avatar>
              <div class="achievement-content">
                <h4 class="achievement-title">{{ achievement.name }}</h4>
                <p class="achievement-description">{{ achievement.description }}</p>
                <p class="achievement-date">{{ formatDate(achievement.date) }}</p>
              </div>
            </div>
          </div>
        </ProfessionalCard>
      </v-col>
    </v-row>

    <!-- Quick Hours Registration Dialog -->
    <QuickHoursDialog
      v-model="hoursDialog"
      :projects="activeProjects"
      @hours-registered="handleHoursRegistered"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useNotifications } from '@/composables/useNotifications';
import ProfessionalCard from '@/components/ui/ProfessionalCard.vue';
import ProjectCard from '../components/ProjectCard.vue';
import TaskCard from '../components/TaskCard.vue';
import QuickHoursDialog from '../components/QuickHoursDialog.vue';
import api from '@/plugins/axios';

// Composables
const router = useRouter();
const authStore = useAuthStore();
const { showSuccess, showError } = useNotifications();

// Reactive data
const loadingProjects = ref(true);
const loadingTasks = ref(true);
const loadingActivity = ref(true);
const hoursDialog = ref(false);

const activeProjects = ref([]);
const pendingTasks = ref([]);
const recentActivity = ref([]);
const upcomingDeadlines = ref([]);
const achievements = ref([]);

// Computed
const user = computed(() => authStore.user);

const stats = computed(() => ({
  completedTasks: pendingTasks.value.filter(t => t.id_estado === 3).length,
  activeTasks: pendingTasks.value.filter(t => t.id_estado === 2).length,
  totalHours: 42, // This should come from API
  activeProjects: activeProjects.value.length
}));

const volunteerStatusColor = computed(() => {
  if (stats.value.activeTasks > 0) return 'success';
  if (stats.value.activeProjects > 0) return 'info';
  return 'grey';
});

const volunteerStatusIcon = computed(() => {
  if (stats.value.activeTasks > 0) return 'mdi-account-check';
  if (stats.value.activeProjects > 0) return 'mdi-account-clock';
  return 'mdi-account';
});

const volunteerStatusText = computed(() => {
  if (stats.value.activeTasks > 0) return 'Activo';
  if (stats.value.activeProjects > 0) return 'Disponible';
  return 'Inactivo';
});

const urgentTasks = computed(() => {
  return pendingTasks.value.filter(task => {
    const deadline = new Date(task.fecha_fin);
    const today = new Date();
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  }).length;
});

// Methods
const loadDashboardData = async () => {
  try {
    await Promise.all([
      loadActiveProjects(),
      loadPendingTasks(),
      loadRecentActivity(),
      loadUpcomingDeadlines(),
      loadAchievements()
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showError('Error al cargar los datos del dashboard');
  }
};

const loadActiveProjects = async () => {
  try {
    loadingProjects.value = true;
    const response = await api.get('/proyecto/voluntario/mis-proyectos');
    activeProjects.value = response.data || [];
  } catch (error) {
    console.error('Error loading projects:', error);
  } finally {
    loadingProjects.value = false;
  }
};

const loadPendingTasks = async () => {
  try {
    loadingTasks.value = true;
    const response = await api.get('/asignacion/voluntario/mis-tareas');
    pendingTasks.value = response.data || [];
  } catch (error) {
    console.error('Error loading tasks:', error);
  } finally {
    loadingTasks.value = false;
  }
};

const loadRecentActivity = async () => {
  try {
    loadingActivity.value = true;
    // Mock data - replace with actual API call
    recentActivity.value = [
      {
        id: 1,
        description: 'Completaste la tarea "Preparar materiales"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: 'mdi-check-circle',
        color: 'success'
      },
      {
        id: 2,
        description: 'Te uniste al proyecto "Jornada de vacunación"',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        icon: 'mdi-account-plus',
        color: 'primary'
      },
      {
        id: 3,
        description: 'Registraste 4 horas de trabajo',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        icon: 'mdi-clock-plus',
        color: 'info'
      }
    ];
  } catch (error) {
    console.error('Error loading activity:', error);
  } finally {
    loadingActivity.value = false;
  }
};

const loadUpcomingDeadlines = async () => {
  try {
    // Mock data - replace with actual API call
    upcomingDeadlines.value = [
      {
        id: 1,
        title: 'Entrega de informe',
        project: 'Jornada de vacunación',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'Alta',
        priorityColor: 'error',
        isUrgent: true,
        dayNumber: '28',
        monthName: 'Nov'
      }
    ];
  } catch (error) {
    console.error('Error loading deadlines:', error);
  }
};

const loadAchievements = async () => {
  try {
    // Mock data - replace with actual API call
    achievements.value = [
      {
        id: 1,
        name: 'Primera Tarea',
        description: 'Completaste tu primera tarea',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        icon: 'mdi-star',
        color: 'warning'
      }
    ];
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
};

const refreshProjects = async () => {
  await loadActiveProjects();
  showSuccess('Proyectos actualizados');
};

const navigateToProjects = () => {
  router.push('/volunteer/projects');
};

const navigateToOrganizations = () => {
  router.push('/volunteer/organizations');
};

const navigateToProject = (project) => {
  router.push(`/volunteer/projects/${project.id_proyecto}`);
};

const navigateToTask = (task) => {
  router.push(`/volunteer/projects/${task.proyecto?.id_proyecto || task.id_proyecto}/tasks/${task.id_tarea}`);
};

const navigateToAllTasks = () => {
  router.push('/volunteer/tasks');
};

const openHoursDialog = () => {
  hoursDialog.value = true;
};

const handleTaskStatusChange = (taskId, newStatus) => {
  const task = pendingTasks.value.find(t => t.id_tarea === taskId);
  if (task) {
    task.id_estado = newStatus;
    showSuccess('Estado de tarea actualizado');
  }
};

const handleHoursRegistered = (hoursData) => {
  showSuccess(`${hoursData.hours} horas registradas exitosamente`);
  // Refresh stats or relevant data
};

const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${days}d`;
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short'
  }).format(date);
};

// Lifecycle
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.volunteer-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* Quick Stats */
.quick-stats {
  margin-top: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.5);
  border: 1px solid rgba(var(--v-border-color), 0.1);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 4px 0 0 0;
  line-height: 1;
}

/* Quick Actions */
.quick-actions {
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

/* Activity List */
.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.activity-time {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin: 0;
}

/* Deadlines */
.deadlines-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deadline-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.5);
  border: 1px solid rgba(var(--v-border-color), 0.1);
  transition: all 0.2s ease;
}

.deadline-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.deadline-urgent {
  background: rgba(var(--v-theme-error), 0.05);
  border-color: rgba(var(--v-theme-error), 0.2);
}

.deadline-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  min-width: 50px;
}

.date-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1;
}

.date-month {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  text-transform: uppercase;
  line-height: 1;
}

.deadline-content {
  flex: 1;
}

.deadline-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.deadline-project {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 0 0 8px 0;
}

/* Achievements */
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 4px 0;
}

.achievement-description {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.achievement-date {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .volunteer-dashboard {
    padding: 16px;
  }
  
  .stat-item {
    padding: 8px;
    gap: 8px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .quick-actions {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .volunteer-dashboard {
    padding: 12px;
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: 4px;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .deadline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .deadline-date {
    flex-direction: row;
    gap: 4px;
    margin-right: 0;
  }
}
</style>

