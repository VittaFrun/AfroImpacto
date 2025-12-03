<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    scrollable
    :fullscreen="$vuetify.display.mobile"
  >
    <v-card class="notification-center-card">
      <v-card-title class="notification-center-header">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="white" size="24">mdi-bell</v-icon>
            <span class="text-h6 font-weight-bold text-white">Centro de Notificaciones</span>
            <v-chip
              v-if="unreadCount > 0"
              color="white"
              size="small"
              variant="flat"
              class="ml-2"
            >
              {{ unreadCount }} sin leer
            </v-chip>
          </div>
          <v-btn
            icon
            variant="text"
            color="white"
            size="small"
            @click="$emit('update:modelValue', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Filters -->
      <v-card-text class="pa-3">
        <div class="d-flex align-center gap-2 mb-3 flex-wrap">
          <v-chip
            v-for="filterOption in filterOptions"
            :key="filterOption.value"
            :color="filter === filterOption.value ? 'primary' : 'default'"
            :variant="filter === filterOption.value ? 'flat' : 'outlined'"
            size="small"
            @click="filter = filterOption.value"
            style="cursor: pointer;"
          >
            {{ filterOption.label }}
            <v-chip
              v-if="filterOption.count > 0"
              size="x-small"
              color="white"
              variant="flat"
              class="ml-1"
            >
              {{ filterOption.count }}
            </v-chip>
          </v-chip>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Notifications List -->
      <v-card-text class="pa-0" style="max-height: 500px; overflow-y: auto;">
        <div v-if="loading || storeLoading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
        </div>

        <EmptyState
          v-else-if="filteredNotifications.length === 0"
          icon="mdi-bell-off"
          title="No hay notificaciones"
          :description="filter === 'all' ? 'No tienes notificaciones en este momento' : `No hay notificaciones ${filterOptions.find(f => f.value === filter)?.label.toLowerCase()}`"
          variant="no-data"
          :icon-size="64"
        />

        <div v-else>
          <NotificationItem
            v-for="notification in filteredNotifications"
            :key="notification.id || notification.id_notificacion"
            :id="notification.id || notification.id_notificacion"
            :id-notificacion="notification.id_notificacion"
            :type="notification.type"
            :title="notification.title"
            :message="notification.message"
            :read="notification.read || notification.leida"
            :created-at="notification.createdAt || notification.fecha_creacion"
            :actions="notification.actions"
            :data="notification.data"
            :id-proyecto="notification.id_proyecto"
            :tipo-entidad="notification.tipo_entidad"
            :id-entidad="notification.id_entidad"
            @click="handleNotificationClick"
            @action="handleAction"
            @delete="handleDelete"
            @read="handleMarkAsRead"
            class="mb-2"
          />
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Footer Actions -->
      <v-card-actions class="pa-3">
        <v-btn
          variant="text"
          size="small"
          @click="handleSync"
          :loading="storeLoading"
        >
          <v-icon start>mdi-sync</v-icon>
          Sincronizar
        </v-btn>
        <v-btn
          variant="text"
          size="small"
          @click="preferencesDialog = true"
        >
          <v-icon start>mdi-cog</v-icon>
          Preferencias
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          size="small"
          @click="handleMarkAllAsRead"
          :disabled="unreadCount === 0 || (loading && storeLoading)"
          :loading="markingAll"
        >
          <v-icon start>mdi-check-all</v-icon>
          Marcar todas como leídas
        </v-btn>
        <v-btn
          variant="text"
          size="small"
          color="error"
          @click="handleClearAll"
          :disabled="filteredNotifications.length === 0 || loading || storeLoading"
        >
          <v-icon start>mdi-delete</v-icon>
          Limpiar
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Preferences Dialog -->
    <NotificationPreferencesDialog v-model="preferencesDialog" />
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notificationStore';
import NotificationItem from './NotificationItem.vue';
import NotificationPreferencesDialog from './NotificationPreferencesDialog.vue';
import EmptyState from '@/components/feedback/EmptyState.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'notification-click', 'action']);

const notificationStore = useNotificationStore();
const { allNotifications, unreadCount, loading: storeLoading } = storeToRefs(notificationStore);
const { 
  markAsReadBackend, 
  markAllAsReadBackend, 
  deleteNotificationBackend, 
  clearAll,
  fetchNotifications,
  syncWithBackend
} = notificationStore;

const filter = ref('all');
const markingAll = ref(false);
const preferencesDialog = ref(false);

const filterOptions = computed(() => {
  const all = allNotifications.value.length;
  const unread = allNotifications.value.filter(n => !n.read && !n.leida).length;
  const success = allNotifications.value.filter(n => n.type === 'success').length;
  const error = allNotifications.value.filter(n => n.type === 'error').length;
  const warning = allNotifications.value.filter(n => n.type === 'warning').length;
  const info = allNotifications.value.filter(n => n.type === 'info').length;

  return [
    { label: 'Todas', value: 'all', count: all },
    { label: 'Sin leer', value: 'unread', count: unread },
    { label: 'Éxito', value: 'success', count: success },
    { label: 'Error', value: 'error', count: error },
    { label: 'Advertencia', value: 'warning', count: warning },
    { label: 'Info', value: 'info', count: info }
  ];
});

const filteredNotifications = computed(() => {
  let result = [...allNotifications.value];

  if (filter.value === 'unread') {
    result = result.filter(n => !n.read && !n.leida);
  } else if (filter.value !== 'all') {
    result = result.filter(n => n.type === filter.value);
  }

  return result;
});

const handleNotificationClick = (id) => {
  emit('notification-click', id);
};

const handleAction = ({ notificationId, action }) => {
  emit('action', { notificationId, action });
};

const handleDelete = async (id) => {
  // Intentar eliminar del backend primero
  const notification = allNotifications.value.find(n => 
    n.id === id || n.id_notificacion === id
  );
  
  if (notification?.id_notificacion || notification?.source === 'backend') {
    await deleteNotificationBackend(notification.id_notificacion || id);
  } else {
    removeNotification(id);
  }
};

const handleMarkAsRead = async (id) => {
  // Intentar marcar en backend primero
  const notification = allNotifications.value.find(n => 
    n.id === id || n.id_notificacion === id
  );
  
  if (notification?.id_notificacion || notification?.source === 'backend') {
    await markAsReadBackend(notification.id_notificacion || id);
  } else {
    markAsRead(id);
  }
};

const handleMarkAllAsRead = async () => {
  markingAll.value = true;
  try {
    await markAllAsReadBackend();
  } finally {
    markingAll.value = false;
  }
};

const handleSync = async () => {
  await syncWithBackend();
};

const handleClearAll = () => {
  if (filter.value === 'all') {
    clearAll();
  } else {
    // Clear by filter type
    const type = filter.value === 'unread' ? null : filter.value;
    if (type) {
      notificationStore.clearByType(type);
    } else {
      // Clear unread
      notifications.value.forEach(n => {
        if (!n.read) {
          removeNotification(n.id);
        }
      });
    }
  }
};

// Watch for modelValue changes to load notifications
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // Sincronizar con backend cuando se abre el centro
    syncWithBackend();
  }
});
</script>

<style scoped>
.notification-center-card {
  border-radius: 16px;
  overflow: hidden;
}

.notification-center-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-primary-darken-1)));
  padding: 20px 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .notification-center-header {
    padding: 16px;
  }
}
</style>

