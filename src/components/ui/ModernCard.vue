<template>
  <v-card
    :class="cardClass"
    :elevation="elevation"
    :hover="hover"
    :loading="loading"
    v-bind="$attrs"
  >
    <!-- Header Section -->
    <v-card-title v-if="showHeader" class="modern-card-header">
      <div class="d-flex align-center w-100">
        <v-avatar 
          v-if="icon" 
          :color="iconColor" 
          class="mr-4"
          :size="iconSize"
        >
          <v-icon :color="iconTextColor" :size="iconTextSize">{{ icon }}</v-icon>
        </v-avatar>
        <div class="flex-grow-1">
          <h3 class="text-subtitle-1 font-weight-bold mb-1 modern-card-title">{{ title }}</h3>
          <p v-if="subtitle" class="text-body-2 text-grey mb-0">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.headerActions" class="ml-4">
          <slot name="headerActions"></slot>
        </div>
      </div>
    </v-card-title>

    <!-- Content Section -->
    <v-card-text 
      :class="contentClass" 
      :style="contentStyle"
    >
      <slot>
        <div v-if="loading" class="d-flex justify-center align-center py-8">
          <v-progress-circular indeterminate :color="loadingColor" size="48"></v-progress-circular>
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

    <!-- Actions Section -->
    <v-card-actions v-if="showActions" class="modern-card-actions">
      <slot name="actions">
        <v-btn
          v-if="showCancelButton"
          color="grey"
          variant="outlined"
          @click="handleCancel"
          :loading="cancelLoading"
          class="modern-btn"
          size="default"
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
          size="default"
        >
          <v-icon start>{{ confirmIcon }}</v-icon>
          {{ confirmText }}
        </v-btn>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
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
  iconTextColor: {
    type: String,
    default: 'white'
  },
  iconSize: {
    type: [String, Number],
    default: 40
  },
  iconTextSize: {
    type: [String, Number],
    default: 20
  },
  elevation: {
    type: [String, Number],
    default: 0
  },
  hover: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: false
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  showConfirmButton: {
    type: Boolean,
    default: false
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
  loadingColor: {
    type: String,
    default: 'primary'
  },
  contentPadding: {
    type: String,
    default: '24px'
  },
  contentBackground: {
    type: String,
    default: 'transparent'
  },
  variant: {
    type: String,
    default: 'default', // default, outlined, filled, tonal
    validator: (value) => ['default', 'outlined', 'filled', 'tonal'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: true
  },
  gradient: {
    type: Boolean,
    default: false
  },
  gradientDirection: {
    type: String,
    default: '135deg',
    validator: (value) => ['45deg', '90deg', '135deg', '180deg', '225deg', '270deg', '315deg'].includes(value)
  },
});

const emit = defineEmits(['confirm', 'cancel']);


const cardClass = computed(() => {
  const classes = ['modern-card'];
  
  if (props.rounded) {
    classes.push('rounded-card');
  }
  
  if (props.gradient) {
    classes.push('gradient-card');
  }
  
  if (props.variant !== 'default') {
    classes.push(`${props.variant}-card`);
  }
  
  return classes.join(' ');
});

const contentClass = computed(() => {
  const classes = ['modern-card-content'];
  return classes.join(' ');
});

const contentStyle = computed(() => ({
  padding: props.contentPadding,
  background: props.contentBackground
}));

function handleCancel() {
  emit('cancel');
}

function handleConfirm() {
  emit('confirm');
}
</script>

<style scoped>
/* Modern Card Base Styles */
.modern-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  background: white !important;
}

.rounded-card {
  border-radius: 16px !important;
}

.gradient-card {
  background: linear-gradient(v-bind(gradientDirection), #f8f9fa, #e9ecef) !important;
}

/* Card Variants */
.outlined-card {
  border: 2px solid rgba(var(--v-theme-primary-rgb), 0.2) !important;
  background: transparent !important;
}

.filled-card {
  background: rgba(var(--v-theme-primary-rgb), 0.05) !important;
  border: 1px solid rgba(var(--v-theme-primary-rgb), 0.1) !important;
}

.tonal-card {
  background: rgba(var(--v-theme-primary-rgb), 0.08) !important;
  border: 1px solid rgba(var(--v-theme-primary-rgb), 0.15) !important;
}

/* Hover Effects */
.modern-card:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.15) !important;
}

/* Header Styles */
.modern-card-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  padding: 20px !important;
}

.modern-card-title {
  line-height: 1.2 !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  hyphens: auto !important;
  color: rgba(0, 0, 0, 0.87) !important; /* Color oscuro para contraste */
}

.gradient-card .modern-card-header {
  background: linear-gradient(v-bind(gradientDirection), rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9)) !important;
}

/* Content Styles */
.modern-card-content {
  background: white !important;
  transition: all 0.3s ease !important;
}

.gradient-card .modern-card-content {
  background: rgba(255, 255, 255, 0.95) !important;
}

/* Actions Styles */
.modern-card-actions {
  background: rgba(248, 249, 250, 0.8) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
  padding: 20px !important;
}

.gradient-card .modern-card-actions {
  background: rgba(248, 249, 250, 0.9) !important;
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

/* Loading State */
.modern-card-content:deep(.v-progress-circular) {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Error State */
.modern-card-content:deep(.v-alert) {
  border-radius: 12px !important;
}

/* Icon Styles */
.modern-card-header:deep(.v-avatar) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .modern-card-header {
    padding: 16px !important;
  }
  
  .modern-card-content {
    padding: 16px !important;
  }
  
  .modern-card-actions {
    padding: 16px !important;
    flex-direction: column !important;
  }
  
  .modern-btn {
    width: 100% !important;
    margin-bottom: 8px !important;
  }
}



/* Icon Spacing */
.modern-btn:deep(.v-btn__prepend) {
  margin-inline-end: 8px !important;
}

.modern-btn:deep(.v-btn__append) {
  margin-inline-start: 8px !important;
}

/* Animation for card entrance */
.modern-card {
  animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Special effects for different variants */
.outlined-card:hover {
  background: rgba(var(--v-theme-primary-rgb), 0.02) !important;
}

.filled-card:hover {
  background: rgba(var(--v-theme-primary-rgb), 0.08) !important;
}

.tonal-card:hover {
  background: rgba(var(--v-theme-primary-rgb), 0.12) !important;
}
</style>
