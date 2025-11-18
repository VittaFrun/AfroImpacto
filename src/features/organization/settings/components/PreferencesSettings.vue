<template>
  <v-card-text class="pa-8">
    <div class="d-flex align-center mb-6">
      <v-icon color="primary" size="28" class="mr-3">mdi-cog</v-icon>
      <h2 class="text-h5 font-weight-bold">Preferencias del Sistema</h2>
    </div>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
          <h3 class="text-subtitle-1 mb-4">Notificaciones</h3>
          <v-switch
            v-model="preferences.notificaciones_email"
            label="Notificaciones por Email"
            color="primary"
            class="mb-3"
          />
          <v-switch
            v-model="preferences.resumen_semanal"
            label="Resumen Semanal"
            color="primary"
            class="mb-3"
          />
          <v-switch
            v-model="preferences.recordatorios"
            label="Recordatorios de Actividades"
            color="primary"
            class="mb-3"
          />
          <v-switch
            v-model="preferences.notificaciones_push"
            label="Notificaciones Push"
            color="primary"
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
          <h3 class="text-subtitle-1 mb-4">Apariencia</h3>
          <v-switch
            v-model="preferences.modo_oscuro"
            label="Modo Oscuro"
            color="primary"
            class="mb-3"
          />
          <v-select
            label="Idioma"
            v-model="preferences.idioma"
            :items="languages"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-select
            label="Zona Horaria"
            v-model="preferences.zona_horaria"
            :items="timezones"
            variant="outlined"
            density="comfortable"
          />
        </v-card>
      </v-col>
    </v-row>
    
    <v-divider class="my-6" />
    
    <div class="d-flex justify-end">
      <v-btn color="primary" variant="flat" @click="savePreferences" :loading="saving">
        <v-icon start>mdi-cog</v-icon>
        Guardar Preferencias
      </v-btn>
    </div>
  </v-card-text>
</template>

<script setup>
import { ref } from 'vue'

const saving = ref(false)

const languages = [
  { title: 'Español', value: 'es' },
  { title: 'English', value: 'en' },
  { title: 'Português', value: 'pt' },
  { title: 'Français', value: 'fr' }
]

const timezones = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Argentina/Buenos_Aires',
  'America/Santiago',
  'America/Lima',
  'America/New_York',
  'Europe/Madrid',
  'UTC'
]

const preferences = ref({
  notificaciones_email: true,
  resumen_semanal: true,
  recordatorios: true,
  notificaciones_push: false,
  modo_oscuro: false,
  idioma: 'es',
  zona_horaria: 'America/Bogota'
})

async function savePreferences() {
  saving.value = true
  await new Promise(r => setTimeout(r, 1000))
  saving.value = false
  // Aquí iría la lógica de guardado real
}
</script>

<style scoped>
.dashboard-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 24px -8px rgba(16, 24, 40, 0.12) !important;
}
</style>

