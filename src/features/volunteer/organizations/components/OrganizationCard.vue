<template>
  <v-card
    class="organization-card"
    elevation="2"
    rounded="lg"
    @click="$emit('click')"
    style="cursor: pointer; height: 100%;"
  >
    <!-- Header con color primario -->
    <div
      class="card-header"
      :style="{ backgroundColor: organization?.color_primario || '#1976D2' }"
    >
      <v-avatar
        size="80"
        class="organization-avatar"
        :style="{ borderColor: organization?.color_primario || '#1976D2' }"
      >
        <v-img
          v-if="organization?.logo"
          :src="organization.logo"
          :alt="organization.nombre"
        />
        <v-icon v-else size="40" color="white">mdi-domain</v-icon>
      </v-avatar>
    </div>

    <v-card-text class="pa-4 pt-8">
      <h3 class="text-h6 font-weight-bold mb-2">
        {{ organization?.nombre || 'Sin nombre' }}
      </h3>
      <div class="d-flex align-center mb-2">
        <v-chip
          v-if="organization?.tipo"
          size="small"
          color="primary"
          variant="tonal"
        >
          {{ organization.tipo }}
        </v-chip>
      </div>
      <p class="text-body-2 text-grey-darken-1 line-clamp-2 mb-3">
        {{ organization?.descripcion || 'Sin descripción' }}
      </p>
      <div class="d-flex align-center text-caption text-grey mb-2">
        <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
        <span>{{ [organization?.ciudad, organization?.pais].filter(Boolean).join(', ') || 'Sin ubicación' }}</span>
      </div>
      <div v-if="focusAreas.length > 0" class="mb-3">
        <div class="d-flex flex-wrap gap-1">
          <v-chip
            v-for="area in focusAreas.slice(0, 3)"
            :key="area"
            size="x-small"
            color="info"
            variant="tonal"
          >
            {{ area }}
          </v-chip>
          <v-chip
            v-if="focusAreas.length > 3"
            size="x-small"
            color="grey"
            variant="tonal"
          >
            +{{ focusAreas.length - 3 }}
          </v-chip>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <v-spacer></v-spacer>
      <ModernButton
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-eye"
        @click.stop="$emit('click')"
      >
        Ver Perfil
      </ModernButton>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  organization: {
    type: Object,
    required: true
  }
});

defineEmits(['click']);

const focusAreas = computed(() => {
  if (!props.organization?.areas_enfoque) return [];
  if (typeof props.organization.areas_enfoque === 'string') {
    try {
      return JSON.parse(props.organization.areas_enfoque);
    } catch {
      return props.organization.areas_enfoque.split(',').map(a => a.trim()).filter(Boolean);
    }
  }
  return props.organization.areas_enfoque;
});
</script>

<style scoped>
.organization-card {
  transition: all 0.3s ease;
}

.organization-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 0 0;
}

.organization-avatar {
  position: absolute;
  bottom: -40px;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

