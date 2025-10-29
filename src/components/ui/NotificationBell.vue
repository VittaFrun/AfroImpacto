<template>
  <div class="notification-container">
    <!-- Notification Bell -->
    <v-btn
      icon
      variant="text"
      @click="showNotifications = !showNotifications"
      class="notification-bell"
    >
      <v-badge
        :content="unreadCount"
        :model-value="unreadCount > 0"
        color="error"
        floating
      >
        <v-icon size="24">mdi-bell</v-icon>
      </v-badge>
    </v-btn>

    <!-- Notifications Panel -->
    <v-menu
      v-model="showNotifications"
      :close-on-content-click="false"
      location="bottom end"
      offset="8"
      width="400"
    >
      <template #activator="{ props }">
        <div v-bind="props"></div>
      </template>

      <v-card class="notification-panel" elevation="8">
        <!-- Header -->
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-bell</v-icon>
            <span class="text-h6 font-weight-bold">Notificaciones</span>
            <v-chip
              v-if="unreadCount > 0"
              color="primary"
              size="small"
              class="ml-2"
            >
              {{ unreadCount }}
            </v-chip>
          </div>
          
          <div class="d-flex align-center gap-1">
            <v-btn
              icon="mdi-check-all"
              variant="text"
              size="small"
              @click="markAllAsRead"
              :disabled="unreadCount === 0"
            >
              <v-icon size="16">mdi-check-all</v-icon>
            </v-btn>
            
            <v-btn
              icon="mdi-cog"
              variant="text"
              size="small"
              @click="showSettings = true"
            >
              <v-icon size="16">mdi-cog</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Notifications List -->
        <div class="notifications-list" style="max-height: 400px; overflow-y: auto;">
          <div v-if="recentNotifications.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1">mdi-bell-off</v-icon>
            <p class="text-body-1 text-grey mt-2">No hay notificaciones</p>
          </div>

          <div
            v-for="notification in recentNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <v-card
              variant="flat"
              :color="getNotificationColor(notification.type)"
              class="ma-2"
            >
              <v-card-text class="pa-3">
                <div class="d-flex align-start">
                  <v-icon
                    :color="getNotificationIconColor(notification.type)"
                    class="mr-3 mt-1"
                    size="20"
                  >
                    {{ getNotificationIcon(notification.type) }}
                  </v-icon>
                  
                  <div class="flex-grow-1">
                    <div class="d-flex justify-space-between align-start mb-1">
                      <h4 class="text-subtitle-2 font-weight-bold">
                        {{ notification.title }}
                      </h4>
                      <div class="d-flex align-center gap-1">
                        <span class="text-caption text-grey">
                          {{ formatTime(notification.createdAt) }}
                        </span>
                        <v-btn
                          icon="mdi-close"
                          variant="text"
                          size="x-small"
                          @click.stop="removeNotification(notification.id)"
                        >
                          <v-icon size="12">mdi-close</v-icon>
                        </v-btn>
                      </div>
                    </div>
                    
                    <p class="text-body-2 text-grey-darken-1 mb-2">
                      {{ notification.message }}
                    </p>
                    
                    <!-- Actions -->
                    <div v-if="notification.actions && notification.actions.length > 0" class="d-flex gap-1">
                      <v-btn
                        v-for="action in notification.actions"
                        :key="action.label"
                        size="x-small"
                        variant="outlined"
                        @click.stop="handleAction(notification, action)"
                      >
                        {{ action.label }}
                      </v-btn>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <!-- Footer -->
        <v-divider></v-divider>
        <v-card-actions class="pa-2">
          <v-btn
            variant="text"
            color="primary"
            @click="clearAll"
            :disabled="recentNotifications.length === 0"
          >
            Limpiar Todo
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="primary"
            @click="showNotifications = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <!-- Settings Dialog -->
    <v-dialog v-model="showSettings" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-cog</v-icon>
          Configuración de Notificaciones
        </v-card-title>
        
        <v-card-text>
          <v-switch
            v-model="settings.enabled"
            label="Notificaciones habilitadas"
            color="primary"
            @change="updateSettings"
          ></v-switch>
          
          <v-switch
            v-model="settings.sound"
            label="Sonido de notificaciones"
            color="primary"
            :disabled="!settings.enabled"
            @change="updateSettings"
          ></v-switch>
          
          <v-switch
            v-model="settings.desktop"
            label="Notificaciones del sistema"
            color="primary"
            :disabled="!settings.enabled"
            @change="updateSettings"
          ></v-switch>
          
          <v-switch
            v-model="settings.email"
            label="Notificaciones por email"
            color="primary"
            :disabled="!settings.enabled"
            @change="updateSettings"
          ></v-switch>
          
          <v-switch
            v-model="settings.push"
            label="Notificaciones push"
            color="primary"
            :disabled="!settings.enabled"
            @change="updateSettings"
          ></v-switch>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            @click="showSettings = false"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const notificationStore = useNotificationStore();
const { 
  notifications, 
  settings, 
  unreadCount, 
  recentNotifications 
} = storeToRefs(notificationStore);

const { 
  markAsRead, 
  markAllAsRead, 
  removeNotification, 
  clearAll, 
  updateSettings 
} = notificationStore;

// Local state
const showNotifications = ref(false);
const showSettings = ref(false);

// Helper functions
function getNotificationColor(type) {
  const colors = {
    success: 'success-lighten-5',
    error: 'error-lighten-5',
    warning: 'warning-lighten-5',
    info: 'info-lighten-5'
  };
  return colors[type] || 'grey-lighten-5';
}

function getNotificationIconColor(type) {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };
  return colors[type] || 'grey';
}

function getNotificationIcon(type) {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  };
  return icons[type] || 'mdi-bell';
}

function formatTime(date) {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true, 
    locale: es 
  });
}

function handleNotificationClick(notification) {
  if (!notification.read) {
    markAsRead(notification.id);
  }
}

function handleAction(notification, action) {
  // Emit event or handle action
  console.log('Action clicked:', action.action, notification);
  
  // Mark as read when action is clicked
  if (!notification.read) {
    markAsRead(notification.id);
  }
}
</script>

<style scoped>
.notification-container {
  position: relative;
}

.notification-bell {
  transition: all 0.3s ease;
}

.notification-bell:hover {
  transform: scale(1.1);
}

.notification-panel {
  border-radius: 12px;
  overflow: hidden;
}

.notification-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-item:hover {
  transform: translateY(-1px);
}

.notification-item.unread {
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.notifications-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: transparent;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}
</style>

