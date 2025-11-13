<template>
  <v-row>
    <v-col cols="12" lg="8">
      <!-- Métricas Principales -->
      <v-row class="mb-4" dense>
        <v-col cols="6" sm="3" class="stats-card-col">
          <v-card class="professional-metric-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="metric-header-professional">
                <div class="metric-icon-professional success">
                  <v-icon color="white" size="24">mdi-currency-usd</v-icon>
                </div>
              </div>
              <div class="metric-content-professional">
                <div class="metric-value-professional success">
                  ${{ project.budget ? project.budget.toLocaleString() : '0' }}
                </div>
                <div class="metric-label-professional">Presupuesto Total</div>
                <div class="metric-subtitle-professional">Inversión asignada</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="6" sm="3" class="stats-card-col">
          <v-card class="professional-metric-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="metric-header-professional">
                <div class="metric-icon-professional info">
                  <v-icon color="white" size="24">mdi-view-list</v-icon>
                </div>
              </div>
              <div class="metric-content-professional">
                <div class="metric-value-professional info">
                  {{ project.phases?.length || 0 }}
                </div>
                <div class="metric-label-professional">Fases del Proyecto</div>
                <div class="metric-subtitle-professional">Etapas definidas</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="6" sm="3" class="stats-card-col">
          <v-card class="professional-metric-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="metric-header-professional">
                <div class="metric-icon-professional primary">
                  <v-icon color="white" size="24">mdi-format-list-checks</v-icon>
                </div>
              </div>
              <div class="metric-content-professional">
                <div class="metric-value-professional primary">
                  {{ getTotalTasks() }}
                </div>
                <div class="metric-label-professional">Tareas Totales</div>
                <div class="metric-subtitle-professional">Actividades planificadas</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="6" sm="3" class="stats-card-col">
          <v-card class="professional-metric-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="metric-header-professional">
                <div class="metric-icon-professional warning">
                  <v-icon color="white" size="24">mdi-account-group</v-icon>
                </div>
              </div>
              <div class="metric-content-professional">
                <div class="metric-value-professional warning">
                  {{ getUniqueVolunteersCount() }}
                </div>
                <div class="metric-label-professional">Voluntarios</div>
                <div class="metric-subtitle-professional">En el equipo</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Información del Proyecto -->
      <v-card class="professional-section-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center">
            <div class="professional-card-icon info">
              <v-icon color="white" size="20">mdi-information</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">Información del Proyecto</h3>
              <p class="text-caption text-grey mb-0">Detalles y objetivos</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-item mb-4">
                <div class="text-caption text-grey mb-1">Objetivo Principal</div>
                <div class="text-body-2">{{ project.objective }}</div>
              </div>
              <div class="info-item mb-4">
                <div class="text-caption text-grey mb-1">Ubicación</div>
                <div class="text-body-2">
                  <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                  {{ project.location }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-item mb-4">
                <div class="text-caption text-grey mb-1">Fechas del Proyecto</div>
                <div class="text-body-2">
                  <v-icon size="16" class="mr-1">mdi-calendar-range</v-icon>
                  {{ formatDateRange(project.startDate, project.endDate) }}
                </div>
              </div>
              <div class="info-item mb-4">
                <div class="text-caption text-grey mb-1">Requisitos</div>
                <div class="text-body-2">
                  {{ project.requisitos || 'No especificados' }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Progreso del Proyecto -->
      <v-card class="professional-section-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center">
            <div class="professional-card-icon success">
              <v-icon color="white" size="20">mdi-chart-line</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">Progreso del Proyecto</h3>
              <p class="text-caption text-grey mb-0">Avance general</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2 font-weight-medium">Fases Completadas</span>
                  <span class="text-h6 font-weight-bold text-primary">
                    {{ getCompletedPhasesCount() }}/{{ project?.phases?.length || 0 }}
                  </span>
                </div>
                <v-progress-linear
                  :model-value="getPhasesProgress()"
                  color="primary"
                  height="10"
                  rounded
                  class="mb-2"
                ></v-progress-linear>
                <div class="text-caption text-grey">
                  {{ Math.round(getPhasesProgress()) }}% completado
                </div>
              </div>
            </v-col>
            
            <v-col cols="12" md="6">
              <div class="mb-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2 font-weight-medium">Tareas Completadas</span>
                  <span class="text-h6 font-weight-bold text-success">
                    {{ getCompletedTasksCount() }}/{{ getTotalTasks() }}
                  </span>
                </div>
                <v-progress-linear
                  :model-value="getTasksProgress()"
                  color="success"
                  height="10"
                  rounded
                  class="mb-2"
                ></v-progress-linear>
                <div class="text-caption text-grey">
                  {{ Math.round(getTasksProgress()) }}% completado
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Progreso general circular -->
          <div class="text-center mt-4 pt-4" style="border-top: 1px solid rgba(0,0,0,0.08);">
            <v-progress-circular
              :model-value="getProjectProgress()"
              :size="120"
              :width="12"
              color="success"
              class="mb-3"
            >
              <span class="text-h4 font-weight-bold">{{ Math.round(getProjectProgress()) }}%</span>
            </v-progress-circular>
            <div class="text-body-2 text-grey">Progreso General del Proyecto</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Sidebar -->
    <v-col cols="12" lg="4">
      <!-- Beneficios y Pago -->
      <v-card class="professional-sidebar-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center">
            <div class="professional-card-icon success">
              <v-icon color="white" size="20">mdi-cash-multiple</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">Beneficios</h3>
              <p class="text-caption text-grey mb-0">Remuneración</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <div v-if="project?.beneficio" class="beneficio-info">
            <v-chip color="success" class="mb-2">
              {{ getTipoPagoText(project.beneficio.tipo_pago) }}
            </v-chip>
            <div v-if="project.beneficio.monto > 0" class="mt-2">
              <strong>Monto:</strong> ${{ formatCurrency(project.beneficio.monto) }} 
              <span v-if="project.beneficio.frecuencia !== 'none'">
                ({{ getFrecuenciaText(project.beneficio.frecuencia) }})
              </span>
            </div>
            <div v-if="project.beneficio.descripcion_pago" class="mt-2 text-body-2">
              {{ project.beneficio.descripcion_pago }}
            </div>
            <div class="mt-3 d-flex flex-wrap gap-2">
              <v-chip v-if="project.beneficio.incluye_transporte" size="small" color="info">
                <v-icon start size="small">mdi-bus</v-icon>
                Transporte
              </v-chip>
              <v-chip v-if="project.beneficio.incluye_alimentacion" size="small" color="info">
                <v-icon start size="small">mdi-food</v-icon>
                Alimentación
              </v-chip>
              <v-chip v-if="project.beneficio.incluye_materiales" size="small" color="info">
                <v-icon start size="small">mdi-toolbox</v-icon>
                Materiales
              </v-chip>
              <v-chip v-if="project.beneficio.incluye_seguro" size="small" color="info">
                <v-icon start size="small">mdi-shield-check</v-icon>
                Seguro
              </v-chip>
            </div>
          </div>
          <div v-else class="text-body-2 text-grey">
            No se han configurado beneficios aún
          </div>
          <ModernButton
            color="success"
            variant="outlined"
            prepend-icon="mdi-cash-multiple"
            @click="$emit('open-beneficio-dialog')"
            block
            class="mt-3"
          >
            {{ project?.beneficio ? 'Editar Beneficios' : 'Configurar Beneficios' }}
          </ModernButton>
        </v-card-text>
      </v-card>

      <!-- Horas Voluntariadas -->
      <v-card class="professional-sidebar-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center">
            <div class="professional-card-icon info">
              <v-icon color="white" size="20">mdi-clock-check</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">Horas</h3>
              <p class="text-caption text-grey mb-0">Registro</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <div v-if="loadingHoras" class="text-center py-4">
            <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
          </div>
          <div v-else-if="volunteerHours.length === 0" class="text-center py-4">
            <v-icon size="64" color="grey-lighten-1">mdi-clock-outline</v-icon>
            <p class="text-body-2 text-grey mt-2">No hay horas registradas</p>
          </div>
          <div v-else>
            <!-- Summary Stats -->
            <div class="hours-summary mb-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2 text-grey">Total de Horas</span>
                <span class="text-h6 font-weight-bold text-primary">{{ totalHoras }}h</span>
              </div>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2 text-grey">Horas Verificadas</span>
                <span class="text-body-1 font-weight-medium text-success">{{ horasVerificadas }}h</span>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2 text-grey">Horas Pendientes</span>
                <span class="text-body-1 font-weight-medium text-warning">{{ horasPendientes }}h</span>
              </div>
            </div>
            
            <v-btn
              variant="text"
              block
              size="small"
              prepend-icon="mdi-eye"
              @click="$emit('open-hours-dialog')"
            >
              Ver Todas las Horas
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Acciones Rápidas -->
      <v-card class="professional-sidebar-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center">
            <div class="professional-card-icon primary">
              <v-icon color="white" size="20">mdi-lightning-bolt</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">Acciones Rápidas</h3>
              <p class="text-caption text-grey mb-0">Atajos útiles</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="quick-actions-grid">
            <ModernButton
              color="primary"
              variant="outlined"
              prepend-icon="mdi-chart-line"
              @click="$emit('open-reports')"
              block
              class="mb-2"
              size="small"
            >
              Ver Reportes
            </ModernButton>
            
            <ModernButton
              color="info"
              variant="outlined"
              prepend-icon="mdi-download"
              @click="$emit('export-data')"
              block
              class="mb-2"
              size="small"
            >
              Exportar Datos
            </ModernButton>
            
            <ModernButton
              :color="project.es_publico ? 'success' : 'warning'"
              variant="outlined"
              :prepend-icon="project.es_publico ? 'mdi-eye' : 'mdi-eye-off'"
              @click="$emit('toggle-visibility')"
              block
              class="mb-2"
              size="small"
            >
              {{ project.es_publico ? 'Visible' : 'Oculto' }}
            </ModernButton>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import { formatDate, formatDateRange } from '@/utils/formatters';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  volunteerHours: {
    type: Array,
    default: () => []
  },
  loadingHoras: {
    type: Boolean,
    default: false
  },
  getTotalTasks: {
    type: Function,
    required: true
  },
  getCompletedTasksCount: {
    type: Function,
    required: true
  },
  getCompletedPhasesCount: {
    type: Function,
    required: true
  },
  getProjectProgress: {
    type: Function,
    required: true
  },
  getTasksProgress: {
    type: Function,
    required: true
  },
  getPhasesProgress: {
    type: Function,
    required: true
  },
  getUniqueVolunteersCount: {
    type: Function,
    required: true
  },
  formatCurrency: {
    type: Function,
    required: true
  },
  getTipoPagoText: {
    type: Function,
    required: true
  },
  getFrecuenciaText: {
    type: Function,
    required: true
  }
});

