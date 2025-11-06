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
      <v-tabs v-model="tab" bg-color="transparent" color="primary" class="px-6">
        <v-tab value="general" class="text-capitalize">
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
      
      <v-window v-model="tab">
        <!-- General Tab: Perfil + Identidad en vista empresarial -->
        <v-window-item value="general">
          <v-card-text class="pa-8">
            <v-row>
              <!-- Col izquierda: ajustes adicionales y datos de organización -->
              <v-col cols="12" md="8">
                <v-card class="pa-6 rounded-lg dashboard-card" variant="outlined">
                  <div class="d-flex align-center mb-6">
                    <v-icon color="primary" size="28" class="mr-3">mdi-domain</v-icon>
                    <h2 class="text-h6 font-weight-bold mb-0">Información de la Organización</h2>
                  </div>
            <v-row>
              <v-col cols="12" md="6">
                      <v-text-field
                        label="Nombre de la Organización"
                        v-model="profile.nombre"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-domain"
                        :rules="[v => !!v || 'El nombre es requerido']"
                        class="mb-4"
                      />
              </v-col>
              <v-col cols="12" md="6">
                      <v-select
                        label="Tipo de Organización"
                        v-model="profile.tipo"
                        :items="organizationTypes"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-office-building"
                        class="mb-4"
                      />
              </v-col>
              <v-col cols="12" md="6">
                      <v-text-field
                        label="Sitio Web"
                        v-model="profile.sitio_web"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-web"
                        type="url"
                        class="mb-4"
                      />
              </v-col>
              <v-col cols="12" md="3">
                      <v-select
                        label="País"
                        v-model="profile.pais"
                        :items="countries"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-map-marker"
                        class="mb-4"
                      />
              </v-col>
              <v-col cols="12" md="3">
                      <v-text-field
                        label="Ciudad"
                        v-model="profile.ciudad"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-city"
                        class="mb-4"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-combobox
                        label="Áreas de Enfoque"
                        v-model="profile.areas_enfoque"
                        :items="focusAreas"
                        variant="outlined"
                        density="comfortable"
                        multiple
                        chips
                        closable-chips
                        prepend-inner-icon="mdi-target"
                        class="mb-4"
                      />
              </v-col>
              <v-col cols="12">
                      <v-textarea
                        label="Misión y Visión"
                        v-model="profile.mision_vision"
                        variant="outlined"
                        density="comfortable"
                        rows="4"
                        prepend-inner-icon="mdi-lightbulb"
                        class="mb-4"
                      />
              </v-col>
              <v-col cols="12">
                      <v-textarea
                        label="Descripción de la Organización"
                        v-model="profile.descripcion"
                        variant="outlined"
                        density="comfortable"
                        rows="3"
                        prepend-inner-icon="mdi-text"
                        class="mb-4"
                      />
                    </v-col>
                  </v-row>

                  <v-divider class="my-6" />
                  <div class="d-flex justify-end">
                    <v-btn color="primary" variant="flat" @click="saveProfile" :loading="saving">
                      <v-icon start>mdi-content-save</v-icon>
                      Guardar Cambios
                    </v-btn>
                  </div>
                </v-card>

                <v-card class="pa-6 rounded-lg dashboard-card mt-6" variant="outlined">
                  <div class="d-flex align-center mb-6">
                    <v-icon color="primary" size="28" class="mr-3">mdi-palette</v-icon>
                    <h2 class="text-h6 font-weight-bold mb-0">Identidad Visual</h2>
                  </div>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        label="Nombre Corto"
                        v-model="branding.nombre_corto"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-text-short"
                        class="mb-4"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        label="Tema de Color"
                        v-model="branding.tema"
                        :items="themes"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-palette"
                        class="mb-4"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
                        <h4 class="text-subtitle-1 mb-3">Color Primario</h4>
                        <v-color-picker v-model="branding.color_primario" mode="hex" hide-mode-switch class="mb-3" />
                        <v-text-field label="Código Hex" v-model="branding.color_primario" variant="outlined" density="comfortable" prepend-inner-icon="mdi-pound" />
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card class="pa-4 rounded-lg dashboard-card" variant="outlined">
                        <h4 class="text-subtitle-1 mb-3">Color Secundario</h4>
                        <v-color-picker v-model="branding.color_secundario" mode="hex" hide-mode-switch class="mb-3" />
                        <v-text-field label="Código Hex" v-model="branding.color_secundario" variant="outlined" density="comfortable" prepend-inner-icon="mdi-pound" />
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-divider class="my-6" />
                  <div class="d-flex justify-end">
                    <v-btn color="primary" variant="flat" @click="saveBranding" :loading="saving">
                      <v-icon start>mdi-palette</v-icon>
                      Guardar Identidad
                    </v-btn>
                  </div>
                </v-card>
              </v-col>

              <!-- Col derecha: perfil compacto estilo red social -->
              <v-col cols="12" md="4">
                <v-card class="pa-6 rounded-xl dashboard-card" variant="outlined">
                  <div class="text-center">
                    <v-avatar size="120" class="mb-4 elevation-2">
                      <v-img v-if="branding.logo" :src="branding.logo" />
                      <v-icon v-else size="60" color="grey">mdi-account-circle</v-icon>
                    </v-avatar>
                    <v-file-input
                      label="Actualizar foto/logo"
                      v-model="logoFile"
                      accept="image/*"
                      variant="outlined"
                      density="comfortable"
                      @change="handleLogoUpload"
                      class="mb-4"
                    />
                    <h3 class="text-h6 font-weight-bold mb-1">{{ profile.nombre || 'Nombre de la organización' }}</h3>
                    <p class="text-caption text-grey mb-4">{{ profile.tipo || 'Tipo de organización' }}</p>

                    <v-text-field label="Nombre Corto" v-model="branding.nombre_corto" variant="outlined" density="comfortable" class="mb-3" />
                    <v-text-field label="Sitio Web" v-model="profile.sitio_web" variant="outlined" density="comfortable" class="mb-3" />
                    <v-row>
                      <v-col cols="6">
                        <v-select label="País" v-model="profile.pais" :items="countries" variant="outlined" density="comfortable" />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field label="Ciudad" v-model="profile.ciudad" variant="outlined" density="comfortable" />
                      </v-col>
                    </v-row>
                    <v-combobox
                      label="Áreas de Enfoque"
                      v-model="profile.areas_enfoque"
                      :items="focusAreas"
                      variant="outlined"
                      density="comfortable"
                      multiple
                      chips
                      closable-chips
                      class="mb-4"
                    />
                    <v-btn v-if="branding.logo" variant="text" color="error" @click="removeLogo" size="small" class="mb-2">
                      <v-icon start>mdi-delete</v-icon>Eliminar logo
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>

        <!-- Account Tab -->
        <v-window-item value="account">
          <v-card-text class="pa-8">
            <div class="d-flex align-center mb-6">
              <v-icon color="primary" size="28" class="mr-3">mdi-account-key</v-icon>
              <h2 class="text-h5 font-weight-bold">Información de Cuenta</h2>
            </div>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Correo Electrónico"
                  v-model="account.email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-email"
                  :rules="[v => !!v || 'El email es requerido', v => /.+@.+\..+/.test(v) || 'Email inválido']"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Teléfono"
                  v-model="account.telefono"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-phone"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12">
                <v-divider class="my-4" />
                <h3 class="text-h6 mb-4">Cambiar Contraseña</h3>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Contraseña Actual"
                  v-model="account.currentPassword"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Nueva Contraseña"
                  v-model="account.newPassword"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-plus"
                  :rules="[v => !v || v.length >= 8 || 'Mínimo 8 caracteres']"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Confirmar Contraseña"
                  v-model="account.confirmPassword"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-check"
                  :rules="[v => v === account.newPassword || 'Las contraseñas no coinciden']"
                  class="mb-4"
                />
              </v-col>
            </v-row>
            
            <v-divider class="my-6" />
            
            <div class="d-flex justify-end">
              <v-btn color="primary" variant="flat" @click="saveAccount" :loading="saving">
                <v-icon start>mdi-account-key</v-icon>
                Actualizar Cuenta
              </v-btn>
            </div>
          </v-card-text>
        </v-window-item>

        <!-- Preferences Tab -->
        <v-window-item value="preferences">
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
        </v-window-item>

        <!-- Security Tab -->
        <v-window-item value="security">
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
        </v-window-item>

        <!-- Integrations Tab -->
        <v-window-item value="integrations">
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
                <v-card class="pa-4 rounded-lg" variant="outlined">
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
                <v-card class="pa-4 rounded-lg" variant="outlined">
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
        </v-window-item>
      </v-window>
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
import { ref, computed } from 'vue';
import ModernCard from '@/components/ui/ModernCard.vue';

