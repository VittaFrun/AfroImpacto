<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Asignar Voluntario"
    icon="mdi-account-plus"
    max-width="600px"
  >
    <template #content>
      <v-form @submit.prevent="handleSave">
        <v-select
          v-model="localForm.selectedTaskId"
          :items="tasks"
          item-title="descripcion"
          item-value="id"
          label="Seleccionar Tarea"
          variant="outlined"
          required
          class="mb-4"
        ></v-select>
        
        <v-select
          v-model="localForm.selectedVolunteerId"
          :items="availableVolunteers"
          item-title="name"
          item-value="id_voluntario"
          label="Seleccionar Voluntario"
          variant="outlined"
          required
          class="mb-4"
        ></v-select>
        
        <v-select
          v-model="localForm.assignedRole"
          :items="availableProjectRoles"
          item-title="label"
          item-value="value"
          label="Rol Asignado"
          variant="outlined"
          required
          :loading="rolesLoading"
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
          label="Notas de Asignación"
          placeholder="Instrucciones especiales o comentarios..."
          variant="outlined"
          rows="3"
        ></v-textarea>
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
      >
        Asignar
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
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const localForm = ref({
  selectedTaskId: null,
  selectedVolunteerId: null,
  assignedRole: null,
  assignmentNotes: ''
});

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    // Reset form when dialog closes
    localForm.value = {
      selectedTaskId: null,
      selectedVolunteerId: null,
      assignedRole: null,
      assignmentNotes: ''
    };
  }
});

const handleSave = () => {
  emit('save', { ...localForm.value });
};
</script>

