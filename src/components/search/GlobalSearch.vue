<template>
  <v-dialog
    v-model="localDialog"
    :max-width="800"
    :fullscreen="$vuetify.display.mobile"
    scrollable
    @keydown.esc="close"
    @click:outside="close"
  >
    <v-card class="global-search-dialog" rounded="lg">
      <!-- Header -->
      <v-card-title class="search-header pa-4">
        <div class="d-flex align-center w-100">
          <v-icon class="mr-3" color="primary" size="28">mdi-magnify</v-icon>
          <v-text-field
            ref="searchInput"
            v-model="searchQuery"
            placeholder="Buscar proyectos, tareas, voluntarios..."
            variant="solo"
            density="comfortable"
            hide-details
            autofocus
            clearable
            @input="handleSearch"
            @keydown.enter="handleEnter"
            @keydown.down.prevent="navigateDown"
            @keydown.up.prevent="navigateUp"
            class="search-input"
          >
            <template #prepend-inner>
              <v-icon>mdi-magnify</v-icon>
            </template>
            <template #append-inner>
              <kbd class="keyboard-hint">Ctrl+K</kbd>
            </template>
          </v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Content -->
      <v-card-text class="pa-0" style="max-height: 600px;">
        <!-- Loading State -->
        <div v-if="loading" class="search-loading pa-8 text-center">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          <p class="text-body-2 text-grey mt-4">Buscando...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!searchQuery || searchQuery.length < 2" class="search-empty pa-8 text-center">
          <v-icon size="64" color="grey-lighten-1">mdi-magnify</v-icon>
          <h3 class="text-h6 mt-4 mb-2">Búsqueda Global</h3>
          <p class="text-body-2 text-grey mb-4">
            Busca en proyectos, tareas, voluntarios, fases y roles
          </p>
          
          <!-- Recent Searches -->
          <div v-if="recentSearches.length > 0" class="recent-searches mt-6">
            <div class="text-caption text-grey mb-2">Búsquedas recientes</div>
            <div class="d-flex flex-wrap gap-2 justify-center">
              <v-chip
                v-for="(search, index) in recentSearches"
                :key="index"
                size="small"
                variant="outlined"
                @click="searchQuery = search; handleSearch()"
                style="cursor: pointer;"
              >
                {{ search }}
              </v-chip>
            </div>
          </div>

          <!-- Quick Filters -->
          <div class="quick-filters mt-6">
            <div class="text-caption text-grey mb-2">Filtros rápidos</div>
            <div class="d-flex flex-wrap gap-2 justify-center">
              <v-chip
                v-for="filter in quickFilters"
                :key="filter.type"
                size="small"
                :color="filter.color"
                variant="tonal"
                @click="applyQuickFilter(filter)"
                style="cursor: pointer;"
              >
                <v-icon start size="16">{{ filter.icon }}</v-icon>
                {{ filter.label }}
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div v-else-if="hasResults" class="search-results">
          <!-- Tabs for result types -->
          <v-tabs v-model="activeTab" density="compact" class="search-tabs">
            <v-tab
              v-for="tab in resultTabs"
              :key="tab.value"
              :value="tab.value"
              :disabled="tab.count === 0"
            >
              {{ tab.label }}
              <v-chip
                v-if="tab.count > 0"
                size="x-small"
                class="ml-2"
                :color="tab.color"
              >
                {{ tab.count }}
              </v-chip>
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="search-window">
            <!-- All Results -->
            <v-window-item value="all">
              <v-list class="pa-0">
                <v-list-subheader v-if="results.proyectos.length > 0">
                  <v-icon class="mr-2" size="16">mdi-folder</v-icon>
                  Proyectos ({{ results.proyectos.length }})
                </v-list-subheader>
                <SearchResultItem
                  v-for="(item, index) in results.proyectos"
                  :key="`proyecto-${index}`"
                  :item="{ ...item, type: 'proyecto' }"
                  :search-query="searchQuery"
                  @click="handleItemClick"
                />

                <v-list-subheader v-if="results.tareas.length > 0">
                  <v-icon class="mr-2" size="16">mdi-format-list-checks</v-icon>
                  Tareas ({{ results.tareas.length }})
                </v-list-subheader>
                <SearchResultItem
                  v-for="(item, index) in results.tareas"
                  :key="`tarea-${index}`"
                  :item="{ ...item, type: 'tarea' }"
                  :search-query="searchQuery"
                  @click="handleItemClick"
                />

                <v-list-subheader v-if="results.voluntarios.length > 0">
                  <v-icon class="mr-2" size="16">mdi-account</v-icon>
                  Voluntarios ({{ results.voluntarios.length }})
                </v-list-subheader>
                <SearchResultItem
                  v-for="(item, index) in results.voluntarios"
                  :key="`voluntario-${index}`"
                  :item="{ ...item, type: 'voluntario' }"
                  :search-query="searchQuery"
                  @click="handleItemClick"
                />

                <v-list-subheader v-if="results.fases.length > 0">
                  <v-icon class="mr-2" size="16">mdi-view-list</v-icon>
                  Fases ({{ results.fases.length }})
                </v-list-subheader>
                <SearchResultItem
                  v-for="(item, index) in results.fases"
                  :key="`fase-${index}`"
                  :item="{ ...item, type: 'fase' }"
                  :search-query="searchQuery"
                  @click="handleItemClick"
                />

                <v-list-subheader v-if="results.roles.length > 0">
                  <v-icon class="mr-2" size="16">mdi-account-group</v-icon>
                  Roles ({{ results.roles.length }})
                </v-list-subheader>
                <SearchResultItem
                  v-for="(item, index) in results.roles"
                  :key="`rol-${index}`"
                  :item="{ ...item, type: 'rol' }"
                  :search-query="searchQuery"
                  @click="handleItemClick"
                />
              </v-list>
            </v-window-item>

            <!-- Filtered Results by Type -->
            <v-window-item
              v-for="tab in resultTabs.filter(t => t.value !== 'all')"
              :key="tab.value"
              :value="tab.value"
            >
              <v-list class="pa-0">
                <SearchResultItem
                  v-for="(item, index) in getResultsByType(tab.value)"
                  :key="`${tab.value}-${index}`"
                  :item="{ ...item, type: tab.value }"
                  :search-query="searchQuery"
                  @click="handleItemClick"
                />
              </v-list>
            </v-window-item>
          </v-window>

          <!-- No Results -->
          <div v-if="!hasResults && searchQuery.length >= 2" class="no-results pa-8 text-center">
            <v-icon size="64" color="grey-lighten-1">mdi-magnify</v-icon>
            <h3 class="text-h6 mt-4 mb-2">No se encontraron resultados</h3>
            <p class="text-body-2 text-grey">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        </div>
      </v-card-text>

      <!-- Footer -->
      <v-divider></v-divider>
      <v-card-actions class="pa-3">
        <div class="d-flex align-center gap-2 text-caption text-grey">
          <kbd>↑↓</kbd> Navegar
          <kbd>↵</kbd> Seleccionar
          <kbd>Esc</kbd> Cerrar
        </div>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          size="small"
          @click="close"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getSearchService } from './SearchService';
