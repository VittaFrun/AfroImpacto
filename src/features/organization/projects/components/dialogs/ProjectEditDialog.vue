<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Editar Proyecto"
    icon="mdi-pencil"
    max-width="1000px"
  >
    <template #content>
      <v-form @submit.prevent="handleSave" ref="formRef">
        <!-- Sección 1: Información Básica -->
        <v-card variant="outlined" class="mb-4" rounded="lg">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon class="mr-2" color="primary">mdi-information</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Información Básica</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="localForm.name"
                  label="Nombre del Proyecto"
                  variant="outlined"
                  required
                  :rules="nameRules"
                  :error-messages="errors?.name"
                  :counter="100"
                  :hint="nameHint"
                  persistent-hint
                  prepend-inner-icon="mdi-format-title"
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
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="localForm.location"
                  label="Ubicación"
                  variant="outlined"
                  required
                  :rules="locationRules"
                  :error-messages="errors?.location"
                  prepend-inner-icon="mdi-map-marker"
                >
                  <template #append-inner>
                    <v-icon 
                      v-if="localForm.location && locationIsValid" 
                      color="success" 
                      size="small"
                    >
                      mdi-check-circle
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="localForm.description"
                  label="Descripción del Proyecto"
                  variant="outlined"
                  rows="3"
                  required
                  :rules="descriptionRules"
                  :error-messages="errors?.description"
                  :counter="1000"
                  :hint="descriptionHint"
                  persistent-hint
                  prepend-inner-icon="mdi-text"
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
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="localForm.objective"
                  label="Objetivo Principal"
                  variant="outlined"
                  rows="2"
                  required
                  :rules="objectiveRules"
                  :error-messages="errors?.objective"
                  :counter="500"
                  :hint="objectiveHint"
                  persistent-hint
                  prepend-inner-icon="mdi-target"
                >
                  <template #append-inner>
                    <v-icon 
                      v-if="localForm.objective && objectiveIsValid" 
                      color="success" 
                      size="small"
                    >
                      mdi-check-circle
                    </v-icon>
                  </template>
                </v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Sección 2: Fechas y Presupuesto -->
        <v-card variant="outlined" class="mb-4" rounded="lg">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon class="mr-2" color="primary">mdi-calendar-clock</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Fechas y Presupuesto</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="localForm.startDate"
                  label="Fecha de Inicio"
                  type="date"
                  variant="outlined"
                  required
                  :rules="startDateRules"
                  :error-messages="errors?.startDate || errors?.dates"
                  :max="localForm.endDate || undefined"
                  :hint="startDateHint"
                  persistent-hint
                  prepend-inner-icon="mdi-calendar-start"
                >
                  <template #append-inner>
                    <v-icon 
                      v-if="localForm.startDate && startDateIsValid" 
                      color="success" 
                      size="small"
                    >
                      mdi-check-circle
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="localForm.endDate"
                  label="Fecha de Fin"
                  type="date"
                  variant="outlined"
                  required
                  :rules="endDateRules"
                  :error-messages="errors?.endDate || errors?.dates"
                  :min="localForm.startDate || undefined"
                  :hint="endDateHint"
                  persistent-hint
                  prepend-inner-icon="mdi-calendar-end"
                >
                  <template #append-inner>
                    <v-icon 
                      v-if="localForm.endDate && endDateIsValid" 
                      color="success" 
                      size="small"
                    >
                      mdi-check-circle
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="localForm.budget"
                  label="Presupuesto Total"
                  type="number"
                  variant="outlined"
                  prefix="$"
                  suffix="COP"
                  required
                  :rules="budgetRules"
                  :hint="budgetHint"
                  persistent-hint
                  prepend-inner-icon="mdi-cash"
                >
                  <template #append-inner>
                    <v-icon 
                      v-if="localForm.budget && budgetIsValid" 
                      color="success" 
                      size="small"
                    >
                      mdi-check-circle
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Sección 3: Configuración y Estado -->
        <v-card variant="outlined" class="mb-4" rounded="lg">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon class="mr-2" color="primary">mdi-cog</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Configuración y Estado</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="localForm.id_estado"
                  :items="projectStatusOptions"
                  label="Estado del Proyecto"
                  variant="outlined"
                  required
                  hint="Estado actual del proyecto"
                  persistent-hint
                  prepend-inner-icon="mdi-information"
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card variant="tonal" :color="localForm.es_publico ? 'success' : 'grey'" class="pa-3">
                  <v-switch
                    v-model="localForm.es_publico"
                    label="Visible en Catálogo de Voluntarios"
                    :color="localForm.es_publico ? 'success' : 'grey'"
                    hint="Si está activo, el proyecto aparecerá en el catálogo público para voluntarios"
                    persistent-hint
                    class="mb-0"
                  >
                    <template #prepend>
                      <v-icon :color="localForm.es_publico ? 'success' : 'grey'">
                        {{ localForm.es_publico ? 'mdi-eye' : 'mdi-eye-off' }}
                      </v-icon>
                    </template>
                  </v-switch>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Sección 4: Requisitos -->
        <v-card variant="outlined" class="mb-4" rounded="lg">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon class="mr-2" color="primary">mdi-format-list-checkbox</v-icon>
            <span class="text-subtitle-1 font-weight-bold">Requisitos para Participar</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-textarea
              v-model="localForm.requisitos"
              label="Requisitos"
              placeholder="Lista los requisitos para participar en este proyecto (ej: Ser mayor de 18 años, Disponibilidad de tiempo, Compromiso con la causa, etc.)"
              variant="outlined"
              rows="4"
              hint="Separa cada requisito con un salto de línea o viñetas"
              persistent-hint
              prepend-inner-icon="mdi-format-list-bulleted"
            ></v-textarea>
          </v-card-text>
        </v-card>
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
        Guardar Cambios
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import { VALIDATION_RULES, createDateRangeRules, createStartDateRules } from '@/utils/validationRules';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  },
  projectStatusOptions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const formRef = ref(null);

