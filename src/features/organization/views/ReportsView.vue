<template>
  <v-container fluid class="pa-8">
    <!-- Header Section -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold text-primary mb-2">Centro de Reportes</h1>
        <p class="text-body-1 text-grey-darken-1">
          Genera reportes detallados de impacto, financieros y operativos para tu organización
        </p>
      </div>
      <div class="d-flex align-center gap-3">
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-cog"
          @click="openSettings"
        >
          Configurar
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-file-plus"
          @click="openReportWizard"
          :loading="loading"
        >
          Nuevo Reporte
        </v-btn>
      </div>
    </div>

    <!-- Quick Stats (MetricStatCard - same style as dashboard) -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Reportes Generados"
          icon="mdi-file-chart"
          iconColor="primary"
          :value="totalReports"
          valueColor="primary"
          trendText="+12%"
        >
          <template #detail>
            <span class="text-primary">{{ readyReports }} listos</span>
            <span class="text-grey">•</span>
            <span class="text-grey">{{ pendingReports }} en proceso</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Listos para Descargar"
          icon="mdi-check-circle"
          iconColor="success"
          :value="readyReports"
          valueColor="success"
        >
          <template #detail>
            <span class="text-success">{{ readyReports }} disponibles</span>
            <span class="text-grey">•</span>
            <span class="text-grey">Este mes</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Descargas Este Mes"
          icon="mdi-download"
          iconColor="info"
          :value="downloadsThisMonth"
          valueColor="info"
        >
          <template #detail>
            <span class="text-info">{{ downloadsThisMonth }} descargas</span>
            <span class="text-grey">•</span>
            <span class="text-grey">Total acumulado</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="En Proceso"
          icon="mdi-clock"
          iconColor="warning"
          :value="pendingReports"
          valueColor="warning"
        >
          <template #detail>
            <span class="text-warning">{{ pendingReports }} pendientes</span>
            <span class="text-grey">•</span>
            <span class="text-grey">Generando</span>
          </template>
        </MetricStatCard>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row>
      <!-- Report Generator Panel -->
      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-xl elevation-2 h-100 dashboard-card">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" size="24" class="mr-3">mdi-wizard-hat</v-icon>
            <h2 class="text-h6 font-weight-bold">Generador de Reportes</h2>
          </div>
          
          <v-form @submit.prevent="generateReport" ref="reportForm">
            <v-select
              label="Tipo de Reporte"
              :items="reportTypes"
              v-model="form.tipo"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-file-document"
              class="mb-4"
              :rules="[v => !!v || 'Selecciona un tipo de reporte']"
              required
            />
            
            <v-select
              label="Proyecto"
              :items="projects"
              item-title="label"
              item-value="value"
              v-model="form.proyecto"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-folder"
              class="mb-4"
            />

            <v-row class="mb-4" dense>
              <v-col cols="12">
                <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
                  <template #activator="{ props }">
            <v-text-field
                      v-bind="props"
                      variant="outlined"
                      density="comfortable"
                      label="Rango de fechas"
                      :model-value="dateRangeLabel"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                    />
                  </template>
                  <v-card class="rounded-xl">
                    <v-date-picker v-model="form.rango" range @update:model-value="onPickRange" />
                    <v-card-actions class="pa-4">
                      <v-spacer />
                      <v-btn variant="text" @click="clearRange">Limpiar</v-btn>
                      <v-btn color="primary" variant="flat" @click="menu = false">Aplicar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>

            <v-select
              label="Formato de Salida"
              :items="outputFormats"
              v-model="form.formato"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-file-export"
              class="mb-4"
            />

            <v-switch
              v-model="form.includeCharts"
              label="Incluir gráficos y visualizaciones"
              color="primary"
              class="mb-4"
            />

            <v-btn 
              type="submit" 
              color="primary" 
              block 
              variant="flat" 
              :loading="loading"
              size="large"
              class="rounded-lg"
            >
              <v-icon start>mdi-rocket-launch</v-icon>
              Generar Reporte
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- Reports List -->
      <v-col cols="12" md="8">
        <v-card class="rounded-xl elevation-2 h-100 dashboard-card">
          <v-toolbar color="transparent" class="px-6 py-5 reports-toolbar" density="comfortable">
            <div class="d-flex align-center flex-wrap w-100 reports-filter-bar">
              <v-text-field 
                v-model="filters.search" 
                prepend-inner-icon="mdi-magnify" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                placeholder="Buscar reporte..." 
                class="search-field modern-input"
                clearable
              />
              <v-select 
                v-model="filters.tipo" 
                :items="['Todos', ...reportTypes]" 
                label="Tipo" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                class="filter-select modern-input"
              />
              <v-select 
                v-model="filters.estado" 
                :items="estadoOptions" 
                label="Estado" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                class="filter-select modern-input"
              />
              <v-spacer />
              <v-menu>
                <template #activator="{ props }">
                  <v-btn 
                    v-bind="props" 
                    variant="outlined" 
                    prepend-icon="mdi-download"
                    class="export-btn modern-btn"
                    density="comfortable"
                  >
                    Exportar
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="bulkExport('csv')" prepend-icon="mdi-file-delimited">
                    <v-list-item-title>Exportar CSV</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="bulkExport('pdf')" prepend-icon="mdi-file-pdf-box">
                    <v-list-item-title>Exportar PDF</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="bulkExport('excel')" prepend-icon="mdi-file-excel">
                    <v-list-item-title>Exportar Excel</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-toolbar>
          <v-divider />

          <div v-if="loading" class="pa-6">
            <v-skeleton-loader type="list-item-two-line@5" />
          </div>

          <div v-else-if="filteredReports.length === 0" class="pa-8 text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-file-search</v-icon>
            <h3 class="text-h6 text-grey mb-2">No hay reportes</h3>
            <p class="text-body-2 text-grey">Genera tu primer reporte para comenzar</p>
          </div>

          <v-list v-else lines="two" class="pa-4 reports-list">
            <v-list-item 
              v-for="report in filteredReports" 
              :key="report.id"
              class="report-item rounded-lg ma-2 mb-3"
            >
              <template #prepend>
                <v-avatar size="52" class="elevation-1 mr-4" :color="getReportColor(report.tipo)">
                  <v-icon color="white" size="28">{{ report.icon }}</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="font-weight-bold d-flex align-center mb-2">
                <span>{{ report.tipo }}</span>
                <v-chip 
                  size="small" 
                  class="ml-3" 
                  :color="getStatusColor(report.estado)" 
                  variant="tonal"
                  density="comfortable"
                >
                  <v-icon start size="small">{{ getStatusIcon(report.estado) }}</v-icon>
                  {{ report.estado }}
                </v-chip>
              </v-list-item-title>
              
              <v-list-item-subtitle class="d-flex align-center flex-wrap ga-3">
                <span class="d-flex align-center mr-4">
                  <v-icon size="16" class="mr-2">mdi-calendar</v-icon>
                  <span>{{ formatDate(report.fecha) }}</span>
                </span>
                <span class="d-flex align-center mr-4">
                  <v-icon size="16" class="mr-2">mdi-folder</v-icon>
                  <span>{{ report.proyecto }}</span>
                </span>
                <span class="d-flex align-center mr-4">
                  <v-icon size="16" class="mr-2">mdi-file</v-icon>
                  <span>{{ report.formato?.toUpperCase() || 'PDF' }}</span>
                </span>
                <span v-if="report.size" class="d-flex align-center">
                  <v-icon size="16" class="mr-2">mdi-harddisk</v-icon>
                  <span>{{ report.size }}</span>
                </span>
              </v-list-item-subtitle>
              
              <template #append>
                <div class="d-flex align-center gap-2">
                  <v-tooltip text="Previsualizar">
                    <template #activator="{ props }">
                      <v-btn 
                        v-bind="props"
                        icon="mdi-eye" 
                        variant="text" 
                        size="small"
                        @click="previewReport(report)" 
                      />
                    </template>
                  </v-tooltip>
                  
                  <v-tooltip text="Descargar">
                    <template #activator="{ props }">
                      <v-btn 
                        v-bind="props"
                        :disabled="report.estado !== 'Listo'" 
                        icon="mdi-download" 
                        variant="text" 
                        color="success"
                        size="small"
                        @click="downloadReport(report.id)" 
                      />
                    </template>
                  </v-tooltip>
                  
                  <v-tooltip text="Compartir">
                    <template #activator="{ props }">
                      <v-btn 
                        v-bind="props"
                        :disabled="report.estado !== 'Listo'"
                        icon="mdi-share" 
                        variant="text" 
                        color="info"
                        size="small"
                        @click="shareReport(report)" 
                      />
                    </template>
                  </v-tooltip>
                  
                  <v-tooltip text="Eliminar">
                    <template #activator="{ props }">
                      <v-btn 
                        v-bind="props"
                        icon="mdi-delete" 
                        variant="text" 
                        color="error"
                        size="small"
                        @click="confirmDeleteReport(report)" 
                      />
              </template>
                  </v-tooltip>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <v-divider />
          <div class="d-flex align-center justify-between pa-4">
            <div class="text-caption text-grey">
              Mostrando {{ filteredReports.length }} de {{ totalReports }} reportes
            </div>
            <v-pagination 
              v-model="page" 
              :length="pageCount" 
              density="comfortable" 
              class="pagination"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Report Preview Dialog -->
    <ModernDialog
      v-model="previewDialog"
      title="Previsualización del Reporte"
      subtitle="Descarga el reporte para ver el contenido completo"
      icon="mdi-file-document"
      icon-color="primary"
      max-width="1200px"
      @confirm="() => downloadReport(selectedReport?.id)"
      @cancel="() => (previewDialog = false)"
      confirm-text="Descargar"
      confirm-icon="mdi-download"
    >
      <template #content>
        <div class="report-preview pa-6">
          <div class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-file-pdf-box</v-icon>
            <h3 class="text-h6 text-grey mt-4">Vista previa no disponible</h3>
            <p class="text-body-2 text-grey">Descarga el reporte para ver el contenido completo</p>
          </div>
        </div>
      </template>
    </ModernDialog>

    <!-- Delete Confirmation Dialog -->
    <ModernDialog
      v-model="deleteDialog"
      title="Confirmar Eliminación"
      subtitle="Esta acción no se puede deshacer"
      icon="mdi-delete"
      icon-color="error"
      max-width="500px"
      @confirm="deleteReport"
      @cancel="() => (deleteDialog = false)"
      :confirm-loading="deleting"
      confirm-text="Eliminar"
      confirm-color="error"
      confirm-icon="mdi-delete"
    >
      <template #content>
        <v-alert type="warning" variant="tonal" class="mb-4">
          <v-icon start>mdi-alert</v-icon>
          ¿Estás seguro de que deseas eliminar este reporte?
        </v-alert>
        <p class="text-body-2 text-grey">
          Esta acción eliminará permanentemente el reporte y no se podrá recuperar.
        </p>
      </template>
    </ModernDialog>

    <!-- Settings Dialog -->
    <ModernDialog
      v-model="settingsDialog"
      title="Configuración de Reportes"
      icon="mdi-cog"
      icon-color="primary"
      max-width="800px"
      @confirm="saveSettings"
      @cancel="() => (settingsDialog = false)"
      confirm-text="Guardar"
      confirm-icon="mdi-content-save"
    >
      <template #content>
        <v-row>
          <v-col cols="12" md="6">
            <v-switch
              v-model="settings.autoGenerate"
              label="Generación automática de reportes mensuales"
              color="primary"
              class="mb-4"
            />
            <v-switch
              v-model="settings.emailNotifications"
              label="Notificaciones por email"
              color="primary"
              class="mb-4"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="settings.defaultFormat"
              label="Formato por defecto"
              :items="outputFormats"
              variant="outlined"
              class="mb-4"
            />
            <v-text-field
              v-model="settings.retentionDays"
              label="Días de retención"
              type="number"
              variant="outlined"
              suffix="días"
            />
          </v-col>
        </v-row>
      </template>
    </ModernDialog>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import MetricStatCard from '@/components/ui/MetricStatCard.vue';
