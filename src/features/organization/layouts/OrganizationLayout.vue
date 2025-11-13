<!--
  Este es el componente principal para el Dashboard de la Organización.
  Está construido con Vuetify y sigue una estructura de layout moderna con una barra de navegación lateral y un área de contenido principal.
-->
<template>
  <v-app>
    <!-- 
      BARRA DE NAVEGACIÓN SUPERIOR (App Bar)
      - Es fija (`app`) y transparente (`flat`, `color="transparent"`) con un borde inferior.
      - Contiene el título, un campo de búsqueda, notificaciones y un menú de usuario.
      - El ícono de navegación (`v-app-bar-nav-icon`) solo aparece en pantallas pequeñas (`d-md-none`) para abrir/cerrar el menú lateral.
    -->
    <v-app-bar color="primary" class="app-bar-style" flat elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <img 
          src="@/assets/images/logo_afroimpacto2.png" 
          alt="Afro Impacto Logo" 
          class="mr-2"
          style="height: 60px; width: auto;"
        />
      </div>
      <v-spacer></v-spacer>
      <v-btn 
        color="white" 
        variant="flat" 
        class="d-none d-md-flex rounded-pill new-project-btn"
        @click="createNewProject"
      >
        <v-icon start>mdi-plus</v-icon>
        Nuevo Proyecto
      </v-btn>

      <div class="d-flex align-center ml-6">
        <v-btn icon class="mr-1" aria-label="Notificaciones" color="white">
          <v-badge dot color="red-accent-2">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
        <v-menu offset-y left transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="ml-1" aria-label="Menú de usuario">
              <v-icon size="large" color="white">mdi-account-circle</v-icon>
            </v-btn>
          </template>
        <v-list density="compact" class="user-menu-list pa-2">
          <v-list-item class="mb-2" v-if="authStore.user">
            <template v-slot:prepend>
              <v-avatar color="primary" size="40" class="mr-3">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">{{ authStore.user.nombre || 'Usuario' }}</v-list-item-title>
            <v-list-item-subtitle>{{ authStore.user.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <div class="mt-2">
            <v-list-item link @click="goToProfile" class="user-menu-item">
              <template v-slot:prepend><v-icon>mdi-account-cog-outline</v-icon></template>
              <v-list-item-title>Mi Perfil</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="goToSettings" class="user-menu-item">
              <template v-slot:prepend><v-icon>mdi-cog-outline</v-icon></template>
              <v-list-item-title>Configuración</v-list-item-title>
            </v-list-item>
          </div>
          <v-divider></v-divider>
          <v-list-item link @click="logout" class="logout-item mt-2">
            <template v-slot:prepend><v-icon>mdi-logout</v-icon></template>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      </div>
    </v-app-bar>

    <!-- 
      MENÚ DE NAVEGACIÓN LATERAL (Navigation Drawer)
      - Es flotante (`floating`) y permanente en pantallas grandes (`permanent="$vuetify.display.mdAndUp"`).
      - Puede minimizarse (`mini-variant`) para ahorrar espacio.
      - El ancho (`width`) se ajusta dinámicamente si está minimizado o no.
      - Contiene la lista de enlaces de navegación del dashboard.
    -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      floating
      :width="drawerWidth"
      :mini-variant="miniVariant"
      class="custom-navigation-drawer"
    >
      <div class="d-flex align-center pa-2">
        <v-list-item-title class="text-h6 font-weight-bold text-primary ml-2">
          <img 
            v-if="miniVariant"
            src="@/assets/images/logo_afroimpacto2.png" 
            alt="Afro Impacto Logo" 
            style="height: 24px; width: auto;"
          />
          <span v-else>Afro Impacto</span>
        </v-list-item-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="$vuetify.display.mdAndUp"
          icon
          variant="text"
          size="small"
          @click.stop="miniVariant = !miniVariant"
          class="mr-1"
        >
          <v-icon>{{ miniVariant ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>

      <v-list nav density="compact" class="mt-4">
        <!-- Dashboard -->
        <v-list-item 
          value="dashboard" 
          to="/organization/dashboard" 
          :active="isActive('/organization/dashboard')"
          link 
          class="nav-item mx-2 mb-1"
        >
          <template v-slot:prepend>
            <v-icon>mdi-view-dashboard</v-icon>
          </template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <!-- Proyectos con Submenú -->
        <v-list-group value="projects" class="nav-group mx-2 mb-1">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              class="nav-item-parent"
            >
              <template v-slot:prepend>
                <v-icon>mdi-folder-multiple</v-icon>
              </template>
              <v-list-item-title>Proyectos</v-list-item-title>
            </v-list-item>
          </template>

          <!-- Submenú Items -->
          <v-list-item
            value="all-projects"
            to="/organization/dashboard/projects"
            :active="isActive('/organization/dashboard/projects')"
            class="nav-item-child"
            link
          >
            <template v-slot:prepend>
              <v-icon size="small">mdi-view-list</v-icon>
            </template>
            <v-list-item-title>Todos los Proyectos</v-list-item-title>
          </v-list-item>

          <v-list-item
            value="create-project"
            to="/organization/dashboard/projects/create"
            :active="isActive('/organization/dashboard/projects/create')"
            class="nav-item-child"
            link
          >
            <template v-slot:prepend>
              <v-icon size="small">mdi-plus-circle</v-icon>
            </template>
            <v-list-item-title>Crear Proyecto</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Otros elementos del menú -->
        <v-list-item 
          value="volunteers"
          to="/organization/dashboard/volunteers" 
          :active="isActive('/organization/dashboard/volunteers')"
          link 
          class="nav-item mx-2 mb-1"
        >
          <template v-slot:prepend>
            <v-icon>mdi-account-group</v-icon>
          </template>
          <v-list-item-title>Voluntarios</v-list-item-title>
        </v-list-item>

        <v-list-item 
          value="donations"
          to="/organization/dashboard/donations" 
          :active="isActive('/organization/dashboard/donations')"
          link 
          class="nav-item mx-2 mb-1"
        >
          <template v-slot:prepend>
            <v-icon>mdi-cash-multiple</v-icon>
          </template>
          <v-list-item-title>Donaciones</v-list-item-title>
        </v-list-item>

        <v-list-item 
          value="reports"
          to="/organization/dashboard/reports" 
          :active="isActive('/organization/dashboard/reports')"
          link 
          class="nav-item mx-2 mb-1"
        >
          <template v-slot:prepend>
            <v-icon>mdi-file-chart</v-icon>
          </template>
          <v-list-item-title>Reportes</v-list-item-title>
        </v-list-item>

        <v-list-item 
          value="settings"
          to="/organization/dashboard/settings" 
          :active="isActive('/organization/dashboard/settings')"
          link 
          class="nav-item mx-2 mb-1"
        >
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>Configuración</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 
      CONTENIDO PRINCIPAL (Main Content)
      - Aquí es donde se renderiza el contenido principal del dashboard.
      - Muestra un indicador de carga (`v-progress-circular`) mientras los datos se están obteniendo.
      - Una vez cargados los datos, muestra los diferentes componentes del dashboard (WelcomeCard, MetricCards, etc.).
    -->
    <v-main>
      <router-view v-slot="{ Component }">
        <Transition 
          name="fade-slide" 
          mode="out-in" 
          appear
          @before-enter="onBeforeEnter"
          @after-enter="onAfterEnter"
        >
          <component :is="Component" :key="router.currentRoute.value.name || router.currentRoute.value.path" />
        </Transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
// --- SCRIPT (LÓGICA DEL COMPONENTE) ---

// Importaciones de Vue y Pinia
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

// --- STORES ---
const router = useRouter();
const authStore = useAuthStore();

// --- ESTADO DE TRANSICIÓN ---
const isTransitioning = ref(false);

function onBeforeEnter() {
  isTransitioning.value = true;
}

function onAfterEnter() {
  // Pequeño delay para asegurar que la animación termine suavemente
  setTimeout(() => {
    isTransitioning.value = false;
  }, 50);
}

// --- ESTADO DEL LAYOUT ---
// `drawer`: controla si el menú lateral está visible o no (especialmente en móvil).
const drawer = ref(null);
// `miniVariant`: controla si el menú está minimizado.
const miniVariant = ref(false);
// `drawerWidth`: calcula el ancho del menú dependiendo de si está minimizado.
const drawerWidth = computed(() => miniVariant.value ? 100 : 260);

// --- ELEMENTOS DE NAVEGACIÓN ---
// `selectedItem`: mantiene el elemento de la lista que está seleccionado.
const selectedItem = ref(null);
// `items`: un array de objetos que define los enlaces del menú lateral.
// Items array ya no es necesario con la nueva estructura

function createNewProject() {
  router.push('/organization/dashboard/projects/create');
}

function goToProfile() {
  // Navegar a perfil
  console.log('Ir a perfil');
}

function goToSettings() {
  // Navegar a configuración
  console.log('Ir a configuración');
}

async function logout() {
  await authStore.logout();
  router.push('/auth/login');
}

const isActive = (routePath) => {
  const currentPath = router.currentRoute.value.path;
  
  // Caso especial para dashboard - solo exacto
  if (routePath === '/organization/dashboard') {
    return currentPath === routePath;
  }
  
  // Para rutas de proyectos
  if (routePath === '/organization/dashboard/projects') {
    // Activo en lista de proyectos y en vistas de detalle (pero no en create)
    const isProjectsList = currentPath === routePath || currentPath === routePath + '/';
    const isProjectDetail = /^\/organization\/dashboard\/projects\/\d+/.test(currentPath);
    const isNotCreate = !currentPath.includes('/create');
    return (isProjectsList || isProjectDetail) && isNotCreate;
  }
  
  if (routePath === '/organization/dashboard/projects/create') {
    return currentPath.includes('/projects/create');
  }
  
  // Para voluntarios
  if (routePath === '/organization/dashboard/volunteers') {
    return currentPath === routePath || currentPath.startsWith(routePath + '/');
  }
  
  // Para donaciones
  if (routePath === '/organization/dashboard/donations') {
    return currentPath === routePath || currentPath.startsWith(routePath + '/');
  }
  
  // Para reportes
  if (routePath === '/organization/dashboard/reports') {
    return currentPath === routePath || currentPath.startsWith(routePath + '/');
  }
  
  // Para configuración
  if (routePath === '/organization/dashboard/settings') {
    return currentPath === routePath || currentPath.startsWith(routePath + '/');
  }
  
  // Para otras rutas, match exacto
  return currentPath === routePath;
};

// Sincronizar selectedItem con la ruta actual al cargar y al cambiar la ruta
onMounted(() => {
  // No es necesario aquí, ya que isActive se encarga de la reactividad
});

watch(() => router.currentRoute.value, (newRoute) => {
  // No es necesario aquí, ya que isActive se encarga de la reactividad
});
</script>


<style>
/* --- ESTILOS GLOBALES PARA EL DASHBOARD --- */
.v-application {
  background-color: #ffffff !important;
}

.v-main {
  background-color: #ffffff !important;
}

.v-main__wrap {
  background-color: #ffffff !important;
}

.v-card:hover {
  box-shadow: 0 12px 30px -5px rgba(0,0,0,0.1) !important;                                                                   
}

/* --- ESTILOS PARA EL MENÚ DE NAVEGACIÓN FLOTANTE --- */
.custom-navigation-drawer {
  /* Estos estilos controlan la posición y el tamaño del contenedor del menú */
  margin: 16px !important;
  max-height: calc(100% - 32px) !important;
  border-radius: 15px !important;
  box-shadow: 0 6px 20px -3px rgba(44, 62, 80, 0.25) !important;
}

.custom-navigation-drawer .v-navigation-drawer__content {
  background-color: transparent !important;
 }

/* En pantallas más pequeñas (móvil/tablet), el menú ocupa toda la altura y no es flotante */
@media (max-width: 1279px) {
  .custom-navigation-drawer {
    margin: 8px !important;
    max-height: calc(100% - 16px) !important;
    border-radius: 24px !important;
    box-shadow: 0 6px 20px -4px rgba(44, 62, 80, 0.25) !important;
  }
}

/* --- ESTILOS MEJORADOS PARA LOS ENLACES DE NAVEGACIÓN --- */
.nav-item .v-list-item__overlay {
  background-color: rgba(var(--v-theme-primary-rgb), 0.15) !important;
}

.nav-item .v-icon {
  color: #64748B !important;
  flex-shrink: 0 !important;
  transition: color 0.3s ease !important;
}

.nav-item .v-list-item-title {
  color: #475569 !important;
  transition: color 0.3s ease !important;
}

.nav-item {
  border-radius: 12px !important;
  margin: 4px 8px !important;
  padding: 8px 12px !important;
  min-height: 48px !important;
  transition: all 0.2s ease-in-out !important;
}

.nav-item .v-list-item-title {
  white-space: nowrap !important;
  overflow: visible !important;
  text-overflow: clip !important;
  font-size: 0.9375rem !important;
}

/* Efecto al pasar el ratón sobre un elemento inactivo */
.nav-item:not(.v-list-item--active):hover {
  background-color: rgba(44, 62, 80, 0.15) !important;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
  transform: translateX(4px);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.nav-item:not(.v-list-item--active):hover .v-icon,
.nav-item:not(.v-list-item--active):hover .v-list-item-title {
  color: #2c3e50 !important;
  transition: color 0.3s ease;
}

/* Estilo para el elemento de navegación activo */
.nav-item.v-list-item--active {
  background: #2c3e50 !important;
  color: white !important;
  box-shadow: 0 6px 20px -4px rgba(44, 62, 80, 0.5) !important;
}

.nav-item.v-list-item--active .v-icon {
  color: white !important;
}

.nav-item.v-list-item--active .v-list-item-title {
  color: white !important;
  font-weight: 600 !important;
}

/* Estilos para el submenú */
.nav-group {
  border-radius: 12px !important;
  margin: 4px 8px !important;
  overflow: visible !important;
}

.nav-group :deep(.v-list-group__items) {
  background: rgba(0, 0, 0, 0.02) !important;
  border-radius: 0 0 12px 12px !important;
  padding: 6px 0 !important;
  margin-top: 2px !important;
  overflow: visible !important;
}

/* Eliminar padding interno de Vuetify que desplaza a la derecha */
.nav-group :deep(.v-list-group__items .v-list-item) {
  padding-left: 0 !important;
}

.nav-item-parent {
  border-radius: 12px !important;
  font-weight: 500 !important;
  min-height: 48px !important;
  padding: 8px 12px !important;
  transition: all 0.2s ease-in-out !important;
}

.nav-item-parent .v-list-item-title {
  white-space: nowrap !important;
  overflow: visible !important;
  text-overflow: clip !important;
  font-size: 0.9375rem !important;
  color: #475569 !important;
  transition: color 0.3s ease !important;
}

.nav-item-parent .v-icon {
  color: #64748B !important;
  flex-shrink: 0 !important;
  transition: color 0.3s ease !important;
}

.nav-item-parent:hover {
  background-color: rgba(44, 62, 80, 0.15) !important;
  transform: translateX(4px);
}

.nav-item-parent:hover .v-icon,
.nav-item-parent:hover .v-list-item-title {
  color: #2c3e50 !important;
}

.nav-item-child {
  border-radius: 8px !important;
  margin: 2px 8px !important;
  min-height: 38px !important;
  padding: 5px 8px !important;
  transition: all 0.2s ease-in-out !important;
}

.nav-item-child .v-list-item-title {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  font-size: 0.8125rem !important;
  font-weight: 500 !important;
  color: #475569 !important;
  transition: color 0.3s ease !important;
  line-height: 1.3 !important;
}

.nav-item-child .v-icon {
  color: #64748B !important;
  transition: color 0.3s ease !important;
  font-size: 16px !important;
}

.nav-item-child .v-list-item__prepend {
  flex-shrink: 0 !important;
  margin-right: 8px !important;
  min-width: 20px !important;
}

.nav-item-child:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
  transform: translateX(4px);
}

.nav-item-child:hover .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}

.nav-item-child:hover .v-list-item-title {
  color: rgb(var(--v-theme-primary)) !important;
}

.nav-item-child.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.15) !important;
  font-weight: 600 !important;
  border-left: 3px solid rgb(var(--v-theme-primary)) !important;
  padding-left: 5px !important;
}

.nav-item-child.v-list-item--active .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}