const localForm = ref({
  name: '',
  description: '',
  objective: '',
  location: '',
  startDate: '',
  endDate: '',
  budget: 0,
  id_estado: 2,
  es_publico: false,
  requisitos: ''
});

// Validaciones en tiempo real
const nameRules = computed(() => VALIDATION_RULES.projectName);
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

const locationRules = computed(() => VALIDATION_RULES.location);
const locationIsValid = computed(() => {
  const location = localForm.value.location;
  return location && location.length >= 3 && location.length <= 100;
});

const descriptionRules = computed(() => VALIDATION_RULES.description);
const descriptionIsValid = computed(() => {
  const desc = localForm.value.description;
  return desc && desc.length >= 10 && desc.length <= 1000;
});
const descriptionHint = computed(() => {
  const length = localForm.value.description?.length || 0;
  if (length === 0) return 'Mínimo 10 caracteres';
  if (length < 10) return `${10 - length} caracteres restantes (mínimo)`;
  if (length > 1000) return 'Excede el límite de 1000 caracteres';
  return `${length}/1000 caracteres`;
});

const objectiveRules = computed(() => VALIDATION_RULES.objective);
const objectiveIsValid = computed(() => {
  const obj = localForm.value.objective;
  return obj && obj.length >= 10 && obj.length <= 500;
});
const objectiveHint = computed(() => {
  const length = localForm.value.objective?.length || 0;
  if (length === 0) return 'Mínimo 10 caracteres';
  if (length < 10) return `${10 - length} caracteres restantes (mínimo)`;
  if (length > 500) return 'Excede el límite de 500 caracteres';
  return `${length}/500 caracteres`;
});

const startDateRules = computed(() => createStartDateRules(computed(() => localForm.value.endDate)));
const startDateIsValid = computed(() => {
  if (!localForm.value.startDate) return false;
  if (!localForm.value.endDate) return true;
  return new Date(localForm.value.startDate) <= new Date(localForm.value.endDate);
});
const startDateHint = computed(() => {
  if (!localForm.value.startDate) return 'Selecciona la fecha de inicio';
  if (startDateIsValid.value) return 'Fecha válida';
  return 'Debe ser anterior a la fecha de fin';
});

const endDateRules = computed(() => createDateRangeRules(computed(() => localForm.value.startDate)));
const endDateIsValid = computed(() => {
  if (!localForm.value.endDate) return false;
  if (!localForm.value.startDate) return true;
  return new Date(localForm.value.endDate) >= new Date(localForm.value.startDate);
});
const endDateHint = computed(() => {
  if (!localForm.value.endDate) return 'Selecciona la fecha de fin';
  if (endDateIsValid.value) return 'Fecha válida';
  return 'Debe ser posterior a la fecha de inicio';
});

const budgetRules = computed(() => VALIDATION_RULES.budget);
const budgetIsValid = computed(() => {
  const budget = parseFloat(localForm.value.budget || 0);
  return budget > 0;
});
const budgetHint = computed(() => {
  const budget = parseFloat(localForm.value.budget || 0);
  if (budget === 0) return 'Ingresa el presupuesto del proyecto';
  if (budget > 0) return 'Presupuesto válido';
  return 'El presupuesto debe ser mayor a 0';
});

watch(() => props.project, (newProject) => {
  if (newProject) {
    localForm.value = {
      name: newProject.name || newProject.nombre || '',
      description: newProject.description || newProject.descripcion || '',
      objective: newProject.objective || newProject.objetivo || '',
      location: newProject.location || newProject.ubicacion || '',
      startDate: formatDateForInput(newProject.startDate || newProject.fecha_inicio),
      endDate: formatDateForInput(newProject.endDate || newProject.fecha_fin),
      budget: newProject.budget || newProject.presupuesto || 0,
      id_estado: newProject.id_estado || 2,
      es_publico: newProject.es_publico !== undefined ? newProject.es_publico : false,
      requisitos: newProject.requisitos || ''
    };
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
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.v-card-title {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
}

.v-card-title .text-subtitle-1 {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>
