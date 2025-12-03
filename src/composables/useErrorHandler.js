/**
 * Composable para manejo centralizado de errores
 */
import { useNotifications } from './useNotifications';
import { getErrorMessage, getContextualMessage, classifyError, ERROR_TYPES } from '@/utils/errorMessages';

export function useErrorHandler() {
  const { showError, showWarning } = useNotifications();

  /**
   * Maneja errores de forma consistente
   * @param {Error} error - Error a manejar
   * @param {string} defaultMessage - Mensaje por defecto si no hay mensaje en el error
   * @param {boolean} showNotification - Si se debe mostrar notificación
   * @param {string} action - Acción que falló (para mensaje contextual)
   */
  const handleError = (error, defaultMessage = null, showNotification = true, action = null) => {
    const errorInfo = getErrorMessage(error, defaultMessage);
    let message = errorInfo.message;

    // Usar mensaje contextual si se proporciona una acción
    if (action) {
      message = getContextualMessage(action, error);
    }

    // Log del error para debugging
    const errorType = classifyError(error);
    console.error('Error:', {
      type: errorType,
      message,
      error,
      response: error?.response,
      status: error?.response?.status,
      data: error?.response?.data,
      stack: error?.stack,
    });

    // Mostrar notificación si está habilitado
    if (showNotification) {
      if (errorType === ERROR_TYPES.TIMEOUT || errorType === ERROR_TYPES.NETWORK) {
        showWarning(message);
      } else {
        showError(message);
      }
    }

    return {
      message,
      type: errorType,
      ...errorInfo
    };
  };

  /**
   * Maneja errores de validación
   * @param {Error} error - Error de validación
   * @returns {Object} - Objeto con los errores de validación
   */
  const handleValidationError = (error) => {
    const validationErrors = {};

    if (error?.response?.data?.errors) {
      // Errores de validación del backend (ej: class-validator)
      const errors = error.response.data.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err) => {
          if (err.property && err.constraints) {
            validationErrors[err.property] = Object.values(err.constraints)[0];
          }
        });
      }
    } else if (error?.response?.data?.message) {
      // Mensaje general de error
      validationErrors._general = error.response.data.message;
    }

    return validationErrors;
  };

  /**
   * Maneja errores de red
   * @param {Error} error - Error de red
   * @param {string} action - Acción que falló
   */
  const handleNetworkError = (error, action = null) => {
    const errorType = classifyError(error);
    
    if (errorType === ERROR_TYPES.NETWORK || !navigator.onLine) {
      return handleError(
        error,
        'No hay conexión a internet. Por favor, verifica tu conexión.',
        true,
        action
      );
    }

    if (errorType === ERROR_TYPES.TIMEOUT) {
      return handleError(
        error,
        'La petición tardó demasiado. Por favor, intenta nuevamente.',
        true,
        action
      );
    }

    return handleError(error, 'Error de conexión. Por favor, intenta nuevamente.', true, action);
  };

  /**
   * Maneja errores de autenticación
   * @param {Error} error - Error de autenticación
   * @param {Object} router - Instancia del router (opcional)
   */
  const handleAuthError = (error, router = null) => {
    const errorType = classifyError(error);
    
    if (errorType === ERROR_TYPES.AUTH || error?.response?.status === 401) {
      // Redirigir al login si no está autenticado
      if (router) {
        router.push('/auth/login');
      }
      const errorInfo = getErrorMessage(error);
      return handleError(error, errorInfo.message, true);
    }

    if (errorType === ERROR_TYPES.PERMISSION || error?.response?.status === 403) {
      const errorInfo = getErrorMessage(error);
      return handleError(error, errorInfo.message, true);
    }

    return handleError(error);
  };

  /**
   * Retry con exponential backoff
   * @param {Function} fn - Función a reintentar
   * @param {number} maxRetries - Número máximo de reintentos
   * @param {number} initialDelay - Delay inicial en ms
   * @returns {Promise} Resultado de la función
   */
  const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const errorType = classifyError(error);
        
        // No reintentar errores de autenticación o permisos
        if (errorType === ERROR_TYPES.AUTH || errorType === ERROR_TYPES.PERMISSION) {
          throw error;
        }
        
        // Si es el último intento, lanzar el error
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Calcular delay con exponential backoff
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  };

  return {
    handleError,
    handleValidationError,
    handleNetworkError,
    handleAuthError,
    retryWithBackoff,
    classifyError,
    getErrorMessage,
  };
}

