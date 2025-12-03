<template>
  <div class="afro-layout">
    <!-- Professional Sidebar -->
    <aside class="afro-sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="afro-sidebar-header">
        <div class="d-flex align-center justify-space-between">
          <div v-if="!sidebarCollapsed" class="d-flex align-center">
            <v-avatar size="40" color="primary" class="mr-3">
              <v-icon color="white">mdi-heart</v-icon>
            </v-avatar>
            <div>
              <h3 class="afro-heading-4 mb-0">AfroImpacto</h3>
              <p class="afro-caption mb-0">{{ userRole }}</p>
            </div>
          </div>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="toggleSidebar"
            class="sidebar-toggle"
          >
            <v-icon>{{ sidebarCollapsed ? 'mdi-menu' : 'mdi-menu-open' }}</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="afro-sidebar-nav">
        <div v-for="section in navigationSections" :key="section.title" class="nav-section">
          <div v-if="!sidebarCollapsed" class="nav-section-title">
            <span class="afro-caption">{{ section.title }}</span>
          </div>
          
          <div v-for="item in section.items" :key="item.name" class="nav-item-wrapper">
            <router-link
              :to="item.route"
              class="afro-nav-item"
              :class="{ 'active': $route.path.startsWith(item.route) }"
              :title="sidebarCollapsed ? item.label : ''"
            >
              <v-icon :icon="item.icon" class="mr-3"></v-icon>
              <span v-if="!sidebarCollapsed" class="nav-item-label">{{ item.label }}</span>
              
              <!-- Badge for notifications -->
              <v-badge
                v-if="item.badge && !sidebarCollapsed"
                :content="item.badge"
                color="error"
                class="ml-auto"
              ></v-badge>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- User Profile Section -->
      <div class="sidebar-footer">
        <div class="user-profile-card afro-card">
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary" class="mr-3">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
            <div v-if="!sidebarCollapsed" class="flex-grow-1">
              <div class="afro-body-small font-weight-medium">{{ user?.name || 'Usuario' }}</div>
              <div class="afro-caption">{{ user?.email || 'usuario@email.com' }}</div>
            </div>
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  v-bind="props"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="goToProfile">
                  <template #prepend>
                    <v-icon>mdi-account</v-icon>
                  </template>
                  <v-list-item-title>Mi Perfil</v-list-item-title>
                </v-list-item>
                <v-list-item @click="goToSettings">
                  <template #prepend>
                    <v-icon>mdi-cog</v-icon>
                  </template>
                  <v-list-item-title>Configuración</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="logout">
                  <template #prepend>
                    <v-icon>mdi-logout</v-icon>
                  </template>
                  <v-list-item-title>Cerrar Sesión</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="afro-main-content">
      <!-- Professional Header -->
      <header class="afro-header">
        <div class="d-flex align-center">
          <div class="afro-header-title">
            {{ currentPageTitle }}
          </div>
          <v-breadcrumbs
            v-if="breadcrumbs.length > 0"
            :items="breadcrumbs"
            class="ml-4"
            color="primary"
          ></v-breadcrumbs>
        </div>
        
        <div class="afro-header-actions">
          <!-- Global Search -->
          <GlobalSearch />
          
          <!-- Notifications -->
          <NotificationBell />
          
          <!-- Quick Actions -->
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                icon
                variant="text"
                v-bind="props"
                class="quick-actions-btn"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="action in quickActions"
                :key="action.name"
                @click="action.handler"
              >
                <template #prepend>
                  <v-icon :color="action.color">{{ action.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ action.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </header>

      <!-- Page Content -->
      <div class="afro-page-content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/features/auth/stores/authStore';
import GlobalSearch from '@/components/ui/GlobalSearch.vue';
import NotificationBell from '@/components/notifications/NotificationBell.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const sidebarCollapsed = ref(false);

// Computed properties
const userRole = computed(() => {
  if (!user.value) return 'Invitado';
  return user.value.tipo_usuario === 'organizacion' ? 'Organización' : 'Voluntario';
});

const currentPageTitle = computed(() => {
  const routeName = route.name;
  const titleMap = {
    'home': 'Dashboard',
    'projects': 'Proyectos',
    'volunteers': 'Voluntarios',
    'donations': 'Donaciones',
    'reports': 'Reportes',
    'profile': 'Mi Perfil',
    'settings': 'Configuración'
  };
  return titleMap[routeName] || 'AfroImpacto';
});

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(segment => segment);
  const breadcrumbItems = [];
  
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbItems.push({
      title: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
      disabled: index === pathSegments.length - 1
    });
  });
  
  return breadcrumbItems;
});

