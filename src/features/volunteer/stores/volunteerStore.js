import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import defaultCoverImage from '@/assets/images/background_login.png';

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

    async fetchProjectTasks(projectId) {
      try {
        const response = await api.get(`/projects/${projectId}/volunteer-tasks`);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching project tasks:', error);
        throw error;
      }
    },

    async updateTaskStatus(taskId, newStatus) {
      try {
        const response = await api.patch(`/tarea/${taskId}`, { id_estado: newStatus });
        return response.data;
      } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
      }
    },

    async fetchMyProjects() {
      this.loadingProjects = true;
      this.errorProjects = null;
      try {
        // El endpoint /projects devuelve los proyectos del voluntario cuando el usuario es voluntario
        const response = await api.get('/projects');
        
        if (!response.data || !Array.isArray(response.data)) {
          console.warn('Respuesta inesperada del servidor:', response.data);
          this.myProjects = [];
          return;
        }
        
        // Mapear datos del backend al formato del frontend
        this.myProjects = (response.data || []).map(proyecto => {
          // Calcular progreso basado en tareas completadas
          let progress = 0;
          if (proyecto.fases && proyecto.fases.length > 0) {
            const allTasks = proyecto.fases.flatMap(fase => fase.tareas || []);
            if (allTasks.length > 0) {
              const completedTasks = allTasks.filter(tarea => tarea.id_estado === 3).length; // 3 = completado
              progress = Math.round((completedTasks / allTasks.length) * 100);
            }
          }

          // Obtener estado del proyecto
          const estadoNombre = proyecto.estado?.nombre?.toLowerCase() || '';
          let status = 'Activo';
          let statusColor = 'success';
          
          if (estadoNombre.includes('completado') || estadoNombre.includes('finalizado')) {
            status = 'Completado';
            statusColor = 'info';
          } else if (estadoNombre.includes('pausado') || estadoNombre.includes('cancelado')) {
            status = 'Pausado';
            statusColor = 'warning';
          } else if (estadoNombre.includes('inactivo')) {
            status = 'Inactivo';
            statusColor = 'error';
          }

          // Obtener roles asignados
          const roles = proyecto.rolesAsignados || [];
          const roleNames = roles.map(r => r.nombre).join(', ') || 'Voluntario';

          return {
            id: proyecto.id_proyecto,
            id_proyecto: proyecto.id_proyecto,
            name: proyecto.nombre,
            description: proyecto.descripcion,
            organization: proyecto.organizacion?.nombre || 'Organización',
            role: roleNames,
            roles: roles, // Array completo de roles
            rolesAsignados: roles,
            status: status,
            statusColor: statusColor,
            progress: progress,
            startDate: proyecto.fecha_inicio,
            endDate: proyecto.fecha_fin,
            image: (proyecto.imagen_principal && proyecto.imagen_principal !== '/assets/images/background_login.png') 
              ? proyecto.imagen_principal 
              : defaultCoverImage,
            imagen_principal: (proyecto.imagen_principal && proyecto.imagen_principal !== '/assets/images/background_login.png') 
              ? proyecto.imagen_principal 
              : defaultCoverImage,
            ubicacion: proyecto.ubicacion,
            objetivo: proyecto.objetivo,
            estado: proyecto.estado,
            organizacion: proyecto.organizacion,
            beneficio: proyecto.beneficio,
            fases: proyecto.fases || []
          };
        });
      } catch (error) {
        console.error('Error fetching my projects:', error);
        this.errorProjects = error.response?.data?.message || 'Error al cargar tus proyectos';
        this.myProjects = [];
      } finally {
        this.loadingProjects = false;
      }
    },
  },
});
