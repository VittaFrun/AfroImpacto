<template>
  <v-dialog
    v-model="localDialog"
    :max-width="maxWidth"
    :fullscreen="fullscreen"
    scrollable
    :persistent="false"
  >
    <v-card class="document-viewer">
      <!-- Header -->
      <v-card-title class="document-header">
        <div class="d-flex align-center w-100">
          <div class="flex-grow-1">
            <h3 class="document-title">{{ document.name || 'Documento' }}</h3>
            <p class="document-info">
              {{ formatFileSize(document.size) }} • {{ document.type || 'Desconocido' }}
            </p>
          </div>
          
          <div class="header-actions">
            <!-- Zoom Controls (for images and PDFs) -->
            <div v-if="showZoomControls" class="zoom-controls mr-4">
              <v-btn-group variant="outlined" density="compact">
                <v-btn
                  icon="mdi-minus"
                  size="small"
                  @click="zoomOut"
                  :disabled="zoom <= minZoom"
                />
                <v-btn
                  :text="`${Math.round(zoom * 100)}%`"
                  size="small"
                  @click="resetZoom"
                />
                <v-btn
                  icon="mdi-plus"
                  size="small"
                  @click="zoomIn"
                  :disabled="zoom >= maxZoom"
                />
              </v-btn-group>
            </div>

            <!-- View Mode Toggle -->
            <v-btn-toggle
              v-if="showViewModeToggle"
              v-model="viewMode"
              variant="outlined"
              density="compact"
              class="mr-4"
            >
              <v-btn icon="mdi-fit-to-page" value="fit" title="Ajustar a página" />
              <v-btn icon="mdi-fullscreen" value="fullscreen" title="Pantalla completa" />
            </v-btn-toggle>

            <!-- Download Button -->
            <v-btn
              v-if="showDownload"
              icon="mdi-download"
              variant="outlined"
              size="small"
              class="mr-2"
              @click="downloadDocument"
              title="Descargar"
            />

            <!-- Fullscreen Toggle -->
            <v-btn
              icon="mdi-fullscreen"
              variant="outlined"
              size="small"
              class="mr-2"
              @click="toggleFullscreen"
              :title="fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'"
            />

            <!-- Close Button -->
            <v-btn
              icon="mdi-close"
              variant="outlined"
              size="small"
              @click="closeViewer"
              title="Cerrar"
            />
          </div>
        </div>
      </v-card-title>

      <!-- Content -->
      <v-card-text class="document-content pa-0">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
          <p class="mt-4">Cargando documento...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <v-alert
            type="error"
            variant="tonal"
            class="ma-4"
          >
            <template #prepend>
              <v-icon>mdi-alert-circle</v-icon>
            </template>
            <div>
              <h4>Error al cargar el documento</h4>
              <p>{{ error }}</p>
              <v-btn
                color="error"
                variant="outlined"
                size="small"
                class="mt-2"
                @click="retryLoad"
              >
                <v-icon start>mdi-refresh</v-icon>
                Reintentar
              </v-btn>
            </div>
          </v-alert>
        </div>

        <!-- Document Content -->
        <div v-else class="document-display" :class="{ 'fullscreen-content': fullscreen }">
          <!-- PDF Viewer -->
          <div v-if="isPDF" class="pdf-viewer">
            <iframe
              :src="documentUrl"
              class="pdf-iframe"
              :style="{ transform: `scale(${zoom})` }"
              frameborder="0"
            />
          </div>

          <!-- Image Viewer -->
          <div v-else-if="isImage" class="image-viewer" @click="toggleZoom">
            <v-img
              :src="documentUrl"
              :alt="document.name"
              class="document-image"
              :style="{ transform: `scale(${zoom})`, cursor: 'zoom-in' }"
              contain
            />
          </div>

          <!-- Text/Code Viewer -->
          <div v-else-if="isText" class="text-viewer">
            <pre class="text-content"><code>{{ textContent }}</code></pre>
          </div>

          <!-- Video Viewer -->
          <div v-else-if="isVideo" class="video-viewer">
            <video
              :src="documentUrl"
              controls
              class="document-video"
              :style="{ transform: `scale(${zoom})` }"
            >
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>

          <!-- Audio Viewer -->
          <div v-else-if="isAudio" class="audio-viewer">
            <div class="audio-container">
              <v-icon size="64" color="primary" class="mb-4">mdi-music</v-icon>
              <h4>{{ document.name }}</h4>
              <audio
                :src="documentUrl"
                controls
                class="document-audio mt-4"
              >
                Tu navegador no soporta la reproducción de audio.
              </audio>
            </div>
          </div>

          <!-- Office Documents (Word, Excel, PowerPoint) -->
          <div v-else-if="isOffice" class="office-viewer">
            <div class="office-container">
              <v-icon size="64" :color="officeIconColor" class="mb-4">{{ officeIcon }}</v-icon>
              <h4>{{ document.name }}</h4>
              <p class="text-body-2 text-grey-darken-1 mb-4">
                Este tipo de documento requiere una aplicación externa para visualizarse.
              </p>
              <v-btn
                color="primary"
                variant="elevated"
                @click="downloadDocument"
              >
                <v-icon start>mdi-download</v-icon>
                Descargar para abrir
              </v-btn>
            </div>
          </div>

          <!-- Unsupported Format -->
          <div v-else class="unsupported-viewer">
            <div class="unsupported-container">
              <v-icon size="64" color="grey" class="mb-4">mdi-file-question</v-icon>
              <h4>Formato no soportado</h4>
              <p class="text-body-2 text-grey-darken-1 mb-4">
                No se puede previsualizar este tipo de archivo.
              </p>
              <v-btn
                color="primary"
                variant="outlined"
                @click="downloadDocument"
              >
                <v-icon start>mdi-download</v-icon>
                Descargar archivo
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Footer (for PDFs with page navigation) -->
      <v-card-actions v-if="isPDF && !loading && !error" class="document-footer">
        <v-spacer />
        <div class="page-navigation">
          <v-btn
            icon="mdi-chevron-left"
            size="small"
            variant="outlined"
            @click="previousPage"
            :disabled="currentPage <= 1"
          />
          <span class="page-info mx-3">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          <v-btn
            icon="mdi-chevron-right"
            size="small"
            variant="outlined"
            @click="nextPage"
            :disabled="currentPage >= totalPages"
          />
        </div>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  document: {
    type: Object,
    required: true,
    validator: (doc) => doc && (doc.url || doc.src || doc.path)
  },
  maxWidth: {
    type: [String, Number],
    default: '90vw'
  },
  showDownload: {
    type: Boolean,
    default: true
  },
  allowFullscreen: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'download', 'error', 'loaded']);

