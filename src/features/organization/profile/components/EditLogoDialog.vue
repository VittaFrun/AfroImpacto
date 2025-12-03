<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Cambiar Logo"
    icon="mdi-image"
    max-width="500px"
  >
    <template #content>
      <div class="mb-4">
        <div class="text-center mb-4">
          <v-avatar
            :size="previewSize"
            class="mb-4"
            :style="{ borderColor: organization?.color_primario || '#1976D2' }"
          >
            <v-img
              v-if="previewUrl || logoUrl"
              :src="previewUrl || logoUrl"
              :alt="organization?.nombre"
            />
            <v-icon v-else size="64" color="grey">mdi-domain</v-icon>
          </v-avatar>
        </div>
        <v-file-input
          v-model="logoFile"
          label="Seleccionar imagen de logo"
          accept="image/*"
          variant="outlined"
          prepend-inner-icon="mdi-image"
          @update:model-value="handleFileSelect"
        ></v-file-input>
        <p class="text-caption text-grey mt-2">
          Recomendado: 300x300px, formato PNG o JPG. Máximo 2MB
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
        v-if="logoUrl || previewUrl"
        color="error"
        variant="outlined"
        prepend-icon="mdi-delete"
        @click="handleRemove"
      >
        Eliminar
      </ModernButton>
      <ModernButton
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="!previewUrl && !logoUrl"
        @click="handleSave"
      >
        Guardar Logo
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  logoUrl: {
    type: String,
    default: ''
  },
  organization: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'save', 'remove']);

const logoFile = ref(null);
const previewUrl = ref('');
const previewSize = computed(() => 150);

function handleFileSelect(file) {
  if (!file) {
    previewUrl.value = '';
    return;
  }
  
  if (file.size > 2 * 1024 * 1024) {
    alert('El archivo es demasiado grande. Máximo 2MB');
    logoFile.value = null;
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleSave() {
  if (previewUrl.value) {
    emit('save', previewUrl.value);
  } else if (props.logoUrl) {
    emit('save', props.logoUrl);
  }
  emit('update:modelValue', false);
  previewUrl.value = '';
  logoFile.value = null;
}

function handleRemove() {
  emit('remove');
  emit('update:modelValue', false);
  previewUrl.value = '';
  logoFile.value = null;
}
</script>

