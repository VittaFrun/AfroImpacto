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

  // Actions
  async function fetchProjects() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/projects');
      allProjects.value = response.data.map(project => ({
        ...project,
        coverImage: project.coverImage || defaultCoverImage
      }));
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
      const project = {
        ...response.data,
        coverImage: response.data.coverImage || defaultCoverImage
      };
      
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
          'Content-Type': 'multipart/form-data'
        }
      });
      const project = {
        ...response.data,
        coverImage: response.data.coverImage || defaultCoverImage
      };
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
    allProjects,
    projects,
    getProjectById,
    mainProject,
    loading,
    error,
    setMainProject,
    fetchProjects,
    fetchProjectById,
    addProject,
    updateProject,
    deleteProject,
    addProjectPhase,
    updateProjectPhase,
    deleteProjectPhase,
    addProjectTask,
    updateProjectTask,
    deleteProjectTask,
    assignVolunteerToTask,
    unassignVolunteerFromTask,
  };
});