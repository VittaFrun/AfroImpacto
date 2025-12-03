<template>
  <div class="reports-table">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      ></v-progress-circular>
      <p class="text-body-2 mt-4">Cargando reportes...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="reports.length === 0" class="empty-state text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-file-document-outline</v-icon>
      <h3 class="text-h6 font-weight-medium mt-4 mb-2">No hay reportes generados</h3>
      <p class="text-body-2 text-grey-darken-1 mb-4">
        Los reportes que generes aparecerán aquí
      </p>
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-plus"
        @click="$emit('generate')"
      >
        Generar Primer Reporte
      </v-btn>
    </div>

    <!-- Reports Table -->
    <div v-else>
      <!-- Table Header -->
      <div class="table-header mb-4">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h4 class="text-h6 font-weight-medium">Reportes Generados</h4>
            <p class="text-body-2 text-grey-darken-1">
              {{ reports.length }} reporte{{ reports.length !== 1 ? 's' : '' }} en total
            </p>
          </div>
          <div class="table-actions">
            <v-text-field
              v-model="searchQuery"
              placeholder="Buscar reportes..."
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              hide-details
              clearable
              style="max-width: 300px;"
            ></v-text-field>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="filteredReports"
        :loading="loading"
        class="reports-data-table"
        :items-per-page="10"
        :sort-by="[{ key: 'creado_en', order: 'desc' }]"
      >
        <!-- Tipo Column -->
        <template #item.tipo="{ item }">
          <div class="d-flex align-center">
            <v-icon
              :icon="getReportTypeIcon(item.tipo)"
              size="small"
              class="mr-2"
              :color="getReportTypeColor(item.tipo)"
            ></v-icon>
            <div>
              <div class="font-weight-medium">{{ getReportTypeName(item.tipo) }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.formato }}</div>
            </div>
          </div>
        </template>

        <!-- Estado Column -->
        <template #item.estado="{ item }">
          <v-chip
            :color="getStatusColor(item.estado)"
            :variant="item.estado === 'listo' ? 'elevated' : 'tonal'"
            size="small"
            :prepend-icon="getStatusIcon(item.estado)"
          >
            {{ getStatusText(item.estado) }}
          </v-chip>
        </template>

        <!-- Fecha Column -->
        <template #item.creado_en="{ item }">
          <div>
            <div class="font-weight-medium">{{ formatDate(item.creado_en) }}</div>
            <div class="text-caption text-grey-darken-1">{{ formatTime(item.creado_en) }}</div>
          </div>
        </template>

        <!-- Descargas Column -->
        <template #item.descargas="{ item }">
          <div class="d-flex align-center">
            <v-icon size="small" class="mr-1" color="grey">mdi-download</v-icon>
            <span>{{ item.descargas || 0 }}</span>
          </div>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <div class="action-buttons">
            <v-tooltip text="Descargar">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-download"
                  size="small"
                  variant="text"
                  :disabled="item.estado !== 'listo'"
                  @click="$emit('download', item.id_reporte)"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Regenerar">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-refresh"
                  size="small"
                  variant="text"
                  @click="$emit('regenerate', item)"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  size="small"
                  variant="text"
                ></v-btn>
              </template>
              <v-list>
                <v-list-item @click="viewReportDetails(item)">
                  <template #prepend>
                    <v-icon>mdi-eye</v-icon>
                  </template>
                  <v-list-item-title>Ver Detalles</v-list-item-title>
                </v-list-item>
                <v-list-item @click="shareReport(item)" :disabled="item.estado !== 'listo'">
                  <template #prepend>
                    <v-icon>mdi-share</v-icon>
                  </template>
                  <v-list-item-title>Compartir</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="deleteReport(item)" class="text-error">
                  <template #prepend>
                    <v-icon>mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>

        <!-- Loading Slot -->
        <template #loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>

        <!-- No Data Slot -->
        <template #no-data>
          <div class="text-center py-8">
            <v-icon size="48" color="grey-lighten-1">mdi-file-search-outline</v-icon>
            <p class="text-body-2 text-grey-darken-1 mt-2">
              No se encontraron reportes que coincidan con tu búsqueda
            </p>
          </div>
        </template>
      </v-data-table>
    </div>

    <!-- Report Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="600">
      <v-card v-if="selectedReport">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-file-document</v-icon>
          Detalles del Reporte
        </v-card-title>
        <v-card-text>
          <div class="report-details">
            <div class="detail-row">
              <span class="detail-label">Tipo:</span>
              <span class="detail-value">{{ getReportTypeName(selectedReport.tipo) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Formato:</span>
              <span class="detail-value">{{ selectedReport.formato }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estado:</span>
              <v-chip
                :color="getStatusColor(selectedReport.estado)"
                size="small"
                variant="tonal"
              >
                {{ getStatusText(selectedReport.estado) }}
              </v-chip>
            </div>
            <div class="detail-row">
              <span class="detail-label">Creado:</span>
              <span class="detail-value">{{ formatDateTime(selectedReport.creado_en) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Descargas:</span>
              <span class="detail-value">{{ selectedReport.descargas || 0 }}</span>
            </div>
            <div v-if="selectedReport.incluir_graficos" class="detail-row">
              <span class="detail-label">Incluye gráficos:</span>
              <v-icon color="success" size="small">mdi-check</v-icon>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="detailsDialog = false">Cerrar</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :disabled="selectedReport.estado !== 'listo'"
            @click="$emit('download', selectedReport.id_reporte); detailsDialog = false"
          >
            Descargar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatDate, formatTime, formatDateTime } from '@/utils/formatters';
import { useNotifications } from '@/composables/useNotifications';

const props = defineProps({
  reports: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['download', 'regenerate', 'generate', 'delete']);

const { showSuccess, showError, showWarning } = useNotifications();

// Reactive data
const searchQuery = ref('');
const detailsDialog = ref(false);
const selectedReport = ref(null);

// Table headers
const headers = [
  { title: 'Tipo', key: 'tipo', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Fecha', key: 'creado_en', sortable: true },
  { title: 'Descargas', key: 'descargas', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, width: '120px' }
];

// Computed
const filteredReports = computed(() => {
  if (!searchQuery.value) return props.reports;
  
  const query = searchQuery.value.toLowerCase();
  return props.reports.filter(report => 
    getReportTypeName(report.tipo).toLowerCase().includes(query) ||
    report.formato.toLowerCase().includes(query) ||
    getStatusText(report.estado).toLowerCase().includes(query)
  );
});

// Methods
const getReportTypeIcon = (tipo) => {
  const icons = {
    'proyecto_completo': 'mdi-file-document-multiple',
    'progreso_proyecto': 'mdi-chart-timeline-variant',
    'horas_voluntarios': 'mdi-clock-outline',
    'rendimiento_equipo': 'mdi-account-group'
  };
  return icons[tipo] || 'mdi-file-document';
};

const getReportTypeColor = (tipo) => {
  const colors = {
    'proyecto_completo': 'primary',
    'progreso_proyecto': 'success',
    'horas_voluntarios': 'info',
    'rendimiento_equipo': 'warning'
  };
  return colors[tipo] || 'grey';
};

const getReportTypeName = (tipo) => {
  const names = {
    'proyecto_completo': 'Reporte Completo',
    'progreso_proyecto': 'Progreso del Proyecto',
    'horas_voluntarios': 'Reporte de Horas',
    'rendimiento_equipo': 'Rendimiento del Equipo'
  };
  return names[tipo] || tipo;
};

const getStatusColor = (estado) => {
  const colors = {
    'pendiente': 'warning',
    'generando': 'info',
    'listo': 'success',
    'error': 'error'
  };
  return colors[estado] || 'grey';
};

const getStatusIcon = (estado) => {
  const icons = {
    'pendiente': 'mdi-clock-outline',
    'generando': 'mdi-loading',
    'listo': 'mdi-check-circle',
    'error': 'mdi-alert-circle'
  };
  return icons[estado] || 'mdi-help-circle';
};

const getStatusText = (estado) => {
  const texts = {
    'pendiente': 'Pendiente',
    'generando': 'Generando',
    'listo': 'Listo',
    'error': 'Error'
  };
  return texts[estado] || estado;
};

const viewReportDetails = (report) => {
  selectedReport.value = report;
  detailsDialog.value = true;
};

const shareReport = (report) => {
  if (navigator.share) {
    navigator.share({
      title: `Reporte: ${getReportTypeName(report.tipo)}`,
      text: `Reporte generado el ${formatDate(report.creado_en)}`,
      url: window.location.href
    });
  } else {
    // Fallback: copiar al portapapeles
    const url = `${window.location.origin}/reportes/${report.id_reporte}`;
    navigator.clipboard.writeText(url).then(() => {
      showSuccess('Enlace copiado al portapapeles');
    }).catch(() => {
      showError('Error al copiar enlace');
    });
  }
};

const deleteReport = (report) => {
  if (confirm(`¿Estás seguro de que quieres eliminar el reporte "${getReportTypeName(report.tipo)}"?`)) {
    emit('delete', report.id_reporte);
  }
};
</script>

<style scoped>
.reports-table {
  width: 100%;
}

.table-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.reports-data-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.reports-data-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.empty-state {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  margin: 24px 0;
}

.report-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
}

.detail-value {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}
</style>
