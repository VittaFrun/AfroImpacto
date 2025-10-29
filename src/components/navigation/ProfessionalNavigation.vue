<!-- SISTEMA DE NAVEGACIÓN PROFESIONAL -->

<!-- Componente: ProfessionalNavigation.vue -->
<template>
  <v-navigation-drawer
    v-model="drawer"
    :width="drawerWidth"
    :permanent="!isMobile"
    :temporary="isMobile"
    class="professional-nav"
    :class="{ 'nav-mini': miniVariant }"
  >
    <!-- Header del Navigation -->
    <div class="nav-header">
      <div class="d-flex align-center pa-4">
        <v-avatar 
          :size="miniVariant ? 32 : 40" 
          color="primary" 
          class="mr-3"
        >
          <v-icon :color="miniVariant ? 'primary' : 'white'">
            {{ getRoleIcon(userRole) }}
          </v-icon>
        </v-avatar>
        
        <div v-if="!miniVariant" class="nav-brand">
          <h3 class="text-h6 font-weight-bold text-primary">
            {{ getRoleTitle(userRole) }}
          </h3>
          <p class="text-caption text-grey-darken-1 mb-0">
            {{ userName }}
          </p>
        </div>
      </div>
      
      <v-divider></v-divider>
    </div>

    <!-- Navigation Items -->
    <v-list class="nav-list" density="compact">
      <template v-for="(item, index) in navigationItems" :key="index">
        <!-- Section Header -->
        <v-list-subheader 
          v-if="item.type === 'header'" 
          class="nav-section-header"
        >
          {{ item.title }}
        </v-list-subheader>
        
        <!-- Navigation Item -->
        <v-list-item
          v-else-if="item.type === 'item'"
          :to="item.route"
          :active="isActiveRoute(item.route)"
          class="nav-item"
          :class="{ 'nav-item-active': isActiveRoute(item.route) }"
        >
          <template v-slot:prepend>
            <v-icon 
              :icon="item.icon" 
              :color="isActiveRoute(item.route) ? 'primary' : 'grey-darken-1'"
              :size="miniVariant ? 20 : 24"
            ></v-icon>
          </template>
          
          <v-list-item-title 
            v-if="!miniVariant"
            class="nav-item-title"
            :class="{ 'text-primary': isActiveRoute(item.route) }"
          >
            {{ item.title }}
          </v-list-item-title>
          
          <!-- Badge for notifications -->
          <v-badge
            v-if="item.badge && !miniVariant"
            :content="item.badge"
            color="error"
            offset-x="8"
            offset-y="8"
          >
            <div></div>
          </v-badge>
        </v-list-item>
        
        <!-- Divider -->
        <v-divider v-else-if="item.type === 'divider'" class="my-2"></v-divider>
      </template>
    </v-list>

    <!-- Footer del Navigation -->
    <template v-slot:append>
      <div class="nav-footer pa-4">
        <v-btn
          :icon="miniVariant ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          variant="text"
          size="small"
          @click="toggleMiniVariant"
          class="nav-toggle-btn"
        ></v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Reactive data
const drawer = ref(props.modelValue);
const miniVariant = ref(false);
const isMobile = ref(false);

// Computed
const drawerWidth = computed(() => miniVariant.value ? 72 : 280);
const userRole = computed(() => authStore.userRole);
const userName = computed(() => authStore.userName);

