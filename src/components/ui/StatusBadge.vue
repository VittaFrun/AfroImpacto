<template>
  <v-chip
    :color="stateInfo.color"
    :variant="variant"
    :size="size"
    :class="chipClass"
  >
    <v-icon
      v-if="showIcon"
      :start="iconPosition === 'start'"
      :end="iconPosition === 'end'"
      :size="iconSize"
    >
      {{ stateInfo.icon }}
    </v-icon>
    {{ stateInfo.label }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue';
import { useStates } from '@/composables/useStates';

const props = defineProps({
  stateType: {
    type: String,
    required: true,
    validator: (value) => ['project', 'task', 'application', 'phase', 'hours'].includes(value)
  },
  stateId: {
    type: [String, Number],
    required: true
  },
  variant: {
    type: String,
    default: 'tonal',
    validator: (value) => ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  iconPosition: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'end'].includes(value)
  },
  iconSize: {
    type: [String, Number],
    default: 'small'
  },
  class: {
    type: [String, Array, Object],
    default: ''
  }
});

// Composables
const { formatState } = useStates();

// Computed
const stateInfo = computed(() => {
  return formatState(props.stateType, props.stateId);
});

const chipClass = computed(() => {
  const classes = [];
  
  // Add custom classes
  if (props.class) {
    if (typeof props.class === 'string') {
      classes.push(props.class);
    } else if (Array.isArray(props.class)) {
      classes.push(...props.class);
    } else {
      // Object format
      Object.keys(props.class).forEach(key => {
        if (props.class[key]) {
          classes.push(key);
        }
      });
    }
  }
  
  // Add state-specific classes
  classes.push(`status-badge--${props.stateType}`);
  classes.push(`status-badge--${stateInfo.value.name}`);
  
  return classes;
});
</script>

<style scoped>
.status-badge--project {
  font-weight: 500;
}

.status-badge--task {
  font-weight: 500;
}

.status-badge--application {
  font-weight: 500;
}

.status-badge--phase {
  font-weight: 500;
}

.status-badge--hours {
  font-weight: 500;
}

/* State-specific styles */
.status-badge--pending {
  animation: pulse-subtle 2s infinite;
}

.status-badge--in_progress {
  position: relative;
  overflow: hidden;
}

.status-badge--in_progress::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

.status-badge--completed {
  box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.3);
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>
