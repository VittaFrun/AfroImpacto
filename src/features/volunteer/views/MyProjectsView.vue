<template>
  <div class="my-projects-view">
    <!-- Header Section -->
    <div class="page-header">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h1 class="afro-heading-2 mb-2">Mis Proyectos</h1>
          <p class="afro-body-small">
            Un vistazo a los proyectos donde estás dejando tu huella
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-magnify"
            @click="browseProjects"
          >
            Explorar Nuevos
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="afro-card afro-card-elevated mb-6">
      <div class="filters-section">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar proyectos..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Estado"
              variant="outlined"
              clearable
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="roleFilter"
              :items="roleOptions"
              label="Mi Rol"
              variant="outlined"
              clearable
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Ordenar"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Projects Statistics -->
    <div class="afro-grid afro-grid-4 mb-6">
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ filteredProjects.length }}</div>
          <div class="afro-metric-label">Total Proyectos</div>
          <div class="metric-icon">
            <v-icon size="32" color="primary">mdi-folder-heart</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ activeProjectsCount }}</div>
          <div class="afro-metric-label">Activos</div>
          <div class="metric-icon">
            <v-icon size="32" color="success">mdi-play-circle</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ completedProjectsCount }}</div>
          <div class="afro-metric-label">Completados</div>
          <div class="metric-icon">
            <v-icon size="32" color="info">mdi-check-circle</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ averageProgress }}%</div>
          <div class="afro-metric-label">Progreso Promedio</div>
          <div class="metric-icon">
            <v-icon size="32" color="warning">mdi-chart-line</v-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Grid -->
    <div v-if="loadingProjects" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="afro-body mt-4">Cargando tus proyectos...</p>
    </div>

    <div v-else-if="errorProjects" class="error-container">
      <v-alert type="error" prominent>
        <template #title>Error al cargar proyectos</template>
        {{ errorProjects }}
      </v-alert>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="afro-empty-state">
      <div class="afro-empty-state-icon">
        <v-icon size="64" color="grey-lighten-1">mdi-folder-heart-outline</v-icon>
      </div>
      <div class="afro-empty-state-title">No hay proyectos</div>
      <div class="afro-empty-state-description">
        {{ searchQuery ? 'No se encontraron proyectos con los filtros aplicados' : 'Aún no te has unido a ningún proyecto' }}
      </div>
      <v-btn
        color="primary"
        variant="outlined"
        @click="browseProjects"
        class="mt-4"
      >
        Explorar Proyectos
      </v-btn>
    </div>

    <div v-else class="projects-grid">
      <div
        v-for="project in paginatedProjects"
        :key="project.id"
        class="project-card afro-card-elevated"
        @click="viewProject(project.id)"
      >
        <!-- Project Image -->
        <div class="project-image">
          <v-img
            :src="project.image || project.imagen_principal || '/default-project.jpg'"
            height="200px"
            cover
            class="project-cover"
          >
            <div class="project-overlay">
              <div class="project-status-chip">
                <v-chip
                  :color="getStatusColor(project.status)"
                  size="small"
                  variant="flat"
                >
                  {{ project.status }}
                </v-chip>
              </div>
            </div>
          </v-img>
        </div>

        <!-- Project Content -->
        <div class="project-content">
          <div class="project-header">
            <h3 class="project-title">{{ project.name }}</h3>
            <div class="project-role">
              <div v-if="project.rolesAsignados && project.rolesAsignados.length > 0" class="d-flex flex-wrap gap-1">
                <v-chip
                  v-for="(rol, index) in project.rolesAsignados"
                  :key="rol.id_rol || index"
                  color="info"
                  size="small"
                  variant="tonal"
                  prepend-icon="mdi-account-tie"
                >
                  {{ rol.nombre }}
                </v-chip>
              </div>
              <v-chip
                v-else
                color="info"
                size="small"
                variant="tonal"
                prepend-icon="mdi-account-tie"
              >
                {{ project.role || 'Voluntario' }}
              </v-chip>
            </div>
          </div>

          <p class="project-description">{{ project.description }}</p>

          <!-- Project Meta -->
          <div class="project-meta">
            <div class="meta-item">
              <v-icon size="16" color="grey">mdi-domain</v-icon>
              <span>{{ project.organization }}</span>
            </div>
            <div class="meta-item">
              <v-icon size="16" color="grey">mdi-calendar</v-icon>
              <span>{{ formatDateRange(project.startDate, project.endDate) }}</span>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Progreso del Proyecto</span>
              <span class="progress-percentage">{{ project.progress }}%</span>
            </div>
            <v-progress-linear
              :model-value="project.progress"
              :color="getProgressColor(project.progress)"
              height="8"
              rounded
            ></v-progress-linear>
          </div>

          <!-- Project Actions -->
          <div class="project-actions">
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              @click.stop="viewProject(project.id)"
            >
              <v-icon start>mdi-eye</v-icon>
              Ver Detalles
            </v-btn>
            <v-btn
              v-if="project.status === 'Activo'"
              color="success"
              variant="outlined"
              size="small"
              @click.stop="viewTasks(project.id)"
            >
              <v-icon start>mdi-format-list-checks</v-icon>
              Mis Tareas
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        color="primary"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';

const router = useRouter();
const authStore = useAuthStore();
const volunteerStore = useVolunteerStore();

const { user } = storeToRefs(authStore);
const { myProjects, loadingProjects, errorProjects } = storeToRefs(volunteerStore);

// Reactive data
const searchQuery = ref('');
const statusFilter = ref(null);
const roleFilter = ref(null);
const sortBy = ref('name');
const currentPage = ref(1);
const itemsPerPage = ref(6);

