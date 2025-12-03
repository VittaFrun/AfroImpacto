<template>
  <div class="comment-item" :class="{ 'comment-reply': comment.id_comentario_padre }">
    <div v-if="!comment.eliminado" class="comment-content">
      <div class="d-flex align-start gap-3">
        <v-avatar size="40" color="primary">
          {{ getInitials(comment.usuario?.nombre || 'Usuario') }}
        </v-avatar>

        <div class="flex-grow-1">
          <div class="d-flex align-center justify-space-between mb-1">
            <div class="d-flex align-center gap-2">
              <span class="text-body-2 font-weight-medium">
                {{ comment.usuario?.nombre || 'Usuario' }}
              </span>
              <span class="text-caption text-grey">
                {{ formatDate(comment.creado_en) }}
              </span>
              <v-chip
                v-if="comment.editado"
                size="x-small"
                variant="text"
                color="grey"
              >
                editado
              </v-chip>
            </div>

            <div v-if="canEdit" class="d-flex gap-1">
              <v-btn
                icon
                size="x-small"
                variant="text"
                @click="$emit('edit', comment)"
              >
                <v-icon size="16">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                size="x-small"
                variant="text"
                color="error"
                @click="confirmDelete"
              >
                <v-icon size="16">mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="comment-text mb-2">
            <p class="text-body-2 mb-0" v-html="formatContent(comment.contenido)"></p>
          </div>

          <!-- Archivos adjuntos -->
          <div v-if="comment.archivos_adjuntos && comment.archivos_adjuntos.length > 0" class="mb-2">
            <v-chip
              v-for="(archivo, index) in comment.archivos_adjuntos"
              :key="index"
              size="small"
              variant="outlined"
              class="mr-2 mb-1"
              @click="downloadFile(archivo)"
            >
              <v-icon start size="16">{{ getFileIcon(archivo.tipo) }}</v-icon>
              {{ archivo.nombre }}
            </v-chip>
          </div>

          <!-- Menciones -->
          <div v-if="comment.menciones && comment.menciones.length > 0" class="mb-2">
            <v-chip
              v-for="(mencionId, index) in comment.menciones"
              :key="index"
              size="x-small"
              variant="tonal"
              color="primary"
              class="mr-1"
            >
              @{{ getMentionName(mencionId) }}
            </v-chip>
          </div>

          <!-- Botón de respuesta -->
          <v-btn
            v-if="!comment.id_comentario_padre"
            size="x-small"
            variant="text"
            prepend-icon="mdi-reply"
            @click="$emit('reply', comment.id_comentario)"
          >
            Responder
          </v-btn>
        </div>
      </div>
    </div>

    <div v-else class="comment-deleted">
      <v-icon size="16" color="grey">mdi-comment-remove</v-icon>
      <span class="text-caption text-grey ml-2">Comentario eliminado</span>
    </div>

    <!-- Respuestas -->
    <div v-if="comment.respuestas && comment.respuestas.length > 0" class="comment-replies ml-8 mt-2">
      <CommentItem
        v-for="reply in comment.respuestas"
        :key="reply.id_comentario"
        :comment="reply"
        :tipo-entidad="tipoEntidad"
        :id-entidad="idEntidad"
        :current-user-id="currentUserId"
        @reply="$emit('reply', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate } from '@/utils/formatters';
import { useNotifications } from '@/composables/useNotifications';

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  tipoEntidad: {
    type: String,
    required: true,
  },
  idEntidad: {
    type: Number,
    required: true,
  },
  currentUserId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['reply', 'edit', 'delete']);

const { showError } = useNotifications();

const canEdit = computed(() => {
  return props.currentUserId && props.comment.id_usuario === props.currentUserId;
});

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatContent(content) {
  if (!content) return '';
  
  // Detectar menciones (@usuario) y convertirlas en spans
  return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
}

function getFileIcon(tipo) {
  if (tipo?.includes('image')) return 'mdi-image';
  if (tipo?.includes('pdf')) return 'mdi-file-pdf-box';
  if (tipo?.includes('word') || tipo?.includes('document')) return 'mdi-file-word-box';
  if (tipo?.includes('excel') || tipo?.includes('spreadsheet')) return 'mdi-file-excel-box';
  return 'mdi-file';
}

function downloadFile(archivo) {
  window.open(archivo.url, '_blank');
}

function getMentionName(userId) {
  // TODO: Obtener nombre del usuario desde un store o cache
  return `Usuario ${userId}`;
}

function confirmDelete() {
  if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
    emit('delete', props.comment.id_comentario);
  }
}
</script>

<style scoped>
.comment-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.comment-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.comment-reply {
  margin-left: 48px;
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  padding-left: 16px;
}

.comment-content {
  width: 100%;
}

.comment-text {
  word-wrap: break-word;
}

.comment-text :deep(.mention) {
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
}

.comment-deleted {
  display: flex;
  align-items: center;
  padding: 8px;
  font-style: italic;
}

.comment-replies {
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  padding-left: 16px;
}
</style>

