<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '@/stores/uiStore';
import { useScrollToSection } from '@/composables/useScrollToSection';

const uiStore = useUiStore();
const router = useRouter();
const { scrollToSection } = useScrollToSection();
const scrolled = ref(false);
const menuItems = ref([
  { text: 'Inicio', section: 'inicio', icon: 'mdi-home' },
  { text: 'Proyectos', section: 'proyectos', icon: 'mdi-folder-multiple' },
  { text: 'Perfiles', section: 'perfiles', icon: 'mdi-account-group' },
  { text: 'Nosotros', section: 'nosotros', icon: 'mdi-information' }
]);

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleScrollToSection = (section) => {
  scrollToSection(section);
};

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <v-app-bar
    app
    fixed
    flat
    :color="scrolled ? 'rgba(78, 199, 165, 0.9)' : 'transparent'"
    height="72"
    :elevation="scrolled ? 6 : 0"
    :class="{ 'header-blur': scrolled }"
    class="app-header"
  >
    <v-container fluid class="px-md-8 px-4">
      <v-row align="center" justify="space-between" no-gutters>
        <v-col cols="auto" class="d-flex align-center">
          <router-link to="/" class="logo-link" aria-label="Ir a la página de inicio">
            <v-img
              src="/src/assets/images/logo_afroimpacto2.png"
              alt="Logo Afro Impacto"
              class="logo-img"
              style="object-fit: contain;"
            />
          </router-link>
        </v-col>
        <v-col cols="auto" class="d-none d-md-flex align-center justify-end">
          <div class="d-flex align-center">
            <v-btn
              v-for="item in menuItems"
              :key="item.text"
              text
              class="mx-3 text-body-1 font-weight-semibold menu-btn"
              :class="{ 'menu-btn-active': uiStore.activeSection === item.section }"
              @click="handleScrollToSection(item.section)"
              aria-label="Navegar a {{ item.text }}"
            >
              <v-icon left size="20" class="menu-icon">{{ item.icon }}</v-icon>
              {{ item.text }}
            </v-btn>
            <v-btn
              depressed
              class="ml-3 registrar-btn"
              :class="{ 'auth-btn-scrolled': scrolled }"
              @click="goToRegister"
              aria-label="Registrarse"
            >
              Registrarse
            </v-btn>
            <v-btn
              depressed
              class="ml-3 ingresar-btn"
              :class="{ 'auth-btn-scrolled': scrolled }"
              @click="goToLogin"
              aria-label="Ingresar"
            >
              Ingresar
            </v-btn>
          </div>
        </v-col>
        <v-col cols="auto" class="d-flex d-md-none">
          <v-btn icon @click="uiStore.toggleDrawer()" class="text-white" aria-label="Abrir menú de navegación">
            <v-icon size="32">mdi-menu</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.app-header {
  font-family: 'Inter', sans-serif;
  transition: background 0.4s ease-in-out, box-shadow 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out;
  padding: 0 16px;
  z-index: 1000; /* Asegura que el header esté por encima de otros elementos */
}

.header-blur {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* LOGO */
.logo-link {
  display: flex;
  align-items: center;
  height: 100%;
  text-decoration: none;
}

.logo-img {
  width: 140px;
  height: 140px;
  min-width: 140px;
  min-height: 140px;
  display: block;
  object-fit: contain;
  background-color: transparent !important;
  transition: transform 0.3s ease-in-out;
}

.logo-img:hover {
  transform: scale(1.1);
}

/* MENÚ DE ESCRITORIO */
.menu-btn {
  color: #ffffff !important;
  border-radius: 10px;
  font-weight: 600;
  text-transform: none;
  background: transparent !important;
  margin-right: 12px;
  padding: 8px 16px;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12) !important;
  display: flex;
  align-items: center;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-3px);
}

.menu-btn-active {
  background: rgba(255, 255, 255, 0.4) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border-bottom: 3px solid rgba(255, 255, 255, 0.95) !important;
  padding-bottom: 6px !important;
  transform: translateY(-2px);
}

.menu-icon {
  margin-right: 8px;
  color: #ffffff;
}

/* BOTONES DE AUTENTICACIÓN (ESCRITORIO) */
.ingresar-btn,
.registrar-btn {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 8px !important;
  min-width: 130px;
  min-height: 44px;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: none;
  box-shadow: 0 6px 14px rgba(78, 199, 165, 0.5) !important;
  letter-spacing: 0.5px;
  margin-left: 12px;
  padding-bottom: 4px;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.ingresar-btn:hover,
.registrar-btn:hover {
  background: #ffffff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 8px 18px rgba(78, 199, 165, 0.7) !important;
  transform: translateY(-4px);
}

/* Estilo cuando la barra de navegación se scrollea */
.auth-btn-scrolled {
  background-color: #ffffff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25) !important;
}

.auth-btn-scrolled:hover {
  background-color: #e0e0e0 !important;
  color: #4ec7a5 !important;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3) !important;
}

/* Ajustes de responsive para el logo en dispositivos más pequeños */
@media (max-width: 959px) {
  .logo-img {
    width: 120px;
    height: 120px;
    min-width: unset;
    min-height: unset;
  }
}

@media (max-width: 599px) {
  .logo-img {
    width: 100px;
    height: 100px;
  }
}
</style>