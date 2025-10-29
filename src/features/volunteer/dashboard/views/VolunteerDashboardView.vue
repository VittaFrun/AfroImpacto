<template>
  <div class="afro-volunteer-dashboard">
    <!-- Dashboard Header -->
    <div class="afro-dashboard-header">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h1 class="afro-heading-2 mb-2">Mi Dashboard</h1>
          <p class="afro-body-small">
            Bienvenido de vuelta, {{ volunteer?.name || 'Voluntario' }}
          </p>
        </div>
        <div class="dashboard-actions">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-magnify"
            class="professional-primary-btn"
            @click="browseProjects"
          >
            Explorar Proyectos
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Personal Stats Row -->
    <div class="afro-metrics-row">
      <div class="afro-grid afro-grid-4">
        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-header">
            <div class="metric-icon primary">
              <v-icon color="white">mdi-folder-heart</v-icon>
            </div>
            <div class="metric-trend success">
              <v-icon size="16">mdi-trending-up</v-icon>
              +3
            </div>
          </div>
          <div class="metric-content">
            <div class="afro-metric-value">{{ stats.projects.total }}</div>
            <div class="afro-metric-label">Proyectos Participando</div>
            <div class="metric-detail">
              <span class="text-primary">{{ stats.projects.active }} activos</span>
              <span class="text-grey">•</span>
              <span class="text-grey">{{ stats.projects.completed }} completados</span>
            </div>
          </div>
        </div>

        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-header">
            <div class="metric-icon success">
              <v-icon color="white">mdi-check-circle</v-icon>
            </div>
            <div class="metric-trend success">
              <v-icon size="16">mdi-trending-up</v-icon>
              +5
            </div>
          </div>
          <div class="metric-content">
            <div class="afro-metric-value">{{ stats.tasks.completed }}</div>
            <div class="afro-metric-label">Tareas Completadas</div>
            <div class="metric-detail">
              <span class="text-success">{{ stats.tasks.pending }} pendientes</span>
              <span class="text-grey">•</span>
              <span class="text-grey">Este mes</span>
            </div>
          </div>
        </div>

        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-header">
            <div class="metric-icon info">
              <v-icon color="white">mdi-clock-time-four</v-icon>
            </div>
            <div class="metric-trend success">
              <v-icon size="16">mdi-trending-up</v-icon>
              +12h
            </div>
          </div>
          <div class="metric-content">
            <div class="afro-metric-value">{{ stats.hours.total }}h</div>
            <div class="afro-metric-label">Horas Voluntariado</div>
            <div class="metric-detail">
              <span class="text-info">{{ stats.hours.thisMonth }}h este mes</span>
              <span class="text-grey">•</span>
              <span class="text-grey">Meta: {{ stats.hours.goal }}h</span>
            </div>
          </div>
        </div>

        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-header">
            <div class="metric-icon warning">
              <v-icon color="white">mdi-trophy</v-icon>
            </div>
            <div class="metric-trend success">
              <v-icon size="16">mdi-trending-up</v-icon>
              +2
            </div>
          </div>
          <div class="metric-content">
            <div class="afro-metric-value">{{ stats.achievements.total }}</div>
            <div class="afro-metric-label">Logros Obtenidos</div>
            <div class="metric-detail">
              <span class="text-warning">{{ stats.achievements.recent }} recientes</span>
              <span class="text-grey">•</span>
              <span class="text-grey">Este año</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="afro-dashboard-content">
      <div class="afro-grid afro-grid-3">
        <!-- My Active Projects -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Mis Proyectos Activos</h3>
            <v-btn
              variant="text"
              size="small"
              @click="viewAllProjects"
            >
              Ver todos
            </v-btn>
          </div>
          <div class="card-content">
            <div v-if="activeProjects.length === 0" class="afro-empty-state">
              <div class="afro-empty-state-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-folder-heart-outline</v-icon>
              </div>
              <div class="afro-empty-state-title">No hay proyectos activos</div>
              <div class="afro-empty-state-description">
                Explora proyectos disponibles para comenzar
              </div>
              <v-btn
                color="primary"
                variant="outlined"
                @click="browseProjects"
                class="mt-4"
              >
                Explorar Proyectos
              </v-btn>
            </div>
            <div v-else class="project-list">
              <div
                v-for="project in activeProjects"
                :key="project.id"
                class="project-item"
                @click="viewProject(project.id)"
              >
                <div class="project-info">
                  <h4 class="project-title">{{ project.name }}</h4>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-meta">
                    <span class="afro-status-success">{{ project.organization }}</span>
                    <span class="project-role">{{ project.role }}</span>
                  </div>
                </div>
                <div class="project-progress">
                  <v-progress-circular
                    :model-value="project.progress"
                    size="40"
                    width="4"
                    color="primary"
                  >
                    {{ project.progress }}%
                  </v-progress-circular>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Tasks -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Próximas Tareas</h3>
            <v-btn
              variant="text"
              size="small"
              @click="viewTasks"
            >
              Ver todas
            </v-btn>
          </div>
          <div class="card-content">
            <div v-if="upcomingTasks.length === 0" class="afro-empty-state">
              <div class="afro-empty-state-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-format-list-checks</v-icon>
              </div>
              <div class="afro-empty-state-title">Sin tareas pendientes</div>
              <div class="afro-empty-state-description">
                Las tareas asignadas aparecerán aquí
              </div>
            </div>
            <div v-else class="task-list">
              <div
                v-for="task in upcomingTasks"
                :key="task.id"
                class="task-item"
                @click="viewTask(task.id)"
              >
                <div class="task-info">
                  <h4 class="task-title">{{ task.title }}</h4>
                  <p class="task-project">{{ task.projectName }}</p>
                  <div class="task-meta">
                    <span class="task-priority" :class="getPriorityClass(task.priority)">
                      {{ task.priority }}
                    </span>
                    <span class="task-deadline">{{ formatDate(task.deadline) }}</span>
                  </div>
                </div>
                <div class="task-status">
                  <v-chip
                    :color="getTaskStatusColor(task.status)"
                    size="small"
                    variant="tonal"
                  >
                    {{ task.status }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Acciones Rápidas</h3>
          </div>
          <div class="card-content">
            <div class="quick-actions-grid">
              <v-btn
                v-for="action in quickActions"
                :key="action.name"
                :color="action.color"
                :variant="action.variant"
                block
                class="mb-3 professional-action-btn"
                @click="action.handler"
              >
                <v-icon start>{{ action.icon }}</v-icon>
                {{ action.label }}
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="afro-grid afro-grid-2 mt-6">
        <!-- Recent Activity -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Actividad Reciente</h3>
            <v-btn
              variant="text"
              size="small"
              @click="viewActivity"
            >
              Ver historial
            </v-btn>
          </div>
          <div class="card-content">
            <div v-if="recentActivity.length === 0" class="afro-empty-state">
              <div class="afro-empty-state-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-history</v-icon>
              </div>
              <div class="afro-empty-state-title">Sin actividad</div>
              <div class="afro-empty-state-description">
                Tu actividad aparecerá aquí
              </div>
            </div>
            <div v-else class="activity-list">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="activity-item"
              >
                <div class="activity-icon" :class="getActivityIconClass(activity.type)">
                  <v-icon :color="getActivityIconColor(activity.type)">
                    {{ getActivityIcon(activity.type) }}
                  </v-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{ activity.description }}</div>
                  <div class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills & Achievements -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Mis Habilidades</h3>
            <v-btn
              variant="text"
              size="small"
              @click="manageSkills"
            >
              Gestionar
            </v-btn>
          </div>
          <div class="card-content">
            <div v-if="skills.length === 0" class="afro-empty-state">
              <div class="afro-empty-state-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-school-outline</v-icon>
              </div>
              <div class="afro-empty-state-title">Sin habilidades registradas</div>
              <div class="afro-empty-state-description">
                Agrega tus habilidades para mejores coincidencias
              </div>
              <v-btn
                color="primary"
                variant="outlined"
                @click="addSkill"
                class="mt-4"
              >
                Agregar Habilidad
              </v-btn>
            </div>
            <div v-else class="skills-list">
              <div
                v-for="skill in skills"
                :key="skill.id"
                class="skill-item"
              >
                <div class="skill-info">
                  <div class="skill-name">{{ skill.name }}</div>
                  <div class="skill-level">{{ skill.level }}</div>
                </div>
                <div class="skill-progress">
                  <v-progress-linear
                    :model-value="skill.progress"
                    height="6"
                    :color="getSkillColor(skill.level)"
                    rounded
                  ></v-progress-linear>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/features/auth/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