// Reactive data
const loading = ref(true);
const error = ref(null);
const textContent = ref('');
const zoom = ref(1);
const viewMode = ref('fit');
const fullscreen = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

// Constants
const minZoom = 0.25;
const maxZoom = 3;

// Computed
const localDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const documentUrl = computed(() => {
  return props.document.url || props.document.src || props.document.path || '';
});

const fileExtension = computed(() => {
  const name = props.document.name || documentUrl.value;
  return name.split('.').pop()?.toLowerCase() || '';
});

const mimeType = computed(() => {
  return props.document.type || props.document.mimeType || '';
});

const isPDF = computed(() => {
  return fileExtension.value === 'pdf' || mimeType.value === 'application/pdf';
});

const isImage = computed(() => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  return imageExtensions.includes(fileExtension.value) || 
         mimeType.value.startsWith('image/');
});

const isVideo = computed(() => {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov'];
  return videoExtensions.includes(fileExtension.value) || 
         mimeType.value.startsWith('video/');
});

const isAudio = computed(() => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
  return audioExtensions.includes(fileExtension.value) || 
         mimeType.value.startsWith('audio/');
});

const isText = computed(() => {
  const textExtensions = ['txt', 'md', 'json', 'xml', 'csv', 'log', 'js', 'css', 'html', 'py', 'java', 'cpp', 'c', 'h'];
  return textExtensions.includes(fileExtension.value) || 
         mimeType.value.startsWith('text/');
});

const isOffice = computed(() => {
  const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  return officeExtensions.includes(fileExtension.value) ||
         mimeType.value.includes('officedocument') ||
         mimeType.value.includes('msword') ||
         mimeType.value.includes('excel') ||
         mimeType.value.includes('powerpoint');
});

const officeIcon = computed(() => {
  const ext = fileExtension.value;
  if (['doc', 'docx'].includes(ext)) return 'mdi-file-word';
  if (['xls', 'xlsx'].includes(ext)) return 'mdi-file-excel';
  if (['ppt', 'pptx'].includes(ext)) return 'mdi-file-powerpoint';
  return 'mdi-file-document';
});

