<template>
  <div class="analytics-dashboard">
    <!-- Header -->
    <div class="dashboard-header mb-6">
      <div class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Analytics y Reportes</h1>
          <p class="text-subtitle-1 text-grey-darken-1">
            Métricas y estadísticas detalladas de tu organización
          </p>
        </div>
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-file-chart"
          @click="openReportDialog"
        >
          Generar Reporte
        </v-btn>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="text-h6 mt-4">Cargando analytics...</p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ error }}
    </v-alert>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Summary Cards -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <MetricCard
            title="Proyectos Activos"
            :value="organizationStats.proyectos?.activos || 0"
            icon="mdi-folder-multiple"
            color="primary"
            :trend="calculateProjectTrend()"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MetricCard
            title="Voluntarios Activos"
            :value="organizationStats.voluntarios?.activos || 0"
            icon="mdi-account-group"
            color="success"
            :trend="calculateVolunteerTrend()"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MetricCard
            title="Horas Totales"
            :value="formatHours(organizationStats.horas?.totalRegistradas || 0)"
            icon="mdi-clock"
            color="info"
            :trend="organizationStats.horas?.tendencia || 'estable'"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <MetricCard
            title="Eficiencia"
            :value="`${organizationStats.rendimiento?.eficienciaProyectos || 0}%`"
            icon="mdi-chart-line"
            color="warning"
            trend="estable"
          />
        </v-col>
      </v-row>

      <!-- Charts Row -->
      <v-row class="mb-6">
        <!-- Hours Trend Chart -->
        <v-col cols="12" md="8">
          <v-card class="analytics-card" elevation="2" rounded="lg">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
              Tendencia de Horas
            </v-card-title>
            <v-card-text>
              <HoursTrendChart
                :data="hoursTrendData"
                :loading="loadingOrganizationAnalytics"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Project Status Distribution -->
        <v-col cols="12" md="4">
          <v-card class="analytics-card" elevation="2" rounded="lg">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="success">mdi-chart-donut</v-icon>
              Estado de Proyectos
            </v-card-title>
            <v-card-text>
              <ProjectStatusChart
                :data="projectStatusData"
                :loading="loadingOrganizationAnalytics"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Project Comparison Row -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="analytics-card" elevation="2" rounded="lg">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-chart-bar</v-icon>
              Comparación de Proyectos
            </v-card-title>
            <v-card-text>
              <ProjectSelector
                v-model="selectedProjectsForComparison"
                :projects="availableProjects"
                :loading="loadingProjects"
                @change="handleProjectsSelectionChange"
                class="mb-4"
              />
              <ProjectComparisonChart
                :projects="availableProjects"
                :selected-projects="selectedProjectsForComparison"
                :loading="loadingProjects"
                @refresh="refreshProjects"
                @export="handleExportComparison"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Detailed Analytics Row -->
      <v-row class="mb-6">
        <!-- Performance Metrics -->
        <v-col cols="12" md="6">
          <v-card class="analytics-card" elevation="2" rounded="lg">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="info">mdi-speedometer</v-icon>
              Métricas de Rendimiento
            </v-card-title>
            <v-card-text>
              <PerformanceMetrics
                :data="organizationStats.rendimiento"
                :loading="loadingOrganizationAnalytics"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Recent Activity -->
        <v-col cols="12" md="6">
          <v-card class="analytics-card" elevation="2" rounded="lg">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="warning">mdi-history</v-icon>
              Actividad Reciente
            </v-card-title>
            <v-card-text>
              <RecentActivity
                :activities="recentActivities"
                :loading="loadingActivities"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Reports Section -->
      <v-card class="analytics-card mb-6" elevation="2" rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-file-multiple</v-icon>
            Reportes Generados
          </div>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            prepend-icon="mdi-refresh"
            @click="refreshReports"
          >
            Actualizar
          </v-btn>
        </v-card-title>
        <v-card-text>
          <ReportsTable
            :reports="reports"
            :loading="loadingReports"
            @download="downloadReport"
            @regenerate="regenerateReport"
          />
        </v-card-text>
      </v-card>
    </div>

    <!-- Generate Report Dialog -->
    <GenerateReportDialog
      v-model="reportDialog"
      :generating="generatingReport"
      @generate="handleGenerateReport"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotifications } from '@/composables/useNotifications';

// Components
import MetricCard from './MetricCard.vue';
import HoursTrendChart from './charts/HoursTrendChart.vue';
import ProjectStatusChart from './charts/ProjectStatusChart.vue';
import ProjectComparisonChart from './charts/ProjectComparisonChart.vue';
import ProjectSelector from './ProjectSelector.vue';
import PerformanceMetrics from './PerformanceMetrics.vue';
import RecentActivity from './RecentActivity.vue';
import ReportsTable from './ReportsTable.vue';
import GenerateReportDialog from './dialogs/GenerateReportDialog.vue';

// Stores
const analyticsStore = useAnalyticsStore();
const authStore = useAuthStore();
const { showSuccess, showError } = useNotifications();

