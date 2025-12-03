import { defineStore } from 'pinia';
import axios from '@/plugins/axios';

export const useLogroStore = defineStore('logro', {
  state: () => ({
    logros: [],
    voluntarioLogros: [],
    loading: false,
    error: null,
  }),

  getters: {
    logrosByType: (state) => (tipo) => {
      return state.logros.filter(l => l.tipo === tipo);
    },
    logrosByVolunteer: (state) => (idVoluntario) => {
      return state.voluntarioLogros.filter(vl => vl.id_voluntario === idVoluntario);
    },
    totalPoints: (state) => (idVoluntario) => {
      const logros = state.voluntarioLogros.filter(vl => vl.id_voluntario === idVoluntario);
      return logros.reduce((total, vl) => total + (vl.logro?.puntos || 0), 0);
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/logro');
        this.logros = response.data || [];
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching logros:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchByType(tipo) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/logro?tipo=${tipo}`);
        this.logros = response.data || [];
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching logros by type:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchVoluntarioLogros(idVoluntario) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/voluntario-logro?voluntario=${idVoluntario}`);
        this.voluntarioLogros = response.data || [];
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching voluntario logros:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchVoluntarioPoints(idVoluntario) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/voluntario-logro/puntos/${idVoluntario}`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching voluntario points:', error);
        return 0;
      } finally {
        this.loading = false;
      }
    },

    async createLogro(logroData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/logro', logroData);
        this.logros.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error creating logro:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async assignLogroToVolunteer(voluntarioLogroData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/voluntario-logro', voluntarioLogroData);
        this.voluntarioLogros.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error assigning logro to volunteer:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

