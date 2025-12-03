<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="currentRole ? 'Editar Rol' : 'Nuevo Rol'"
    :icon="currentRole ? 'mdi-pencil' : 'mdi-plus'"
    max-width="700px"
  >
    <template #content>
      <v-alert
        v-if="!currentRole"
        type="info"
        variant="tonal"
        class="mb-4"
        density="compact"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-information</v-icon>
          <span>Creando un nuevo rol para el proyecto</span>
        </div>
      </v-alert>

      <v-alert
        v-if="isProjectRole"
        type="info"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        <v-icon start size="small">mdi-information</v-icon>
        Este rol es específico para este proyecto y solo sirve para identificar el trabajo de los voluntarios.
      </v-alert>
      
      <v-form @submit.prevent="handleSave" ref="formRef">
        <v-text-field
          v-model="localForm.name"
          label="Nombre del Rol *"
          placeholder="Ej: Coordinador, Asistente, Voluntario..."
          variant="outlined"
          required
          :rules="nameRules"
          :counter="100"
          :hint="nameHint"
          persistent-hint
          prepend-inner-icon="mdi-account-tie"
          class="mb-4"
          density="comfortable"
        >
          <template #append-inner>
            <v-icon 
              v-if="localForm.name && nameIsValid" 
              color="success" 
              size="small"
            >
              mdi-check-circle
            </v-icon>
          </template>
        </v-text-field>
        
        <v-textarea
          v-model="localForm.description"
          label="Descripción (Opcional)"
          variant="outlined"
          rows="3"
          placeholder="Describe las responsabilidades de este rol..."
          :counter="500"
          :hint="descriptionHint"
          persistent-hint
          prepend-inner-icon="mdi-text"
          class="mb-4"
          density="comfortable"
        >
          <template #append-inner>
            <v-icon 
              v-if="localForm.description && descriptionIsValid" 
              color="success" 
              size="small"
            >
              mdi-check-circle
            </v-icon>
          </template>
        </v-textarea>

        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4" rounded="lg" elevation="0">
              <div class="d-flex align-center justify-space-between mb-2">
                <div>
                  <div class="text-subtitle-2 font-weight-medium mb-1">Estado del Rol</div>
                  <div class="text-caption text-grey">
                    Los roles inactivos no se mostrarán en las opciones de asignación
                  </div>
                </div>
                <v-switch
                  v-model="localForm.activo"
                  :color="localForm.activo ? 'success' : 'grey'"
                  hide-details
                  inset
                ></v-switch>
              </div>
              <v-chip
                :color="localForm.activo ? 'success' : 'grey'"
                variant="tonal"
                size="small"
                class="mt-2"
              >
                <v-icon start size="small">
                  {{ localForm.activo ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                {{ localForm.activo ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4" rounded="lg" elevation="0">
              <div class="text-subtitle-2 font-weight-medium mb-3">Color del Rol</div>
              <div class="d-flex align-center gap-3 mb-3">
                <v-text-field
                  v-model="localForm.color"
                  label="Código Hex"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-pound"
                  :rules="colorRules"
                  hide-details="auto"
                  class="flex-grow-1"
                  @update:model-value="normalizeColor"
                ></v-text-field>
                <v-avatar
                  :color="localForm.color"
                  size="56"
                  class="color-preview"
                  style="border: 3px solid rgba(0,0,0,0.1); box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
                >
                  <v-icon color="white" size="24">mdi-palette</v-icon>
                </v-avatar>
              </div>
              <div class="color-swatches">
                <div class="text-caption text-grey mb-2">Colores Predefinidos</div>
                <div class="d-flex flex-wrap gap-2">
                  <template v-for="(row, rowIndex) in colorSwatches" :key="rowIndex">
                    <button
                      v-for="color in row"
                      :key="`${rowIndex}-${color}`"
                      type="button"
                      @click="localForm.color = color"
                      class="color-swatch-btn"
                      :class="{ 'color-swatch-selected': localForm.color === color }"
                      :style="{
                        minWidth: '40px',
                        width: '40px',
                        height: '40px',
                        backgroundColor: color + ' !important',
                        borderColor: localForm.color === color ? 'rgba(255,255,255,0.8)' : color,
                        borderWidth: localForm.color === color ? '2px' : '1px',
                        borderStyle: 'solid',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        margin: 0,
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }"
                    >
                      <v-icon 
                        v-if="localForm.color === color" 
                        color="white" 
                        size="small"
                      >
                        mdi-check
                      </v-icon>
                    </button>
                  </template>
                </div>
              </div>
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
        @click="handleSave"
        :loading="loading"
        prepend-icon="mdi-content-save"
      >
        {{ currentRole ? 'Actualizar' : 'Crear' }}
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import { VALIDATION_RULES } from '@/utils/validationRules';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  role: {
    type: Object,
    default: null
  },
  roleTypes: {
    type: Array,
    default: () => [
      { label: 'Rol de Proyecto', value: 'proyecto' }
    ]
  },
  isProjectRole: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'save', 'role-type-change']);

const formRef = ref(null);
const currentRole = computed(() => props.role);

const localForm = ref({
  name: '',
  description: '',
  tipo_rol: 'proyecto',
  id_organizacion: null,
  id_proyecto: null,
  activo: true,
  color: '#2196F3'
});

// Colores predefinidos para el selector
const colorSwatches = [
  ['#2196F3', '#1976D2', '#0D47A1', '#42A5F5'],
  ['#4CAF50', '#388E3C', '#1B5E20', '#66BB6A'],
  ['#FF9800', '#F57C00', '#E65100', '#FFA726'],
  ['#F44336', '#D32F2F', '#B71C1C', '#EF5350'],
  ['#9C27B0', '#7B1FA2', '#4A148C', '#AB47BC'],
  ['#00BCD4', '#0097A7', '#006064', '#26C6DA'],
  ['#795548', '#5D4037', '#3E2723', '#8D6E63'],
  ['#607D8B', '#455A64', '#263238', '#78909C']
];

// Validaciones en tiempo real
const nameRules = computed(() => VALIDATION_RULES.roleName);
const nameIsValid = computed(() => {
  const name = localForm.value.name;
  return name && name.length >= 2 && name.length <= 100;
});
const nameHint = computed(() => {
  const length = localForm.value.name?.length || 0;
  if (length === 0) return 'Mínimo 2 caracteres';
  if (length < 2) return `${2 - length} caracteres restantes (mínimo)`;
  if (length > 100) return 'Excede el límite de 100 caracteres';
  return `${length}/100 caracteres`;
});

const descriptionIsValid = computed(() => {
  const desc = localForm.value.description;
  if (!desc) return true; // Opcional
  return desc.length <= 500;
});
const descriptionHint = computed(() => {
  const length = localForm.value.description?.length || 0;
  if (length === 0) return 'Opcional - Máximo 500 caracteres';
  if (length > 500) return 'Excede el límite de 500 caracteres';
  return `${length}/500 caracteres`;
});

// Validación de color
const colorRules = [
  (v) => {
    if (!v) return true;
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(v) || 'Formato inválido. Use formato hexadecimal (ej: #2196F3)';
  }
];

// Normalizar color (agregar # si falta)
const normalizeColor = () => {
  if (localForm.value.color && !localForm.value.color.startsWith('#')) {
    localForm.value.color = '#' + localForm.value.color;
  }
  // Convertir a mayúsculas para consistencia
  if (localForm.value.color) {
    localForm.value.color = localForm.value.color.toUpperCase();
  }
};

watch(() => props.role, (newRole) => {
  if (newRole) {
    // Normalizar color del rol existente
    let roleColor = newRole.color || '#2196F3';
    if (roleColor && !roleColor.startsWith('#')) {
      roleColor = '#' + roleColor;
    }
    roleColor = roleColor.toUpperCase();
    
    localForm.value = {
      id: newRole.id || newRole.id_rol,
      id_rol: newRole.id_rol || newRole.id,
      name: newRole.name || newRole.nombre || '',
      nombre: newRole.nombre || newRole.name || '',
      description: newRole.description || newRole.descripcion || '',
      descripcion: newRole.descripcion || newRole.description || '',
      tipo_rol: newRole.tipo_rol || 'proyecto',
      id_organizacion: newRole.id_organizacion || null,
      id_proyecto: newRole.id_proyecto || null,
      activo: newRole.activo !== undefined ? newRole.activo : true,
      color: roleColor
    };
  } else {
    // Modo creación: usar projectId de props si está disponible
    localForm.value = {
      name: '',
      description: '',
      tipo_rol: 'proyecto',
      id_organizacion: null,
      id_proyecto: props.projectId || null,
      activo: true,
      color: '#2196F3'
    };
  }
  if (formRef.value) {
    formRef.value.resetValidation();
  }
}, { immediate: true });

// Watch projectId para actualizar cuando cambie
watch(() => props.projectId, (newProjectId) => {
  if (!props.role && newProjectId) {
    // Solo actualizar si estamos en modo creación
    localForm.value.id_proyecto = newProjectId;
  }
});

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen && formRef.value) {
    formRef.value.resetValidation();
  }
});

