/**
 * Mensajes de error centralizados y amigables
 */

export const ERROR_TYPES = {
  NETWORK: 'network',
  SERVER: 'server',
  AUTH: 'auth',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown'
};

export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: {
    title: 'Problema de Conexión',
    message: 'No se pudo establecer conexión con el servidor. Verifica tu conexión a internet e intenta nuevamente.',
    icon: 'mdi-wifi-off',
    action: 'Reintentar'
  },
  [ERROR_TYPES.SERVER]: {
    title: 'Error del Servidor',
    message: 'El servidor está experimentando problemas. Por favor, intenta más tarde o contacta al soporte.',
    icon: 'mdi-server-network-off',
    action: 'Reintentar'
  },
  [ERROR_TYPES.AUTH]: {
    title: 'Sesión Expirada',
    message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar.',
    icon: 'mdi-lock-alert',
    action: 'Iniciar Sesión'
  },
  [ERROR_TYPES.VALIDATION]: {
    title: 'Error de Validación',
    message: 'Por favor, verifica que todos los campos estén completos y sean válidos.',
    icon: 'mdi-alert-circle',
    action: 'Revisar'
  },
  [ERROR_TYPES.PERMISSION]: {
    title: 'Sin Permisos',
    message: 'No tienes permisos para realizar esta acción. Contacta al administrador si crees que esto es un error.',
    icon: 'mdi-shield-alert',
    action: 'Entendido'
  },
  [ERROR_TYPES.NOT_FOUND]: {
    title: 'No Encontrado',
    message: 'El recurso que buscas no existe o ha sido eliminado.',
    icon: 'mdi-file-question',
    action: 'Volver'
  },
  [ERROR_TYPES.TIMEOUT]: {
    title: 'Tiempo de Espera Agotado',
    message: 'El servidor tardó demasiado en responder. Verifica tu conexión e intenta nuevamente.',
    icon: 'mdi-timer-off',
    action: 'Reintentar'
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: 'Error Desconocido',
    message: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente o contacta al soporte.',
    icon: 'mdi-alert',
    action: 'Reintentar'
  }
};

/**
 * Clasifica un error y retorna su tipo
 * @param {Error|Object} error - Error a clasificar
 * @returns {string} Tipo de error
 */
export function classifyError(error) {
  if (!error) return ERROR_TYPES.UNKNOWN;

  // Error de red
  if (!navigator.onLine) {
    return ERROR_TYPES.NETWORK;
  }

  // Error de timeout
  if (error.code === 'ECONNABORTED' || 
      error.message?.toLowerCase().includes('timeout') ||
      error.message?.toLowerCase().includes('tiempo de espera')) {
    return ERROR_TYPES.TIMEOUT;
  }

  // Error de respuesta HTTP
  if (error.response) {
    const status = error.response.status;

    if (status === 401) {
      return ERROR_TYPES.AUTH;
    }

    if (status === 403) {
      return ERROR_TYPES.PERMISSION;
    }

    if (status === 404) {
      return ERROR_TYPES.NOT_FOUND;
    }

    if (status === 422 || status === 400) {
      // Verificar si es error de validación
      if (error.response.data?.errors || error.response.data?.message?.toLowerCase().includes('valid')) {
        return ERROR_TYPES.VALIDATION;
      }
    }

    if (status >= 500) {
      return ERROR_TYPES.SERVER;
    }
  }

  // Error de red (sin respuesta)
  if (error.request && !error.response) {
    return ERROR_TYPES.NETWORK;
  }

  // Error de validación por mensaje
  if (error.message?.toLowerCase().includes('valid') || 
      error.message?.toLowerCase().includes('requerido')) {
    return ERROR_TYPES.VALIDATION;
  }

  return ERROR_TYPES.UNKNOWN;
}

/**
 * Obtiene el mensaje de error amigable
 * @param {Error|Object} error - Error
 * @param {string} defaultMessage - Mensaje por defecto
 * @returns {Object} Objeto con title, message, icon, action
 */
export function getErrorMessage(error, defaultMessage = null) {
  const errorType = classifyError(error);
  const errorInfo = ERROR_MESSAGES[errorType];

  // Si hay un mensaje específico del backend, usarlo
  let message = errorInfo.message;
  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message && errorType === ERROR_TYPES.UNKNOWN) {
    message = error.message;
  } else if (defaultMessage) {
    message = defaultMessage;
  }

  return {
    ...errorInfo,
    message,
    type: errorType
  };
}

/**
 * Obtiene un mensaje contextual basado en la acción
 * @param {string} action - Acción que falló (ej: 'crear proyecto', 'cargar datos')
 * @param {Error|Object} error - Error
 * @returns {string} Mensaje contextual
 */
export function getContextualMessage(action, error) {
  const errorType = classifyError(error);
  const baseMessage = getErrorMessage(error);

  const actionMessages = {
    'crear': `No se pudo crear ${action}. ${baseMessage.message}`,
    'actualizar': `No se pudo actualizar ${action}. ${baseMessage.message}`,
    'eliminar': `No se pudo eliminar ${action}. ${baseMessage.message}`,
    'cargar': `No se pudieron cargar ${action}. ${baseMessage.message}`,
    'guardar': `No se pudo guardar ${action}. ${baseMessage.message}`,
    'enviar': `No se pudo enviar ${action}. ${baseMessage.message}`
  };

  for (const [key, msg] of Object.entries(actionMessages)) {
    if (action.toLowerCase().includes(key)) {
      return msg;
    }
  }

  return baseMessage.message;
}

