<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUiStore } from '@/stores/uiStore';
import { useScrollToSection } from '@/composables/useScrollToSection';
import NotificationSnackbar from '@/components/notifications/NotificationSnackbar.vue';
import GlobalSearch from '@/components/search/GlobalSearch.vue';

const router = useRouter();

const uiStore = useUiStore();
const route = useRoute();
const { scrollToSection } = useScrollToSection();

const menuItems = ref([
  { text: 'Inicio', section: 'inicio', icon: 'mdi-home' },
  { text: 'Proyectos', section: 'proyectos', icon: 'mdi-folder-multiple' },
  { text: 'Perfiles', section: 'perfiles', icon: 'mdi-account-group' },
  { text: 'Nosotros', section: 'nosotros', icon: 'mdi-information' }
]);

const handleMobileLinkClick = (section) => {
  scrollToSection(section);
  if (uiStore.drawer) {
    uiStore.toggleDrawer();
  }
};

const goToLogin = () => {
  router.push('/login');
  uiStore.toggleDrawer();
};

const goToRegister = () => {
  router.push('/register');
  uiStore.toggleDrawer();
};

const globalSearchOpen = ref(false);
</script>

<template>
  <v-app>
    <v-main>
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <div :key="route.name">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </v-main>
    <!-- Componente global de notificaciones -->
    <NotificationSnackbar />
    <!-- Búsqueda Global -->
    <GlobalSearch v-model="globalSearchOpen" />
    <v-navigation-drawer
      v-model="uiStore.drawer"
      temporary
      location="right"
      class="mobile-drawer-container"
    >
      <div class="drawer-header-section d-flex justify-center align-center">
        <v-img src="/src/assets/images/logo_afroimpacto.png" height="50" contain />
      </div>

      <v-list class="mobile-drawer-list" nav>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="item.text"
          @click="handleMobileLinkClick(item.section)"
          class="drawer-list-item"
          :class="{ 'drawer-list-item-active': uiStore.activeSection === item.section }"
          :style="{ '--stagger-index': index }"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" class="drawer-list-icon"></v-icon>
          </template>
          <v-list-item-title class="drawer-list-title">{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="drawer-auth-buttons-section pa-4">
          <v-btn block class="ingresar-btn mb-3" @click="goToLogin">Ingresar</v-btn>
          <v-btn block class="registrar-btn" @click="goToRegister">Registrarse</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-app>
</template>

<style>
/* ESTILOS MEJORADOS PARA EL DRAWER EN APP.VUE */
.mobile-drawer-container {
  background: linear-gradient(to top, #e0fdf7 0%, #f7fdfb 100%) !important;
  box-shadow: -8px 0 20px rgba(0, 0, 0, 0.15);
  background-color: #f7fdfb !important; /* Respaldo para el fondo */
}

.v-navigation-drawer__content {
    background-color: #f7fdfb !important;
    z-index: 1006 !important;
}

.drawer-header-section {
  background-color: #ffffff;
  padding-top: 30px !important;
  padding-bottom: 30px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.text-primary-darken-2 {
  color: #18b97e;
}

.mobile-drawer-list {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.drawer-list-item {
  color: #424242 !important;
  transition: background-color 0.2s ease, color 0.2s ease, border-left 0.2s ease, padding-left 0.2s ease;
  border-left: 5px solid transparent;
  padding-top: 14px !important;
  padding-bottom: 14px !important;
  padding-left: 20px !important;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-enter-active {
  transition-delay: calc(0.07s * var(--stagger-index));
}

.drawer-list-item:hover {
  background-color: rgba(78, 199, 165, 0.15) !important;
  color: #18b97e !important;
  border-left: 5px solid #4ec7a5 !important;
  padding-left: 25px !important;
}

.drawer-list-item-active {
  background-color: rgba(78, 199, 165, 0.25) !important;
  color: #18b97e !important;
  font-weight: bold !important;
  border-left: 5px solid #18b97e !important;
  padding-left: 25px !important;
}

.drawer-list-icon {
  color: #616161 !important;
  transition: color 0.2s ease;
}

.drawer-list-item:hover .drawer-list-icon,
.drawer-list-item-active .drawer-list-icon {
  color: #18b97e !important;
}

.drawer-list-title {
  color: #424242 !important;
  transition: color 0.2s ease;
}

.drawer-list-item:hover .drawer-list-title,
.drawer-list-item-active .drawer-list-title {
  color: #18b97e !important;
}

.drawer-auth-buttons-section {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background-color: rgba(78, 199, 165, 0.05);
}

.ingresar-btn,
.registrar-btn {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 12px !important;
  min-width: 120px;
  min-height: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: none;
  box-shadow: 0 6px 15px rgba(78, 199, 165, 0.5) !important;
  letter-spacing: 0.5px;
  padding-bottom: 3px;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  border: none !important;
}
.ingresar-btn:hover,
.registrar-btn:hover {
  background: #fff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 8px 18px rgba(78, 199, 165, 0.7) !important;
}

.divider-subtle {
    border-color: rgba(0, 0, 0, 0.05) !important;
}
</style>