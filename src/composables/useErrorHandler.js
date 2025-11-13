/**
 * Composable para manejo centralizado de errores
 */
import { useNotificationStore } from '@/stores/notificationStore';

export function useErrorHandler() {
  const notificationStore = useNotificationStore();

  /**
   * Maneja errores de forma consistente
   * @param {Error} error - Error a manejar
   * @param {string} defaultMessage - Mensaje por defecto si no hay mensaje en el error
   * @param {boolean} showNotification - Si se debe mostrar notificación
   */
  const handleError = (error, defaultMessage = 'Ha ocurrido un error', showNotification = true) => {
    let message = defaultMessage;

    // Extraer mensaje del error
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Log del error para debugging
    console.error('Error:', {
      message,
      error,
      response: error?.response,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    // Mostrar notificación si está habilitado
    if (showNotification) {
      notificationStore.showSnackbar(message, 'error');
    }

    return message;
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
   */
  const handleNetworkError = (error) => {
    if (!navigator.onLine) {
      return handleError(
        new Error('No hay conexión a internet. Por favor, verifica tu conexión.'),
        'Sin conexión',
        true
      );
    }

    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return handleError(
        new Error('La petición tardó demasiado. Por favor, intenta nuevamente.'),
        'Timeout',
        true
      );
    }

    return handleError(error, 'Error de conexión. Por favor, intenta nuevamente.');
  };

  /**
   * Maneja errores de autenticación
   * @param {Error} error - Error de autenticación
   * @param {Object} router - Instancia del router (opcional)
   */
  const handleAuthError = (error, router = null) => {
    if (error?.response?.status === 401) {
      // Redirigir al login si no está autenticado
      if (router) {
        router.push('/auth/login');
      }
      return handleError(
        new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'),
        'Sesión expirada',
        true
      );
    }

    if (error?.response?.status === 403) {
      return handleError(
        new Error('No tienes permisos para realizar esta acción.'),
        'Sin permisos',
        true
      );
    }

    return handleError(error);
  };

  return {
    handleError,
    handleValidationError,
    handleNetworkError,
    handleAuthError,
  };
}

