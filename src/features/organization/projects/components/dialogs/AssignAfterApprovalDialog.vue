<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Asignar Voluntario Aprobado"
    icon="mdi-account-check"
    subtitle="El voluntario ha sido aprobado. ¿Deseas asignarlo a una tarea ahora?"
    max-width="700px"
  >
    <template #content>
      <v-alert
        type="success"
        variant="tonal"
        class="mb-4"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          <div>
            <strong>{{ volunteerName }}</strong> ha sido aprobado para el proyecto.
          </div>
        </div>
      </v-alert>

      <v-form ref="formRef" @submit.prevent="handleAssign">
        <v-switch
          v-model="shouldAssign"
          label="Asignar a una tarea ahora"
          color="primary"
          class="mb-4"
          hide-details
        ></v-switch>

        <v-expand-transition>
          <div v-if="shouldAssign" class="assignment-form">
            <v-select
              v-model="localForm.selectedTaskId"
              :items="availableTasks"
              item-title="descripcion"
              item-value="id"
              label="Seleccionar Tarea"
              variant="outlined"
              :rules="shouldAssign ? [v => !!v || 'Debes seleccionar una tarea'] : []"
              class="mb-4"
              :loading="tasksLoading"
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-chip size="small" :color="getTaskStatusColor(item.raw.id_estado)" class="mr-2">
                      {{ getTaskStatusText(item.raw.id_estado) }}
                    </v-chip>
                  </template>
                  <v-list-item-title>{{ item.raw.descripcion }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Fase: {{ getPhaseName(item.raw.id_fase) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-select>
            
            <v-select
              v-model="localForm.assignedRole"
              :items="availableProjectRoles"
              item-title="label"
              item-value="value"
              label="Rol en la Tarea (Opcional)"
              variant="outlined"
              :loading="rolesLoading"
              class="mb-4"
              hint="Selecciona un rol específico para esta asignación"
              persistent-hint
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-chip size="small" :color="getRoleTypeColor(item.raw.tipo_rol)">
                      {{ getRoleTypeLabel(item.raw.tipo_rol) }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </v-expand-transition>
      </v-form>
    </template>
    
    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="handleSkip"
      >
        {{ shouldAssign ? 'Cancelar' : 'Asignar Más Tarde' }}
      </ModernButton>
      
      <ModernButton
        v-if="shouldAssign"
        color="primary"
        variant="flat"
        @click="handleAssign"
        :loading="loading"
      >
        Asignar Ahora
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
  volunteerId: {
    type: Number,
    required: true
  },
  volunteerName: {
    type: String,
    required: true
  },
  projectId: {
    type: Number,
    required: true
  },
  availableTasks: {
    type: Array,
    default: () => []
  },
  availableProjectRoles: {
    type: Array,
    default: () => []
  },
  phases: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  tasksLoading: {
    type: Boolean,
    default: false
  },
  rolesLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'assign', 'skip']);

const shouldAssign = ref(true);
const formRef = ref(null);

const localForm = ref({
  selectedTaskId: null,
  assignedRole: null
});

// Filtrar tareas disponibles (solo pendientes o en progreso)
const availableTasks = computed(() => {
  return props.availableTasks.filter(task => {
    const estado = task.id_estado || task.estado?.id_estado;
    return estado === 1 || estado === 2; // Solo pendientes o en progreso
  });
});

function getPhaseName(phaseId) {
  if (!props.phases || !phaseId) return 'Sin fase';
  const phase = props.phases.find(p => {
    const id = p.id_fase || p.id;
    return id === phaseId;
  });
  return phase ? phase.nombre : 'Sin fase';
}

function getTaskStatusColor(estadoId) {
  const statusMap = {
    1: 'warning', // Pendiente
    2: 'info', // En Progreso
    3: 'success' // Completada
  };
  return statusMap[estadoId] || 'grey';
}

function getTaskStatusText(estadoId) {
  const statusMap = {
    1: 'Pendiente',
    2: 'En Progreso',
    3: 'Completada'
  };
  return statusMap[estadoId] || 'Desconocido';
}

function getRoleTypeColor(tipoRol) {
  return tipoRol === 'proyecto' ? 'primary' : 'secondary';
}

function getRoleTypeLabel(tipoRol) {
  return tipoRol === 'proyecto' ? 'Proyecto' : 'Organización';
}

async function handleAssign() {
  if (!shouldAssign.value) {
    handleSkip();
    return;
  }

  if (!formRef.value) return;
  
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }

  emit('assign', {
    volunteerId: props.volunteerId,
    taskId: localForm.value.selectedTaskId,
    roleId: localForm.value.assignedRole
  });
}

function handleSkip() {
  emit('skip');
  emit('update:modelValue', false);
}

// Resetear formulario cuando se cierra
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    shouldAssign.value = true;
    localForm.value = {
      selectedTaskId: null,
      assignedRole: null
    };
    if (formRef.value) {
      formRef.value.resetValidation();
    }
  }
});
</script>

<style scoped>
.assignment-form {
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>

