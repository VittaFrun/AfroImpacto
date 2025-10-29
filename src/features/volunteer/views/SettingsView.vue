<template>
  <div class="settings-view">
    <!-- Header Section -->
    <div class="page-header">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h1 class="afro-heading-2 mb-2">Configuración</h1>
          <p class="afro-body-small">
            Gestiona la seguridad y las preferencias de tu cuenta
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-logout"
            class="professional-outlined-btn"
            @click="logout"
          >
            Cerrar Sesión
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Settings Navigation -->
    <div class="settings-navigation">
      <v-tabs v-model="activeTab" bg-color="transparent" color="primary" class="settings-tabs">
        <v-tab value="account" class="settings-tab">
          <v-icon start color="primary-light">mdi-account-cog</v-icon>
          Cuenta
        </v-tab>
        <v-tab value="security" class="settings-tab">
          <v-icon start color="success-light">mdi-shield-check</v-icon>
          Seguridad
        </v-tab>
        <v-tab value="notifications" class="settings-tab">
          <v-icon start color="info-light">mdi-bell</v-icon>
          Notificaciones
        </v-tab>
        <v-tab value="privacy" class="settings-tab">
          <v-icon start color="warning-light">mdi-eye</v-icon>
          Privacidad
        </v-tab>
        <v-tab value="preferences" class="settings-tab">
          <v-icon start color="secondary-light">mdi-cog</v-icon>
          Preferencias
        </v-tab>
        <v-tab value="integrations" class="settings-tab">
          <v-icon start color="accent-light">mdi-puzzle</v-icon>
          Integraciones
        </v-tab>
      </v-tabs>
    </div>

    <!-- Settings Content -->
    <v-card class="afro-card-elevated">
      <v-window v-model="activeTab">
        <!-- Account Settings -->
        <v-window-item value="account">
          <div class="tab-content">
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Información de la Cuenta</h3>

    <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="accountInfo.nombre"
                    label="Nombre Completo"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                    :rules="[v => !!v || 'El nombre es requerido']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="accountInfo.email"
                    label="Correo Electrónico"
                    variant="outlined"
                    prepend-inner-icon="mdi-email"
                    readonly
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="accountInfo.telefono"
                    label="Teléfono"
                    variant="outlined"
                    prepend-inner-icon="mdi-phone"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="accountInfo.ubicacion"
                    label="Ubicación"
                    variant="outlined"
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="accountInfo.biografia"
                    label="Biografía"
                    variant="outlined"
                    prepend-inner-icon="mdi-text"
                    rows="3"
                    placeholder="Cuéntanos sobre ti..."
                  ></v-textarea>
                </v-col>
              </v-row>
              
              <div class="form-actions">
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-content-save"
                  class="professional-save-btn"
                  @click="saveAccountInfo"
                  :loading="saving"
                >
                  Guardar Cambios
                </v-btn>
              </div>
            </div>

            <!-- Account Status -->
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Estado de la Cuenta</h3>
              
              <div class="afro-grid afro-grid-2">
                <div class="afro-card">
                  <div class="card-content">
                    <div class="status-item">
                      <v-icon color="success" size="24">mdi-check-circle</v-icon>
                      <div class="status-info">
                        <div class="status-title">Cuenta Verificada</div>
                        <div class="status-description">Tu cuenta está verificada y activa</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="afro-card">
                  <div class="card-content">
                    <div class="status-item">
                      <v-icon color="info" size="24">mdi-calendar-check</v-icon>
                      <div class="status-info">
                        <div class="status-title">Miembro desde</div>
                        <div class="status-description">{{ formatDate(accountInfo.createdAt) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Security Settings -->
        <v-window-item value="security">
          <div class="tab-content">
            <!-- Change Password -->
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Cambiar Contraseña</h3>
              
              <v-form ref="passwordForm" v-model="passwordFormValid">
    <v-row>
                  <v-col cols="12" md="6">
            <v-text-field
                      v-model="passwordForm.currentPassword"
              label="Contraseña Actual"
              type="password"
              variant="outlined"
                      prepend-inner-icon="mdi-lock"
                      :rules="[v => !!v || 'La contraseña actual es requerida']"
            ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
            <v-text-field
                      v-model="passwordForm.newPassword"
              label="Nueva Contraseña"
              type="password"
              variant="outlined"
                      prepend-inner-icon="mdi-lock-plus"
                      :rules="passwordRules"
            ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
            <v-text-field
                      v-model="passwordForm.confirmPassword"
              label="Confirmar Nueva Contraseña"
              type="password"
              variant="outlined"
                      prepend-inner-icon="mdi-lock-check"
                      :rules="confirmPasswordRules"
            ></v-text-field>
                  </v-col>
                </v-row>
                
                <div class="form-actions">
                  <v-btn
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-key"
                    @click="changePassword"
                    :loading="changingPassword"
                    :disabled="!passwordFormValid"
                  >
                    Cambiar Contraseña
                  </v-btn>
                </div>
          </v-form>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Autenticación de Dos Factores</h3>
              
              <div class="afro-card">
                <div class="card-content">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="warning" size="32" class="mr-4">mdi-shield-key</v-icon>
                      <div>
                        <div class="setting-title">Autenticación de Dos Factores</div>
                        <div class="setting-description">
                          Agrega una capa extra de seguridad a tu cuenta
                        </div>
                      </div>
                    </div>
                    <v-switch
                      v-model="twoFactorEnabled"
                      color="primary"
                      @change="toggleTwoFactor"
                    ></v-switch>
                  </div>
                </div>
              </div>
            </div>

            <!-- Active Sessions -->
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Sesiones Activas</h3>
              
              <div class="sessions-list">
                <div
                  v-for="session in activeSessions"
                  :key="session.id"
                  class="session-item afro-card"
                >
                  <div class="session-info">
                    <div class="session-device">
                      <v-icon :color="getDeviceColor(session.device)">{{ getDeviceIcon(session.device) }}</v-icon>
                      <div>
                        <div class="device-name">{{ session.device }}</div>
                        <div class="session-location">{{ session.location }}</div>
                      </div>
                    </div>
                    <div class="session-details">
                      <div class="session-time">{{ formatTime(session.lastActive) }}</div>
                      <div class="session-status">
                        <v-chip
                          :color="session.current ? 'success' : 'info'"
                          size="small"
                          variant="tonal"
                        >
                          {{ session.current ? 'Actual' : 'Activa' }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                  <div class="session-actions">
                    <v-btn
                      v-if="!session.current"
                      color="error"
                      variant="outlined"
                      size="small"
                      @click="revokeSession(session.id)"
                    >
                      Revocar
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Notifications Settings -->
        <v-window-item value="notifications">
          <div class="tab-content">
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Preferencias de Notificaciones</h3>
              
              <div class="notifications-grid">
                <div class="notification-category">
                  <h4 class="category-title">Proyectos</h4>
                  <div class="notification-items">
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Nuevas tareas asignadas</div>
                        <div class="notification-description">Recibe notificaciones cuando te asignen nuevas tareas</div>
                      </div>
          <v-switch
            v-model="notifications.newTasks"
            color="primary"
          ></v-switch>
                    </div>
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Actualizaciones de proyectos</div>
                        <div class="notification-description">Notificaciones sobre cambios en tus proyectos</div>
                      </div>
          <v-switch
            v-model="notifications.projectUpdates"
            color="primary"
                      ></v-switch>
                    </div>
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Recordatorios de fechas límite</div>
                        <div class="notification-description">Alertas antes de que venzan las tareas</div>
                      </div>
                      <v-switch
                        v-model="notifications.deadlineReminders"
                        color="primary"
                      ></v-switch>
                    </div>
                  </div>
                </div>

                <div class="notification-category">
                  <h4 class="category-title">Comunicación</h4>
                  <div class="notification-items">
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Mensajes de organizaciones</div>
                        <div class="notification-description">Notificaciones de mensajes directos</div>
                      </div>
                      <v-switch
                        v-model="notifications.messages"
                        color="primary"
                      ></v-switch>
                    </div>
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Invitaciones a proyectos</div>
                        <div class="notification-description">Notificaciones de nuevas oportunidades</div>
                      </div>
                      <v-switch
                        v-model="notifications.invitations"
                        color="primary"
                      ></v-switch>
                    </div>
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Logros y reconocimientos</div>
                        <div class="notification-description">Notificaciones de logros obtenidos</div>
                      </div>
                      <v-switch
                        v-model="notifications.achievements"
                        color="primary"
                      ></v-switch>
                    </div>
                  </div>
                </div>

                <div class="notification-category">
                  <h4 class="category-title">Sistema</h4>
                  <div class="notification-items">
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Notificaciones por email</div>
                        <div class="notification-description">Recibe notificaciones en tu correo electrónico</div>
                      </div>
                      <v-switch
                        v-model="notifications.email"
                        color="primary"
                      ></v-switch>
                    </div>
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Notificaciones push</div>
                        <div class="notification-description">Notificaciones en tiempo real en el navegador</div>
                      </div>
                      <v-switch
                        v-model="notifications.push"
                        color="primary"
                      ></v-switch>
                    </div>
                    <div class="notification-item">
                      <div class="notification-info">
                        <div class="notification-title">Notificaciones SMS</div>
                        <div class="notification-description">Recibe notificaciones por mensaje de texto</div>
                      </div>
                      <v-switch
                        v-model="notifications.sms"
                        color="primary"
                      ></v-switch>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-bell"
                  class="professional-save-btn"
                  @click="saveNotificationSettings"
                  :loading="savingNotifications"
                >
                  Guardar Preferencias
                </v-btn>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Privacy Settings -->
        <v-window-item value="privacy">
          <div class="tab-content">
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Configuración de Privacidad</h3>
              
              <div class="privacy-grid">
                <div class="privacy-item afro-card">
                  <div class="card-content">
                    <div class="privacy-header">
                      <v-icon color="info" size="24">mdi-eye</v-icon>
                      <div>
                        <div class="privacy-title">Perfil Público</div>
                        <div class="privacy-description">Permite que otros usuarios vean tu perfil</div>
                      </div>
                    </div>
                    <v-switch
                      v-model="privacySettings.publicProfile"
                      color="primary"
                    ></v-switch>
                  </div>
                </div>

                <div class="privacy-item afro-card">
                  <div class="card-content">
                    <div class="privacy-header">
                      <v-icon color="success" size="24">mdi-account-group</v-icon>
                      <div>
                        <div class="privacy-title">Mostrar Proyectos</div>
                        <div class="privacy-description">Permite que otros vean tus proyectos</div>
                      </div>
                    </div>
                    <v-switch
                      v-model="privacySettings.showProjects"
                      color="primary"
                    ></v-switch>
                  </div>
                </div>

                <div class="privacy-item afro-card">
                  <div class="card-content">
                    <div class="privacy-header">
                      <v-icon color="warning" size="24">mdi-chart-line</v-icon>
                      <div>
                        <div class="privacy-title">Mostrar Estadísticas</div>
                        <div class="privacy-description">Permite que otros vean tus estadísticas</div>
                      </div>
                    </div>
                    <v-switch
                      v-model="privacySettings.showStats"
                      color="primary"
          ></v-switch>
                  </div>
                </div>

                <div class="privacy-item afro-card">
                  <div class="card-content">
                    <div class="privacy-header">
                      <v-icon color="error" size="24">mdi-email</v-icon>
                      <div>
                        <div class="privacy-title">Contacto Directo</div>
                        <div class="privacy-description">Permite que otros te contacten directamente</div>
                      </div>
                    </div>
          <v-switch
                      v-model="privacySettings.allowContact"
            color="primary"
          ></v-switch>
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-shield-check"
                  @click="savePrivacySettings"
                  :loading="savingPrivacy"
                >
                  Guardar Configuración
                </v-btn>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Preferences Settings -->
        <v-window-item value="preferences">
          <div class="tab-content">
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Preferencias Generales</h3>
              
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="preferences.language"
                    :items="languageOptions"
                    label="Idioma"
                    variant="outlined"
                    prepend-inner-icon="mdi-translate"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="preferences.timezone"
                    :items="timezoneOptions"
                    label="Zona Horaria"
                    variant="outlined"
                    prepend-inner-icon="mdi-clock"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="preferences.dateFormat"
                    :items="dateFormatOptions"
                    label="Formato de Fecha"
                    variant="outlined"
                    prepend-inner-icon="mdi-calendar"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="preferences.theme"
                    :items="themeOptions"
                    label="Tema"
                    variant="outlined"
                    prepend-inner-icon="mdi-palette"
                  ></v-select>
      </v-col>
    </v-row>
              
              <div class="form-actions">
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-cog"
                  @click="savePreferences"
                  :loading="savingPreferences"
                >
                  Guardar Preferencias
                </v-btn>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Integrations Settings -->
        <v-window-item value="integrations">
          <div class="tab-content">
            <div class="settings-section">
              <h3 class="afro-heading-4 mb-4">Integraciones</h3>
              
              <div class="integrations-grid">
                <div class="integration-item afro-card">
                  <div class="card-content">
                    <div class="integration-header">
                      <v-icon color="primary" size="32">mdi-calendar</v-icon>
                      <div>
                        <div class="integration-title">Google Calendar</div>
                        <div class="integration-description">Sincroniza tus actividades con Google Calendar</div>
                      </div>
                    </div>
                    <v-switch
                      v-model="integrations.googleCalendar"
                      color="primary"
                      @change="toggleGoogleCalendar"
                    ></v-switch>
                  </div>
                </div>

                <div class="integration-item afro-card">
                  <div class="card-content">
                    <div class="integration-header">
                      <v-icon color="info" size="32">mdi-linkedin</v-icon>
                      <div>
                        <div class="integration-title">LinkedIn</div>
                        <div class="integration-description">Conecta tu perfil de LinkedIn</div>
                      </div>
                    </div>
                    <v-switch
                      v-model="integrations.linkedin"
                      color="primary"
                      @change="toggleLinkedIn"
                    ></v-switch>
                  </div>
                </div>

                <div class="integration-item afro-card">
                  <div class="card-content">
                    <div class="integration-header">
                      <v-icon color="success" size="32">mdi-github</v-icon>
                      <div>
                        <div class="integration-title">GitHub</div>
                        <div class="integration-description">Conecta tu perfil de GitHub</div>
                      </div>
                    </div>
                    <v-switch
                      v-model="integrations.github"
                      color="primary"
                      @change="toggleGitHub"
                    ></v-switch>
                  </div>
                </div>

                <div class="integration-item afro-card">
                  <div class="card-content">
                    <div class="integration-header">
                      <v-icon color="warning" size="32">mdi-email</v-icon>
                      <div>
                        <div class="integration-title">Outlook</div>
                        <div class="integration-description">Sincroniza con tu cuenta de Outlook</div>
                      </div>
                    </div>
                    <v-switch
                      v-model="integrations.outlook"
                      color="primary"
                      @change="toggleOutlook"
                    ></v-switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Reactive data
const activeTab = ref('account');
const saving = ref(false);
const changingPassword = ref(false);
const savingNotifications = ref(false);
const savingPrivacy = ref(false);
const savingPreferences = ref(false);
const passwordFormValid = ref(false);

// Account data
const accountInfo = ref({
  nombre: 'María González',
  email: 'maria@email.com',
  telefono: '+57 300 123 4567',
  ubicacion: 'Bogotá, Colombia',
  biografia: 'Apasionada por la educación y el impacto social',
  createdAt: '2023-08-15'
});

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Security settings
const twoFactorEnabled = ref(false);
const activeSessions = ref([
  {
    id: 1,
    device: 'Chrome en Windows',
    location: 'Bogotá, Colombia',
    lastActive: '2024-02-15T14:30:00',
    current: true
  },
  {
    id: 2,
    device: 'Safari en iPhone',
    location: 'Bogotá, Colombia',
    lastActive: '2024-02-14T09:15:00',
    current: false
  }
]);

// Notifications settings
const notifications = ref({
  newTasks: true,
  projectUpdates: true,
  deadlineReminders: true,
  messages: true,
  invitations: true,
  achievements: true,
  email: true,
  push: true,
  sms: false
});

// Privacy settings
const privacySettings = ref({
  publicProfile: true,
  showProjects: true,
  showStats: true,
  allowContact: true
});

// Preferences
const preferences = ref({
  language: 'es',
  timezone: 'America/Bogota',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light'
});

// Integrations
const integrations = ref({
  googleCalendar: false,
  linkedin: false,
  github: false,
  outlook: false
});

// Options
const languageOptions = [
  { title: 'Español', value: 'es' },
  { title: 'English', value: 'en' }
];

const timezoneOptions = [
  { title: 'Bogotá (GMT-5)', value: 'America/Bogota' },
  { title: 'New York (GMT-5)', value: 'America/New_York' },
  { title: 'London (GMT+0)', value: 'Europe/London' }
];

const dateFormatOptions = [
  { title: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { title: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { title: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
];

const themeOptions = [
  { title: 'Claro', value: 'light' },
  { title: 'Oscuro', value: 'dark' },
  { title: 'Automático', value: 'auto' }
];

// Password validation rules
const passwordRules = [
  v => !!v || 'La nueva contraseña es requerida',
  v => (v && v.length >= 8) || 'La contraseña debe tener al menos 8 caracteres',
  v => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v) || 'La contraseña debe contener mayúsculas, minúsculas y números'
];

const confirmPasswordRules = [
  v => !!v || 'Confirma tu nueva contraseña',
  v => v === passwordForm.value.newPassword || 'Las contraseñas no coinciden'
];

// Methods
const saveAccountInfo = async () => {
  saving.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Información de cuenta guardada');
  } catch (error) {
    console.error('Error al guardar:', error);
  } finally {
    saving.value = false;
  }
};

const changePassword = async () => {
  changingPassword.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Contraseña cambiada');
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
  } finally {
    changingPassword.value = false;
  }
};

const toggleTwoFactor = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Two-factor authentication toggled:', twoFactorEnabled.value);
  } catch (error) {
    console.error('Error al cambiar 2FA:', error);
  }
};

const revokeSession = async (sessionId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = activeSessions.value.findIndex(s => s.id === sessionId);
    if (index > -1) {
      activeSessions.value.splice(index, 1);
    }
    console.log('Sesión revocada:', sessionId);
  } catch (error) {
    console.error('Error al revocar sesión:', error);
  }
};

