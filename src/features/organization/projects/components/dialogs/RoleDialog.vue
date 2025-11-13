<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="currentRole ? 'Editar Rol' : 'Nuevo Rol'"
    :icon="currentRole ? 'mdi-pencil' : 'mdi-plus'"
    max-width="600px"
  >
    <template #content>
      <v-form @submit.prevent="handleSave">
        <v-select
          v-model="localForm.tipo_rol"
          :items="roleTypes"
          item-title="label"
          item-value="value"
          label="Tipo de Rol"
          variant="outlined"
          required
          :disabled="!!currentRole"
          :rules="[v => !!v || 'El tipo de rol es requerido']"
          class="mb-4"
          @update:model-value="$emit('role-type-change', $event)"
        ></v-select>
        
        <v-text-field
          v-model="localForm.name"
          label="Nombre del Rol"
          variant="outlined"
          required
          :rules="[v => !!v || 'El nombre es requerido']"
          class="mb-4"
        ></v-text-field>
        
        <v-textarea
          v-model="localForm.description"
          label="Descripción"
          variant="outlined"
          rows="3"
          placeholder="Describe las responsabilidades de este rol..."
          class="mb-4"
        ></v-textarea>

        <v-switch
          v-model="localForm.activo"
          label="Rol activo"
          color="primary"
          class="mb-4"
        ></v-switch>
        
        <v-color-picker
          v-model="localForm.color"
          label="Color del Rol"
          mode="hex"
          hide-mode-switch
        ></v-color-picker>
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
        {{ currentRole ? 'Actualizar' : 'Crear' }}
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
  role: {
    type: Object,
    default: null
  },
  roleTypes: {
    type: Array,
    default: () => [
      { label: 'Rol del Sistema (Global)', value: 'sistema', disabled: true },
      { label: 'Rol de Organización (Reutilizable)', value: 'organizacion' },
      { label: 'Rol de Proyecto (Específico)', value: 'proyecto' }
    ]
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'save', 'role-type-change']);

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

watch(() => props.role, (newRole) => {
  if (newRole) {
    localForm.value = {
      id: newRole.id || newRole.id_rol,
      id_rol: newRole.id_rol || newRole.id,
      name: newRole.name || newRole.nombre || '',
      nombre: newRole.nombre || newRole.name || '',
      description: newRole.description || newRole.descripcion || '',
      descripcion: newRole.descripcion || newRole.description || '',
      tipo_rol: newRole.tipo_rol || 'sistema',
      id_organizacion: newRole.id_organizacion || null,
      id_proyecto: newRole.id_proyecto || null,
      activo: newRole.activo !== undefined ? newRole.activo : true,
      color: newRole.color || '#2196F3'
    };
  } else {
    localForm.value = {
      name: '',
      description: '',
      tipo_rol: 'proyecto',
      id_organizacion: null,
      id_proyecto: null,
      activo: true,
      color: '#2196F3'
    };
  }
}, { immediate: true });

const handleSave = () => {
  emit('save', { ...localForm.value });
};
</script>

