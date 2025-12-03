<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Gestión de Horas Voluntariadas"
    icon="mdi-clock-check"
    max-width="1600px"
  >
    <template #content>
      <LoadingWrapper :loading="loading" :error="null">
        <div v-if="!loading">
          <!-- Header con Estadísticas -->
          <v-card class="mb-4" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-4">
                <div>
                  <h3 class="text-h6 font-weight-bold mb-1">Resumen de Horas</h3>
                  <p class="text-caption text-grey mb-0">Gestión y verificación de horas voluntariadas</p>
                </div>
                <v-chip color="primary" variant="tonal" size="large">
                  <v-icon start>mdi-clock-outline</v-icon>
                  {{ filteredHours.length }} registro(s)
                </v-chip>
              </div>

              <!-- Cards de Estadísticas -->
              <v-row dense>
                <v-col cols="6" sm="3">
                  <v-card 
                    class="stat-card total-hours" 
                    variant="outlined" 
                    rounded="lg"
                    :class="{ 'highlight-card': filteredHours.length > 0 }"
                  >
                    <v-card-text class="pa-3">
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <div class="text-caption text-grey mb-1">Total Horas</div>
                          <div class="text-h5 font-weight-bold text-primary">{{ totalHours }}h</div>
                        </div>
                        <v-icon color="primary" size="32">mdi-clock-time-four</v-icon>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-card 
                    class="stat-card verified-hours" 
                    variant="outlined" 
                    rounded="lg"
                    :class="{ 'highlight-card': verifiedHoursCount > 0 }"
                  >
                    <v-card-text class="pa-3">
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <div class="text-caption text-grey mb-1">Verificadas</div>
                          <div class="text-h5 font-weight-bold text-success">{{ verifiedHours }}h</div>
                          <div class="text-caption text-success mt-1">{{ verifiedHoursCount }} registro(s)</div>
                        </div>
                        <v-icon color="success" size="32">mdi-check-circle</v-icon>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-card 
                    class="stat-card pending-hours" 
                    variant="outlined" 
                    rounded="lg"
                    :class="{ 'highlight-card': pendingHoursCount > 0 }"
                  >
                    <v-card-text class="pa-3">
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <div class="text-caption text-grey mb-1">Pendientes</div>
                          <div class="text-h5 font-weight-bold text-warning">{{ pendingHours }}h</div>
                          <div class="text-caption text-warning mt-1">{{ pendingHoursCount }} registro(s)</div>
                        </div>
                        <v-icon color="warning" size="32">mdi-clock-alert</v-icon>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-card 
                    class="stat-card verification-rate" 
                    variant="outlined" 
                    rounded="lg"
                  >
                    <v-card-text class="pa-3">
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <div class="text-caption text-grey mb-1">Tasa de Verificación</div>
                          <div class="text-h5 font-weight-bold">{{ verificationRate }}%</div>
                        </div>
                        <v-icon color="info" size="32">mdi-chart-line</v-icon>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Filtros y Acciones -->
          <v-card class="mb-4" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-3">
                <h4 class="text-subtitle-1 font-weight-bold mb-0">
                  <v-icon class="mr-2" size="20">mdi-filter</v-icon>
                  Filtros y Búsqueda
                </h4>
                <div class="d-flex gap-2">
                  <v-btn
                    v-if="hasActiveFilters"
                    icon="mdi-filter-off"
                    variant="text"
                    size="small"
                    color="grey"
                    @click="clearFilters"
                  >
                    <v-icon>mdi-filter-off</v-icon>
                    <v-tooltip activator="parent">Limpiar filtros</v-tooltip>
                  </v-btn>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="primary"
                        variant="outlined"
                        prepend-icon="mdi-file-export"
                        :disabled="filteredHours.length === 0"
                        size="small"
                      >
                        Exportar
                        <v-icon end>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="exportData('excel')">
                        <v-list-item-title>
                          <v-icon start>mdi-file-excel</v-icon>
                          Exportar a Excel
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="exportData('pdf')">
                        <v-list-item-title>
                          <v-icon start>mdi-file-pdf-box</v-icon>
                          Exportar a PDF
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>

              <v-row dense>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="searchQuery"
                    label="Buscar voluntario, tarea o descripción..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-select
                    v-model="statusFilter"
                    :items="statusOptions"
                    label="Estado"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" md="2">
                  <SmartDatePicker
                    v-model="dateFrom"
                    label="Desde"
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-calendar-start"
                    :max-date="dateTo || undefined"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <SmartDatePicker
                    v-model="dateTo"
                    label="Hasta"
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-calendar-end"
                    :min-date="dateFrom || undefined"
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn
                    v-if="selectedHours.length > 0"
                    color="success"
                    variant="flat"
                    prepend-icon="mdi-check-all"
                    @click="verifySelected"
                    :loading="verifyingMultiple"
                    block
                    size="small"
                  >
                    Verificar ({{ selectedHours.length }})
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Analytics Chart -->
          <v-card v-if="filteredHours.length > 0" class="mb-4" variant="outlined" rounded="lg">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-chart-bar</v-icon>
              Análisis de Horas
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <HoursAnalytics
                :hours="filteredHours"
                :loading="false"
              />
            </v-card-text>
          </v-card>

          <!-- Tabla de Horas -->
          <v-card variant="outlined" rounded="lg">
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-table</v-icon>
                Registros de Horas
                <v-chip v-if="selectedHours.length > 0" color="primary" variant="tonal" size="small" class="ml-3">
                  {{ selectedHours.length }} seleccionada(s)
                </v-chip>
              </div>
              <v-checkbox
                v-model="selectAll"
                :indeterminate="selectedHours.length > 0 && selectedHours.length < filteredHours.length"
                label="Seleccionar todas"
                density="compact"
                hide-details
                class="mr-2"
              ></v-checkbox>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <div v-if="filteredHours.length === 0" class="text-center py-12">
                <EmptyState
                  icon="mdi-clock-outline"
                  title="No hay horas registradas"
                  description="No se encontraron horas con los filtros aplicados"
                  variant="no-data"
                />
              </div>
              <div v-else>
                <v-table class="hours-table" hover>
                  <thead>
                    <tr>
                      <th class="checkbox-column">
                        <v-checkbox
                          v-model="selectAll"
                          :indeterminate="selectedHours.length > 0 && selectedHours.length < filteredHours.length"
                          hide-details
                          density="compact"
                        ></v-checkbox>
                      </th>
                      <th>Voluntario</th>
                      <th>Fecha</th>
                      <th class="text-center">Horas</th>
                      <th>Tarea</th>
                      <th>Descripción</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="hora in filteredHours" 
                      :key="hora.id_horas"
                      :class="{ 'selected-row': selectedHours.includes(hora.id_horas) }"
                    >
                      <td class="checkbox-column">
                        <v-checkbox
                          :model-value="selectedHours.includes(hora.id_horas)"
                          @update:model-value="toggleSelect(hora.id_horas, $event)"
                          hide-details
                          density="compact"
                          color="primary"
                        ></v-checkbox>
                      </td>
                      <td>
                        <div class="d-flex align-center">
                          <v-avatar size="32" color="primary" class="mr-2">
                            <span class="text-white text-caption font-weight-bold">
                              {{ getVolunteerInitials(hora) }}
                            </span>
                          </v-avatar>
                          <div>
                            <div class="font-weight-medium">
                              {{ hora.voluntario?.usuario?.nombre || hora.voluntario?.nombre || 'Voluntario' }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ hora.voluntario?.usuario?.email || '' }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-center">
                          <v-icon size="16" color="grey" class="mr-1">mdi-calendar</v-icon>
                          <span>{{ formatDate(hora.fecha) }}</span>
                        </div>
                      </td>
                      <td class="text-center">
                        <v-chip
                          :color="getHoursColor(hora.horas_trabajadas)"
                          variant="tonal"
                          size="small"
                          class="font-weight-bold"
                        >
                          {{ parseFloat(hora.horas_trabajadas || 0).toFixed(2) }}h
                        </v-chip>
                      </td>
                      <td>
                        <div class="d-flex align-center">
                          <v-icon size="16" color="info" class="mr-1">mdi-format-list-checks</v-icon>
                          <span class="text-truncate" style="max-width: 200px;">
                            {{ hora.tarea?.descripcion || 'N/A' }}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span class="text-truncate" style="max-width: 250px; display: inline-block;">
                          {{ hora.descripcion || '-' }}
                        </span>
                      </td>
                      <td class="text-center">
                        <v-chip
                          :color="hora.verificada ? 'success' : 'warning'"
                          size="small"
                          variant="tonal"
                          :prepend-icon="hora.verificada ? 'mdi-check-circle' : 'mdi-clock-alert'"
                        >
                          {{ hora.verificada ? 'Verificada' : 'Pendiente' }}
                        </v-chip>
                      </td>
                      <td class="text-center">
                        <div class="d-flex align-center justify-center gap-1">
                          <v-tooltip :text="hora.verificada ? 'Desverificar' : 'Verificar'">
                            <template #activator="{ props }">
                              <v-btn
                                v-bind="props"
                                :icon="hora.verificada ? 'mdi-close-circle' : 'mdi-check-circle'"
                                :color="hora.verificada ? 'warning' : 'success'"
                                size="small"
                                variant="text"
                                @click="hora.verificada ? $emit('unverify-hours', hora.id_horas) : $emit('verify-hours', hora.id_horas)"
                                :loading="verifyingHours === hora.id_horas"
                              ></v-btn>
                            </template>
                          </v-tooltip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </LoadingWrapper>
    </template>
    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cerrar
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import LoadingWrapper from '@/components/feedback/LoadingWrapper.vue';
import SmartDatePicker from '@/components/ui/SmartDatePicker.vue';
import { createLazyComponent } from '@/utils/lazyLoad';
const HoursAnalytics = createLazyComponent(() => import('@/features/organization/components/HoursAnalytics.vue'));
import EmptyState from '@/components/feedback/EmptyState.vue';
import { formatDate } from '@/utils/formatters';
import { exportToCSV, exportToExcel, formatHoursForExport } from '@/utils/exportUtils';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  volunteerHours: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  verifyingHours: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'verify-hours', 'unverify-hours', 'verify-multiple']);

