import { defineStore } from 'pinia';

export const useRoleStore = defineStore('roleStore', {
  state: () => ({
    customRoles: [
      { id: 1, name: 'Líder de Proyecto', color: '#4CAF50' },
      { id: 2, name: 'Desarrollador', color: '#2196F3' },
      { id: 3, name: 'Diseñador', color: '#FFC107' },
    ],
  }),
  actions: {
    addRole(role) {
      const newId = Math.max(...this.customRoles.map(r => r.id), 0) + 1;
      this.customRoles.push({ ...role, id: newId });
    },
    updateRole(updatedRole) {
      const index = this.customRoles.findIndex(r => r.id === updatedRole.id);
      if (index !== -1) {
        this.customRoles[index] = updatedRole;
      }
    },
    deleteRole(roleId) {
      this.customRoles = this.customRoles.filter(r => r.id !== roleId);
    },
  },
});