const tab = ref('profile');
const saving = ref(false);
const logoFile = ref(null);

const snackbar = ref({ 
  show: false, 
  message: '', 
  color: 'success',
  icon: 'mdi-check-circle'
});

// Organization stats
const organizationStats = ref({
  members: 24,
  projects: 8,
  events: 12,
  impact: 87
});

// Data options
const organizationTypes = [
  'ONG',
  'Fundación',
  'Asociación',
  'Cooperativa',
  'Corporación',
  'Empresa Social',
  'Gobierno',
  'Universidad'
];

const countries = [
  'Colombia',
  'México',
  'Argentina',
  'Chile',
  'Perú',
  'Ecuador',
  'Venezuela',
  'Bolivia',
  'Uruguay',
  'Paraguay',
  'Brasil',
  'Estados Unidos',
  'España',
  'Otro'
];

const focusAreas = [
  'Educación',
  'Tecnología',
  'Salud',
  'Ambiente',
  'Emprendimiento',
  'Desarrollo Comunitario',
  'Derechos Humanos',
  'Arte y Cultura',
  'Deportes',
  'Alimentación',
  'Vivienda',
  'Empleo'
];

const themes = [
  { title: 'Sistema', value: 'system' },
  { title: 'Claro', value: 'light' },
  { title: 'Oscuro', value: 'dark' }
];