// Navigation configuration based on user role
const navigationSections = computed(() => {
  const baseSections = [
    {
      title: 'Principal',
      items: [
        {
          name: 'dashboard',
          label: 'Dashboard',
          icon: 'mdi-view-dashboard',
          route: '/dashboard',
          badge: null
        }
      ]
    }
  ];

  if (user.value?.tipo_usuario === 'organizacion') {
    baseSections.push(
      {
        title: 'Gestión',
        items: [
          {
            name: 'projects',
            label: 'Proyectos',
            icon: 'mdi-folder-heart',
            route: '/organization/dashboard/projects',
            badge: null
          },
          {
            name: 'volunteers',
            label: 'Voluntarios',
            icon: 'mdi-account-group',
            route: '/organization/dashboard/volunteers',
            badge: null
          },
          {
            name: 'donations',
            label: 'Donaciones',
            icon: 'mdi-currency-usd',
            route: '/organization/dashboard/donations',
            badge: null
          }
        ]
      },
      {
        title: 'Análisis',
        items: [
          {
            name: 'reports',
            label: 'Reportes',
            icon: 'mdi-chart-line',
            route: '/organization/dashboard/reports',
            badge: null
          },
          {
            name: 'analytics',
            label: 'Analytics',
            icon: 'mdi-chart-box',
            route: '/organization/dashboard/analytics',
            badge: null
          }
        ]
      }
    );
  } else if (user.value?.tipo_usuario === 'voluntario') {
    baseSections.push(
      {
        title: 'Participación',
        items: [
          {
            name: 'catalog',
            label: 'Catálogo de Proyectos',
            icon: 'mdi-book-open',
            route: '/volunteer/catalog',
            badge: null
          },
          {
            name: 'my-projects',
            label: 'Mis Proyectos',
            icon: 'mdi-folder-heart',
            route: '/volunteer/my-projects',
            badge: null
          },
          {
            name: 'calendar',
            label: 'Calendario',
            icon: 'mdi-calendar',
            route: '/volunteer/calendar',
            badge: null
          }
        ]
      },
      {
        title: 'Desarrollo',
        items: [
          {
            name: 'skills',
            label: 'Mis Habilidades',
            icon: 'mdi-school',
            route: '/volunteer/skills',
            badge: null
          },
          {
            name: 'certificates',
            label: 'Certificados',
            icon: 'mdi-certificate',
            route: '/volunteer/certificates',
            badge: null
          }
        ]
      }
    );
  }

  // Common sections for all users
  baseSections.push(
    {
      title: 'Comunicación',
      items: [
        {
          name: 'messages',
          label: 'Mensajes',
          icon: 'mdi-message',
          route: '/messages',
          badge: 3
        },
        {
          name: 'notifications',
          label: 'Notificaciones',
          icon: 'mdi-bell',
          route: '/notifications',
          badge: 5
        }
      ]
    },
    {
      title: 'Cuenta',
      items: [
        {
          name: 'profile',
          label: 'Mi Perfil',
          icon: 'mdi-account',
          route: '/profile',
          badge: null
        },
        {
          name: 'settings',
          label: 'Configuración',
          icon: 'mdi-cog',
          route: '/settings',
          badge: null
        }
      ]
    }
  );

  return baseSections;
});

// Quick actions based on user role
const quickActions = computed(() => {
  if (user.value?.tipo_usuario === 'organizacion') {
    return [
      {
        name: 'new-project',
        label: 'Nuevo Proyecto',
        icon: 'mdi-plus-circle',
        color: 'primary',
        handler: () => router.push('/organization/dashboard/projects/create')
      },
      {
        name: 'invite-volunteer',
        label: 'Invitar Voluntario',
        icon: 'mdi-account-plus',
        color: 'success',
        handler: () => router.push('/organization/dashboard/volunteers/invite')
      },
      {
        name: 'create-donation',
        label: 'Nueva Donación',
        icon: 'mdi-currency-usd',
        color: 'warning',
        handler: () => router.push('/organization/dashboard/donations/create')
      }
    ];
  } else if (user.value?.tipo_usuario === 'voluntario') {
    return [
      {
        name: 'browse-projects',
        label: 'Explorar Proyectos',
        icon: 'mdi-magnify',
        color: 'primary',
        handler: () => router.push('/volunteer/catalog')
      },
      {
        name: 'update-availability',
        label: 'Actualizar Disponibilidad',
        icon: 'mdi-calendar-check',
        color: 'info',
        handler: () => router.push('/volunteer/availability')
      },
      {
        name: 'add-skill',
        label: 'Agregar Habilidad',
        icon: 'mdi-school',
        color: 'success',
        handler: () => router.push('/volunteer/skills/add')
      }
    ];
  }
  return [];
});

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const goToProfile = () => {
  router.push('/profile');
};