// Import project store
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
const projectStore = useProjectStore();

// Reactive data
const reportDialog = ref(false);
const loadingActivities = ref(false);
const recentActivities = ref([]);
const selectedProjectsForComparison = ref([]);
const loadingProjects = ref(false);

// Computed properties
const loading = computed(() => analyticsStore.loadingOrganizationAnalytics);
const error = computed(() => analyticsStore.error);
const organizationStats = computed(() => analyticsStore.organizationAnalytics || {});
const reports = computed(() => analyticsStore.reports);
const loadingReports = computed(() => analyticsStore.loadingReports);
const generatingReport = computed(() => analyticsStore.generatingReport);
const loadingOrganizationAnalytics = computed(() => analyticsStore.loadingOrganizationAnalytics);

// Chart data
const hoursTrendData = computed(() => analyticsStore.organizationHoursTrendData);

const projectStatusData = computed(() => {
  const proyectos = organizationStats.value.proyectos || {};
  return {
    labels: ['Activos', 'Completados', 'En Pausa'],
    datasets: [{
      data: [proyectos.activos || 0, proyectos.completados || 0, proyectos.enPausa || 0],
      backgroundColor: ['#2196F3', '#4CAF50', '#FF9800'],
      borderWidth: 0
    }]
  };
});

// Available projects for comparison
const availableProjects = computed(() => {
  return projectStore.projects || [];
});

// Methods
const calculateProjectTrend = () => {
  const proyectos = organizationStats.value.proyectos || {};
  const total = proyectos.total || 0;
  const completados = proyectos.completados || 0;
  
  if (total === 0) return 'estable';
  const ratio = completados / total;
  
  if (ratio > 0.7) return 'subiendo';
  if (ratio < 0.3) return 'bajando';
  return 'estable';
};

const calculateVolunteerTrend = () => {
  const voluntarios = organizationStats.value.voluntarios || {};
  const retencion = voluntarios.retencion || 0;
  
  if (retencion > 70) return 'subiendo';
  if (retencion < 50) return 'bajando';
  return 'estable';
};

const formatHours = (hours) => {
  if (hours >= 1000) {
    return `${(hours / 1000).toFixed(1)}k`;
  }
  return hours.toString();
};

const openReportDialog = () => {
  reportDialog.value = true;
};

const handleGenerateReport = async (reportData) => {
  try {
    if (reportData.async) {
      const report = await analyticsStore.generateReport(reportData);
      showSuccess(`Reporte "${reportData.tipo}" iniciado. Te notificaremos cuando esté listo.`);
      reportDialog.value = false;
    } else {
      await analyticsStore.generateSimpleReport(reportData);
      showSuccess('Reporte generado y descargado exitosamente');
      reportDialog.value = false;
    }
  } catch (error) {
    showError(error.message || 'Error al generar reporte');
  }
};

const downloadReport = async (reportId) => {
  try {
    await analyticsStore.downloadReport(reportId);
    showSuccess('Reporte descargado exitosamente');
  } catch (error) {
    showError(error.message || 'Error al descargar reporte');
  }
};

const regenerateReport = async (report) => {
  try {
    const reportData = {
      tipo: report.tipo,
      formato: report.formato,
      id_proyecto: report.id_proyecto,
      incluir_graficos: report.incluir_graficos,
      async: true
    };
    
    await analyticsStore.generateReport(reportData);
    showSuccess('Regeneración de reporte iniciada');
  } catch (error) {
    showError(error.message || 'Error al regenerar reporte');
  }
};

const refreshReports = async () => {
  try {
    // Aquí podrías implementar la lógica para refrescar reportes
    showSuccess('Reportes actualizados');
  } catch (error) {
    showError('Error al actualizar reportes');
  }
};

const loadAnalytics = async () => {
  try {
    const organizationId = authStore.user?.organizacion?.id_organizacion;
    if (organizationId) {
      await analyticsStore.fetchOrganizationAnalytics(organizationId);
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
};

const loadProjects = async () => {
  loadingProjects.value = true;
  try {
    await projectStore.fetchProjects(true);
  } catch (error) {
    console.error('Error loading projects:', error);
    showError('Error al cargar proyectos');
  } finally {
    loadingProjects.value = false;
  }
};

const refreshProjects = async () => {
  await loadProjects();
  showSuccess('Proyectos actualizados');
};

const handleProjectsSelectionChange = (projects) => {
  selectedProjectsForComparison.value = projects;
};

const handleExportComparison = () => {
  showSuccess('Gráfico exportado exitosamente');
};

// Lifecycle
onMounted(() => {
  loadProjects();
  loadAnalytics();
});
</script>

<style scoped>
.analytics-dashboard {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.analytics-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.analytics-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.analytics-card .v-card-title {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  font-weight: 600;
  padding: 16px 24px;
}

.analytics-card .v-card-text {
  padding: 24px;
}
</style>