const emit = defineEmits([
  'open-beneficio-dialog',
  'open-hours-dialog',
  'open-reports',
  'export-data',
  'toggle-visibility'
]);

const totalHoras = computed(() => {
  return props.volunteerHours.reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0).toFixed(2);
});

const horasVerificadas = computed(() => {
  return props.volunteerHours
    .filter(h => h.verificada)
    .reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0).toFixed(2);
});

const horasPendientes = computed(() => {
  return props.volunteerHours
    .filter(h => !h.verificada)
    .reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0).toFixed(2);
});
</script>

<style scoped>
/* Professional Metric Cards */
.stats-card-col {
  margin-bottom: 12px;
}

.professional-metric-card {
  height: 100%;
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.professional-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
}

.metric-header-professional {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-icon-professional {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.metric-icon-professional.success {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.metric-icon-professional.info {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
}

.metric-icon-professional.primary {
  background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%);
}

.metric-icon-professional.warning {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
}

.metric-content-professional {
  text-align: left;
}

.metric-value-professional {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.metric-value-professional.success {
  color: #2E7D32;
}

.metric-value-professional.info {
  color: #1565C0;
}

.metric-value-professional.primary {
  color: #7B1FA2;
}

.metric-value-professional.warning {
  color: #E65100;
}

.metric-label-professional {
  font-size: 0.875rem;
  font-weight: 600;
  color: #212121;
  margin-bottom: 4px;
  line-height: 1.4;
}

.metric-subtitle-professional {
  font-size: 0.75rem;
  color: #757575;
  line-height: 1.4;
}

/* Professional Section Cards */
.professional-section-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.professional-section-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.professional-sidebar-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.professional-sidebar-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
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

.professional-card-icon.success {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.professional-card-icon.info {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
}

.info-item {
  padding: 8px 0;
}

.quick-actions-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

