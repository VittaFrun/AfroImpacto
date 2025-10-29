<template>
  <div class="global-search">
    <!-- Search Input -->
    <v-text-field
      v-model="query"
      :loading="isLoading"
      prepend-inner-icon="mdi-magnify"
      placeholder="Buscar proyectos, voluntarios, tareas..."
      variant="outlined"
      density="comfortable"
      hide-details
      clearable
      @focus="openSearch"
      @keydown.enter="handleSearch"
      @keydown.escape="closeSearch"
      @input="handleInput"
      class="search-input"
    >
      <template #append-inner>
        <v-btn
          icon="mdi-filter-variant"
          variant="text"
          size="small"
          @click="showFilters = !showFilters"
        >
          <v-icon size="20">mdi-filter-variant</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <!-- Search Results Panel -->
    <v-menu
      v-model="isOpen"
      :close-on-content-click="false"
      location="bottom start"
      offset="4"
      width="600"
      max-width="90vw"
    >
      <template #activator="{ props }">
        <div v-bind="props"></div>
      </template>

      <v-card class="search-results-panel" elevation="8">
        <!-- Search Suggestions -->
        <div v-if="!hasQuery && suggestions.length > 0" class="pa-4">
          <h4 class="text-subtitle-1 font-weight-bold mb-3">Búsquedas Recientes</h4>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="suggestion in suggestions"
              :key="suggestion"
              variant="outlined"
              @click="setQuery(suggestion); search(suggestion)"
              class="suggestion-chip"
            >
              {{ suggestion }}
            </v-chip>
          </div>
        </div>

        <!-- Search Results -->
        <div v-else-if="hasQuery" class="search-results">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
            <p class="text-body-2 text-grey mt-2">Buscando...</p>
          </div>

          <!-- Results -->
          <div v-else-if="searchResults.total > 0">
            <!-- Projects -->
            <div v-if="searchFilters.projects && searchResults.projects.length > 0" class="result-section">
              <div class="section-header pa-4 pb-2">
                <h4 class="text-subtitle-1 font-weight-bold d-flex align-center">
                  <v-icon class="mr-2" color="primary">mdi-folder-heart</v-icon>
                  Proyectos ({{ searchResults.projects.length }})
                </h4>
              </div>
              <div class="result-items">
                <div
                  v-for="project in searchResults.projects.slice(0, 3)"
                  :key="project.id"
                  class="result-item pa-4"
                  @click="goToProject(project)"
                >
                  <div class="d-flex align-center">
                    <v-avatar :color="project.id_estado === 1 ? 'success' : 'warning'" class="mr-3" size="40">
                      <v-icon color="white">mdi-folder-heart</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h5 class="text-subtitle-2 font-weight-bold">{{ project.name }}</h5>
                      <p class="text-body-2 text-grey mb-1">{{ project.location }}</p>
                      <p class="text-caption text-grey-darken-1 line-clamp-2">
                        {{ project.description }}
                      </p>
                    </div>
                    <v-chip
                      :color="project.id_estado === 1 ? 'success' : 'warning'"
                      size="small"
                      variant="tonal"
                    >
                      {{ project.id_estado === 1 ? 'Público' : 'Privado' }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </div>

            <!-- Volunteers -->
            <div v-if="searchFilters.volunteers && searchResults.volunteers.length > 0" class="result-section">
              <div class="section-header pa-4 pb-2">
                <h4 class="text-subtitle-1 font-weight-bold d-flex align-center">
                  <v-icon class="mr-2" color="success">mdi-account-heart</v-icon>
                  Voluntarios ({{ searchResults.volunteers.length }})
                </h4>
              </div>
              <div class="result-items">
                <div
                  v-for="volunteer in searchResults.volunteers.slice(0, 3)"
                  :key="volunteer.id"
                  class="result-item pa-4"
                  @click="goToVolunteer(volunteer)"
                >
                  <div class="d-flex align-center">
                    <v-avatar color="success" class="mr-3" size="40">
                      <v-icon color="white">mdi-account-heart</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h5 class="text-subtitle-2 font-weight-bold">{{ volunteer.nombre }}</h5>
                      <p class="text-body-2 text-grey mb-1">{{ volunteer.email }}</p>
                      <div class="d-flex flex-wrap gap-1">
                        <v-chip
                          v-for="skill in volunteer.habilidades?.slice(0, 3)"
                          :key="skill"
                          size="x-small"
                          variant="tonal"
                          color="success"
                        >
                          {{ skill }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tasks -->
            <div v-if="searchFilters.tasks && searchResults.tasks.length > 0" class="result-section">
              <div class="section-header pa-4 pb-2">
                <h4 class="text-subtitle-1 font-weight-bold d-flex align-center">
                  <v-icon class="mr-2" color="info">mdi-format-list-checks</v-icon>
                  Tareas ({{ searchResults.tasks.length }})
                </h4>
              </div>
              <div class="result-items">
                <div
                  v-for="task in searchResults.tasks.slice(0, 3)"
                  :key="task.id"
                  class="result-item pa-4"
                  @click="goToTask(task)"
                >
                  <div class="d-flex align-center">
                    <v-avatar color="info" class="mr-3" size="40">
                      <v-icon color="white">mdi-format-list-checks</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h5 class="text-subtitle-2 font-weight-bold">{{ task.descripcion }}</h5>
                      <p class="text-body-2 text-grey mb-1">
                        {{ task.projectName }} • {{ task.phaseName }}
                      </p>
                      <div class="d-flex align-center gap-2">
                        <v-chip
                          :color="getPriorityColor(task.prioridad)"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ task.prioridad }}
                        </v-chip>
                        <v-chip
                          :color="getStatusColor(task.id_estado)"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ getStatusText(task.id_estado) }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- View All Results -->
            <div v-if="searchResults.total > 9" class="pa-4">
              <v-btn
                variant="outlined"
                color="primary"
                block
                @click="viewAllResults"
              >
                Ver todos los resultados ({{ searchResults.total }})
              </v-btn>
            </div>
          </div>

          <!-- No Results -->
          <div v-else class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1">mdi-magnify</v-icon>
            <h4 class="text-h6 text-grey mt-4">No se encontraron resultados</h4>
            <p class="text-body-2 text-grey">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        </div>

        <!-- Filters -->
        <v-expand-transition>
          <div v-show="showFilters" class="filters-section pa-4">
            <v-divider class="mb-4"></v-divider>
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Filtros</h4>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="(enabled, filter) in searchFilters"
                :key="filter"
                :color="enabled ? 'primary' : 'grey'"
                :variant="enabled ? 'flat' : 'outlined'"
                @click="toggleFilter(filter)"
              >
                {{ getFilterLabel(filter) }}
              </v-chip>
            </div>
          </div>
        </v-expand-transition>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSearchStore } from '@/stores/searchStore';
