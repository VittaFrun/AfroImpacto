/**
 * Constantes de rutas de la aplicación
 * Centraliza todas las rutas para facilitar mantenimiento
 */

export const ROUTES = {
  // Rutas públicas
  HOME: '/',
  PUBLIC_PROJECTS: '/projects',
  
  // Rutas de autenticación
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },

  // Rutas de organización
  ORGANIZATION: {
    BASE: '/organization',
    DASHBOARD: '/organization/dashboard',
    PROJECTS: '/organization/dashboard/projects',
    CREATE_PROJECT: '/organization/dashboard/projects/create',
    PROJECT_DETAIL: (id) => `/organization/dashboard/projects/${id}`,
    VOLUNTEERS: '/organization/dashboard/volunteers',
    INVITE_VOLUNTEER: '/organization/dashboard/volunteers/invite',
    DONATIONS: '/organization/dashboard/donations',
    CREATE_DONATION: '/organization/dashboard/donations/create',
    REPORTS: '/organization/dashboard/reports',
    ANALYTICS: '/organization/dashboard/analytics',
    SETTINGS: '/organization/dashboard/settings',
  },

  // Rutas de voluntario
  VOLUNTEER: {
    BASE: '/volunteer',
    DASHBOARD: '/volunteer/dashboard',
    MY_PROJECTS: '/volunteer/my-projects',
    PROJECTS: '/volunteer/projects',
    PROJECT_WORKSPACE: (id) => `/volunteer/projects/${id}/workspace`,
    CATALOG: '/volunteer/catalog',
    PROJECT_CATALOG: '/volunteer/catalog', // Alias para compatibilidad
    PROFILE: '/volunteer/profile',
    AVAILABILITY: '/volunteer/availability',
    SETTINGS: '/volunteer/settings',
  },

  // Rutas de error
  ERROR: {
    NOT_FOUND: '/404',
    GENERIC_ERROR: '/error',
  },
};

/**
 * Helper para construir rutas con parámetros
 */
export const buildRoute = (route, params = {}) => {
  let builtRoute = route;
  Object.keys(params).forEach((key) => {
    builtRoute = builtRoute.replace(`:${key}`, params[key]);
  });
  return builtRoute;
};

