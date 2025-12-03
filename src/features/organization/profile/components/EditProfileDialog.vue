<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Editar Perfil"
    icon="mdi-pencil"
    max-width="800px"
  >
    <template #content>
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.nombre"
              label="Nombre de la Organización"
              variant="outlined"
              prepend-inner-icon="mdi-domain"
              :rules="[v => !!v || 'El nombre es requerido']"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.tipo"
              :items="organizationTypes"
              label="Tipo de Organización"
              variant="outlined"
              prepend-inner-icon="mdi-office-building"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.sitio_web"
              label="Sitio Web"
              variant="outlined"
              prepend-inner-icon="mdi-web"
              type="url"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="formData.pais"
              :items="countries"
              label="País"
              variant="outlined"
              prepend-inner-icon="mdi-map-marker"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="formData.ciudad"
              label="Ciudad"
              variant="outlined"
              prepend-inner-icon="mdi-city"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="formData.areas_enfoque"
              :items="focusAreas"
              label="Áreas de Enfoque"
              variant="outlined"
              multiple
              chips
              closable-chips
              prepend-inner-icon="mdi-target"
            ></v-combobox>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="formData.mision_vision"
              label="Misión y Visión"
              variant="outlined"
              rows="4"
              prepend-inner-icon="mdi-lightbulb"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="formData.descripcion"
              label="Descripción"
              variant="outlined"
              rows="3"
              prepend-inner-icon="mdi-text"
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.nombre_corto"
              label="Nombre Corto"
              variant="outlined"
              prepend-inner-icon="mdi-text-short"
              hint="Nombre breve o marca de la organización"
              persistent-hint
            ></v-text-field>
          </v-col>
          
          <!-- Color Primario (Alternativa al Banner) -->
          <v-col cols="12">
            <v-card variant="outlined" class="pa-4 color-picker-card">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-palette</v-icon>
                <div class="flex-grow-1">
                  <span class="text-subtitle-1 font-weight-bold">Color Primario</span>
                  <p class="text-caption text-grey mb-0 mt-1">
                    Se usará como fondo del banner si no subes una imagen personalizada
                  </p>
                </div>
              </div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-color-picker
                    v-model="formData.color_primario"
                    mode="hex"
                    hide-mode-switch
                    class="mb-3"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.color_primario"
                    label="Código Hex"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-pound"
                    placeholder="#1976D2"
                  ></v-text-field>
                  <div 
                    class="color-preview mt-3"
                    :style="{ backgroundColor: formData.color_primario }"
                  >
                    <span class="text-white text-caption">Vista previa</span>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </template>

    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cancelar
      </ModernButton>
      <ModernButton
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="!valid"
        @click="handleSave"
      >
        Guardar Cambios
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  organization: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const form = ref(null);
const valid = ref(false);

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
  'Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador',
  'Venezuela', 'Bolivia', 'Uruguay', 'Paraguay', 'Brasil',
  'Estados Unidos', 'España', 'Otro'
];

const focusAreas = [
  'Educación', 'Tecnología', 'Salud', 'Ambiente', 'Emprendimiento',
  'Desarrollo Comunitario', 'Derechos Humanos', 'Arte y Cultura',
  'Deportes', 'Alimentación', 'Vivienda', 'Empleo'
];

const formData = ref({
  nombre: '',
  tipo: '',
  sitio_web: '',
  pais: '',
  ciudad: '',
  areas_enfoque: [],
  mision_vision: '',
  descripcion: '',
  nombre_corto: '',
  color_primario: '#1976D2'
});

watch(() => props.organization, (newOrg) => {
  if (newOrg) {
    formData.value = {
      nombre: newOrg.nombre || '',
      tipo: newOrg.tipo || '',
      sitio_web: newOrg.sitio_web || '',
      pais: newOrg.pais || '',
      ciudad: newOrg.ciudad || '',
      areas_enfoque: parseFocusAreas(newOrg.areas_enfoque),
      mision_vision: newOrg.mision_vision || '',
      descripcion: newOrg.descripcion || '',
      nombre_corto: newOrg.nombre_corto || '',
      color_primario: newOrg.color_primario || '#1976D2'
    };
  }
}, { immediate: true });

function parseFocusAreas(areas) {
  if (!areas) return [];
  if (Array.isArray(areas)) return areas;
  if (typeof areas === 'string') {
    try {
      return JSON.parse(areas);
    } catch {
      return areas.split(',').map(a => a.trim()).filter(Boolean);
    }
  }
  return [];
}

function handleSave() {
  if (!valid.value) return;
  
  const data = {
    ...formData.value,
    areas_enfoque: Array.isArray(formData.value.areas_enfoque)
      ? formData.value.areas_enfoque.join(', ')
      : formData.value.areas_enfoque
  };
  
  emit('save', data);
  emit('update:modelValue', false);
}
</script>

<style scoped>
/* Asegurar que el texto en los inputs sea visible */
:deep(.v-text-field input),
:deep(.v-textarea textarea),
:deep(.v-select input),
:deep(.v-combobox input) {
  color: rgba(0, 0, 0, 0.87) !important;
}

:deep(.v-text-field .v-field__input),
:deep(.v-textarea .v-field__input),
:deep(.v-select .v-field__input),
:deep(.v-combobox .v-field__input) {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Asegurar que los labels sean visibles */
:deep(.v-label) {
  color: rgba(0, 0, 0, 0.6) !important;
}

:deep(.v-label--active) {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Color picker card */
.color-picker-card {
  background: rgba(var(--v-theme-surface), 1) !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.color-preview {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.color-preview:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Mejorar contraste en campos de texto */
:deep(.v-field__input) {
  color: #212121 !important;
}

:deep(.v-field--focused .v-field__input) {
  color: #212121 !important;
}

/* Asegurar que los hints sean visibles */
:deep(.v-messages) {
  color: rgba(0, 0, 0, 0.6) !important;
}

/* Color picker específico */
:deep(.v-color-picker) {
  background: white !important;
}

:deep(.v-color-picker input) {
  color: #212121 !important;
}
</style>

