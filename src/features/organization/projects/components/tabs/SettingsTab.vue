<template>
  <v-row>
    <v-col cols="12" lg="8">
      <!-- Configuración del Proyecto -->
      <v-card class="professional-section-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center">
            <div class="professional-card-icon primary">
              <v-icon color="white" size="20">mdi-cog</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-h6 font-weight-bold mb-0">Configuración General</h3>
              <p class="text-caption text-grey mb-0">Ajustes del proyecto</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-list density="compact">
            <v-list-item class="mb-2">
              <div class="d-flex align-center justify-space-between w-100">
                <div>
                  <div class="text-body-1 font-weight-medium">Visibilidad en Catálogo</div>
                  <div class="text-caption text-grey">
                    {{ project.es_publico ? 'El proyecto es visible en el catálogo de voluntarios' : 'El proyecto está oculto del catálogo' }}
                  </div>
                </div>
                <v-switch
                  :model-value="project.es_publico"
                  @update:model-value="$emit('toggle-visibility')"
                  color="success"
                  hide-details
                  :loading="isLoading('togglingVisibility')"
                ></v-switch>
              </div>
            </v-list-item>

            <v-divider class="my-3"></v-divider>

            <v-list-item class="mb-2">
              <div class="d-flex align-center justify-space-between w-100">
                <div>
                  <div class="text-body-1 font-weight-medium">Estado del Proyecto</div>
                  <div class="text-caption text-grey">Estado actual: {{ getStatusText(project.id_estado) }}</div>
                </div>
                <v-chip 
                  :color="getStatusColor(project.id_estado)" 
                  size="small"
                >
                  <v-icon start size="16">{{ getStatusIcon(project.id_estado) }}</v-icon>
                  {{ getStatusText(project.id_estado) }}
                </v-chip>
              </div>
            </v-list-item>

            <v-divider class="my-3"></v-divider>

            <v-list-item>
              <div class="d-flex align-center justify-space-between w-100">
                <div>
                  <div class="text-body-1 font-weight-medium">Editar Información</div>
                  <div class="text-caption text-grey">Modificar detalles básicos del proyecto</div>
                </div>
                <ModernButton
                  color="warning"
                  variant="outlined"
                  prepend-icon="mdi-pencil"
                  @click="$emit('edit-project')"
                  size="small"
                >
                  Editar
                </ModernButton>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Beneficios y Remuneración -->
      <v-card class="professional-section-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center">
            <div class="professional-card-icon success">
              <v-icon color="white" size="20">mdi-cash-multiple</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-h6 font-weight-bold mb-0">Beneficios y Remuneración</h3>
              <p class="text-caption text-grey mb-0">Configuración de pagos</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <div v-if="project?.beneficio">
            <div class="d-flex align-center mb-3">
              <v-chip color="success" class="mr-2">
                {{ getTipoPagoText(project.beneficio.tipo_pago) }}
              </v-chip>
              <span class="text-h6 font-weight-bold" v-if="project.beneficio.monto > 0">
                ${{ formatCurrency(project.beneficio.monto) }}
                <span class="text-caption text-grey" v-if="project.beneficio.frecuencia !== 'none'">
                  / {{ getFrecuenciaText(project.beneficio.frecuencia) }}
                </span>
              </span>
            </div>
            
            <div v-if="project.beneficio.descripcion_pago" class="mb-3 pa-3 rounded" style="background: #fafafa;">
              <div class="text-caption text-grey mb-1">Descripción:</div>
              <div class="text-body-2">{{ project.beneficio.descripcion_pago }}</div>
            </div>

            <div class="mb-3">
              <div class="text-caption text-grey mb-2">Beneficios incluidos:</div>
              <div class="d-flex flex-wrap gap-2">
                <v-chip v-if="project.beneficio.incluye_transporte" size="small" color="info" variant="tonal">
                  <v-icon start size="small">mdi-bus</v-icon>
                  Transporte
                </v-chip>
                <v-chip v-if="project.beneficio.incluye_alimentacion" size="small" color="info" variant="tonal">
                  <v-icon start size="small">mdi-food</v-icon>
                  Alimentación
                </v-chip>
                <v-chip v-if="project.beneficio.incluye_materiales" size="small" color="info" variant="tonal">
                  <v-icon start size="small">mdi-toolbox</v-icon>
                  Materiales
                </v-chip>
                <v-chip v-if="project.beneficio.incluye_seguro" size="small" color="info" variant="tonal">
                  <v-icon start size="small">mdi-shield-check</v-icon>
                  Seguro
                </v-chip>
                <v-chip v-if="!hasAnyBenefit" size="small" color="grey" variant="tonal">
                  Sin beneficios adicionales
                </v-chip>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <v-icon size="64" color="grey-lighten-1">mdi-cash-off</v-icon>
            <p class="text-body-2 text-grey mt-2 mb-0">
              No se han configurado beneficios aún
            </p>
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
    </v-col>

    <!-- Sidebar con Acciones Avanzadas -->
    <v-col cols="12" lg="4">
      <!-- Exportar y Reportes -->
      <v-card class="professional-sidebar-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="professional-card-header">
          <div class="d-flex align-center">
            <div class="professional-card-icon info">
              <v-icon color="white" size="20">mdi-file-chart</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-subtitle-1 font-weight-bold mb-0">Reportes</h3>
              <p class="text-caption text-grey mb-0">Datos y análisis</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <ModernButton
            color="primary"
            variant="outlined"
            prepend-icon="mdi-chart-line"
            @click="$emit('open-reports')"
            block
            class="mb-2"
          >
            Ver Reportes
          </ModernButton>
          
          <ModernButton
            color="info"
            variant="outlined"
            prepend-icon="mdi-download"
            @click="$emit('export-data')"
            block
          >
            Exportar Datos
          </ModernButton>
        </v-card-text>
      </v-card>

      <!-- Zona de Peligro -->
      <v-card class="danger-zone-card mb-4" variant="outlined" rounded="lg">
        <v-card-title class="danger-card-header">
          <div class="d-flex align-center">
            <div class="danger-card-icon">
              <v-icon color="white" size="20">mdi-alert</v-icon>
            </div>
            <div class="ml-3">
              <h3 class="text-subtitle-1 font-weight-bold mb-0 text-error">Zona de Peligro</h3>
              <p class="text-caption text-grey mb-0">Acciones irreversibles</p>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="mb-3">
            <div class="text-body-2 font-weight-medium mb-2">Eliminar Proyecto</div>
            <p class="text-caption text-grey mb-3">
              Esta acción no se puede deshacer. Se eliminarán todas las fases, tareas y datos asociados.
            </p>
          </div>

          <ModernButton
            color="error"
            variant="outlined"
            prepend-icon="mdi-delete"
            @click="$emit('delete-project')"
            block
            :disabled="!canDeleteProject"
            :loading="isLoading('deletingProject')"
          >
            Eliminar Proyecto
          </ModernButton>

          <v-alert
            v-if="!canDeleteProject && deleteProjectRestrictionMessage"
            type="warning"
            density="compact"
            variant="tonal"
            class="mt-3"
          >
            <div class="text-caption">
              <v-icon size="16" class="mr-1">mdi-alert</v-icon>
              {{ deleteProjectRestrictionMessage }}
            </div>
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  canDeleteProject: {
    type: Boolean,
    default: false
  },
  deleteProjectRestrictionMessage: {
    type: String,
    default: ''
  },
  getStatusColor: {
    type: Function,
    required: true
  },
  getStatusIcon: {
    type: Function,
    required: true
  },
  getStatusText: {
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
  },
  formatCurrency: {
    type: Function,
    required: true
  },
  isLoading: {
    type: Function,
    required: true
  }
});

const emit = defineEmits([
  'toggle-visibility',
  'edit-project',
  'open-beneficio-dialog',
  'open-reports',
  'export-data',
  'delete-project'
]);

const hasAnyBenefit = computed(() => {
  if (!props.project?.beneficio) return false;
  const b = props.project.beneficio;
  return b.incluye_transporte || b.incluye_alimentacion || 
         b.incluye_materiales || b.incluye_seguro;
});
</script>

<style scoped>
.professional-section-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.professional-sidebar-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.danger-zone-card {
  background: #ffffff !important;
  border: 2px solid rgba(244, 67, 54, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.danger-zone-card:hover {
  border-color: rgba(244, 67, 54, 0.4) !important;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.15) !important;
}

.professional-card-header {
  padding: 16px 20px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  background: #fafafa !important;
}

.danger-card-header {
  padding: 16px 20px !important;
  border-bottom: 2px solid rgba(244, 67, 54, 0.2) !important;
  background: rgba(244, 67, 54, 0.05) !important;
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

.danger-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
  background: linear-gradient(135deg, #F44336 0%, #E57373 100%);
}
</style>