import SearchResultItem from './SearchResultItem.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'item-click']);

const localDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const searchService = getSearchService();
const searchInput = ref(null);
const searchQuery = ref('');
const loading = ref(false);
const results = ref({
  proyectos: [],
  tareas: [],
  voluntarios: [],
  fases: [],
  roles: []
});
const activeTab = ref('all');
const selectedIndex = ref(-1);
const searchTimeout = ref(null);
const recentSearches = ref([]);

// Quick filters
const quickFilters = [
  { type: 'proyecto', label: 'Proyectos', icon: 'mdi-folder', color: 'primary' },
  { type: 'tarea', label: 'Tareas', icon: 'mdi-format-list-checks', color: 'info' },
  { type: 'voluntario', label: 'Voluntarios', icon: 'mdi-account', color: 'success' }
];

// Result tabs
const resultTabs = computed(() => {
  const tabs = [
    { value: 'all', label: 'Todos', count: totalResults.value, color: 'primary' }
  ];

  if (results.value.proyectos.length > 0) {
    tabs.push({ value: 'proyecto', label: 'Proyectos', count: results.value.proyectos.length, color: 'primary' });
  }
  if (results.value.tareas.length > 0) {
    tabs.push({ value: 'tarea', label: 'Tareas', count: results.value.tareas.length, color: 'info' });
  }
  if (results.value.voluntarios.length > 0) {
    tabs.push({ value: 'voluntario', label: 'Voluntarios', count: results.value.voluntarios.length, color: 'success' });
  }
  if (results.value.fases.length > 0) {
    tabs.push({ value: 'fase', label: 'Fases', count: results.value.fases.length, color: 'warning' });
  }
  if (results.value.roles.length > 0) {
    tabs.push({ value: 'rol', label: 'Roles', count: results.value.roles.length, color: 'purple' });
  }

  return tabs;
});

