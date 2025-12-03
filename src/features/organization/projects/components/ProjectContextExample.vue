<template>
  <div class="project-context-example">
    <!-- Ejemplo de uso del contexto de proyecto -->
    <v-card class="mb-4" rounded="lg">
      <v-card-title>
        <v-icon class="mr-2" color="primary">mdi-information</v-icon>
        Información del Proyecto (Contexto)
      </v-card-title>
      <v-card-text>
        <div v-if="hasValidProject">
          <p><strong>ID:</strong> {{ projectId }}</p>
          <p><strong>Nombre:</strong> {{ projectInfo.nombre }}</p>
          <p><strong>Estado:</strong> {{ projectInfo.estado }}</p>
          <p><strong>Organización:</strong> {{ projectInfo.organizacion?.nombre }}</p>
          
          <!-- Ejemplo de StatusBadge -->
          <div class="mt-3">
            <StatusBadge
              state-type="project"
              :state-id="projectInfo.estado?.id_estado || 1"
              class="mr-2"
            />
            <StatusBadge
              state-type="task"
              :state-id="2"
              size="small"
              class="mr-2"
            />
            <StatusBadge
              state-type="application"
              state-id="aprobada"
              variant="outlined"
            />
          </div>
          
          <!-- Ejemplo de StateTransitionSelect -->
          <div class="mt-4">
            <StateTransitionSelect
              v-model="selectedNewState"
              state-type="project"
              :current-state-id="projectInfo.estado?.id_estado || 1"
              label="Cambiar estado del proyecto"
              @state-changed="handleStateChange"
              class="max-width-300"
            />
          </div>
          
          <!-- Botones de acción con contexto -->
          <div class="mt-4">
            <v-btn
              color="primary"
              variant="outlined"
              @click="doSomethingWithProject"
              class="mr-2"
            >
              <v-icon start>mdi-cog</v-icon>
              Acción con Proyecto
            </v-btn>
            
            <v-btn
              color="success"
              variant="outlined"
              @click="reloadProjectData"
            >
              <v-icon start>mdi-refresh</v-icon>
              Recargar
            </v-btn>
          </div>
        </div>
        
        <div v-else-if="loading">
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
          <p class="text-center mt-2">Cargando proyecto...</p>
        </div>
        
        <div v-else-if="error">
          <v-alert type="error" variant="tonal">
            {{ error }}
          </v-alert>
        </div>
        
        <div v-else>
          <v-alert type="warning" variant="tonal">
            No hay proyecto disponible en el contexto
          </v-alert>
        </div>
      </v-card-text>
    </v-card>

    <!-- Ejemplo de validación con contexto -->
    <v-card rounded="lg">
      <v-card-title>
        <v-icon class="mr-2" color="warning">mdi-shield-check</v-icon>
        Validaciones con Contexto
      </v-card-title>
      <v-card-text>
        <v-btn
          color="info"
          variant="outlined"
          @click="testValidations"
          class="mr-2"
        >
          <v-icon start>mdi-test-tube</v-icon>
          Probar Validaciones
        </v-btn>
        
        <v-btn
          color="warning"
          variant="outlined"
          @click="testProjectRequirement"
        >
          <v-icon start>mdi-alert</v-icon>
          Probar Requerimiento
        </v-btn>
        
        <div v-if="validationResults.length > 0" class="mt-4">
          <h4 class="text-subtitle-1 mb-2">Resultados de Validación:</h4>
          <v-chip
            v-for="(result, index) in validationResults"
            :key="index"
            :color="result.success ? 'success' : 'error'"
            variant="tonal"
            size="small"
            class="mr-1 mb-1"
          >
            {{ result.message }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCurrentProject, useProjectValidation } from '@/composables/useProjectContext';
import { useNotifications } from '@/composables/useNotifications';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import StateTransitionSelect from '@/components/ui/StateTransitionSelect.vue';

// Composables
const {
  project,
  projectId,
  loading,
  error,
  isValid: hasValidProject,
  info: projectInfo,
  reload: reloadProjectData
} = useCurrentProject();

const {
  validateProjectId,
  validateProject,
  withProject,
  isValid: isProjectValid
} = useProjectValidation();

const { showSuccess, showError, showInfo } = useNotifications();

// Reactive data
const selectedNewState = ref(null);
const validationResults = ref([]);

// Methods
const handleStateChange = (stateChange) => {
  showInfo(`Estado cambiado de ${stateChange.fromState.label} a ${stateChange.toState.label}`);
  console.log('State change:', stateChange);
};

const doSomethingWithProject = () => {
  try {
    withProject((project, id) => {
      showSuccess(`Ejecutando acción en proyecto: ${project.nombre} (ID: ${id})`);
      console.log('Project action executed:', { project, id });
    });
  } catch (error) {
    showError(error.message);
  }
};

const testValidations = () => {
  validationResults.value = [];
  
  try {
    const id = validateProjectId();
    validationResults.value.push({
      success: true,
      message: `ID válido: ${id}`
    });
  } catch (error) {
    validationResults.value.push({
      success: false,
      message: `ID inválido: ${error.message}`
    });
  }
  
  try {
    const { project, id } = validateProject();
    validationResults.value.push({
      success: true,
      message: `Proyecto válido: ${project.nombre}`
    });
  } catch (error) {
    validationResults.value.push({
      success: false,
      message: `Proyecto inválido: ${error.message}`
    });
  }
  
  validationResults.value.push({
    success: isProjectValid.value,
    message: `Contexto válido: ${isProjectValid.value ? 'Sí' : 'No'}`
  });
};

const testProjectRequirement = () => {
  try {
    withProject((project, id) => {
      showSuccess(`Proyecto requerido exitosamente: ${project.nombre}`);
    });
  } catch (error) {
    showError(`Error de requerimiento: ${error.message}`);
  }
};
</script>

<style scoped>
.project-context-example {
  max-width: 800px;
  margin: 0 auto;
}

.max-width-300 {
  max-width: 300px;
}
</style>
