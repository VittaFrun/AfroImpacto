<template>
  <v-container fluid class="pa-6">
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4 text-grey">Cargando solicitudes...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="requests.length === 0">
      <v-col cols="12" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-account-clock-outline</v-icon>
        <p class="mt-4 text-grey">No hay solicitudes pendientes</p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="request in requests"
        :key="request.id_miembro"
        cols="12"
      >
        <v-card class="request-card" elevation="2" rounded="lg">
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar :color="getAvatarColor(request.voluntario?.usuario?.nombre)" size="64">
                <span class="text-white text-h5">
                  {{ getInitials(request.voluntario?.usuario?.nombre || 'U') }}
                </span>
              </v-avatar>
              
              <div class="ml-4 flex-grow-1">
                <h3 class="text-h6 font-weight-bold">
                  {{ request.voluntario?.usuario?.nombre || 'Sin nombre' }}
                </h3>
                <p class="text-body-2 text-grey mb-2">
                  {{ request.voluntario?.usuario?.email || '' }}
                </p>
                <div class="d-flex align-center gap-2">
                  <v-chip size="small" color="warning" variant="tonal">
                    <v-icon start size="small">mdi-clock-outline</v-icon>
                    Pendiente
                  </v-chip>
                  <span class="text-caption text-grey">
                    Solicitado: {{ formatDate(request.fecha_solicitud || request.creado_en) }}
                  </span>
                </div>
              </div>

              <div class="d-flex flex-column gap-2">
                <v-select
                  v-model="selectedRoles[request.id_miembro]"
                  :items="roleOptions"
                  label="Asignar Rol"
                  variant="outlined"
                  density="compact"
                  hide-details
                  style="min-width: 200px;"
                ></v-select>
                
                <div class="d-flex gap-2">
                  <ModernButton
                    color="success"
                    variant="flat"
                    prepend-icon="mdi-check"
                    @click="handleApprove(request)"
                    :loading="approving[request.id_miembro]"
                    block
                  >
                    Aprobar
                  </ModernButton>
                  <ModernButton
                    color="error"
                    variant="outlined"
                    prepend-icon="mdi-close"
                    @click="handleReject(request)"
                    :loading="rejecting[request.id_miembro]"
                    block
                  >
                    Rechazar
                  </ModernButton>
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
import { ref, computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  requests: {
    type: Array,
    default: () => []
  },
  organizationRoles: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['approve-request', 'reject-request', 'view-request']);

const selectedRoles = ref({});
const approving = ref({});
const rejecting = ref({});

const roleOptions = computed(() => {
  return [
    { title: 'Sin rol', value: null },
    ...props.organizationRoles.map(r => ({
      title: r.nombre || r.name,
      value: r.id_rol || r.id
    }))
  ];
});

function handleApprove(request) {
  const roleId = selectedRoles.value[request.id_miembro] || null;
  approving.value[request.id_miembro] = true;
  emit('approve-request', request, roleId);
  setTimeout(() => {
    approving.value[request.id_miembro] = false;
  }, 1000);
}

function handleReject(request) {
  rejecting.value[request.id_miembro] = true;
  emit('reject-request', request);
  setTimeout(() => {
    rejecting.value[request.id_miembro] = false;
  }, 1000);
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
  const index = (name?.length || 0) % colors.length;
  return colors[index];
}

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>


<style scoped>
.request-card {
  transition: all 0.3s ease;
}

.request-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.gap-2 {
  gap: 8px;
}
</style>

