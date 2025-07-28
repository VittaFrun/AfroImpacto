<template>
  <v-row no-gutters class="auth-page">
    <!-- Panel Izquierdo: Formulario (40%) -->
    <v-col cols="12" md="5" class="form-panel d-flex align-center justify-center pa-4">
      <div>
        <v-tooltip location="top" :open-delay="300">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-home"
              variant="text"
              class="home-button"
              @click="goToHome"
              size="medium"
              color="grey-lighten-1"
              aria-label="Inicio"
            ></v-btn>
          </template>
          <span>Inicio</span>
        </v-tooltip>
      </div>
      <slot name="form"></slot>
    </v-col>
  
    <!-- Panel Derecho: Visual (60%) -->
    <v-col cols="12" md="7" class="visual-panel d-none d-md-flex pa-4">
      <div
        class="visual-content-wrapper rounded-xl d-flex align-center justify-center"
        :style="{ backgroundImage: `url(${backgroundImage})` }"
      >
        <div class="overlay"></div>
        <div class="slot-container">
          <slot name="info"></slot>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { useRouter } from 'vue-router';
import backgroundImage from '@/assets/images/background_login.png';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
}

.form-panel {
  background-color: #ffffff;
  position: relative;
}

.home-button {
  position: absolute;
  top: 28px;
  left: 28px;
  z-index: 10;
  border: rgba(0, 0, 0, 0.1) solid 1px; /* Borde sutil */
  border-radius: 10%; /* Para un efecto circular */
  width: 48px; /* Tamaño fijo para el botón */
  height: 48px; /* Tamaño fijo para el botón */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1); /* Fondo muy sutil */
  box-shadow: none;
  transition: all 0.3s ease; /* Transición para todos los cambios */
  color: #adadad; /* Gris claro para el icono */
}

.home-button:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Fondo un poco más visible al pasar el cursor */
  color: #ffffff; /* Icono blanco al pasar el cursor */
  transform: translateY(1px); /* Efecto de elevación al pasar el cursor */
  box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2); /* Sombra sutil */
}

.visual-panel {
  background-color: #ffffff;
}

.visual-content-wrapper {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.slot-container {
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* Asegura que los elementos se apilen verticalmente */
  justify-content: flex-end; /* Alinea el contenido al final (inferior) */
  align-items: center; /* Centra horizontalmente el contenido */
  padding-bottom: 40px; /* Espacio desde el borde inferior */
}
</style>