const handleSave = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (!valid) {
      return;
    }
  }
  
  // Validar que el proyecto esté presente para roles de proyecto
  if (localForm.value.tipo_rol === 'proyecto') {
    const projectId = localForm.value.id_proyecto || props.projectId;
    if (!projectId) {
      // Mostrar error si no hay projectId
      console.error('Error: El proyecto es requerido para roles de proyecto');
      return;
    }
  }
  
  // Normalizar color antes de enviar
  normalizeColor();
  
  // Asegurar que el color tenga el formato correcto
  let finalColor = localForm.value.color || '#2196F3';
  if (!finalColor.startsWith('#')) {
    finalColor = '#' + finalColor;
  }
  finalColor = finalColor.toUpperCase();
  
  // Asegurar que id_proyecto esté presente si es un rol de proyecto
  let finalProjectId = localForm.value.id_proyecto || props.projectId;
  if (localForm.value.tipo_rol === 'proyecto' && !finalProjectId) {
    console.error('Error: El proyecto es requerido para roles de proyecto');
    return;
  }
  
  emit('save', { 
    ...localForm.value,
    id_proyecto: finalProjectId,
    color: finalColor
  });
};
</script>

<style scoped>
.v-alert {
  border-left: 4px solid;
}

.color-preview {
  transition: all 0.3s ease;
  cursor: pointer;
}

.color-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.color-swatches {
  margin-top: 12px;
}

.color-swatch-btn {
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.color-swatch-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.color-swatch-selected {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

/* Forzar el color de fondo en los botones de color */
.color-swatch-btn :deep(.v-btn__overlay) {
  display: none !important;
}

.color-swatch-btn :deep(.v-btn__content) {
  background-color: inherit !important;
}

.v-card {
  transition: all 0.2s ease;
}

.v-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