import { formatDate, formatDateRange } from '@/utils/formatters';

const loading = ref(false);
const deleting = ref(false);
const page = ref(1);
const pageSize = 6;
const menu = ref(false);
const previewDialog = ref(false);
const deleteDialog = ref(false);
const settingsDialog = ref(false);
const selectedReport = ref(null);
const reportToDelete = ref(null);

const reportTypes = [
  'Financiero por Proyecto',
  'Horas de Voluntariado',
  'Impacto de Donaciones',
  'General de Actividades',
  'Reporte de Cumplimiento',
  'Análisis de Voluntarios',
  'Métricas de Impacto Social',
  'Reporte Ejecutivo',
];

const outputFormats = ['PDF', 'Excel', 'CSV', 'PowerPoint'];

const projects = [
  { label: 'Todos los Proyectos', value: 'all' },
  { label: 'Empoderamiento Educativo', value: 'emp-edu' },
  { label: 'Salud y Bienestar', value: 'salud-bien' },
  { label: 'Desarrollo Comunitario', value: 'des-com' },
  { label: 'Tecnología Social', value: 'tec-soc' },
];

const estadoOptions = ['Todos', 'Listo', 'Generando', 'Programado', 'Error'];

const form = ref({ 
  tipo: reportTypes[0], 
  proyecto: 'all', 
  rango: null, 
  formato: 'PDF',
  includeCharts: true 
});

