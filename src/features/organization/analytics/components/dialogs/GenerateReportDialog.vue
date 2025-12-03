<template>
  <v-dialog
    v-model="localDialog"
    max-width="800"
    persistent
    scrollable
  >
    <v-card class="generate-report-dialog">
      <v-card-title class="dialog-header">
        <div class="d-flex align-center">
          <v-icon class="mr-3" color="primary">mdi-file-chart</v-icon>
          <div>
            <h2 class="text-h5 font-weight-bold">Generar Reporte</h2>
            <p class="text-body-2 text-grey-darken-1 mb-0">
              Configura los parámetros para tu reporte personalizado
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValid">
          <v-row>
            <!-- Tipo de Reporte -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4" rounded="lg">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  <v-icon class="mr-2" size="small">mdi-file-document</v-icon>
                  Tipo de Reporte
                </div>
                <v-select
                  v-model="form.tipo"
                  :items="reportTypes"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Selecciona un tipo de reporte']"
                  @update:model-value="onReportTypeChange"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon :icon="item.raw.icon" size="small"></v-icon>
                      </template>
                      <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
              </v-card>
            </v-col>

            <!-- Formato -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4" rounded="lg">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  <v-icon class="mr-2" size="small">mdi-file-export</v-icon>
                  Formato de Salida
                </div>
                <v-select
                  v-model="form.formato"
                  :items="formatOptions"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  :rules="[v => !!v || 'Selecciona un formato']"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon :icon="item.raw.icon" size="small"></v-icon>
                      </template>
                      <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
              </v-card>
            </v-col>

            <!-- Proyecto -->
            <v-col cols="12">
              <v-card variant="outlined" class="pa-4" rounded="lg">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  <v-icon class="mr-2" size="small">mdi-folder</v-icon>
                  Proyecto
                </div>
                <v-autocomplete
                  v-model="form.id_proyecto"
                  :items="projects"
                  item-title="nombre"
                  item-value="id_proyecto"
                  variant="outlined"
                  density="compact"
                  placeholder="Buscar proyecto..."
                  :rules="[v => !!v || 'Selecciona un proyecto']"
                  clearable
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <v-list-item-title>{{ item.raw.nombre }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.raw.organizacion?.nombre }} • {{ formatDate(item.raw.fecha_inicio) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-card>
            </v-col>

            <!-- Rango de Fechas -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4" rounded="lg">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  <v-icon class="mr-2" size="small">mdi-calendar-range</v-icon>
                  Rango de Fechas (Opcional)
                </div>
                <v-text-field
                  v-model="form.fecha_inicio"
                  type="date"
                  label="Fecha de inicio"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                ></v-text-field>
                <v-text-field
                  v-model="form.fecha_fin"
                  type="date"
                  label="Fecha de fin"
                  variant="outlined"
                  density="compact"
                  :rules="dateRangeRules"
                ></v-text-field>
              </v-card>
            </v-col>

            <!-- Opciones de Contenido -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4" rounded="lg">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  <v-icon class="mr-2" size="small">mdi-cog</v-icon>
                  Contenido del Reporte
                </div>
                <div class="content-options">
                  <v-checkbox
                    v-model="form.incluir_graficos"
                    label="Incluir gráficos"
                    density="compact"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="form.incluir_detalles"
                    label="Incluir detalles de tareas"
                    density="compact"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="form.incluir_horas"
                    label="Incluir registro de horas"
                    density="compact"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="form.incluir_voluntarios"
                    label="Incluir información de voluntarios"
                    density="compact"
                    hide-details
                  ></v-checkbox>
                </div>
              </v-card>
            </v-col>

            <!-- Modo de Generación -->
            <v-col cols="12">
              <v-card variant="outlined" class="pa-4" rounded="lg">
                <div class="text-subtitle-1 font-weight-medium mb-3">
                  <v-icon class="mr-2" size="small">mdi-lightning-bolt</v-icon>
                  Modo de Generación
                </div>
                <v-radio-group
                  v-model="form.async"
                  inline
                  hide-details
                >
                  <v-radio
                    :value="false"
                    label="Descarga Inmediata"
                    color="primary"
                  >
                    <template #label>
                      <div>
                        <div class="font-weight-medium">Descarga Inmediata</div>
                        <div class="text-caption text-grey-darken-1">
                          Para reportes simples sin gráficos
                        </div>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio
                    :value="true"
                    label="Generación Asíncrona"
                    color="primary"
                  >
                    <template #label>
                      <div>
                        <div class="font-weight-medium">Generación Asíncrona</div>
                        <div class="text-caption text-grey-darken-1">
                          Para reportes complejos con gráficos
                        </div>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="closeDialog"
          :disabled="generating"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="generating"
          :disabled="!formValid"
          @click="generateReport"
        >
          <v-icon start>mdi-file-chart</v-icon>
          {{ form.async ? 'Generar Reporte' : 'Descargar Reporte' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  generating: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'generate']);

// Stores
const projectStore = useProjectStore();

// Refs
const formRef = ref(null);
const formValid = ref(false);

// Form data
const form = ref({
  tipo: 'proyecto_completo',
  formato: 'PDF',
  id_proyecto: null,
  fecha_inicio: '',
  fecha_fin: '',
  incluir_graficos: true,
  incluir_detalles: true,
  incluir_horas: true,
  incluir_voluntarios: true,
  async: true
});

// Computed
const localDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const projects = computed(() => projectStore.projects || []);

const reportTypes = computed(() => [
  {
    value: 'proyecto_completo',
    label: 'Reporte Completo del Proyecto',
    description: 'Incluye todas las métricas y detalles',
    icon: 'mdi-file-document-multiple'
  },
  {
    value: 'progreso_proyecto',
    label: 'Progreso del Proyecto',
    description: 'Enfocado en el avance y cumplimiento',
    icon: 'mdi-chart-timeline-variant'
  },
  {
    value: 'horas_voluntarios',
    label: 'Reporte de Horas',
    description: 'Detalle de horas trabajadas por voluntarios',
    icon: 'mdi-clock-outline'
  },
  {
    value: 'rendimiento_equipo',
    label: 'Rendimiento del Equipo',
    description: 'Análisis del desempeño del equipo',
    icon: 'mdi-account-group'
  }
]);

const formatOptions = computed(() => [
  {
    value: 'PDF',
    label: 'PDF',
    description: 'Documento portable con formato',
    icon: 'mdi-file-pdf-box'
  },
  {
    value: 'Excel',
    label: 'Excel',
    description: 'Hoja de cálculo para análisis',
    icon: 'mdi-file-excel'
  },
  {
    value: 'CSV',
    label: 'CSV',
    description: 'Datos separados por comas',
    icon: 'mdi-file-delimited'
  }
]);

const dateRangeRules = computed(() => [
  v => {
    if (!form.value.fecha_inicio || !v) return true;
    return new Date(v) >= new Date(form.value.fecha_inicio) || 'La fecha de fin debe ser posterior a la fecha de inicio';
  }
]);

// Methods
const onReportTypeChange = (newType) => {
  // Ajustar opciones por defecto según el tipo de reporte
  switch (newType) {
    case 'horas_voluntarios':
      form.value.incluir_horas = true;
      form.value.incluir_voluntarios = true;
      form.value.incluir_detalles = false;
      break;
    case 'progreso_proyecto':
      form.value.incluir_graficos = true;
      form.value.incluir_detalles = true;
      break;
    case 'rendimiento_equipo':
      form.value.incluir_voluntarios = true;
      form.value.incluir_graficos = true;
      break;
    default:
      // proyecto_completo - mantener todas las opciones
      break;
  }
};

const generateReport = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  const reportData = {
    ...form.value,
    // Convertir fechas vacías a null
    fecha_inicio: form.value.fecha_inicio || null,
    fecha_fin: form.value.fecha_fin || null
  };

  emit('generate', reportData);
};

const closeDialog = () => {
  localDialog.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    tipo: 'proyecto_completo',
    formato: 'PDF',
    id_proyecto: null,
    fecha_inicio: '',
    fecha_fin: '',
    incluir_graficos: true,
    incluir_detalles: true,
    incluir_horas: true,
    incluir_voluntarios: true,
    async: true
  };
  formRef.value?.resetValidation();
};

// Watchers
watch(() => form.value.incluir_graficos, (includeGraphics) => {
  if (includeGraphics && form.value.formato !== 'PDF') {
    // Los gráficos solo están disponibles en PDF para generación asíncrona
    form.value.async = true;
  }
});

watch(() => form.value.formato, (format) => {
  if (format === 'CSV') {
    // CSV no soporta gráficos
    form.value.incluir_graficos = false;
  }
});

// Lifecycle
onMounted(async () => {
  try {
    await projectStore.fetchProjects();
  } catch (error) {
    console.error('Error loading projects:', error);
  }
});
</script>

<style scoped>
.generate-report-dialog {
  max-height: 90vh;
}

.dialog-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
}

.content-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.content-options .v-checkbox {
  margin: 0;
}

.v-radio-group :deep(.v-selection-control) {
  margin-bottom: 16px;
}

.v-radio-group :deep(.v-label) {
  opacity: 1;
}
</style>
