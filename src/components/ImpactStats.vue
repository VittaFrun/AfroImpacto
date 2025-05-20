<template>
  <v-container fluid class="py-12 glass-bg">
    <h2 class="text-center font-weight-bold mb-12 gradient-text" style="font-size:2.4rem;">
      Impacto en Cifras
    </h2>
    <v-row align="center" justify="center" class="text-white">
      <v-col cols="12" md="4" class="text-center mb-10 mb-md-0">
        <v-icon size="64" color="#4ec7a5" class="mb-4 icon-animate">mdi-chart-line</v-icon>
        <div class="font-weight-bold" style="font-size:1.3rem;">1000 Proyectos</div>
      </v-col>
      <v-col cols="12" md="4" class="text-center mb-10 mb-md-0">
        <v-icon size="64" color="#4ec7a5" class="mb-4 icon-animate">mdi-account-group</v-icon>
        <div class="font-weight-bold" style="font-size:1.3rem;">3000 Personas</div>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <v-icon size="64" color="#4ec7a5" class="mb-4 icon-animate">mdi-handshake</v-icon>
        <div class="font-weight-bold" style="font-size:1.3rem;">800 Voluntarios activos</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ImpactStats'
}
</script>

<style scoped>
.glass-bg {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  max-width: 1850px;
  margin: 0 auto;
}
.gradient-text {
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.icon-animate {
  animation: pulse 2.5s infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
</style>