const filters = ref({ search: '', tipo: 'Todos', estado: 'Todos' });

const settings = ref({
  autoGenerate: true,
  emailNotifications: true,
  defaultFormat: 'PDF',
  retentionDays: 365
});

const reports = ref([
  { 
    id: 1, 
    tipo: 'Financiero por Proyecto', 
    fecha: '2025-08-01', 
    proyecto: 'Empoderamiento Educativo', 
    icon: 'mdi-file-chart', 
    estado: 'Listo',
    formato: 'PDF',
    size: '2.3 MB',
    downloads: 15
  },
  { 
    id: 2, 
    tipo: 'Horas de Voluntariado', 
    fecha: '2025-07-30', 
    proyecto: 'Todos los Proyectos', 
    icon: 'mdi-file-clock', 
    estado: 'Listo',
    formato: 'Excel',
    size: '1.8 MB',
    downloads: 8
  },
  { 
    id: 3, 
    tipo: 'Impacto de Donaciones', 
    fecha: '2025-07-25', 
    proyecto: 'Salud y Bienestar', 
    icon: 'mdi-file-check', 
    estado: 'Generando',
    formato: 'PDF',
    size: '0 MB',
    downloads: 0
  },
  { 
    id: 4, 
    tipo: 'General de Actividades', 
    fecha: '2025-07-20', 
    proyecto: 'Todos los Proyectos', 
    icon: 'mdi-file-document', 
    estado: 'Listo',
    formato: 'PDF',
    size: '3.1 MB',
    downloads: 22
  },
  { 
    id: 5, 
    tipo: 'Reporte Ejecutivo', 
    fecha: '2025-07-15', 
    proyecto: 'Empoderamiento Educativo', 
    icon: 'mdi-file-presentation', 
    estado: 'Listo',
    formato: 'PowerPoint',
    size: '4.2 MB',
    downloads: 12
  },
  { 
    id: 6, 
    tipo: 'Análisis de Voluntarios', 
    fecha: '2025-07-10', 
    proyecto: 'Todos los Proyectos', 
    icon: 'mdi-account-group', 
    estado: 'Programado',
    formato: 'Excel',
    size: '0 MB',
    downloads: 0
  },
  { 
    id: 7, 
    tipo: 'Métricas de Impacto Social', 
    fecha: '2025-07-07', 
    proyecto: 'Salud y Bienestar', 
    icon: 'mdi-chart-line', 
    estado: 'Listo',
    formato: 'PDF',
    size: '2.7 MB',
    downloads: 18
  },
]);

