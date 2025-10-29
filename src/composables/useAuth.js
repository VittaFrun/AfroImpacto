import { computed } from 'vue';
import { useAuthStore } from '@/features/auth/stores/authStore';

export function useAuth() {
  const authStore = useAuthStore();

  // Computed properties for easy access
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const userRole = computed(() => authStore.userRole);
  const userId = computed(() => authStore.userId);
  const userEmail = computed(() => authStore.userEmail);
  const userName = computed(() => authStore.userName);
  const loading = computed(() => authStore.loading);
  const error = computed(() => authStore.error);

  // Role checks
  const isAdmin = computed(() => authStore.isAdmin);
  const isOrganization = computed(() => authStore.isOrganization);
  const isVolunteer = computed(() => authStore.isVolunteer);

  // Permission checks
  const canManageProjects = computed(() => authStore.canManageProjects);
  const canViewProjects = computed(() => authStore.canViewProjects);
  const canJoinProjects = computed(() => authStore.canJoinProjects);
  const canCreateProjects = computed(() => authStore.canCreateProjects);
  const canManageUsers = computed(() => authStore.canManageUsers);
  const canViewDashboard = computed(() => authStore.canViewDashboard);

  // Auth actions
  const login = authStore.login;
  const logout = authStore.logout;
  const register = authStore.register;
  const checkAuth = authStore.checkAuth;
  const refreshUserData = authStore.refreshUserData;
  const updateProfile = authStore.updateProfile;
  const changePassword = authStore.changePassword;

  // Permission helpers
  const hasPermission = authStore.hasPermission;
  const hasRole = authStore.hasRole;
  const hasAnyRole = authStore.hasAnyRole;
  const checkTokenExpiry = authStore.checkTokenExpiry;
  const isTokenExpired = authStore.isTokenExpired;

  // Helper functions for common use cases
  const requireAuth = (callback) => {
    if (!isAuthenticated.value) {
      throw new Error('Authentication required');
    }
    return callback();
  };

  const requireRole = (role, callback) => {
    if (!hasRole(role)) {
      throw new Error(`Role '${role}' required`);
    }
    return callback();
  };

  const requirePermission = (permission, callback) => {
    if (!hasPermission(permission)) {
      throw new Error(`Permission '${permission}' required`);
    }
    return callback();
  };

  const requireAnyRole = (roles, callback) => {
    if (!hasAnyRole(roles)) {
      throw new Error(`One of roles [${roles.join(', ')}] required`);
    }
    return callback();
  };

  // Navigation helpers
  const getDefaultRoute = () => {
    if (!isAuthenticated.value) return '/auth/login';
    
    switch (userRole.value) {
      case 'admin':
        return '/admin/dashboard';
      case 'organizacion':
        return '/organization/dashboard';
      case 'voluntario':
        return '/volunteer/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getDashboardRoute = () => {
    switch (userRole.value) {
      case 'admin':
        return '/admin/dashboard';
      case 'organizacion':
        return '/organization/dashboard';
      case 'voluntario':
        return '/volunteer/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getProjectsRoute = () => {
    switch (userRole.value) {
      case 'admin':
      case 'organizacion':
        return '/organization/projects';
      case 'voluntario':
        return '/volunteer/projects';
      default:
        return '/projects';
    }
  };

  const getCatalogRoute = () => {
    return '/volunteer/catalog';
  };

  return {
    // State
    user,
    isAuthenticated,
    userRole,
    userId,
    userEmail,
    userName,
    loading,
    error,
    
    // Role checks
    isAdmin,
    isOrganization,
    isVolunteer,
    
    // Permission checks
    canManageProjects,
    canViewProjects,
    canJoinProjects,
    canCreateProjects,
    canManageUsers,
    canViewDashboard,
    
    // Auth actions
    login,
    logout,
    register,
    checkAuth,
    refreshUserData,
    updateProfile,
    changePassword,
    
    // Permission helpers
    hasPermission,
    hasRole,
    hasAnyRole,
    checkTokenExpiry,
    isTokenExpired,
    
    // Helper functions
    requireAuth,
    requireRole,
    requirePermission,
    requireAnyRole,
    
    // Navigation helpers
    getDefaultRoute,
    getDashboardRoute,
    getProjectsRoute,
    getCatalogRoute,
  };
}

