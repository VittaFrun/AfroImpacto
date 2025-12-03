import { defineStore } from 'pinia';
import axios from '@/plugins/axios';

export const useCertificadoStore = defineStore('certificado', {
  state: () => ({
    certificados: [],
    loading: false,
    error: null,
  }),

  getters: {
    certificadosByVolunteer: (state) => (idVoluntario) => {
      return state.certificados.filter(c => c.id_voluntario === idVoluntario);
    },
    certificadosByProject: (state) => (idProyecto) => {
      return state.certificados.filter(c => c.id_proyecto === idProyecto);
    },
    certificadosValidos: (state) => {
      const now = new Date();
      return state.certificados.filter(c => {
        if (!c.fecha_expiracion) return true;
        return new Date(c.fecha_expiracion) > now;
      });
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/certificado');
        this.certificados = response.data || [];
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching certificados:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchByVolunteer(idVoluntario) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/certificado?voluntario=${idVoluntario}`);
        this.certificados = response.data || [];
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching certificados by volunteer:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchByProject(idProyecto) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/certificado?proyecto=${idProyecto}`);
        this.certificados = response.data || [];
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching certificados by project:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchByVerificationCode(codigo) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/certificado/verificar/${codigo}`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching certificado by code:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCertificado(certificadoData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/certificado', certificadoData);
        this.certificados.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error creating certificado:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCertificado(id, certificadoData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.patch(`/certificado/${id}`, certificadoData);
        const index = this.certificados.findIndex(c => c.id_certificado === id);
        if (index !== -1) {
          this.certificados[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error updating certificado:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCertificado(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`/certificado/${id}`);
        this.certificados = this.certificados.filter(c => c.id_certificado !== id);
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error deleting certificado:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