import { useRouter } from 'vue-router';

const searchStore = useSearchStore();
const router = useRouter();

const { 
  query, 
  isOpen, 
  isLoading, 
  hasQuery, 
  suggestions, 
  searchResults, 
  searchFilters 
} = storeToRefs(searchStore);

const { 
  search, 
  setQuery, 
  openSearch, 
  closeSearch, 
  toggleFilter 
} = searchStore;

// Local state
const showFilters = ref(false);

// Watch for query changes
watch(query, (newQuery) => {
  if (newQuery && newQuery.length > 2) {
    search(newQuery);
  }
});

// Methods
function handleSearch() {
  if (hasQuery.value) {
    search(query.value);
  }
}

function handleInput() {
  // Debounced search will be handled by watch
}

function goToProject(project) {
  router.push(`/organization/projects/${project.id}`);
  closeSearch();
}

function goToVolunteer(volunteer) {
  router.push(`/volunteers/${volunteer.id}`);
  closeSearch();
}

function goToTask(task) {
  router.push(`/organization/projects/${task.id_proyecto}/tasks/${task.id}`);
  closeSearch();
}

function viewAllResults() {
  router.push(`/search?q=${encodeURIComponent(query.value)}`);
  closeSearch();
}

function getFilterLabel(filter) {
  const labels = {
    projects: 'Proyectos',
    volunteers: 'Voluntarios',
    organizations: 'Organizaciones',
    tasks: 'Tareas'
  };
  return labels[filter] || filter;
}

function getPriorityColor(priority) {
  const colors = {
    'Alta': 'error',
    'Media': 'warning',
    'Baja': 'success'
  };
  return colors[priority] || 'grey';
}

function getStatusColor(statusId) {
  const colors = {
    1: 'warning',
    2: 'info',
    3: 'success'
  };
  return colors[statusId] || 'grey';
}

function getStatusText(statusId) {
  const texts = {
    1: 'Pendiente',
    2: 'En Progreso',
    3: 'Completada'
  };
  return texts[statusId] || 'Desconocido';
}
</script>

<style scoped>
.global-search {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input {
  border-radius: 12px;
}

.search-results-panel {
  border-radius: 12px;
  overflow: hidden;
  max-height: 600px;
}

.result-section {
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.result-section:last-child {
  border-bottom: none;
}

.result-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.08);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: rgba(var(--v-theme-primary), 0.04);
  transform: translateX(4px);
}

.suggestion-chip {
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-chip:hover {
  transform: scale(1.05);
}

.filters-section {
  background: rgba(var(--v-theme-surface), 0.5);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
