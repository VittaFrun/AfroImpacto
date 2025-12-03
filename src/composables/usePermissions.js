/**
 * Composable para manejo de permisos basado en roles de organización
 * Integra con teamStore para verificar permisos del usuario actual
 */
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useTeamStore } from '@/features/organization/team/stores/teamStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';
import apiClient from '@/plugins/axios';

export function usePermissions() {
  const authStore = useAuthStore();
  const teamStore = useTeamStore();
  const roleStore = useRoleStore();
  
  const currentMember = ref(null);
  const currentRole = ref(null);
  const permissions = ref([]);
  const loading = ref(false);

  // Verificar si el usuario es el dueño de la organización
  const isOrganizationOwner = computed(() => {
    if (!authStore.user) return false;
    const user = authStore.user;
    return user.tipo_usuario === 'organizacion' && 
           (user.organizacion?.id_organizacion || user.id_organizacion);
  });

  // Obtener el miembro actual del equipo
  const getCurrentMember = async (orgId) => {
    if (!orgId || !authStore.user) return null;
    
    try {
      // Si es el dueño de la organización, tiene todos los permisos
      if (isOrganizationOwner.value) {
        return { isOwner: true };
      }

      // Buscar si el usuario es miembro del equipo
      const members = await teamStore.fetchTeamMembers(orgId);
      const userId = authStore.userId;
      
      const member = members.find(m => 
        m.id_voluntario === userId || 
        m.voluntario?.id_voluntario === userId ||
        m.voluntario?.id_usuario === userId
      );

      return member || null;
    } catch (error) {
      console.error('Error getting current member:', error);
      return null;
    }
  };

  // Cargar permisos del rol actual
  const loadPermissions = async (roleId) => {
    if (!roleId) {
      permissions.value = [];
      return;
    }

    loading.value = true;
    try {
      const response = await apiClient.get(`/roles/${roleId}/permisos`);
      permissions.value = response.data.map(p => p.nombre || p.id_permiso);
    } catch (error) {
      console.error('Error loading permissions:', error);
      permissions.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Inicializar permisos para una organización
  const initializePermissions = async (orgId) => {
    if (!orgId) return;

    loading.value = true;
    try {
      const member = await getCurrentMember(orgId);
      currentMember.value = member;

      if (member?.isOwner) {
        // El dueño tiene todos los permisos
        permissions.value = ['*']; // Wildcard para todos los permisos
        currentRole.value = { nombre: 'Dueño', isOwner: true };
      } else if (member?.id_rol_organizacion) {
        // Cargar el rol y sus permisos
        currentRole.value = roleStore.organizationRoles.find(
          r => r.id_rol === member.id_rol_organizacion
        );
        
        if (!currentRole.value) {
          // Si no está en el store, cargarlo
          await roleStore.fetchOrganizationRoles(orgId);
          currentRole.value = roleStore.organizationRoles.find(
            r => r.id_rol === member.id_rol_organizacion
          );
        }

        if (currentRole.value?.id_rol) {
          await loadPermissions(currentRole.value.id_rol);
        }
      } else {
        permissions.value = [];
        currentRole.value = null;
      }
    } catch (error) {
      console.error('Error initializing permissions:', error);
      permissions.value = [];
      currentRole.value = null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param {string} permission - Nombre del permiso a verificar
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    // El dueño tiene todos los permisos
    if (permissions.value.includes('*')) {
      return true;
    }

    // Verificar si tiene el permiso específico
    return permissions.value.includes(permission);
  };

  /**
   * Verifica si el usuario tiene alguno de los permisos especificados
   * @param {string[]} permissionList - Lista de permisos a verificar
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionList) => {
    if (!Array.isArray(permissionList)) return false;
    return permissionList.some(permission => hasPermission(permission));
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   * @param {string[]} permissionList - Lista de permisos a verificar
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionList) => {
    if (!Array.isArray(permissionList)) return false;
    return permissionList.every(permission => hasPermission(permission));
  };

  /**
   * Verifica si el usuario puede realizar una acción específica
   * @param {string} action - Acción a verificar (ej: 'create.project', 'edit.team')
   * @returns {boolean}
   */
  const can = (action) => {
    return hasPermission(action);
  };

  // Permisos comunes predefinidos
  const PERMISSIONS = {
    // Proyectos
    VIEW_PROJECTS: 'ver_proyectos',
    CREATE_PROJECTS: 'crear_proyectos',
    EDIT_PROJECTS: 'editar_proyectos',
    DELETE_PROJECTS: 'eliminar_proyectos',
    PUBLISH_PROJECTS: 'publicar_proyectos',
    
    // Equipo
    VIEW_TEAM: 'ver_equipo',
    MANAGE_TEAM: 'gestionar_equipo',
    INVITE_MEMBERS: 'invitar_miembros',
    REMOVE_MEMBERS: 'remover_miembros',
    APPROVE_REQUESTS: 'aprobar_solicitudes',
    
    // Roles
    VIEW_ROLES: 'ver_roles',
    MANAGE_ROLES: 'gestionar_roles',
    ASSIGN_ROLES: 'asignar_roles',
    
    // Voluntarios
    VIEW_VOLUNTEERS: 'ver_voluntarios',
    MANAGE_VOLUNTEERS: 'gestionar_voluntarios',
    ASSIGN_TASKS: 'asignar_tareas',
    
    // Donaciones
    VIEW_DONATIONS: 'ver_donaciones',
    MANAGE_DONATIONS: 'gestionar_donaciones',
    
    // Reportes
    VIEW_REPORTS: 'ver_reportes',
    EXPORT_REPORTS: 'exportar_reportes',
    
    // Configuración
    VIEW_SETTINGS: 'ver_configuracion',
    EDIT_SETTINGS: 'editar_configuracion',
    MANAGE_PROFILE: 'gestionar_perfil'
  };

  return {
    // State
    currentMember,
    currentRole,
    permissions,
    loading,
    isOrganizationOwner,

    // Methods
    initializePermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
    getCurrentMember,
    loadPermissions,

    // Constants
    PERMISSIONS
  };
}

