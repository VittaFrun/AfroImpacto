<template>
  <v-card-text class="pa-6">
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="projects.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-folder-outline</v-icon>
      <p class="text-body-1 text-grey mt-4">
        {{ isOwnProfile ? 'Aún no has creado proyectos públicos' : 'Esta organización aún no tiene proyectos públicos' }}
      </p>
      <ModernButton
        v-if="isOwnProfile"
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        class="mt-4"
        @click="goToCreateProject"
      >
        Crear Primer Proyecto
      </ModernButton>
    </div>

    <v-row v-else>
      <v-col
        v-for="project in projects"
        :key="project.id_proyecto || project.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card
          class="project-card"
          elevation="2"
          rounded="lg"
          @click="goToProject(project)"
          style="cursor: pointer;"
        >
          <v-img
            :src="project.imagen_principal || '/assets/images/default-project.jpg'"
            height="180"
            cover
            class="project-image"
          >
            <div class="project-overlay">
              <v-chip
                :color="getStatusColor(project.id_estado)"
                size="small"
                variant="flat"
              >
                {{ getStatusText(project.id_estado) }}
              </v-chip>
            </div>
          </v-img>

          <v-card-title class="text-h6 font-weight-bold">
            {{ project.nombre }}
          </v-card-title>

          <v-card-subtitle>
            <div class="d-flex align-center mb-2">
              <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
              <span class="text-caption">{{ project.ubicacion }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
              <span class="text-caption">
                {{ formatDateRange(project.fecha_inicio, project.fecha_fin) }}
              </span>
            </div>
          </v-card-subtitle>

          <v-card-text>
            <p class="text-body-2 text-grey-darken-1 line-clamp-2">
              {{ project.descripcion }}
            </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="text"
              size="small"
              @click.stop="goToProject(project)"
            >
              Ver Detalles
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrganizationProfileStore } from '../stores/organizationProfileStore';
import ModernButton from '@/components/ui/ModernButton.vue';
import apiClient from '@/plugins/axios';

const props = defineProps({
  organizationId: {
    type: Number,
    required: true
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

const router = useRouter();
const profileStore = useOrganizationProfileStore();

const projects = ref([]);
const loadingProjects = ref(false);

function getStatusColor(statusId) {
  const colors = {
    1: 'success',
    2: 'grey',
    3: 'error',
    4: 'warning',
    5: 'info',
    6: 'warning',
    7: 'success'
  };
  return colors[statusId] || 'grey';
}

function getStatusText(statusId) {
  const texts = {
    1: 'Activo',
    2: 'Completado',
    3: 'Cancelado',
    4: 'Pausado',
    5: 'Planificación',
    6: 'Pendiente',
    7: 'En Progreso'
  };
  return texts[statusId] || 'Desconocido';
}

function formatDateRange(start, end) {
  if (!start) return 'Sin fecha';
  const startDate = new Date(start).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  if (!end) return `Desde ${startDate}`;
  const endDate = new Date(end).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  return `${startDate} - ${endDate}`;
}

function goToProject(project) {
  const projectId = project.id_proyecto || project.id;
  if (props.isOwnProfile) {
    router.push(`/organization/dashboard/projects/${projectId}`);
  } else {
    router.push(`/volunteer/projects/${projectId}`);
  }
}

function goToCreateProject() {
  router.push('/organization/dashboard/projects/create');
}

onMounted(async () => {
  if (props.organizationId) {
    loadingProjects.value = true;
    try {
      const data = await profileStore.fetchPublicProjects(props.organizationId);
      projects.value = data;
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      loadingProjects.value = false;
    }
  }
});
</script>

<style scoped>
.project-card {
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.project-image {
  position: relative;
}

.project-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