// Computed properties
const totalReports = computed(() => reports.value.length);
const readyReports = computed(() => reports.value.filter(r => r.estado === 'Listo').length);
const pendingReports = computed(() => reports.value.filter(r => r.estado === 'Generando' || r.estado === 'Programado').length);
const downloadsThisMonth = computed(() => reports.value.reduce((sum, r) => sum + r.downloads, 0));

const dateRangeLabel = computed(() => {
  if (!form.value.rango || form.value.rango.length !== 2) return '';
  const [start, end] = form.value.rango;
  return formatDateRange(start, end);
});

const filteredReports = computed(() => {
  let data = reports.value;
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase();
    data = data.filter(r => r.tipo.toLowerCase().includes(q) || r.proyecto.toLowerCase().includes(q));
  }
  if (filters.value.tipo !== 'Todos') {
    data = data.filter(r => r.tipo === filters.value.tipo);
  }
  if (filters.value.estado !== 'Todos') {
    data = data.filter(r => r.estado === filters.value.estado);
  }
  const start = (page.value - 1) * pageSize;
  return data.slice(start, start + pageSize);
});

const pageCount = computed(() => {
  const total = reports.value.filter(r => {
    const matchTipo = filters.value.tipo === 'Todos' || r.tipo === filters.value.tipo;
    const matchEstado = filters.value.estado === 'Todos' || r.estado === filters.value.estado;
    const q = filters.value.search?.toLowerCase?.() || '';
    const matchSearch = !q || r.tipo.toLowerCase().includes(q) || r.proyecto.toLowerCase().includes(q);
    return matchTipo && matchEstado && matchSearch;
  }).length;
  return Math.max(1, Math.ceil(total / pageSize));
});

