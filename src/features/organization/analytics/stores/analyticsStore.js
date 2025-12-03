import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    // Analytics data
    projectAnalytics: null,
    organizationAnalytics: null,
    volunteerAnalytics: null,
    
    // Loading states
    loadingProjectAnalytics: false,
    loadingOrganizationAnalytics: false,
    loadingVolunteerAnalytics: false,
    
    // Reports data
    reports: [],
    reportHistory: [],
    loadingReports: false,
    generatingReport: false,
    
    // Error states
    error: null
  }),

  getters: {
    // Project analytics getters
    projectSummary: (state) => state.projectAnalytics?.resumen || {},
    projectTrends: (state) => state.projectAnalytics?.tendencias || {},
    projectPerformance: (state) => state.projectAnalytics?.rendimiento || {},
    
    // Organization analytics getters
    organizationProjects: (state) => state.organizationAnalytics?.proyectos || {},
    organizationVolunteers: (state) => state.organizationAnalytics?.voluntarios || {},
    organizationHours: (state) => state.organizationAnalytics?.horas || {},
    organizationPerformance: (state) => state.organizationAnalytics?.rendimiento || {},
    
    // Volunteer analytics getters
    volunteerActivity: (state) => state.volunteerAnalytics?.actividad || {},
    volunteerPerformance: (state) => state.volunteerAnalytics?.rendimiento || {},
    volunteerProgress: (state) => state.volunteerAnalytics?.progreso || {},
    
    // Chart data formatters
    projectTrendsChartData: (state) => {
      if (!state.projectAnalytics?.tendencias) return null;
      
      const { proyectosPorMes, horasPorMes, voluntariosPorMes } = state.projectAnalytics.tendencias;
      
      return {
        labels: proyectosPorMes.map(p => p.periodo),
        datasets: [
          {
            label: 'Proyectos Creados',
            data: proyectosPorMes.map(p => p.total),
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4
          },
          {
            label: 'Horas Registradas',
            data: horasPorMes.map(h => h.total),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            yAxisID: 'y1'
          },
          {
            label: 'Nuevos Voluntarios',
            data: voluntariosPorMes.map(v => v.total),
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            tension: 0.4
          }
        ]
      };
    },
    
    organizationHoursTrendData: (state) => {
      if (!state.organizationAnalytics?.horas) return null;
      
      const { tendencia, promedioSemanal, totalRegistradas, totalVerificadas } = state.organizationAnalytics.horas;
      
      return {
        labels: ['Registradas', 'Verificadas', 'Pendientes'],
        datasets: [{
          data: [totalRegistradas, totalVerificadas, totalRegistradas - totalVerificadas],
          backgroundColor: ['#2196F3', '#4CAF50', '#FFC107'],
          borderWidth: 0
        }]
      };
    }
  },

  actions: {
    /**
     * Obtiene analytics generales de proyectos
     */
    async fetchProjectAnalytics() {
      this.loadingProjectAnalytics = true;
      this.error = null;
      
      try {
        const response = await api.get('/reportes/analytics/proyectos');
        this.projectAnalytics = response.data;
      } catch (error) {
        console.error('Error fetching project analytics:', error);
        this.error = error.response?.data?.message || 'Error al cargar analytics de proyectos';
        throw error;
      } finally {
        this.loadingProjectAnalytics = false;
      }
    },

    /**
     * Obtiene analytics de una organización específica
     */
    async fetchOrganizationAnalytics(organizationId) {
      this.loadingOrganizationAnalytics = true;
      this.error = null;
      
      try {
        const response = await api.get(`/reportes/analytics/organizacion/${organizationId}`);
        this.organizationAnalytics = response.data;
      } catch (error) {
        console.error('Error fetching organization analytics:', error);
        this.error = error.response?.data?.message || 'Error al cargar analytics de organización';
        throw error;
      } finally {
        this.loadingOrganizationAnalytics = false;
      }
    },

    /**
     * Obtiene analytics de un voluntario específico
     */
    async fetchVolunteerAnalytics(volunteerId) {
      this.loadingVolunteerAnalytics = true;
      this.error = null;
      
      try {
        const response = await api.get(`/reportes/analytics/voluntario/${volunteerId}`);
        this.volunteerAnalytics = response.data;
      } catch (error) {
        console.error('Error fetching volunteer analytics:', error);
        this.error = error.response?.data?.message || 'Error al cargar analytics de voluntario';
        throw error;
      } finally {
        this.loadingVolunteerAnalytics = false;
      }
    },

    /**
     * Genera un reporte de forma asíncrona
     */
    async generateReport(reportData) {
      this.generatingReport = true;
      this.error = null;
      
      try {
        const response = await api.post('/reportes/generar', reportData);
        
        // Agregar el reporte a la lista
        this.reports.unshift(response.data);
        
        return response.data;
      } catch (error) {
        console.error('Error generating report:', error);
        this.error = error.response?.data?.message || 'Error al generar reporte';
        throw error;
      } finally {
        this.generatingReport = false;
      }
    },

    /**
     * Genera un reporte simple de forma síncrona
     */
    async generateSimpleReport(reportData) {
      this.generatingReport = true;
      this.error = null;
      
      try {
        const response = await api.post('/reportes/generar-simple', reportData, {
          responseType: 'blob'
        });
        
        // Crear URL para descarga
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        
        // Crear elemento de descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_${reportData.tipo}_${Date.now()}.${reportData.formato.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar URL
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Reporte descargado exitosamente' };
      } catch (error) {
        console.error('Error generating simple report:', error);
        this.error = error.response?.data?.message || 'Error al generar reporte';
        throw error;
      } finally {
        this.generatingReport = false;
      }
    },

    /**
     * Obtiene el estado de un reporte
     */
    async getReportStatus(reportId) {
      try {
        const response = await api.get(`/reportes/${reportId}/estado`);
        
        // Actualizar el reporte en la lista
        const index = this.reports.findIndex(r => r.id_reporte === reportId);
        if (index !== -1) {
          this.reports[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error getting report status:', error);
        throw error;
      }
    },

    /**
     * Descarga un reporte generado
     */
    async downloadReport(reportId) {
      try {
        const response = await api.get(`/reportes/${reportId}/descargar`, {
          responseType: 'blob'
        });
        
        // Obtener información del reporte
        const report = this.reports.find(r => r.id_reporte === reportId);
        const fileName = `reporte_${report?.tipo || 'unknown'}_${reportId}.${report?.formato?.toLowerCase() || 'pdf'}`;
        
        // Crear URL para descarga
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        
        // Crear elemento de descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar URL
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Reporte descargado exitosamente' };
      } catch (error) {
        console.error('Error downloading report:', error);
        this.error = error.response?.data?.message || 'Error al descargar reporte';
        throw error;
      }
    },

    /**
     * Obtiene la lista de reportes de un proyecto
     */
    async fetchProjectReports(projectId) {
      this.loadingReports = true;
      this.error = null;
      
      try {
        const response = await api.get(`/reportes/proyecto/${projectId}`);
        this.reports = response.data;
      } catch (error) {
        console.error('Error fetching project reports:', error);
        this.error = error.response?.data?.message || 'Error al cargar reportes';
        throw error;
      } finally {
        this.loadingReports = false;
      }
    },

    /**
     * Limpia los datos de analytics
     */
    clearAnalytics() {
      this.projectAnalytics = null;
      this.organizationAnalytics = null;
      this.volunteerAnalytics = null;
      this.error = null;
    },

    /**
     * Limpia los reportes
     */
    clearReports() {
      this.reports = [];
      this.reportHistory = [];
      this.error = null;
    }
  }
});
