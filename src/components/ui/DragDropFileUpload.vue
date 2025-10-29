<template>
  <div
    :class="dropZoneClass"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @click="triggerFileInput"
  >
    <input
      ref="fileInput"
      type="file"
      :multiple="multiple"
      :accept="accept"
      @change="handleFileSelect"
      style="display: none"
    />
    
    <div class="drop-zone-content">
      <!-- Upload Icon with Animation -->
      <div class="upload-icon-container">
        <v-icon 
          :color="isDragOver ? 'primary' : 'grey'" 
          size="40"
          class="upload-icon"
          :class="{ 'bounce': isDragOver }"
        >
          {{ isDragOver ? 'mdi-cloud-upload' : 'mdi-cloud-upload-outline' }}
        </v-icon>
        
        <!-- Progress Ring for drag over effect -->
        <div v-if="isDragOver" class="progress-ring">
          <v-progress-circular
            indeterminate
            color="primary"
            size="60"
            width="3"
          ></v-progress-circular>
        </div>
      </div>
      
      <!-- Title and Subtitle -->
      <div class="text-content">
        <h4 class="text-subtitle-1 font-weight-bold mb-1" :class="isDragOver ? 'text-primary' : 'text-grey-darken-1'">
          {{ isDragOver ? '¡Suelta los archivos aquí!' : title }}
        </h4>
        
        <p class="text-body-2 text-grey mb-3">
          {{ isDragOver ? 'Los archivos se subirán automáticamente' : subtitle }}
        </p>
      </div>
      
      <!-- Action Button -->
      <ModernButton
        :color="isDragOver ? 'primary' : 'grey'"
        :variant="isDragOver ? 'flat' : 'outlined'"
        :prepend-icon="isDragOver ? 'mdi-upload' : 'mdi-folder-open'"
        @click.stop="triggerFileInput"
        size="small"
        class="action-button"
        :class="{ 'pulse': isDragOver }"
      >
        {{ isDragOver ? 'Subir Archivos' : buttonText }}
      </ModernButton>
      
      <!-- Accepted Types -->
      <div v-if="acceptedTypes.length > 0" class="accepted-types">
        <v-chip
          v-for="type in acceptedTypes"
          :key="type"
          size="x-small"
          color="primary"
          variant="tonal"
          class="ma-1"
        >
          {{ type }}
        </v-chip>
      </div>
      
      <!-- File Size Info -->
      <div v-if="maxSize" class="text-caption text-grey mt-2">
        Tamaño máximo: {{ formatFileSize(maxSize) }}
      </div>
    </div>
    
    <!-- File Preview -->
    <div v-if="files.length > 0" class="file-preview-section">
      <v-divider class="my-4"></v-divider>
      <h4 class="text-subtitle-1 font-weight-bold mb-3">Archivos Seleccionados</h4>
      <div class="file-list">
        <v-card
          v-for="(file, index) in files"
          :key="index"
          class="file-item mb-2"
          variant="outlined"
        >
          <v-card-text class="d-flex align-center pa-3">
            <v-avatar :color="getFileColor(file)" class="mr-3" size="40">
              <v-icon color="white">{{ getFileIcon(file) }}</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle-2 font-weight-bold">{{ file.name }}</div>
              <div class="text-caption text-grey">
                {{ formatFileSize(file.size) }} • {{ getFileType(file) }}
              </div>
            </div>
            <div class="d-flex align-center">
              <v-progress-circular
                v-if="file.uploading"
                indeterminate
                size="24"
                color="primary"
                class="mr-2"
              ></v-progress-circular>
              <v-icon
                v-else-if="file.uploaded"
                color="success"
                size="24"
                class="mr-2"
              >
                mdi-check-circle
              </v-icon>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                size="small"
                @click.stop="removeFile(index)"
              ></v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Arrastra archivos aquí'
  },
  subtitle: {
    type: String,
    default: 'o haz clic para seleccionar archivos'
  },
  buttonText: {
    type: String,
    default: 'Seleccionar Archivos'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: '*/*'
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['files-selected', 'file-removed', 'upload-progress']);

const fileInput = ref(null);
const isDragOver = ref(false);
const files = ref([]);

const dropZoneClass = computed(() => {
  const classes = ['drop-zone'];
  
  if (isDragOver.value) {
    classes.push('drag-over');
  }
  
  if (props.disabled) {
    classes.push('disabled');
  }
  
  return classes.join(' ');
});

