<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Editar Proyecto"
    icon="mdi-pencil"
    max-width="800px"
  >
    <template #content>
      <v-form @submit.prevent="handleSave">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="localForm.name"
              label="Nombre del Proyecto"
              variant="outlined"
              required
              :rules="[
                v => !!v || 'El nombre es requerido',
                v => !v || v.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
                v => !v || v.length <= 100 || 'El nombre no puede exceder 100 caracteres'
              ]"
              :error-messages="errors?.name"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="localForm.location"
              label="Ubicación"
              variant="outlined"
              required
              :rules="[
                v => !!v || 'La ubicación es requerida',
                v => !v || v.length >= 3 || 'La ubicación debe tener al menos 3 caracteres'
              ]"
              :error-messages="errors?.location"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="localForm.description"
              label="Descripción"
              variant="outlined"
              rows="3"
              required
              :rules="[
                v => !!v || 'La descripción es requerida',
                v => !v || v.length >= 10 || 'La descripción debe tener al menos 10 caracteres',
                v => !v || v.length <= 1000 || 'La descripción no puede exceder 1000 caracteres'
              ]"
              :error-messages="errors?.description"
            ></v-textarea>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="localForm.objective"
              label="Objetivo"
              variant="outlined"
              rows="2"
              required
              :rules="[
                v => !!v || 'El objetivo es requerido',
                v => !v || v.length >= 10 || 'El objetivo debe tener al menos 10 caracteres',
                v => !v || v.length <= 1000 || 'El objetivo no puede exceder 1000 caracteres'
              ]"
              :error-messages="errors?.objective"
            ></v-textarea>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-text-field
              v-model="localForm.startDate"
              label="Fecha de Inicio"
              type="date"
              variant="outlined"
              required
              :rules="[v => !!v || 'La fecha de inicio es requerida']"
              :error-messages="errors?.startDate || errors?.dates"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-text-field
              v-model="localForm.endDate"
              label="Fecha de Fin"
              type="date"
              variant="outlined"
              required
              :rules="[v => !!v || 'La fecha de fin es requerida']"
              :error-messages="errors?.endDate || errors?.dates"
            ></v-text-field>
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
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="localForm.id_estado"
              :items="projectStatusOptions"
              label="Estado del Proyecto"
              variant="outlined"
              required
              hint="Estado del proyecto (Activo/Inactivo)"
              persistent-hint
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-switch
              v-model="localForm.es_publico"
              label="Visible en Catálogo de Voluntarios"
              color="success"
              hint="Si está activo, el proyecto aparecerá en el catálogo público para voluntarios"
              persistent-hint
            ></v-switch>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="localForm.requisitos"
              label="Requisitos para Participar"
              placeholder="Lista los requisitos para participar en este proyecto (ej: Ser mayor de 18 años, Disponibilidad de tiempo, Compromiso con la causa, etc.)"
              variant="outlined"
              rows="4"
              hint="Separa cada requisito con un salto de línea o viñetas"
              persistent-hint
            ></v-textarea>
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
        Guardar Cambios
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

watch(() => props.project, (newProject) => {
  if (newProject) {
    localForm.value = {
      name: newProject.name || '',
      description: newProject.description || '',
      objective: newProject.objective || '',
      location: newProject.location || '',
      startDate: newProject.startDate || '',
      endDate: newProject.endDate || '',
      budget: newProject.budget || 0,
      id_estado: newProject.id_estado || 2,
      es_publico: newProject.es_publico !== undefined ? newProject.es_publico : false,
      requisitos: newProject.requisitos || ''
    };
  }
}, { immediate: true });

const handleSave = () => {
  emit('save', { ...localForm.value });
};
</script>

