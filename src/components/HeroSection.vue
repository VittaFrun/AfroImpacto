<template>
  <v-container fluid class="py-16">
    <v-row
      align="center"
      justify="center"
      class="flex-column-reverse flex-md-row"
      style="min-height: 60vh;"
    >
      <!-- Texto y botones -->
      <v-col
        cols="12"
        md="7"
        class="af-view d-flex flex-column align-center justify-center text-center text-md-left"
      >
        <h1
          class="font-weight-bold mb-2"
          :style="{
            fontSize: $vuetify.display.mdAndUp ? '100px' : '80px',
            lineHeight: 1.1
          }"
        >
          Afro Impacto
        </h1>
        <div
          class="mb-6 font-weight-bold"
          :style="{
            fontSize: $vuetify.display.mdAndUp ? '24px' : '20px',
          }"
        >
          Conectando voluntarios con proyectos para empoderar
        </div>
        <div class="d-flex flex-column flex-sm-row align-center justify-center gap-4 mb-2">
          <v-btn color="success" size="large" class="crear-cuenta font-weight-bold " rounded>
            Crear una cuenta
          </v-btn>
          <v-btn
            variant="text"
            disabled
            class="text-grey-darken-1 font-weight-bold text-capitalize"
            style="font-size: 17px"
          >
            Participar en proyectos
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-col>

      <!-- Imagen -->
      <v-col
        cols="12"
        md="2"
        class="d-flex justify-center align-center mb-8 mb-md-0"
      >
        <v-img
          src="/src/components/icons/logo_niños.png"
          alt="Ilustración niños"
          width="500"
          height="500"
          max-height="500"
          max-width="500"
          class="rounded-lg"
          style="border-radius: 16px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HeroSection'
}
</script>

<style scoped>

.crear-cuenta:hover {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}

.crear-cuenta {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 12px !important;
  min-width: 140px;
  min-height: 48px;
  font-size: 1.15rem;
  font-weight: bold;
  text-transform: none;
  box-shadow: none !important;
  letter-spacing: 0.5px;

}
</style>