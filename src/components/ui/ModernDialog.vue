<template>
  <v-dialog
    v-model="dialogModel"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrollable="scrollable"
    :fullscreen="fullscreen"
    :class="dialogClass"
    @update:model-value="handleDialogChange"
    @keydown.esc="handleEscape"
  >
    <v-card class="modern-dialog-card" ref="dialogCard">
      <!-- Header -->
      <v-card-title 
        v-if="showHeader" 
        class="modern-dialog-header"
      >
        <div class="d-flex align-center w-100">
          <v-avatar 
            v-if="icon" 
            :color="iconColor" 
        class="mr-4"
        size="48"
      >
            <v-icon color="white" size="24">{{ icon }}</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <h2 class="text-h5 font-weight-bold mb-1">{{ title }}</h2>
            <p 
              v-if="subtitle" 
              class="text-body-2 text-grey mb-0"
            >{{ subtitle }}</p>
          </div>
          <v-btn
            v-if="showCloseButton"
            icon="mdi-close"
            variant="text"
            size="small"
            @click="closeDialog"
            class="close-btn"
          ></v-btn>
        </div>
      </v-card-title>

      <!-- Content -->
      <v-card-text 
        :class="contentClass"
        :style="contentStyle"
      >
        <slot>
          <div v-if="loading" class="d-flex justify-center align-center py-8">
            <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          </div>
          <div v-else-if="error" class="text-center py-8">
            <v-alert type="error" variant="tonal">
              {{ error }}
            </v-alert>
          </div>
          <div v-else>
            <slot name="content"></slot>
          </div>
        </slot>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions v-if="showActions" class="modern-dialog-actions">
        <slot name="actions">
          <v-btn
            v-if="showCancelButton"
            color="grey"
            variant="outlined"
            @click="handleCancel"
            :loading="cancelLoading"
            class="modern-btn"
            size="large"
            ref="cancelButton"
          >
            <v-icon start>mdi-close</v-icon>
            {{ cancelText }}
          </v-btn>
          
          <v-spacer></v-spacer>
          
          <v-btn
            v-if="showConfirmButton"
            :color="confirmColor"
            variant="flat"
            @click="handleConfirm"
            :loading="confirmLoading"
            :disabled="confirmDisabled"
            class="modern-btn"
            size="large"
            ref="confirmButton"
          >
            <v-icon start>{{ confirmIcon }}</v-icon>
            {{ confirmText }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, watch, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  maxWidth: {
    type: [String, Number],
    default: '600px'
  },
  persistent: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: true
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  confirmColor: {
    type: String,
    default: 'primary'
  },
  confirmIcon: {
    type: String,
    default: 'mdi-check'
  },
  confirmLoading: {
    type: Boolean,
    default: false
  },
  cancelLoading: {
    type: Boolean,
    default: false
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  contentPadding: {
    type: String,
    default: '24px'
  },
  contentBackground: {
    type: String,
    default: 'transparent'
  }
});

const emit = defineEmits([
  'update:modelValue',
  'confirm',
  'cancel',
  'close'
]);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Refs
const dialogCard = ref(null);
const cancelButton = ref(null);
const confirmButton = ref(null);
let previousActiveElement = null;

const dialogClass = computed(() => {
  const classes = ['modern-dialog'];
  if (props.fullscreen) {
    classes.push('fullscreen-dialog');
  }
  return classes.join(' ');
});

const contentClass = computed(() => {
  const classes = ['modern-dialog-content'];
  if (props.scrollable) {
    classes.push('scrollable-content');
  }
  return classes.join(' ');
});

const contentStyle = computed(() => ({
  padding: props.contentPadding,
  background: props.contentBackground
}));

function handleDialogChange(value) {
  if (!value) {
    emit('close');
  }
}

function closeDialog() {
  dialogModel.value = false;
}

function handleCancel() {
  emit('cancel');
  if (!props.persistent) {
    closeDialog();
  }
}

function handleConfirm() {
  emit('confirm');
  if (!props.persistent) {
    closeDialog();
  }
}

function handleEscape() {
  if (!props.persistent) {
    closeDialog();
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Dialog opened
    document.body.style.overflow = 'hidden';
  } else {
    // Dialog closed
    document.body.style.overflow = '';
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Modern Dialog Styles */
.modern-dialog {
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2) !important;
}

.modern-dialog-card {
  border-radius: 20px !important;
  overflow: hidden !important;
  background: white !important;
}

.modern-dialog-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  padding: 24px !important;
}

.modern-dialog-content {
  background: white !important;
  transition: all 0.3s ease !important;
}

.scrollable-content {
  max-height: 60vh !important;
  overflow-y: auto !important;
}

.modern-dialog-actions {
  background: rgba(248, 249, 250, 0.8) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
  padding: 24px !important;
}

/* Close Button */
.close-btn {
  transition: all 0.3s ease !important;
  border-radius: 50% !important;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1) !important;
  transform: scale(1.1) !important;
}

/* Modern Button Styles */
.modern-btn {
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.modern-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

.modern-btn:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* Fullscreen Dialog */
.fullscreen-dialog {
  border-radius: 0 !important;
}

.fullscreen-dialog .modern-dialog-card {
  border-radius: 0 !important;
  height: 100vh !important;
}

/* Animation for dialog entrance */
.modern-dialog {
  animation: modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Backdrop blur effect */
:deep(.v-overlay__scrim) {
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.4) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modern-dialog {
    margin: 16px !important;
    max-width: calc(100vw - 32px) !important;
  }
  
  .modern-dialog-header {
    padding: 16px !important;
  }
  
  .modern-dialog-content {
    padding: 16px !important;
  }
  
  .modern-dialog-actions {
    padding: 16px !important;
    flex-direction: column !important;
  }
  
  .modern-btn {
    width: 100% !important;
    margin-bottom: 8px !important;
  }
}

/* Scrollbar styling for content */
.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Loading state */
.modern-dialog-content:deep(.v-progress-circular) {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Error state */
.modern-dialog-content:deep(.v-alert) {
  border-radius: 12px !important;
}


/* Icon spacing */
.modern-btn:deep(.v-btn__prepend) {
  margin-inline-end: 8px !important;
}

.modern-btn:deep(.v-btn__append) {
  margin-inline-start: 8px !important;
}
</style>