const saveNotificationSettings = async () => {
  savingNotifications.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Configuración de notificaciones guardada');
  } catch (error) {
    console.error('Error al guardar notificaciones:', error);
  } finally {
    savingNotifications.value = false;
  }
};

const savePrivacySettings = async () => {
  savingPrivacy.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Configuración de privacidad guardada');
  } catch (error) {
    console.error('Error al guardar privacidad:', error);
  } finally {
    savingPrivacy.value = false;
  }
};

const savePreferences = async () => {
  savingPreferences.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Preferencias guardadas');
  } catch (error) {
    console.error('Error al guardar preferencias:', error);
  } finally {
    savingPreferences.value = false;
  }
};

const toggleGoogleCalendar = () => {
  console.log('Google Calendar toggled:', integrations.value.googleCalendar);
};

const toggleLinkedIn = () => {
  console.log('LinkedIn toggled:', integrations.value.linkedin);
};

const toggleGitHub = () => {
  console.log('GitHub toggled:', integrations.value.github);
};

const toggleOutlook = () => {
  console.log('Outlook toggled:', integrations.value.outlook);
};

const logout = () => {
  authStore.logout();
  router.push('/auth/login');
};

// Helper functions
const getDeviceIcon = (device) => {
  if (device.includes('iPhone') || device.includes('Android')) return 'mdi-cellphone';
  if (device.includes('Chrome') || device.includes('Firefox') || device.includes('Safari')) return 'mdi-web';
  if (device.includes('Windows') || device.includes('Mac') || device.includes('Linux')) return 'mdi-laptop';
  return 'mdi-devices';
};