// Mock data - replace with real data from stores
const volunteer = ref({
  name: 'María González',
  id: 1
});

const stats = ref({
  projects: {
    total: 5,
    active: 3,
    completed: 2
  },
  tasks: {
    completed: 24,
    pending: 6
  },
  hours: {
    total: 156,
    thisMonth: 32,
    goal: 40
  },
  achievements: {
    total: 8,
    recent: 2
  }
});

const activeProjects = ref([
  {
    id: 1,
    name: 'Educación Comunitaria',
    description: 'Programa de alfabetización para adultos',
    organization: 'Fundación Esperanza',
    role: 'Coordinador',
    progress: 75
  },
  {
    id: 2,
    name: 'Salud Preventiva',
    description: 'Campaña de vacunación infantil',
    organization: 'Salud para Todos',
    role: 'Voluntario',
    progress: 45
  },
  {
    id: 3,
    name: 'Desarrollo Económico',
    description: 'Talleres de emprendimiento',
    organization: 'Emprende Juntos',
    role: 'Facilitador',
    progress: 90
  }
]);

const upcomingTasks = ref([
  {
    id: 1,
    title: 'Preparar material educativo',
    projectName: 'Educación Comunitaria',
    priority: 'Alta',
    status: 'Pendiente',
    deadline: new Date('2024-02-20')
  },
  {
    id: 2,
    title: 'Coordinar sesión de vacunación',
    projectName: 'Salud Preventiva',
    priority: 'Media',
    status: 'En Progreso',
    deadline: new Date('2024-02-22')
  },
  {
    id: 3,
    title: 'Evaluar participantes',
    projectName: 'Desarrollo Económico',
    priority: 'Baja',
    status: 'Pendiente',
    deadline: new Date('2024-02-25')
  }
]);

