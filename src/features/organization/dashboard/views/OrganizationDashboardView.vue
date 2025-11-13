<template>
  <div class="afro-org-dashboard">
    <!-- Dashboard Header -->
    <div class="afro-dashboard-header">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h1 class="afro-heading-2 mb-2">Dashboard Ejecutivo</h1>
          <p class="afro-body-small">
            Bienvenido de vuelta, {{ organization?.name || 'Organización' }}
          </p>
        </div>
        <div class="dashboard-actions">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-plus"
            @click="createNewProject"
          >
            Nuevo Proyecto
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Key Metrics Row -->
    <div class="afro-metrics-row">
      <div class="afro-grid afro-grid-4">
        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-header">
            <div class="metric-icon success">
              <v-icon color="white">mdi-folder-heart</v-icon>
            </div>
            <div class="metric-trend success">
              <v-icon size="16">mdi-trending-up</v-icon>
              +12%
            </div>
          </div>
          <div class="metric-content">
            <div class="afro-metric-value">{{ metrics.projects.total }}</div>
            <div class="afro-metric-label">Proyectos Activos</div>
            <div class="metric-detail">
              <span class="text-success">{{ metrics.projects.active }} activos</span>
              <span class="text-grey">•</span>
              <span class="text-grey">{{ metrics.projects.completed }} completados</span>
            </div>
          </div>
        </div>

        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-header">
            <div class="metric-icon info">
              <v-icon color="white">mdi-account-group</v-icon>
            </div>
            <div class="metric-trend success">
              <v-icon size="16">mdi-trending-up</v-icon>
              +8%
            </div>
          </div>
          <div class="metric-content">
            <div class="afro-metric-value">{{ metrics.volunteers.total }}</div>
            <div class="afro-metric-label">Voluntarios Asignados</div>
            <div class="metric-detail">
              <span class="text-info">{{ metrics.volunteers.active }} activos</span>
              <span class="text-grey">•</span>
              <span class="text-grey">{{ metrics.volunteers.new }} nuevos</span>
            </div>
          </div>
        </div>

        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-header">
            <div class="metric-icon warning">
              <v-icon color="white">mdi-currency-usd</v-icon>
            </div>
            <div class="metric-trend success">
              <v-icon size="16">mdi-trending-up</v-icon>
              +15%
            </div>
          </div>
          <div class="metric-content">
            <div class="afro-metric-value">${{ formatCurrency(metrics.donations.total) }}</div>
            <div class="afro-metric-label">Donaciones Recibidas</div>
            <div class="metric-detail">
              <span class="text-warning">{{ metrics.donations.count }} donaciones</span>
              <span class="text-grey">•</span>
              <span class="text-grey">Este mes</span>
            </div>
          </div>
        </div>

        <div class="afro-metric-card afro-card-elevated">
          <div class="metric-header">
            <div class="metric-icon primary">
              <v-icon color="white">mdi-chart-line</v-icon>
            </div>
            <div class="metric-trend success">
              <v-icon size="16">mdi-trending-up</v-icon>
              +22%
            </div>
          </div>
          <div class="metric-content">
            <div class="afro-metric-value">{{ metrics.impact.score }}%</div>
            <div class="afro-metric-label">Score de Impacto</div>
            <div class="metric-detail">
              <span class="text-primary">{{ metrics.impact.beneficiaries }} beneficiarios</span>
              <span class="text-grey">•</span>
              <span class="text-grey">Este trimestre</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="afro-dashboard-content">
      <div class="afro-grid afro-grid-3">
        <!-- Recent Projects -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Proyectos Recientes</h3>
            <v-btn
              variant="text"
              size="small"
              @click="viewAllProjects"
            >
              Ver todos
            </v-btn>
          </div>
          <div class="card-content">
            <div v-if="recentProjects.length === 0" class="afro-empty-state">
              <div class="afro-empty-state-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-folder-heart-outline</v-icon>
              </div>
              <div class="afro-empty-state-title">No hay proyectos</div>
              <div class="afro-empty-state-description">
                Comienza creando tu primer proyecto
              </div>
              <v-btn
                color="primary"
                variant="outlined"
                @click="createNewProject"
                class="mt-4"
              >
                Crear Proyecto
              </v-btn>
            </div>
            <div v-else class="project-list">
              <div
                v-for="project in recentProjects"
                :key="project.id"
                class="project-item"
                @click="viewProject(project.id)"
              >
                <div class="project-info">
                  <h4 class="project-title">{{ project.name }}</h4>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-meta">
                    <span class="afro-status-success">{{ project.status }}</span>
                    <span class="project-date">{{ formatDate(project.createdAt) }}</span>
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

        <!-- Volunteer Activity -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Actividad de Voluntarios</h3>
            <v-btn
              variant="text"
              size="small"
              @click="viewVolunteers"
            >
              Ver todos
            </v-btn>
          </div>
          <div class="card-content">
            <div v-if="volunteerActivity.length === 0" class="afro-empty-state">
              <div class="afro-empty-state-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-account-group-outline</v-icon>
              </div>
              <div class="afro-empty-state-title">Sin actividad</div>
              <div class="afro-empty-state-description">
                Los voluntarios aparecerán aquí cuando se unan a tus proyectos
              </div>
            </div>
            <div v-else class="activity-list">
              <div
                v-for="activity in volunteerActivity"
                :key="activity.id"
                class="activity-item"
              >
                <v-avatar size="32" color="primary" class="mr-3">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
                <div class="activity-content">
                  <div class="activity-text">
                    <strong>{{ activity.volunteerName }}</strong> {{ activity.action }}
                  </div>
                  <div class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</div>
                </div>
                <div class="activity-status">
                  <v-chip
                    :color="getActivityColor(activity.type)"
                    size="small"
                    variant="tonal"
                  >
                    {{ activity.type }}
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
                variant="outlined"
                block
                class="mb-3"
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
        <!-- Recent Donations -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Donaciones Recientes</h3>
            <v-btn
              variant="text"
              size="small"
              @click="viewDonations"
            >
              Ver todas
            </v-btn>
          </div>
          <div class="card-content">
            <div v-if="recentDonations.length === 0" class="afro-empty-state">
              <div class="afro-empty-state-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-currency-usd</v-icon>
              </div>
              <div class="afro-empty-state-title">Sin donaciones</div>
              <div class="afro-empty-state-description">
                Las donaciones aparecerán aquí cuando lleguen
              </div>
            </div>
            <div v-else class="donation-list">
              <div
                v-for="donation in recentDonations"
                :key="donation.id"
                class="donation-item"
              >
                <div class="donation-info">
                  <div class="donation-amount">${{ formatCurrency(donation.amount) }}</div>
                  <div class="donation-donor">{{ donation.donorName }}</div>
                  <div class="donation-project">{{ donation.projectName }}</div>
                </div>
                <div class="donation-date">{{ formatDate(donation.date) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Chart -->
        <div class="afro-card afro-card-elevated">
          <div class="card-header">
            <h3 class="afro-heading-4">Rendimiento del Mes</h3>
            <v-btn
              variant="text"
              size="small"
              @click="viewReports"
            >
              Ver reporte
            </v-btn>
          </div>
          <div class="card-content">
            <div class="performance-chart">
              <div class="chart-placeholder">
                <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
                <p class="afro-body-small mt-2">Gráfico de rendimiento</p>
                <p class="afro-caption">Próximamente</p>
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
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { useAuthStore } from '@/features/auth/stores/authStore';

const router = useRouter();
const projectStore = useProjectStore();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

// Mock data - replace with real data from stores
const organization = ref({
  name: 'Fundación Esperanza',
  id: 1
});

const metrics = ref({
  projects: {
    total: 12,
    active: 8,
    completed: 4
  },
  volunteers: {
    total: 45,
    active: 32,
    new: 5
  },
  donations: {
    total: 125000,
    count: 23
  },
  impact: {
    score: 87,
    beneficiaries: 150
  }
});

const recentProjects = ref([
  {
    id: 1,
    name: 'Educación Comunitaria',
    description: 'Programa de alfabetización para adultos',
    status: 'Activo',
    progress: 75,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Salud Preventiva',
    description: 'Campaña de vacunación infantil',
    status: 'Activo',
    progress: 45,
    createdAt: new Date('2024-02-01')
  },
  {
    id: 3,
    name: 'Desarrollo Económico',
    description: 'Talleres de emprendimiento',
    status: 'Completado',
    progress: 100,
    createdAt: new Date('2024-01-01')
  }
]);

const volunteerActivity = ref([
  {
    id: 1,
    volunteerName: 'María González',
    action: 'se unió al proyecto Educación Comunitaria',
    type: 'Nuevo',
    timestamp: new Date('2024-02-15T10:30:00')
  },
  {
    id: 2,
    volunteerName: 'Carlos Mendoza',
    action: 'completó una tarea en Salud Preventiva',
    type: 'Progreso',
    timestamp: new Date('2024-02-15T09:15:00')
  },
  {
    id: 3,
    volunteerName: 'Ana Rodríguez',
    action: 'envió un mensaje sobre Desarrollo Económico',
    type: 'Comunicación',
    timestamp: new Date('2024-02-14T16:45:00')
  }
]);

const recentDonations = ref([
  {
    id: 1,
    amount: 50000,
    donorName: 'Empresa ABC',
    projectName: 'Educación Comunitaria',
    date: new Date('2024-02-14')
  },
  {
    id: 2,
    amount: 25000,
    donorName: 'Juan Pérez',
    projectName: 'Salud Preventiva',
    date: new Date('2024-02-13')
  },
  {
    id: 3,
    amount: 75000,
    donorName: 'Fundación XYZ',
    projectName: 'Desarrollo Económico',
    date: new Date('2024-02-12')
  }
]);

const quickActions = computed(() => [
  {
    name: 'create-project',
    label: 'Crear Proyecto',
    icon: 'mdi-plus-circle',
    color: 'primary',
    handler: () => router.push('/organization/dashboard/projects/create')
  },
  {
    name: 'invite-volunteer',
    label: 'Invitar Voluntario',
    icon: 'mdi-account-plus',
    color: 'success',
    handler: () => router.push('/organization/dashboard/volunteers/invite')
  },
  {
    name: 'create-donation',
    label: 'Registrar Donación',
    icon: 'mdi-currency-usd',
    color: 'warning',
    handler: () => router.push('/organization/dashboard/donations/create')
  },
  {
    name: 'generate-report',
    label: 'Generar Reporte',
    icon: 'mdi-file-chart',
    color: 'info',
    handler: () => router.push('/organization/dashboard/reports')
  }
]);

// Methods
const createNewProject = () => {
  router.push('/organization/dashboard/projects/create');
};

const viewAllProjects = () => {
  router.push('/organization/dashboard/projects');
};

const viewProject = (projectId) => {
  router.push(`/organization/dashboard/projects/${projectId}`);
};

const viewVolunteers = () => {
  router.push('/organization/dashboard/volunteers');
};

const viewDonations = () => {
  router.push('/organization/dashboard/donations');
};

const viewReports = () => {
  router.push('/organization/dashboard/reports');
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO').format(amount);
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

const getActivityColor = (type) => {
  const colorMap = {
    'Nuevo': 'success',
    'Progreso': 'info',
    'Comunicación': 'warning',
    'Completado': 'primary'
  };
  return colorMap[type] || 'grey';
};

onMounted(() => {
  // Load dashboard data
  projectStore.fetchProjects();
});
</script>

<style scoped>
.afro-org-dashboard {
  padding: var(--afro-space-lg);
  background: #ffffff !important;
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

.metric-icon.success {
  background: var(--afro-success);
}

.metric-icon.info {
  background: var(--afro-info);
}

.metric-icon.warning {
  background: var(--afro-warning);
}

.metric-icon.primary {
  background: var(--afro-primary);
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

.project-date {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

.project-progress {
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

.activity-content {
  flex: 1;
  margin-left: var(--afro-space-sm);
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

.activity-status {
  margin-left: var(--afro-space-sm);
}

/* Quick Actions */
.quick-actions-grid {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-sm);
}

/* Donation List */
.donation-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.donation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--afro-space-md);
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-md);
}

.donation-info {
  flex: 1;
}

.donation-amount {
  font-size: var(--afro-text-lg);
  font-weight: 700;
  color: var(--afro-primary);
  margin-bottom: var(--afro-space-xs);
}

.donation-donor {
  font-size: var(--afro-text-sm);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.donation-project {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

.donation-date {
  font-size: var(--afro-text-xs);
  color: var(--afro-text-secondary);
}

/* Performance Chart */
.performance-chart {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: var(--afro-text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .afro-org-dashboard {
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
  
  .project-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-progress {
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
