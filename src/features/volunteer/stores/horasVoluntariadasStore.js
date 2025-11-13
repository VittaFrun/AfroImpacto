import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useHorasVoluntariadasStore = defineStore('horasVoluntariadas', {
  state: () => ({
    horas: [],
    horasPorProyecto: {},
    resumenPorProyecto: {},
    loading: false,
    error: null,
  }),

  getters: {
    getHorasByProject: (state) => (projectId) => {
      return state.horasPorProyecto[projectId] || [];
    },
    getResumenByProject: (state) => (projectId) => {
      return state.resumenPorProyecto[projectId] || {
        totalHoras: 0,
        horasVerificadas: 0,
        horasPendientes: 0,
        totalRegistros: 0,
        registrosVerificados: 0,
        registrosPendientes: 0
      };
    },
  },

  actions: {
    async fetchHorasByProject(projectId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/horas-voluntariadas/proyecto/${projectId}`);
        this.horasPorProyecto[projectId] = response.data || [];
        return this.horasPorProyecto[projectId];
      } catch (error) {
        console.error('Error fetching horas by project:', error);
        this.error = error.response?.data?.message || 'Error al cargar las horas';
        this.horasPorProyecto[projectId] = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchHorasByVolunteer() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/horas-voluntariadas/voluntario');
        this.horas = response.data || [];
        return this.horas;
      } catch (error) {
        console.error('Error fetching horas by volunteer:', error);
        this.error = error.response?.data?.message || 'Error al cargar las horas';
        this.horas = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchResumenByProject(projectId) {
      this.error = null;
      try {
        const response = await api.get(`/horas-voluntariadas/proyecto/${projectId}/resumen`);
        this.resumenPorProyecto[projectId] = response.data || {};
        return this.resumenPorProyecto[projectId];
      } catch (error) {
        console.error('Error fetching resumen by project:', error);
        this.error = error.response?.data?.message || 'Error al cargar el resumen';
        throw error;
      }
    },

    async registerHoras(horasData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/horas-voluntariadas', horasData);
        const newHoras = response.data;
        
        // Actualizar el array de horas del proyecto
        if (horasData.id_proyecto) {
          if (!this.horasPorProyecto[horasData.id_proyecto]) {
            this.horasPorProyecto[horasData.id_proyecto] = [];
          }
          this.horasPorProyecto[horasData.id_proyecto].unshift(newHoras);
          
          // Actualizar resumen
          await this.fetchResumenByProject(horasData.id_proyecto);
        }
        
        // También agregar a la lista general
        this.horas.unshift(newHoras);
        
        return newHoras;
      } catch (error) {
        console.error('Error registering horas:', error);
        this.error = error.response?.data?.message || 'Error al registrar las horas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateHoras(horasId, updateData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.patch(`/horas-voluntariadas/${horasId}`, updateData);
        const updatedHoras = response.data;
        
        // Actualizar en el array de horas del proyecto
        const projectId = updatedHoras.id_proyecto;
        if (projectId && this.horasPorProyecto[projectId]) {
          const index = this.horasPorProyecto[projectId].findIndex(h => h.id_horas === horasId);
          if (index !== -1) {
            this.horasPorProyecto[projectId][index] = updatedHoras;
          }
          
          // Actualizar resumen
          await this.fetchResumenByProject(projectId);
        }
        
        // Actualizar en la lista general
        const generalIndex = this.horas.findIndex(h => h.id_horas === horasId);
        if (generalIndex !== -1) {
          this.horas[generalIndex] = updatedHoras;
        }
        
        return updatedHoras;
      } catch (error) {
        console.error('Error updating horas:', error);
        this.error = error.response?.data?.message || 'Error al actualizar las horas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteHoras(horasId) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/horas-voluntariadas/${horasId}`);
        
        // Remover de todos los arrays
        let projectId = null;
        
        // Buscar y remover del array por proyecto
        for (const [pid, horas] of Object.entries(this.horasPorProyecto)) {
          const index = horas.findIndex(h => h.id_horas === horasId);
          if (index !== -1) {
            projectId = parseInt(pid);
            this.horasPorProyecto[pid].splice(index, 1);
            break;
          }
        }
        
        // Remover de la lista general
        const generalIndex = this.horas.findIndex(h => h.id_horas === horasId);
        if (generalIndex !== -1) {
          this.horas.splice(generalIndex, 1);
        }
        
        // Actualizar resumen si hay projectId
        if (projectId) {
          await this.fetchResumenByProject(projectId);
        }
        
        return true;
      } catch (error) {
        console.error('Error deleting horas:', error);
        this.error = error.response?.data?.message || 'Error al eliminar las horas';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

