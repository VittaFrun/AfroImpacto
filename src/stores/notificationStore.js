import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref([]);
  const settings = ref({
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    push: false
  });

  // Getters
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  );

  const recentNotifications = computed(() => 
    notifications.value
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
  );

  const notificationsByType = computed(() => {
    return (type) => notifications.value.filter(n => n.type === type);
  });

  // Actions
  function addNotification(notification) {
    const newNotification = {
      id: Date.now() + Math.random(),
      type: notification.type || 'info',
      title: notification.title || 'Notificación',
      message: notification.message || '',
      read: false,
      createdAt: new Date(),
      expiresAt: notification.expiresAt || null,
      actions: notification.actions || [],
      data: notification.data || {},
      ...notification
    };

    notifications.value.unshift(newNotification);

    // Auto-remove if expiresAt is set
    if (newNotification.expiresAt) {
      const timeout = new Date(newNotification.expiresAt).getTime() - Date.now();
      if (timeout > 0) {
        setTimeout(() => {
          removeNotification(newNotification.id);
        }, timeout);
      }
    }

    // Play sound if enabled
    if (settings.value.sound && settings.value.enabled) {
      playNotificationSound(newNotification.type);
    }

    // Show desktop notification if enabled
    if (settings.value.desktop && settings.value.enabled && 'Notification' in window) {
      showDesktopNotification(newNotification);
    }

    return newNotification;
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true);
  }

  function clearAll() {
    notifications.value = [];
  }

  function clearByType(type) {
    notifications.value = notifications.value.filter(n => n.type !== type);
  }

  // Notification types
  function success(title, message, options = {}) {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  function error(title, message, options = {}) {
    return addNotification({
      type: 'error',
      title,
      message,
      ...options
    });
  }

  function warning(title, message, options = {}) {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    });
  }

  function info(title, message, options = {}) {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  // Project-specific notifications
  function projectCreated(projectName) {
    return success(
      'Proyecto Creado',
      `El proyecto "${projectName}" ha sido creado exitosamente`,
      {
        actions: [
          { label: 'Ver Proyecto', action: 'view-project' },
          { label: 'Gestionar', action: 'manage-project' }
        ]
      }
    );
  }

  function projectUpdated(projectName) {
    return info(
      'Proyecto Actualizado',
      `El proyecto "${projectName}" ha sido actualizado`,
      {
        actions: [
          { label: 'Ver Cambios', action: 'view-changes' }
        ]
      }
    );
  }

  function projectPublished(projectName) {
    return success(
      'Proyecto Publicado',
      `El proyecto "${projectName}" ahora es público y visible para voluntarios`,
      {
        actions: [
          { label: 'Ver en Catálogo', action: 'view-catalog' }
        ]
      }
    );
  }

  function volunteerJoined(volunteerName, projectName) {
    return info(
      'Nuevo Voluntario',
      `${volunteerName} se ha unido al proyecto "${projectName}"`,
      {
        actions: [
          { label: 'Ver Perfil', action: 'view-profile' },
          { label: 'Asignar Tarea', action: 'assign-task' }
        ]
      }
    );
  }

  function taskCompleted(taskName, projectName) {
    return success(
      'Tarea Completada',
      `La tarea "${taskName}" del proyecto "${projectName}" ha sido completada`,
      {
        actions: [
          { label: 'Ver Proyecto', action: 'view-project' }
        ]
      }
    );
  }

  function donationReceived(amount, donorName) {
    return success(
      'Donación Recibida',
      `Has recibido una donación de $${amount.toLocaleString()} COP de ${donorName}`,
      {
        actions: [
          { label: 'Ver Detalles', action: 'view-donation' }
        ]
      }
    );
  }

  // Settings
  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings };
    localStorage.setItem('notification-settings', JSON.stringify(settings.value));
  }

  function loadSettings() {
    const saved = localStorage.getItem('notification-settings');
    if (saved) {
      settings.value = { ...settings.value, ...JSON.parse(saved) };
    }
  }

  // Helper functions
  function playNotificationSound(type) {
    const sounds = {
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      warning: '/sounds/warning.mp3',
      info: '/sounds/info.mp3'
    };

    const audio = new Audio(sounds[type] || sounds.info);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore errors if audio can't play
    });
  }

  function showDesktopNotification(notification) {
    if (Notification.permission === 'granted') {
      const desktopNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });

      desktopNotification.onclick = () => {
        window.focus();
        desktopNotification.close();
      };
    }
  }

  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  // Snackbar helper (simple notification)
  function showSnackbar(message, type = 'success', timeout = 3000) {
    // Create a simple snackbar notification
    const snackbar = {
      id: Date.now() + Math.random(),
      type: type,
      message: message,
      timeout: timeout,
      visible: true
    };

    // Add to notifications
    addNotification({
      type: type,
      title: type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : type === 'warning' ? 'Advertencia' : 'Información',
      message: message,
      expiresAt: new Date(Date.now() + timeout)
    });

    // Auto-remove after timeout
    setTimeout(() => {
      removeNotification(snackbar.id);
    }, timeout);

    return snackbar;
  }

  // Initialize
  loadSettings();
  requestNotificationPermission();

  return {
    // State
    notifications,
    settings,
    
    // Getters
    unreadCount,
    recentNotifications,
    notificationsByType,
    
    // Actions
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearByType,
    
    // Notification types
    success,
    error,
    warning,
    info,
    
    // Project-specific notifications
    projectCreated,
    projectUpdated,
    projectPublished,
    volunteerJoined,
    taskCompleted,
    donationReceived,
    
    // Settings
    updateSettings,
    loadSettings,
    
    // Helper functions
    playNotificationSound,
    showDesktopNotification,
    requestNotificationPermission,
    showSnackbar,
  };
});

