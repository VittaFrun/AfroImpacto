<template>
  <v-snackbar
    v-model="snackbar.visible"
    :color="snackbar.type"
    :timeout="snackbar.timeout"
    location="bottom right"
    :elevation="6"
    class="notification-snackbar"
  >
    <div class="d-flex align-center">
      <v-icon
        :color="getIconColor(snackbar.type)"
        class="mr-3"
        size="24"
      >
        {{ getIcon(snackbar.type) }}
      </v-icon>
      <div class="flex-grow-1">
        <div v-if="snackbar.title" class="text-subtitle-2 font-weight-bold mb-1">
          {{ snackbar.title }}
        </div>
        <div class="text-body-2">
          {{ snackbar.message }}
        </div>
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="closeSnackbar"
        class="ml-2"
      ></v-btn>
    </div>
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';

const notificationStore = useNotificationStore();

const snackbar = ref({
  visible: false,
  message: '',
  type: 'success',
  timeout: 3000,
  title: null,
  notificationId: null
});

let currentNotificationId = null;

// Observar solo las notificaciones nuevas (que no han sido mostradas)
watch(
  () => notificationStore.notifications,
  (notifications) => {
    // Buscar la primera notificación que no haya sido mostrada
    const unshownNotification = notifications.find(n => !n.shown);
    
    if (unshownNotification && !snackbar.value.visible) {
      // Marcar como mostrada inmediatamente para evitar duplicados
      notificationStore.markAsShown(unshownNotification.id);
      currentNotificationId = unshownNotification.id;
      
      snackbar.value = {
        visible: true,
        message: unshownNotification.message || unshownNotification.title,
        type: unshownNotification.type || 'success',
        timeout: unshownNotification.timeout || 3000,
        title: unshownNotification.title,
        notificationId: unshownNotification.id
      };
      
      // Auto-ocultar después del timeout
      setTimeout(() => {
        if (snackbar.value.notificationId === unshownNotification.id) {
          snackbar.value.visible = false;
          currentNotificationId = null;
        }
      }, snackbar.value.timeout);
    }
  },
  { deep: true, immediate: false } // No ejecutar inmediatamente para evitar mostrar notificaciones antiguas
);

function closeSnackbar() {
  snackbar.value.visible = false;
  currentNotificationId = null;
}

function getIcon(type) {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  };
  return icons[type] || icons.info;
}

function getIconColor(type) {
  const colors = {
    success: 'white',
    error: 'white',
    warning: 'white',
    info: 'white'
  };
  return colors[type] || 'white';
}
</script>

<style scoped>
.notification-snackbar {
  z-index: 9999;
}
</style>

