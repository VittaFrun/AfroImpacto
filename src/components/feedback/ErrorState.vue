<template>
  <div class="error-state">
    <v-alert
      :type="alertType"
      :prominent="prominent"
      :dismissible="dismissible"
      @click:close="$emit('dismiss')"
    >
      <template v-if="title" #prepend>
        <v-icon>{{ icon }}</v-icon>
      </template>
      
      <div class="error-content">
        <h3 v-if="displayTitle" class="error-title">{{ displayTitle }}</h3>
        <p class="error-message">{{ displayMessage }}</p>
        <div v-if="showDetails && error" class="error-details">
          <details>
            <summary>Detalles técnicos</summary>
            <pre>{{ errorDetails }}</pre>
          </details>
        </div>
      </div>

      <template v-if="showRetry" #append>
        <v-btn
          color="white"
          variant="text"
          size="small"
          @click="$emit('retry')"
        >
          Reintentar
        </v-btn>
      </template>
    </v-alert>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getErrorMessage, classifyError } from '@/utils/errorMessages';

const props = defineProps({
  error: {
    type: [Error, Object, String],
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: null,
    validator: (value) => !value || ['error', 'warning', 'info'].includes(value),
  },
  prominent: {
    type: Boolean,
    default: true,
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
  showRetry: {
    type: Boolean,
    default: true,
  },
  showDetails: {
    type: Boolean,
    default: false,
  },
  autoClassify: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['retry', 'dismiss']);

const errorInfo = computed(() => {
  if (props.autoClassify && props.error) {
    return getErrorMessage(props.error, props.message);
  }
  return {
    title: props.title || 'Error',
    message: props.message || 'Ha ocurrido un error',
    icon: props.type === 'warning' ? 'mdi-alert' : props.type === 'info' ? 'mdi-information' : 'mdi-alert-circle',
    type: props.type || 'error'
  };
});

const alertType = computed(() => {
  if (props.type) return props.type;
  if (props.autoClassify && props.error) {
    const errorType = classifyError(props.error);
    if (errorType === 'timeout' || errorType === 'network') return 'warning';
    if (errorType === 'auth' || errorType === 'permission') return 'error';
    return 'error';
  }
  return 'error';
});

const icon = computed(() => {
  return errorInfo.value.icon;
});

const displayTitle = computed(() => {
  return props.title || errorInfo.value.title;
});

const displayMessage = computed(() => {
  return props.message || errorInfo.value.message;
});

const errorDetails = computed(() => {
  if (!props.error) return '';
  
  if (typeof props.error === 'string') {
    return props.error;
  }
  
  if (props.error instanceof Error) {
    return JSON.stringify({
      message: props.error.message,
      stack: props.error.stack,
    }, null, 2);
  }
  
  if (props.error?.response) {
    return JSON.stringify({
      status: props.error.response.status,
      statusText: props.error.response.statusText,
      data: props.error.response.data,
    }, null, 2);
  }
  
  return JSON.stringify(props.error, null, 2);
});
</script>

<style scoped>
.error-state {
  padding: var(--afro-space-lg);
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-sm);
}

.error-title {
  font-size: var(--afro-text-lg);
  font-weight: var(--afro-font-semibold);
  margin: 0;
}

.error-message {
  font-size: var(--afro-text-base);
  margin: 0;
}

.error-details {
  margin-top: var(--afro-space-md);
}

.error-details details {
  margin-top: var(--afro-space-sm);
}

.error-details summary {
  cursor: pointer;
  font-weight: var(--afro-font-medium);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-xs);
}

.error-details pre {
  background: rgba(0, 0, 0, 0.05);
  padding: var(--afro-space-sm);
  border-radius: var(--afro-radius-sm);
  font-size: var(--afro-text-xs);
  overflow-x: auto;
  margin: 0;
}
</style>