const getDeviceColor = (device) => {
  if (device.includes('iPhone') || device.includes('Android')) return 'success';
  if (device.includes('Chrome') || device.includes('Firefox') || device.includes('Safari')) return 'primary';
  if (device.includes('Windows') || device.includes('Mac') || device.includes('Linux')) return 'info';
  return 'grey';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleString('es-CO');
};

onMounted(() => {
  // Load settings data
});
</script>

<style scoped>
.settings-view {
  padding: var(--afro-space-lg);
  background: var(--afro-background);
  min-height: 100vh;
}

/* Page Header */
.page-header {
  margin-bottom: var(--afro-space-xl);
}

.header-actions {
  display: flex;
  gap: var(--afro-space-md);
}

/* Settings Navigation */
.settings-navigation {
  margin-bottom: var(--afro-space-lg);
}

.settings-tabs {
  border-bottom: 1px solid var(--afro-border);
}

/* Improved Tab Styling */
.settings-tab {
  color: #64748b !important; /* Soft gray instead of black */
  font-weight: 500;
  transition: all 0.3s ease;
}

.settings-tab .v-icon {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.settings-tab:hover {
  color: #475569 !important; /* Slightly darker on hover */
  background-color: rgba(59, 130, 246, 0.05);
}

.settings-tab:hover .v-icon {
  opacity: 1;
  transform: scale(1.05);
}

.settings-tab.v-tab--selected {
  color: #2563eb !important; /* Primary blue when active */
  font-weight: 600;
}

.settings-tab.v-tab--selected .v-icon {
  opacity: 1;
  color: #2563eb !important;
}

/* Custom colors for different tab icons */
.settings-tab .v-icon[color="primary-light"] {
  color: #3b82f6 !important; /* Soft blue */
}

.settings-tab .v-icon[color="success-light"] {
  color: #10b981 !important; /* Soft green */
}

.settings-tab .v-icon[color="info-light"] {
  color: #06b6d4 !important; /* Soft cyan */
}

.settings-tab .v-icon[color="warning-light"] {
  color: #f59e0b !important; /* Soft amber */
}

.settings-tab .v-icon[color="secondary-light"] {
  color: #8b5cf6 !important; /* Soft purple */
}

.settings-tab .v-icon[color="accent-light"] {
  color: #ec4899 !important; /* Soft pink */
}

/* Tab Content */
.tab-content {
  padding: var(--afro-space-xl);
}

.settings-section {
  margin-bottom: var(--afro-space-3xl);
}

.settings-section:last-child {
  margin-bottom: 0;
}

/* Form Actions */
.form-actions {
  margin-top: var(--afro-space-xl);
  padding-top: var(--afro-space-lg);
  border-top: 1px solid var(--afro-border);
}

/* Status Items */
.status-item {
  display: flex;
  align-items: center;
  gap: var(--afro-space-md);
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.status-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

/* Sessions List */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.session-item {
  padding: var(--afro-space-lg);
}

.session-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.session-device {
  display: flex;
  align-items: center;
  gap: var(--afro-space-md);
}

.device-name {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.session-location {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

.session-details {
  text-align: right;
}

.session-time {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-xs);
}

.session-actions {
  margin-left: var(--afro-space-md);
}

/* Notifications Grid */
.notifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--afro-space-xl);
}

.notification-category {
  padding: var(--afro-space-lg);
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-lg);
}