// Filters
const searchQuery = ref('');
const statusFilter = ref(null);
const dateFrom = ref(null);
const dateTo = ref(null);
const selectedHours = ref([]);
const verifyingMultiple = ref(false);

const statusOptions = [
  { title: 'Todas', value: null },
  { title: 'Verificadas', value: 'verified' },
  { title: 'Pendientes', value: 'pending' }
];

const filteredHours = computed(() => {
  let filtered = [...props.volunteerHours];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(h => {
      const volunteerName = (h.voluntario?.usuario?.nombre || h.voluntario?.nombre || '').toLowerCase();
      const taskDesc = (h.tarea?.descripcion || '').toLowerCase();
      const desc = (h.descripcion || '').toLowerCase();
      return volunteerName.includes(query) || taskDesc.includes(query) || desc.includes(query);
    });
  }

  // Status filter
  if (statusFilter.value === 'verified') {
    filtered = filtered.filter(h => h.verificada);
  } else if (statusFilter.value === 'pending') {
    filtered = filtered.filter(h => !h.verificada);
  }

  // Date filters
  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value);
    filtered = filtered.filter(h => {
      const hDate = new Date(h.fecha);
      return hDate >= fromDate;
    });
  }

  if (dateTo.value) {
    const toDate = new Date(dateTo.value);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(h => {
      const hDate = new Date(h.fecha);
      return hDate <= toDate;
    });
  }

  return filtered;
});

