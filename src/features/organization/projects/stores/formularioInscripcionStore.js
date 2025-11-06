import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/plugins/axios';
import { useNotificationStore } from '@/stores/notificationStore';

export const useFormularioInscripcionStore = defineStore('formularioInscripcion', () => {
  const notificationStore = useNotificationStore();
  const loading = ref(false);
  const error = ref(null);
  const camposFormulario = ref([]);

  async function fetchByProject(projectId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get(`/formulario-inscripcion/proyecto/${projectId}/activos`);
      camposFormulario.value = response.data;
      return response.data;
    } catch (err) {
      console.error('Error fetching formulario campos:', err);
      const errorMessage = err.response?.data?.message || 'Error al obtener los campos del formulario';
      error.value = errorMessage;
      // No mostrar error si no hay campos, es opcional
      if (err.response?.status !== 404) {
        notificationStore.showSnackbar(errorMessage, 'error');
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchByOrganization(organizationId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get(`/formulario-inscripcion/organizacion/${organizationId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching formulario campos by organization:', err);
      const errorMessage = err.response?.data?.message || 'Error al obtener los campos del formulario';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createCampo(campoData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/formulario-inscripcion', campoData);
      notificationStore.showSnackbar('Campo de formulario creado correctamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error creating formulario campo:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear el campo del formulario';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateCampo(campoId, campoData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.patch(`/formulario-inscripcion/${campoId}`, campoData);
      notificationStore.showSnackbar('Campo de formulario actualizado correctamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error updating formulario campo:', err);
      const errorMessage = err.response?.data?.message || 'Error al actualizar el campo del formulario';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCampo(campoId) {
    loading.value = true;
    error.value = null;
    
    try {
      await api.delete(`/formulario-inscripcion/${campoId}`);
      notificationStore.showSnackbar('Campo de formulario eliminado correctamente', 'success');
      return true;
    } catch (err) {
      console.error('Error deleting formulario campo:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar el campo del formulario';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function reorderCampos(projectId, ordenes) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.put(`/formulario-inscripcion/reorder/${projectId}`, ordenes);
      camposFormulario.value = response.data;
      notificationStore.showSnackbar('Campos reordenados correctamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error reordering formulario campos:', err);
      const errorMessage = err.response?.data?.message || 'Error al reordenar los campos';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    camposFormulario,
    fetchByProject,
    fetchByOrganization,
    createCampo,
    updateCampo,
    deleteCampo,
    reorderCampos
  };
});

