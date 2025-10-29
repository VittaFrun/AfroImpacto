<!-- COMPONENTE METRIC CARD -->

<template>
  <v-card 
    class="metric-card" 
    :class="{ 'metric-card-hover': hover }"
    elevation="0"
    @click="$emit('click')"
  >
    <v-card-text class="pa-6">
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="metric-icon-wrapper" :class="`bg-${color}`">
          <v-icon :color="'white'" size="24">{{ icon }}</v-icon>
        </div>
        <div v-if="trend" class="metric-trend" :class="trendClass">
          <v-icon size="16" class="mr-1">
            {{ trendPositive ? 'mdi-trending-up' : 'mdi-trending-down' }}
          </v-icon>
          <span class="text-caption font-weight-bold">{{ trend }}</span>
        </div>
      </div>
      
      <div class="metric-content">
        <h3 class="text-h4 font-weight-bold mb-1" :class="`text-${color}`">
          {{ formattedValue }}
        </h3>
        <p class="text-body-2 text-grey-darken-1 mb-0">
          {{ title }}
        </p>
      </div>
      
      <div v-if="subtitle" class="metric-subtitle mt-2">
        <p class="text-caption text-grey">{{ subtitle }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  trend: {
    type: String,
    default: null
  },
  trendPositive: {
    type: Boolean,
    default: true
  },
  subtitle: {
    type: String,
    default: null
  },
  hover: {
    type: Boolean,
    default: true
  },
  format: {
    type: String,
    default: 'number',
    validator: (value) => ['number', 'currency', 'percentage', 'time'].includes(value)
  }
});

// Emits
const emit = defineEmits(['click']);

// Computed
const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value;
  
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(props.value);
    case 'percentage':
      return `${props.value}%`;
    case 'time':
      return `${props.value}h`;
    default:
      return new Intl.NumberFormat('es-CO').format(props.value);
  }
});

const trendClass = computed(() => {
  if (!props.trend) return '';
  return props.trendPositive ? 'text-success' : 'text-error';
});
</script>

<style scoped>
.metric-card {
  background: white !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  border-radius: var(--border-radius-lg) !important;
  transition: all var(--transition-normal) !important;
  cursor: pointer;
}

.metric-card-hover:hover {
  transform: translateY(-4px) !important;
  box-shadow: var(--shadow-lg) !important;
  border-color: rgba(var(--primary-500-rgb), 0.2) !important;
}

.metric-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.metric-trend {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: rgba(var(--success-500-rgb), 0.1);
}

.metric-trend.text-error {
  background-color: rgba(var(--error-500-rgb), 0.1);
}

.metric-content h3 {
  font-size: var(--font-size-2xl) !important;
  line-height: var(--line-height-tight) !important;
}

.metric-subtitle {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: var(--spacing-sm);
}

/* Color variants */
.bg-primary { background-color: var(--primary-500) !important; }
.bg-secondary { background-color: var(--secondary-500) !important; }
.bg-success { background-color: var(--success-500) !important; }
.bg-warning { background-color: var(--warning-500) !important; }
.bg-error { background-color: var(--error-500) !important; }
.bg-info { background-color: var(--info-500) !important; }

.text-primary { color: var(--primary-500) !important; }
.text-secondary { color: var(--secondary-500) !important; }
.text-success { color: var(--success-500) !important; }
.text-warning { color: var(--warning-500) !important; }
.text-error { color: var(--error-500) !important; }
.text-info { color: var(--info-500) !important; }

/* Responsive adjustments */
@media (max-width: 600px) {
  .metric-card {
    margin-bottom: var(--spacing-md);
  }
  
  .metric-content h3 {
    font-size: var(--font-size-xl) !important;
  }
}
</style>
