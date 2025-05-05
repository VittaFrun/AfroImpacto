<template>
  <v-container fluid class="py-12" style="background: #fff;">
    <h2 class="text-center font-weight-bold mb-10" style="font-size:2.2rem;">
      Impacto en Cifras
    </h2>
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" class="text-center mb-8 mb-md-0">
        <v-icon size="48" color="#4ec7a5" class="mb-2">mdi-graph</v-icon>
        <div class="font-weight-bold" style="font-size:1.1rem;">1000 Proyectos</div>
      </v-col>
      <v-col cols="12" md="4" class="text-center mb-8 mb-md-0">
        <v-icon size="48" color="#4ec7a5" class="mb-2">mdi-account-group</v-icon>
        <div class="font-weight-bold" style="font-size:1.1rem;">3000 Personas</div>
      </v-col>
      <v-col cols="12" md="4" class="text-center">
        <v-icon size="48" color="#4ec7a5" class="mb-2">mdi-handshake</v-icon>
        <div class="font-weight-bold" style="font-size:1.1rem;">800 Voluntarios activos</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ImpactStats'
}
</script>
