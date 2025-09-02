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
    <v-app-bar color="white" class="app-bar-style" flat elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-icon class="mr-2 text-primary" size="32">mdi-alpha-a-box</v-icon>
        <v-toolbar-title class="font-weight-bold text-primary">Afro Impacto</v-toolbar-title>
      </div>
      <v-spacer></v-spacer>
      <v-btn 
        color="primary" 
        variant="flat" 
        class="d-none d-md-flex rounded-pill new-project-btn"
        @click="createNewProject"
      >
        <v-icon start>mdi-plus</v-icon>
        Nuevo Proyecto
      </v-btn>

      <div class="d-flex align-center ml-6">
        <v-btn icon class="mr-1" aria-label="Notificaciones" style="color: #2c3e50;">
          <v-badge dot color="red-accent-2">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
        <v-menu offset-y left transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="ml-1" aria-label="Menú de usuario">
              <v-icon size="large" style="color: #2c3e50;">mdi-account-circle</v-icon>
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
          <v-icon v-if="miniVariant">mdi-alpha-a-box</v-icon>
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
        <v-list-item v-for="item in items" :key="item.text" :value="item.text" :to="item.route" :active="isActive(item.route)" link class="nav-item mx-2 mb-1">
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.text"></v-list-item-title>
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
        <Transition name="slide-fade" mode="out-in">
          <component :is="Component" :key="router.currentRoute.value.fullPath" />
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

// --- ESTADO DEL LAYOUT ---
// `drawer`: controla si el menú lateral está visible o no (especialmente en móvil).
const drawer = ref(null);
// `miniVariant`: controla si el menú está minimizado.
const miniVariant = ref(false);
// `drawerWidth`: calcula el ancho del menú dependiendo de si está minimizado.
const drawerWidth = computed(() => miniVariant.value ? 100 : 280);

// --- ELEMENTOS DE NAVEGACIÓN ---
// `selectedItem`: mantiene el elemento de la lista que está seleccionado.
const selectedItem = ref(null);
// `items`: un array de objetos que define los enlaces del menú lateral.
const items = ref([
  { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/organization/dashboard' },
  { text: 'Proyectos', icon: 'mdi-folder-multiple', route: '/organization/dashboard/projects' },
  { text: 'Voluntarios', icon: 'mdi-account-group', route: '/organization/dashboard/volunteers' },
  { text: 'Donaciones', icon: 'mdi-cash-multiple', route: '/organization/dashboard/donations' },
  { text: 'Reportes', icon: 'mdi-file-chart', route: '/organization/dashboard/reports' },
  { text: 'Configuración', icon: 'mdi-cog', route: '/organization/dashboard/settings' },
]);

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
  const currentRoute = router.currentRoute.value;
  const currentPath = currentRoute.path;

  // Find all items whose route is a prefix of currentPath
  const matchingItems = items.value.filter(item => currentPath.startsWith(item.route));

  if (matchingItems.length === 0) {
    return false;
  }

  // Find the item with the longest route prefix match
  const longestMatch = matchingItems.reduce((prev, curr) => {
    return curr.route.length > prev.route.length ? curr : prev;
  });

  // Return true if the routePath matches the longest matching item's route
  return routePath === longestMatch.route;
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
  /* Cambia el color de fondo de toda la aplicación cuando este componente está activo */
  background-color: #f6f9ff !important;
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
  /* Color del efecto "ripple" al hacer clic */
  background-color: rgba(var(--v-theme-primary-rgb), 0.15) !important;
}

.nav-item .v-icon {
  /* Color de los iconos inactivos */
  color: #A0AEC0;
}

.nav-item {
  border-radius: 12px !important;
  margin: 4px 8px !important;
  transition: all 0.2s ease-in-out !important;
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

.nav-item.v-list-item--active .v-icon,
.nav-item.v-list-item--active .v-list-item-title {
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
  color: white !important;
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
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