const totalResults = computed(() => {
  return results.value.proyectos.length +
         results.value.tareas.length +
         results.value.voluntarios.length +
         results.value.fases.length +
         results.value.roles.length;
});

const hasResults = computed(() => {
  return totalResults.value > 0;
});

// Cargar búsquedas recientes
const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      recentSearches.value = JSON.parse(saved).slice(0, 5);
    }
  } catch (error) {
    console.error('Error loading recent searches:', error);
  }
};

// Guardar búsqueda reciente
const saveRecentSearch = (query) => {
  if (!query || query.length < 2) return;
  
  const searches = [...recentSearches.value];
  const index = searches.indexOf(query);
  if (index > -1) {
    searches.splice(index, 1);
  }
  searches.unshift(query);
  recentSearches.value = searches.slice(0, 10);
  
  try {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
  } catch (error) {
    console.error('Error saving recent searches:', error);
  }
};

// Realizar búsqueda
const performSearch = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    results.value = {
      proyectos: [],
      tareas: [],
      voluntarios: [],
      fases: [],
      roles: []
    };
    return;
  }

  loading.value = true;
  try {
    const searchResults = await searchService.search(searchQuery.value, { limit: 10 });
    results.value = searchResults;
    activeTab.value = 'all';
    selectedIndex.value = -1;
  } catch (error) {
    console.error('Error performing search:', error);
    results.value = {
      proyectos: [],
      tareas: [],
      voluntarios: [],
      fases: [],
      roles: []
    };
  } finally {
    loading.value = false;
  }
};

// Handle search input with debounce
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = setTimeout(() => {
    performSearch();
  }, 300);
};

// Handle enter key
const handleEnter = () => {
  if (selectedIndex.value >= 0) {
    // Seleccionar item navegado
    const allItems = getAllItems();
    if (allItems[selectedIndex.value]) {
      handleItemClick(allItems[selectedIndex.value]);
    }
  } else if (hasResults.value) {
    // Seleccionar primer resultado
    const allItems = getAllItems();
    if (allItems[0]) {
      handleItemClick(allItems[0]);
    }
  }
};

// Navegar hacia abajo
const navigateDown = () => {
  const allItems = getAllItems();
  if (selectedIndex.value < allItems.length - 1) {
    selectedIndex.value++;
  }
};

// Navegar hacia arriba
const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

// Obtener todos los items en un array plano
const getAllItems = () => {
  const items = [];
  
  results.value.proyectos.forEach(item => items.push({ ...item, type: 'proyecto' }));
  results.value.tareas.forEach(item => items.push({ ...item, type: 'tarea' }));
  results.value.voluntarios.forEach(item => items.push({ ...item, type: 'voluntario' }));
  results.value.fases.forEach(item => items.push({ ...item, type: 'fase' }));
  results.value.roles.forEach(item => items.push({ ...item, type: 'rol' }));
  
  return items;
};

// Obtener resultados por tipo
const getResultsByType = (type) => {
  return results.value[type] || [];
};

// Aplicar filtro rápido
const applyQuickFilter = (filter) => {
  searchQuery.value = `tipo:${filter.type}`;
  handleSearch();
};

// Manejar click en item
const handleItemClick = (item) => {
  saveRecentSearch(searchQuery.value);
  emit('item-click', item);
  close();
};

// Cerrar diálogo
const close = () => {
  localDialog.value = false;
  searchQuery.value = '';
  results.value = {
    proyectos: [],
    tareas: [],
    voluntarios: [],
    fases: [],
    roles: []
  };
  selectedIndex.value = -1;
};

// Focus en input cuando se abre
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    if (searchInput.value) {
      searchInput.value.focus();
    }
    loadRecentSearches();
  }
});

// Keyboard shortcut (Ctrl+K / Cmd+K)
const handleKeyboardShortcut = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    localDialog.value = !localDialog.value;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyboardShortcut);
  loadRecentSearches();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut);
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>

<style scoped>
.global-search-dialog {
  overflow: hidden;
}

.search-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.search-input {
  flex: 1;
}

.keyboard-hint {
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-family: monospace;
}

.search-loading,
.search-empty,
.no-results {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.search-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.search-window {
  max-height: 500px;
  overflow-y: auto;
}

.recent-searches,
.quick-filters {
  max-width: 500px;
  margin: 0 auto;
}

kbd {
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-family: monospace;
  margin: 0 2px;
}
</style>

