<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Cambiar Banner"
    icon="mdi-image"
    max-width="600px"
  >
    <template #content>
      <div class="mb-4">
        <v-img
          v-if="previewUrl || bannerUrl"
          :src="previewUrl || bannerUrl"
          height="200"
          cover
          class="rounded-lg mb-4"
        ></v-img>
        <v-file-input
          v-model="bannerFile"
          label="Seleccionar imagen de banner"
          accept="image/*"
          variant="outlined"
          prepend-inner-icon="mdi-image"
          @update:model-value="handleFileSelect"
        ></v-file-input>
        <p class="text-caption text-grey mt-2">
          Recomendado: 1200x300px. Máximo 5MB
        </p>
      </div>
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
        :disabled="!previewUrl && !bannerUrl"
        @click="handleSave"
      >
        Guardar Banner
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  bannerUrl: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const bannerFile = ref(null);
const previewUrl = ref('');

function handleFileSelect(file) {
  if (!file) {
    previewUrl.value = '';
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo es demasiado grande. Máximo 5MB');
    bannerFile.value = null;
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleSave() {
  // Guardar el banner (ahora el campo existe en la entidad)
  if (previewUrl.value) {
    emit('save', previewUrl.value);
  } else if (props.bannerUrl) {
    emit('save', props.bannerUrl);
  }
  emit('update:modelValue', false);
  previewUrl.value = '';
  bannerFile.value = null;
}
</script>

