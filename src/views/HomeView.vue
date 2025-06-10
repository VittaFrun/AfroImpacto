<template>
  <v-app>
    <AppHeader
      @scroll-to-section="scrollToSection"
      :activeSection="activeSection"
      @toggle-drawer="drawer = !drawer"
    />
    <HeroSection />
    <div class="main-bg">
      <div ref="inicio"></div>
      <PopularProjects ref="proyectos" />
      <UserTypes ref="perfiles" />
      <AboutUs ref="nosotros" />
      <Testimonials />
      <ImpactStats />
      <NewsUpdates />
      <AppFooter />
    </div>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      right
      width="300"
      app
      :scrim="true"
      :z-index="1005"
      scrim-z-index="1004"
      class="mobile-drawer-container"
    >
      <v-list nav class="mobile-drawer-list">
        <v-list-item class="drawer-header-section text-center py-6">
          <v-list-item-content>
            <v-img
              src="/src/components/icons/logo_afroimpacto.png"
              alt="Logo Afro Impacto"
              width="150"
              height="150"
              class="mx-auto mb-3"
              style="object-fit: contain;"
            />
            <v-list-item-title class="font-weight-bold text-h5 text-center text-primary-darken-2"
              style="white-space: normal; line-height: 1.2;">
              Afro Impacto
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-3 divider-subtle"></v-divider>

        <v-list-item
          v-for="item in menuItems"
          :key="item.text"
          @click="drawer = false; scrollToSection(item.section)"
          class="py-3 drawer-list-item"
          :class="{ 'drawer-list-item-active': activeSection === item.section }"
          link
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" size="26" class="drawer-list-icon"></v-icon>
          </template>
          <v-list-item-title class="text-subtitle-1 font-weight-medium drawer-list-title">
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>
        <v-divider class="my-3 divider-subtle"></v-divider>

        <v-list-item class="px-6 pb-6 drawer-auth-buttons-section">
          <v-btn
            block
            class="registrar-btn mb-4"
            depressed
            @click="drawer = false; $router.push('/register')"
          >
            Registrarse
          </v-btn>
          <v-btn
            block
            class="ingresar-btn"
            depressed
            @click="drawer = false; $router.push('/login')"
          >
            Ingresar
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import HeroSection from '@/components/HeroSection.vue';
import UserTypes from '@/components/UserTypes.vue';
import PopularProjects from '@/components/PopularProjects.vue';
import Testimonials from '@/components/Testimonials.vue';
import ImpactStats from '@/components/ImpactStats.vue';
import NewsUpdates from '@/components/NewsUpdates.vue';
import AppFooter from '@/components/AppFooter.vue';
import AboutUs from '@/components/AboutUs.vue';

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    HeroSection,
    UserTypes,
    PopularProjects,
    Testimonials,
    ImpactStats,
    NewsUpdates,
    AppFooter,
    AboutUs,
  },
  data() {
    return {
      activeSection: 'inicio',
      sectionOffsets: {},
      drawer: false,
      menuItems: [
        { text: 'Inicio', section: 'inicio', icon: 'mdi-home' },
        { text: 'Proyectos', section: 'proyectos', icon: 'mdi-folder-multiple' },
        { text: 'Perfiles', section: 'perfiles', icon: 'mdi-account-group' },
        { text: 'Nosotros', section: 'nosotros', icon: 'mdi-information' }
      ]
    };
  },
  mounted() {
    this.calculateSectionOffsets();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.calculateSectionOffsets);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.calculateSectionOffsets);
  },
  methods: {
    calculateSectionOffsets() {
      this.sectionOffsets = {
        inicio: 0,
        proyectos: this.$refs.proyectos?.$el?.offsetTop || 0,
        perfiles: this.$refs.perfiles?.$el?.offsetTop || 0,
        nosotros: this.$refs.nosotros?.$el?.offsetTop || 0,
      };
    },
    handleScroll() {
      const scrollPosition = window.scrollY + 80;

      let currentActive = 'inicio';
      for (const section in this.sectionOffsets) {
        if (this.sectionOffsets[section] <= scrollPosition) {
          currentActive = section;
        }
      }
      this.activeSection = currentActive;
    },
    scrollToSection(section) {
      if (section === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.drawer = false;
        return;
      }
      const element = this.$refs[section]?.$el;
      if (element) {
        const offset = element.offsetTop - 72;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        this.drawer = false;
      }
    },
  },
};
</script>

<style scoped>
.main-bg {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #4ec7a5 1%, #3f51b5 100%);
  padding-top: 0;
}

/* ESTILOS MEJORADOS PARA EL DRAWER EN HOMEVIEW */
.mobile-drawer-container {
  background: linear-gradient(to top, #e0fdf7 0%, #f7fdfb 100%) !important;
  box-shadow: -8px 0 20px rgba(0, 0, 0, 0.15);
  background-color: #f7fdfb !important; /* Respaldo para el fondo */
}

/* Asegura que el contenido del drawer no esté cubierto por el scrim */
/* Esta regla es crucial para que el contenido del drawer se vea */
.v-navigation-drawer__content {
    background-color: #f7fdfb !important; /* Asegura un fondo sólido para el contenido */
    z-index: 1006 !important; /* Debe estar por encima del scrim y del drawer contenedor */
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
  padding-top: 25px !important;
  padding-bottom: 25px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
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