import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useVolunteerStore = defineStore('volunteer', {
  state: () => ({
    volunteers: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchVolunteers() {
      this.loading = true;
      this.error = null;
      try {
        // NOTE: This is a placeholder. The actual API endpoint needs to be implemented.
        // For now, we'll just simulate an empty array.
        // const response = await api.get('/volunteers');
        // this.volunteers = response.data;
        this.volunteers = []; // Returning empty array to avoid breaking UI
        console.log('Simulated fetch for volunteers, returning empty array.');
      } catch (error) {
        this.error = 'Error fetching volunteers';
        console.error(this.error, error);
      } finally {
        this.loading = false;
      }
    },
  },
});
