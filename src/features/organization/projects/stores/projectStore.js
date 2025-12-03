import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '@/plugins/axios';
import defaultCoverImage from '@/assets/images/background_login.png';

export const useProjectStore = defineStore('project', () => {
  // State
  const allProjects = ref([]);
  const mainProjectId = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const lastFetch = ref(null);
  const CACHE_TIME = 30000; // 30 segundos de caché

  // Getters
  const projects = computed(() => allProjects.value);
  const getProjectById = computed(() => (id) => allProjects.value.find(p => p.id === id));
  const mainProject = computed(() => {
    if (!mainProjectId.value) {
      return allProjects.value.length > 0 ? allProjects.value[0] : null;
    }
    return allProjects.value.find(p => p.id === mainProjectId.value);
  });

  // Helper function to map backend project data to frontend format
  function mapProjectData(project) {
    return {
      id: project.id_proyecto,
      name: project.nombre,
      description: project.descripcion,
      objective: project.objetivo,
      location: project.ubicacion,
      startDate: project.fecha_inicio,
      endDate: project.fecha_fin,
      coverImage: (project.imagen_principal && project.imagen_principal !== '/assets/images/background_login.png') 
        ? project.imagen_principal 
        : defaultCoverImage,
      document: project.documento,
      budget: project.presupuesto_total || 0,
      statusId: project.id_estado,
      id_estado: project.id_estado, // Add this for compatibility
      categoria: project.categoria || null,
      es_publico: project.es_publico !== undefined ? project.es_publico : false,
      isPublic: project.es_publico !== undefined ? project.es_publico : false,
      requisitos: project.requisitos || null,
      organizationId: project.id_organizacion,
      createdAt: project.creado_en,
      updatedAt: project.actualizado_en,
      // Beneficios del proyecto
      beneficio: project.beneficio ? {
        id: project.beneficio.id_proyecto_beneficio,
        tipo_pago: project.beneficio.tipo_pago,
        monto: project.beneficio.monto,
        frecuencia: project.beneficio.frecuencia,
        descripcion_pago: project.beneficio.descripcion_pago,
        incluye_transporte: project.beneficio.incluye_transporte,
        incluye_alimentacion: project.beneficio.incluye_alimentacion,
        incluye_materiales: project.beneficio.incluye_materiales,
        incluye_seguro: project.beneficio.incluye_seguro
      } : null,
      // Relations
      organization: project.organizacion,
      estado: project.estado,
      phases: (project.fases || []).map(phase => ({
        id: phase.id_fase,
        name: phase.nombre, // Frontend uses 'name'
        nombre: phase.nombre, // Backend uses 'nombre'
        description: phase.descripcion, // Frontend uses 'description'
        descripcion: phase.descripcion, // Backend uses 'descripcion'
        orden: phase.orden,
        fecha_inicio: phase.fecha_inicio,
        fecha_fin: phase.fecha_fin,
        id_proyecto: phase.id_proyecto,
        tareas: (phase.tareas || []).map(task => ({
          id: task.id_tarea,
          descripcion: task.descripcion,
          fecha_inicio: task.fecha_inicio,
          fecha_fin: task.fecha_fin,
          prioridad: task.prioridad,
          complejidad: task.complejidad,
          id_estado: task.id_estado,
          id_fase: task.id_fase,
          observaciones: task.observaciones,
          creado_en: task.creado_en,
          actualizado_en: task.actualizado_en,
          // Incluir asignaciones con relaciones
          asignaciones: (task.asignaciones || []).map(asignacion => ({
            id_asignacion: asignacion.id_asignacion,
            id_tarea: asignacion.id_tarea,
            id_voluntario: asignacion.id_voluntario,
            id_rol: asignacion.id_rol,
            voluntario: asignacion.voluntario ? {
              id_voluntario: asignacion.voluntario.id_voluntario,
              nombre: asignacion.voluntario.usuario?.nombre || 'Voluntario',
              email: asignacion.voluntario.usuario?.email || '',
              usuario: asignacion.voluntario.usuario
            } : null,
            rol: asignacion.rol ? {
              id_rol: asignacion.rol.id_rol,
              nombre: asignacion.rol.nombre,
              descripcion: asignacion.rol.descripcion,
              tipo_rol: asignacion.rol.tipo_rol
            } : null
          }))
        }))
      })),
      // Legacy fields for compatibility
      ...project
    };
  }

  // Helper function to parse error messages
  function getErrorMessage(err) {
    if (!err) return 'Error desconocido';
    
    // Network errors
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return 'Tiempo de espera agotado. Verifica tu conexión a internet.';
    }
    
    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
      return 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.';
    }
    
    // HTTP errors
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || err.response.data?.error;
      
      switch (status) {
        case 401:
          return 'No autorizado. Por favor, inicia sesión nuevamente.';
        case 403:
          return 'No tienes permisos para acceder a esta información.';
        case 404:
          return 'No se encontraron proyectos.';
        case 500:
        case 502:
        case 503:
          return 'Error del servidor. Por favor, intenta más tarde.';
        default:
          return message || `Error ${status}: No se pudieron cargar los proyectos.`;
      }
    }
    
    // Default error message
    return err.message || 'Error al cargar los proyectos. Por favor, intenta nuevamente.';
  }

  // Actions
  async function fetchProjects(forceRefresh = false) {
    // Verificar si hay datos en caché válidos
    if (!forceRefresh && allProjects.value.length > 0 && lastFetch.value) {
      const timeSinceLastFetch = Date.now() - lastFetch.value;
      if (timeSinceLastFetch < CACHE_TIME) {
        console.log('📦 Using cached projects data');
        return allProjects.value;
      }
    }

    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/projects', {
        timeout: 10000 // 10 seconds timeout
      });
      
      // Validate response data
      if (!response.data) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Ensure it's an array
      const projectsData = Array.isArray(response.data) ? response.data : [];
      
      // Map and validate each project
      allProjects.value = projectsData.map(project => {
        try {
          return mapProjectData(project);
        } catch (mapErr) {
          console.warn('Error mapping project:', mapErr, project);
          return null;
        }
      }).filter(project => project !== null); // Remove invalid projects
      
      // Actualizar timestamp del último fetch
      lastFetch.value = Date.now();
      
      // Clear error on success
      error.value = null;
      
      console.log('✅ Projects fetched from API');
      return allProjects.value;
    } catch (err) {
      console.error('Error fetching projects:', err);
      error.value = getErrorMessage(err);
      
      // Don't clear projects on error if we have cached data
      // Only clear if it's a critical error
      if (err.response?.status === 401 || err.response?.status === 403) {
        allProjects.value = [];
        lastFetch.value = null;
      }
      // For other errors, keep existing projects if available
    } finally {
      loading.value = false;
    }
  }

  async function fetchProjectById(id) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get(`/projects/${id}`);
      const project = mapProjectData(response.data);
      
      const index = allProjects.value.findIndex(p => p.id === id);
      if (index !== -1) {
        // Actualizar el proyecto existente con una nueva referencia para forzar reactividad
        allProjects.value[index] = { ...project };
      } else {
        allProjects.value.push(project);
      }
      
      invalidateCache(); // Invalidar caché al obtener proyecto individual
      // Devolver una nueva referencia para asegurar reactividad
      return { ...project };
    } catch (err) {
      console.error(`Error fetching project with id ${id}:`, err);
      error.value = 'Failed to fetch project details. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  function setMainProject(projectId) {
    mainProjectId.value = projectId;
  }

  async function addProject(newProjectData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/projects', newProjectData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const project = mapProjectData(response.data);
      allProjects.value.push(project);
      invalidateCache(); // Invalidar caché al crear proyecto
      return project;
    } catch (err) {
      console.error('Error creating project:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al crear el proyecto. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function updateProject(projectId, updatedProjectData) {
    loading.value = true;
    error.value = null;
    
    try {
      // Convert frontend format to backend format
      const backendData = {
        nombre: updatedProjectData.nombre || updatedProjectData.name,
        descripcion: updatedProjectData.descripcion || updatedProjectData.description,
        objetivo: updatedProjectData.objetivo || updatedProjectData.objective,
        ubicacion: updatedProjectData.ubicacion || updatedProjectData.location,
        fecha_inicio: updatedProjectData.fecha_inicio || updatedProjectData.startDate,
        fecha_fin: updatedProjectData.fecha_fin || updatedProjectData.endDate,
        presupuesto_total: updatedProjectData.presupuesto_total || updatedProjectData.budget,
        id_estado: updatedProjectData.id_estado,
        es_publico: updatedProjectData.es_publico !== undefined ? updatedProjectData.es_publico : false,
        categoria: updatedProjectData.categoria || null,
        requisitos: updatedProjectData.requisitos || null,
        imagen_principal: updatedProjectData.imagen_principal || null,
        documento: updatedProjectData.documento || null
      };

      const response = await axios.patch(`/projects/${projectId}`, backendData, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      const updatedProject = mapProjectData(response.data);
      const index = allProjects.value.findIndex(p => p.id === projectId);
      if (index !== -1) {
        allProjects.value[index] = updatedProject;
      } else {
        allProjects.value.push(updatedProject);
      }
      
      invalidateCache(); // Invalidar caché al actualizar proyecto
      return updatedProject;
    } catch (err) {
      console.error(`Error updating project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al actualizar el proyecto. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function deleteProject(projectId) {
    loading.value = true;
    error.value = null;
    
    try {
      await axios.delete(`/projects/${projectId}`);
      allProjects.value = allProjects.value.filter(p => p.id !== projectId);
      invalidateCache(); // Invalidar caché al eliminar proyecto
      return true;
    } catch (err) {
      console.error(`Error deleting project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al eliminar el proyecto. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function addProjectPhase(projectId, phaseData) {
    loading.value = true;
    error.value = null;
    
    try {
      // Ensure phaseData has required fields
      const cleanPhaseData = {
        nombre: phaseData.nombre || phaseData.name || '',
        descripcion: phaseData.descripcion || phaseData.description || '',
        orden: phaseData.orden || phaseData.order || 1
      };
      
      console.log(`Adding phase to project ${projectId}:`, cleanPhaseData);
      
      const response = await axios.post(`/projects/${projectId}/phases`, cleanPhaseData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Update the project in the store with the new phases
      const project = allProjects.value.find(p => p.id === projectId);
      if (project && response.data) {
        // If response.data is the full project, update it
        if (response.data.id_proyecto || response.data.id) {
          const updatedProject = mapProjectData(response.data);
          const index = allProjects.value.findIndex(p => p.id === projectId);
          if (index !== -1) {
            allProjects.value[index] = updatedProject;
          }
        } else if (response.data.phases) {
          // If response only has phases, update just the phases
          project.phases = response.data.phases.map(phase => ({
            id: phase.id_fase,
            nombre: phase.nombre,
            descripcion: phase.descripcion,
            orden: phase.orden,
            id_proyecto: phase.id_proyecto
          }));
      }
      }
      
      return response.data;
    } catch (err) {
      console.error(`Error adding phase to project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to add project phase. Please try again later.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function updateProjectPhase(projectId, phaseId, updatedPhase) {
    loading.value = true;
    error.value = null;
    
    try {
      // Convert frontend format to backend format
      const backendData = {
        nombre: updatedPhase.nombre || updatedPhase.name,
        descripcion: updatedPhase.descripcion || updatedPhase.description,
        orden: updatedPhase.orden || updatedPhase.order
      };

      const response = await axios.put(`/projects/${projectId}/phases/${phaseId}`, backendData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh project data to get updated phases
      const updatedProject = mapProjectData(response.data);
      const projectIndex = allProjects.value.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        allProjects.value[projectIndex] = updatedProject;
        }
      
      return updatedProject;
    } catch (err) {
      console.error(`Error updating phase ${phaseId} in project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al actualizar la fase. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function reorderProjectPhases(projectId, newOrder) {
    loading.value = true;
    error.value = null;
    
    try {
      // El backend espera un array de { id_fase, orden }
      const response = await axios.post(`/fase/proyecto/${projectId}/reorder`, newOrder, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // El backend devuelve las fases actualizadas
      // Necesitamos refrescar el proyecto completo para obtener las fases actualizadas
      await fetchProjectById(projectId);
      
      return response.data;
    } catch (err) {
      console.error(`Error reordering phases in project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al reordenar las fases. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function deleteProjectPhase(projectId, phaseId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.delete(`/projects/${projectId}/phases/${phaseId}`);
      
      // Refresh project data to get updated phases
      const updatedProject = mapProjectData(response.data);
      const projectIndex = allProjects.value.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        allProjects.value[projectIndex] = updatedProject;
      }
      
      return updatedProject;
    } catch (err) {
      console.error(`Error deleting phase ${phaseId} from project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al eliminar la fase. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function addProjectTask(projectId, taskData) {
    loading.value = true;
    error.value = null;
    
    try {
      // Convert frontend format to backend format
      const backendData = {
        descripcion: taskData.descripcion || taskData.description,
        fecha_inicio: taskData.fecha_inicio || taskData.startDate,
        fecha_fin: taskData.fecha_fin || taskData.endDate,
        prioridad: taskData.prioridad || taskData.priority || 'Media',
        complejidad: taskData.complejidad || taskData.complexity || 'Media',
        id_estado: taskData.id_estado || taskData.statusId || 1,
        id_fase: taskData.id_fase || taskData.phaseId
      };

      const response = await axios.post(`/projects/${projectId}/tasks`, backendData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh project data to get updated tasks
      const updatedProject = mapProjectData(response.data);
      const projectIndex = allProjects.value.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        allProjects.value[projectIndex] = updatedProject;
      } else {
        allProjects.value.push(updatedProject);
      }
      
      return updatedProject;
    } catch (err) {
      console.error(`Error adding task to project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al crear la tarea. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function updateProjectTask(projectId, taskId, updatedTask) {
    loading.value = true;
    error.value = null;
    
    try {
      // Convert frontend format to backend format
      const backendData = {
        descripcion: updatedTask.descripcion || updatedTask.description,
        fecha_inicio: updatedTask.fecha_inicio || updatedTask.startDate,
        fecha_fin: updatedTask.fecha_fin || updatedTask.endDate,
        prioridad: updatedTask.prioridad || updatedTask.priority,
        complejidad: updatedTask.complejidad || updatedTask.complexity,
        id_estado: updatedTask.id_estado || updatedTask.statusId,
        id_fase: updatedTask.id_fase || updatedTask.phaseId
      };

      const response = await axios.put(`/projects/${projectId}/tasks/${taskId}`, backendData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh project data to get updated tasks
      const updatedProject = mapProjectData(response.data);
      const projectIndex = allProjects.value.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        allProjects.value[projectIndex] = updatedProject;
      }
      
      return updatedProject;
    } catch (err) {
      console.error(`Error updating task ${taskId} in project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al actualizar la tarea. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function deleteProjectTask(projectId, taskId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.delete(`/projects/${projectId}/tasks/${taskId}`);
      
      // Refresh project data to get updated tasks
      const updatedProject = mapProjectData(response.data);
      const projectIndex = allProjects.value.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        allProjects.value[projectIndex] = updatedProject;
      }
      
      return updatedProject;
    } catch (err) {
      console.error(`Error deleting task ${taskId} from project with id ${projectId}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al eliminar la tarea. Por favor, inténtalo de nuevo.';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function assignVolunteerToTask(projectId, taskId, volunteerId, roleName) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post(`/projects/${projectId}/tasks/${taskId}/assign`, {
        volunteerId,
        roleName
      });
      const project = allProjects.value.find(p => p.id === projectId);
      if (project) {
        const taskIndex = project.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          project.tasks[taskIndex] = response.data.task;
        }
      }
      return response.data;
    } catch (err) {
      console.error(`Error assigning volunteer to task ${taskId} in project with id ${projectId}:`, err);
      error.value = 'Failed to assign volunteer to task. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function unassignVolunteerFromTask(projectId, taskId, assignmentId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.delete(`/projects/${projectId}/tasks/${taskId}/assignments/${assignmentId}`);
      const project = allProjects.value.find(p => p.id === projectId);
      if (project) {
        const taskIndex = project.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          project.tasks[taskIndex] = response.data.task;
        }
      }
      return response.data;
    } catch (err) {
      console.error(`Error unassigning volunteer from task ${taskId} in project with id ${projectId}:`, err);
      error.value = 'Failed to unassign volunteer from task. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Función para invalidar el caché
  function invalidateCache() {
    lastFetch.value = null;
    console.log('🔄 Cache invalidated');
  }

  return {
    // State
    allProjects,
    mainProjectId,
    loading,
    error,
    lastFetch,
    // Getters
    projects,
    getProjectById,
    mainProject,
    // Actions
    fetchProjects,
    fetchProjectById,
    setMainProject,
    addProject,
    updateProject,
    deleteProject,
    invalidateCache,
    // Phase management (legacy methods)
    addProjectPhase,
    updateProjectPhase,
    reorderProjectPhases,
    deleteProjectPhase,
    // Task management (legacy methods)
    addProjectTask,
    updateProjectTask,
    deleteProjectTask,
    // Volunteer assignment
    assignVolunteerToTask,
    unassignVolunteerFromTask,
  };
});