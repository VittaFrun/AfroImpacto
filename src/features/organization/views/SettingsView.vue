<template>
  <v-container fluid class="pa-8">
    <!-- Header Section -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold text-primary mb-2">Configuración</h1>
        <p class="text-body-1 text-grey-darken-1">
          Gestiona la información de tu organización, personaliza la apariencia y configura tus preferencias
        </p>
      </div>
      <div class="d-flex align-center gap-3">
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-download"
          @click="exportSettings"
        >
          Exportar Config
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-content-save"
          @click="saveAll"
          :loading="saving"
        >
          Guardar Todo
        </v-btn>
      </div>
    </div>

    <!-- Main Settings Card -->
    <v-card class="rounded-xl elevation-2 dashboard-card">
      <v-tabs 
        v-model="activeTab" 
        bg-color="transparent" 
        color="primary" 
        class="px-6"
        @update:model-value="onTabChange"
      >
        <v-tab value="profile" class="text-capitalize">
          <v-icon start>mdi-account-box</v-icon>
          Perfil e Identidad
        </v-tab>
        <v-tab value="account" class="text-capitalize">
          <v-icon start>mdi-account-key</v-icon>
          Cuenta
        </v-tab>
        <v-tab value="preferences" class="text-capitalize">
          <v-icon start>mdi-cog</v-icon>
          Preferencias
        </v-tab>
        <v-tab value="security" class="text-capitalize">
          <v-icon start>mdi-shield-check</v-icon>
          Seguridad
        </v-tab>
        <v-tab value="integrations" class="text-capitalize">
          <v-icon start>mdi-puzzle</v-icon>
          Integraciones
        </v-tab>
      </v-tabs>
      <v-divider />
      
      <!-- Router view para mostrar el componente correspondiente -->
      <router-view />
    </v-card>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const saving = ref(false);

// Sincronizar el tab activo con la ruta
const activeTab = ref('profile');

// Mapeo de rutas a tabs
const routeToTab = {
  'profile': 'profile',
  'account': 'account',
  'preferences': 'preferences',
  'security': 'security',
  'integrations': 'integrations'
};

// Mapeo de tabs a rutas
const tabToRoute = {
  'profile': '/organization/dashboard/settings/profile',
  'account': '/organization/dashboard/settings/account',
  'preferences': '/organization/dashboard/settings/preferences',
  'security': '/organization/dashboard/settings/security',
  'integrations': '/organization/dashboard/settings/integrations'
};

// Sincronizar tab con la ruta actual
onMounted(() => {
  const routeName = route.name;
  if (routeName) {
    const tabName = routeName.replace('organization-settings-', '');
    if (routeToTab[tabName]) {
      activeTab.value = routeToTab[tabName];
    }
  }
});

watch(() => route.name, (newRouteName) => {
  if (newRouteName) {
    const tabName = newRouteName.replace('organization-settings-', '');
    if (routeToTab[tabName]) {
      activeTab.value = routeToTab[tabName];
    }
  }
});

// Manejar cambio de tab
function onTabChange(tabValue) {
  if (tabToRoute[tabValue]) {
    router.push(tabToRoute[tabValue]);
  }
}

const snackbar = ref({ 
  show: false, 
  message: '', 
  color: 'success',
  icon: 'mdi-check-circle'
});

function showSnackbar(message, color, icon) {
  snackbar.value = {
    show: true,
    message,
    color,
    icon
  };
}

async function saveAll() {
  saving.value = true;
  await new Promise(r => setTimeout(r, 1000));
  saving.value = false;
  showSnackbar('Todos los cambios guardados', 'success', 'mdi-content-save');
}

function exportSettings() {
  // Aquí se exportarían todas las configuraciones
  showSnackbar('Configuración exportada', 'info', 'mdi-download');
}
</script>

<style scoped>
/* Estilos personalizados para SettingsView */
.v-tab {
  text-transform: none !important;
}