.category-title {
  font-size: var(--afro-text-lg);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-lg);
}

.notification-items {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-lg);
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-info {
  flex: 1;
}

.notification-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.notification-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

/* Privacy Grid */
.privacy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--afro-space-lg);
}

.privacy-item {
  padding: var(--afro-space-lg);
}

.privacy-header {
  display: flex;
  align-items: center;
  gap: var(--afro-space-md);
  flex: 1;
}

.privacy-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.privacy-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

/* Integrations Grid */
.integrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--afro-space-lg);
}

.integration-item {
  padding: var(--afro-space-lg);
}

.integration-header {
  display: flex;
  align-items: center;
  gap: var(--afro-space-md);
  flex: 1;
}

.integration-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.integration-description {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-view {
    padding: var(--afro-space-md);
  }
  
  .notifications-grid,
  .privacy-grid,
  .integrations-grid {
    grid-template-columns: 1fr;
  }
  
  .session-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--afro-space-md);
  }
  
  .session-details {
    text-align: left;
  }
  
  .session-actions {
    margin-left: 0;
    margin-top: var(--afro-space-md);
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .tab-content {
    padding: var(--afro-space-md);
  }
  
  .settings-section {
    margin-bottom: var(--afro-space-xl);
  }
  
  .notification-item,
  .privacy-header,
  .integration-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--afro-space-md);
  }
}
</style>
