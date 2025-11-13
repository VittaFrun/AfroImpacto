<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="title"
    icon="mdi-alert"
    max-width="500px"
  >
    <template #content>
      <div class="text-center py-4">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <p class="text-body-1 mb-2">{{ message }}</p>
        <p v-if="subMessage" class="text-body-2 text-grey">{{ subMessage }}</p>
      </div>
    </template>
    
    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
        :disabled="loading"
      >
        Cancelar
      </ModernButton>
      
      <ModernButton
        color="error"
        variant="flat"
        @click="$emit('confirm')"
        :loading="loading"
        :disabled="disabled"
      >
        {{ confirmText }}
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmar Eliminación'
  },
  message: {
    type: String,
    required: true
  },
  subMessage: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Eliminar'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue', 'confirm']);
</script>

