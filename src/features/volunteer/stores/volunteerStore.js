import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useVolunteerStore = defineStore('volunteer', {
  state: () => ({
    // State for general volunteer list
    volunteers: [],
    loadingVolunteers: false,
    errorVolunteers: null,

    // State for the logged-in volunteer's dashboard
    stats: {},
    pendingTasks: [],
    availabilitySummary: '',
    loadingDashboard: false,
    errorDashboard: null,

    // State for the volunteer's projects view
    myProjects: [],
    loadingProjects: false,
    errorProjects: null,
  }),
  actions: {
    async fetchVolunteers() {
      this.loadingVolunteers = true;
      this.errorVolunteers = null;
      try {
        // This would fetch a list of all volunteers, e.g., for an admin view
        this.volunteers = []; // Keeping placeholder logic
        console.log('Simulated fetch for volunteers list, returning empty array.');
      } catch (error) {
        this.errorVolunteers = 'Error fetching volunteers';
        console.error(this.errorVolunteers, error);
      } finally {
        this.loadingVolunteers = false;
      }
    },

    async fetchVolunteerDashboard() {
      this.loadingDashboard = true;
      this.errorDashboard = null;
      try {
        // Simulate API call delay
        await new Promise(res => setTimeout(res, 800));

        // Mock data for the volunteer dashboard
        this.stats = {
          hours: 42,
          tasksCompleted: 7,
          projects: 2,
        };

        this.pendingTasks = [
          { id: 1, description: 'Contactar a donantes para evento', priority: 'Alta', project: 'Campaña de Recaudación' },
          { id: 2, description: 'Diseñar folleto informativo', priority: 'Media', project: 'Programa de Alfabetización' },
          { id: 3, description: 'Preparar materiales para taller', priority: 'Baja', project: 'Taller de Arte Infantil' },
        ];

        this.availabilitySummary = 'Disponible los lunes y miércoles por la tarde.';

      } catch (error) {
        this.errorDashboard = 'Error fetching volunteer dashboard data';
        console.error(this.errorDashboard, error);
      } finally {
        this.loadingDashboard = false;
      }
    },

    async fetchMyProjects() {
      this.loadingProjects = true;
      this.errorProjects = null;
      try {
        await new Promise(res => setTimeout(res, 600));
        this.myProjects = [
          {
            id: 1,
            name: 'Campaña de Recaudación Anual',
            image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop',
            progress: 75,
            role: 'Coordinador de Donaciones',
            status: 'Activo',
            statusColor: 'primary'
          },
          {
            id: 2,
            name: 'Programa de Alfabetización Infantil',
            image: 'https://images.unsplash.com/photo-1503919545824-a5c24117532d?q=80&w=2070&auto=format&fit=crop',
            progress: 40,
            role: 'Tutor de Lectura',
            status: 'Activo',
            statusColor: 'primary'
          },
          {
            id: 3,
            name: 'Construcción de Centro Comunitario',
            image: 'https://images.unsplash.com/photo-1517489319231-b6f42a58244a?q=80&w=2070&auto=format&fit=crop',
            progress: 100,
            role: 'Ayudante General',
            status: 'Completado',
            statusColor: 'success'
          },
        ];
      } catch (error) {
        this.errorProjects = 'Error fetching projects';
      } finally {
        this.loadingProjects = false;
      }
    },
  },
});