const officeIconColor = computed(() => {
  const ext = fileExtension.value;
  if (['doc', 'docx'].includes(ext)) return 'blue';
  if (['xls', 'xlsx'].includes(ext)) return 'green';
  if (['ppt', 'pptx'].includes(ext)) return 'orange';
  return 'grey';
});

const showZoomControls = computed(() => {
  return (isImage.value || isPDF.value) && !loading.value && !error.value;
});

const showViewModeToggle = computed(() => {
  return props.allowFullscreen && (isImage.value || isPDF.value || isVideo.value);
});

// Methods
const loadDocument = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (isText.value) {
      await loadTextContent();
    } else if (isPDF.value) {
      await loadPDFInfo();
    }
    
    emit('loaded', props.document);
  } catch (err) {
    console.error('Error loading document:', err);
    error.value = err.message || 'Error al cargar el documento';
    emit('error', err);
  } finally {
    loading.value = false;
  }
};

const loadTextContent = async () => {
  try {
    const response = await fetch(documentUrl.value);
    if (!response.ok) throw new Error('Error al cargar el archivo');
    textContent.value = await response.text();
  } catch (err) {
    throw new Error('No se pudo cargar el contenido del archivo de texto');
  }
};

const loadPDFInfo = async () => {
  // For PDF, we'll use a simple iframe approach
  // In a real implementation, you might want to use PDF.js for more control
  totalPages.value = 1; // This would need to be determined by PDF.js
};

const zoomIn = () => {
  zoom.value = Math.min(zoom.value * 1.25, maxZoom);
};

const zoomOut = () => {
  zoom.value = Math.max(zoom.value / 1.25, minZoom);
};

const resetZoom = () => {
  zoom.value = 1;
};

const toggleZoom = () => {
  zoom.value = zoom.value === 1 ? 2 : 1;
};

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const downloadDocument = () => {
  const link = document.createElement('a');
  link.href = documentUrl.value;
  link.download = props.document.name || 'documento';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  emit('download', props.document);
};

const retryLoad = () => {
  loadDocument();
};

const closeViewer = () => {
  localDialog.value = false;
};

const formatFileSize = (bytes) => {
  if (!bytes) return 'Tamaño desconocido';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    loadDocument();
  } else {
    // Reset state when closing
    zoom.value = 1;
    fullscreen.value = false;
    currentPage.value = 1;
    error.value = null;
  }
});

watch(viewMode, (newMode) => {
  if (newMode === 'fullscreen') {
    fullscreen.value = true;
  } else if (newMode === 'fit') {
    fullscreen.value = false;
    resetZoom();
  }
});

// Lifecycle
onMounted(() => {
  if (props.modelValue) {
    loadDocument();
  }
});
</script>

<style scoped>
.document-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.document-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(8px);
}

.document-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
  line-height: 1.4;
}

.document-info {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 4px 0 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
}

.zoom-controls {
  display: flex;
  align-items: center;
}

.document-content {
  flex: 1;
  overflow: hidden;
}

.document-display {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.fullscreen-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #000;
}

/* PDF Viewer */
.pdf-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
  transform-origin: center center;
}

/* Image Viewer */
.image-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.document-image {
  max-width: 100%;
  max-height: 100%;
  transform-origin: center center;
  transition: transform 0.3s ease;
}

/* Text Viewer */
.text-viewer {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #fff;
}

.text-content {
  padding: 24px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

/* Video Viewer */
.video-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.document-video {
  max-width: 100%;
  max-height: 100%;
  transform-origin: center center;
}

/* Audio Viewer */
.audio-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.audio-container {
  text-align: center;
  padding: 40px;
}

.document-audio {
  width: 100%;
  max-width: 400px;
}

/* Office Viewer */
.office-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.office-container {
  text-align: center;
  padding: 40px;
}

/* Unsupported Viewer */
.unsupported-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.unsupported-container {
  text-align: center;
  padding: 40px;
}

/* Loading and Error States */
.loading-container,
.error-container {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* Footer */
.document-footer {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 0.95);
}

.page-navigation {
  display: flex;
  align-items: center;
}

.page-info {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 600px) {
  .document-header {
    padding: 12px 16px;
  }
  
  .document-title {
    font-size: 1rem;
  }
  
  .document-info {
    font-size: 0.8125rem;
  }
  
  .header-actions {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .zoom-controls {
    display: none; /* Hide zoom controls on mobile */
  }
  
  .text-content {
    padding: 16px;
    font-size: 0.8125rem;
  }
  
  .audio-container,
  .office-container,
  .unsupported-container {
    padding: 24px 16px;
  }
}
</style>

