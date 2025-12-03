<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Asignación Masiva de Voluntarios"
    icon="mdi-account-multiple-plus"
    max-width="900px"
  >
    <template #content>
      <v-alert
        type="info"
        variant="tonal"
        class="mb-4"
        density="compact"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-information</v-icon>
          <span>Asigna múltiples voluntarios a una o varias tareas a la vez</span>
        </div>
      </v-alert>

      <v-form @submit.prevent="handleSave" ref="formRef">
        <!-- Modo de asignación -->
        <v-card variant="outlined" class="mb-4" rounded="lg">
          <v-card-title class="d-flex align-center pa-3">
            <v-icon class="mr-2" size="20">mdi-cog</v-icon>
            <span class="text-subtitle-2 font-weight-bold">Modo de Asignación</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-3">
            <v-radio-group v-model="assignmentMode" inline hide-details>
              <v-radio
                label="Una tarea, múltiples voluntarios"
                value="one-task-many-volunteers"
                color="primary"
              >
                <template #label>
                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2">mdi-format-list-bulleted</v-icon>
                    <span>Una tarea, múltiples voluntarios</span>
                  </div>
                </template>
              </v-radio>
              <v-radio
                label="Múltiples tareas, un voluntario"
                value="many-tasks-one-volunteer"
                color="primary"
              >
                <template #label>
                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2">mdi-account-multiple</v-icon>
                    <span>Múltiples tareas, un voluntario</span>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- Modo 1: Una tarea, múltiples voluntarios -->
        <v-expand-transition>
          <v-card v-if="assignmentMode === 'one-task-many-volunteers'" variant="outlined" class="mb-4" rounded="lg">
            <v-card-title class="d-flex align-center pa-3">
              <v-icon class="mr-2" size="20" color="primary">mdi-format-list-bulleted</v-icon>
              <span class="text-subtitle-2 font-weight-bold">Seleccionar Tarea</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-select
                v-model="localForm.selectedTaskId"
                :items="tasks"
                item-title="descripcion"
                item-value="id"
                label="Tarea"
                variant="outlined"
                required
                :rules="[v => !!v || 'Debes seleccionar una tarea']"
                prepend-inner-icon="mdi-format-list-checks"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-chip size="small" :color="getTaskStatusColor(item.raw.id_estado)" class="mr-2">
                        {{ getTaskStatus(item.raw.id_estado) }}
                      </v-chip>
                    </template>
                    <v-list-item-title>{{ item.raw.descripcion }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Fase: {{ getPhaseName(item.raw.id_fase) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>

              <div class="mt-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="text-subtitle-2 font-weight-bold">Seleccionar Voluntarios</span>
                  <v-chip size="small" color="primary" variant="tonal">
                    {{ selectedVolunteers.length }} seleccionado(s)
                  </v-chip>
                </div>
                <v-text-field
                  v-model="volunteerSearch"
                  placeholder="Buscar voluntarios..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                  hide-details
                  class="mb-3"
                ></v-text-field>
                <v-card variant="outlined" class="volunteers-list" style="max-height: 300px; overflow-y: auto;">
                  <v-list>
                    <v-list-item
                      v-for="volunteer in filteredVolunteers"
                      :key="volunteer.id_voluntario"
                      @click="toggleVolunteerSelection(volunteer.id_voluntario)"
                      :class="{ 'selected-item': isVolunteerSelected(volunteer.id_voluntario) }"
                    >
                      <template #prepend>
                        <v-checkbox
                          :model-value="isVolunteerSelected(volunteer.id_voluntario)"
                          @update:model-value="toggleVolunteerSelection(volunteer.id_voluntario)"
                          color="primary"
                          hide-details
                          @click.stop
                        ></v-checkbox>
                      </template>
                      <v-list-item-title>{{ volunteer.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ volunteer.email || '' }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Modo 2: Múltiples tareas, un voluntario -->
        <v-expand-transition>
          <v-card v-if="assignmentMode === 'many-tasks-one-volunteer'" variant="outlined" class="mb-4" rounded="lg">
            <v-card-title class="d-flex align-center pa-3">
              <v-icon class="mr-2" size="20" color="primary">mdi-account-multiple</v-icon>
              <span class="text-subtitle-2 font-weight-bold">Seleccionar Voluntario</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-select
                v-model="localForm.selectedVolunteerId"
                :items="availableVolunteers"
                item-title="name"
                item-value="id_voluntario"
                label="Voluntario"
                variant="outlined"
                required
                :rules="[v => !!v || 'Debes seleccionar un voluntario']"
                prepend-inner-icon="mdi-account"
              ></v-select>

              <div class="mt-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="text-subtitle-2 font-weight-bold">Seleccionar Tareas</span>
                  <v-chip size="small" color="primary" variant="tonal">
                    {{ selectedTasks.length }} seleccionada(s)
                  </v-chip>
                </div>
                <v-text-field
                  v-model="taskSearch"
                  placeholder="Buscar tareas..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                  hide-details
                  class="mb-3"
                ></v-text-field>
                <v-card variant="outlined" class="tasks-list" style="max-height: 300px; overflow-y: auto;">
                  <v-list>
                    <v-list-item
                      v-for="task in filteredTasks"
                      :key="task.id"
                      @click="toggleTaskSelection(task.id)"
                      :class="{ 'selected-item': isTaskSelected(task.id) }"
                    >
                      <template #prepend>
                        <v-checkbox
                          :model-value="isTaskSelected(task.id)"
                          @update:model-value="toggleTaskSelection(task.id)"
                          color="primary"
                          hide-details
                          @click.stop
                        ></v-checkbox>
                      </template>
                      <v-list-item-title>{{ task.descripcion }}</v-list-item-title>
                      <v-list-item-subtitle>
                        Fase: {{ getPhaseName(task.id_fase) }} • 
                        <v-chip size="x-small" :color="getTaskStatusColor(task.id_estado)" variant="tonal">
                          {{ getTaskStatus(task.id_estado) }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Rol y Notas (común para ambos modos) -->
        <v-card variant="outlined" class="mb-4" rounded="lg">
          <v-card-title class="d-flex align-center pa-3">
            <v-icon class="mr-2" size="20" color="primary">mdi-account-tie</v-icon>
            <span class="text-subtitle-2 font-weight-bold">Rol y Notas</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-select
              v-model="localForm.assignedRole"
              :items="availableProjectRoles"
              item-title="label"
              item-value="value"
              label="Rol Asignado"
              variant="outlined"
              required
              :rules="[v => !!v || 'Debes seleccionar un rol']"
              :loading="rolesLoading"
              prepend-inner-icon="mdi-account-tie"
              class="mb-4"
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
            
            <v-textarea
              v-model="localForm.assignmentNotes"
              label="Notas de Asignación (Opcional)"
              placeholder="Instrucciones especiales o comentarios para todas las asignaciones..."
              variant="outlined"
              rows="3"
              prepend-inner-icon="mdi-note-text"
            ></v-textarea>
          </v-card-text>
        </v-card>

        <!-- Resumen de asignaciones -->
        <v-alert
          v-if="totalAssignments > 0"
          type="success"
          variant="tonal"
          class="mb-4"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-check-circle</v-icon>
            <span class="font-weight-medium">
              Se crearán {{ totalAssignments }} asignación(es)
            </span>
          </div>
        </v-alert>
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
        :disabled="totalAssignments === 0"
        prepend-icon="mdi-account-multiple-plus"
      >
        Asignar ({{ totalAssignments }})
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  tasks: {
    type: Array,
    default: () => []
  },
  availableVolunteers: {
    type: Array,
    default: () => []
  },
  availableProjectRoles: {
    type: Array,
    default: () => []
  },
  rolesLoading: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  getRoleTypeColor: {
    type: Function,
    required: true
  },
  getRoleTypeLabel: {
    type: Function,
    required: true
  },
  getTaskStatusColor: {
    type: Function,
    required: true
  },
  getTaskStatus: {
    type: Function,
    required: true
  },
  getPhaseName: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const formRef = ref(null);
const assignmentMode = ref('one-task-many-volunteers');
const volunteerSearch = ref('');
const taskSearch = ref('');

const localForm = ref({
  selectedTaskId: null,
  selectedVolunteerId: null,
  assignedRole: null,
  assignmentNotes: ''
});

const selectedVolunteers = ref([]);
const selectedTasks = ref([]);

// Filtrar voluntarios por búsqueda
const filteredVolunteers = computed(() => {
  if (!volunteerSearch.value) return props.availableVolunteers;
  const query = volunteerSearch.value.toLowerCase();
  return props.availableVolunteers.filter(v => {
    const name = (v.name || '').toLowerCase();
    const email = (v.email || '').toLowerCase();
    return name.includes(query) || email.includes(query);
  });
});

// Filtrar tareas por búsqueda
const filteredTasks = computed(() => {
  if (!taskSearch.value) return props.tasks;
  const query = taskSearch.value.toLowerCase();
  return props.tasks.filter(t => {
    const desc = (t.descripcion || '').toLowerCase();
    return desc.includes(query);
  });
});

// Calcular total de asignaciones
const totalAssignments = computed(() => {
  if (assignmentMode.value === 'one-task-many-volunteers') {
    return localForm.value.selectedTaskId && selectedVolunteers.value.length > 0
      ? selectedVolunteers.value.length
      : 0;
  } else {
    return localForm.value.selectedVolunteerId && selectedTasks.value.length > 0
      ? selectedTasks.value.length
      : 0;
  }
});

function isVolunteerSelected(volunteerId) {
  return selectedVolunteers.value.includes(volunteerId);
}

function toggleVolunteerSelection(volunteerId) {
  const index = selectedVolunteers.value.indexOf(volunteerId);
  if (index > -1) {
    selectedVolunteers.value.splice(index, 1);
  } else {
    selectedVolunteers.value.push(volunteerId);
  }
}

function isTaskSelected(taskId) {
  return selectedTasks.value.includes(taskId);
}

function toggleTaskSelection(taskId) {
  const index = selectedTasks.value.indexOf(taskId);
  if (index > -1) {
    selectedTasks.value.splice(index, 1);
  } else {
    selectedTasks.value.push(taskId);
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    // Reset form when dialog closes
    localForm.value = {
      selectedTaskId: null,
      selectedVolunteerId: null,
      assignedRole: null,
      assignmentNotes: ''
    };
    selectedVolunteers.value = [];
    selectedTasks.value = [];
    assignmentMode.value = 'one-task-many-volunteers';
    volunteerSearch.value = '';
    taskSearch.value = '';
  }
});

watch(() => assignmentMode.value, () => {
  // Limpiar selecciones al cambiar de modo
  selectedVolunteers.value = [];
  selectedTasks.value = [];
  localForm.value.selectedTaskId = null;
  localForm.value.selectedVolunteerId = null;
});

const handleSave = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (!valid) {
      return;
    }
  }

  if (totalAssignments.value === 0) {
    return;
  }

  // Preparar datos según el modo
  const assignments = [];
  
  if (assignmentMode.value === 'one-task-many-volunteers') {
    // Una tarea, múltiples voluntarios
    selectedVolunteers.value.forEach(volunteerId => {
      assignments.push({
        taskId: localForm.value.selectedTaskId,
        volunteerId: volunteerId,
        roleId: localForm.value.assignedRole,
        notes: localForm.value.assignmentNotes
      });
    });
  } else {
    // Múltiples tareas, un voluntario
    selectedTasks.value.forEach(taskId => {
      assignments.push({
        taskId: taskId,
        volunteerId: localForm.value.selectedVolunteerId,
        roleId: localForm.value.assignedRole,
        notes: localForm.value.assignmentNotes
      });
    });
  }

  emit('save', { assignments, mode: assignmentMode.value });
};
</script>

<style scoped>
.volunteers-list,
.tasks-list {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.selected-item {
  background: rgba(var(--v-theme-primary), 0.05);
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.v-list-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.02);
}
</style>

