import { ref, computed, provide, inject, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';

// Symbol para el contexto del proyecto
const PROJECT_CONTEXT_KEY = Symbol('project-context');

/**
 * Composable para proporcionar contexto del proyecto
 * Debe usarse en el componente padre (ej: ProjectDetailView)
 */
export function useProjectProvider() {
  const route = useRoute();
  const projectStore = useProjectStore();
  
  // Estado del contexto
  const currentProject = ref(null);
  const projectId = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Computed para obtener el ID del proyecto de forma consistente
  const resolvedProjectId = computed(() => {
    // Prioridad de fuentes:
    // 1. Parámetro explícito
    // 2. Parámetro de ruta
    // 3. Proyecto actual cargado
    return projectId.value || 
           parseInt(route.params.id) || 
           currentProject.value?.id_proyecto || 
           currentProject.value?.id ||
           null;
  });

  // Computed para verificar si tenemos un proyecto válido
  const hasValidProject = computed(() => {
    return resolvedProjectId.value && currentProject.value;
  });

  // Computed para información básica del proyecto
  const projectInfo = computed(() => {
    if (!currentProject.value) return null;
    
    return {
      id: resolvedProjectId.value,
      nombre: currentProject.value.nombre,
      descripcion: currentProject.value.descripcion,
      estado: currentProject.value.estado,
      organizacion: currentProject.value.organizacion,
      fechas: {
        inicio: currentProject.value.fecha_inicio,
        fin: currentProject.value.fecha_fin
      }
    };
  });

  // Función para cargar el proyecto
  const loadProject = async (id = null) => {
    const targetId = id || resolvedProjectId.value;
    
    if (!targetId) {
      error.value = 'No se pudo determinar el ID del proyecto';
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      const project = await projectStore.fetchProjectById(targetId);
      currentProject.value = project;
      projectId.value = targetId;
      return true;
    } catch (err) {
      console.error('Error loading project:', err);
      error.value = err.message || 'Error al cargar el proyecto';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Función para actualizar el proyecto
  const updateProject = (updatedProject) => {
    if (updatedProject && updatedProject.id_proyecto === resolvedProjectId.value) {
      currentProject.value = updatedProject;
    }
  };

  // Función para limpiar el contexto
  const clearProject = () => {
    currentProject.value = null;
    projectId.value = null;
    error.value = null;
  };

  // Watch para cambios en la ruta
  watch(() => route.params.id, (newId) => {
    if (newId && parseInt(newId) !== resolvedProjectId.value) {
      loadProject(parseInt(newId));
    }
  }, { immediate: true });

  // Contexto a proporcionar
  const context = {
    // Estado
    currentProject: computed(() => currentProject.value),
    projectId: resolvedProjectId,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    hasValidProject,
    projectInfo,
    
    // Métodos
    loadProject,
    updateProject,
    clearProject,
    
    // Utilidades
    requireProject: (callback) => {
      if (!hasValidProject.value) {
        throw new Error('Proyecto requerido pero no disponible');
      }
      return callback(currentProject.value, resolvedProjectId.value);
    }
  };

  // Proporcionar el contexto
  provide(PROJECT_CONTEXT_KEY, context);

  return context;
}

/**
 * Composable para consumir el contexto del proyecto
 * Debe usarse en componentes hijos
 */
export function useProjectContext() {
  const context = inject(PROJECT_CONTEXT_KEY);
  
  if (!context) {
    throw new Error('useProjectContext debe usarse dentro de un ProjectProvider');
  }
  
  return context;
}

/**
 * Hook especializado para obtener solo el proyecto actual
 * Versión simplificada para casos comunes
 */
export function useCurrentProject() {
  const context = useProjectContext();
  
  return {
    project: context.currentProject,
    projectId: context.projectId,
    loading: context.loading,
    error: context.error,
    isValid: context.hasValidProject,
    info: context.projectInfo,
    reload: context.loadProject,
    require: context.requireProject
  };
}

/**
 * Hook para validaciones que requieren proyecto
 */
export function useProjectValidation() {
  const { projectId, hasValidProject, requireProject } = useProjectContext();
  
  const validateProjectId = () => {
    if (!projectId.value) {
      throw new Error('ID del proyecto no disponible');
    }
    return projectId.value;
  };

  const validateProject = () => {
    if (!hasValidProject.value) {
      throw new Error('Proyecto no cargado o inválido');
    }
    return requireProject((project, id) => ({ project, id }));
  };

  const withProject = (callback) => {
    return requireProject(callback);
  };

  return {
    validateProjectId,
    validateProject,
    withProject,
    isValid: hasValidProject
  };
}
