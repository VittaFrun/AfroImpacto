<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isViewingTask ? 'Ver Tarea' : (currentTask ? 'Editar Tarea' : 'Nueva Tarea')"
    :icon="isViewingTask ? 'mdi-eye' : (currentTask ? 'mdi-pencil' : 'mdi-plus')"
    max-width="700px"
  >
    <template #content>
      <v-form @submit.prevent="handleSave" v-if="!isViewingTask">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="localForm.description"
              label="Descripción de la Tarea"
              placeholder="Describe qué se debe hacer..."
              variant="outlined"
              required
              :rules="[
                v => !!v || 'La descripción es requerida',
                v => !v || v.length >= 10 || 'La descripción debe tener al menos 10 caracteres',
                v => !v || v.length <= 1000 || 'La descripción no puede exceder 1000 caracteres'
              ]"
              :error-messages="errors?.description"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="localForm.startDate"
              label="Fecha de Inicio"
              type="date"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="localForm.endDate"
              label="Fecha de Fin"
              type="date"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.prioridad"
              :items="priorityOptions"
              label="Prioridad"
              variant="outlined"
              required
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.complejidad"
              :items="complexityOptions"
              label="Complejidad"
              variant="outlined"
              required
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.id_estado"
              :items="taskStatusOptions"
              label="Estado"
              variant="outlined"
              required
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.phaseId"
              :items="phases"
              :item-title="(phase) => phase.name || phase.nombre"
              item-value="id"
              label="Fase"
              variant="outlined"
              required
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
    
      <!-- View Mode -->
      <div v-else-if="currentTask" class="task-view-mode">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center mb-4">
              <v-chip 
                :color="getTaskStatusColor(currentTask.id_estado)" 
                size="large"
                class="mr-3"
              >
                <v-icon start>{{ getTaskStatusIcon(currentTask.id_estado) }}</v-icon>
                {{ getTaskStatus(currentTask.id_estado) }}
              </v-chip>
              
              <v-chip 
                :color="getPriorityColor(currentTask.prioridad)" 
                variant="tonal"
                class="mr-3"
              >
                {{ currentTask.prioridad }}
              </v-chip>
              
              <v-chip 
                color="info" 
                variant="tonal"
              >
                {{ currentTask.complejidad }}
              </v-chip>
            </div>
            
            <h3 class="text-h6 mb-3">{{ currentTask.descripcion }}</h3>
            
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
                  <div class="text-body-1">{{ getPhaseName(currentTask.id_fase) }}</div>
                </div>
              </div>
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
        color="primary"
        variant="flat"
        @click="handleSave"
        :loading="loading"
      >
        {{ currentTask ? 'Actualizar' : 'Crear' }}
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
  }
});

const emit = defineEmits(['update:modelValue', 'save', 'switch-to-edit']);

const currentTask = computed(() => props.task);
const localForm = ref({
  description: '',
  startDate: '',
  endDate: '',
  prioridad: 'Media',
  complejidad: 'Media',
  id_estado: 1,
  phaseId: null
});

watch(() => props.task, (newTask) => {
  if (newTask) {
    localForm.value = {
      description: newTask.descripcion || '',
      startDate: newTask.fecha_inicio || '',
      endDate: newTask.fecha_fin || '',
      prioridad: newTask.prioridad || 'Media',
      complejidad: newTask.complejidad || 'Media',
      id_estado: newTask.id_estado || 1,
      phaseId: newTask.id_fase || null
    };
  } else {
    localForm.value = {
      description: '',
      startDate: '',
      endDate: '',
      prioridad: 'Media',
      complejidad: 'Media',
      id_estado: 1,
      phaseId: props.phases?.length > 0 ? props.phases[0].id : null
    };
  }
}, { immediate: true });

const handleSave = () => {
  emit('save', { ...localForm.value });
};
</script>

<style scoped>
.task-view-mode {
  padding: 8px 0;
}

.task-details {
  padding: 16px 0;
}
</style>

