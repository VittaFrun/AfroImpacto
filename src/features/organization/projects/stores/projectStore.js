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
      coverImage: project.imagen_principal || defaultCoverImage,
      document: project.documento,
      budget: project.presupuesto_total || 0,
      statusId: project.id_estado,
      id_estado: project.id_estado, // Add this for compatibility
      organizationId: project.id_organizacion,
      createdAt: project.creado_en,
      updatedAt: project.actualizado_en,
      // Relations
      organization: project.organizacion,
      estado: project.estado,
      phases: (project.fases || []).map(phase => ({
        id: phase.id_fase,
        nombre: phase.nombre,
        descripcion: phase.descripcion,
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
          actualizado_en: task.actualizado_en
        }))
      })),
      // Legacy fields for compatibility
      ...project
    };
  }

  // Actions
  async function fetchProjects() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/projects');
      allProjects.value = response.data.map(mapProjectData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      error.value = 'Failed to fetch projects. Please try again later.';
      allProjects.value = [];
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
        allProjects.value[index] = project;
      } else {
        allProjects.value.push(project);
      }
      
      return project;
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
      return project;
    } catch (err) {
      console.error('Error creating project:', err);
      error.value = 'Failed to create project. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateProject(projectId, updatedProjectData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post(`/projects/${projectId}`, updatedProjectData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      const project = {
        ...response.data,
        coverImage: response.data.coverImage || defaultCoverImage
      };
      
      const index = allProjects.value.findIndex(p => p.id === projectId);
      if (index !== -1) {
        allProjects.value[index] = project;
      }
      
      return project;
    } catch (err) {
      console.error(`Error updating project with id ${projectId}:`, err);
      error.value = 'Failed to update project. Please try again later.';
      return null;
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
      return true;
    } catch (err) {
      console.error(`Error deleting project with id ${projectId}:`, err);
      error.value = 'Failed to delete project. Please try again later.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function addProjectPhase(projectId, phaseData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post(`/projects/${projectId}/phases`, phaseData);
      const project = allProjects.value.find(p => p.id === projectId);
      if (project) {
        project.phases = response.data.phases;
      }
      return response.data;
    } catch (err) {
      console.error(`Error adding phase to project with id ${projectId}:`, err);
      error.value = 'Failed to add project phase. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateProjectPhase(projectId, phaseId, updatedPhase) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.put(`/projects/${projectId}/phases/${phaseId}`, updatedPhase);
      const project = allProjects.value.find(p => p.id === projectId);
      if (project) {
        const index = project.phases.findIndex(ph => ph.id === phaseId);
        if (index !== -1) {
          project.phases[index] = response.data;
        }
      }
      return response.data;
    } catch (err) {
      console.error(`Error updating phase ${phaseId} in project with id ${projectId}:`, err);
      error.value = 'Failed to update project phase. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProjectPhase(projectId, phaseId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.delete(`/projects/${projectId}/phases/${phaseId}`);
      const project = allProjects.value.find(p => p.id === projectId);
      if (project) {
        project.phases = response.data.phases;
      }
      return response.data;
    } catch (err) {
      console.error(`Error deleting phase ${phaseId} from project with id ${projectId}:`, err);
      error.value = 'Failed to delete project phase. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function addProjectTask(projectId, phaseId, taskData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post(`/projects/${projectId}/tasks`, { ...taskData, phaseId });
      const project = allProjects.value.find(p => p.id === projectId);
      if (project) {
        project.tasks = response.data.tasks;
        project.phases = response.data.phases;
      }
      return response.data;
    } catch (err) {
      console.error(`Error adding task to project with id ${projectId}:`, err);
      error.value = 'Failed to add project task. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateProjectTask(projectId, taskId, updatedTask) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.put(`/projects/${projectId}/tasks/${taskId}`, updatedTask);
      const project = allProjects.value.find(p => p.id === projectId);
      if (project) {
        const index = project.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          project.tasks[index] = response.data.task;
        }
        project.phases = response.data.phases;
      }
      return response.data;
    } catch (err) {
      console.error(`Error updating task ${taskId} in project with id ${projectId}:`, err);
      error.value = 'Failed to update project task. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProjectTask(projectId, taskId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.delete(`/projects/${projectId}/tasks/${taskId}`);
      const project = allProjects.value.find(p => p.id === projectId);
      if (project) {
        project.tasks = response.data.tasks;
        project.phases = response.data.phases;
      }
      return response.data;
    } catch (err) {
      console.error(`Error deleting task ${taskId} from project with id ${projectId}:`, err);
      error.value = 'Failed to delete project task. Please try again later.';
      return null;
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

  return {
    // State
    allProjects,
    mainProjectId,
    loading,
    error,
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
    // Phase management (legacy methods)
    addProjectPhase,
    updateProjectPhase,
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