<template>
  <v-container fluid class="messages-container pa-0">
    <v-row no-gutters class="h-100">
      <!-- Lista de conversaciones -->
      <v-col cols="12" md="4" class="conversations-list">
        <v-card class="h-100" elevation="0" rounded="0">
          <v-card-title class="d-flex align-center justify-space-between pa-4">
            <h2 class="text-h5 font-weight-bold">Mensajes</h2>
            <v-btn
              icon
              variant="text"
              @click="abrirNuevoMensaje"
              aria-label="Nuevo mensaje"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <!-- Buscar conversaciones -->
          <v-card-text class="pa-4">
            <v-text-field
              v-model="searchQuery"
              placeholder="Buscar conversaciones..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Lista de conversaciones -->
          <v-list class="conversations-list-content" density="comfortable">
            <div v-if="mensajeStore.loading" class="d-flex justify-center pa-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>

            <div v-else-if="conversacionesFiltradas.length === 0" class="text-center pa-8">
              <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
              <p class="text-body-1 text-grey mt-4">No hay conversaciones</p>
            </div>

            <v-list-item
              v-for="conversacion in conversacionesFiltradas"
              :key="conversacion.id_conversacion"
              @click="seleccionarConversacion(conversacion)"
              :class="{ 'conversation-active': esConversacionActiva(conversacion) }"
              class="conversation-item"
            >
              <template v-slot:prepend>
                <v-avatar
                  :color="conversacion.otro_usuario ? 'primary' : 'grey'"
                  size="48"
                >
                  <v-icon v-if="!conversacion.otro_usuario" color="white">mdi-account</v-icon>
                  <span v-else class="text-white text-h6">
                    {{ getIniciales(conversacion.otro_usuario.nombre) }}
                  </span>
                </v-avatar>
                <v-badge
                  v-if="conversacion.mensajes_no_leidos > 0"
                  :content="conversacion.mensajes_no_leidos"
                  color="error"
                  overlap
                  class="ml-n2 mt-2"
                ></v-badge>
              </template>

              <v-list-item-title class="d-flex align-center justify-space-between">
                <span class="font-weight-medium">
                  {{ conversacion.otro_usuario?.nombre || 'Usuario desconocido' }}
                </span>
                <span class="text-caption text-grey">
                  {{ formatFecha(conversacion.fecha_ultimo_mensaje) }}
                </span>
              </v-list-item-title>

              <v-list-item-subtitle class="d-flex align-center">
                <span class="text-truncate flex-grow-1">
                  {{ conversacion.ultimo_mensaje || 'Sin mensajes' }}
                </span>
                <v-icon
                  v-if="mensajeStore.usuariosOnline.includes(conversacion.otro_usuario?.id_usuario)"
                  size="12"
                  color="success"
                  class="ml-2"
                >
                  mdi-circle
                </v-icon>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Área de mensajes -->
      <v-col cols="12" md="8" class="messages-area">
        <div v-if="!mensajeStore.conversacionActual" class="d-flex flex-column align-center justify-center h-100">
          <v-icon size="120" color="grey-lighten-1">mdi-message-text-outline</v-icon>
          <h3 class="text-h6 text-grey mt-4">Selecciona una conversación</h3>
          <p class="text-body-2 text-grey">O inicia una nueva conversación</p>
        </div>

        <ConversationView
          v-else
          :conversacion="mensajeStore.conversacionActual"
          :mensajes="mensajeStore.mensajesConversacionActual"
          :loading="mensajeStore.loading"
          @enviar-mensaje="handleEnviarMensaje"
          @cargar-mas="handleCargarMas"
        />
      </v-col>
    </v-row>

    <!-- Dialog para nuevo mensaje -->
    <NuevoMensajeDialog
      v-model="nuevoMensajeDialog"
      @seleccionar-usuario="handleSeleccionarUsuario"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useMensajeStore } from '@/stores/mensajeStore';
import ConversationView from '@/features/messages/components/ConversationView.vue';
import NuevoMensajeDialog from '@/features/messages/components/NuevoMensajeDialog.vue';

const mensajeStore = useMensajeStore();
const searchQuery = ref('');
const nuevoMensajeDialog = ref(false);

const conversacionesFiltradas = computed(() => {
  if (!searchQuery.value) {
    return mensajeStore.conversacionesOrdenadas;
  }

  const query = searchQuery.value.toLowerCase();
  return mensajeStore.conversacionesOrdenadas.filter(conv => {
    const nombre = conv.otro_usuario?.nombre || '';
    const ultimoMensaje = conv.ultimo_mensaje || '';
    return nombre.toLowerCase().includes(query) || ultimoMensaje.toLowerCase().includes(query);
  });
});

const esConversacionActiva = (conversacion) => {
  return mensajeStore.conversacionActual?.id_conversacion === conversacion.id_conversacion;
};

const seleccionarConversacion = (conversacion) => {
  mensajeStore.seleccionarConversacion(conversacion);
};

const abrirNuevoMensaje = () => {
  nuevoMensajeDialog.value = true;
};

const handleSeleccionarUsuario = (usuario) => {
  nuevoMensajeDialog.value = false;
  mensajeStore.iniciarConversacion(usuario.id_usuario).then((conv) => {
    if (conv) {
      seleccionarConversacion(conv);
    }
  });
};

const handleEnviarMensaje = async (contenido, archivo) => {
  if (!mensajeStore.conversacionActual) return;

  const otroUsuario = mensajeStore.conversacionActual.otro_usuario;
  if (!otroUsuario) return;

  try {
    await mensajeStore.enviarMensaje(
      contenido,
      otroUsuario.id_usuario,
      archivo ? 'archivo' : 'texto',
      archivo
    );
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  }
};

const handleCargarMas = () => {
  if (!mensajeStore.conversacionActual) return;

  const mensajes = mensajeStore.mensajesConversacionActual;
  if (mensajes.length > 0) {
    const primerMensaje = mensajes[0];
    mensajeStore.cargarMensajes(
      mensajeStore.conversacionActual.id_conversacion,
      50,
      new Date(primerMensaje.creado_en)
    );
  }
};

const getIniciales = (nombre) => {
  if (!nombre) return '?';
  const partes = nombre.split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const ahora = new Date();
  const diff = ahora - date;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (dias === 0) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } else if (dias === 1) {
    return 'Ayer';
  } else if (dias < 7) {
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
};

onMounted(async () => {
  await mensajeStore.inicializarSocket();
  await mensajeStore.cargarConversaciones();
});

onBeforeUnmount(() => {
  // El socket se mantiene conectado para recibir mensajes
});
</script>

<style scoped>
.messages-container {
  height: calc(100vh - 64px);
  overflow: hidden;
}

.conversations-list {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100%;
  overflow: hidden;
}

.conversations-list-content {
  height: calc(100% - 200px);
  overflow-y: auto;
}

.conversation-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.conversation-active {
  background-color: rgba(var(--v-theme-primary-rgb), 0.08);
}

.messages-area {
  height: 100%;
  overflow: hidden;
}

@media (max-width: 960px) {
  .conversations-list {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>

