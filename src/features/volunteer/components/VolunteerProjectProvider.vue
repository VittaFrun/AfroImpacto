<template>
  <div class="volunteer-project-provider">
    <!-- Project Context Provider -->
    <div v-if="hasValidProject">
      <slot 
        :project="project"
        :project-id="projectId"
        :loading="loading"
        :error="error"
        :reload="loadProject"
      />
    </div>
    
    <!-- Loading State -->
    <div v-else-if="loading" class="d-flex justify-center align-center" style="min-height: 400px;">
      <div class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
        <p class="text-body-1 text-grey-darken-1">Cargando proyecto...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="d-flex justify-center align-center" style="min-height: 400px;">
      <v-alert
        type="error"
        variant="tonal"
        class="ma-4"
        max-width="500"
      >
        <template #prepend>
          <v-icon>mdi-alert-circle</v-icon>
        </template>
        <div>
          <h3 class="text-h6 mb-2">Error al cargar el proyecto</h3>
          <p class="mb-3">{{ error }}</p>
          <v-btn
            color="error"
            variant="outlined"
            size="small"
            @click="loadProject"
          >
            <v-icon start>mdi-refresh</v-icon>
            Reintentar
          </v-btn>
        </div>
      </v-alert>
    </div>
    
    <!-- No Project State -->
    <div v-else class="d-flex justify-center align-center" style="min-height: 400px;">
      <v-alert
        type="warning"
        variant="tonal"
        class="ma-4"
        max-width="500"
      >
        <template #prepend>
          <v-icon>mdi-information</v-icon>
        </template>
        <div>
          <h3 class="text-h6 mb-2">Proyecto no encontrado</h3>
          <p class="mb-3">No se pudo cargar la información del proyecto.</p>
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            to="/volunteer/projects"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            Volver a mis proyectos
          </v-btn>
        </div>
      </v-alert>
    </div>
  </div>
</template>

<script setup>
import { useProjectProvider } from '@/composables/useProjectContext';

// Project Context Provider
const {
  currentProject: project,
  projectId,
  loading,
  error,
  hasValidProject,
  loadProject
} = useProjectProvider();
</script>

<style scoped>
.volunteer-project-provider {
  min-height: 100%;
}
</style>
