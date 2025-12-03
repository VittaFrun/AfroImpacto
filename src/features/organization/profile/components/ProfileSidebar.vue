<template>
  <div class="profile-sidebar">
    <!-- Card de Acción Rápida -->
    <v-card class="mb-4" elevation="2" rounded="lg" v-if="!isOwnProfile">
      <v-card-text class="pa-4 text-center">
        <ModernButton
          color="primary"
          variant="flat"
          prepend-icon="mdi-account-plus"
          block
          @click="$emit('request-join')"
          :loading="loading"
        >
          Solicitar Unirse al Equipo
        </ModernButton>
        <p class="text-caption text-grey mt-2">
          Envía una solicitud para formar parte del equipo de esta organización
        </p>
      </v-card-text>
    </v-card>

    <!-- Card de Edición (solo perfil propio) -->
    <v-card class="mb-4" elevation="2" rounded="lg" v-if="isOwnProfile">
      <v-card-text class="pa-4 text-center">
        <ModernButton
          color="primary"
          variant="outlined"
          prepend-icon="mdi-pencil"
          block
          @click="$emit('edit-profile')"
        >
          Editar Perfil
        </ModernButton>
      </v-card-text>
    </v-card>

    <!-- Card de Información -->
    <v-card class="mb-4" elevation="2" rounded="lg">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Información
      </v-card-title>
      <v-card-text>
        <div class="info-item mb-3">
          <div class="d-flex align-center mb-1">
            <v-icon size="small" color="primary" class="mr-2">mdi-domain</v-icon>
            <span class="text-caption text-grey">Tipo</span>
          </div>
          <div class="text-body-2 font-weight-medium">
            {{ organization?.tipo || 'N/A' }}
          </div>
        </div>

        <div class="info-item mb-3">
          <div class="d-flex align-center mb-1">
            <v-icon size="small" color="primary" class="mr-2">mdi-map-marker</v-icon>
            <span class="text-caption text-grey">Ubicación</span>
          </div>
          <div class="text-body-2 font-weight-medium">
            {{ [organization?.ciudad, organization?.pais].filter(Boolean).join(', ') || 'N/A' }}
          </div>
        </div>

        <div v-if="organization?.sitio_web" class="info-item mb-3">
          <div class="d-flex align-center mb-1">
            <v-icon size="small" color="primary" class="mr-2">mdi-web</v-icon>
            <span class="text-caption text-grey">Sitio Web</span>
          </div>
          <a
            :href="organization.sitio_web"
            target="_blank"
            class="text-body-2 text-primary text-decoration-none"
          >
            {{ organization.sitio_web }}
          </a>
        </div>

        <div v-if="organization?.areas_enfoque" class="info-item">
          <div class="d-flex align-center mb-2">
            <v-icon size="small" color="primary" class="mr-2">mdi-target</v-icon>
            <span class="text-caption text-grey">Áreas de Enfoque</span>
          </div>
          <div class="d-flex flex-wrap gap-1">
            <v-chip
              v-for="area in focusAreas"
              :key="area"
              size="x-small"
              color="info"
              variant="tonal"
            >
              {{ area }}
            </v-chip>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Card de Estadísticas -->
    <v-card class="mb-4" elevation="2" rounded="lg">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Estadísticas
      </v-card-title>
      <v-card-text>
        <div class="stat-item mb-3">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="small" color="primary" class="mr-2">mdi-folder-multiple</v-icon>
              <span class="text-body-2">Proyectos</span>
            </div>
            <span class="text-h6 font-weight-bold">{{ stats.projectsCount }}</span>
          </div>
        </div>

        <div class="stat-item mb-3">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="small" color="info" class="mr-2">mdi-account-group</v-icon>
              <span class="text-body-2">Miembros</span>
            </div>
            <span class="text-h6 font-weight-bold">{{ stats.teamMembersCount }}</span>
          </div>
        </div>

        <div v-if="stats.totalVolunteers > 0" class="stat-item mb-3">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="small" color="success" class="mr-2">mdi-account-multiple</v-icon>
              <span class="text-body-2">Voluntarios</span>
            </div>
            <span class="text-h6 font-weight-bold">{{ stats.totalVolunteers }}</span>
          </div>
        </div>

        <div v-if="stats.totalHours > 0" class="stat-item">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="small" color="warning" class="mr-2">mdi-clock-outline</v-icon>
              <span class="text-body-2">Horas</span>
            </div>
            <span class="text-h6 font-weight-bold">{{ stats.totalHours }}</span>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Card de Contacto (solo perfil público) -->
    <v-card v-if="!isOwnProfile" elevation="2" rounded="lg">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Contacto
      </v-card-title>
      <v-card-text>
        <v-btn
          v-if="organization?.sitio_web"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-web"
          block
          :href="organization.sitio_web"
          target="_blank"
          class="mb-2"
        >
          Visitar Sitio Web
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-message"
          block
          @click="openMessageDialog"
        >
          Enviar Mensaje
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
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
  stats: {
    type: Object,
    default: () => ({
      projectsCount: 0,
      teamMembersCount: 0,
      totalVolunteers: 0,
      totalHours: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['request-join', 'edit-profile']);

const router = useRouter();

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

function openMessageDialog() {
  // Redirigir a mensajería con esta organización
  router.push({
    name: 'messages',
    query: { organizationId: props.organization?.id_organizacion }
  });
}
</script>

<style scoped>
.profile-sidebar {
  position: sticky;
  top: 80px;
}

.info-item {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.info-item:last-child {
  border-bottom: none;
}

.stat-item {
  padding: 8px 0;
}
</style>

