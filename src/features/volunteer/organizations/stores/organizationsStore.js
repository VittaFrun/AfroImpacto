import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/plugins/axios';
import { useNotificationStore } from '@/stores/notificationStore';

export const useOrganizationsStore = defineStore('organizations', {
  state: () => ({
    organizations: [],
    currentOrganization: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOrganizations(filters = {}) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();

      try {
        const params = new URLSearchParams();
        
        if (filters.search) params.append('search', filters.search);
        if (filters.tipo) params.append('tipo', filters.tipo);
        if (filters.pais) params.append('pais', filters.pais);
        if (filters.areaEnfoque) params.append('areaEnfoque', filters.areaEnfoque);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const queryString = params.toString();
        const url = `/organizaciones/publicas${queryString ? `?${queryString}` : ''}`;
        
        const response = await apiClient.get(url);
        
        // Si la respuesta es un array, lo convertimos a formato paginado
        if (Array.isArray(response.data)) {
          return {
            items: response.data,
            total: response.data.length,
            page: filters.page || 1,
            limit: filters.limit || response.data.length
          };
        }
        
        return response.data;
      } catch (error) {
        console.error('Error fetching organizations:', error);
        this.error = error.response?.data?.message || 'Error al cargar las organizaciones';
        notificationStore.showSnackbar(this.error, 'error');
        return { items: [], total: 0, page: 1, limit: 10 };
      } finally {
        this.loading = false;
      }
    },

    async fetchOrganizationById(id) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();

      try {
        const response = await apiClient.get(`/organizaciones/${id}/publico`);
        this.currentOrganization = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching organization:', error);
        this.error = error.response?.data?.message || 'Error al cargar la organización';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.organizations = [];
      this.currentOrganization = null;
      this.error = null;
    },
  },
});

