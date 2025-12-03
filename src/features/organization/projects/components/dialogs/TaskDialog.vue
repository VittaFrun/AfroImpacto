<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isViewingTask ? 'Ver Tarea' : (isEditMode ? 'Editar Tarea' : 'Nueva Tarea')"
    :icon="isViewingTask ? 'mdi-eye' : (isEditMode ? 'mdi-pencil' : 'mdi-plus')"
    max-width="800px"
  >
    <template #content>
      <!-- Banner de modo -->
      <v-alert
        v-if="!isViewingTask"
        :type="isEditMode ? 'info' : 'success'"
        variant="tonal"
        class="mb-4"
        density="compact"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">{{ isEditMode ? 'mdi-pencil' : 'mdi-plus-circle' }}</v-icon>
          <span class="font-weight-medium">
            {{ isEditMode ? 'Estás editando una tarea existente' : 'Creando una nueva tarea' }}
          </span>
        </div>
      </v-alert>

      <v-form @submit.prevent="handleSave" v-if="!isViewingTask" ref="taskFormRef">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="localForm.description"
              :label="isEditMode ? 'Descripción de la Tarea' : '¿Qué tarea necesitas crear?'"
              :placeholder="isEditMode ? 'Describe qué se debe hacer...' : 'Ej: Revisar documentación del proyecto'"
              variant="outlined"
              required
              :rules="descriptionRules"
              :error-messages="errors?.description"
              :counter="1000"
              :hint="descriptionHint"
              persistent-hint
              autofocus
            >
              <template #append-inner>
                <v-icon 
                  v-if="localForm.description && descriptionIsValid" 
                  color="success" 
                  size="small"
                >
                  mdi-check-circle
                </v-icon>
                <v-icon 
                  v-else-if="localForm.description && !descriptionIsValid" 
                  color="error" 
                  size="small"
                >
                  mdi-alert-circle
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <SmartDatePicker
              v-model="localForm.startDate"
              label="Fecha de Inicio"
              variant="outlined"
              required
              prepend-inner-icon="mdi-calendar-start"
              :rules="startDateRules"
              :max-date="localForm.endDate || phaseEndDate || projectEndDate"
              :min-date="phaseStartDate || projectStartDate"
              :hint="startDateHint"
              persistent-hint
              auto-validate
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <SmartDatePicker
              v-model="localForm.endDate"
              label="Fecha de Fin"
              variant="outlined"
              required
              prepend-inner-icon="mdi-calendar-end"
              :rules="endDateRules"
              :min-date="localForm.startDate || phaseStartDate || projectStartDate"
              :max-date="phaseEndDate || projectEndDate"
              :hint="endDateHint"
              persistent-hint
              auto-validate
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.prioridad"
              :items="priorityOptions"
              label="Prioridad"
              variant="outlined"
              required
              prepend-inner-icon="mdi-flag"
            >
              <template #item="{ item, props: itemProps }">
                <v-list-item v-bind="itemProps">
                  <template #prepend>
                    <v-icon :color="getPriorityColorForSelect(item.value)">
                      mdi-flag
                    </v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.complejidad"
              :items="complexityOptions"
              label="Complejidad"
              variant="outlined"
              required
              prepend-inner-icon="mdi-gauge"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.id_estado"
              :items="taskStatusOptions"
              label="Estado"
              variant="outlined"
              required
              prepend-inner-icon="mdi-information"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.phaseId"
              :items="phasesOptions"
              :item-title="(item) => item.title"
              :item-value="(item) => item.value"
              label="Fase"
              variant="outlined"
              required
              :rules="[v => !!v || 'Debes seleccionar una fase']"
              prepend-inner-icon="mdi-view-list"
            >
              <template v-if="!localForm.phaseId && !isEditMode" #prepend-item>
                <v-list-item-title class="text-caption text-grey pa-2">
                  Selecciona la fase para esta tarea
                </v-list-item-title>
                <v-divider></v-divider>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-form>
    
      <!-- View Mode -->
      <div v-else-if="currentTask" class="task-view-mode">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center mb-4 flex-wrap gap-2">
              <v-chip 
                :color="getTaskStatusColor(currentTask.id_estado)" 
                size="large"
              >
                <v-icon start>{{ getTaskStatusIcon(currentTask.id_estado) }}</v-icon>
                {{ getTaskStatus(currentTask.id_estado) }}
              </v-chip>
              
              <v-chip 
                :color="getPriorityColor(currentTask.prioridad)" 
                variant="tonal"
                size="default"
              >
                <v-icon start size="16">mdi-flag</v-icon>
                {{ currentTask.prioridad }}
              </v-chip>
              
              <v-chip 
                color="info" 
                variant="tonal"
                size="default"
              >
                <v-icon start size="16">mdi-gauge</v-icon>
                {{ currentTask.complejidad }}
              </v-chip>
            </div>
            
            <h3 class="text-h6 mb-3 font-weight-bold">{{ currentTask.descripcion || currentTask.description }}</h3>
            
            <v-divider class="mb-4"></v-divider>
            
            <div class="task-details">
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-3" color="primary">mdi-calendar-range</v-icon>
                <div>
                  <div class="text-body-2 text-grey">Período</div>
                  <div class="text-body-1">{{ formatDateRange(currentTask.fecha_inicio, currentTask.fecha_fin) }}</div>
                </div>
              </div>
              
              <div class="d-flex align-center mb-3">
                <v-icon class="mr-3" color="info">mdi-view-list</v-icon>
                <div>
                  <div class="text-body-2 text-grey">Fase</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ getPhaseName(currentTask.id_fase) || 'Sin fase asignada' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <v-divider class="my-4"></v-divider>
            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-3">Comentarios</h4>
              <CommentThread
                :tipo-entidad="'tarea'"
                :id-entidad="currentTask.id_tarea"
                :auto-load="true"
                :show-form="true"
              />
            </div>
          </v-col>
        </v-row>
      </div>
    </template>
    
    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        {{ isViewingTask ? 'Cerrar' : 'Cancelar' }}
      </ModernButton>
      
      <ModernButton
        v-if="!isViewingTask"
        :color="isEditMode ? 'warning' : 'success'"
        variant="flat"
        @click="handleSave"
        :loading="loading"
        :prepend-icon="isEditMode ? 'mdi-content-save' : 'mdi-plus-circle'"
      >
        {{ isEditMode ? 'Guardar Cambios' : 'Crear Tarea' }}
      </ModernButton>
      
      <ModernButton
        v-if="isViewingTask"
        color="warning"
        variant="outlined"
        prepend-icon="mdi-pencil"
        @click="$emit('switch-to-edit')"
      >
        Editar
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import SmartDatePicker from '@/components/ui/SmartDatePicker.vue';
import CommentThread from '@/features/comments/components/CommentThread.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  },
  phases: {
    type: Array,
    default: () => []
  },
  priorityOptions: {
    type: Array,
    default: () => ['Baja', 'Media', 'Alta', 'Urgente']
  },
  complexityOptions: {
    type: Array,
    default: () => ['Baja', 'Media', 'Alta']
  },
  taskStatusOptions: {
    type: Array,
    default: () => []
  },
  isViewingTask: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  getTaskStatusColor: {
    type: Function,
    required: true
  },
  getTaskStatusIcon: {
    type: Function,
    required: true
  },
  getTaskStatus: {
    type: Function,
    required: true
  },
  getPriorityColor: {
    type: Function,
    required: true
  },
  formatDateRange: {
    type: Function,
    required: true
  },
  getPhaseName: {
    type: Function,
    required: true
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

const emit = defineEmits(['update:modelValue', 'save', 'switch-to-edit']);

const taskFormRef = ref(null);
const currentTask = computed(() => props.task);
const isEditMode = computed(() => !!currentTask.value && !props.isViewingTask);

// Validaciones en tiempo real
const descriptionRules = computed(() => [
  v => !!v || 'La descripción es requerida',
  v => !v || v.length >= 10 || 'La descripción debe tener al menos 10 caracteres',
  v => !v || v.length <= 1000 || 'La descripción no puede exceder 1000 caracteres'
]);

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

const startDateRules = computed(() => [
  v => !!v || 'La fecha de inicio es requerida',
  v => {
    if (!v || !localForm.value.endDate) return true;
    return new Date(v) <= new Date(localForm.value.endDate) || 'La fecha de inicio debe ser anterior a la fecha de fin';
  }
]);

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

const endDateRules = computed(() => [
  v => !!v || 'La fecha de fin es requerida',
  v => {
    if (!v || !localForm.value.startDate) return true;
    return new Date(v) >= new Date(localForm.value.startDate) || 'La fecha de fin debe ser posterior a la fecha de inicio';
  }
]);

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

const localForm = ref({
  description: '',
  startDate: '',
  endDate: '',
  prioridad: 'Media',
  complejidad: 'Media',
  id_estado: 1,
  phaseId: null
});

// Opciones de fases con manejo correcto de IDs
const phasesOptions = computed(() => {
  if (!props.phases || props.phases.length === 0) return [];
  
  return props.phases.map(phase => ({
    title: phase.name || phase.nombre || 'Sin nombre',
    value: phase.id_fase || phase.id, // Soporta ambos formatos
    phase: phase
  }));
});

// Fechas de la fase seleccionada para validación
const selectedPhase = computed(() => {
  if (!localForm.value.phaseId || !props.phases) return null;
  return props.phases.find(p => (p.id_fase || p.id) === localForm.value.phaseId);
});

const phaseStartDate = computed(() => {
  return selectedPhase.value?.fecha_inicio || null;
});

const phaseEndDate = computed(() => {
  return selectedPhase.value?.fecha_fin || null;
});

watch(() => props.task, (newTask, oldTask) => {
  // Solo actualizar si realmente cambió la tarea o si es la primera vez
  if (newTask) {
    // MODO EDICIÓN: Hay una tarea
    const phaseId = newTask.id_fase || newTask.fase?.id_fase || newTask.fase?.id || null;
    localForm.value = {
      description: newTask.descripcion || '',
      startDate: formatDateForInput(newTask.fecha_inicio),
      endDate: formatDateForInput(newTask.fecha_fin),
      prioridad: newTask.prioridad || 'Media',
      complejidad: newTask.complejidad || 'Media',
      id_estado: newTask.id_estado || 1,
      phaseId: phaseId
    };
  } else if (!newTask && oldTask !== undefined) {
    // MODO CREACIÓN: Cambió de tarea a null (solo si había una tarea antes)
    resetForm();
  } else if (!newTask && oldTask === undefined) {
    // Primera carga sin tarea - modo creación
    resetForm();
  }
}, { immediate: true });

// Watch para resetear cuando se abre/cierra el modal
watch(() => props.modelValue, (isOpen, wasOpen) => {
  if (isOpen && !wasOpen) {
    // Modal se acaba de abrir
    if (!props.task) {
      // MODO CREACIÓN: No hay tarea, resetear formulario completamente
      resetForm();
    }
    // Si hay task, el watch anterior ya lo maneja
  } else if (!isOpen && wasOpen) {
    // Modal se cerró - limpiar validación
    if (taskFormRef.value) {
      taskFormRef.value.resetValidation();
    }
  }
});

function resetForm() {
  // Obtener phaseId válido de las props o de la primera fase
  let defaultPhaseId = null;
  if (props.phases && props.phases.length > 0) {
    const firstPhase = props.phases[0];
    defaultPhaseId = firstPhase.id_fase || firstPhase.id || null;
  }
  
  // Resetear completamente el formulario para modo creación
  localForm.value = {
    description: '',
    startDate: '',
    endDate: '',
    prioridad: 'Media',
    complejidad: 'Media',
    id_estado: 1,
    phaseId: defaultPhaseId
  };
  
  // Limpiar validación del formulario
  if (taskFormRef.value) {
    taskFormRef.value.resetValidation();
  }
}

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

function getPriorityColorForSelect(priority) {
  return props.getPriorityColor(priority);
}

const handleSave = async () => {
  // Validar formulario
  if (taskFormRef.value) {
    const { valid } = await taskFormRef.value.validate();
    if (!valid) {
      return;
    }
  }

  // Validar phaseId
  if (!localForm.value.phaseId) {
    console.error('Error: phaseId no está definido');
    return;
  }

  // Asegurar que phaseId sea un número
  const phaseId = typeof localForm.value.phaseId === 'number' 
    ? localForm.value.phaseId 
    : parseInt(localForm.value.phaseId);

  if (isNaN(phaseId)) {
    console.error('Error: phaseId no es un número válido', localForm.value.phaseId);
    return;
  }

  emit('save', { 
    ...localForm.value,
    phaseId: phaseId
  });
};
</script>

<style scoped>
.task-view-mode {
  padding: 8px 0;
}

.task-details {
  padding: 16px 0;
}

/* Mejoras visuales para el formulario */
:deep(.v-field__prepend-inner) {
  padding-right: 8px;
}

/* Estilo para el banner de modo */
.v-alert {
  border-left: 4px solid;
}

.v-alert--type-info {
  border-left-color: rgb(var(--v-theme-info));
}

.v-alert--type-success {
  border-left-color: rgb(var(--v-theme-success));
}

/* Mejorar contraste en campos de fecha */
:deep(.v-field__input input[type="date"]) {
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Estilo para el select de fase cuando está vacío */
:deep(.v-select__selection) {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>

