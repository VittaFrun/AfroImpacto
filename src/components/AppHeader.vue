<template>
  <v-app-bar
    fixed
    flat
    :color="scrolled ? 'rgba(78, 199, 165, 0.9)' : 'transparent'"
    height="72"
    :elevation="scrolled ? 6 : 0"
    style="transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;"
  >
    <v-container fluid class="px-md-8 px-4">
      <v-row align="center" justify="space-between" no-gutters>
        <v-col cols="auto" class="d-flex align-center">
          <router-link to="/" class="logo-link" aria-label="Ir a la página de inicio">
            <v-img
              src="/src/components/icons/logo_afroimpacto2.png"
              alt="Logo Afro Impacto"
              class="logo-img-large"
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
              class="mx-2 text-body-1 font-weight-medium menu-btn"
              :class="{ 'menu-btn-active': activeSection === item.section }"
              @click="emitScroll(item.section)"
            >
              {{ item.text }}
            </v-btn>
            <v-btn
              depressed
              class="ml-2 registrar-btn"
              :class="{ 'auth-btn-scrolled': scrolled }"
              @click="goToRegister"
            >
              Registrarse
            </v-btn>
            <v-btn
              depressed
              class="ml-2 ingresar-btn"
              :class="{ 'auth-btn-scrolled': scrolled }"
              @click="goToLogin"
            >
              Ingresar
            </v-btn>
          </div>
        </v-col>
        <v-col cols="auto" class="d-flex d-md-none">
          <v-btn icon @click="$emit('toggle-drawer')" class="text-white" aria-label="Abrir menú de navegación">
            <v-icon size="30">mdi-menu</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    activeSection: {
      type: String,
      default: 'inicio',
    },
  },
  data() {
    return {
      scrolled: false,
      menuItems: [
        { text: 'Inicio', section: 'inicio', icon: 'mdi-home' },
        { text: 'Proyectos', section: 'proyectos', icon: 'mdi-folder-multiple' },
        { text: 'Perfiles', section: 'perfiles', icon: 'mdi-account-group' },
        { text: 'Nosotros', section: 'nosotros', icon: 'mdi-information' }
      ]
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 20;
    },
    emitScroll(section) {
      this.$emit('scroll-to-section', section);
    },
    goToLogin() {
      this.$router.push('/login');
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
.header-blur {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* LOGO */
.logo-link {
  display: flex;
  align-items: center;
  height: 100%;
  text-decoration: none;
}
.logo-img-large {
  width: 150px;
  height: 150px;
  min-width: 150px;
  min-height: 150px;
  display: block;
  background-color: transparent !important;
  transition: transform 0.3s ease-in-out;
}
.logo-img-large:hover {
  transform: scale(1.05);
}

/* MENÚ DE ESCRITORIO */
.menu-btn {
  color: #fff !important;
  border-radius: 12px;
  font-weight: 500;
  text-transform: none;
  transition: background 0.2s, color 0.2s, border-bottom 0.2s, padding-bottom 0.2s;
  background: transparent !important;
  margin-right: 8px;
}
.menu-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  box-shadow: none !important;
}
.menu-btn-active {
  background: rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
  font-weight: bold !important;
  border-bottom: 3px solid rgba(255, 255, 255, 0.8) !important;
  padding-bottom: 5px !important;
}

/* BOTONES DE AUTENTICACIÓN (ESCRITORIO) */
.ingresar-btn,
.registrar-btn {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 12px !important;
  min-width: 120px;
  min-height: 44px;
  font-size: 1.05rem;
  font-weight: bold;
  text-transform: none;
  box-shadow: 0 4px 10px rgba(78, 199, 165, 0.4) !important;
  letter-spacing: 0.5px;
  margin-left: 8px;
  padding-bottom: 3px;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}
.ingresar-btn:hover,
.registrar-btn:hover {
  background: #fff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 6px 14px rgba(78, 199, 165, 0.6) !important;
}

/* Estilo cuando la barra de navegación se scrollea */
.auth-btn-scrolled {
  background-color: #ffffff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
}
.auth-btn-scrolled:hover {
  background-color: #e0e0e0 !important;
  color: #4ec7a5 !important;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3) !important;
}
</style>