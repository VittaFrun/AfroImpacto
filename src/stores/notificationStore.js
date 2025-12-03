import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import axios from '@/plugins/axios';

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref([]);
  const backendNotifications = ref([]); // Notificaciones del backend
  const loading = ref(false);
  const lastSync = ref(null);
  const settings = ref({
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    push: false,
    // Preferencias por tipo
    projectStatusChanges: true,
    newAssignments: true,
    comments: true,
    mentions: true,
    taskDeadlines: true,
    taskReminders: true
  });

  // Getters
  const unreadCount = computed(() => {
    const localUnread = notifications.value.filter(n => !n.read).length;
    const backendUnread = backendNotifications.value.filter(n => !n.leida).length;
    return Math.max(localUnread, backendUnread);
  });

  const allNotifications = computed(() => {
    // Combinar notificaciones locales y del backend
    const combined = [...notifications.value];
    
    // Agregar notificaciones del backend que no están en locales
    backendNotifications.value.forEach(backendNotif => {
      const exists = combined.find(n => 
        n.id_notificacion === backendNotif.id_notificacion || 
        (n.id === backendNotif.id_notificacion && n.source === 'backend')
      );
      if (!exists) {
        combined.push({
          id: backendNotif.id_notificacion,
          id_notificacion: backendNotif.id_notificacion,
          type: backendNotif.tipo || 'info',
          title: backendNotif.titulo || 'Notificación',
          message: backendNotif.mensaje || '',
          read: backendNotif.leida || false,
          shown: false,
          createdAt: new Date(backendNotif.fecha_creacion),
          source: 'backend',
          data: backendNotif.datos_adicionales || {},
          id_proyecto: backendNotif.id_proyecto,
          tipo_entidad: backendNotif.tipo_entidad,
          id_entidad: backendNotif.id_entidad
        });
      }
    });
    
    return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });

  const recentNotifications = computed(() => 
    allNotifications.value.slice(0, 10)
  );

  const notificationsByType = computed(() => {
    return (type) => allNotifications.value.filter(n => n.type === type);
  });

  // Actions
  function addNotification(notification) {
    const newNotification = {
      id: Date.now() + Math.random(),
      type: notification.type || 'info',
      title: notification.title || 'Notificación',
      message: notification.message || '',
      read: false,
      shown: false, // Flag para saber si ya se mostró en snackbar
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

  function markAsShown(id) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.shown = true;
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

  // Persist notifications to localStorage
  function persistNotifications() {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications.value));
    } catch (error) {
      console.error('Error persisting notifications:', error);
    }
  }

  function loadPersistedNotifications() {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only load recent notifications (last 50) and mark them as already shown
        // Esto evita que se muestren de nuevo al refrescar la página
        notifications.value = parsed.slice(0, 50).map(n => ({
          ...n,
          createdAt: new Date(n.createdAt),
          shown: true // Marcar como ya mostradas para que no aparezcan en snackbar
        }));
      }
    } catch (error) {
      console.error('Error loading persisted notifications:', error);
    }
  }

  // Watch notifications and persist
  watch(notifications, () => {
    persistNotifications();
  }, { deep: true });

  // Backend synchronization
  async function fetchNotifications(soloNoLeidas = false) {
    loading.value = true;
    try {
      const response = await axios.get(`/notificacion/mis-notificaciones${soloNoLeidas ? '?soloNoLeidas=true' : ''}`);
      backendNotifications.value = response.data || [];
      lastSync.value = new Date();
      
      // Sincronizar estado de lectura
      backendNotifications.value.forEach(backendNotif => {
        const localNotif = notifications.value.find(n => 
          n.id_notificacion === backendNotif.id_notificacion
        );
        if (localNotif && localNotif.read !== backendNotif.leida) {
          localNotif.read = backendNotif.leida;
        }
      });
    } catch (error) {
      console.error('Error fetching notifications from backend:', error);
    } finally {
      loading.value = false;
    }
  }

  async function markAsReadBackend(id) {
    try {
      // Si es una notificación del backend, marcarla en el backend
      const backendNotif = backendNotifications.value.find(n => n.id_notificacion === id);
      if (backendNotif) {
        await axios.patch(`/notificacion/${id}/leida`);
        backendNotif.leida = true;
      }
      
      // También marcar en local
      const localNotif = notifications.value.find(n => 
        n.id === id || n.id_notificacion === id
      );
      if (localNotif) {
        localNotif.read = true;
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async function markAllAsReadBackend() {
    try {
      await axios.patch('/notificacion/marcar-todas-leidas');
      backendNotifications.value.forEach(n => n.leida = true);
      notifications.value.forEach(n => n.read = true);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  async function deleteNotificationBackend(id) {
    try {
      const backendNotif = backendNotifications.value.find(n => n.id_notificacion === id);
      if (backendNotif) {
        await axios.delete(`/notificacion/${id}`);
        backendNotifications.value = backendNotifications.value.filter(n => n.id_notificacion !== id);
      }
      
      // También eliminar de local
      notifications.value = notifications.value.filter(n => 
        n.id !== id && n.id_notificacion !== id
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  async function syncWithBackend() {
    await fetchNotifications();
  }

  // Initialize
  loadSettings();
  loadPersistedNotifications();
  requestNotificationPermission();
  
  // Cargar notificaciones del backend al inicializar
  fetchNotifications();

  return {
    // State
    notifications,
    backendNotifications,
    allNotifications,
    loading,
    lastSync,
    settings,
    
    // Getters
    unreadCount,
    recentNotifications,
    notificationsByType,
    
    // Actions
    addNotification,
    removeNotification,
    markAsRead,
    markAsShown,
    markAllAsRead,
    clearAll,
    clearByType,
    
    // Backend sync
    fetchNotifications,
    markAsReadBackend,
    markAllAsReadBackend,
    deleteNotificationBackend,
    syncWithBackend,
    
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

