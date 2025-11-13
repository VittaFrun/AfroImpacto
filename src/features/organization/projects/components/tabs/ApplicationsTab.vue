<template>
  <v-row>
    <v-col cols="12">
      <!-- Header con estadísticas -->
      <v-card class="mb-4 elevation-1" rounded="lg">
        <v-card-text class="pa-4">
          <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-4">
            <div>
              <h2 class="text-h6 font-weight-bold mb-1">
                <v-icon class="mr-2" color="info">mdi-account-plus</v-icon>
                Solicitudes de Inscripción
              </h2>
              <p class="text-body-2 text-grey mb-0">
                Gestiona las solicitudes de voluntarios para este proyecto
              </p>
            </div>
            <ModernButton
              color="info"
              variant="outlined"
              prepend-icon="mdi-refresh"
              @click="$emit('refresh-solicitudes')"
              size="small"
            >
              Actualizar
            </ModernButton>
          </div>

          <!-- Estadísticas Rápidas -->
          <v-row dense>
            <v-col cols="6" sm="3">
              <v-card class="text-center pa-3 rounded-lg stat-card" variant="outlined">
                <div class="text-h5 font-weight-bold text-primary">{{ solicitudes.length }}</div>
                <div class="text-caption text-grey">Total</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="text-center pa-3 rounded-lg stat-card" variant="outlined">
                <div class="text-h5 font-weight-bold text-warning">{{ solicitudesPendientes.length }}</div>
                <div class="text-caption text-grey">Pendientes</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="text-center pa-3 rounded-lg stat-card" variant="outlined">
                <div class="text-h5 font-weight-bold text-success">{{ solicitudesAprobadas.length }}</div>
                <div class="text-caption text-grey">Aprobadas</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="text-center pa-3 rounded-lg stat-card" variant="outlined">
                <div class="text-h5 font-weight-bold text-error">{{ solicitudesRechazadas.length }}</div>
                <div class="text-caption text-grey">Rechazadas</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Filtros y Búsqueda -->
      <v-card class="mb-4" rounded="lg" variant="outlined">
        <v-card-text class="pa-4">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchSolicitud"
                placeholder="Buscar por nombre o email..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn-toggle
                v-model="filterEstado"
                variant="outlined"
                density="compact"
                mandatory
                divided
                class="w-100"
              >
                <v-btn value="all" size="small" class="flex-grow-1">
                  Todas
                </v-btn>
                <v-btn value="pendiente" size="small" class="flex-grow-1">
                  <v-badge 
                    v-if="solicitudesPendientes.length > 0"
                    :content="solicitudesPendientes.length"
                    color="warning"
                    inline
                  >
                    Pendientes
                  </v-badge>
                  <span v-else>Pendientes</span>
                </v-btn>
                <v-btn value="aprobada" size="small" class="flex-grow-1">
                  Aprobadas
                </v-btn>
                <v-btn value="rechazada" size="small" class="flex-grow-1">
                  Rechazadas
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <!-- Acciones Masivas -->
          <div v-if="solicitudesPendientes.length > 0 || solicitudesAprobadas.length > 0" class="d-flex align-center flex-wrap gap-2 mt-4">
            <ModernButton
              v-if="solicitudesPendientes.length > 0"
              color="success"
              variant="outlined"
              prepend-icon="mdi-check-all"
              @click="$emit('approve-all-pending')"
              size="small"
              :loading="isLoading('approvingAllSolicitudes')"
            >
              Aprobar Todas Pendientes ({{ solicitudesPendientes.length }})
            </ModernButton>

            <ModernButton
              v-if="solicitudesPendientes.length > 0"
              color="warning"
              variant="outlined"
              prepend-icon="mdi-close-circle-multiple"
              @click="$emit('confirm-reject-all-pending')"
              size="small"
              :loading="isLoading('rejectingAllSolicitudes')"
            >
              Rechazar Todas Pendientes ({{ solicitudesPendientes.length }})
            </ModernButton>
            
            <ModernButton
              v-if="solicitudesPendientes.length + solicitudesAprobadas.length > 0"
              color="error"
              variant="outlined"
              prepend-icon="mdi-delete-multiple"
              @click="$emit('confirm-delete-all-active')"
              size="small"
              :loading="isLoading('deletingAllSolicitudes')"
            >
              Eliminar Todas Activas ({{ solicitudesPendientes.length + solicitudesAprobadas.length }})
            </ModernButton>
          </div>
        </v-card-text>
      </v-card>

      <!-- Lista de Solicitudes -->
      <div v-if="solicitudesFiltradas.length === 0" class="text-center py-12">
        <v-icon size="100" color="grey-lighten-2">mdi-inbox-outline</v-icon>
        <h3 class="text-h6 text-grey mt-4">
          {{ filterEstado === 'all' ? 'No hay solicitudes' : `No hay solicitudes ${filterEstado}` }}
        </h3>
        <p class="text-body-2 text-grey">
          Las solicitudes aparecerán aquí cuando los voluntarios se inscriban
        </p>
      </div>

      <div v-else>
        <v-card
          v-for="solicitud in solicitudesFiltradas"
          :key="solicitud.id_solicitud"
          class="mb-3 solicitud-card"
          variant="outlined"
          rounded="lg"
        >
          <v-card-text class="pa-4">
            <v-row align="center" no-gutters>
              <v-col cols="12" sm="auto" class="d-flex align-center mb-3 mb-sm-0">
                <v-avatar 
                  :color="getEstadoColor(solicitud.estado)" 
                  size="56" 
                  class="mr-3"
                >
                  <span class="text-white font-weight-bold text-h5">
                    {{ solicitud.voluntario?.usuario?.nombre?.charAt(0) || 'V' }}
                  </span>
                </v-avatar>
                <div>
                  <div class="text-body-1 font-weight-bold">
                    {{ solicitud.voluntario?.usuario?.nombre || 'Voluntario' }}
                  </div>
                  <div class="text-body-2 text-grey">
                    {{ solicitud.voluntario?.usuario?.email || '' }}
                  </div>
                  <div v-if="solicitud.fecha_solicitud" class="text-caption text-grey mt-1">
                    <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
                    {{ formatDate(solicitud.fecha_solicitud) }}
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="auto" class="ml-sm-auto">
                <div class="d-flex align-center flex-wrap gap-2">
                  <v-chip
                    :color="getEstadoColor(solicitud.estado)"
                    size="small"
                    variant="tonal"
                  >
                    <v-icon start size="16">{{ getEstadoIcon(solicitud.estado) }}</v-icon>
                    {{ getEstadoText(solicitud.estado) }}
                  </v-chip>

                  <!-- Acciones Rápidas -->
                  <div class="d-flex gap-1 align-center">
                    <!-- Botones de aprobar/rechazar para pendientes -->
                    <div v-if="solicitud.estado === 'pendiente'" class="d-flex gap-1">
                      <v-btn
                        icon="mdi-check"
                        color="success"
                        size="small"
                        variant="flat"
                        @click="$emit('update-solicitud-estado', solicitud.id_solicitud, 'aprobada')"
                        :loading="isLoading('updatingSolicitud')"
                      ></v-btn>
                      <v-btn
                        icon="mdi-close"
                        color="error"
                        size="small"
                        variant="flat"
                        @click="$emit('update-solicitud-estado', solicitud.id_solicitud, 'rechazada')"
                        :loading="isLoading('updatingSolicitud')"
                      ></v-btn>
                    </div>

                    <!-- Botón para eliminar -->
                    <v-btn
                      v-if="solicitud.estado === 'pendiente' || solicitud.estado === 'aprobada'"
                      icon="mdi-delete"
                      color="error"
                      size="small"
                      variant="text"
                      @click="$emit('confirm-delete-solicitud', solicitud)"
                      :loading="isLoading('deletingSolicitud') && solicitudToDelete?.id_solicitud === solicitud.id_solicitud"
                    ></v-btn>

                    <!-- Ver Detalles -->
                    <v-btn
                      icon="mdi-eye"
                      color="info"
                      size="small"
                      variant="text"
                      @click="toggleSolicitudDetails(solicitud.id_solicitud)"
                    ></v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- Información Adicional (Expandible) -->
            <v-expand-transition>
              <div v-if="solicitudExpandida === solicitud.id_solicitud" class="mt-4 pt-4" style="border-top: 1px solid rgba(0,0,0,0.08);">
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="detail-section mb-3">
                      <div class="text-caption text-grey mb-1">
                        <v-icon size="14" class="mr-1">mdi-message-text</v-icon>
                        Motivación
                      </div>
                      <div class="text-body-2 pa-3 rounded" style="background: #fafafa;">
                        {{ solicitud.motivacion || 'No especificada' }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="detail-section mb-3">
                      <div class="text-caption text-grey mb-1">
                        <v-icon size="14" class="mr-1">mdi-calendar-clock</v-icon>
                        Disponibilidad
                      </div>
                      <div class="text-body-2 pa-3 rounded" style="background: #fafafa;">
                        {{ solicitud.disponibilidad || 'No especificada' }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" v-if="solicitud.experiencia_relacionada">
                    <div class="detail-section mb-3">
                      <div class="text-caption text-grey mb-1">
                        <v-icon size="14" class="mr-1">mdi-briefcase</v-icon>
                        Experiencia Relacionada
                      </div>
                      <div class="text-body-2 pa-3 rounded" style="background: #fafafa;">
                        {{ solicitud.experiencia_relacionada }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" v-if="solicitud.voluntario?.habilidades?.length">
                    <div class="detail-section">
                      <div class="text-caption text-grey mb-2">
                        <v-icon size="14" class="mr-1">mdi-star-circle</v-icon>
                        Habilidades
                      </div>
                      <div class="d-flex flex-wrap gap-1">
                        <v-chip
                          v-for="habilidad in solicitud.voluntario.habilidades"
                          :key="habilidad.id"
                          size="small"
                          variant="tonal"
                          color="primary"
                        >
                          {{ habilidad.nombre }}
                        </v-chip>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
  solicitudes: {
    type: Array,
    default: () => []
  },
  solicitudesPendientes: {
    type: Array,
    default: () => []
  },
  solicitudesAprobadas: {
    type: Array,
    default: () => []
  },
  solicitudesRechazadas: {
    type: Array,
    default: () => []
  },
  getEstadoColor: {
    type: Function,
    required: true
  },
  getEstadoIcon: {
    type: Function,
    required: true
  },
  getEstadoText: {
    type: Function,
    required: true
  },
  isLoading: {
    type: Function,
    required: true
  },
  solicitudToDelete: {
    type: Object,
    default: null
  }
});

const emit = defineEmits([
  'refresh-solicitudes',
  'update-solicitud-estado',
  'confirm-delete-solicitud',
  'confirm-reject-all-pending',
  'confirm-delete-all-active',
  'approve-all-pending'
]);

const searchSolicitud = ref('');
const filterEstado = ref('all');
const solicitudExpandida = ref(null);

const solicitudesFiltradas = computed(() => {
  let filtered = props.solicitudes;

  // Filtrar por estado
  if (filterEstado.value !== 'all') {
    filtered = filtered.filter(s => s.estado === filterEstado.value);
  }

  // Filtrar por búsqueda
  if (searchSolicitud.value) {
    const search = searchSolicitud.value.toLowerCase();
    filtered = filtered.filter(s => {
      const nombre = s.voluntario?.usuario?.nombre?.toLowerCase() || '';
      const email = s.voluntario?.usuario?.email?.toLowerCase() || '';
      return nombre.includes(search) || email.includes(search);
    });
  }

  return filtered;
});

function toggleSolicitudDetails(solicitudId) {
  if (solicitudExpandida.value === solicitudId) {
    solicitudExpandida.value = null;
  } else {
    solicitudExpandida.value = solicitudId;
  }
}
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.solicitud-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.solicitud-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.detail-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

