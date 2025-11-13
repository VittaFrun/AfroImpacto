<template>
  <v-container fluid class="pa-8">
    <!-- Loading Overlay - Only show if first load with no cached data -->
    <div v-if="loading && (!projects || projects.length === 0) && !error" class="loading-overlay">
      <div class="loading-content">
        <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
        <p class="text-body-1 text-grey-darken-1">Cargando proyectos...</p>
      </div>
    </div>

    <!-- Skeleton Loader for initial load - Only if no error and loading -->
    <div v-if="loading && (!projects || projects.length === 0) && !error" class="skeleton-loader-container">
      <v-row>
        <v-col cols="12" md="3" v-for="n in 4" :key="n">
          <v-skeleton-loader type="card" class="mb-4"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" lg="4" v-for="n in 6" :key="n">
          <v-skeleton-loader type="card, article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <!-- Error Banner (Non-blocking) -->
    <v-alert
      v-if="showError && error && !loading"
      :type="getErrorType(error)"
      variant="tonal"
      dismissible
      class="mb-6 error-banner"
      @update:model-value="clearError"
      :icon="getErrorIcon(error)"
    >
      <div class="d-flex align-center">
        <div class="flex-grow-1">
          <div class="text-subtitle-2 font-weight-bold mb-1">
            {{ getErrorTitle(error) }}
          </div>
          <div class="text-body-2">{{ error }}</div>
          <div class="text-caption mt-2" v-if="!isCriticalError(error)">
            Puedes continuar trabajando. Los datos se actualizarán cuando la conexión se restaure.
          </div>
        </div>
        <v-btn
          v-if="!isCriticalError(error)"
          icon
          size="small"
          variant="text"
          @click="retryFetch"
          class="ml-2"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
    </v-alert>

    <!-- Main Content -->
    <div :class="{ 'content-blurred': loading }">
      <!-- Header Section -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-primary mb-2">Gestión de Proyectos</h1>
          <p class="text-body-1 text-grey-darken-1">
            Administra y supervisa todos tus proyectos de impacto social
          </p>
        </div>
        <div class="d-flex align-center gap-3">
          <!-- Filter and Search -->
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Buscar proyectos..."
            variant="outlined"
            density="compact"
            hide-details
            class="search-field"
            clearable
          ></v-text-field>
          
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            label="Estado"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            class="filter-field"
          ></v-select>
          
          <ModernButton
            color="primary"
            variant="flat"
            prepend-icon="mdi-plus"
            @click="goToCreateProject"
            size="large"
          >
            Crear Nuevo Proyecto
          </ModernButton>
        </div>
      </div>

      <!-- Statistics Cards - Diseño Profesional -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card class="professional-metric-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="metric-header-professional">
                <div class="metric-icon-professional primary">
                  <v-icon color="white" size="24">mdi-folder-multiple</v-icon>
                </div>
              </div>
              <div class="metric-content-professional">
                <div class="metric-value-professional primary">
                  {{ projects && projects.length ? projects.length : 0 }}
                </div>
                <div class="metric-label-professional">Total Proyectos</div>
                <div class="metric-subtitle-professional">Proyectos {{ error ? 'en caché' : 'creados' }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card class="professional-metric-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="metric-header-professional">
                <div class="metric-icon-professional success">
                  <v-icon color="white" size="24">mdi-folder-heart</v-icon>
                </div>
              </div>
              <div class="metric-content-professional">
                <div class="metric-value-professional success">
                  {{ activeProjectsCount }}
                </div>
                <div class="metric-label-professional">Proyectos Activos</div>
                <div class="metric-subtitle-professional">En desarrollo</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card class="professional-metric-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="metric-header-professional">
                <div class="metric-icon-professional info">
                  <v-icon color="white" size="24">mdi-eye</v-icon>
                </div>
              </div>
              <div class="metric-content-professional">
                <div class="metric-value-professional info">
                  {{ publicProjectsCount }}
                </div>
                <div class="metric-label-professional">Proyectos Públicos</div>
                <div class="metric-subtitle-professional">Disponibles para voluntarios</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card class="professional-metric-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="metric-header-professional">
                <div class="metric-icon-professional warning">
                  <v-icon color="white" size="24">mdi-currency-usd</v-icon>
                </div>
              </div>
              <div class="metric-content-professional">
                <div class="metric-value-professional warning">
                  ${{ totalBudget.toLocaleString() }}
                </div>
                <div class="metric-label-professional">Presupuesto Total</div>
                <div class="metric-subtitle-professional">Inversión en proyectos</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Project Card -->
      <v-row class="mb-6" v-if="mainProject">
        <v-col cols="12">
          <ModernCard
            :title="mainProject.name"
            :subtitle="mainProject.location"
            icon="mdi-folder-heart"
            icon-color="primary"
            variant="default"
            class="main-project-card"
          >
            <template #content>
              <v-row>
                <v-col cols="12" md="4">
                  <div class="project-image-container">
                    <v-img 
                      :src="mainProject.coverImage || defaultProjectImage" 
                      class="rounded-lg" 
                      height="200" 
                      cover
                    >
                      <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                    <div class="status-overlay">
                      <v-chip :color="getStatusColor(mainProject.id_estado)" size="small">
                        {{ getStatusText(mainProject.id_estado) }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="8">
                  <div class="project-details">
                    <p class="text-body-1 text-grey-darken-1 mb-4">{{ mainProject.description }}</p>
                    
                    <v-row class="mb-4">
                      <v-col cols="6">
                        <div class="d-flex align-center mb-2">
                          <v-icon class="mr-2" color="primary" size="small">mdi-calendar-start</v-icon>
                          <span class="text-body-2"><strong>Inicio:</strong> {{ formatDate(mainProject.startDate) }}</span>
                        </div>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2" color="primary" size="small">mdi-calendar-end</v-icon>
                          <span class="text-body-2"><strong>Fin:</strong> {{ formatDate(mainProject.endDate) }}</span>
                        </div>
                      </v-col>
                      <v-col cols="6">
                        <div class="d-flex align-center mb-2">
                          <v-icon class="mr-2" color="success" size="small">mdi-currency-usd</v-icon>
                          <span class="text-body-2"><strong>Presupuesto:</strong> ${{ mainProject.budget?.toLocaleString() || '0' }}</span>
                        </div>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2" color="info" size="small">mdi-view-list</v-icon>
                          <span class="text-body-2"><strong>Fases:</strong> {{ mainProject.phases?.length || 0 }}</span>
                        </div>
                      </v-col>
                    </v-row>
                    
                    <!-- Action Buttons -->
                    <v-divider class="my-4"></v-divider>
                    <div class="d-flex align-center gap-3">
                      <ModernButton
                        color="primary"
                        variant="outlined"
                        prepend-icon="mdi-eye"
                        @click="viewProjectDetails(mainProject.id)"
                      >
                        Ver Detalles
                      </ModernButton>
                      
                      <v-btn
                        color="success"
                        variant="flat"
                        prepend-icon="mdi-cog"
                        @click="manageProject(mainProject.id)"
                      >
                        Gestionar Proyecto
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </template>
          </ModernCard>
        </v-col>
      </v-row>

      <!-- Projects Grid -->
      <v-row>
        <v-col cols="12">
          <ModernCard
            title="Todos los Proyectos"
            subtitle="Gestiona todos tus proyectos de impacto social"
            icon="mdi-folder-multiple"
            icon-color="primary"
            variant="default"
          >
            <template #content>
              <!-- Empty State -->
              <div v-if="!loading && (!projects || projects.length === 0)" class="empty-state-container">
                <div class="empty-state-content">
                  <div class="empty-state-icon mb-4">
                    <v-icon 
                      :size="error ? 100 : 120" 
                      :color="error ? 'error' : 'grey-lighten-1'"
                    >
                      {{ error ? 'mdi-cloud-off-outline' : 'mdi-folder-open-outline' }}
                    </v-icon>
                  </div>
                  <h3 class="text-h5 font-weight-bold text-grey-darken-1 mb-2">
                    {{ error ? 'No se pudieron cargar los proyectos' : 'No hay proyectos creados' }}
                  </h3>
                  <p class="text-body-1 text-grey-darken-1 mb-6" style="max-width: 500px;">
                    {{ error 
                      ? getEmptyStateMessage(error)
                      : 'Comienza creando tu primer proyecto de impacto social. Los proyectos te permiten organizar y gestionar tus iniciativas de manera eficiente.'
                    }}
                  </p>
                  <div class="d-flex align-center gap-3 flex-wrap justify-center">
                <ModernButton
                      v-if="!error || !isCriticalError(error)"
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-plus"
                  @click="goToCreateProject"
                      size="large"
                    >
                      {{ error ? 'Crear Proyecto' : 'Crear Primer Proyecto' }}
                    </ModernButton>
                    <ModernButton
                      v-if="error"
                      color="grey"
                      variant="outlined"
                      prepend-icon="mdi-refresh"
                      @click="retryFetch"
                      size="large"
                      :loading="isRetrying"
                      :disabled="isRetrying"
                    >
                      {{ isRetrying ? 'Reintentando...' : `Reintentar${retryCount > 0 ? ` (${retryCount})` : ''}` }}
                    </ModernButton>
                    <ModernButton
                      v-if="error && isCriticalError(error)"
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-login"
                      @click="handleAuthError"
                      size="large"
                    >
                      Iniciar Sesión
                </ModernButton>
                  </div>
                  <div v-if="!error" class="mt-8 empty-state-features">
                    <h4 class="text-subtitle-1 font-weight-bold mb-4">¿Qué puedes hacer con los proyectos?</h4>
                    <v-row>
                      <v-col cols="12" md="4">
                        <div class="feature-item">
                          <v-icon color="primary" size="32" class="mb-2">mdi-account-group</v-icon>
                          <p class="text-body-2 text-grey-darken-1">Gestiona voluntarios</p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <div class="feature-item">
                          <v-icon color="success" size="32" class="mb-2">mdi-calendar-check</v-icon>
                          <p class="text-body-2 text-grey-darken-1">Organiza actividades</p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <div class="feature-item">
                          <v-icon color="info" size="32" class="mb-2">mdi-chart-line</v-icon>
                          <p class="text-body-2 text-grey-darken-1">Realiza seguimiento</p>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </div>
              
              <!-- No Results State -->
              <div v-else-if="filteredProjects.length === 0" class="text-center py-8">
                <v-icon size="120" color="grey-lighten-1">mdi-magnify</v-icon>
                <h3 class="text-h5 text-grey mt-4">No se encontraron proyectos</h3>
                <p class="text-body-1 text-grey mb-4">
                  Intenta ajustar los filtros de búsqueda
                </p>
                <ModernButton
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-refresh"
                  @click="clearFilters"
                >
                  Limpiar Filtros
                </ModernButton>
              </div>
              
              <!-- Projects Grid -->
              <div v-else class="projects-grid">
                <v-row>
                  <v-col
                    v-for="project in filteredProjects"
                    :key="project.id"
                    cols="12"
                    md="6"
                    lg="4"
                  >
                    <ModernCard
                      :title="project.name"
                      :subtitle="project.location"
                      icon="mdi-folder-heart"
                      icon-color="primary"
                      variant="outlined"
                      class="project-item h-100"
                      hover
                    >
                      <template #content>
                        <!-- Project Image -->
                        <div class="project-image-container mb-4">
                          <v-img
                            :src="project.coverImage || defaultProjectImage"
                            height="150"
                            cover
                            class="rounded-lg"
                          >
                            <template v-slot:placeholder>
                              <div class="d-flex align-center justify-center fill-height">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                              </div>
                            </template>
                          </v-img>
                          
                          <!-- Status Overlay -->
                          <div class="status-overlay">
                            <v-chip :color="getStatusColor(project.id_estado)" size="small">
                              {{ getStatusText(project.id_estado) }}
                            </v-chip>
                          </div>
                          
                          <!-- Main Project Star -->
                          <div class="main-project-star">
                            <v-btn
                              icon
                              size="small"
                              variant="text"
                              @click="projectStore.setMainProject(project.id)"
                            >
                              <v-icon :color="mainProject && project.id === mainProject.id ? 'warning' : 'grey'">
                                {{ mainProject && project.id === mainProject.id ? 'mdi-star' : 'mdi-star-outline' }}
                              </v-icon>
                            </v-btn>
                          </div>
                        </div>

                        <!-- Project Description -->
                        <p class="text-body-2 text-grey mb-4 project-description">
                          {{ truncateText(project.description, 100) }}
                        </p>

                        <!-- Project Details -->
                        <div class="project-details mb-4">
                          <div class="d-flex align-center mb-2">
                            <v-icon class="mr-2" color="primary" size="small">mdi-calendar-range</v-icon>
                            <span class="text-body-2">
                              {{ formatDateRange(project.startDate, project.endDate) }}
                            </span>
                          </div>
                          
                          <div class="d-flex align-center mb-2">
                            <v-icon class="mr-2" color="success" size="small">mdi-currency-usd</v-icon>
                            <span class="text-body-2">
                              ${{ project.budget?.toLocaleString() || '0' }} COP
                            </span>
                          </div>
                          
                          <div class="d-flex align-center">
                            <v-icon class="mr-2" color="info" size="small">mdi-view-list</v-icon>
                            <span class="text-body-2">
                              {{ project.phases?.length || 0 }} fase(s)
                            </span>
                          </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <v-divider class="my-3"></v-divider>
                        <div class="d-flex align-center w-100 gap-2">
                          <ModernButton
                            color="primary"
                            variant="outlined"
                            prepend-icon="mdi-eye"
                            @click="viewProjectDetails(project.id)"
                            class="flex-grow-1"
                            size="small"
                          >
                            Ver
                          </ModernButton>
                          
                          <v-btn
                            color="success"
                            variant="flat"
                            prepend-icon="mdi-cog"
                            @click="manageProject(project.id)"
                            size="small"
                          >
                            Gestionar
                          </v-btn>
                        </div>
                      </template>
                    </ModernCard>
                  </v-col>
                </v-row>
              </div>
            </template>
          </ModernCard>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { storeToRefs } from 'pinia';
import ModernButton from '@/components/ui/ModernButton.vue';
import ModernCard from '@/components/ui/ModernCard.vue';
import defaultProjectImage from '@/assets/images/background_login.png';
import { ROUTES } from '@/constants/routes';
import { useErrorHandler } from '@/composables/useErrorHandler';
import LoadingState from '@/components/feedback/LoadingState.vue';
import ErrorState from '@/components/feedback/ErrorState.vue';

const router = useRouter();
const projectStore = useProjectStore();
const { handleError, handleNetworkError, handleAuthError: handleAuthErrorUtil } = useErrorHandler();

const { projects, mainProject, loading, error } = storeToRefs(projectStore);

// Local error state to handle dismissal
const showError = ref(false);
const retryCount = ref(0);
const isRetrying = ref(false);

// Watch for errors from store
watch(error, (newError) => {
  showError.value = !!newError;
  if (!newError) {
    retryCount.value = 0; // Reset retry count on success
  }
}, { immediate: true });

function clearError() {
  showError.value = false;
  projectStore.error = null;
  retryCount.value = 0;
}

// Error type detection
function getErrorType(errorMessage) {
  if (!errorMessage) return 'error';
  
  const msg = errorMessage.toLowerCase();
  if (msg.includes('tiempo de espera') || msg.includes('timeout')) return 'warning';
  if (msg.includes('conexión') || msg.includes('network')) return 'warning';
  if (msg.includes('no autorizado') || msg.includes('401')) return 'error';
  if (msg.includes('permisos') || msg.includes('403')) return 'error';
  if (msg.includes('servidor') || msg.includes('500')) return 'error';
  
  return 'error';
}

function getErrorIcon(errorMessage) {
  const type = getErrorType(errorMessage);
  switch (type) {
    case 'warning':
      return 'mdi-wifi-off';
    case 'error':
      return 'mdi-alert-circle';
    default:
      return 'mdi-information';
  }
}

function getErrorTitle(errorMessage) {
  if (!errorMessage) return 'Error';
  
  const msg = errorMessage.toLowerCase();
  if (msg.includes('tiempo de espera') || msg.includes('timeout')) {
    return 'Tiempo de espera agotado';
  }
  if (msg.includes('conexión') || msg.includes('network')) {
    return 'Problema de conexión';
  }
  if (msg.includes('no autorizado') || msg.includes('401')) {
    return 'Sesión expirada';
  }
  if (msg.includes('permisos') || msg.includes('403')) {
    return 'Sin permisos';
  }
  if (msg.includes('servidor') || msg.includes('500')) {
    return 'Error del servidor';
  }
  
  return 'Error al cargar proyectos';
}

function isCriticalError(errorMessage) {
  if (!errorMessage) return false;
  const msg = errorMessage.toLowerCase();
  return msg.includes('no autorizado') || 
         msg.includes('401') || 
         msg.includes('permisos') || 
         msg.includes('403');
}

// Search and filter state
const searchQuery = ref('');
const statusFilter = ref(null);

// Status options for filter (Estados del proyecto)
const statusOptions = [
  { title: 'Planificación', value: 5 },
  { title: 'En Proceso', value: 1 },
  { title: 'Pausado', value: 3 },
  { title: 'Terminado', value: 2 },
  { title: 'Cancelado', value: 4 }
];

onMounted(() => {
  projectStore.fetchProjects();
});

// Computed properties
const activeProjectsCount = computed(() => {
  if (!projects.value || projects.value.length === 0) return 0;
  return projects.value.filter(p => p.id_estado === 1).length;
});

const publicProjectsCount = computed(() => {
  if (!projects.value || projects.value.length === 0) return 0;
  return projects.value.filter(p => p.es_publico === true).length;
});

const totalBudget = computed(() => {
  if (!projects.value || projects.value.length === 0) return 0;
  return projects.value.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
});

// Filtered projects
const filteredProjects = computed(() => {
  if (!projects.value || projects.value.length === 0) return [];
  
  let filtered = [...projects.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(project => 
      (project.name && project.name.toLowerCase().includes(query)) ||
      (project.description && project.description.toLowerCase().includes(query)) ||
      (project.location && project.location.toLowerCase().includes(query))
    );
  }

  // Status filter
  if (statusFilter.value !== null) {
    filtered = filtered.filter(project => project.id_estado === statusFilter.value);
  }

  return filtered;
});

// Helper functions para estados del proyecto
function getStatusColor(statusId) {
  switch (statusId) {
    case 1: return 'info'; // En Proceso
    case 2: return 'success'; // Terminado
    case 3: return 'warning'; // Pausado
    case 4: return 'error'; // Cancelado
    case 5: return 'primary'; // Planificación
    default: return 'grey'; // Desconocido
  }
}

function getStatusText(statusId) {
  switch (statusId) {
    case 1: return 'En Proceso';
    case 2: return 'Terminado';
    case 3: return 'Pausado';
    case 4: return 'Cancelado';
    case 5: return 'Planificación';
    default: return 'Desconocido';
  }
}

function formatDate(dateString) {
  if (!dateString) return 'No especificada';
  return new Date(dateString).toLocaleDateString('es-CO');
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Fechas no especificadas';
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function goToCreateProject() {
  router.push(ROUTES.ORGANIZATION.CREATE_PROJECT);
}

function viewProjectDetails(projectId) {
  router.push(ROUTES.ORGANIZATION.PROJECT_DETAIL(projectId));
}

function manageProject(projectId) {
  router.push(ROUTES.ORGANIZATION.PROJECT_DETAIL(projectId));
}

function editProject(projectId) {
  router.push(`${ROUTES.ORGANIZATION.CREATE_PROJECT}?id=${projectId}`);
}

function deactivateProject(projectId) {
  if (confirm(`¿Estás seguro de que quieres eliminar el proyecto con ID: ${projectId}?`)) {
    projectStore.deleteProject(projectId).then(success => {
      if (success) {
        alert(`Proyecto ${projectId} eliminado.`);
      } else {
        alert(`Error al eliminar el proyecto ${projectId}.`);
      }
    });
  }
}

// Additional management functions
function clearFilters() {
  searchQuery.value = '';
  statusFilter.value = null;
}

function toggleProjectStatus(projectId) {
  const project = projects.value.find(p => p.id === projectId);
  if (project) {
    const newStatus = project.id_estado === 0 ? 1 : 0;
    projectStore.updateProject(projectId, { id_estado: newStatus }).then(() => {
      // Refresh projects after status change
      projectStore.fetchProjects();
    });
  }
}

function duplicateProject(projectId) {
  const project = projects.value.find(p => p.id === projectId);
  if (project) {
    const duplicatedProject = {
      ...project,
      name: `${project.name} (Copia)`,
      id_estado: 0 // Always start as non-public
    };
    delete duplicatedProject.id;
    projectStore.addProject(duplicatedProject).then(() => {
      projectStore.fetchProjects();
    });
  }
}

function getEmptyStateMessage(errorMessage) {
  if (!errorMessage) return 'No se pudieron cargar los proyectos.';
  
  const msg = errorMessage.toLowerCase();
  if (msg.includes('tiempo de espera') || msg.includes('timeout')) {
    return 'El servidor tardó demasiado en responder. Verifica tu conexión a internet e intenta nuevamente.';
  }
  if (msg.includes('conexión') || msg.includes('network')) {
    return 'No se pudo establecer conexión con el servidor. Verifica tu conexión a internet.';
  }
  if (msg.includes('no autorizado') || msg.includes('401')) {
    return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.';
  }
  if (msg.includes('permisos') || msg.includes('403')) {
    return 'No tienes permisos para acceder a esta información. Contacta al administrador.';
  }
  if (msg.includes('servidor') || msg.includes('500')) {
    return 'El servidor está experimentando problemas. Por favor, intenta más tarde.';
  }
  
  return 'Hubo un problema al conectar con el servidor. Verifica tu conexión o intenta recargar la página.';
}

async function retryFetch() {
  if (isRetrying.value) return;
  
  isRetrying.value = true;
  retryCount.value += 1;
  
  // Exponential backoff: wait 1s, 2s, 4s, etc.
  const delay = Math.min(1000 * Math.pow(2, retryCount.value - 1), 10000);
  
  if (retryCount.value > 1) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  try {
    showError.value = false;
    await projectStore.fetchProjects();
    
    // If successful, reset retry count
    if (!projectStore.error) {
      retryCount.value = 0;
    }
  } catch (err) {
    handleNetworkError(err);
  } finally {
    isRetrying.value = false;
  }
}

function handleAuthErrorRedirect() {
  // Redirect to login usando constantes
  router.push(ROUTES.LOGIN);
}
</script>

<style scoped>
/* Project Image Container */
.project-image-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.status-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.main-project-star {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}

/* Project Item Hover Effects */
.project-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.project-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Project Description */
.project-description {
  line-height: 1.5;
  min-height: 3em;
}

/* Project Details */
.project-details {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}

/* Main Project Card */
.main-project-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid rgba(var(--v-theme-primary-rgb), 0.1);
}

.main-project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Projects Grid */
.projects-grid {
  min-height: 200px;
}

/* Empty State */
.empty-state {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 2px dashed #dee2e6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .project-image-container {
    margin-bottom: 16px;
  }
  
  .project-details {
    padding-top: 8px;
  }
  
  .main-project-card .v-row {
    flex-direction: column;
  }
}

/* Animation for project cards */
.project-item {
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation for multiple cards */
.project-item:nth-child(1) { animation-delay: 0.1s; }
.project-item:nth-child(2) { animation-delay: 0.2s; }
.project-item:nth-child(3) { animation-delay: 0.3s; }
.project-item:nth-child(4) { animation-delay: 0.4s; }
.project-item:nth-child(5) { animation-delay: 0.5s; }
.project-item:nth-child(6) { animation-delay: 0.6s; }

/* Professional Metric Cards - Estilo Dashboard */
.professional-metric-card {
  height: 100%;
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.professional-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
}

.metric-header-professional {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-icon-professional {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.metric-icon-professional.success {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.metric-icon-professional.info {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
}

.metric-icon-professional.primary {
  background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%);
}

.metric-icon-professional.warning {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
}

.metric-content-professional {
  text-align: left;
}

.metric-value-professional {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.metric-value-professional.success {
  color: #2E7D32;
}

.metric-value-professional.info {
  color: #1565C0;
}

.metric-value-professional.primary {
  color: #7B1FA2;
}

.metric-value-professional.warning {
  color: #E65100;
}

.metric-label-professional {
  font-size: 0.875rem;
  font-weight: 600;
  color: #212121;
  margin-bottom: 4px;
  line-height: 1.4;
}

.metric-subtitle-professional {
  font-size: 0.75rem;
  color: #757575;
  line-height: 1.4;
}

/* Search and Filter Styles */
.search-field {
  min-width: 300px;
}

.filter-field {
  min-width: 150px;
}

.gap-3 {
  gap: 12px;
}

.gap-2 {
  gap: 8px;
}

/* Action buttons styling */
.action-buttons {
  padding: 16px 0;
  border-top: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.action-buttons .v-btn {
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loading-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-blurred {
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Skeleton Loader */
.skeleton-loader-container {
  padding: 24px 0;
}

.skeleton-loader-container .v-skeleton-loader {
  border-radius: 12px;
}

/* Empty State */
.empty-state-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.empty-state-content {
  text-align: center;
  max-width: 800px;
}

.empty-state-icon {
  animation: fadeInScale 0.5s ease;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.error-banner {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state-features {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.feature-item {
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(var(--v-theme-primary-rgb), 0.05);
  transform: translateY(-2px);
}

.gap-3 {
  gap: 12px;
}

/* Responsive adjustments for professional cards */
@media (max-width: 960px) {
  .professional-metric-card .v-card-text {
    padding: 16px !important;
  }
  
  .metric-icon-professional {
    width: 40px;
    height: 40px;
  }
  
  .metric-value-professional {
    font-size: 1.5rem;
  }
  
  .metric-label-professional {
    font-size: 0.8125rem;
  }
  
  .metric-subtitle-professional {
    font-size: 0.6875rem;
  }
}

@media (max-width: 480px) {
  .professional-metric-card .v-card-text {
    padding: 12px !important;
  }
  
  .metric-header-professional {
    margin-bottom: 12px;
    justify-content: center;
  }
  
  .metric-icon-professional {
    width: 36px;
    height: 36px;
  }
  
  .metric-content-professional {
    text-align: center;
  }
  
  .metric-value-professional {
    font-size: 1.35rem;
  }
  
  .metric-label-professional {
    font-size: 0.75rem;
  }
  
  .metric-subtitle-professional {
    font-size: 0.6875rem;
  }
}

/* Responsive adjustments for header */
@media (max-width: 1024px) {
  .search-field {
    min-width: 250px;
  }
}

@media (max-width: 768px) {
  .d-flex.gap-3 {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-field,
  .filter-field {
    min-width: auto;
    width: 100%;
  }
  
  .empty-state-content {
    padding: 24px 16px;
  }
  
  .empty-state-features .v-row {
    margin: 0;
  }
  
  .empty-state-features .v-col {
    padding: 8px;
  }
}
</style>