/* Animaciones suaves para las tarjetas */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
}

/* Estilos para los avatares */
.v-avatar {
  transition: transform 0.2s ease;
}

.v-avatar:hover {
  transform: scale(1.05);
}

/* Estilos para los botones */
.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.02);
}

/* Estilos para los campos de formulario */
.v-field {
  transition: all 0.2s ease;
}

.v-field:focus-within {
  transform: scale(1.01);
}

/* Estilos para los switches */
.v-switch {
  transition: all 0.2s ease;
}

/* Estilos para los diálogos */
.v-dialog .v-card {
  border-radius: 16px !important;
}

/* Estilos para las tarjetas de estadísticas */
.stats-card {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
  border: 1px solid rgba(25, 118, 210, 0.2);
}

/* Estilos para los color pickers */
.v-color-picker {
  border-radius: 12px;
  overflow: hidden;
}

/* Estilos para los chips */
.v-chip {
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Estilos para los iconos de integración */
.integration-icon {
  transition: transform 0.2s ease;
}

.integration-icon:hover {
  transform: scale(1.1);
}

/* Estilos para los tooltips */
.v-tooltip .v-overlay__content {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Estilos para el preview del logo */
.logo-preview {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.logo-preview:hover {
  border-color: #1976D2;
  background-color: rgba(25, 118, 210, 0.05);
}

/* Estilos para los campos de color */
.color-field {
  border-radius: 8px;
  overflow: hidden;
}

/* Estilos para las secciones de configuración */
.config-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* Estilos para los indicadores de estado */
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.status-active {
  background-color: #4CAF50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
}

.status-inactive {
  background-color: #9E9E9E;
}

/* Animaciones de carga */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.loading-pulse {
  animation: pulse 2s infinite;
}

/* Estilos para los badges de integración */
.integration-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.integration-badge.connected {
  background-color: #4CAF50;
}

.integration-badge.disconnected {
  background-color: #F44336;
}

/* Estilos para los formularios de validación */
.v-field--error .v-field__outline {
  border-color: #F44336 !important;
}

.v-field--error .v-field__outline::before {
  border-color: #F44336 !important;
}

/* Estilos para los mensajes de ayuda */
.help-text {
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .d-flex.gap-3 {
    flex-direction: column;
    gap: 8px !important;
  }
  
  .v-btn {
    width: 100%;
  }
  
  .v-card {
    margin-bottom: 1rem;
  }
  
  .v-tabs {
    overflow-x: auto;
  }
  
  .v-tab {
    min-width: 120px;
  }
}

/* Estilos para el estado de guardado */
.save-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.save-indicator.show {
  transform: translateX(0);
}

/* Estilos para los separadores */
.v-divider {
  border-color: rgba(0, 0, 0, 0.1);
}

/* Estilos para los iconos de pestañas */
.v-tab .v-icon {
  margin-right: 8px;
}

/* Estilos para los campos de archivo */
.v-file-input .v-field__input {
  cursor: pointer;
}

/* Estilos para los selectores de país */
.country-select .v-list-item {
  padding: 8px 16px;
}

/* Estilos para los switches de seguridad */
.security-switch {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

/* Estilos para las tarjetas de integración */
.integration-card {
  position: relative;
  transition: all 0.3s ease;
}

.integration-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Estilos para los colores de tema */
.theme-light {
  --primary-color: #1976D2;
  --secondary-color: #26A69A;
}

.theme-dark {
  --primary-color: #90CAF9;
  --secondary-color: #80CBC4;
}

.theme-system {
  --primary-color: #1976D2;
  --secondary-color: #26A69A;
}

/* Estilo unificado tipo dashboard para cards */
.dashboard-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: var(--afro-radius-lg, 16px) !important;
  border: 1px solid var(--afro-border, rgba(0, 0, 0, 0.08));
  box-shadow: 0 8px 24px -8px rgba(16, 24, 40, 0.12) !important;
}
</style>
