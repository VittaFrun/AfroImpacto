<template>
  <v-card-text class="pa-8">
    <div class="d-flex align-center mb-6">
      <v-icon color="primary" size="28" class="mr-3">mdi-puzzle</v-icon>
      <h2 class="text-h5 font-weight-bold">Integraciones</h2>
    </div>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
          <div class="d-flex align-center mb-3">
            <v-icon color="blue" class="mr-3">mdi-google</v-icon>
            <h3 class="text-subtitle-1">Google Workspace</h3>
          </div>
          <p class="text-body-2 text-grey mb-3">Sincroniza con Google Drive y Calendar</p>
          <v-switch
            v-model="integrations.google"
            label="Activar Integración"
            color="primary"
            class="mb-3"
          />
          <v-btn color="blue" variant="outlined" size="small" :disabled="!integrations.google">
            <v-icon start>mdi-cog</v-icon>
            Configurar
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
          <div class="d-flex align-center mb-3">
            <v-icon color="blue" class="mr-3">mdi-microsoft</v-icon>
            <h3 class="text-subtitle-1">Microsoft 365</h3>
          </div>
          <p class="text-body-2 text-grey mb-3">Integra con Office 365 y Teams</p>
          <v-switch
            v-model="integrations.microsoft"
            label="Activar Integración"
            color="primary"
            class="mb-3"
          />
          <v-btn color="blue" variant="outlined" size="small" :disabled="!integrations.microsoft">
            <v-icon start>mdi-cog</v-icon>
            Configurar
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
          <div class="d-flex align-center mb-3">
            <v-icon color="green" class="mr-3">mdi-slack</v-icon>
            <h3 class="text-subtitle-1">Slack</h3>
          </div>
          <p class="text-body-2 text-grey mb-3">Notificaciones y comunicación</p>
          <v-switch
            v-model="integrations.slack"
            label="Activar Integración"
            color="primary"
            class="mb-3"
          />
          <v-btn color="green" variant="outlined" size="small" :disabled="!integrations.slack">
            <v-icon start>mdi-cog</v-icon>
            Configurar
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
          <div class="d-flex align-center mb-3">
            <v-icon color="purple" class="mr-3">mdi-email</v-icon>
            <h3 class="text-subtitle-1">Mailchimp</h3>
          </div>
          <p class="text-body-2 text-grey mb-3">Marketing por email</p>
          <v-switch
            v-model="integrations.mailchimp"
            label="Activar Integración"
            color="primary"
            class="mb-3"
          />
          <v-btn color="purple" variant="outlined" size="small" :disabled="!integrations.mailchimp">
            <v-icon start>mdi-cog</v-icon>
            Configurar
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    
    <v-divider class="my-6" />
    
    <div class="d-flex justify-end">
      <v-btn color="primary" variant="flat" @click="saveIntegrations" :loading="saving">
        <v-icon start>mdi-puzzle</v-icon>
        Guardar Integraciones
      </v-btn>
    </div>
  </v-card-text>
</template>

<script setup>
import { ref } from 'vue'

const saving = ref(false)

const integrations = ref({
  google: false,
  microsoft: false,
  slack: false,
  mailchimp: false
})

async function saveIntegrations() {
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