const totalHours = computed(() => {
  return filteredHours.value.reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0).toFixed(2);
});

const verifiedHours = computed(() => {
  return filteredHours.value
    .filter(h => h.verificada)
    .reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0).toFixed(2);
});

const verifiedHoursCount = computed(() => {
  return filteredHours.value.filter(h => h.verificada).length;
});

const pendingHours = computed(() => {
  return filteredHours.value
    .filter(h => !h.verificada)
    .reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0).toFixed(2);
});

const pendingHoursCount = computed(() => {
  return filteredHours.value.filter(h => !h.verificada).length;
});

const verificationRate = computed(() => {
  if (filteredHours.value.length === 0) return 0;
  return Math.round((verifiedHoursCount.value / filteredHours.value.length) * 100);
});

const selectAll = computed({
  get: () => filteredHours.value.length > 0 && selectedHours.value.length === filteredHours.value.length,
  set: (value) => {
    if (value) {
      selectedHours.value = filteredHours.value.map(h => h.id_horas);
    } else {
      selectedHours.value = [];
    }
  }
});

const hasActiveFilters = computed(() => {
  return !!searchQuery.value || !!statusFilter.value || !!dateFrom.value || !!dateTo.value;
});

const toggleSelect = (id, selected) => {
  if (selected) {
    if (!selectedHours.value.includes(id)) {
      selectedHours.value.push(id);
    }
  } else {
    selectedHours.value = selectedHours.value.filter(h => h !== id);
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = null;
  dateFrom.value = null;
  dateTo.value = null;
};

const verifySelected = async () => {
  if (selectedHours.value.length === 0) return;
  
  verifyingMultiple.value = true;
  try {
    emit('verify-multiple', selectedHours.value);
    selectedHours.value = [];
  } finally {
    verifyingMultiple.value = false;
  }
};

const exportData = async (format = 'excel') => {
  const dateStr = new Date().toISOString().split('T')[0];
  const projectName = props.projectName || 'Proyecto';
  
  if (format === 'pdf') {
    try {
      const { exportHoursToPDF } = await import('@/utils/pdfExportService.js');
      await exportHoursToPDF(filteredHours.value, projectName, {
        groupBy: null,
        includeSummary: true
      });
    } catch (error) {
      console.error('Error exporting hours to PDF:', error);
      // Fallback a Excel
      exportData('excel');
    }
  } else {
    const headers = [
      { label: 'Voluntario', field: 'Voluntario' },
      { label: 'Fecha', field: 'Fecha' },
      { label: 'Horas Trabajadas', field: 'Horas Trabajadas' },
      { label: 'Tarea', field: 'Tarea' },
      { label: 'Descripción', field: 'Descripción' },
      { label: 'Estado', field: 'Estado' },
      { label: 'Fecha de Registro', field: 'Fecha de Registro' }
    ];

    const formattedData = formatHoursForExport(filteredHours.value);
    exportToExcel(formattedData, headers, `horas-voluntariadas-${dateStr}.xlsx`);
  }
};

const getVolunteerInitials = (hora) => {
  const name = hora.voluntario?.usuario?.nombre || hora.voluntario?.nombre || 'V';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

const getHoursColor = (hours) => {
  const h = parseFloat(hours || 0);
  if (h >= 8) return 'success';
  if (h >= 4) return 'info';
  if (h >= 2) return 'warning';
  return 'grey';
};
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.highlight-card {
  border-color: rgba(var(--v-theme-primary), 0.3);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.02) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
}

.hours-table {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.hours-table th {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.87) !important;
}

.hours-table tbody tr {
  transition: all 0.2s ease;
}

.hours-table tbody tr:hover {
  background: rgba(var(--v-theme-primary), 0.03);
}

.hours-table tbody tr.selected-row {
  background: rgba(var(--v-theme-primary), 0.08);
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.checkbox-column {
  width: 50px;
  text-align: center;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
