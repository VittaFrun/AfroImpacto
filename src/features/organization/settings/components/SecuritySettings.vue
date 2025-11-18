<template>
  <v-card-text class="pa-8">
    <div class="d-flex align-center mb-6">
      <v-icon color="primary" size="28" class="mr-3">mdi-shield-check</v-icon>
      <h2 class="text-h5 font-weight-bold">Configuración de Seguridad</h2>
    </div>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
          <h3 class="text-subtitle-1 mb-4">Autenticación</h3>
          <v-switch
            v-model="security.twoFactor"
            label="Autenticación de Dos Factores"
            color="primary"
            class="mb-3"
          />
          <v-switch
            v-model="security.sso"
            label="Inicio de Sesión Único (SSO)"
            color="primary"
            class="mb-3"
          />
          <v-text-field
            label="Tiempo de Sesión (minutos)"
            v-model="security.sessionTimeout"
            type="number"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
          <h3 class="text-subtitle-1 mb-4">Acceso</h3>
          <v-switch
            v-model="security.ipWhitelist"
            label="Lista Blanca de IPs"
            color="primary"
            class="mb-3"
          />
          <v-switch
            v-model="security.auditLog"
            label="Registro de Auditoría"
            color="primary"
            class="mb-3"
          />
          <v-btn color="warning" variant="outlined" @click="viewAuditLog">
            <v-icon start>mdi-file-document</v-icon>
            Ver Registros
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    
    <v-divider class="my-6" />
    
    <div class="d-flex justify-end">
      <v-btn color="primary" variant="flat" @click="saveSecurity" :loading="saving">
        <v-icon start>mdi-shield-check</v-icon>
        Guardar Seguridad
      </v-btn>
    </div>
  </v-card-text>
</template>

<script setup>
import { ref } from 'vue'

const saving = ref(false)

const security = ref({
  twoFactor: false,
  sso: false,
  sessionTimeout: 60,
  ipWhitelist: false,
  auditLog: true
})

async function saveSecurity() {
  saving.value = true
  await new Promise(r => setTimeout(r, 1000))
  saving.value = false
  // Aquí iría la lógica de guardado real
}

function viewAuditLog() {
  alert('Funcionalidad de auditoría en desarrollo')
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

