<!-- DASHBOARD PROFESIONAL PARA VOLUNTARIOS -->

<template>
  <v-container fluid class="volunteer-dashboard">
    <!-- Welcome Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="pa-8">
            <div class="d-flex align-center">
              <v-avatar size="80" color="primary" class="mr-6">
                <v-icon size="40" color="white">mdi-account-heart</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <h1 class="text-h4 font-weight-bold text-primary mb-2">
                  ¡Hola, {{ userName }}! 👋
                </h1>
                <p class="text-h6 text-grey-darken-1 mb-0">
                  Gracias por tu increíble trabajo. Aquí tienes un resumen de tu impacto.
                </p>
              </div>
              <div class="text-right">
                <v-chip color="success" variant="tonal" size="large" class="mb-2">
                  <v-icon start>mdi-star</v-icon>
                  {{ volunteerLevel }}
                </v-chip>
                <p class="text-caption text-grey-darken-1 mb-0">
                  {{ totalHours }} horas de impacto
                </p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Metrics Row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Proyectos Activos"
          :value="activeProjects"
          icon="mdi-folder-heart"
          color="primary"
          :trend="'+12%'"
          trend-positive
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Horas Donadas"
          :value="totalHours"
          icon="mdi-clock"
          color="success"
          :trend="'+8%'"
          trend-positive
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Proyectos Completados"
          :value="completedProjects"
          icon="mdi-check-circle"
          color="info"
          :trend="'+5%'"
          trend-positive
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Impacto Social"
          :value="socialImpact"
          icon="mdi-heart"
          color="error"
          :trend="'+15%'"
          trend-positive
        />
      </v-col>
    </v-row>

    <!-- Main Content Row -->
    <v-row>
      <!-- Left Column -->
      <v-col cols="12" lg="8">
        <!-- Active Projects -->
        <v-card class="mb-6" elevation="0">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-folder-heart</v-icon>
              <h2 class="text-h6 font-weight-bold">Mis Proyectos Activos</h2>
            </div>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              @click="$router.push('/volunteer/projects')"
            >
              Ver Todos
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <div v-if="activeProjectsList.length === 0" class="text-center py-8">
              <v-icon size="80" color="grey-lighten-1">mdi-folder-heart-outline</v-icon>
              <h3 class="text-h6 text-grey mt-4">No tienes proyectos activos</h3>
              <p class="text-body-2 text-grey mb-4">
                Explora proyectos disponibles y únete a uno que te inspire
              </p>
              <v-btn
                color="primary"
                variant="flat"
                @click="$router.push('/volunteer/projects')"
              >
                Explorar Proyectos
              </v-btn>
            </div>
            <v-list v-else>
              <v-list-item
                v-for="project in activeProjectsList"
                :key="project.id"
                class="project-item"
                @click="$router.push(`/volunteer/projects/${project.id}`)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getProjectColor(project.category)" size="48">
                    <v-icon color="white">{{ getProjectIcon(project.category) }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ project.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ project.description }}</v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-right">
                    <v-progress-linear
                      :model-value="project.progress"
                      :color="getProgressColor(project.progress)"
                      height="6"
                      rounded
                      class="mb-2"
                    ></v-progress-linear>
                    <v-chip
                      :color="getStatusColor(project.status)"
                      size="small"
                      variant="tonal"
                    >
                      {{ project.status }}
                    </v-chip>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Recent Activity -->
        <v-card elevation="0">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-history</v-icon>
            <h2 class="text-h6 font-weight-bold">Actividad Reciente</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-timeline density="compact" side="end">
              <v-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :dot-color="activity.color"
                :icon="activity.icon"
                size="small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-body-2 font-weight-medium">{{ activity.title }}</div>
                    <div class="text-caption text-grey">{{ activity.description }}</div>
                  </div>
                  <div class="text-caption text-grey">{{ formatTime(activity.timestamp) }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Column -->
      <v-col cols="12" lg="4">
        <!-- Quick Actions -->
        <v-card class="mb-6" elevation="0">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-lightning-bolt</v-icon>
            <h2 class="text-h6 font-weight-bold">Acciones Rápidas</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <div class="d-flex flex-column gap-3">
              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-magnify"
                @click="$router.push('/volunteer/projects')"
                block
              >
                Explorar Proyectos
              </v-btn>
              <v-btn
                color="info"
                variant="outlined"
                prepend-icon="mdi-calendar-clock"
                @click="$router.push('/volunteer/availability')"
                block
              >
                Actualizar Disponibilidad
              </v-btn>
              <v-btn
                color="success"
                variant="outlined"
                prepend-icon="mdi-account-edit"
                @click="$router.push('/volunteer/profile')"
                block
              >
                Completar Perfil
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Recommended Projects -->
        <v-card class="mb-6" elevation="0">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-star</v-icon>
            <h2 class="text-h6 font-weight-bold">Recomendados para Ti</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item
                v-for="project in recommendedProjects"
                :key="project.id"
                class="recommended-project"
                @click="$router.push(`/volunteer/projects/${project.id}`)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getProjectColor(project.category)" size="40">
                    <v-icon color="white" size="20">{{ getProjectIcon(project.category) }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  {{ project.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ project.location }} • {{ project.duration }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip size="x-small" color="primary" variant="tonal">
                    {{ project.match }}% match
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Achievements -->
        <v-card elevation="0">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-trophy</v-icon>
            <h2 class="text-h6 font-weight-bold">Logros</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <div class="achievements-grid">
              <div
                v-for="achievement in achievements"
                :key="achievement.id"
                class="achievement-item"
                :class="{ 'achievement-unlocked': achievement.unlocked }"
              >
                <v-icon
                  :color="achievement.unlocked ? 'warning' : 'grey-lighten-1'"
                  size="32"
                >
                  {{ achievement.icon }}
                </v-icon>
                <div class="achievement-info">
                  <div class="text-body-2 font-weight-medium">{{ achievement.title }}</div>
                  <div class="text-caption text-grey">{{ achievement.description }}</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/stores/authStore';
import MetricCard from '@/components/dashboard/MetricCard.vue';

const authStore = useAuthStore();

// Computed
const userName = computed(() => authStore.userName || 'Voluntario');

// Mock data
const activeProjects = ref(3);
const totalHours = ref(156);
const completedProjects = ref(8);
const socialImpact = ref(245);
const volunteerLevel = ref('Experto');

const activeProjectsList = ref([
  {
    id: 1,
    name: 'Educación Rural',
    description: 'Enseñanza de matemáticas básicas',
    category: 'Educación',
    progress: 75,
    status: 'En Progreso'
  },
  {
    id: 2,
    name: 'Medio Ambiente',
    description: 'Reforestación de áreas verdes',
    category: 'Medio Ambiente',
    progress: 45,
    status: 'En Progreso'
  },
  {
    id: 3,
    name: 'Salud Comunitaria',
    description: 'Campaña de vacunación',
    category: 'Salud',
    progress: 90,
    status: 'Casi Terminado'
  }
]);

const recentActivities = ref([
  {
    id: 1,
    title: 'Tarea Completada',
    description: 'Finalizaste la tarea "Preparar materiales"',
    icon: 'mdi-check-circle',
    color: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    title: 'Nuevo Proyecto',
    description: 'Te uniste al proyecto "Educación Rural"',
    icon: 'mdi-plus-circle',
    color: 'primary',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 3,
    title: 'Logro Desbloqueado',
    description: 'Obtuviste el logro "Primer Proyecto"',
    icon: 'mdi-trophy',
    color: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
]);

const recommendedProjects = ref([
  {
    id: 4,
    name: 'Tecnología Social',
    description: 'Enseñanza de computación básica',
    category: 'Tecnología',
    location: 'Bogotá',
    duration: '3 meses',
    match: 95
  },
  {
    id: 5,
    name: 'Arte y Cultura',
    description: 'Talleres de pintura para niños',
    category: 'Cultura',
    location: 'Medellín',
    duration: '2 meses',
    match: 88
  }
]);

const achievements = ref([
  {
    id: 1,
    title: 'Primer Proyecto',
    description: 'Completa tu primer proyecto',
    icon: 'mdi-star',
    unlocked: true
  },
  {
    id: 2,
    title: '100 Horas',
    description: 'Donar 100 horas de voluntariado',
    icon: 'mdi-clock',
    unlocked: true
  },
  {
    id: 3,
    title: 'Especialista',
    description: 'Completa 5 proyectos en una categoría',
    icon: 'mdi-medal',
    unlocked: false
  },
  {
    id: 4,
    title: 'Mentor',
    description: 'Ayuda a 3 nuevos voluntarios',
    icon: 'mdi-account-heart',
    unlocked: false
  }
]);

// Methods
function getProjectColor(category) {
  const colors = {
    'Educación': 'primary',
    'Medio Ambiente': 'success',
    'Salud': 'error',
    'Tecnología': 'info',
    'Cultura': 'warning'
  };
  return colors[category] || 'grey';
}

function getProjectIcon(category) {
  const icons = {
    'Educación': 'mdi-school',
    'Medio Ambiente': 'mdi-leaf',
    'Salud': 'mdi-heart',
    'Tecnología': 'mdi-laptop',
    'Cultura': 'mdi-palette'
  };
  return icons[category] || 'mdi-folder';
}

function getProgressColor(progress) {
  if (progress >= 80) return 'success';
  if (progress >= 50) return 'warning';
  return 'error';
}

function getStatusColor(status) {
  const colors = {
    'En Progreso': 'info',
    'Casi Terminado': 'success',
    'Pendiente': 'warning'
  };
  return colors[status] || 'grey';
}

function formatTime(timestamp) {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `hace ${minutes}m`;
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${days}d`;
}

onMounted(() => {
  // Load dashboard data
});
</script>

<style scoped>
.volunteer-dashboard {
  background-color: var(--bg-secondary);
  min-height: 100vh;
}

.welcome-card {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%) !important;
  border: 1px solid rgba(var(--primary-500-rgb), 0.1) !important;
}

.project-item {
  transition: all var(--transition-normal) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.project-item:hover {
  background-color: var(--primary-50) !important;
  transform: translateX(4px) !important;
}

.project-item:last-child {
  border-bottom: none !important;
}

.recommended-project {
  transition: all var(--transition-normal) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.recommended-project:hover {
  background-color: var(--neutral-50) !important;
}

.recommended-project:last-child {
  border-bottom: none !important;
}

.achievements-grid {
  display: grid;
  gap: var(--spacing-md);
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal) !important;
}

.achievement-unlocked {
  background-color: var(--warning-50) !important;
  border: 1px solid var(--warning-200) !important;
}

.achievement-info {
  margin-left: var(--spacing-sm);
  flex: 1;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .welcome-card .d-flex {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-card .text-right {
    text-align: center !important;
    margin-top: var(--spacing-md);
  }
}
</style>
