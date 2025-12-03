<template>
  <v-card class="h-100 d-flex flex-column" elevation="0" rounded="0">
    <!-- Header de conversación -->
    <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
      <div class="d-flex align-center">
        <v-avatar
          :color="conversacion.otro_usuario ? 'primary' : 'grey'"
          size="40"
          class="mr-3"
        >
          <v-icon v-if="!conversacion.otro_usuario" color="white">mdi-account</v-icon>
          <span v-else class="text-white">
            {{ getIniciales(conversacion.otro_usuario.nombre) }}
          </span>
        </v-avatar>
        <div>
          <div class="d-flex align-center">
            <span class="font-weight-medium">
              {{ conversacion.otro_usuario?.nombre || 'Usuario desconocido' }}
            </span>
            <v-icon
              v-if="isUsuarioOnline"
              size="12"
              color="success"
              class="ml-2"
            >
              mdi-circle
            </v-icon>
          </div>
          <span
            v-if="isUsuarioEscribiendo"
            class="text-caption text-primary"
          >
            escribiendo...
          </span>
          <span v-else-if="isUsuarioOnline" class="text-caption text-grey">
            en línea
          </span>
        </div>
      </div>
    </v-card-title>

    <!-- Área de mensajes -->
    <v-card-text
      ref="messagesContainer"
      class="messages-content flex-grow-1 pa-4"
      style="overflow-y: auto;"
    >
      <div v-if="loading && mensajes.length === 0" class="d-flex justify-center pa-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else-if="mensajes.length === 0" class="text-center pa-8">
        <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
        <p class="text-body-1 text-grey mt-4">No hay mensajes aún</p>
        <p class="text-body-2 text-grey">Envía el primer mensaje para comenzar</p>
      </div>

      <div v-else>
        <div
          v-for="(mensaje, index) in mensajes"
          :key="mensaje.id_mensaje"
          class="message-wrapper mb-2"
          :class="{ 'message-own': esMensajePropio(mensaje) }"
        >
          <div class="d-flex" :class="esMensajePropio(mensaje) ? 'justify-end' : 'justify-start'">
            <div
              class="message-bubble pa-3"
              :class="esMensajePropio(mensaje) ? 'message-sent' : 'message-received'"
            >
              <div v-if="mensaje.tipo === 'archivo' && mensaje.archivo_url" class="mb-2">
                <v-chip
                  :href="mensaje.archivo_url"
                  target="_blank"
                  color="primary"
                  variant="outlined"
                  size="small"
                >
                  <v-icon start>mdi-file</v-icon>
                  {{ mensaje.archivo_nombre || 'Archivo' }}
                </v-chip>
              </div>
              <div class="message-content">{{ mensaje.contenido }}</div>
              <div class="d-flex align-center justify-space-between mt-1">
                <span class="text-caption text-grey">
                  {{ formatHora(mensaje.creado_en) }}
                </span>
                <v-icon
                  v-if="esMensajePropio(mensaje) && mensaje.leido"
                  size="14"
                  color="primary"
                  class="ml-2"
                >
                  mdi-check-all
                </v-icon>
                <v-icon
                  v-else-if="esMensajePropio(mensaje)"
                  size="14"
                  color="grey"
                  class="ml-2"
                >
                  mdi-check
                </v-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>

    <!-- Input de mensaje -->
    <v-card-actions class="pa-4 border-t">
      <MessageInput
        @enviar="handleEnviar"
        @escribiendo="handleEscribiendo"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useMensajeStore } from '@/stores/mensajeStore';
import { useAuthStore } from '@/features/auth/stores/authStore';
import MessageInput from './MessageInput.vue';

const props = defineProps({
  conversacion: {
    type: Object,
    required: true,
  },
  mensajes: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['enviar-mensaje', 'cargar-mas']);

const mensajeStore = useMensajeStore();
const authStore = useAuthStore();
const messagesContainer = ref(null);

const isUsuarioOnline = computed(() => {
  if (!props.conversacion?.otro_usuario) return false;
  return mensajeStore.usuariosOnline.includes(props.conversacion.otro_usuario.id_usuario);
});

const isUsuarioEscribiendo = computed(() => {
  if (!props.conversacion?.otro_usuario) return false;
  return mensajeStore.usuariosEscribiendo[props.conversacion.otro_usuario.id_usuario];
});

const esMensajePropio = (mensaje) => {
  return mensaje.id_remitente === authStore.user?.id_usuario;
};

const getIniciales = (nombre) => {
  if (!nombre) return '?';
  const partes = nombre.split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

const formatHora = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handleEnviar = (contenido, archivo) => {
  emit('enviar-mensaje', contenido, archivo);
  scrollToBottom();
};

const handleEscribiendo = (escribiendo) => {
  if (props.conversacion?.otro_usuario) {
    mensajeStore.notificarEscribiendo(props.conversacion.otro_usuario.id_usuario, escribiendo);
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(() => props.mensajes, () => {
  scrollToBottom();
}, { deep: true });

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.messages-content {
  background-color: #f5f5f5;
}

.message-wrapper {
  max-width: 70%;
}

.message-own {
  margin-left: auto;
}

.message-bubble {
  border-radius: 16px;
  max-width: 100%;
  word-wrap: break-word;
}

.message-sent {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  border-bottom-right-radius: 4px;
}

.message-received {
  background-color: white;
  color: rgba(0, 0, 0, 0.87);
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-content {
  white-space: pre-wrap;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