const recentActivity = ref([
  {
    id: 1,
    type: 'task_completed',
    description: 'Completaste la tarea "Revisar materiales"',
    timestamp: new Date('2024-02-15T14:30:00')
  },
  {
    id: 2,
    type: 'project_joined',
    description: 'Te uniste al proyecto "Salud Preventiva"',
    timestamp: new Date('2024-02-14T10:15:00')
  },
  {
    id: 3,
    type: 'achievement',
    description: '¡Obtuviste el logro "Primer Proyecto"!',
    timestamp: new Date('2024-02-13T16:45:00')
  },
  {
    id: 4,
    type: 'message',
    description: 'Recibiste un mensaje de Fundación Esperanza',
    timestamp: new Date('2024-02-12T09:20:00')
  }
]);

const skills = ref([
  {
    id: 1,
    name: 'Educación',
    level: 'Experto',
    progress: 90
  },
  {
    id: 2,
    name: 'Comunicación',
    level: 'Intermedio',
    progress: 70
  },
  {
    id: 3,
    name: 'Organización',
    level: 'Avanzado',
    progress: 85
  },
  {
    id: 4,
    name: 'Liderazgo',
    level: 'Intermedio',
    progress: 60
  }
]);

const quickActions = computed(() => [
  {
    name: 'browse-projects',
    label: 'Explorar Proyectos',
    icon: 'mdi-magnify',
    color: 'primary',
    variant: 'outlined',
    handler: () => router.push('/volunteer/catalog')
  },
  {
    name: 'update-availability',
    label: 'Actualizar Disponibilidad',
    icon: 'mdi-calendar-check',
    color: 'success',
    variant: 'outlined',
    handler: () => router.push('/volunteer/availability')
  },
  {
    name: 'add-skill',
    label: 'Agregar Habilidad',
    icon: 'mdi-school',
    color: 'info',
    variant: 'outlined',
    handler: () => router.push('/volunteer/skills/add')
  },
  {
    name: 'view-certificates',
    label: 'Ver Certificados',
    icon: 'mdi-certificate',
    color: 'warning',
    variant: 'outlined',
    handler: () => router.push('/volunteer/certificates')
  }
]);

// Methods
const browseProjects = () => {
  router.push('/volunteer/catalog');
};

const viewAllProjects = () => {
  router.push('/volunteer/my-projects');
};

const viewProject = (projectId) => {
  router.push(`/volunteer/projects/${projectId}`);
};

const viewTasks = () => {
  router.push('/volunteer/tasks');
};

const viewTask = (taskId) => {
  router.push(`/volunteer/tasks/${taskId}`);
};

const viewActivity = () => {
  router.push('/volunteer/activity');
};

const manageSkills = () => {
  router.push('/volunteer/skills');
};

const addSkill = () => {
  router.push('/volunteer/skills/add');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO');
};

const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Hace unos minutos';
  if (hours < 24) return `Hace ${hours} horas`;
  
  const days = Math.floor(hours / 24);
  return `Hace ${days} días`;
};

const getPriorityClass = (priority) => {
  const classMap = {
    'Alta': 'priority-high',
    'Media': 'priority-medium',
    'Baja': 'priority-low'
  };
  return classMap[priority] || '';
};

const getTaskStatusColor = (status) => {
  const colorMap = {
    'Pendiente': 'warning',
    'En Progreso': 'info',
    'Completada': 'success'
  };
  return colorMap[status] || 'grey';
};

const getActivityIcon = (type) => {
  const iconMap = {
    'task_completed': 'mdi-check-circle',
    'project_joined': 'mdi-account-plus',
    'achievement': 'mdi-trophy',
    'message': 'mdi-message'
  };
  return iconMap[type] || 'mdi-circle';
};