// Computed properties
const statusOptions = computed(() => [
  { title: 'Activo', value: 'Activo' },
  { title: 'Completado', value: 'Completado' },
  { title: 'Pausado', value: 'Pausado' }
]);

const roleOptions = computed(() => {
  const allRoles = new Set();
  myProjects.value.forEach(project => {
    if (project.rolesAsignados && project.rolesAsignados.length > 0) {
      project.rolesAsignados.forEach(rol => {
        allRoles.add(rol.nombre);
      });
    } else if (project.role) {
      // Si hay múltiples roles separados por coma
      project.role.split(',').forEach(r => allRoles.add(r.trim()));
    }
  });
  return Array.from(allRoles).map(role => ({ title: role, value: role }));
});

const sortOptions = computed(() => [
  { title: 'Nombre A-Z', value: 'name' },
  { title: 'Progreso', value: 'progress' },
  { title: 'Fecha de Inicio', value: 'startDate' },
  { title: 'Estado', value: 'status' }
]);

const filteredProjects = computed(() => {
  let filtered = [...myProjects.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.organization.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(project => project.status === statusFilter.value);
  }

  // Role filter
  if (roleFilter.value) {
    filtered = filtered.filter(project => {
      if (project.rolesAsignados && project.rolesAsignados.length > 0) {
        return project.rolesAsignados.some(rol => rol.nombre === roleFilter.value);
      }
      return project.role && project.role.includes(roleFilter.value);
    });
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return b.progress - a.progress;
      case 'startDate':
        return new Date(b.startDate) - new Date(a.startDate);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return filtered;
});

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProjects.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / itemsPerPage.value);
});

const activeProjectsCount = computed(() => {
  return myProjects.value.filter(p => p.status === 'Activo').length;
});

const completedProjectsCount = computed(() => {
  return myProjects.value.filter(p => p.status === 'Completado').length;
});

const averageProgress = computed(() => {
  if (myProjects.value.length === 0) return 0;
  const total = myProjects.value.reduce((sum, p) => sum + p.progress, 0);
  return Math.round(total / myProjects.value.length);
});

// Methods
const browseProjects = () => {
  router.push('/volunteer/catalog');
};

const viewProject = (projectId) => {
  router.push(`/volunteer/projects/${projectId}`);
};

const viewTasks = (projectId) => {
  router.push(`/volunteer/projects/${projectId}/tasks`);
};

const getStatusColor = (status) => {
  const colorMap = {
    'Activo': 'success',
    'Completado': 'info',
    'Pausado': 'warning'
  };
  return colorMap[status] || 'grey';
};

const getProgressColor = (progress) => {
  if (progress >= 100) return 'success';
  if (progress >= 75) return 'info';
  if (progress >= 50) return 'primary';
  if (progress >= 25) return 'warning';
  return 'error';
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Fechas no especificadas';
  const start = new Date(startDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
  const end = new Date(endDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
  return `${start} - ${end}`;
};

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter, roleFilter], () => {
  currentPage.value = 1;
});

onMounted(async () => {
  // Cargar proyectos reales del voluntario
  await volunteerStore.fetchMyProjects();
});
</script>

<style scoped>
.my-projects-view {
  padding: var(--afro-space-lg);
  background: var(--afro-background);
  min-height: 100vh;
}

/* Page Header */
.page-header {
  margin-bottom: var(--afro-space-xl);
}

.header-actions {
  display: flex;
  gap: var(--afro-space-md);
}

/* Filters Section */
.filters-section {
  padding: var(--afro-space-lg);
}

/* Metrics Cards */
.afro-metric-card {
  padding: var(--afro-space-lg);
  text-align: center;
  position: relative;
}

.metric-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--afro-space-sm);
}

.metric-icon {
  position: absolute;
  top: var(--afro-space-md);
  right: var(--afro-space-md);
  opacity: 0.1;
}

/* Loading and Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--afro-space-3xl);
  text-align: center;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--afro-space-lg);
  margin-bottom: var(--afro-space-xl);
}

.project-card {
  cursor: pointer;
  transition: all var(--afro-transition-normal);
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--afro-shadow-xl);
}

.project-image {
  position: relative;
}

.project-cover {
  transition: transform var(--afro-transition-normal);
}

.project-card:hover .project-cover {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: var(--afro-space-md);
  right: var(--afro-space-md);
}

.project-content {
  padding: var(--afro-space-lg);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--afro-space-md);
}

.project-title {
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin: 0;
  flex: 1;
  margin-right: var(--afro-space-md);
}

.project-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--afro-space-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-xs);
  margin-bottom: var(--afro-space-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--afro-space-xs);
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

.progress-section {
  margin-bottom: var(--afro-space-md);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-xs);
}

.progress-label {
  font-size: var(--afro-text-sm);
  font-weight: 500;
  color: var(--afro-text-primary);
}

.progress-percentage {
  font-size: var(--afro-text-sm);
  font-weight: 600;
  color: var(--afro-primary);
}

.project-actions {
  display: flex;
  gap: var(--afro-space-sm);
  flex-wrap: wrap;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--afro-space-xl);
}

/* Responsive Design */
@media (max-width: 768px) {
  .my-projects-view {
    padding: var(--afro-space-md);
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .afro-grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--afro-space-md);
  }
  
  .header-actions {
    width: 100%;
  }
  
  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-title {
    margin-right: 0;
    margin-bottom: var(--afro-space-sm);
  }
}

@media (max-width: 480px) {
  .afro-grid-4 {
    grid-template-columns: 1fr;
  }
  
  .project-actions {
    flex-direction: column;
  }
  
  .project-actions .v-btn {
    width: 100%;
  }
}
</style>