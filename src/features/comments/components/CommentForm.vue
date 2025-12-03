<template>
  <div class="comment-form">
    <v-textarea
      v-model="content"
      :label="label"
      :placeholder="placeholder"
      variant="outlined"
      density="comfortable"
      rows="3"
      :rules="[v => !!v || 'El comentario no puede estar vacío']"
      class="mb-2"
      @keydown.ctrl.enter="handleSubmit"
      @keydown.meta.enter="handleSubmit"
    ></v-textarea>

    <div class="d-flex align-center justify-space-between">
      <div class="d-flex gap-2">
        <v-btn
          icon
          size="small"
          variant="text"
          @click="showMentionPicker = !showMentionPicker"
        >
          <v-icon size="20">mdi-at</v-icon>
        </v-btn>
        <v-btn
          icon
          size="small"
          variant="text"
          @click="triggerFileInput"
        >
          <v-icon size="20">mdi-paperclip</v-icon>
        </v-btn>
      </div>

      <div class="d-flex gap-2">
        <v-btn
          v-if="editingComment || parentId"
          variant="text"
          size="small"
          @click="handleCancel"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          size="small"
          :loading="submitting"
          :disabled="!content.trim()"
          @click="handleSubmit"
        >
          {{ editingComment ? 'Actualizar' : 'Comentar' }}
        </v-btn>
      </div>
    </div>

    <!-- Mention Picker -->
    <v-menu
      v-model="showMentionPicker"
      location="bottom start"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props: menuProps }">
        <div v-bind="menuProps" style="display: none;"></div>
      </template>
      <v-card min-width="300">
        <v-card-title class="text-subtitle-2">Mencionar usuario</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="mentionSearch"
            placeholder="Buscar usuario..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
          ></v-text-field>
          <v-list>
            <v-list-item
              v-for="user in filteredUsers"
              :key="user.id"
              @click="insertMention(user)"
            >
              <v-list-item-title>{{ user.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>

    <!-- File Input (hidden) -->
    <input
      ref="fileInput"
      type="file"
      multiple
      style="display: none;"
      @change="handleFileSelect"
    />

    <!-- Preview de archivos -->
    <div v-if="selectedFiles.length > 0" class="mt-2">
      <v-chip
        v-for="(file, index) in selectedFiles"
        :key="index"
        size="small"
        variant="outlined"
        closable
        class="mr-2 mb-2"
        @click:close="removeFile(index)"
      >
        <v-icon start size="16">{{ getFileIcon(file.type) }}</v-icon>
        {{ file.name }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useNotifications } from '@/composables/useNotifications';
import axios from '@/plugins/axios';

const props = defineProps({
  parentId: {
    type: Number,
    default: null,
  },
  editingComment: {
    type: Object,
    default: null,
  },
  tipoEntidad: {
    type: String,
    required: true,
  },
  idEntidad: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const authStore = useAuthStore();
const { showError } = useNotifications();

const content = ref('');
const submitting = ref(false);
const showMentionPicker = ref(false);
const mentionSearch = ref('');
const selectedFiles = ref([]);
const fileInput = ref(null);
const availableUsers = ref([]);

const label = computed(() => {
  if (props.editingComment) return 'Editar comentario';
  if (props.parentId) return 'Escribir respuesta...';
  return 'Escribir un comentario...';
});

const placeholder = computed(() => {
  if (props.editingComment) return 'Edita tu comentario...';
  if (props.parentId) return 'Escribe tu respuesta...';
  return 'Escribe tu comentario aquí... (Ctrl+Enter para enviar)';
});

const filteredUsers = computed(() => {
  if (!mentionSearch.value) return availableUsers.value.slice(0, 5);
  const search = mentionSearch.value.toLowerCase();
  return availableUsers.value
    .filter(user => user.nombre.toLowerCase().includes(search))
    .slice(0, 5);
});

watch(() => props.editingComment, (newVal) => {
  if (newVal) {
    content.value = newVal.contenido || '';
  } else {
    content.value = '';
  }
}, { immediate: true });

// Cargar usuarios disponibles (simplificado - en producción debería venir del backend)
async function loadUsers() {
  try {
    // TODO: Implementar endpoint para obtener usuarios del proyecto/tarea
    // Por ahora, usar usuarios del authStore o un endpoint genérico
    availableUsers.value = [];
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

function insertMention(user) {
  const mention = `@${user.nombre} `;
  content.value += mention;
  showMentionPicker.value = false;
  mentionSearch.value = '';
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event) {
  const files = Array.from(event.target.files || []);
  selectedFiles.value.push(...files);
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1);
}

function getFileIcon(type) {
  if (type?.includes('image')) return 'mdi-image';
  if (type?.includes('pdf')) return 'mdi-file-pdf-box';
  if (type?.includes('word') || type?.includes('document')) return 'mdi-file-word-box';
  if (type?.includes('excel') || type?.includes('spreadsheet')) return 'mdi-file-excel-box';
  return 'mdi-file';
}

async function handleSubmit() {
  if (!content.value.trim()) return;

  submitting.value = true;

  try {
    // Extraer menciones del contenido
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(content.value)) !== null) {
      // TODO: Resolver ID de usuario desde el nombre
      // Por ahora, solo guardamos el texto
    }

    // Subir archivos si hay
    const archivosAdjuntos = [];
    if (selectedFiles.value.length > 0) {
      // TODO: Implementar subida de archivos
      // Por ahora, solo guardamos la referencia
    }

    emit('submit', {
      contenido: content.value,
      menciones: mentions,
      archivos_adjuntos: archivosAdjuntos.length > 0 ? archivosAdjuntos : undefined,
    });

    // Reset form
    content.value = '';
    selectedFiles.value = [];
  } catch (error) {
    showError('Error al enviar el comentario');
    console.error('Error submitting comment:', error);
  } finally {
    submitting.value = false;
  }
}

function handleCancel() {
  content.value = '';
  selectedFiles.value = [];
  emit('cancel');
}

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.comment-form {
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
}
</style>

