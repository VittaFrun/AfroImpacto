import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/plugins/axios';
import { useNotificationStore } from '@/stores/notificationStore';

export const useProyectoBeneficioStore = defineStore('proyectoBeneficio', () => {
  const notificationStore = useNotificationStore();
  const loading = ref(false);
  const error = ref(null);

  async function getBeneficioByProject(projectId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get(`/proyecto-beneficio/${projectId}`);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null; // No existe beneficio aún
      }
      console.error('Error fetching proyecto beneficio:', err);
      const errorMessage = err.response?.data?.message || 'Error al obtener los beneficios del proyecto';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createBeneficio(beneficioData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/proyecto-beneficio', beneficioData);
      notificationStore.showSnackbar('Beneficios creados correctamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error creating proyecto beneficio:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear los beneficios del proyecto';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateBeneficio(projectId, beneficioData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.patch(`/proyecto-beneficio/${projectId}`, beneficioData);
      notificationStore.showSnackbar('Beneficios actualizados correctamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error updating proyecto beneficio:', err);
      const errorMessage = err.response?.data?.message || 'Error al actualizar los beneficios del proyecto';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteBeneficio(projectId) {
    loading.value = true;
    error.value = null;
    
    try {
      await api.delete(`/proyecto-beneficio/${projectId}`);
      notificationStore.showSnackbar('Beneficios eliminados correctamente', 'success');
      return true;
    } catch (err) {
      console.error('Error deleting proyecto beneficio:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar los beneficios del proyecto';
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
    getBeneficioByProject,
    createBeneficio,
    updateBeneficio,
    deleteBeneficio
  };
});

