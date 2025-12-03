<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="900px"
    scrollable
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-file-document</v-icon>
        <span class="text-h6 font-weight-bold">{{ documento?.nombre_archivo || 'Vista Previa' }}</span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="$emit('update:modelValue', false)"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="text-body-2 text-grey mt-4">Cargando documento...</p>
        </div>
        
        <div v-else-if="error" class="text-center py-8">
          <v-icon size="64" color="error">mdi-alert-circle</v-icon>
          <p class="text-body-1 text-error mt-4">{{ error }}</p>
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-download"
            @click="downloadDocument"
            class="mt-4"
          >
            Descargar Documento
          </v-btn>
        </div>

        <div v-else>
          <!-- Información del documento -->
          <v-card variant="outlined" class="mb-4" rounded="lg">
            <v-card-text class="pa-3">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-grey mb-1">Nombre del Archivo</div>
                  <div class="text-body-2 font-weight-medium">{{ documento?.nombre_archivo }}</div>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="text-caption text-grey mb-1">Tipo</div>
                  <v-chip size="small" variant="tonal" color="primary">
                    {{ getFileType(documento?.nombre_archivo) }}
                  </v-chip>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="text-caption text-grey mb-1">Tamaño</div>
                  <div class="text-body-2">{{ formatFileSize(documento?.tamaño) }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Preview según tipo de archivo -->
          <div class="document-preview">
            <!-- Imágenes -->
            <div v-if="isImage" class="image-preview">
              <img
                :src="documentUrl"
                :alt="documento?.nombre_archivo"
                class="preview-image"
                @error="handleImageError"
              />
            </div>

            <!-- PDF -->
            <div v-else-if="isPDF" class="pdf-preview">
              <iframe
                :src="documentUrl"
                class="preview-iframe"
                frameborder="0"
              ></iframe>
            </div>

            <!-- Texto -->
            <div v-else-if="isText" class="text-preview">
              <pre class="preview-text">{{ textContent }}</pre>
            </div>

            <!-- No preview disponible -->
            <div v-else class="no-preview">
              <v-icon size="80" color="grey-lighten-1">mdi-file-document-outline</v-icon>
              <p class="text-body-1 text-grey mt-4">
                Vista previa no disponible para este tipo de archivo
              </p>
              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-download"
                @click="downloadDocument"
                class="mt-4"
              >
                Descargar Documento
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          prepend-icon="mdi-download"
          @click="downloadDocument"
        >
          Descargar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="$emit('update:modelValue', false)"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from '@/plugins/axios';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  documento: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const loading = ref(false);
const error = ref(null);
const textContent = ref('');
const documentUrl = ref('');

const isImage = computed(() => {
  if (!props.documento?.nombre_archivo) return false;
  const ext = props.documento.nombre_archivo.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
});

const isPDF = computed(() => {
  if (!props.documento?.nombre_archivo) return false;
  return props.documento.nombre_archivo.toLowerCase().endsWith('.pdf');
});

const isText = computed(() => {
  if (!props.documento?.nombre_archivo) return false;
  const ext = props.documento.nombre_archivo.split('.').pop()?.toLowerCase();
  return ['txt', 'md', 'json', 'xml', 'csv'].includes(ext);
});

const getFileType = (filename) => {
  if (!filename) return 'Desconocido';
  const ext = filename.split('.').pop()?.toUpperCase();
  return ext || 'Archivo';
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const loadDocument = async () => {
  if (!props.documento) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // Construir URL del documento
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const ruta = props.documento.ruta_archivo;
    
    // Si la ruta ya es una URL completa, usarla directamente
    if (ruta.startsWith('http')) {
      documentUrl.value = ruta;
    } else {
      // Construir URL relativa
      documentUrl.value = `${baseUrl}/uploads/${ruta}`;
    }

    // Si es texto, cargar el contenido
    if (isText.value) {
      const response = await axios.get(documentUrl.value, { responseType: 'text' });
      textContent.value = response.data;
    }
  } catch (err) {
    console.error('Error loading document:', err);
    error.value = 'No se pudo cargar el documento. Intenta descargarlo.';
  } finally {
    loading.value = false;
  }
};

const downloadDocument = () => {
  if (!props.documento) return;
  
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const ruta = props.documento.ruta_archivo;
  const url = ruta.startsWith('http') ? ruta : `${baseUrl}/uploads/${ruta}`;
  
  // Crear enlace temporal para descarga
  const link = document.createElement('a');
  link.href = url;
  link.download = props.documento.nombre_archivo;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleImageError = () => {
  error.value = 'No se pudo cargar la imagen. Intenta descargarla.';
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.documento) {
    loadDocument();
  } else {
    documentUrl.value = '';
    textContent.value = '';
    error.value = null;
  }
});

watch(() => props.documento, (newDoc) => {
  if (newDoc && props.modelValue) {
    loadDocument();
  }
}, { deep: true });
</script>

<style scoped>
.document-preview {
  min-height: 400px;
  max-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf-preview {
  width: 100%;
  height: 600px;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.text-preview {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: auto;
}

.preview-text {
  background: white;
  padding: 20px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 500px;
  overflow: auto;
}

.no-preview {
  text-align: center;
  padding: 40px;
}
</style>

