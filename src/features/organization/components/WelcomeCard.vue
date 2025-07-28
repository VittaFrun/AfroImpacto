
<template>
  <v-card
    class="pa-8 rounded-lg text-white welcome-card"
  >
    <v-row align="center" no-gutters>
      <v-col cols="auto" class="pr-6">
        <v-icon size="64" color="white" class="welcome-icon">mdi-hand-wave</v-icon>
      </v-col>
      <v-col>
        <h2 class="text-h4 font-extrabold mb-3">¡Bienvenida, Organización XYZ!</h2>
        <p class="text-body-1 mb-6" style="opacity: 0.95;">
          Aquí puedes gestionar tus proyectos, donaciones y voluntarios de manera eficiente.
          Mantente al día con la actividad reciente y el progreso de tus iniciativas.
        </p>
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
  box-shadow: 0 8px 25px -5px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}



.welcome-icon {
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.7));
}
</style>
