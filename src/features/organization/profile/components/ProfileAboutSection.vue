<template>
  <v-card-text class="pa-6">
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else>
      <!-- Misión y Visión -->
      <div v-if="organization?.mision_vision" class="mb-6">
        <div class="d-flex align-center justify-space-between mb-3">
          <h3 class="text-h6 font-weight-bold">
            <v-icon class="mr-2" color="primary">mdi-lightbulb</v-icon>
            Misión y Visión
          </h3>
          <v-btn
            v-if="isOwnProfile"
            icon="mdi-pencil"
            variant="text"
            size="small"
            @click="$emit('edit')"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
        <p class="text-body-1 text-grey-darken-1" style="white-space: pre-line">
          {{ organization.mision_vision }}
        </p>
      </div>

      <!-- Descripción -->
      <div v-if="organization?.descripcion" class="mb-6">
        <div class="d-flex align-center justify-space-between mb-3">
          <h3 class="text-h6 font-weight-bold">
            <v-icon class="mr-2" color="primary">mdi-information</v-icon>
            Sobre Nosotros
          </h3>
          <v-btn
            v-if="isOwnProfile"
            icon="mdi-pencil"
            variant="text"
            size="small"
            @click="$emit('edit')"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
        <p class="text-body-1 text-grey-darken-1" style="white-space: pre-line">
          {{ organization.descripcion }}
        </p>
      </div>

      <!-- Áreas de Enfoque -->
      <div v-if="focusAreas.length > 0" class="mb-6">
        <h3 class="text-h6 font-weight-bold mb-3">
          <v-icon class="mr-2" color="primary">mdi-target</v-icon>
          Áreas de Enfoque
        </h3>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="area in focusAreas"
            :key="area"
            color="primary"
            variant="tonal"
            size="default"
          >
            <v-icon start size="small">mdi-check-circle</v-icon>
            {{ area }}
          </v-chip>
        </div>
      </div>

      <!-- Información Adicional -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
              <span class="text-subtitle-2 font-weight-bold">Fundada</span>
            </div>
            <p class="text-body-2 text-grey">
              {{ formatDate(organization?.creado_en) }}
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
              <span class="text-subtitle-2 font-weight-bold">Ubicación</span>
            </div>
            <p class="text-body-2 text-grey">
              {{ [organization?.ciudad, organization?.pais].filter(Boolean).join(', ') || 'No especificada' }}
            </p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Estado vacío -->
      <div v-if="!organization?.mision_vision && !organization?.descripcion && focusAreas.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1">mdi-information-outline</v-icon>
        <p class="text-body-1 text-grey mt-4">
          {{ isOwnProfile ? 'Completa la información de tu organización' : 'Esta organización aún no ha completado su información' }}
        </p>
        <ModernButton
          v-if="isOwnProfile"
          color="primary"
          variant="flat"
          prepend-icon="mdi-pencil"
          class="mt-4"
          @click="$emit('edit')"
        >
          Agregar Información
        </ModernButton>
      </div>
    </div>
  </v-card-text>
</template>

<script setup>
import { computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  organization: {
    type: Object,
    default: null
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['edit']);

const focusAreas = computed(() => {
  if (!props.organization?.areas_enfoque) return [];
  if (typeof props.organization.areas_enfoque === 'string') {
    try {
      return JSON.parse(props.organization.areas_enfoque);
    } catch {
      return props.organization.areas_enfoque.split(',').map(a => a.trim());
    }
  }
  return props.organization.areas_enfoque;
});

function formatDate(date) {
  if (!date) return 'No especificada';
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  });
}
</script>

