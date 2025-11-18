<template>
  <div class="notification-bell">
    <v-menu
      location="bottom end"
      :close-on-content-click="false"
      max-width="400"
    >
      <template v-slot:activator="{ props }">
        <v-badge
          :content="unreadCount"
          :model-value="unreadCount > 0"
          color="error"
          overlap
        >
          <v-btn
            icon
            v-bind="props"
            variant="text"
            size="small"
            color="white"
          >
            <v-icon color="white">mdi-bell</v-icon>
          </v-btn>
        </v-badge>
      </template>

      <v-card class="notification-card" rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between pa-3 bg-primary">
          <span class="text-white font-weight-bold">Notificaciones</span>
          <div class="d-flex gap-1">
            <v-btn
              v-if="unreadCount > 0"
              icon
              size="small"
              variant="text"
              @click="markAllAsRead"
              :loading="markingAll"
            >
              <v-icon size="small" color="white">mdi-check-all</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              @click="loadNotifications"
            >
              <v-icon size="small" color="white">mdi-refresh</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-0" style="max-height: 500px; overflow-y: auto;">
          <div v-if="loading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
          </div>

          <div v-else-if="notifications.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey-lighten-2">mdi-bell-off</v-icon>
            <p class="text-body-2 text-grey mt-2">No hay notificaciones</p>
          </div>

          <v-list density="compact" class="pa-0">
            <v-list-item
              v-for="notification in notifications"
              :key="notification.id_notificacion"
              :class="{ 'bg-grey-lighten-4': !notification.leida }"
              class="notification-item"
            >
              <template v-slot:prepend>
                <v-icon
                  :color="getTypeColor(notification.tipo)"
                  size="24"
                >
                  {{ getTypeIcon(notification.tipo) }}
                </v-icon>
              </template>

              <v-list-item-title class="font-weight-medium mb-1">
                {{ notification.titulo }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-body-2">
                {{ notification.mensaje }}
              </v-list-item-subtitle>
              <div class="text-caption text-grey mt-1">
                {{ formatDate(notification.fecha_creacion) }}
              </div>

              <template v-slot:append>
                <div class="d-flex flex-column gap-1">
                  <v-btn
                    v-if="!notification.leida"
                    icon
                    size="x-small"
                    variant="text"
                    @click="markAsRead(notification.id_notificacion)"
                  >
                    <v-icon size="16">mdi-check</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click="deleteNotification(notification.id_notificacion)"
                  >
                    <v-icon size="16" color="error">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-2">
          <v-btn
            variant="text"
            size="small"
            block
            @click="$emit('view-all')"
          >
            Ver todas las notificaciones
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from '@/plugins/axios';
import { formatDate } from '@/utils/formatters';

const emit = defineEmits(['view-all']);

const loading = ref(false);
const notifications = ref([]);
const markingAll = ref(false);
const refreshInterval = ref(null);

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.leida).length;
});

const getTypeColor = (tipo) => {
  const colors = {
    info: 'info',
    warning: 'warning',
    error: 'error',
    success: 'success',
  };
  return colors[tipo] || 'grey';
};

const getTypeIcon = (tipo) => {
  const icons = {
    info: 'mdi-information',
    warning: 'mdi-alert',
    error: 'mdi-alert-circle',
    success: 'mdi-check-circle',
  };
  return icons[tipo] || 'mdi-bell';
};

const loadNotifications = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/notificacion/mis-notificaciones?soloNoLeidas=true');
    notifications.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
    notifications.value = [];
  } finally {
    loading.value = false;
  }
};

const markAsRead = async (id) => {
  try {
    await axios.patch(`/notificacion/${id}/leida`);
    const notification = notifications.value.find(n => n.id_notificacion === id);
    if (notification) {
      notification.leida = true;
    }
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
  }
};

const markAllAsRead = async () => {
  markingAll.value = true;
  try {
    await axios.patch('/notificacion/marcar-todas-leidas');
    notifications.value.forEach(n => n.leida = true);
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
  } finally {
    markingAll.value = false;
  }
};

const deleteNotification = async (id) => {
  try {
    await axios.delete(`/notificacion/${id}`);
    notifications.value = notifications.value.filter(n => n.id_notificacion !== id);
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
  }
};

onMounted(() => {
  loadNotifications();
  // Refrescar cada 30 segundos
  refreshInterval.value = setInterval(loadNotifications, 30000);
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>

<style scoped>
.notification-bell {
  display: inline-flex;
  align-items: center;
}

.notification-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-card {
  max-height: 600px;
}

/* Asegurar que el badge se vea bien sobre el botón blanco */
.notification-bell :deep(.v-badge__badge) {
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
}
</style>

