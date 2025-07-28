<template>
  <div class="info-carousel-container">
    <v-carousel
      cycle
      :interval="6000"
      hide-delimiters
      :show-arrows="false"
      class="text-center"
    >
      <v-carousel-item v-for="(item, i) in items" :key="i">
        <div class="carousel-content pa-8">
          <v-icon :icon="item.icon" size="80" class="mb-6 text-white"></v-icon>
          <h2 class="text-h3 font-weight-bold text-white mb-4">{{ item.title }}</h2>
          <p class="text-body-1 text-white mx-auto" style="max-width: 450px; font-size: 1.1rem;">{{ item.text }}</p>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  {
    icon: 'mdi-account-heart-outline',
    title: 'Conecta con Voluntarios',
    text: 'Encuentra personas apasionadas que quieran unirse y potenciar tu causa.',
  },
  {
    icon: 'mdi-sitemap-outline',
    title: 'Administra tus Proyectos',
    text: 'Organiza tus iniciativas, asigna tareas y sigue el progreso de tu impacto social.',
  },
  {
    icon: 'mdi-cash-multiple',
    title: 'Recibe Apoyo para tus Iniciativas',
    text: 'Publica tus proyectos y recibe las donaciones que necesitas para hacerlos realidad.',
  },
  {
    icon: 'mdi-chart-bar',
    title: 'Genera Reportes de Impacto',
    text: 'Mide y comunica los resultados de tus proyectos de forma clara y profesional.',
  },
]);
</script>

<style scoped>
.info-carousel-container {
  width: 100%;
  position: relative;
  z-index: 2; /* Asegura que el carrusel esté sobre el overlay de la imagen */
}

.carousel-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.text-white {
  color: #FFFFFF !important;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6);
}
</style>
