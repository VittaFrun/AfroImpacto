<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :class="buttonClass"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </v-btn>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  variant: {
    type: String,
    default: 'flat'
  },
  size: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  prependIcon: {
    type: String,
    default: ''
  },
  appendIcon: {
    type: String,
    default: ''
  },
  rounded: {
    type: Boolean,
    default: true
  },
  elevation: {
    type: Boolean,
    default: true
  },
  hover: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click']);

const buttonClass = computed(() => {
  const classes = ['modern-button'];
  
  if (props.rounded) {
    classes.push('rounded-button');
  }
  
  if (props.elevation) {
    classes.push('elevated-button');
  }
  
  if (props.hover) {
    classes.push('hover-button');
  }
  
  return classes.join(' ');
});

function handleClick(event) {
  emit('click', event);
}
</script>

<style scoped>
.modern-button {
  font-weight: 600 !important;
  text-transform: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.rounded-button {
  border-radius: 12px !important;
}

.elevated-button {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.hover-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

.hover-button:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* Ripple effect enhancement */
.modern-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.modern-button:active::before {
  width: 300px;
  height: 300px;
}

/* Loading state */
.modern-button:deep(.v-btn__loader) {
  color: inherit !important;
}

/* Icon spacing */
.modern-button:deep(.v-btn__prepend) {
  margin-inline-end: 8px !important;
}

.modern-button:deep(.v-btn__append) {
  margin-inline-start: 8px !important;
}

/* Size variants */
.modern-button.size-small {
  padding: 8px 16px !important;
  font-size: 0.875rem !important;
}

.modern-button.size-default {
  padding: 16px 32px !important;
  font-size: 1rem !important;
}

.modern-button.size-large {
  padding: 20px 40px !important;
  font-size: 1.125rem !important;
}

/* Color variants */
.modern-button.color-primary {
  background: linear-gradient(135deg, #1976d2, #1565c0) !important;
}

.modern-button.color-success {
  background: linear-gradient(135deg, #388e3c, #2e7d32) !important;
}

.modern-button.color-warning {
  background: linear-gradient(135deg, #f57c00, #ef6c00) !important;
}

.modern-button.color-error {
  background: linear-gradient(135deg, #d32f2f, #c62828) !important;
}

.modern-button.color-info {
  background: linear-gradient(135deg, #0288d1, #0277bd) !important;
}

/* Disabled state */
.modern-button:disabled {
  opacity: 0.6 !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Focus state */
.modern-button:focus-visible {
  outline: 2px solid rgba(var(--v-theme-primary-rgb), 0.5) !important;
  outline-offset: 2px !important;
}
</style>