// Navigation items based on role
const navigationItems = computed(() => {
  const baseItems = [
    { type: 'header', title: 'Principal' },
    { type: 'item', title: 'Dashboard', icon: 'mdi-view-dashboard', route: getDashboardRoute() },
  ];

  if (userRole.value === 'voluntario') {
    return [
      ...baseItems,
      { type: 'divider' },
      { type: 'header', title: 'Proyectos' },
      { type: 'item', title: 'Explorar Proyectos', icon: 'mdi-magnify', route: '/volunteer/projects' },
      { type: 'item', title: 'Mis Proyectos', icon: 'mdi-folder-heart', route: '/volunteer/projects/my', badge: 3 },
      { type: 'divider' },
      { type: 'header', title: 'Perfil' },
      { type: 'item', title: 'Mi Perfil', icon: 'mdi-account', route: '/volunteer/profile' },
      { type: 'item', title: 'Disponibilidad', icon: 'mdi-calendar-clock', route: '/volunteer/availability' },
      { type: 'divider' },
      { type: 'item', title: 'Configuración', icon: 'mdi-cog', route: '/volunteer/settings' },
    ];
  } else if (userRole.value === 'organizacion') {
    return [
      ...baseItems,
      { type: 'divider' },
      { type: 'header', title: 'Gestión' },
      { type: 'item', title: 'Proyectos', icon: 'mdi-folder-multiple', route: '/organization/dashboard/projects' },
      { type: 'item', title: 'Voluntarios', icon: 'mdi-account-group', route: '/organization/dashboard/volunteers' },
      { type: 'item', title: 'Donaciones', icon: 'mdi-currency-usd', route: '/organization/dashboard/donations' },
      { type: 'divider' },
      { type: 'header', title: 'Análisis' },
      { type: 'item', title: 'Reportes', icon: 'mdi-chart-line', route: '/organization/dashboard/reports' },
      { type: 'divider' },
      { type: 'item', title: 'Configuración', icon: 'mdi-cog', route: '/organization/dashboard/settings' },
    ];
  }

  return baseItems;
});

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

function getDashboardRoute() {
  const routes = {
    voluntario: '/volunteer/dashboard',
    organizacion: '/organization/dashboard',
    admin: '/admin/dashboard'
  };
  return routes[userRole.value] || '/dashboard';
}

function isActiveRoute(routePath) {
  return route.path === routePath || route.path.startsWith(routePath + '/');
}

function toggleMiniVariant() {
  miniVariant.value = !miniVariant.value;
}

// Watch for mobile changes
watch(() => window.innerWidth, (width) => {
  isMobile.value = width < 960;
  if (isMobile.value) {
    miniVariant.value = false;
  }
}, { immediate: true });

// Watch drawer changes
watch(drawer, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  drawer.value = newValue;
});
</script>

<style scoped>
.professional-nav {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%) !important;
  border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1) !important;
}

.nav-mini {
  background: #ffffff !important;
}

.nav-header {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-brand h3 {
  color: var(--primary-700) !important;
  font-size: var(--font-size-lg) !important;
  font-weight: var(--font-weight-bold) !important;
}

.nav-section-header {
  color: var(--neutral-600) !important;
  font-size: var(--font-size-xs) !important;
  font-weight: var(--font-weight-semibold) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  margin-top: var(--spacing-md) !important;
}

.nav-item {
  margin: var(--spacing-xs) var(--spacing-sm) !important;
  border-radius: var(--border-radius-md) !important;
  transition: all var(--transition-normal) !important;
}

.nav-item:hover {
  background-color: var(--primary-50) !important;
  transform: translateX(2px) !important;
}

.nav-item-active {
  background-color: var(--primary-100) !important;
  box-shadow: var(--shadow-sm) !important;
}

.nav-item-title {
  font-size: var(--font-size-sm) !important;
  font-weight: var(--font-weight-medium) !important;
  color: var(--neutral-700) !important;
}

.nav-footer {
  background: var(--neutral-50);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-toggle-btn {
  color: var(--neutral-500) !important;
}

.nav-toggle-btn:hover {
  background-color: var(--neutral-100) !important;
  color: var(--primary-500) !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .professional-nav {
    width: 280px !important;
  }
  
  .nav-mini {
    width: 72px !important;
  }
}

/* Animation for mini variant */
.professional-nav {
  transition: width var(--transition-normal) !important;
}

.nav-item {
  transition: all var(--transition-normal) !important;
}
</style>
