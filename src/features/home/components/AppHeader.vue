<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '@/stores/uiStore';
import { useScrollToSection } from '@/composables/useScrollToSection';
import { ROUTES } from '@/constants/routes';

const uiStore = useUiStore();
const router = useRouter();
const { scrollToSection } = useScrollToSection();
const scrolled = ref(false);
const menuItems = ref([
  { text: 'Inicio', section: 'inicio', icon: 'mdi-home' },
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
  router.push(ROUTES.AUTH.LOGIN);
};

const goToRegister = () => {
  router.push(ROUTES.AUTH.REGISTER);
};
</script>

<template>
  <v-app-bar
    app
    fixed
    flat
    :color="scrolled ? 'rgba(78, 199, 165, 0.95)' : 'transparent'"
    height="72"
    :elevation="scrolled ? 8 : 0"
    :class="{ 'header-blur': scrolled, 'header-scrolled': scrolled }"
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
          <v-btn 
            icon 
            @click="uiStore.toggleDrawer()" 
            class="mobile-menu-btn text-white" 
            aria-label="Abrir menú de navegación"
            size="large"
          >
            <v-icon size="28">mdi-menu</v-icon>
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
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 0 16px;
  z-index: 1000;
  will-change: background, box-shadow, backdrop-filter;
}

.header-blur {
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.header-scrolled {
  background: linear-gradient(135deg, rgba(78, 199, 165, 0.95) 0%, rgba(78, 199, 165, 0.9) 100%) !important;
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
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.5, 1), filter 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-img:hover {
  transform: scale(1.08) translateY(-2px);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* MENÚ DE ESCRITORIO */
.menu-btn {
  color: #ffffff !important;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  background: transparent !important;
  margin-right: 8px;
  padding: 10px 18px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08) !important;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.menu-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.menu-btn:hover::before {
  left: 100%;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px);
}

.menu-btn-active {
  background: rgba(255, 255, 255, 0.35) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
  position: relative;
}

.menu-btn-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), transparent);
  border-radius: 2px;
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
  border-radius: 10px !important;
  min-width: 130px;
  min-height: 44px;
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(78, 199, 165, 0.4) !important;
  letter-spacing: 0.3px;
  margin-left: 10px;
  padding: 0 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  position: relative;
  overflow: hidden;
}

.ingresar-btn::before,
.registrar-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.ingresar-btn:hover::before,
.registrar-btn:hover::before {
  width: 300px;
  height: 300px;
}

.ingresar-btn:hover,
.registrar-btn:hover {
  background: #ffffff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 6px 20px rgba(78, 199, 165, 0.6) !important;
  transform: translateY(-3px) scale(1.02);
}

.ingresar-btn span,
.registrar-btn span {
  position: relative;
  z-index: 1;
}

/* Estilo cuando la barra de navegación se scrollea */
.auth-btn-scrolled {
  background-color: #ffffff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.auth-btn-scrolled:hover {
  background-color: #f0f0f0 !important;
  color: #18b97e !important;
  box-shadow: 0 6px 18px rgba(24, 185, 126, 0.4) !important;
  transform: translateY(-3px) scale(1.02);
}

/* Botón de menú móvil */
.mobile-menu-btn {
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 10px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  width: 48px !important;
  height: 48px !important;
  backdrop-filter: blur(8px);
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header-scrolled .mobile-menu-btn {
  background: rgba(255, 255, 255, 0.2) !important;
}

.header-scrolled .mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.35) !important;
}

/* Ajustes de responsive */
@media (max-width: 1279px) {
  .app-header {
    padding: 0 12px;
  }
  .menu-btn {
    margin-right: 6px;
    padding: 8px 14px;
    font-size: 0.95rem;
  }
  .ingresar-btn,
  .registrar-btn {
    min-width: 110px;
    min-height: 40px;
    font-size: 1rem;
    margin-left: 8px;
    padding: 0 16px;
  }
}

@media (max-width: 959px) {
  .app-header {
    height: 68px;
    padding: 0 12px;
  }
  .logo-img {
    width: 120px;
    height: 120px;
    min-width: unset;
    min-height: unset;
  }
  .mobile-menu-btn {
    width: 44px !important;
    height: 44px !important;
  }
}

@media (max-width: 599px) {
  .app-header {
    height: 64px;
    padding: 0 8px;
  }
  .logo-img {
    width: 100px;
    height: 100px;
  }
  .mobile-menu-btn {
    width: 40px !important;
    height: 40px !important;
  }
  .mobile-menu-btn .v-icon {
    font-size: 24px !important;
  }
}

@media (max-width: 399px) {
  .logo-img {
    width: 85px;
    height: 85px;
  }
  .mobile-menu-btn {
    width: 36px !important;
    height: 36px !important;
  }
}
</style>

