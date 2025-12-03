<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="currentPhase ? 'Editar Fase' : 'Nueva Fase'"
    :icon="currentPhase ? 'mdi-pencil' : 'mdi-plus'"
    max-width="700px"
  >
    <template #content>
      <v-alert
        v-if="!currentPhase"
        type="info"
        variant="tonal"
        class="mb-4"
        density="compact"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-information</v-icon>
          <span>Creando una nueva fase para el proyecto</span>
        </div>
      </v-alert>

      <v-form @submit.prevent="handleSave" ref="formRef">
        <v-text-field
          v-model="localForm.name"
          label="Nombre de la Fase"
          placeholder="Ej: Planificación, Ejecución, Evaluación..."
          variant="outlined"
          required
          :rules="nameRules"
          :error-messages="errors?.name"
          :counter="100"
          :hint="nameHint"
          persistent-hint
          prepend-inner-icon="mdi-format-title"
          class="mb-4"
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
          label="Descripción"
          placeholder="Describe los objetivos y actividades de esta fase..."
          variant="outlined"
          rows="4"
          :counter="500"
          :hint="descriptionHint"
          persistent-hint
          prepend-inner-icon="mdi-text"
          class="mb-4"
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
        
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="localForm.orden"
              label="Orden"
              type="number"
              variant="outlined"
              min="1"
              required
              :rules="orderRules"
              :hint="orderHint"
              persistent-hint
              prepend-inner-icon="mdi-sort-numeric-ascending"
            >
              <template #append-inner>
                <v-icon 
                  v-if="localForm.orden && orderIsValid" 
                  color="success" 
                  size="small"
                >
                  mdi-check-circle
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <SmartDatePicker
              v-model="localForm.fecha_inicio"
              label="Fecha de Inicio (Opcional)"
              variant="outlined"
              prepend-inner-icon="mdi-calendar-start"
              hint="Fecha opcional de inicio de la fase"
              persistent-hint
              :max-date="localForm.fecha_fin || projectEndDate"
              :min-date="projectStartDate"
              clearable
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <SmartDatePicker
              v-model="localForm.fecha_fin"
              label="Fecha de Fin (Opcional)"
              variant="outlined"
              prepend-inner-icon="mdi-calendar-end"
              hint="Fecha opcional de fin de la fase"
              persistent-hint
              :min-date="localForm.fecha_inicio || projectStartDate"
              :max-date="projectEndDate"
              clearable
            />
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
        {{ currentPhase ? 'Actualizar' : 'Crear' }}
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import SmartDatePicker from '@/components/ui/SmartDatePicker.vue';
import { VALIDATION_RULES } from '@/utils/validationRules';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  phase: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  projectStartDate: {
    type: String,
    default: null
  },
  projectEndDate: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const formRef = ref(null);
const currentPhase = computed(() => props.phase);

const localForm = ref({
  name: '',
  description: '',
  orden: 1,
  fecha_inicio: '',
  fecha_fin: ''
});

// Validaciones en tiempo real
const nameRules = computed(() => VALIDATION_RULES.phaseName);
const nameIsValid = computed(() => {
  const name = localForm.value.name;
  return name && name.length >= 3 && name.length <= 100;
});
const nameHint = computed(() => {
  const length = localForm.value.name?.length || 0;
  if (length === 0) return 'Mínimo 3 caracteres';
  if (length < 3) return `${3 - length} caracteres restantes (mínimo)`;
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

const orderRules = computed(() => [
  v => !!v || 'El orden es requerido',
  v => !v || v >= 1 || 'El orden debe ser mayor o igual a 1',
  v => !v || Number.isInteger(Number(v)) || 'El orden debe ser un número entero'
]);

const orderIsValid = computed(() => {
  const order = localForm.value.orden;
  return order && order >= 1 && Number.isInteger(Number(order));
});

const orderHint = computed(() => {
  const order = localForm.value.orden;
  if (!order) return 'Ingresa el orden de la fase';
  if (orderIsValid.value) return 'Orden válido';
  return 'Debe ser un número entero mayor o igual a 1';
});

watch(() => props.phase, (newPhase) => {
  if (newPhase) {
    localForm.value = {
      name: newPhase.name || newPhase.nombre || '',
      description: newPhase.description || newPhase.descripcion || '',
      orden: newPhase.orden || 1,
      fecha_inicio: formatDateForInput(newPhase.fecha_inicio),
      fecha_fin: formatDateForInput(newPhase.fecha_fin)
    };
  } else {
    localForm.value = {
      name: '',
      description: '',
      orden: 1,
      fecha_inicio: '',
      fecha_fin: ''
    };
  }
  if (formRef.value) {
    formRef.value.resetValidation();
  }
}, { immediate: true });

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen && formRef.value) {
    formRef.value.resetValidation();
  }
});

function formatDateForInput(date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

const handleSave = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (!valid) {
      return;
    }
  }
  emit('save', { ...localForm.value });
};
</script>

<style scoped>
.v-alert {
  border-left: 4px solid;
}
</style>
