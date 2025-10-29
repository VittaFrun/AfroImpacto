
<template>
  <v-card
    class="pa-8 rounded-lg text-white welcome-card"
    elevation="0"
  >
    <v-row align="center" no-gutters>
      <v-col cols="auto" class="pr-6">
        <v-icon size="64" color="white" class="welcome-icon">mdi-hand-wave</v-icon>
      </v-col>
      <v-col>
        <h2 class="text-h4 font-extrabold mb-3">¡Bienvenido!</h2>
        <p class="text-body-1 mb-6" style="opacity: 0.95;">
          Aquí puedes gestionar tus proyectos, donaciones y voluntarios de manera eficiente.
          Mantente al día con la actividad reciente y el progreso de tus iniciativas.
        </p>
        <div class="d-flex align-center">
          <v-chip color="white" variant="flat" class="mr-2">
            <v-icon start>mdi-trending-up</v-icon>
            Impacto Positivo
          </v-chip>
          <v-chip color="white" variant="flat">
            <v-icon start>mdi-heart</v-icon>
            Comunidad
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #00b894, #27ae60, #2ecc71);
  box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.welcome-card:hover {
  box-shadow: 0 12px 30px -5px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.welcome-icon {
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.7));
}

.v-chip {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.2) !important;
}
</style>
