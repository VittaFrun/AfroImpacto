<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="currentPhase ? 'Editar Fase' : 'Nueva Fase'"
    :icon="currentPhase ? 'mdi-pencil' : 'mdi-plus'"
    max-width="600px"
  >
    <template #content>
      <v-form @submit.prevent="handleSave">
        <v-text-field
          v-model="localForm.name"
          label="Nombre de la Fase"
          placeholder="Ej: Planificación, Ejecución, Evaluación..."
          variant="outlined"
          required
          :rules="[
            v => !!v || 'El nombre es requerido',
            v => !v || v.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
            v => !v || v.length <= 100 || 'El nombre no puede exceder 100 caracteres'
          ]"
          :error-messages="errors?.name"
          class="mb-4"
        ></v-text-field>
        
        <v-textarea
          v-model="localForm.description"
          label="Descripción"
          placeholder="Describe los objetivos y actividades de esta fase..."
          variant="outlined"
          rows="4"
          class="mb-4"
        ></v-textarea>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="localForm.orden"
              label="Orden"
              type="number"
              variant="outlined"
              min="1"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="localForm.fecha_inicio"
              label="Fecha de Inicio"
              type="date"
              variant="outlined"
            ></v-text-field>
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
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const currentPhase = computed(() => props.phase);
const localForm = ref({
  name: '',
  description: '',
  orden: 1,
  fecha_inicio: ''
});

watch(() => props.phase, (newPhase) => {
  if (newPhase) {
    localForm.value = {
      name: newPhase.name || newPhase.nombre || '',
      description: newPhase.description || newPhase.descripcion || '',
      orden: newPhase.orden || 1,
      fecha_inicio: newPhase.fecha_inicio || ''
    };
  } else {
    localForm.value = {
      name: '',
      description: '',
      orden: 1,
      fecha_inicio: ''
    };
  }
}, { immediate: true });

const handleSave = () => {
  emit('save', { ...localForm.value });
};
</script>

