<!-- DASHBOARD PROFESIONAL PARA ORGANIZACIONES -->

<template>
  <v-container fluid class="organization-dashboard">
    <!-- Welcome Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="welcome-card" elevation="0">
          <v-card-text class="pa-8">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-avatar size="80" color="primary" class="mr-6">
                  <v-icon size="40" color="white">mdi-domain</v-icon>
                </v-avatar>
                <div>
                  <h1 class="text-h4 font-weight-bold text-primary mb-2">
                    Bienvenido, {{ organizationName }} 🏢
                  </h1>
                  <p class="text-h6 text-grey-darken-1 mb-0">
                    Gestiona tus proyectos y maximiza tu impacto social.
                  </p>
                </div>
              </div>
              <div class="text-right">
                <v-chip color="success" variant="tonal" size="large" class="mb-2">
                  <v-icon start>mdi-check-circle</v-icon>
                  Organización Verificada
                </v-chip>
                <p class="text-caption text-grey-darken-1 mb-0">
                  Miembro desde {{ memberSince }}
                </p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- KPIs Row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Proyectos Activos"
          :value="activeProjects"
          icon="mdi-folder-multiple"
          color="primary"
          :trend="'+15%'"
          trend-positive
          subtitle="vs mes anterior"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Voluntarios Activos"
          :value="activeVolunteers"
          icon="mdi-account-group"
          color="success"
          :trend="'+8%'"
          trend-positive
          subtitle="este mes"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Donaciones Recibidas"
          :value="totalDonations"
          icon="mdi-currency-usd"
          color="info"
          :trend="'+22%'"
          trend-positive
          format="currency"
          subtitle="este trimestre"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MetricCard
          title="Impacto Social"
          :value="socialImpact"
          icon="mdi-heart"
          color="error"
          :trend="'+18%'"
          trend-positive
          subtitle="personas beneficiadas"
        />
      </v-col>
    </v-row>

    <!-- Main Content Row -->
    <v-row>
      <!-- Left Column -->
      <v-col cols="12" lg="8">
        <!-- Project Management -->
        <v-card class="mb-6" elevation="0">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-3" color="primary">mdi-folder-multiple</v-icon>
              <h2 class="text-h6 font-weight-bold">Gestión de Proyectos</h2>
            </div>
            <div class="d-flex gap-2">
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="$router.push('/organization/dashboard/projects')"
              >
                Ver Todos
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                size="small"
                prepend-icon="mdi-plus"
                @click="$router.push('/organization/dashboard/projects/create')"
              >
                Nuevo Proyecto
              </v-btn>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-tabs v-model="projectTab" class="project-tabs">
              <v-tab value="active">Activos ({{ activeProjects }})</v-tab>
              <v-tab value="draft">Borradores ({{ draftProjects }})</v-tab>
              <v-tab value="completed">Completados ({{ completedProjects }})</v-tab>
            </v-tabs>
            <v-divider></v-divider>
            <v-window v-model="projectTab">
              <v-window-item value="active">
                <ProjectList :projects="activeProjectsList" type="active" />
              </v-window-item>
              <v-window-item value="draft">
                <ProjectList :projects="draftProjectsList" type="draft" />
              </v-window-item>
              <v-window-item value="completed">
                <ProjectList :projects="completedProjectsList" type="completed" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>

        <!-- Recent Activity -->
        <v-card elevation="0">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-chart-line</v-icon>
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
                prepend-icon="mdi-plus-box"
                @click="$router.push('/organization/dashboard/projects/create')"
                block
              >
                Crear Proyecto
              </v-btn>
              <v-btn
                color="success"
                variant="outlined"
                prepend-icon="mdi-account-plus"
                @click="$router.push('/organization/dashboard/volunteers')"
                block
              >
                Invitar Voluntarios
              </v-btn>
              <v-btn
                color="info"
                variant="outlined"
                prepend-icon="mdi-chart-line"
                @click="$router.push('/organization/dashboard/reports')"
                block
              >
                Ver Reportes
              </v-btn>
              <v-btn
                color="warning"
                variant="outlined"
                prepend-icon="mdi-cog"
                @click="$router.push('/organization/dashboard/settings')"
                block
              >
                Configuración
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Volunteer Management -->
        <v-card class="mb-6" elevation="0">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-account-group</v-icon>
            <h2 class="text-h6 font-weight-bold">Gestión de Voluntarios</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item
                v-for="volunteer in topVolunteers"
                :key="volunteer.id"
                class="volunteer-item"
                @click="$router.push(`/organization/dashboard/volunteers/${volunteer.id}`)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getVolunteerColor(volunteer.level)" size="40">
                    <v-icon color="white" size="20">mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  {{ volunteer.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ volunteer.role }} • {{ volunteer.hours }}h
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip size="x-small" :color="getVolunteerColor(volunteer.level)" variant="tonal">
                    {{ volunteer.level }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
              <v-btn
                color="primary"
                variant="text"
                @click="$router.push('/organization/dashboard/volunteers')"
                block
              >
                Ver Todos los Voluntarios
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>

        <!-- Financial Overview -->
        <v-card elevation="0">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3" color="primary">mdi-chart-pie</v-icon>
            <h2 class="text-h6 font-weight-bold">Resumen Financiero</h2>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <div class="financial-metrics">
              <div class="financial-item">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2 text-grey">Presupuesto Total</span>
                  <span class="text-h6 font-weight-bold text-primary">
                    {{ formatCurrency(totalBudget) }}
                  </span>
                </div>
                <v-progress-linear
                  :model-value="budgetUsedPercentage"
                  color="primary"
                  height="6"
                  rounded
                ></v-progress-linear>
                <div class="text-caption text-grey mt-1">
                  {{ budgetUsedPercentage }}% utilizado
                </div>
              </div>
              
              <v-divider class="my-4"></v-divider>
              
              <div class="financial-item">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2 text-grey">Donaciones Este Mes</span>
                  <span class="text-h6 font-weight-bold text-success">
                    {{ formatCurrency(monthlyDonations) }}
                  </span>
                </div>
                <div class="text-caption text-grey">
                  +{{ donationGrowth }}% vs mes anterior
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
import ProjectList from '@/components/dashboard/ProjectList.vue';

const authStore = useAuthStore();

// Reactive data
const projectTab = ref('active');

// Computed
const organizationName = computed(() => authStore.userName || 'Organización');

// Mock data
const memberSince = ref('Enero 2023');
const activeProjects = ref(8);
const draftProjects = ref(3);
const completedProjects = ref(12);
const activeVolunteers = ref(45);
const totalDonations = ref(2500000);
const socialImpact = ref(1250);

const activeProjectsList = ref([
  {
    id: 1,
    name: 'Educación Rural',
    description: 'Programa de alfabetización',
    status: 'En Progreso',
    progress: 75,
    volunteers: 12,
    budget: 500000
  },
  {
    id: 2,
    name: 'Medio Ambiente',
    description: 'Reforestación urbana',
    status: 'En Progreso',
    progress: 45,
    volunteers: 8,
    budget: 300000
  }
]);

const draftProjectsList = ref([
  {
    id: 3,
    name: 'Salud Comunitaria',
    description: 'Campaña de vacunación',
    status: 'Borrador',
    progress: 0,
    volunteers: 0,
    budget: 200000
  }
]);

const completedProjectsList = ref([
  {
    id: 4,
    name: 'Tecnología Social',
    description: 'Talleres de computación',
    status: 'Completado',
    progress: 100,
    volunteers: 15,
    budget: 400000
  }
]);

const recentActivities = ref([
  {
    id: 1,
    title: 'Proyecto Completado',
    description: 'Tecnología Social finalizado exitosamente',
    icon: 'mdi-check-circle',
    color: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 2,
    title: 'Nuevo Voluntario',
    description: 'María García se unió al proyecto',
    icon: 'mdi-account-plus',
    color: 'primary',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 3,
    title: 'Donación Recibida',
    description: 'Donación de $500,000 COP recibida',
    icon: 'mdi-currency-usd',
    color: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
]);

const topVolunteers = ref([
  {
    id: 1,
    name: 'María García',
    role: 'Coordinadora',
    hours: 120,
    level: 'Experto'
  },
  {
    id: 2,
    name: 'Carlos López',
    role: 'Voluntario',
    hours: 85,
    level: 'Avanzado'
  },
  {
    id: 3,
    name: 'Ana Rodríguez',
    role: 'Mentora',
    hours: 95,
    level: 'Experto'
  }
]);

const totalBudget = ref(5000000);
const budgetUsedPercentage = ref(65);
const monthlyDonations = ref(800000);
const donationGrowth = ref(15);

// Methods
function getVolunteerColor(level) {
  const colors = {
    'Experto': 'success',
    'Avanzado': 'primary',
    'Intermedio': 'warning',
    'Principiante': 'info'
  };
  return colors[level] || 'grey';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
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
.organization-dashboard {
  background-color: var(--bg-secondary);
  min-height: 100vh;
}

.welcome-card {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%) !important;
  border: 1px solid rgba(var(--primary-500-rgb), 0.1) !important;
}

.project-tabs {
  background-color: var(--neutral-50);
}

.volunteer-item {
  transition: all var(--transition-normal) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.volunteer-item:hover {
  background-color: var(--primary-50) !important;
}

.volunteer-item:last-child {
  border-bottom: none !important;
}

.financial-metrics {
  padding: var(--spacing-sm) 0;
}

.financial-item {
  margin-bottom: var(--spacing-md);
}

.financial-item:last-child {
  margin-bottom: 0;
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
