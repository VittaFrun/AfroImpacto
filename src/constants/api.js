/**
 * Constantes de endpoints de API
 * Centraliza todos los endpoints para facilitar mantenimiento
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Usuarios
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },

  // Proyectos
  PROJECTS: {
    BASE: '/proyecto',
    BY_ID: (id) => `/proyecto/${id}`,
    CREATE: '/proyecto',
    UPDATE: (id) => `/proyecto/${id}`,
    DELETE: (id) => `/proyecto/${id}`,
    BY_VOLUNTEER: '/proyecto/voluntario',
    BY_ORGANIZATION: '/proyecto/organizacion',
  },

  // Fases
  PHASES: {
    BASE: '/fase',
    BY_ID: (id) => `/fase/${id}`,
    BY_PROJECT: (projectId) => `/fase/proyecto/${projectId}`,
    CREATE: '/fase',
    UPDATE: (id) => `/fase/${id}`,
    DELETE: (id) => `/fase/${id}`,
  },

  // Tareas
  TASKS: {
    BASE: '/tarea',
    BY_ID: (id) => `/tarea/${id}`,
    BY_PHASE: (phaseId) => `/tarea/fase/${phaseId}`,
    CREATE: '/tarea',
    UPDATE: (id) => `/tarea/${id}`,
    DELETE: (id) => `/tarea/${id}`,
  },

  // Voluntarios
  VOLUNTEERS: {
    BASE: '/voluntario',
    BY_ID: (id) => `/voluntario/${id}`,
    ME: '/voluntario/me',
    BY_PROJECT: (projectId) => `/voluntario/proyecto/${projectId}`,
  },

  // Organizaciones
  ORGANIZATIONS: {
    BASE: '/organizacion',
    BY_ID: (id) => `/organizacion/${id}`,
    ME: '/organizacion/me',
    UPDATE: (id) => `/organizacion/${id}`,
  },

  // Asignaciones
  ASSIGNMENTS: {
    BASE: '/asignacion',
    BY_ID: (id) => `/asignacion/${id}`,
    CREATE: '/asignacion',
    UPDATE: (id) => `/asignacion/${id}`,
    DELETE: (id) => `/asignacion/${id}`,
    BY_VOLUNTEER_PROJECT: (projectId) => `/asignacion/voluntario/proyecto/${projectId}`,
  },

  // Roles
  ROLES: {
    BASE: '/roles',
    BY_ID: (id) => `/roles/${id}`,
    CREATE: '/roles',
    UPDATE: (id) => `/roles/${id}`,
    DELETE: (id) => `/roles/${id}`,
    BY_ORGANIZATION: (orgId) => `/roles/organizacion/${orgId}`,
    BY_PROJECT: (projectId) => `/roles/proyecto/${projectId}`,
  },

  // Solicitudes de inscripción
  ENROLLMENT_REQUESTS: {
    BASE: '/solicitud-inscripcion',
    BY_ID: (id) => `/solicitud-inscripcion/${id}`,
    CREATE: '/solicitud-inscripcion',
    UPDATE: (id) => `/solicitud-inscripcion/${id}`,
    BY_PROJECT: (projectId) => `/solicitud-inscripcion/proyecto/${projectId}`,
    BY_VOLUNTEER: '/solicitud-inscripcion/voluntario',
  },

  // Horas voluntariadas
  VOLUNTEER_HOURS: {
    BASE: '/horas-voluntariadas',
    BY_ID: (id) => `/horas-voluntariadas/${id}`,
    CREATE: '/horas-voluntariadas',
    UPDATE: (id) => `/horas-voluntariadas/${id}`,
    DELETE: (id) => `/horas-voluntariadas/${id}`,
    MY_HOURS: '/horas-voluntariadas/mis-horas',
    BY_PROJECT: (projectId) => `/horas-voluntariadas/proyecto/${projectId}/todas`,
    VERIFY: (id) => `/horas-voluntariadas/${id}/verificar`,
  },

  // Donaciones
  DONATIONS: {
    BASE: '/donacion',
    BY_ID: (id) => `/donacion/${id}`,
    CREATE: '/donacion',
    UPDATE: (id) => `/donacion/${id}`,
    DELETE: (id) => `/donacion/${id}`,
  },

  // Estados
  STATES: {
    BASE: '/estado',
    BY_ID: (id) => `/estado/${id}`,
  },
};

/**
 * Helper para construir URLs completas
 */
export const buildApiUrl = (endpoint) => {
  if (typeof endpoint === 'function') {
    return endpoint;
  }
  return `${API_BASE}${endpoint}`;
};

