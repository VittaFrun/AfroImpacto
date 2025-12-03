import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/plugins/axios';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/features/auth/stores/authStore';

export const useOrganizationProfileStore = defineStore('organizationProfile', {
  state: () => ({
    organization: null,
    publicProjects: [],
    teamMembers: [],
    stats: {
      projectsCount: 0,
      teamMembersCount: 0,
      totalVolunteers: 0,
      totalHours: 0,
      totalDonations: 0,
      activeProjects: 0
    },
    loading: false,
    error: null,
  }),

  getters: {
    isPublic: (state) => {
      return state.organization?.es_publico !== false;
    },
  },

  actions: {
    async fetchOrganizationProfile(orgId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get(`/organizaciones/${orgId}/publico`);
        this.organization = response.data;
        return this.organization;
      } catch (error) {
        console.error('Error fetching organization profile:', error);
        this.error = error.response?.data?.message || 'Error al cargar el perfil';
        const notificationStore = useNotificationStore();
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchPublicProjects(orgId) {
      try {
        const response = await apiClient.get(`/organizaciones/${orgId}/proyectos-publicos`);
        this.publicProjects = response.data || [];
        return this.publicProjects;
      } catch (error) {
        console.error('Error fetching public projects:', error);
        this.publicProjects = [];
        return [];
      }
    },

    async fetchTeamMembers(orgId) {
      try {
        const response = await apiClient.get(`/organizaciones/${orgId}/equipo`);
        // Filtrar solo miembros activos para vista pública
        this.teamMembers = (response.data || []).filter(m => m.estado === 'activo');
        return this.teamMembers;
      } catch (error) {
        console.error('Error fetching team members:', error);
        this.teamMembers = [];
        return [];
      }
    },

    async fetchStats(orgId) {
      try {
        // Obtener estadísticas de la organización
        const [projectsRes, teamRes] = await Promise.all([
          apiClient.get(`/organizaciones/${orgId}/proyectos-publicos`).catch(() => ({ data: [] })),
          apiClient.get(`/organizaciones/${orgId}/equipo`).catch(() => ({ data: [] }))
        ]);

        const projects = projectsRes.data || [];
        const team = teamRes.data || [];

        this.stats = {
          projectsCount: projects.length,
          teamMembersCount: team.filter(m => m.estado === 'activo').length,
          totalVolunteers: 0, // TODO: Calcular desde proyectos
          totalHours: 0, // TODO: Calcular desde horas voluntariadas
          totalDonations: 0, // TODO: Calcular desde donaciones
          activeProjects: projects.filter(p => p.id_estado === 1).length
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },

    async updateProfile(profileData) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      const authStore = useAuthStore();
      
      try {
        const orgId = await this.getOwnOrganizationId();
        if (!orgId) {
          throw new Error('No se pudo obtener el ID de la organización');
        }

        const response = await apiClient.patch(`/organizaciones/${orgId}`, profileData);
        this.organization = { ...this.organization, ...response.data };
        notificationStore.showSnackbar('Perfil actualizado correctamente', 'success');
        return response.data;
      } catch (error) {
        console.error('Error updating profile:', error);
        this.error = error.response?.data?.message || 'Error al actualizar el perfil';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateBanner(bannerUrl) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      
      try {
        const orgId = await this.getOwnOrganizationId();
        if (!orgId) {
          throw new Error('No se pudo obtener el ID de la organización');
        }

        const response = await apiClient.patch(`/organizaciones/${orgId}`, { banner: bannerUrl });
        this.organization = { ...this.organization, banner: bannerUrl };
        notificationStore.showSnackbar('Banner actualizado correctamente', 'success');
        return response.data;
      } catch (error) {
        console.error('Error updating banner:', error);
        this.error = error.response?.data?.message || 'Error al actualizar el banner';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateLogo(logoUrl) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      
      try {
        const orgId = await this.getOwnOrganizationId();
        if (!orgId) {
          throw new Error('No se pudo obtener el ID de la organización');
        }

        const response = await apiClient.patch(`/organizaciones/${orgId}`, { logo: logoUrl });
        this.organization = { ...this.organization, logo: logoUrl };
        notificationStore.showSnackbar('Logo actualizado correctamente', 'success');
        return response.data;
      } catch (error) {
        console.error('Error updating logo:', error);
        this.error = error.response?.data?.message || 'Error al actualizar el logo';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async requestJoinTeam(orgId) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();

      try {
        const response = await apiClient.post(`/organizaciones/${orgId}/equipo/solicitar`);
        notificationStore.showSnackbar('Solicitud enviada correctamente', 'success');
        return response.data;
      } catch (error) {
        console.error('Error requesting to join team:', error);
        this.error = error.response?.data?.message || 'Error al enviar la solicitud';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getOwnOrganizationId() {
      try {
        const authStore = useAuthStore();
        const user = authStore.user;
        
        if (user?.organizacion?.id_organizacion) {
          return user.organizacion.id_organizacion;
        }
        
        if (user?.id_organizacion) {
          return user.id_organizacion;
        }
        
        if (user?.id_usuario || user?.sub) {
          const userId = user.id_usuario || user.sub;
          const orgResponse = await apiClient.get(`/organizacion/by-user/${userId}`);
          if (orgResponse.data?.id_organizacion) {
            return orgResponse.data.id_organizacion;
          }
        }
        
        return null;
      } catch (error) {
        console.error('Error getting organization ID:', error);
        return null;
      }
    },

    clear() {
      this.organization = null;
      this.publicProjects = [];
      this.teamMembers = [];
      this.stats = {
        projectsCount: 0,
        teamMembersCount: 0,
        totalVolunteers: 0,
        totalHours: 0,
        totalDonations: 0,
        activeProjects: 0
      };
      this.error = null;
    },
  },
});

