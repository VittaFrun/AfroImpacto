<template>
  <div class="hero-bg">
    <v-container fluid class="py-16">
      <v-row
        align="center"
        justify="center"
        class="flex-column-reverse flex-md-row"
        style="min-height: 60vh;"
      >
        <v-col
          cols="12"
          md="7"
          class="af-view d-flex flex-column align-center justify-center text-center text-md-left"
        >
          <h1
            class="font-weight-bold mb-2"
            :style="{
              fontSize: $vuetify.display.mdAndUp ? '100px' : '80px',
              lineHeight: 1.1,
              color: '#fff',
              textShadow: '0 2px 16px rgba(0,0,0,0.45)'
            }"
          >
            Afro Impacto
          </h1>
          <div
            class="mb-6 font-weight-bold"
            :style="{
              fontSize: $vuetify.display.mdAndUp ? '24px' : '20px',
              color: '#fff',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)'
            }"
          >
            Conectando voluntarios con proyectos para empoderar
          </div>
          <div class="d-flex flex-column flex-sm-row align-center justify-center gap-4 mb-2">
            <router-link to="/register">
              <v-btn class="crear-cuenta"> Crear una cuenta
              </v-btn>
            </router-link>
            <v-btn
              variant="text"
              disabled
              class="text-white font-weight-bold text-capitalize"
              style="font-size: 17px; color: #fff; opacity: 0.7;"
            >
              Participar en proyectos
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="2"
          class="d-flex justify-center align-center mb-8 mb-md-0"
        >
          <v-img
            src="/src/components/icons/logo_niños.png"
            alt="Ilustración niños"
            width="350"
            height="350"
            max-height="350"
            max-width="350"
            class="rounded-lg"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HeroSection'
}
</script>

<style scoped>
.hero-bg {
  background: linear-gradient(0deg,rgba(0,0,0,0.4),rgba(0,0,0,0.1)), url('/src/components/icons/main-background.jpg') center center/cover no-repeat;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  z-index: 1;
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
.crear-cuenta:hover {
  background: #fff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}
.rounded-lg {
  border-radius: 200px !important;
}
</style>