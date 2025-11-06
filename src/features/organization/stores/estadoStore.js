import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '@/plugins/axios';

export const useEstadoStore = defineStore('estado', () => {
  // State
  const estados = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const allEstados = computed(() => estados.value);
  
  const getEstadoById = computed(() => (id) => {
    return estados.value.find(e => e.id_estado === id);
  });

  // Actions
  async function fetchEstados() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/estado');
      estados.value = response.data || [];
      return estados.value;
    } catch (err) {
      console.error('Error fetching estados:', err);
      error.value = err.response?.data?.message || 'Error al cargar los estados';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createEstado(estadoData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/estado', estadoData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      estados.value.push(response.data);
      return response.data;
    } catch (err) {
      console.error('Error creating estado:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al crear el estado';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function updateEstado(id, estadoData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.patch(`/estado/${id}`, estadoData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const index = estados.value.findIndex(e => e.id_estado === id);
      if (index !== -1) {
        estados.value[index] = { ...estados.value[index], ...response.data };
      }
      
      return response.data;
    } catch (err) {
      console.error(`Error updating estado with id ${id}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al actualizar el estado';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  async function deleteEstado(id) {
    loading.value = true;
    error.value = null;
    
    try {
      await axios.delete(`/estado/${id}`);
      estados.value = estados.value.filter(e => e.id_estado !== id);
      return true;
    } catch (err) {
      console.error(`Error deleting estado with id ${id}:`, err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al eliminar el estado';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    estados,
    loading,
    error,
    // Getters
    allEstados,
    getEstadoById,
    // Actions
    fetchEstados,
    createEstado,
    updateEstado,
    deleteEstado
  };
});

