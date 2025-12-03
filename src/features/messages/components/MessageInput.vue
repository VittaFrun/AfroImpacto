<template>
  <div class="message-input-container w-100">
    <v-textarea
      v-model="mensaje"
      placeholder="Escribe un mensaje..."
      variant="outlined"
      rows="1"
      auto-grow
      hide-details
      class="message-textarea"
      @keydown.enter.exact.prevent="handleEnter"
      @keydown.enter.shift.exact="handleShiftEnter"
      @input="handleInput"
    ></v-textarea>

    <div class="d-flex align-center ml-2">
      <v-btn
        icon
        variant="text"
        size="small"
        @click="abrirSelectorArchivo"
        aria-label="Adjuntar archivo"
      >
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>

      <input
        ref="fileInput"
        type="file"
        style="display: none"
        @change="handleFileSelect"
        multiple
      />

      <v-btn
        icon
        variant="text"
        color="primary"
        :disabled="!puedeEnviar"
        @click="enviarMensaje"
        aria-label="Enviar mensaje"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['enviar', 'escribiendo']);

const mensaje = ref('');
const fileInput = ref(null);
const archivoSeleccionado = ref(null);
const escribiendoTimeout = ref(null);

const puedeEnviar = computed(() => {
  return !props.disabled && (mensaje.value.trim().length > 0 || archivoSeleccionado.value);
});

const handleEnter = () => {
  if (puedeEnviar.value) {
    enviarMensaje();
  }
};

const handleShiftEnter = () => {
  // Permitir nueva línea con Shift+Enter
  mensaje.value += '\n';
};

const handleInput = () => {
  // Notificar que el usuario está escribiendo
  if (mensaje.value.length > 0) {
    emit('escribiendo', true);
    
    clearTimeout(escribiendoTimeout.value);
    escribiendoTimeout.value = setTimeout(() => {
      emit('escribiendo', false);
    }, 2000);
  } else {
    emit('escribiendo', false);
  }
};

const abrirSelectorArchivo = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // En una implementación real, subirías el archivo primero
    // Por ahora, solo guardamos la referencia
    archivoSeleccionado.value = {
      nombre: file.name,
      tipo: file.type,
      tamaño: file.size,
      url: URL.createObjectURL(file), // Temporal, debería ser la URL del servidor
    };
  }
};

const enviarMensaje = () => {
  if (!puedeEnviar.value) return;

  const contenido = mensaje.value.trim();
  if (contenido || archivoSeleccionado.value) {
    emit('enviar', contenido, archivoSeleccionado.value);
    mensaje.value = '';
    archivoSeleccionado.value = null;
    emit('escribiendo', false);
    
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

watch(() => props.disabled, (disabled) => {
  if (disabled) {
    mensaje.value = '';
    archivoSeleccionado.value = null;
  }
});
</script>

<style scoped>
.message-input-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-textarea {
  flex: 1;
}

.message-textarea :deep(.v-field) {
  border-radius: 24px;
}
</style>

