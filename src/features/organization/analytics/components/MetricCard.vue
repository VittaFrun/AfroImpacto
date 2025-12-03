<template>
  <v-card
    class="metric-card"
    :class="[`metric-card--${color}`, { 'metric-card--trending': trend !== 'estable' }]"
    elevation="2"
    rounded="lg"
  >
    <v-card-text class="pa-6">
      <div class="d-flex align-center justify-space-between mb-3">
        <v-avatar
          :color="color"
          size="48"
          variant="tonal"
        >
          <v-icon :icon="icon" size="24"></v-icon>
        </v-avatar>
        
        <div class="trend-indicator">
          <v-chip
            :color="getTrendColor(trend)"
            size="small"
            variant="tonal"
            :prepend-icon="getTrendIcon(trend)"
          >
            {{ getTrendText(trend) }}
          </v-chip>
        </div>
      </div>
      
      <div class="metric-content">
        <h3 class="metric-value text-h4 font-weight-bold mb-1">
          {{ formatValue(value) }}
        </h3>
        <p class="metric-title text-body-2 text-grey-darken-1 mb-0">
          {{ title }}
        </p>
      </div>
      
      <!-- Progress bar for percentage values -->
      <div v-if="showProgress" class="mt-4">
        <v-progress-linear
          :model-value="getProgressValue()"
          :color="color"
          height="4"
          rounded
        ></v-progress-linear>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  trend: {
    type: String,
    default: 'estable',
    validator: (value) => ['subiendo', 'bajando', 'estable'].includes(value)
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  maxValue: {
    type: Number,
    default: 100
  }
});

// Computed properties
const getTrendColor = (trend) => {
  switch (trend) {
    case 'subiendo': return 'success';
    case 'bajando': return 'error';
    default: return 'grey';
  }
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case 'subiendo': return 'mdi-trending-up';
    case 'bajando': return 'mdi-trending-down';
    default: return 'mdi-trending-neutral';
  }
};

const getTrendText = (trend) => {
  switch (trend) {
    case 'subiendo': return 'Subiendo';
    case 'bajando': return 'Bajando';
    default: return 'Estable';
  }
};

const formatValue = (value) => {
  if (typeof value === 'string') return value;
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  
  return value.toLocaleString();
};

const getProgressValue = () => {
  if (!props.showProgress) return 0;
  
  const numericValue = typeof props.value === 'string' 
    ? parseFloat(props.value.replace(/[^\d.]/g, '')) 
    : props.value;
    
  return Math.min((numericValue / props.maxValue) * 100, 100);
};
</script>

<style scoped>
.metric-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--v-theme-primary), var(--v-theme-primary-lighten-1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card:hover::before {
  opacity: 1;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.metric-card--primary {
  border-left-color: rgb(var(--v-theme-primary));
}

.metric-card--success {
  border-left-color: rgb(var(--v-theme-success));
}

.metric-card--info {
  border-left-color: rgb(var(--v-theme-info));
}

.metric-card--warning {
  border-left-color: rgb(var(--v-theme-warning));
}

.metric-card--error {
  border-left-color: rgb(var(--v-theme-error));
}

.metric-card--trending {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2); }
  100% { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
}

.metric-value {
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.2;
}

.metric-title {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.trend-indicator {
  position: relative;
}

.trend-indicator .v-chip {
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
