import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '@/plugins/axios';

export const useDonationStore = defineStore('donation', () => {
  // State
  const allDonations = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const donations = computed(() => allDonations.value);
  const getDonationById = computed(() => (id) => allDonations.value.find(d => d.id === id));

  // Helper function to map backend donation data to frontend format
  function mapDonationData(donation) {
    return {
      id: donation.id_donacion,
      organizationId: donation.id_organizacion,
      methodId: donation.id_metodo,
      amount: donation.monto_total,
      date: donation.fecha,
      conditions: donation.condiciones,
      verified: donation.verificado,
      statusId: donation.id_estado,
      createdAt: donation.creado_en,
      updatedAt: donation.actualizado_en,
      // Relations
      organization: donation.organizacion,
      method: donation.metodoPago,
      estado: donation.estado,
      projects: donation.donacionProyectos || [],
      movements: donation.movimientos || [],
      // Computed fields
      statusColor: getStatusColor(donation.estado?.nombre || 'Pendiente'),
      statusText: donation.estado?.nombre || 'Pendiente',
      methodName: donation.metodoPago?.nombre || 'No especificado',
      // Legacy fields for compatibility
      ...donation
    };
  }

  // Helper function to get status color
  function getStatusColor(status) {
    const statusColors = {
      'Verificado': 'success',
      'Pendiente': 'warning',
      'Rechazado': 'error',
      'Procesando': 'info'
    };
    return statusColors[status] || 'primary';
  }

  // Helper function to format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  // Actions
  async function fetchDonations() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/donacion');
      allDonations.value = response.data.map(mapDonationData);
    } catch (err) {
      console.error('Error fetching donations:', err);
      error.value = 'Failed to fetch donations. Please try again later.';
      allDonations.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchDonationById(id) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get(`/donacion/${id}`);
      const donation = mapDonationData(response.data);
      
      const index = allDonations.value.findIndex(d => d.id === id);
      if (index !== -1) {
        allDonations.value[index] = donation;
      } else {
        allDonations.value.push(donation);
      }
      
      return donation;
    } catch (err) {
      console.error(`Error fetching donation with id ${id}:`, err);
      error.value = 'Failed to fetch donation details. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function addDonation(donationData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/donacion', donationData);
      const donation = mapDonationData(response.data);
      allDonations.value.push(donation);
      return donation;
    } catch (err) {
      console.error('Error creating donation:', err);
      error.value = 'Failed to create donation. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateDonation(donationId, updatedData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.patch(`/donacion/${donationId}`, updatedData);
      const donation = mapDonationData(response.data);
      
      const index = allDonations.value.findIndex(d => d.id === donationId);
      if (index !== -1) {
        allDonations.value[index] = donation;
      }
      
      return donation;
    } catch (err) {
      console.error(`Error updating donation with id ${donationId}:`, err);
      error.value = 'Failed to update donation. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function deleteDonation(donationId) {
    loading.value = true;
    error.value = null;
    
    try {
      await axios.delete(`/donacion/${donationId}`);
      allDonations.value = allDonations.value.filter(d => d.id !== donationId);
      return true;
    } catch (err) {
      console.error(`Error deleting donation with id ${donationId}:`, err);
      error.value = 'Failed to delete donation. Please try again later.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function verifyDonation(donationId) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.patch(`/donacion/${donationId}/verify`);
      const donation = mapDonationData(response.data);
      
      const index = allDonations.value.findIndex(d => d.id === donationId);
      if (index !== -1) {
        allDonations.value[index] = donation;
      }
      
      return donation;
    } catch (err) {
      console.error(`Error verifying donation with id ${donationId}:`, err);
      error.value = 'Failed to verify donation. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function rejectDonation(donationId, reason) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await axios.patch(`/donacion/${donationId}/reject`, { reason });
      const donation = mapDonationData(response.data);
      
      const index = allDonations.value.findIndex(d => d.id === donationId);
      if (index !== -1) {
        allDonations.value[index] = donation;
      }
      
      return donation;
    } catch (err) {
      console.error(`Error rejecting donation with id ${donationId}:`, err);
      error.value = 'Failed to reject donation. Please try again later.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Statistics methods
  async function getDonationStats() {
    try {
      const response = await axios.get('/donacion/stats');
      return response.data;
    } catch (err) {
      console.error('Error fetching donation stats:', err);
      return null;
    }
  }

  async function getDonationsByProject(projectId) {
    try {
      const response = await axios.get(`/donacion/project/${projectId}`);
      return response.data.map(mapDonationData);
    } catch (err) {
      console.error('Error fetching donations by project:', err);
      return [];
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    allDonations,
    loading,
    error,
    // Getters
    donations,
    getDonationById,
    // Actions
    fetchDonations,
    fetchDonationById,
    addDonation,
    updateDonation,
    deleteDonation,
    verifyDonation,
    rejectDonation,
    getDonationStats,
    getDonationsByProject,
    clearError,
    // Helpers
    formatCurrency,
    getStatusColor
  };
});
