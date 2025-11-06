import { defineStore } from 'pinia';
import apiClient from '@/plugins/axios';
import { useNotificationStore } from '@/stores/notificationStore';

// Función helper para mapear rol del backend al frontend
const mapRoleFromBackend = (rol) => ({
  id: rol.id_rol,
  id_rol: rol.id_rol,
  name: rol.nombre,
  nombre: rol.nombre,
  description: rol.descripcion || '',
  descripcion: rol.descripcion || '',
  tipo_rol: rol.tipo_rol || 'sistema',
  id_organizacion: rol.id_organizacion || null,
  id_proyecto: rol.id_proyecto || null,
  activo: rol.activo !== undefined ? rol.activo : true,
  color: '#2196F3' // Color por defecto (no se guarda en BD pero se usa en UI)
});

export const useRoleStore = defineStore('roleStore', {
  state: () => ({
    customRoles: [],
    systemRoles: [],
    organizationRoles: [],
    projectRoles: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchRoles(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const params = new URLSearchParams();
        if (filters.tipo_rol) params.append('tipo_rol', filters.tipo_rol);
        if (filters.id_organizacion) params.append('id_organizacion', filters.id_organizacion);
        if (filters.id_proyecto) params.append('id_proyecto', filters.id_proyecto);
        
        const url = `/roles${params.toString() ? '?' + params.toString() : ''}`;
        const response = await apiClient.get(url);
        
        // Mapear datos del backend al formato del frontend
        this.customRoles = response.data.map(mapRoleFromBackend);
      } catch (err) {
        console.error('Error fetching roles:', err);
        this.error = err.response?.data?.message || 'Error al cargar los roles.';
        const notificationStore = useNotificationStore();
        notificationStore.showSnackbar(this.error, 'error');
        this.customRoles = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchSystemRoles() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/roles/sistema');
        this.systemRoles = response.data.map(mapRoleFromBackend);
        return this.systemRoles;
      } catch (err) {
        console.error('Error fetching system roles:', err);
        this.error = err.response?.data?.message || 'Error al cargar los roles del sistema.';
        const notificationStore = useNotificationStore();
        notificationStore.showSnackbar(this.error, 'error');
        this.systemRoles = [];
        return [];
      } finally {
        this.loading = false;
      }
    },
    async fetchOrganizationRoles(orgId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get(`/roles/organizacion/${orgId}`);
        this.organizationRoles = response.data.map(mapRoleFromBackend);
        return this.organizationRoles;
      } catch (err) {
        console.error('Error fetching organization roles:', err);
        this.error = err.response?.data?.message || 'Error al cargar los roles de la organización.';
        const notificationStore = useNotificationStore();
        notificationStore.showSnackbar(this.error, 'error');
        this.organizationRoles = [];
        return [];
      } finally {
        this.loading = false;
      }
    },
    async fetchProjectRoles(projectId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get(`/roles/proyecto/${projectId}`);
        this.projectRoles = response.data.map(mapRoleFromBackend);
        return this.projectRoles;
      } catch (err) {
        console.error('Error fetching project roles:', err);
        this.error = err.response?.data?.message || 'Error al cargar los roles del proyecto.';
        const notificationStore = useNotificationStore();
        notificationStore.showSnackbar(this.error, 'error');
        this.projectRoles = [];
        return [];
      } finally {
        this.loading = false;
      }
    },
    async addRole(role) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      
      try {
        // Mapear datos del frontend al formato del backend
        const roleData = {
          nombre: role.name || role.nombre,
          descripcion: role.description || role.descripcion || '',
          tipo_rol: role.tipo_rol || 'sistema',
          activo: role.activo !== undefined ? role.activo : true
        };

        // Agregar campos condicionales solo si son necesarios y tienen valor
        if (roleData.tipo_rol === 'organizacion') {
          if (!role.id_organizacion && role.id_organizacion !== 0) {
            throw new Error('id_organizacion es requerido para roles de organización');
          }
          roleData.id_organizacion = role.id_organizacion;
        } else if (roleData.tipo_rol === 'proyecto') {
          if (!role.id_proyecto && role.id_proyecto !== 0) {
            throw new Error('id_proyecto es requerido para roles de proyecto');
          }
          roleData.id_proyecto = role.id_proyecto;
        }
        // Para tipo 'sistema', no incluimos id_organizacion ni id_proyecto en absoluto

        // Remover campos undefined/null que no son necesarios
        Object.keys(roleData).forEach(key => {
          if (roleData[key] === undefined || roleData[key] === null) {
            if (roleData.tipo_rol === 'sistema' && (key === 'id_organizacion' || key === 'id_proyecto')) {
              delete roleData[key];
            } else if (roleData.tipo_rol === 'organizacion' && key === 'id_proyecto') {
              delete roleData[key];
            } else if (roleData.tipo_rol === 'proyecto' && key === 'id_organizacion') {
              delete roleData[key];
            }
          }
        });

        console.log('Enviando datos de rol:', roleData); // Debug

        const response = await apiClient.post('/roles', roleData);
        
        // Mapear respuesta del backend al formato del frontend
        const newRole = mapRoleFromBackend(response.data);
        newRole.color = role.color || '#2196F3';
        
        this.customRoles.push(newRole);
        notificationStore.showSnackbar('Rol creado correctamente', 'success');
        return newRole;
      } catch (err) {
        console.error('Error adding role:', err);
        this.error = err.response?.data?.message || err.message || 'Error al crear el rol.';
        notificationStore.showSnackbar(this.error, 'error');
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updateRole(updatedRole) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      
      try {
        // Obtener el id_rol correcto
        const roleId = updatedRole.id_rol || updatedRole.id;
        
        if (!roleId) {
          throw new Error('ID del rol no encontrado');
        }

        // Mapear datos del frontend al formato del backend
        const roleData = {
          nombre: updatedRole.name || updatedRole.nombre,
          descripcion: updatedRole.description || updatedRole.descripcion || '',
          activo: updatedRole.activo !== undefined ? updatedRole.activo : true
        };

        // Usar PATCH en lugar de PUT
        const response = await apiClient.patch(`/roles/${roleId}`, roleData);
        
        // Mapear respuesta del backend al formato del frontend
        const updated = mapRoleFromBackend(response.data);
        updated.color = updatedRole.color || '#2196F3';
        
        const index = this.customRoles.findIndex(r => r.id === roleId || r.id_rol === roleId);
        if (index !== -1) {
          this.customRoles[index] = updated;
        }
        
        notificationStore.showSnackbar('Rol actualizado correctamente', 'success');
        return updated;
      } catch (err) {
        console.error('Error updating role:', err);
        this.error = err.response?.data?.message || 'Error al actualizar el rol.';
        notificationStore.showSnackbar(this.error, 'error');
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteRole(roleId) {
      this.loading = true;
      this.error = null;
      const notificationStore = useNotificationStore();
      
      try {
        await apiClient.delete(`/roles/${roleId}`);
        this.customRoles = this.customRoles.filter(r => r.id !== roleId && r.id_rol !== roleId);
        notificationStore.showSnackbar('Rol eliminado correctamente', 'success');
      } catch (err) {
        console.error('Error deleting role:', err);
        this.error = err.response?.data?.message || 'Error al eliminar el rol.';
        notificationStore.showSnackbar(this.error, 'error');
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});