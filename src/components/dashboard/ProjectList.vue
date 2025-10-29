<!-- COMPONENTE PROJECT LIST -->

<template>
  <div class="project-list">
    <div v-if="projects.length === 0" class="empty-state">
      <v-icon size="80" color="grey-lighten-1">mdi-folder-outline</v-icon>
      <h3 class="text-h6 text-grey mt-4">No hay proyectos {{ getTypeText() }}</h3>
      <p class="text-body-2 text-grey mb-4">
        {{ getEmptyMessage() }}
      </p>
      <v-btn
        v-if="type === 'draft'"
        color="primary"
        variant="flat"
        @click="$router.push('/organization/dashboard/projects/create')"
      >
        Crear Primer Proyecto
      </v-btn>
    </div>
    
    <v-list v-else>
      <v-list-item
        v-for="project in projects"
        :key="project.id"
        class="project-item"
        @click="handleProjectClick(project)"
      >
        <template v-slot:prepend>
          <v-avatar :color="getProjectColor(project.status)" size="48">
            <v-icon color="white">{{ getProjectIcon(project.status) }}</v-icon>
          </v-avatar>
        </template>
        
        <v-list-item-title class="font-weight-bold">{{ project.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ project.description }}</v-list-item-subtitle>
        
        <template v-slot:append>
          <div class="project-metrics">
            <div v-if="type !== 'draft'" class="mb-2">
              <v-progress-linear
                :model-value="project.progress"
                :color="getProgressColor(project.progress)"
                height="6"
                rounded
              ></v-progress-linear>
              <div class="text-caption text-grey mt-1">
                {{ project.progress }}% completado
              </div>
            </div>
            
            <div class="project-stats">
              <div class="stat-item">
                <v-icon size="16" color="primary">mdi-account-group</v-icon>
                <span class="text-caption ml-1">{{ project.volunteers }}</span>
              </div>
              <div class="stat-item">
                <v-icon size="16" color="success">mdi-currency-usd</v-icon>
                <span class="text-caption ml-1">{{ formatCurrency(project.budget) }}</span>
              </div>
            </div>
            
            <v-chip
              :color="getStatusColor(project.status)"
              size="small"
              variant="tonal"
              class="mt-2"
            >
              {{ project.status }}
            </v-chip>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Props
const props = defineProps({
  projects: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['active', 'draft', 'completed'].includes(value)
  }
});

// Emits
const emit = defineEmits(['project-click']);

// Methods
function handleProjectClick(project) {
  emit('project-click', project);
  router.push(`/organization/dashboard/projects/${project.id}`);
}

function getTypeText() {
  const texts = {
    active: 'activos',
    draft: 'en borrador',
    completed: 'completados'
  };
  return texts[props.type] || '';
}

function getEmptyMessage() {
  const messages = {
    active: 'Crea tu primer proyecto para comenzar a generar impacto social.',
    draft: 'Los proyectos en borrador aparecerán aquí una vez que los crees.',
    completed: 'Los proyectos completados aparecerán aquí.'
  };
  return messages[props.type] || '';
}

function getProjectColor(status) {
  const colors = {
    'En Progreso': 'primary',
    'Borrador': 'warning',
    'Completado': 'success',
    'Pausado': 'error',
    'Cancelado': 'grey'
  };
  return colors[status] || 'primary';
}

function getProjectIcon(status) {
  const icons = {
    'En Progreso': 'mdi-play-circle',
    'Borrador': 'mdi-file-document-outline',
    'Completado': 'mdi-check-circle',
    'Pausado': 'mdi-pause-circle',
    'Cancelado': 'mdi-cancel'
  };
  return icons[status] || 'mdi-folder';
}

function getProgressColor(progress) {
  if (progress >= 80) return 'success';
  if (progress >= 50) return 'warning';
  return 'error';
}

function getStatusColor(status) {
  const colors = {
    'En Progreso': 'info',
    'Borrador': 'warning',
    'Completado': 'success',
    'Pausado': 'error',
    'Cancelado': 'grey'
  };
  return colors[status] || 'primary';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
</script>

<style scoped>
.project-list {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.project-item {
  transition: all var(--transition-normal) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  padding: var(--spacing-md) !important;
}

.project-item:hover {
  background-color: var(--primary-50) !important;
  transform: translateX(4px) !important;
}

.project-item:last-child {
  border-bottom: none !important;
}

.project-metrics {
  min-width: 200px;
  text-align: right;
}

.project-stats {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.stat-item {
  display: flex;
  align-items: center;
  color: var(--neutral-600);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .project-metrics {
    min-width: 150px;
  }
  
  .project-stats {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .stat-item {
    justify-content: flex-end;
  }
}
</style>
