import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

export function createAuthGuard() {
  const { isAuthenticated, userRole, hasPermission, hasRole, hasAnyRole } = useAuth();
  const router = useRouter();

  return {
    // Require authentication
    requireAuth: (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      next();
    },

    // Require specific role
    requireRole: (role) => (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasRole(role)) {
        next('/unauthorized');
        return;
      }
      
      next();
    },

    // Require any of multiple roles
    requireAnyRole: (roles) => (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasAnyRole(roles)) {
        next('/unauthorized');
        return;
      }
      
      next();
    },

    // Require specific permission
    requirePermission: (permission) => (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasPermission(permission)) {
        next('/unauthorized');
        return;
      }
      
      next();
    },

    // Redirect authenticated users away from auth pages
    redirectIfAuthenticated: (to, from, next) => {
      if (isAuthenticated.value) {
        // Redirect to appropriate dashboard based on role
        const dashboardRoutes = {
          'admin': '/admin/dashboard',
          'organizacion': '/organization/dashboard',
          'voluntario': '/volunteer/dashboard'
        };
        
        const defaultRoute = dashboardRoutes[userRole.value] || '/dashboard';
        next(defaultRoute);
        return;
      }
      
      next();
    },

    // Redirect to appropriate dashboard based on role
    redirectToDashboard: (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      const dashboardRoutes = {
        'admin': '/admin/dashboard',
        'organizacion': '/organization/dashboard',
        'voluntario': '/volunteer/dashboard'
      };
      
      const dashboardRoute = dashboardRoutes[userRole.value];
      if (dashboardRoute && to.path !== dashboardRoute) {
        next(dashboardRoute);
        return;
      }
      
      next();
    },

    // Check if user can access project management
    canManageProjects: (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasPermission('manage.projects')) {
        next('/unauthorized');
        return;
      }
      
      next();
    },

    // Check if user can view projects
    canViewProjects: (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasPermission('view.projects')) {
        next('/unauthorized');
        return;
      }
      
      next();
    },

    // Check if user can join projects
    canJoinProjects: (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasPermission('join.projects')) {
        next('/unauthorized');
        return;
      }
      
      next();
    },

    // Check if user can create projects
    canCreateProjects: (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasPermission('create.projects')) {
        next('/unauthorized');
        return;
      }
      
      next();
    },

    // Check if user can manage users (admin only)
    canManageUsers: (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasPermission('manage.users')) {
        next('/unauthorized');
        return;
      }
      
      next();
    },

    // Check if user can view dashboard
    canViewDashboard: (to, from, next) => {
      if (!isAuthenticated.value) {
        next('/auth/login');
        return;
      }
      
      if (!hasPermission('view.dashboard')) {
        next('/unauthorized');
        return;
      }
      
      next();
    }
  };
}

// Export individual guards for easy use
export const authGuards = createAuthGuard();

