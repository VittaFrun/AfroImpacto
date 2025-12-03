<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="role ? 'Editar Rol' : 'Crear Rol'"
    :icon="role ? 'mdi-pencil' : 'mdi-plus'"
    max-width="600px"
  >
    <template #content>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="formData.nombre"
          label="Nombre del Rol"
          variant="outlined"
          prepend-inner-icon="mdi-shield-account"
          :rules="[v => !!v || 'El nombre es requerido']"
          class="mb-4"
        ></v-text-field>

        <v-textarea
          v-model="formData.descripcion"
          label="Descripción"
          variant="outlined"
          rows="3"
          prepend-inner-icon="mdi-text"
          hint="Describe las responsabilidades de este rol"
          persistent-hint
          class="mb-4"
        ></v-textarea>

        <v-switch
          v-model="formData.activo"
          label="Rol activo"
          color="primary"
          class="mb-4"
        ></v-switch>
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
        {{ role ? 'Actualizar' : 'Crear' }}
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
  role: {
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

const formData = ref({
  nombre: '',
  descripcion: '',
  activo: true,
  tipo_rol: 'organizacion'
});

watch(() => props.role, (newRole) => {
  if (newRole) {
    formData.value = {
      nombre: newRole.nombre || newRole.name || '',
      descripcion: newRole.descripcion || newRole.description || '',
      activo: newRole.activo !== undefined ? newRole.activo : true,
      tipo_rol: 'organizacion'
    };
  } else {
    formData.value = {
      nombre: '',
      descripcion: '',
      activo: true,
      tipo_rol: 'organizacion'
    };
  }
}, { immediate: true });

function handleSave() {
  if (!valid.value) return;
  emit('save', { ...formData.value });
  emit('update:modelValue', false);
}
</script>

