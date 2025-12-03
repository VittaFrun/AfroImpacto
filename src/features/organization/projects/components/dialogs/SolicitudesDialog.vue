<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Solicitudes de Inscripción"
    icon="mdi-account-plus"
    max-width="1000px"
  >
    <template #content>
      <!-- Filtros y estadísticas -->
      <div class="mb-4">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Buscar voluntario..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <div class="d-flex align-center gap-2 flex-wrap">
              <v-chip
                :color="filter === 'all' ? 'primary' : 'default'"
                :variant="filter === 'all' ? 'flat' : 'outlined'"
                size="small"
                @click="filter = 'all'"
                style="cursor: pointer;"
              >
                Todas ({{ solicitudes.length }})
              </v-chip>
              <v-chip
                :color="filter === 'pendiente' ? 'warning' : 'default'"
                :variant="filter === 'pendiente' ? 'flat' : 'outlined'"
                size="small"
                @click="filter = 'pendiente'"
                style="cursor: pointer;"
              >
                Pendientes ({{ solicitudesPendientes.length }})
              </v-chip>
              <v-chip
                :color="filter === 'aprobada' ? 'success' : 'default'"
                :variant="filter === 'aprobada' ? 'flat' : 'outlined'"
                size="small"
                @click="filter = 'aprobada'"
                style="cursor: pointer;"
              >
                Aprobadas ({{ solicitudesAprobadas.length }})
              </v-chip>
              <v-chip
                :color="filter === 'rechazada' ? 'error' : 'default'"
                :variant="filter === 'rechazada' ? 'flat' : 'outlined'"
                size="small"
                @click="filter = 'rechazada'"
                style="cursor: pointer;"
              >
                Rechazadas ({{ solicitudesRechazadas.length }})
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </div>

      <v-divider class="mb-4"></v-divider>

      <!-- Lista de solicitudes -->
      <div v-if="filteredSolicitudes.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-inbox</v-icon>
        <p class="text-body-1 text-grey mt-4">
          {{ search ? 'No se encontraron solicitudes' : 'No hay solicitudes' }}
        </p>
      </div>
      
      <div v-else>
        <v-expansion-panels v-model="expandedPanels" multiple>
          <v-expansion-panel
            v-for="solicitud in filteredSolicitudes"
            :key="solicitud.id_solicitud"
            class="mb-2"
          >
            <v-expansion-panel-title>
              <div class="d-flex align-center justify-space-between w-100 pr-4">
                <div class="d-flex align-center gap-3">
                  <v-avatar color="primary" size="40">
                    {{ solicitud.voluntario?.usuario?.nombre?.charAt(0) || 'V' }}
                  </v-avatar>
                  <div>
                    <div class="text-body-1 font-weight-medium">
                      {{ solicitud.voluntario?.usuario?.nombre || 'Voluntario' }}
                    </div>
                    <div class="text-caption text-grey">
                      {{ solicitud.voluntario?.usuario?.email || '' }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <v-chip
                    :color="getEstadoColor(solicitud.estado)"
                    size="small"
                    variant="tonal"
                  >
                    <v-icon start size="14">{{ getEstadoIcon(solicitud.estado) }}</v-icon>
                    {{ getEstadoText(solicitud.estado) }}
                  </v-chip>
                  <v-chip
                    v-if="solicitud.documentos && solicitud.documentos.length > 0"
                    color="info"
                    size="small"
                    variant="tonal"
                  >
                    <v-icon start size="14">mdi-file-document</v-icon>
                    {{ solicitud.documentos.length }} documento(s)
                  </v-chip>
                </div>
              </div>
            </v-expansion-panel-title>
            
            <v-expansion-panel-text>
              <div class="pa-4">
                <!-- Información del voluntario -->
                <div class="mb-4">
                  <h4 class="text-subtitle-1 font-weight-bold mb-3">Información del Voluntario</h4>
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="info-item mb-2">
                        <span class="text-caption text-grey">Nombre:</span>
                        <div class="text-body-2">{{ solicitud.voluntario?.usuario?.nombre || 'N/A' }}</div>
                      </div>
                      <div class="info-item mb-2">
                        <span class="text-caption text-grey">Email:</span>
                        <div class="text-body-2">{{ solicitud.voluntario?.usuario?.email || 'N/A' }}</div>
                      </div>
                      <div class="info-item mb-2">
                        <span class="text-caption text-grey">Teléfono:</span>
                        <div class="text-body-2">{{ solicitud.voluntario?.usuario?.telefono || 'N/A' }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="info-item mb-2">
                        <span class="text-caption text-grey">Fecha de solicitud:</span>
                        <div class="text-body-2">{{ formatDate(solicitud.creado_en) }}</div>
                      </div>
                      <div v-if="solicitud.fecha_revision" class="info-item mb-2">
                        <span class="text-caption text-grey">Fecha de revisión:</span>
                        <div class="text-body-2">{{ formatDate(solicitud.fecha_revision) }}</div>
                      </div>
                      <div v-if="solicitud.notas_organizacion" class="info-item mb-2">
                        <span class="text-caption text-grey">Notas de la organización:</span>
                        <div class="text-body-2">{{ solicitud.notas_organizacion }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!-- Motivación -->
                <div v-if="solicitud.motivacion" class="mb-4">
                  <h4 class="text-subtitle-1 font-weight-bold mb-2">Motivación</h4>
                  <v-card variant="outlined" class="pa-3">
                    <p class="text-body-2 mb-0">{{ solicitud.motivacion }}</p>
                  </v-card>
                </div>

                <!-- Disponibilidad -->
                <div v-if="solicitud.disponibilidad" class="mb-4">
                  <h4 class="text-subtitle-1 font-weight-bold mb-2">Disponibilidad</h4>
                  <v-card variant="outlined" class="pa-3">
                    <p class="text-body-2 mb-0">{{ solicitud.disponibilidad }}</p>
                  </v-card>
                </div>

                <!-- Experiencia -->
                <div v-if="solicitud.experiencia" class="mb-4">
                  <h4 class="text-subtitle-1 font-weight-bold mb-2">Experiencia</h4>
                  <v-card variant="outlined" class="pa-3">
                    <p class="text-body-2 mb-0">{{ solicitud.experiencia }}</p>
                  </v-card>
                </div>

                <!-- Documentos adjuntos -->
                <div v-if="solicitud.documentos && solicitud.documentos.length > 0" class="mb-4">
                  <h4 class="text-subtitle-1 font-weight-bold mb-3">Documentos Adjuntos</h4>
                  <v-row>
                    <v-col
                      v-for="documento in solicitud.documentos"
                      :key="documento.id_documento"
                      cols="12" md="6"
                    >
                      <v-card variant="outlined" class="pa-3">
                        <div class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center gap-2">
                            <v-icon color="primary">mdi-file-document</v-icon>
                            <div>
                              <div class="text-body-2 font-weight-medium">{{ documento.nombre_archivo }}</div>
                              <div class="text-caption text-grey">{{ documento.tipo_documento || 'Documento' }}</div>
                            </div>
                          </div>
                          <v-btn
                            icon="mdi-download"
                            size="small"
                            variant="text"
                            color="primary"
                            @click="downloadDocument(documento.id_documento, documento.nombre_archivo)"
                            :loading="downloadingDoc === documento.id_documento"
                          ></v-btn>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Campos personalizados -->
                <div v-if="solicitud.camposPersonalizados && Object.keys(solicitud.camposPersonalizados).length > 0" class="mb-4">
                  <h4 class="text-subtitle-1 font-weight-bold mb-3">Información Adicional</h4>
                  <v-card variant="outlined" class="pa-3">
                    <div
                      v-for="(value, key) in solicitud.camposPersonalizados"
                      :key="key"
                      class="mb-2"
                    >
                      <span class="text-caption text-grey font-weight-medium">{{ key }}:</span>
                      <div class="text-body-2">{{ value }}</div>
                    </div>
                  </v-card>
                </div>

                <!-- Acciones -->
                <div v-if="solicitud.estado === 'pendiente'" class="d-flex gap-2 mt-4">
                  <v-btn
                    color="success"
                    prepend-icon="mdi-check"
                    @click="$emit('update-estado', solicitud.id_solicitud, 'aprobada')"
                    :loading="loading && updatingId === solicitud.id_solicitud"
                  >
                    Aprobar
                  </v-btn>
                  <v-btn
                    color="error"
                    prepend-icon="mdi-close"
                    variant="outlined"
                    @click="$emit('update-estado', solicitud.id_solicitud, 'rechazada')"
                    :loading="loading && updatingId === solicitud.id_solicitud"
                  >
                    Rechazar
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
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
import api from '@/plugins/axios';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  solicitudes: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  updatingId: {
    type: Number,
    default: null
  },
  getEstadoColor: {
    type: Function,
    required: true
  },
  getEstadoText: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'update-estado']);

// Estado local
const search = ref('');
const filter = ref('all');
const expandedPanels = ref([]);
const downloadingDoc = ref(null);

// Computed
const solicitudesPendientes = computed(() => 
  props.solicitudes.filter(s => s.estado === 'pendiente')
);

const solicitudesAprobadas = computed(() => 
  props.solicitudes.filter(s => s.estado === 'aprobada')
);

const solicitudesRechazadas = computed(() => 
  props.solicitudes.filter(s => s.estado === 'rechazada')
);

const filteredSolicitudes = computed(() => {
  let result = props.solicitudes;

  // Filtrar por estado
  if (filter.value !== 'all') {
    result = result.filter(s => s.estado === filter.value);
  }

  // Filtrar por búsqueda
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(s => {
      const nombre = s.voluntario?.usuario?.nombre?.toLowerCase() || '';
      const email = s.voluntario?.usuario?.email?.toLowerCase() || '';
      return nombre.includes(searchLower) || email.includes(searchLower);
    });
  }

  return result;
});

