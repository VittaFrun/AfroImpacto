<template>
  <v-container fluid class="pa-6">
    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6 font-weight-bold">Invitaciones Enviadas</h3>
      <ModernButton
        color="primary"
        prepend-icon="mdi-email-send"
        @click="$emit('send-invitation')"
      >
        Enviar Invitación
      </ModernButton>
    </div>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4 text-grey">Cargando invitaciones...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="invitations.length === 0">
      <v-col cols="12" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-email-outline</v-icon>
        <p class="mt-4 text-grey">No hay invitaciones enviadas</p>
        <ModernButton
          color="primary"
          prepend-icon="mdi-email-send"
          class="mt-4"
          @click="$emit('send-invitation')"
        >
          Enviar Primera Invitación
        </ModernButton>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="invitation in invitations"
        :key="invitation.id"
        cols="12"
      >
        <v-card class="invitation-card" elevation="2" rounded="lg">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center flex-grow-1">
                <v-avatar color="primary" size="56" class="mr-4">
                  <v-icon color="white">mdi-email</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <h3 class="text-h6 font-weight-bold">
                    {{ invitation.email }}
                  </h3>
                  <div class="d-flex align-center gap-2 mt-2">
                    <v-chip
                      :color="getStatusColor(invitation.estado)"
                      size="small"
                      variant="tonal"
                    >
                      <v-icon start size="small">{{ getStatusIcon(invitation.estado) }}</v-icon>
                      {{ getStatusLabel(invitation.estado) }}
                    </v-chip>
                    <span class="text-caption text-grey">
                      Enviada: {{ formatDate(invitation.fecha_envio) }}
                    </span>
                  </div>
                  <div v-if="invitation.id_rol_organizacion" class="mt-2">
                    <v-chip size="small" color="info" variant="tonal">
                      <v-icon start size="small">mdi-shield-account</v-icon>
                      {{ getRoleName(invitation.id_rol_organizacion) }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <div class="d-flex align-center gap-2">
                <ModernButton
                  v-if="invitation.estado === 'pendiente'"
                  icon="mdi-close"
                  variant="text"
                  color="error"
                  size="small"
                  @click="$emit('cancel-invitation', invitation.id)"
                >
                  Cancelar
                </ModernButton>
                <ModernButton
                  icon="mdi-refresh"
                  variant="text"
                  color="info"
                  size="small"
                  @click="handleResend(invitation)"
                >
                  Reenviar
                </ModernButton>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  invitations: {
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

const emit = defineEmits(['send-invitation', 'cancel-invitation']);

function getStatusColor(status) {
  const colors = {
    'pendiente': 'warning',
    'aceptada': 'success',
    'rechazada': 'error',
    'expirada': 'grey'
  };
  return colors[status] || 'grey';
}

function getStatusIcon(status) {
  const icons = {
    'pendiente': 'mdi-clock-outline',
    'aceptada': 'mdi-check-circle',
    'rechazada': 'mdi-cancel',
    'expirada': 'mdi-alert-circle'
  };
  return icons[status] || 'mdi-help-circle';
}

function getStatusLabel(status) {
  const labels = {
    'pendiente': 'Pendiente',
    'aceptada': 'Aceptada',
    'rechazada': 'Rechazada',
    'expirada': 'Expirada'
  };
  return labels[status] || status;
}

function getRoleName(roleId) {
  const role = props.organizationRoles.find(r => (r.id_rol || r.id) === roleId);
  return role?.nombre || role?.name || 'Sin rol';
}

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function handleResend(invitation) {
  // TODO: Implementar reenvío de invitación
  emit('send-invitation', { email: invitation.email, id_rol_organizacion: invitation.id_rol_organizacion });
}
</script>

<style scoped>
.invitation-card {
  transition: all 0.3s ease;
}

.invitation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.gap-2 {
  gap: 8px;
}
</style>