// Helper functions
function getReportColor(tipo) {
  const colors = {
    'Financiero por Proyecto': 'primary',
    'Horas de Voluntariado': 'info',
    'Impacto de Donaciones': 'success',
    'General de Actividades': 'secondary',
    'Reporte de Cumplimiento': 'warning',
    'Análisis de Voluntarios': 'purple',
    'Métricas de Impacto Social': 'teal',
    'Reporte Ejecutivo': 'indigo'
  };
  return colors[tipo] || 'primary';
}

function getStatusColor(estado) {
  const colors = {
    'Listo': 'success',
    'Generando': 'warning',
    'Programado': 'info',
    'Error': 'error'
  };
  return colors[estado] || 'grey';
}

function getStatusIcon(estado) {
  const icons = {
    'Listo': 'mdi-check-circle',
    'Generando': 'mdi-loading',
    'Programado': 'mdi-clock',
    'Error': 'mdi-alert-circle'
  };
  return icons[estado] || 'mdi-help-circle';
}

// Función formatDate removida - ahora se usa desde @/utils/formatters

// Event handlers
function onPickRange() {
  // noop: etiqueta se actualiza vía computed
}

function clearRange() {
  form.value.rango = null;
}

function openReportWizard() {
  // Reset form
  form.value = { 
    tipo: reportTypes[0], 
    proyecto: 'all', 
    rango: null, 
    formato: 'PDF',
    includeCharts: true 
  };
}

function openSettings() {
  settingsDialog.value = true;
}

async function generateReport() {
  loading.value = true;
  try {
    // Simula una generación de reporte
    await new Promise(r => setTimeout(r, 2000));
    const nextId = Math.max(...reports.value.map(r => r.id)) + 1;
    const projectLabel = projects.find(p => p.value === form.value.proyecto)?.label || 'Todos los Proyectos';
    
    reports.value.unshift({
      id: nextId,
      tipo: form.value.tipo,
      fecha: new Date().toISOString().slice(0, 10),
      proyecto: projectLabel,
      icon: getReportIcon(form.value.tipo),
      estado: 'Listo',
      formato: form.value.formato,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      downloads: 0
    });
    
    // Reset form
    form.value = { 
      tipo: reportTypes[0], 
      proyecto: 'all', 
      rango: null, 
      formato: 'PDF',
      includeCharts: true 
    };
  } finally {
    loading.value = false;
  }
}

function getReportIcon(tipo) {
  const icons = {
    'Financiero por Proyecto': 'mdi-file-chart',
    'Horas de Voluntariado': 'mdi-file-clock',
    'Impacto de Donaciones': 'mdi-file-check',
    'General de Actividades': 'mdi-file-document',
    'Reporte de Cumplimiento': 'mdi-file-shield',
    'Análisis de Voluntarios': 'mdi-account-group',
    'Métricas de Impacto Social': 'mdi-chart-line',
    'Reporte Ejecutivo': 'mdi-file-presentation'
  };
  return icons[tipo] || 'mdi-file-document';
}

function previewReport(report) {
  selectedReport.value = report;
  previewDialog.value = true;
}