const acceptedTypes = computed(() => {
  if (!props.accept || props.accept === '*/*') return [];
  return props.accept.split(',').map(type => type.trim());
});

// Additional utility functions
function isImage(fileType) {
  return fileType && fileType.startsWith('image/');
}

function clearAllFiles() {
  files.value = [];
  emit('files-selected', []);
}

function triggerFileInput() {
  if (!props.disabled) {
    fileInput.value.click();
  }
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDragEnter(e) {
  e.preventDefault();
  e.stopPropagation();
  if (!props.disabled) {
    isDragOver.value = true;
  }
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragOver.value = false;
  }
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  isDragOver.value = false;
  
  if (props.disabled) return;
  
  const droppedFiles = Array.from(e.dataTransfer.files);
  processFiles(droppedFiles);
}

function handleFileSelect(e) {
  const selectedFiles = Array.from(e.target.files);
  processFiles(selectedFiles);
}

function processFiles(newFiles) {
  // Validate files
  const validFiles = newFiles.filter(file => {
    if (file.size > props.maxSize) {
      console.warn(`Archivo ${file.name} es demasiado grande`);
      return false;
    }
    return true;
  });
  
  // Check max files limit
  if (files.value.length + validFiles.length > props.maxFiles) {
    console.warn(`Máximo ${props.maxFiles} archivos permitidos`);
    return;
  }
  
  // Add files with metadata
  const filesWithMetadata = validFiles.map(file => ({
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    uploading: false,
    uploaded: false,
    progress: 0
  }));
  
  files.value.push(...filesWithMetadata);
  emit('files-selected', filesWithMetadata.map(f => f.file));
}

function removeFile(index) {
  const removedFile = files.value[index];
  files.value.splice(index, 1);
  emit('file-removed', removedFile.file);
}

function getFileIcon(file) {
  const type = file.type || file.file?.type || '';
  
  if (type.startsWith('image/')) return 'mdi-image';
  if (type.startsWith('video/')) return 'mdi-video';
  if (type.startsWith('audio/')) return 'mdi-music';
  if (type.includes('pdf')) return 'mdi-file-pdf-box';
  if (type.includes('word')) return 'mdi-file-word-box';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'mdi-file-excel-box';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'mdi-file-powerpoint-box';
  if (type.includes('zip') || type.includes('rar')) return 'mdi-file-zip-box';
  if (type.includes('text')) return 'mdi-file-document';
  
  return 'mdi-file';
}

function getFileColor(file) {
  const type = file.type || file.file?.type || '';
  
  if (type.startsWith('image/')) return 'success';
  if (type.startsWith('video/')) return 'info';
  if (type.startsWith('audio/')) return 'warning';
  if (type.includes('pdf')) return 'error';
  if (type.includes('word')) return 'primary';
  if (type.includes('excel')) return 'success';
  if (type.includes('powerpoint')) return 'warning';
  if (type.includes('zip')) return 'grey';
  
  return 'primary';
}

function getFileType(file) {
  const type = file.type || file.file?.type || '';
  return type.split('/')[1]?.toUpperCase() || 'ARCHIVO';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Expose methods for parent component
defineExpose({
  clearFiles: () => {
    files.value = [];
  },
  getFiles: () => files.value.map(f => f.file)
});
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: #fafafa;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drop-zone:hover {
  border-color: rgba(var(--v-theme-primary-rgb), 0.5);
  background: rgba(var(--v-theme-primary-rgb), 0.02);
}

.drop-zone.drag-over {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary-rgb), 0.1);
  transform: scale(1.02);
}

.drop-zone.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.file-preview-section {
  width: 100%;
}

.file-list {
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.file-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Animation for file items */
.file-item {
  animation: slideInUp 0.3s ease;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Upload Icon Container */
.upload-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.upload-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.upload-icon.bounce {
  animation: bounce 0.6s ease-in-out;
}

.progress-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Text Content */
.text-content {
  text-align: center;
  margin-bottom: 16px;
}

/* Action Button */
.action-button {
  transition: all 0.3s ease;
}

.action-button.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Accepted Types */
.accepted-types {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
}

/* File Preview Section */
.file-preview-section {
  margin-top: 16px;
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.file-items {
  max-height: 300px;
  overflow-y: auto;
}

.file-item.error {
  border-color: #f44336 !important;
  background-color: #ffebee;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .drop-zone {
    padding: 20px 10px;
    min-height: 150px;
  }
  
  .file-item {
    margin-bottom: 8px;
  }
}
</style>
