<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Solicitudes de Inscripción"
    icon="mdi-account-plus"
    max-width="900px"
  >
    <template #content>
      <div v-if="solicitudes.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-inbox</v-icon>
        <p class="text-body-1 text-grey mt-4">No hay solicitudes pendientes</p>
      </div>
      
      <v-list v-else>
        <v-list-item
          v-for="solicitud in solicitudes"
          :key="solicitud.id_solicitud"
          class="mb-2"
        >
          <template #prepend>
            <v-avatar color="primary" size="40">
              {{ solicitud.voluntario?.usuario?.nombre?.charAt(0) || 'V' }}
            </v-avatar>
          </template>
          
          <v-list-item-title>
            {{ solicitud.voluntario?.usuario?.nombre || 'Voluntario' }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ solicitud.voluntario?.usuario?.email || '' }}
          </v-list-item-subtitle>
          
          <template #append>
            <div class="d-flex align-center gap-2">
              <v-chip
                :color="getEstadoColor(solicitud.estado)"
                size="small"
                class="mr-2"
              >
                {{ getEstadoText(solicitud.estado) }}
              </v-chip>
              
              <v-btn
                v-if="solicitud.estado === 'pendiente'"
                icon="mdi-check"
                color="success"
                size="small"
                variant="text"
                @click="$emit('update-estado', solicitud.id_solicitud, 'aprobada')"
                :loading="loading"
              ></v-btn>
              
              <v-btn
                v-if="solicitud.estado === 'pendiente'"
                icon="mdi-close"
                color="error"
                size="small"
                variant="text"
                @click="$emit('update-estado', solicitud.id_solicitud, 'rechazada')"
                :loading="loading"
              ></v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
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
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

defineProps({
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
  getEstadoColor: {
    type: Function,
    required: true
  },
  getEstadoText: {
    type: Function,
    required: true
  }
});

defineEmits(['update:modelValue', 'update-estado']);
</script>

