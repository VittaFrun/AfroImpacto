import { defineStore } from 'pinia';
import axios from '@/plugins/axios';

export const useRoleStore = defineStore('roleStore', {
  state: () => ({
    customRoles: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchRoles() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/roles');
        this.customRoles = response.data;
      } catch (err) {
        console.error('Error fetching roles:', err);
        this.error = 'Failed to fetch roles.';
        this.customRoles = [];
      } finally {
        this.loading = false;
      }
    },
    async addRole(role) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/roles', role);
        this.customRoles.push(response.data);
      } catch (err) {
        console.error('Error adding role:', err);
        this.error = 'Failed to add role.';
      } finally {
        this.loading = false;
      }
    },
    async updateRole(updatedRole) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`/roles/${updatedRole.id}`, updatedRole);
        const index = this.customRoles.findIndex(r => r.id === updatedRole.id);
        if (index !== -1) {
          this.customRoles[index] = response.data;
        }
      } catch (err) {
        console.error('Error updating role:', err);
        this.error = 'Failed to update role.';
      } finally {
        this.loading = false;
      }
    },
    async deleteRole(roleId) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`/roles/${roleId}`);
        this.customRoles = this.customRoles.filter(r => r.id !== roleId);
      } catch (err) {
        console.error('Error deleting role:', err);
        this.error = 'Failed to delete role.';
      } finally {
        this.loading = false;
      }
    },
  },
});