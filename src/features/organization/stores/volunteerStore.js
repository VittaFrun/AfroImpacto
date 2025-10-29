import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '@/plugins/axios';

export const useVolunteerStore = defineStore('volunteer', () => {
  // State
  const allVolunteers = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const volunteers = computed(() => allVolunteers.value);
  const getVolunteerById = computed(() => (id) => allVolunteers.value.find(v => v.id === id));

  // Helper function to map backend volunteer data to frontend format
  function mapVolunteerData(volunteer) {
    return {
      id: volunteer.id_voluntario,
      name: volunteer.nombre,
      email: volunteer.email,
      phone: volunteer.telefono,
      address: volunteer.direccion,
      birthDate: volunteer.fecha_nacimiento,
      skills: volunteer.habilidades || [],
      availability: volunteer.disponibilidad || [],
      status: volunteer.estado || 'Activo',
      statusColor: getStatusColor(volunteer.estado),
      avatar: volunteer.foto || null,
      createdAt: volunteer.creado_en,
      updatedAt: volunteer.actualizado_en,
      // Relations
      user: volunteer.usuario,
      // Legacy fields for compatibility
      ...volunteer
    };
  }

  // Helper function to get status color
  function getStatusColor(status) {
    const statusColors = {
      'Activo': 'success',
      'Inactivo': 'error',
      'Pendiente': 'warning',
      'Suspendido': 'error'
    };
    return statusColors[status] || 'primary';
  }

  // Actions
  async function fetchVolunteers() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/volunteers');
      allVolunteers.value = response.data.map(mapVolunteerData);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      error.value = 'Failed to fetch volunteers. Please try again later.';
      allVolunteers.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchVolunteerById(id) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get(`/volunteers/${id}`);
      const volunteer = mapVolunteerData(response.data);
      
      const index = allVolunteers.value.findIndex(v => v.id === id);
      if (index !== -1) {
        allVolunteers.value[index] = volunteer;
      } else {
        allVolunteers.value.push(volunteer);
      }
      
      return volunteer;
    } catch (err) {
      console.error(`Error fetching volunteer with id ${id}:`, err);
      error.value = 'Failed to fetch volunteer details. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function addVolunteer(volunteerData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/volunteers', volunteerData);
      const volunteer = mapVolunteerData(response.data);
      allVolunteers.value.push(volunteer);
      return volunteer;
    } catch (err) {
      console.error('Error creating volunteer:', err);
      error.value = 'Failed to create volunteer. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateVolunteer(volunteerId, updatedData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.put(`/volunteers/${volunteerId}`, updatedData);
      const volunteer = mapVolunteerData(response.data);
      
      const index = allVolunteers.value.findIndex(v => v.id === volunteerId);
      if (index !== -1) {
        allVolunteers.value[index] = volunteer;
      }
      
      return volunteer;
    } catch (err) {
      console.error(`Error updating volunteer with id ${volunteerId}:`, err);
      error.value = 'Failed to update volunteer. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteVolunteer(volunteerId) {
    loading.value = true;
    error.value = null;
    
    try {
      await axios.delete(`/volunteers/${volunteerId}`);
      allVolunteers.value = allVolunteers.value.filter(v => v.id !== volunteerId);
      return true;
    } catch (err) {
      console.error(`Error deleting volunteer with id ${volunteerId}:`, err);
      error.value = 'Failed to delete volunteer. Please try again later.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function inviteVolunteer(inviteData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/volunteers/invite', inviteData);
      return response.data;
    } catch (err) {
      console.error('Error inviting volunteer:', err);
      error.value = 'Failed to invite volunteer. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    allVolunteers,
    loading,
    error,
    // Getters
    volunteers,
    getVolunteerById,
    // Actions
    fetchVolunteers,
    fetchVolunteerById,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    inviteVolunteer,
    clearError
  };
});