const getActivityIconColor = (type) => {
  const colorMap = {
    'task_completed': 'success',
    'project_joined': 'primary',
    'achievement': 'warning',
    'message': 'info'
  };
  return colorMap[type] || 'grey';
};

const getActivityIconClass = (type) => {
  return `activity-icon-${type}`;
};

const getSkillColor = (level) => {
  const colorMap = {
    'Principiante': 'error',
    'Intermedio': 'warning',
    'Avanzado': 'info',
    'Experto': 'success'
  };
  return colorMap[level] || 'grey';
};

onMounted(() => {
  // Load volunteer dashboard data
});
</script>

<style scoped>
.afro-volunteer-dashboard {
  padding: var(--afro-space-lg);
  background: var(--afro-background);
  min-height: 100vh;
}

/* Dashboard Header */
.afro-dashboard-header {
  margin-bottom: var(--afro-space-xl);
}

.dashboard-actions {
  display: flex;
  gap: var(--afro-space-md);
}

/* Metrics Row */
.afro-metrics-row {
  margin-bottom: var(--afro-space-xl);
}

.afro-metric-card {
  padding: var(--afro-space-lg);
  position: relative;
  overflow: hidden;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-md);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--afro-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon.primary {
  background: var(--afro-primary);
}

.metric-icon.success {
  background: var(--afro-success);
}

.metric-icon.info {
  background: var(--afro-info);
}

.metric-icon.warning {
  background: var(--afro-warning);
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: var(--afro-space-xs);
  font-size: var(--afro-text-sm);
  font-weight: 600;
}

.metric-trend.success {
  color: var(--afro-success);
}

.metric-content {
  text-align: left;
}

.metric-detail {
  margin-top: var(--afro-space-sm);
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

/* Card Styles */
.afro-card {
  padding: var(--afro-space-lg);
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-lg);
  padding-bottom: var(--afro-space-md);
  border-bottom: 1px solid var(--afro-border);
}

.card-content {
  height: calc(100% - 60px);
}

/* Project List */
.project-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--afro-space-md);
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-md);
  cursor: pointer;
  transition: all var(--afro-transition-fast);
}

.project-item:hover {
  border-color: var(--afro-primary);
  background: var(--afro-primary-50);
}

.project-info {
  flex: 1;
}

.project-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.project-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-sm);
  line-height: 1.4;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: var(--afro-space-sm);
}

.project-role {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

.project-progress {
  margin-left: var(--afro-space-md);
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--afro-space-md);
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-md);
  cursor: pointer;
  transition: all var(--afro-transition-fast);
}

.task-item:hover {
  border-color: var(--afro-primary);
  background: var(--afro-primary-50);
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.task-project {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-sm);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: var(--afro-space-sm);
}

.task-priority {
  font-size: var(--afro-text-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.priority-high {
  background: var(--afro-error);
  color: white;
}

.priority-medium {
  background: var(--afro-warning);
  color: white;
}

.priority-low {
  background: var(--afro-success);
  color: white;
}

.task-deadline {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

.task-status {
  margin-left: var(--afro-space-md);
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: var(--afro-space-sm);
  border-radius: var(--afro-radius-md);
  transition: all var(--afro-transition-fast);
}

.activity-item:hover {
  background: var(--afro-secondary-50);
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--afro-space-sm);
}

.activity-icon-task_completed {
  background: var(--afro-success);
}

.activity-icon-project_joined {
  background: var(--afro-primary);
}

.activity-icon-achievement {
  background: var(--afro-warning);
}

.activity-icon-message {
  background: var(--afro-info);
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.activity-time {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

/* Skills List */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.skill-item {
  padding: var(--afro-space-sm);
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-md);
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-sm);
}

.skill-name {
  font-size: var(--afro-text-sm);
  font-weight: 600;
  color: var(--afro-text-primary);
}

.skill-level {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

.skill-progress {
  margin-top: var(--afro-space-xs);
}

/* Quick Actions */
.quick-actions-grid {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-sm);
}

/* Responsive Design */
@media (max-width: 768px) {
  .afro-volunteer-dashboard {
    padding: var(--afro-space-md);
  }
  
  .afro-metrics-row .afro-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .afro-dashboard-content .afro-grid-3 {
    grid-template-columns: 1fr;
  }
  
  .afro-dashboard-content .afro-grid-2 {
    grid-template-columns: 1fr;
  }
  
  .project-item,
  .task-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-progress,
  .task-status {
    margin-left: 0;
    margin-top: var(--afro-space-md);
    align-self: center;
  }
}

@media (max-width: 480px) {
  .afro-metrics-row .afro-grid-4 {
    grid-template-columns: 1fr;
  }
  
  .dashboard-actions {
    flex-direction: column;
  }
}
</style>
