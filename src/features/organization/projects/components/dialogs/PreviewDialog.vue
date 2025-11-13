<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Vista Previa del Proyecto"
    icon="mdi-eye"
    max-width="1000px"
  >
    <template #content>
      <ProjectCatalogPreview :project="project" />
    </template>
    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cerrar
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import ProjectCatalogPreview from '../ProjectCatalogPreview.vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  }
});

defineEmits(['update:modelValue']);
</script>