const languages = [
  { title: 'Español', value: 'es' },
  { title: 'English', value: 'en' },
  { title: 'Português', value: 'pt' },
  { title: 'Français', value: 'fr' }
];

const timezones = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Argentina/Buenos_Aires',
  'America/Santiago',
  'America/Lima',
  'America/New_York',
  'Europe/Madrid',
  'UTC'
];

// Form data
const profile = ref({
  nombre: 'Fundación Semillas del Saber',
  tipo: 'Fundación',
  sitio_web: 'https://semillasdelsaber.org',
  pais: 'Colombia',
  ciudad: 'Medellín',
  areas_enfoque: ['Educación', 'Tecnología', 'Desarrollo Comunitario'],
  mision_vision: 'Nuestra misión es cerrar la brecha educativa en comunidades rurales a través de la tecnología y el voluntariado. Aspiramos a un futuro donde cada niño tenga acceso a una educación de calidad.',
  descripcion: 'Organización sin ánimo de lucro dedicada al empoderamiento de comunidades vulnerables a través de programas educativos innovadores y tecnología accesible.'
});

const branding = ref({
  logo: '',
  nombre_corto: 'Semillas',
  tema: 'system',
  color_primario: '#1976D2',
  color_secundario: '#26A69A'
});

const account = ref({
  email: 'contacto@semillasdelsaber.org',
  telefono: '+57 300 123 4567',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const preferences = ref({
  notificaciones_email: true,
  resumen_semanal: true,
  recordatorios: true,
  notificaciones_push: false,
  modo_oscuro: false,
  idioma: 'es',
  zona_horaria: 'America/Bogota'
});

const security = ref({
  twoFactor: false,
  sso: false,
  sessionTimeout: 60,
  ipWhitelist: false,
  auditLog: true
});

const integrations = ref({
  google: false,
  microsoft: false,
  slack: false,
  mailchimp: false
});

// Methods
function handleLogoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
    showSnackbar('El archivo es demasiado grande. Máximo 2MB', 'error', 'mdi-alert');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = () => {
    branding.value.logo = reader.result;
    showSnackbar('Logo actualizado correctamente', 'success', 'mdi-check');
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  branding.value.logo = '';
  showSnackbar('Logo eliminado', 'info', 'mdi-information');
}

function showSnackbar(message, color, icon) {
  snackbar.value = {
    show: true,
    message,
    color,
    icon
  };
}

async function fakeSave() {
  saving.value = true;
  await new Promise(r => setTimeout(r, 1000));
  saving.value = false;
}

async function saveProfile() {
  await fakeSave();
  showSnackbar('Perfil guardado correctamente', 'success', 'mdi-check');
}

async function saveBranding() {
  await fakeSave();
  showSnackbar('Identidad visual actualizada', 'success', 'mdi-palette');
}

async function saveAccount() {
  if (account.value.newPassword && account.value.newPassword !== account.value.confirmPassword) {
    showSnackbar('Las contraseñas no coinciden', 'error', 'mdi-alert');
    return;
  }
  
  await fakeSave();
  showSnackbar('Cuenta actualizada correctamente', 'success', 'mdi-account-key');
}

async function savePreferences() {
  await fakeSave();
  showSnackbar('Preferencias guardadas', 'success', 'mdi-cog');
}

async function saveSecurity() {
  await fakeSave();
  showSnackbar('Configuración de seguridad actualizada', 'success', 'mdi-shield-check');
}

async function saveIntegrations() {
  await fakeSave();
  showSnackbar('Integraciones configuradas', 'success', 'mdi-puzzle');
}

async function saveAll() {
  await fakeSave();
  showSnackbar('Todos los cambios guardados', 'success', 'mdi-content-save');
}

function exportSettings() {
  const settings = {
    profile: profile.value,
    branding: branding.value,
    preferences: preferences.value,
    security: security.value,
    integrations: integrations.value
  };
  
  const dataStr = JSON.stringify(settings, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `configuracion_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  
  showSnackbar('Configuración exportada', 'info', 'mdi-download');
}

function viewAuditLog() {
  showSnackbar('Funcionalidad de auditoría en desarrollo', 'info', 'mdi-information');
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