// Métodos
function getEstadoIcon(estado) {
  const icons = {
    'pendiente': 'mdi-clock-outline',
    'aprobada': 'mdi-check-circle',
    'rechazada': 'mdi-close-circle'
  };
  return icons[estado] || 'mdi-help-circle';
}

async function downloadDocument(documentoId, nombreArchivo) {
  downloadingDoc.value = documentoId;
  try {
    const response = await api.get(`/documento-solicitud/${documentoId}/download`, {
      responseType: 'blob'
    });
    
    // Crear URL del blob y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreArchivo || 'documento.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading document:', error);
    // Fallback: intentar descargar desde la ruta del archivo si está disponible
    if (error.response?.data?.ruta_archivo) {
      window.open(error.response.data.ruta_archivo, '_blank');
    }
  } finally {
    downloadingDoc.value = null;
  }
}
</script>

<style scoped>
.info-item {
  padding: 4px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .v-expansion-panel-title {
    padding: 12px !important;
  }
  
  .v-expansion-panel-text {
    padding: 12px !important;
  }
  
  /* Stack filter chips on mobile */
  .d-flex.gap-2 {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  .v-chip {
    width: 100%;
    justify-content: center;
  }
  
  /* Make info rows stack on mobile */
  .v-row {
    flex-direction: column;
  }
  
  .v-col {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  /* Full width buttons on mobile */
  .v-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .v-expansion-panel-title {
    padding: 8px !important;
    font-size: 0.875rem;
  }
  
  .v-expansion-panel-text {
    padding: 8px !important;
  }
}
</style>

