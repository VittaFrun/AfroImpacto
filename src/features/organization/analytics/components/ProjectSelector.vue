<template>
  <div class="project-selector">
    <v-autocomplete
      v-model="selectedProjects"
      :items="availableProjects"
      :loading="loading"
      :search="searchQuery"
      item-title="nombre"
      item-value="id"
      label="Seleccionar Proyectos para Comparar"
      placeholder="Buscar proyectos..."
      variant="outlined"
      density="comfortable"
      multiple
      chips
      closable-chips
      :max="8"
      return-object
      @update:search="handleSearch"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props">
          <template #prepend>
            <v-avatar color="primary" size="40">
              <v-icon color="white">mdi-folder</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>{{ item.raw.nombre || item.raw.name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ item.raw.descripcion?.substring(0, 60) || 'Sin descripción' }}
          </v-list-item-subtitle>
        </v-list-item>
      </template>
      
      <template #chip="{ props, item }">
        <v-chip
          v-bind="props"
          :color="getProjectColor(item.raw)"
          variant="tonal"
        >
          {{ item.raw.nombre || item.raw.name }}
        </v-chip>
      </template>
      
      <template #no-data>
        <v-list-item>
          <v-list-item-title>
            {{ searchQuery ? 'No se encontraron proyectos' : 'Escribe para buscar proyectos' }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-autocomplete>

    <!-- Selected Projects Summary -->
    <div v-if="selectedProjects.length > 0" class="selected-projects-summary mt-4">
      <div class="text-caption text-grey mb-2">
        {{ selectedProjects.length }} proyecto(s) seleccionado(s)
      </div>
      <div class="d-flex flex-wrap gap-2">
        <v-chip
          v-for="project in selectedProjects"
          :key="project.id || project.id_proyecto"
          :color="getProjectColor(project)"
          variant="tonal"
          closable
          @click:close="removeProject(project)"
        >
          {{ project.nombre || project.name }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const searchQuery = ref('');
const selectedProjects = ref([]);

// Computed
const availableProjects = computed(() => {
  if (!props.projects || props.projects.length === 0) return [];
  
  // Filtrar por búsqueda si existe
  let filtered = props.projects;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = props.projects.filter(p =>
      (p.nombre || p.name || '').toLowerCase().includes(query) ||
      (p.descripcion || '').toLowerCase().includes(query)
    );
  }
  
  return filtered.map(p => ({
    ...p,
    id: p.id || p.id_proyecto,
    nombre: p.nombre || p.name
  }));
});

// Methods
const getProjectColor = (project) => {
  const colors = ['primary', 'success', 'info', 'warning', 'error', 'purple', 'teal', 'orange'];
  const index = (project.id || project.id_proyecto || 0) % colors.length;
  return colors[index];
};

const handleSearch = (value) => {
  searchQuery.value = value;
};

const removeProject = (project) => {
  const index = selectedProjects.value.findIndex(
    p => (p.id || p.id_proyecto) === (project.id || project.id_proyecto)
  );
  if (index > -1) {
    selectedProjects.value.splice(index, 1);
    emit('update:modelValue', selectedProjects.value);
    emit('change', selectedProjects.value);
  }
};

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && Array.isArray(newValue)) {
    selectedProjects.value = newValue;
  }
}, { immediate: true, deep: true });

// Watch for internal changes
watch(selectedProjects, (newValue) => {
  emit('update:modelValue', newValue);
  emit('change', newValue);
}, { deep: true });
</script>

<style scoped>
.project-selector {
  width: 100%;
}

.selected-projects-summary {
  padding: 12px;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}
</style>

