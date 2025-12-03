import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/plugins/axios';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/features/auth/stores/authStore';

export const useTeamStore = defineStore('team', {
  state: () => ({
    members: [], // Array de OrganizacionMiembro
    invitations: [], // Array de invitaciones enviadas
    loading: false,
    error: null,
  }),

  getters: {
    activeMembers: (state) => {
      return state.members.filter(m => m.estado === 'activo');
    },

    pendingRequests: (state) => {
      return state.members.filter(m => m.estado === 'pendiente');
    },

    inactiveMembers: (state) => {
      return state.members.filter(m => m.estado === 'inactivo');
    },

    membersByRole: (state) => {
      return (roleId) => {
        return state.members.filter(m => m.id_rol_organizacion === roleId);
      };
    },
  },

  actions: {
    async fetchTeamMembers(orgId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get(`/organizaciones/${orgId}/equipo`);
        this.members = response.data || [];
      } catch (error) {
        console.error('Error fetching team members:', error);
        this.error = error.response?.data?.message || 'Error al cargar los miembros del equipo';
        const notificationStore = useNotificationStore();
        notificationStore.showSnackbar(this.error, 'error');
        this.members = [];
      } finally {
        this.loading = false;
      }
    },

    async getOrganizationId() {
      // Obtener el ID de la organización del usuario autenticado
      try {
        // Primero intentar desde el token decodificado
        const authStore = useAuthStore();
        const user = authStore.user;
        
        if (user?.organizacion?.id_organizacion) {
          return user.organizacion.id_organizacion;
        }
        
        // Si el usuario tiene id_organizacion directamente
        if (user?.id_organizacion) {
          return user.id_organizacion;
        }
        
        // Si no, buscar la organización del usuario
        if (user?.id_usuario || user?.sub) {
          const userId = user.id_usuario || user.sub;
          const orgResponse = await apiClient.get(`/organizacion/by-user/${userId}`);
          if (orgResponse.data?.id_organizacion) {
            return orgResponse.data.id_organizacion;
          }
        }
        
        // Último recurso: buscar por email
        if (user?.email) {
          const response = await apiClient.get('/auth/profile');
          const profileData = response.data;
          if (profileData.organizacion?.id_organizacion) {
            return profileData.organizacion.id_organizacion;
          }
        }
        
        return null;
      } catch (error) {
        console.error('Error getting organization ID:', error);
        return null;
      }
    },

    async approveRequest(memberId, roleId = null) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      const orgId = await this.getOrganizationId();
      if (!orgId) {
        throw new Error('No se pudo obtener el ID de la organización');
      }

      try {
        const response = await apiClient.post(
          `/organizaciones/${orgId}/equipo/aprobar/${memberId}`,
          { id_rol_organizacion: roleId }
        );
        
        // Actualizar el miembro en el estado
        const index = this.members.findIndex(m => m.id_miembro === memberId);
        if (index !== -1) {
          this.members[index] = response.data;
        }
        
        notificationStore.showSnackbar('Solicitud aprobada correctamente', 'success');
        return response.data;
      } catch (error) {
        console.error('Error approving request:', error);
        this.error = error.response?.data?.message || 'Error al aprobar la solicitud';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async rejectRequest(memberId) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      const orgId = await this.getOrganizationId();
      if (!orgId) {
        throw new Error('No se pudo obtener el ID de la organización');
      }

      try {
        await apiClient.delete(`/organizaciones/${orgId}/equipo/${memberId}`);
        
        // Remover el miembro del estado
        this.members = this.members.filter(m => m.id_miembro !== memberId);
        
        notificationStore.showSnackbar('Solicitud rechazada', 'info');
      } catch (error) {
        console.error('Error rejecting request:', error);
        this.error = error.response?.data?.message || 'Error al rechazar la solicitud';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateMember(memberId, updateData) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      const orgId = await this.getOrganizationId();
      if (!orgId) {
        throw new Error('No se pudo obtener el ID de la organización');
      }

      try {
        const response = await apiClient.patch(
          `/organizaciones/${orgId}/equipo/${memberId}`,
          updateData
        );
        
        // Actualizar el miembro en el estado
        const index = this.members.findIndex(m => m.id_miembro === memberId);
        if (index !== -1) {
          this.members[index] = response.data;
        }
        
        notificationStore.showSnackbar('Miembro actualizado correctamente', 'success');
        return response.data;
      } catch (error) {
        console.error('Error updating member:', error);
        this.error = error.response?.data?.message || 'Error al actualizar el miembro';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeMember(memberId) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      const orgId = await this.getOrganizationId();
      if (!orgId) {
        throw new Error('No se pudo obtener el ID de la organización');
      }

      try {
        await apiClient.delete(`/organizaciones/${orgId}/equipo/${memberId}`);
        
        // Remover el miembro del estado
        this.members = this.members.filter(m => m.id_miembro !== memberId);
        
        notificationStore.showSnackbar('Miembro removido correctamente', 'success');
      } catch (error) {
        console.error('Error removing member:', error);
        this.error = error.response?.data?.message || 'Error al remover el miembro';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async sendInvitation(invitationData) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      const orgId = await this.getOrganizationId();
      if (!orgId) {
        throw new Error('No se pudo obtener el ID de la organización');
      }

      try {
        // TODO: Implementar endpoint de invitaciones
        // Por ahora, simular
        const newInvitation = {
          id: Date.now(),
          email: invitationData.email,
          id_rol_organizacion: invitationData.id_rol_organizacion,
          estado: 'pendiente',
          fecha_envio: new Date(),
        };
        
        this.invitations.push(newInvitation);
        notificationStore.showSnackbar('Invitación enviada correctamente', 'success');
        return newInvitation;
      } catch (error) {
        console.error('Error sending invitation:', error);
        this.error = error.response?.data?.message || 'Error al enviar la invitación';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cancelInvitation(invitationId) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();

      try {
        // TODO: Implementar endpoint de cancelación de invitaciones
        this.invitations = this.invitations.filter(i => i.id !== invitationId);
        notificationStore.showSnackbar('Invitación cancelada', 'info');
      } catch (error) {
        console.error('Error canceling invitation:', error);
        this.error = error.response?.data?.message || 'Error al cancelar la invitación';
        notificationStore.showSnackbar(this.error, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.members = [];
      this.invitations = [];
      this.error = null;
    },
  },
});

