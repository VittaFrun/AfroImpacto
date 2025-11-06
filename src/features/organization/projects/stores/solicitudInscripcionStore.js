import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/plugins/axios';
import { useNotificationStore } from '@/stores/notificationStore';

export const useSolicitudInscripcionStore = defineStore('solicitudInscripcion', () => {
  const notificationStore = useNotificationStore();
  const loading = ref(false);
  const error = ref(null);
  const allSolicitudes = ref([]);

  async function fetchByProject(projectId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get(`/solicitud-inscripcion/proyecto/${projectId}`);
      allSolicitudes.value = response.data;
      return response.data;
    } catch (err) {
      console.error('Error fetching solicitudes:', err);
      const errorMessage = err.response?.data?.message || 'Error al obtener las solicitudes';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchByVolunteer(volunteerId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get(`/solicitud-inscripcion/voluntario/${volunteerId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching solicitudes by volunteer:', err);
      const errorMessage = err.response?.data?.message || 'Error al obtener las solicitudes';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createSolicitud(solicitudData, files = []) {
    loading.value = true;
    error.value = null;
    
    try {
      const formData = new FormData();
      
      // Agregar campos del formulario
      Object.keys(solicitudData).forEach(key => {
        if (key !== 'documentos' && key !== 'camposPersonalizados') {
          formData.append(key, solicitudData[key]);
        }
      });

      // Agregar campos personalizados como JSON
      if (solicitudData.camposPersonalizados) {
        formData.append('camposPersonalizados', JSON.stringify(solicitudData.camposPersonalizados));
      }

      // Agregar archivos
      files.forEach((file, index) => {
        formData.append('documentos', file);
      });

      const response = await api.post('/solicitud-inscripcion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      notificationStore.showSnackbar('Solicitud enviada correctamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error creating solicitud:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear la solicitud';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateSolicitud(solicitudId, updateData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.patch(`/solicitud-inscripcion/${solicitudId}`, updateData);
      
      // Actualizar en la lista local
      const index = allSolicitudes.value.findIndex(s => s.id_solicitud === solicitudId);
      if (index !== -1) {
        allSolicitudes.value[index] = response.data;
      }
      
      notificationStore.showSnackbar('Solicitud actualizada correctamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error updating solicitud:', err);
      const errorMessage = err.response?.data?.message || 'Error al actualizar la solicitud';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteSolicitud(solicitudId) {
    loading.value = true;
    error.value = null;
    
    try {
      await api.delete(`/solicitud-inscripcion/${solicitudId}`);
      
      // Remover de la lista local
      allSolicitudes.value = allSolicitudes.value.filter(s => s.id_solicitud !== solicitudId);
      
      notificationStore.showSnackbar('Solicitud eliminada correctamente', 'success');
      return true;
    } catch (err) {
      console.error('Error deleting solicitud:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar la solicitud';
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
    allSolicitudes,
    fetchByProject,
    fetchByVolunteer,
    createSolicitud,
    updateSolicitud,
    deleteSolicitud
  };
});