function downloadReport(id) {
  const report = reports.value.find(r => r.id === id);
  if (report) {
    report.downloads++;
    console.log(`Descargando reporte ${id}: ${report.tipo}`);
    // Simular descarga
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${report.tipo}_${report.fecha}.${report.formato.toLowerCase()}`;
    link.click();
  }
}

function shareReport(report) {
  console.log('Compartir reporte:', report);
  // Implementar lógica de compartir
  if (navigator.share) {
    navigator.share({
      title: report.tipo,
      text: `Reporte de ${report.proyecto}`,
      url: window.location.href
    });
  } else {
    // Fallback para navegadores que no soportan Web Share API
    navigator.clipboard.writeText(window.location.href);
    alert('Enlace copiado al portapapeles');
  }
}

function confirmDeleteReport(report) {
  reportToDelete.value = report;
  deleteDialog.value = true;
}

async function deleteReport() {
  if (!reportToDelete.value) return;
  
  deleting.value = true;
  try {
    await new Promise(r => setTimeout(r, 1000));
    reports.value = reports.value.filter(r => r.id !== reportToDelete.value.id);
    deleteDialog.value = false;
    reportToDelete.value = null;
  } finally {
    deleting.value = false;
  }
}

function bulkExport(format) {
  console.log('Exportar en lote', format);
  const selectedReports = filteredReports.value.filter(r => r.estado === 'Listo');
  if (selectedReports.length === 0) {
    alert('No hay reportes listos para exportar');
    return;
  }
  
  // Simular exportación en lote
  const zipName = `reportes_${new Date().toISOString().slice(0, 10)}.zip`;
  console.log(`Exportando ${selectedReports.length} reportes como ${zipName}`);
}

function saveSettings() {
  console.log('Guardando configuración:', settings.value);
  settingsDialog.value = false;
  // Aquí implementarías la lógica para guardar en el backend
}
</script>

<style scoped>
/* Estilos personalizados para ReportsView */
.v-tab {
  text-transform: none !important;
}

.report-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s ease;
}

/* Professional filter bar styling */
.reports-toolbar {
  background: rgba(248, 250, 252, 0.8) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.reports-filter-bar {
  gap: 16px !important;
}

.search-field {
  min-width: 280px;
  flex: 1 1 280px;
  max-width: 400px;
}

.filter-select {
  min-width: 180px;
  flex: 0 1 180px;
}

.export-btn {
  min-width: 120px;
  height: 40px;
  flex-shrink: 0;
}

/* Ensure consistent spacing and alignment */
.reports-filter-bar :deep(.v-field) {
  background: white;
  border-radius: 8px;
}

.reports-filter-bar :deep(.v-field__input) {
  padding: 12px 16px;
  min-height: 40px;
}

.reports-filter-bar :deep(.v-label) {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 4px;
}

.reports-filter-bar :deep(.v-select__selection) {
  font-size: 0.9375rem;
}

.pagination {
  margin-top: 0;
}

/* Animaciones suaves */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
}

/* Estilos para los avatares de reportes */
.v-avatar {
  transition: transform 0.2s ease;
}

.v-avatar:hover {
  transform: scale(1.1);
}

/* Estilos para los botones de acción */
.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}

/* Estilos para los chips de estado */
.v-chip {
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Estilos para el formulario de generación */
.v-form .v-field {
  transition: all 0.2s ease;
}

.v-form .v-field:focus-within {
  transform: scale(1.02);
}

/* Estilos para los diálogos */
.v-dialog .v-card {
  border-radius: 16px !important;
}

/* Estilos para las tarjetas de estadísticas */
.stats-card {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
  border: 1px solid rgba(25, 118, 210, 0.2);
}

/* Animación de carga */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.loading-pulse {
  animation: pulse 2s infinite;
}

/* Estilos para el preview del reporte */
.report-preview {
  min-height: 400px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
}

/* Estilos para los tooltips */
.v-tooltip .v-overlay__content {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-field,
  .filter-select {
    min-width: 100%;
    margin-bottom: 8px;
  }
  
  .d-flex.gap-3 {
    flex-direction: column;
    gap: 8px !important;
  }
  
  .v-btn {
    width: 100%;
  }
}

/* Estilos para el estado vacío */
.empty-state {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 3rem;
}

/* Estilos para los iconos de estado */
.status-icon {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Estilos para los colores de reportes */
.report-financial { color: #1976D2; }
.report-volunteer { color: #00BCD4; }
.report-donation { color: #4CAF50; }
.report-activity { color: #9C27B0; }
.report-compliance { color: #FF9800; }
.report-analysis { color: #673AB7; }
.report-metrics { color: #009688; }
.report-executive { color: #3F51B5; }

/* Estilo unificado tipo dashboard para cards */
.dashboard-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: var(--afro-radius-lg, 16px) !important;
  border: 1px solid var(--afro-border, rgba(0, 0, 0, 0.08)) !important;
  box-shadow: 0 8px 24px -8px rgba(16, 24, 40, 0.12) !important;
}

/* Symmetry and spacing for reports list - professional spacing */
.reports-list :deep(.v-list-item) {
  padding: 16px 20px !important;
  min-height: 100px !important;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.reports-list :deep(.v-list-item):hover {
  border-color: rgba(25, 118, 210, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.reports-list :deep(.v-list-item-title) {
  margin-bottom: 8px !important;
  font-size: 1.0625rem !important;
  line-height: 1.5 !important;
  padding-right: 16px;
}

.reports-list :deep(.v-list-item-subtitle) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.875rem !important;
  line-height: 1.6 !important;
  color: rgba(0, 0, 0, 0.65) !important;
  margin-top: 4px;
}

.reports-list :deep(.v-list-item-subtitle .v-icon) {
  opacity: 0.7;
  margin-right: 6px;
}

.report-item :deep(.v-avatar) {
  margin-right: 16px !important;
}

.report-item :deep(.v-btn) {
  margin: 0 2px !important;
  min-width: 36px !important;
}

</style>
