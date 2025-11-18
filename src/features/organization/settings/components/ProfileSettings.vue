<template>
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
</template>

<script setup>
import { ref } from 'vue'

const saving = ref(false)
const logoFile = ref(null)

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
]

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
]

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
]

const themes = [
  { title: 'Sistema', value: 'system' },
  { title: 'Claro', value: 'light' },
  { title: 'Oscuro', value: 'dark' }
]

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
})

const branding = ref({
  logo: '',
  nombre_corto: 'Semillas',
  tema: 'system',
  color_primario: '#1976D2',
  color_secundario: '#26A69A'
})

// Methods
function handleLogoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  
  if (file.size > 2 * 1024 * 1024) {
    alert('El archivo es demasiado grande. Máximo 2MB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = () => {
    branding.value.logo = reader.result
  }
  reader.readAsDataURL(file)
}

function removeLogo() {
  branding.value.logo = ''
}

async function saveProfile() {
  saving.value = true
  await new Promise(r => setTimeout(r, 1000))
  saving.value = false
  // Aquí iría la lógica de guardado real
}

async function saveBranding() {
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

