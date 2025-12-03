/**
 * Composable para manejo unificado de notificaciones
 * Reemplaza todos los v-snackbar directos y unifica el sistema de notificaciones
 */
import { useNotificationStore } from '@/stores/notificationStore';

export function useNotifications() {
  const notificationStore = useNotificationStore();

  /**
   * Muestra una notificación de éxito
   * @param {string} message - Mensaje a mostrar
   * @param {string} title - Título opcional
   * @param {Object} options - Opciones adicionales
   */
  const showSuccess = (message, title = 'Éxito', options = {}) => {
    return notificationStore.showSnackbar(message, 'success', options.timeout || 3000);
  };

  /**
   * Muestra una notificación de error
   * @param {string} message - Mensaje a mostrar
   * @param {string} title - Título opcional
   * @param {Object} options - Opciones adicionales
   */
  const showError = (message, title = 'Error', options = {}) => {
    return notificationStore.showSnackbar(message, 'error', options.timeout || 5000);
  };

  /**
   * Muestra una notificación de advertencia
   * @param {string} message - Mensaje a mostrar
   * @param {string} title - Título opcional
   * @param {Object} options - Opciones adicionales
   */
  const showWarning = (message, title = 'Advertencia', options = {}) => {
    return notificationStore.showSnackbar(message, 'warning', options.timeout || 4000);
  };

  /**
   * Muestra una notificación informativa
   * @param {string} message - Mensaje a mostrar
   * @param {string} title - Título opcional
   * @param {Object} options - Opciones adicionales
   */
  const showInfo = (message, title = 'Información', options = {}) => {
    return notificationStore.showSnackbar(message, 'info', options.timeout || 3000);
  };

  /**
   * Muestra una notificación (alias para compatibilidad)
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación (success, error, warning, info)
   * @param {Object} options - Opciones adicionales
   */
  const showNotification = (message, type = 'success', options = {}) => {
    return notificationStore.showSnackbar(message, type, options.timeout || 3000);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
    // Exponer el store completo para casos avanzados
    store: notificationStore
  };
}

