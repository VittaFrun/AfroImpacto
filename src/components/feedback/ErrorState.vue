<template>
  <div class="error-state">
    <v-alert
      :type="type"
      :prominent="prominent"
      :dismissible="dismissible"
      @click:close="$emit('dismiss')"
    >
      <template v-if="title" #prepend>
        <v-icon>{{ icon }}</v-icon>
      </template>
      
      <div class="error-content">
        <h3 v-if="title" class="error-title">{{ title }}</h3>
        <p class="error-message">{{ message }}</p>
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

const props = defineProps({
  error: {
    type: [Error, Object, String],
    default: null,
  },
  message: {
    type: String,
    default: 'Ha ocurrido un error',
  },
  title: {
    type: String,
    default: 'Error',
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info'].includes(value),
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
    default: false,
  },
  showDetails: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['retry', 'dismiss']);

const icon = computed(() => {
  const icons = {
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information',
  };
  return icons[props.type] || icons.error;
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

