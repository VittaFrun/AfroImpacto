<!-- HEADER PROFESIONAL PARA DASHBOARDS -->

<template>
  <v-app-bar
    :elevation="0"
    :height="64"
    class="professional-header"
    :class="{ 'header-scrolled': isScrolled }"
  >
    <!-- Mobile Menu Button -->
    <v-app-bar-nav-icon 
      @click="$emit('toggle-drawer')"
      class="d-md-none"
      color="primary"
    ></v-app-bar-nav-icon>

    <!-- Logo/Brand -->
    <div class="d-flex align-center">
      <v-icon 
        :icon="getRoleIcon(userRole)" 
        :color="isScrolled ? 'primary' : 'white'"
        size="28"
        class="mr-3"
      ></v-icon>
      <h1 
        class="text-h6 font-weight-bold"
        :class="isScrolled ? 'text-primary' : 'text-white'"
      >
        {{ getRoleTitle(userRole) }}
      </h1>
    </div>

    <v-spacer></v-spacer>

    <!-- Search Bar (Desktop) -->
    <div class="d-none d-md-flex align-center mr-6">
      <v-text-field
        v-model="searchQuery"
        placeholder="Buscar proyectos, voluntarios..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        class="search-field"
        @keyup.enter="handleSearch"
      ></v-text-field>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex align-center">
      <!-- Notifications -->
      <v-btn
        icon
        variant="text"
        :color="isScrolled ? 'primary' : 'white'"
        class="mr-2"
        @click="showNotifications = !showNotifications"
      >
        <v-badge
          :content="notificationCount"
          :model-value="notificationCount > 0"
          color="error"
          offset-x="8"
          offset-y="8"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <!-- Quick Actions Menu -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            variant="text"
            :color="isScrolled ? 'primary' : 'white'"
            v-bind="props"
            class="mr-2"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-list class="quick-actions-menu">
          <v-list-item
            v-for="action in quickActions"
            :key="action.title"
            @click="action.action"
            class="quick-action-item"
          >
            <template v-slot:prepend>
              <v-icon :icon="action.icon" :color="action.color"></v-icon>
            </template>
            <v-list-item-title>{{ action.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- User Menu -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            v-bind="props"
            class="user-menu-btn"
            :class="{ 'text-primary': isScrolled, 'text-white': !isScrolled }"
          >
            <v-avatar size="32" class="mr-2">
              <v-img 
                v-if="userAvatar" 
                :src="userAvatar"
                :alt="userName"
              ></v-img>
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
            <span class="d-none d-md-inline">{{ userName }}</span>
            <v-icon class="ml-2">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="user-menu">
          <v-list-item class="user-info">
            <template v-slot:prepend>
              <v-avatar size="40">
                <v-img 
                  v-if="userAvatar" 
                  :src="userAvatar"
                  :alt="userName"
                ></v-img>
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">{{ userName }}</v-list-item-title>
            <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            v-for="item in userMenuItems"
            :key="item.title"
            @click="item.action"
            class="user-menu-item"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon" size="20"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout" class="user-menu-item logout-item">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout" size="20" color="error"></v-icon>
            </template>
            <v-list-item-title class="text-error">Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <!-- Notifications Panel -->
    <v-navigation-drawer
      v-model="showNotifications"
      temporary
      location="right"
      width="400"
      class="notifications-panel"
    >
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-bell</v-icon>
        Notificaciones
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="showNotifications = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
        >
          <template v-slot:prepend>
            <v-avatar :color="notification.color" size="32">
              <v-icon :color="'white'" size="16">{{ notification.icon }}</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>{{ notification.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-chip size="x-small" :color="notification.color" variant="tonal">
              {{ formatTime(notification.timestamp) }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Emits
const emit = defineEmits(['toggle-drawer']);

// Reactive data
const isScrolled = ref(false);
const searchQuery = ref('');
const showNotifications = ref(false);
const notificationCount = ref(3);

// Computed
const userRole = computed(() => authStore.userRole);
const userName = computed(() => authStore.userName || 'Usuario');
const userEmail = computed(() => authStore.userEmail || 'usuario@ejemplo.com');
const userAvatar = computed(() => authStore.user?.avatar || null);

// Quick actions based on role
const quickActions = computed(() => {
  if (userRole.value === 'voluntario') {
    return [
      { title: 'Buscar Proyectos', icon: 'mdi-magnify', color: 'primary', action: () => router.push('/volunteer/projects') },
      { title: 'Actualizar Perfil', icon: 'mdi-account-edit', color: 'info', action: () => router.push('/volunteer/profile') },
      { title: 'Ver Disponibilidad', icon: 'mdi-calendar-clock', color: 'warning', action: () => router.push('/volunteer/availability') },
    ];
  } else if (userRole.value === 'organizacion') {
    return [
      { title: 'Crear Proyecto', icon: 'mdi-plus-box', color: 'primary', action: () => router.push('/organization/dashboard/projects/create') },
      { title: 'Invitar Voluntario', icon: 'mdi-account-plus', color: 'success', action: () => router.push('/organization/dashboard/volunteers') },
      { title: 'Ver Reportes', icon: 'mdi-chart-line', color: 'info', action: () => router.push('/organization/dashboard/reports') },
    ];
  }
  return [];
});

// User menu items
const userMenuItems = computed(() => {
  const baseItems = [
    { title: 'Mi Perfil', icon: 'mdi-account', action: () => router.push(getProfileRoute()) },
    { title: 'Configuración', icon: 'mdi-cog', action: () => router.push(getSettingsRoute()) },
  ];

  if (userRole.value === 'voluntario') {
    return [
      ...baseItems,
      { title: 'Mis Proyectos', icon: 'mdi-folder-heart', action: () => router.push('/volunteer/projects/my') },
    ];
  } else if (userRole.value === 'organizacion') {
    return [
      ...baseItems,
      { title: 'Mis Proyectos', icon: 'mdi-folder-multiple', action: () => router.push('/organization/dashboard/projects') },
      { title: 'Voluntarios', icon: 'mdi-account-group', action: () => router.push('/organization/dashboard/volunteers') },
    ];
  }

  return baseItems;
});

// Mock notifications
const notifications = ref([
  {
    id: 1,
    title: 'Nuevo Proyecto Disponible',
    message: 'Se ha publicado un nuevo proyecto en tu área de interés',
    icon: 'mdi-bell-plus',
    color: 'primary',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    title: 'Tarea Asignada',
    message: 'Se te ha asignado una nueva tarea en el proyecto "Educación Rural"',
    icon: 'mdi-checkbox-marked-circle',
    color: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 3,
    title: 'Recordatorio',
    message: 'Tienes una reunión programada para mañana a las 10:00 AM',
    icon: 'mdi-calendar-clock',
    color: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
]);

// Methods
function getRoleIcon(role) {
  const icons = {
    voluntario: 'mdi-account-heart',
    organizacion: 'mdi-domain',
    admin: 'mdi-shield-crown'
  };
  return icons[role] || 'mdi-account';
}

function getRoleTitle(role) {
  const titles = {
    voluntario: 'Portal Voluntario',
    organizacion: 'Panel Organización',
    admin: 'Panel Administrador'
  };
  return titles[role] || 'Dashboard';
}

function getProfileRoute() {
  const routes = {
    voluntario: '/volunteer/profile',
    organizacion: '/organization/dashboard/settings',
    admin: '/admin/profile'
  };
  return routes[userRole.value] || '/profile';
}

function getSettingsRoute() {
  const routes = {
    voluntario: '/volunteer/settings',
    organizacion: '/organization/dashboard/settings',
    admin: '/admin/settings'
  };
  return routes[userRole.value] || '/settings';
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    // Implement search functionality
    console.log('Searching for:', searchQuery.value);
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}

function formatTime(timestamp) {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function handleScroll() {
  isScrolled.value = window.scrollY > 10;
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.professional-header {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%) !important;
  transition: all var(--transition-normal) !important;
}

.header-scrolled {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.search-field {
  max-width: 300px;
}

.search-field :deep(.v-field__outline) {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.search-field :deep(.v-field--focused .v-field__outline) {
  border-color: rgba(255, 255, 255, 0.8) !important;
}

.search-field :deep(.v-field__input) {
  color: white !important;
}

.search-field :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.user-menu-btn {
  text-transform: none !important;
  font-weight: var(--font-weight-medium) !important;
}

.quick-actions-menu {
  min-width: 200px;
}

.quick-action-item {
  transition: all var(--transition-fast) !important;
}

.quick-action-item:hover {
  background-color: var(--primary-50) !important;
}

.user-menu {
  min-width: 250px;
}

.user-info {
  background-color: var(--primary-50) !important;
}

.user-menu-item {
  transition: all var(--transition-fast) !important;
}

.user-menu-item:hover {
  background-color: var(--neutral-50) !important;
}

.logout-item:hover {
  background-color: var(--error-50) !important;
}

.notifications-panel {
  background: white !important;
}

.notification-item {
  border-left: 3px solid transparent;
  transition: all var(--transition-fast) !important;
}

.notification-item:hover {
  background-color: var(--neutral-50) !important;
  border-left-color: var(--primary-500) !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .search-field {
    display: none !important;
  }
  
  .professional-header {
    padding: 0 var(--spacing-sm) !important;
  }
}
</style>
