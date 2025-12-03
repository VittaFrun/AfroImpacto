/**
 * Guard para verificar permisos antes de acceder a rutas
 */
import { usePermissions } from '@/composables/usePermissions';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useTeamStore } from '@/features/organization/team/stores/teamStore';

/**
 * Crea un guard que requiere un permiso específico
 * @param {string|string[]} requiredPermission - Permiso(s) requerido(s)
 * @param {Object} options - Opciones adicionales
 * @returns {Function} Guard function
 */
export function requirePermission(requiredPermission, options = {}) {
  return async (to, from, next) => {
    const authStore = useAuthStore();
    const teamStore = useTeamStore();
    
    // Verificar autenticación
    if (!authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }

    // Si el usuario es el dueño de la organización, tiene todos los permisos
    if (authStore.userRole === 'organizacion') {
      const orgId = await teamStore.getOrganizationId();
      if (orgId) {
        const { isOrganizationOwner } = usePermissions();
        if (isOrganizationOwner.value) {
          next();
          return;
        }
      }
    }

    // Obtener el ID de la organización de la ruta o del usuario
    let orgId = to.params.orgId || to.params.id;
    if (!orgId && authStore.userRole === 'organizacion') {
      orgId = await teamStore.getOrganizationId();
    }

    if (!orgId) {
      // Si no hay orgId y se requiere permiso, denegar acceso
      if (options.redirectOnFail !== false) {
        next({ name: 'organization-dashboard' });
      } else {
        next(false);
      }
      return;
    }

    // Inicializar permisos
    const { initializePermissions, hasPermission, hasAnyPermission } = usePermissions();
    await initializePermissions(orgId);

    // Verificar permiso
    const hasAccess = Array.isArray(requiredPermission)
      ? hasAnyPermission(requiredPermission)
      : hasPermission(requiredPermission);

    if (hasAccess) {
      next();
    } else {
      // No tiene permisos
      if (options.redirectOnFail !== false) {
        const redirectTo = options.redirectTo || 'organization-dashboard';
        next({ name: redirectTo });
      } else {
        next(false);
      }
    }
  };
}

/**
 * Guard que requiere ser dueño de la organización
 */
export function requireOrganizationOwner() {
  return async (to, from, next) => {
    const authStore = useAuthStore();
    
    if (!authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }

    if (authStore.userRole !== 'organizacion') {
      next({ name: 'organization-dashboard' });
      return;
    }

    // Verificar que es el dueño
    const teamStore = useTeamStore();
    const orgId = await teamStore.getOrganizationId();
    
    if (orgId) {
      const { isOrganizationOwner } = usePermissions();
      if (isOrganizationOwner.value) {
        next();
      } else {
        next({ name: 'organization-dashboard' });
      }
    } else {
      next({ name: 'organization-dashboard' });
    }
  };
}