const goToSettings = () => {
  router.push('/settings');
};

const logout = () => {
  authStore.logout();
  router.push('/auth/login');
};

// Watch for route changes to update page title
watch(route, () => {
  // Update any necessary state when route changes
}, { immediate: true });
</script>

<style scoped>
.afro-layout {
  display: flex;
  min-height: 100vh;
  background: var(--afro-background);
}

.afro-sidebar {
  background: var(--afro-surface);
  border-right: 1px solid var(--afro-border);
  min-height: 100vh;
  width: 280px;
  padding: var(--afro-space-lg);
  transition: width var(--afro-transition-normal);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.afro-sidebar.collapsed {
  width: 80px;
  padding: var(--afro-space-md);
}

.afro-sidebar-header {
  padding-bottom: var(--afro-space-lg);
  border-bottom: 1px solid var(--afro-border);
  margin-bottom: var(--afro-space-lg);
}

.sidebar-toggle {
  position: absolute;
  top: var(--afro-space-lg);
  right: var(--afro-space-md);
}

.afro-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-lg);
}

.nav-section {
  margin-bottom: var(--afro-space-lg);
}

.nav-section-title {
  margin-bottom: var(--afro-space-sm);
  padding: 0 var(--afro-space-sm);
}

.nav-item-wrapper {
  margin-bottom: var(--afro-space-xs);
}

.afro-nav-item {
  display: flex;
  align-items: center;
  padding: var(--afro-space-sm) var(--afro-space-md);
  color: var(--afro-text-secondary);
  text-decoration: none;
  border-radius: var(--afro-radius-md);
  transition: all var(--afro-transition-fast);
  font-weight: 500;
  position: relative;
}

.afro-nav-item:hover {
  background: var(--afro-primary-50);
  color: var(--afro-primary);
}

.afro-nav-item.active {
  background: var(--afro-primary);
  color: white;
}

.nav-item-label {
  flex: 1;
}

.sidebar-footer {
  position: absolute;
  bottom: var(--afro-space-lg);
  left: var(--afro-space-lg);
  right: var(--afro-space-lg);
}

.user-profile-card {
  padding: var(--afro-space-md);
}

.afro-main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left var(--afro-transition-normal);
}

.afro-sidebar.collapsed + .afro-main-content {
  margin-left: 80px;
}

.afro-header {
  background: var(--afro-surface);
  border-bottom: 1px solid var(--afro-border);
  padding: var(--afro-space-md) var(--afro-space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.afro-header-title {
  font-size: var(--afro-text-xl);
  font-weight: 600;
  color: var(--afro-text-primary);
}

.afro-header-actions {
  display: flex;
  align-items: center;
  gap: var(--afro-space-md);
}

.quick-actions-btn {
  background: var(--afro-primary);
  color: white;
}

.quick-actions-btn:hover {
  background: var(--afro-primary-dark);
}

.afro-page-content {
  padding: var(--afro-space-lg);
  min-height: calc(100vh - 80px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .afro-sidebar {
    transform: translateX(-100%);
    transition: transform var(--afro-transition-normal);
  }
  
  .afro-sidebar.open {
    transform: translateX(0);
  }
  
  .afro-main-content {
    margin-left: 0;
  }
  
  .afro-header {
    padding: var(--afro-space-sm) var(--afro-space-md);
  }
  
  .afro-page-content {
    padding: var(--afro-space-md);
  }
}

/* Animation for sidebar collapse */
.afro-sidebar.collapsed .nav-item-label {
  opacity: 0;
  transition: opacity var(--afro-transition-fast);
}

.afro-sidebar:not(.collapsed) .nav-item-label {
  opacity: 1;
  transition: opacity var(--afro-transition-fast);
}
</style>