.nav-item-child.v-list-item--active .v-list-item-title {
  color: rgb(var(--v-theme-primary)) !important;
}

.v-list-group--active > .v-list-item .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}

.v-list-group--active > .v-list-item .v-list-item-title {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Cuando el grupo está expandido, resaltar el activador si algún hijo está activo */
.v-list-group--active .nav-item-parent {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

/* Asegurar que el menú expandido no se corte */
.nav-group :deep(.v-list-group__header) {
  overflow: visible !important;
}

/* Asegurar espaciado consistente en el drawer */
.custom-navigation-drawer :deep(.v-list) {
  padding: 8px 0 !important;
}

/* Asegurar que todos los elementos tengan el mismo color base */
.custom-navigation-drawer .v-list-item {
  color: #475569 !important;
}

.custom-navigation-drawer .v-list-item .v-icon {
  color: #64748B !important;
}

/* Mejorar la visibilidad en modo mini */
.custom-navigation-drawer.v-navigation-drawer--mini-variant .nav-item .v-list-item-title,
.custom-navigation-drawer.v-navigation-drawer--mini-variant .nav-group {
  opacity: 0 !important;
  width: 0 !important;
}

.custom-navigation-drawer.v-navigation-drawer--mini-variant .nav-item {
  justify-content: center !important;
  padding: 8px !important;
}

.custom-navigation-drawer.v-navigation-drawer--mini-variant .nav-item .v-icon {
  color: #64748B !important;
  margin: 0 !important;
}

.custom-navigation-drawer.v-navigation-drawer--mini-variant .nav-item.v-list-item--active .v-icon {
  color: white !important;
}

/* --- ESTILOS PARA LAS TARJETAS (CARDS) --- */
.v-card {
  border-radius: 20px !important;
  border: none !important;
  box-shadow: 0 8px 25px -5px rgba(0,0,0,0.05) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}



/* --- ESTILOS GENERALES PARA OTROS COMPONENTES --- */
.v-btn, .v-chip {
  border-radius: 12px !important;
}

.v-text-field .v-input__control {
  border-radius: 12px !important;
}

/* --- ESTILOS PARA EL CONTENIDO PRINCIPAL --- */
.main-content {
  padding: 24px;
}

/* --- NUEVOS ESTILOS PARA LA BARRA DE NAVEGACIÓN SUPERIOR --- */
.app-bar-style {
  padding: 0 24px !important;
  backdrop-filter: saturate(180%) blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  transition: box-shadow 0.3s ease;
}

.app-bar-style:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
}

/* Estilos para el botón de nuevo proyecto */
.new-project-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-weight: 600;
  color: #4ec7a5 !important;
}

.new-project-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 184, 148, 0.3);
}

/* Estilos para el menú de usuario */
.user-menu-list {
  min-width: 260px !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
}

.user-menu-item .v-list-item-title {
  font-weight: 500;
}

.user-menu-item:hover {
  background-color: rgba(44, 62, 80, 0.1) !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  border-radius: 10px !important;
}

.logout-item:hover {
  background-color: #ffe9e9 !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  border-radius: 10px !important;
}

.logout-item {
  color: #E53935;
}

.logout-item .v-list-item-title {
  font-weight: 500;
}

/* Ajustes responsivos */
@media (max-width: 599px) {
  .new-project-btn {
    display: none;
  }
}


</style>

<style scoped>
/* Animación de transición para las vistas */
/* Transiciones optimizadas para mejor rendimiento */
.fade-slide-enter-active {
  transition: opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-slide-leave-active {
  transition: opacity 0.15s ease-in, transform 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Optimización para prevenir reflows durante la transición */
.v-main > * {
  will-change: opacity, transform;
}
</style>
