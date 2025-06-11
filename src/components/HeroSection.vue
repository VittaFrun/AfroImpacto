<template>
  <div class="hero-bg">
    <v-container fluid class="py-sm-8 py-md-16 fill-height d-flex align-center hero-container">
      <v-row
        align="center"
        justify="center"
        class="flex-column-reverse flex-md-row flex-grow-1"
        style="min-height: 70vh;"
      >
        <v-col
          cols="12"
          md="8"
          lg="7"
          class="hero-content-col d-flex flex-column align-center text-center text-md-left animate__animated animate__fadeInLeft animate__delay-0.5s"
        >
          <h1
            class="hero-title font-weight-bold mb-4"
            :style="{
              color: '#fff',
              textShadow: '0 4px 25px rgba(0,0,0,0.65)'
            }"
          >
            Afro Impacto
          </h1>
          <div
            class="hero-subtitle mb-8 font-weight-medium"
            :style="{
              color: '#fff',
              textShadow: '0 2px 18px rgba(0,0,0,0.5)'
            }"
          >
            Conectando voluntarios con proyectos que transforman vidas y fortalecen la identidad afrodescendiente.
          </div>
          <div class="d-flex flex-column flex-sm-row align-center justify-center justify-md-start ga-4 mb-4 hero-buttons-container">
            <router-link to="/register" class="text-decoration-none">
              <v-btn
                class="crear-cuenta"
                size="large"
                elevation="6"
                rounded="lg"
                color="#4ec7a5"
              >
                Crear una cuenta
              </v-btn>
            </router-link>
            <v-btn
              variant="outlined"
              size="large"
              class="participar-proyectos-btn"
              rounded="lg"
              color="white"
              :ripple="false"
              @click="scrollToProjects"
            >
              Participar en proyectos
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="4"
          lg="5"
          class="hero-image-col d-none d-md-flex justify-center align-center animate__animated animate__fadeInRight animate__delay-0.5s"
        >
          <v-img
            src="/src/components/icons/logo_niños.png"
            alt="Ilustración niños Afro Impacto"
            max-width="450"
            max-height="450"
            aspect-ratio="1"
            class="rounded-circle elevation-12 hero-image"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import 'animate.css';

export default {
  name: 'HeroSection',
  methods: {
    scrollToProjects() {
      const popularProjectsElement = document.getElementById('our-projects');
      if (popularProjectsElement) {
        popularProjectsElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn('Elemento con ID "our-projects" no encontrado. Asegúrate de que tu componente PopularProjects tenga este ID.');
      }
    }
  }
}
</script>

<style scoped>
.hero-bg {
  background: linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url('/src/components/icons/main-background.jpg') center center/cover no-repeat;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1650px;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: var(--v-layout-top, 0px) !important;
  padding-bottom: 0 !important;
}

.hero-content-col {
  padding-left: clamp(30px, 8vw, 150px) !important;
  padding-right: clamp(20px, 4vw, 60px) !important;
}

.hero-title {
  font-size: clamp(3.5rem, 8vw, 7.8rem);
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 16px;
  text-shadow: 0 6px 30px rgba(0,0,0,0.8);
}

.hero-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  line-height: 1.5;
  max-width: 1500px;
  width: 100%;
  margin-bottom: 48px;
  text-shadow: 0 3px 20px rgba(0,0,0,0.6);
}

.hero-buttons-container {
  gap: 24px !important;
}

.crear-cuenta {
  font-size: 1.2rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  letter-spacing: 0.7px !important;
  padding: 0 36px !important;
  min-width: 220px !important;
  min-height: 56px !important;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
  box-shadow: 0 10px 22px rgba(78, 199, 165, 0.6) !important;
  max-width: 300px;
}

.crear-cuenta:hover {
  background: #3aa885 !important;
  transform: translateY(-6px);
  box-shadow: 0 12px 26px rgba(78, 199, 165, 0.8) !important;
}

.participar-proyectos-btn {
  font-size: 1.15rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  letter-spacing: 0.7px !important;
  border: 2px solid rgba(255, 255, 255, 0.9) !important;
  min-width: 260px !important;
  min-height: 56px !important;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
  background-color: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
  max-width: 300px;
}

.participar-proyectos-btn:hover {
  background-color: rgba(255, 255, 255, 0.25) !important;
  border-color: white !important;
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.hero-image {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
  border: 5px solid rgba(255, 255, 255, 0.4);
}

.hero-image:hover {
  transform: scale(1.06) rotate(3deg);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
}

/* Ajustes responsivos para desktop (md y arriba) */
@media (min-width: 960px) {
  .hero-content-col {
    padding-left: clamp(60px, 10vw, 180px) !important;
    padding-right: clamp(24px, 4vw, 80px) !important;
  }
  .hero-image-col {
    padding-left: clamp(24px, 4vw, 80px) !important;
    padding-right: clamp(60px, 10vw, 180px) !important;
  }
  .hero-title {
    white-space: nowrap;
  }
}

/* Ajustes responsivos para tablet y móvil (hasta 959px) */
@media (max-width: 959px) {
  .hero-container {
    min-height: unset !important;
    /* Ajuste para el padding superior para bajar el contenido y evitar la superposición */
    padding-top: calc(90px + 24px) !important;
    padding-bottom: 48px !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
    justify-content: flex-start; /* Asegura que el contenido se alinee arriba si el contenedor es más alto */
  }
  .v-row {
    flex-direction: column !important; /* Apilar columnas en móvil */
    min-height: unset !important;
    align-items: center; /* Centrar el contenido de la fila en móvil */
  }
  .hero-content-col {
    order: 1; /* Asegura que el contenido (texto y botones) sea el primero */
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0 !important;
    padding-right: 0 !important;
    /* Asegurar que el texto esté centrado en móviles */
    text-align: center !important;
  }
  .hero-image-col {
    display: none !important; /* Ocultar la columna de la imagen grande de desktop */
  }

  /* Ajustes específicos para el texto en móvil */
  .hero-title {
    font-size: clamp(2.2rem, 6vw, 3rem) !important;
    white-space: normal;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .hero-subtitle {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem) !important;
    padding: 0 8px;
    margin-bottom: 32px;
  }
  .hero-buttons-container {
    flex-direction: column !important; /* Apilar botones en móvil */
    gap: 12px !important;
    width: 100%;
    align-items: center !important; /* Centrar los botones dentro del contenedor */
  }
  .crear-cuenta,
  .participar-proyectos-btn {
    min-width: unset !important;
    width: 100% !important;
    max-width: 280px;
    font-size: 0.95rem !important;
    min-height: 48px !important;
    padding: 0 20px !important;
  }
}

/* Ajustes para dispositivos extra pequeños (menos de 600px - el breakpoint 'sm') */
@media (max-width: 599px) {
  .hero-container {
    padding-top: calc(90px + 16px) !important;
    padding-bottom: 32px !important;
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .hero-title {
    font-size: clamp(1.8rem, 5.5vw, 2.5rem) !important;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }
  .hero-subtitle {
    font-size: clamp(0.8rem, 2.2vw, 0.9rem) !important;
    padding: 0 4px;
    margin-bottom: 24px;
  }
  .crear-cuenta,
  .participar-proyectos-btn {
    font-size: 0.9rem !important;
    min-height: 45px !important;
    max-width: 250px;
  }
}
</style>