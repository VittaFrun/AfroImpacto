<template>
  <v-container fluid class="pa-8">
    <!-- Loading State -->
    <div v-if="loading" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-alert type="error" prominent>
        {{ error }}
      </v-alert>
    </div>

    <!-- Main Content -->
    <div v-else>
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

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <ModernCard
            title="Total Proyectos"
            subtitle="Proyectos creados"
            icon="mdi-folder-multiple"
            icon-color="primary"
            variant="filled"
          >
            <template #content>
              <div class="text-center py-4">
                <div class="text-h3 font-weight-bold text-primary">{{ projects.length }}</div>
                <div class="text-caption text-grey">Proyectos activos</div>
              </div>
            </template>
          </ModernCard>
        </v-col>
        
        <v-col cols="12" md="3">
          <ModernCard
            title="Proyectos Activos"
            subtitle="En desarrollo"
            icon="mdi-folder-heart"
            icon-color="success"
            variant="tonal"
          >
            <template #content>
              <div class="text-center py-4">
                <div class="text-h3 font-weight-bold text-success">{{ activeProjectsCount }}</div>
                <div class="text-caption text-grey">En progreso</div>
              </div>
            </template>
          </ModernCard>
        </v-col>
        
        <v-col cols="12" md="3">
          <ModernCard
            title="Proyectos Públicos"
            subtitle="Disponibles para voluntarios"
            icon="mdi-eye"
            icon-color="info"
            variant="outlined"
          >
            <template #content>
              <div class="text-center py-4">
                <div class="text-h3 font-weight-bold text-info">{{ publicProjectsCount }}</div>
                <div class="text-caption text-grey">Visibles públicamente</div>
              </div>
            </template>
          </ModernCard>
        </v-col>
        
        <v-col cols="12" md="3">
          <ModernCard
            title="Presupuesto Total"
            subtitle="Inversión en proyectos"
            icon="mdi-currency-usd"
            icon-color="warning"
            variant="gradient"
          >
            <template #content>
              <div class="text-center py-4">
                <div class="text-h3 font-weight-bold text-warning">${{ totalBudget.toLocaleString() }}</div>
                <div class="text-caption text-grey">COP</div>
              </div>
            </template>
          </ModernCard>
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
              <div v-if="projects.length === 0" class="text-center py-8">
                <v-icon size="120" color="grey-lighten-1">mdi-folder-open-outline</v-icon>
                <h3 class="text-h5 text-grey mt-4">No hay proyectos creados</h3>
                <p class="text-body-1 text-grey mb-4">
                  Comienza creando tu primer proyecto de impacto social
                </p>
                <ModernButton
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-plus"
                  @click="goToCreateProject"
                >
                  Crear Primer Proyecto
                </ModernButton>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { storeToRefs } from 'pinia';
import ModernButton from '@/components/ui/ModernButton.vue';
import ModernCard from '@/components/ui/ModernCard.vue';
import defaultProjectImage from '@/assets/images/background_login.png';

const router = useRouter();
const projectStore = useProjectStore();

const { projects, mainProject, loading, error } = storeToRefs(projectStore);

// Search and filter state
const searchQuery = ref('');
const statusFilter = ref(null);

// Status options for filter
const statusOptions = [
  { title: 'No Público', value: 0 },
  { title: 'Público', value: 1 }
];

onMounted(() => {
  projectStore.fetchProjects();
});

// Computed properties
const activeProjectsCount = computed(() => {
  return projects.value.filter(p => p.id_estado === 1).length;
});

const publicProjectsCount = computed(() => {
  return projects.value.filter(p => p.id_estado === 1).length;
});

const totalBudget = computed(() => {
  return projects.value.reduce((sum, p) => sum + (p.budget || 0), 0);
});

// Filtered projects
const filteredProjects = computed(() => {
  let filtered = projects.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.location.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (statusFilter.value !== null) {
    filtered = filtered.filter(project => project.id_estado === statusFilter.value);
  }

  return filtered;
});

// Helper functions
function getStatusColor(statusId) {
  switch (statusId) {
    case 0: return 'warning'; // No Público
    case 1: return 'success'; // Público
    default: return 'grey';
  }
}

function getStatusText(statusId) {
  switch (statusId) {
    case 0: return 'No Público';
    case 1: return 'Público';
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
  router.push('/organization/dashboard/projects/create');
}

function viewProjectDetails(projectId) {
  router.push(`/organization/dashboard/projects/${projectId}`);
}

function manageProject(projectId) {
  router.push(`/organization/dashboard/projects/${projectId}`);
}

function editProject(projectId) {
  router.push(`/organization/dashboard/projects/create?id=${projectId}`);
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
}
</style>