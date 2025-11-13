/**
 * Configuración global de la aplicación
 */

export const APP_CONFIG = {
  // Información de la aplicación
  APP_NAME: 'AfroImpacto',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Plataforma de gestión de proyectos de impacto social',

  // Configuración de API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  API_TIMEOUT: 30000, // 30 segundos

  // Configuración de paginación
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

  // Configuración de notificaciones
  NOTIFICATION_DURATION: 3000, // 3 segundos
  NOTIFICATION_SUCCESS_DURATION: 2000,
  NOTIFICATION_ERROR_DURATION: 5000,

  // Configuración de validación
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],

  // Configuración de fechas
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY_DATE_FORMAT: 'DD/MM/YYYY',
  DISPLAY_DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',

  // Configuración de moneda
  CURRENCY: 'COP',
  CURRENCY_SYMBOL: '$',
  CURRENCY_DECIMALS: 2,

  // Configuración de temas
  THEME: {
    DEFAULT: 'light',
    AVAILABLE: ['light', 'dark'],
  },

  // Configuración de idiomas
  LANGUAGE: {
    DEFAULT: 'es',
    AVAILABLE: ['es', 'en'],
  },

  // Configuración de roles
  ROLES: {
    SYSTEM: 'sistema',
    ORGANIZATION: 'organizacion',
    PROJECT: 'proyecto',
  },

  // Configuración de estados de proyecto
  PROJECT_STATUS: {
    DRAFT: 'borrador',
    ACTIVE: 'activo',
    PAUSED: 'pausado',
    COMPLETED: 'completado',
    CANCELLED: 'cancelado',
  },

  // Configuración de estados de tarea
  TASK_STATUS: {
    PENDING: 'pendiente',
    IN_PROGRESS: 'en_progreso',
    COMPLETED: 'completada',
    CANCELLED: 'cancelada',
  },

  // Configuración de prioridades
  PRIORITIES: {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
  },

  // Configuración de complejidad
  COMPLEXITY: {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
  },
};

/**
 * Configuración de desarrollo
 */
export const DEV_CONFIG = {
  ENABLE_LOGGING: import.meta.env.DEV,
  ENABLE_DEVTOOLS: import.meta.env.DEV,
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',
};

/**
 * Configuración de producción
 */
export const PROD_CONFIG = {
  ENABLE_LOGGING: false,
  ENABLE_DEVTOOLS: false,
  MOCK_API: false,
};

/**
 * Obtiene la configuración según el entorno
 */
export const getConfig = () => {
  return import.meta.env.PROD ? PROD_CONFIG : DEV_CONFIG;
};

