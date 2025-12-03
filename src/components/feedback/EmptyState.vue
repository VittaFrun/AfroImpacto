<template>
  <div class="empty-state" :class="variant">
    <div class="empty-state-content">
      <div class="empty-state-icon">
        <v-icon
          :size="iconSize"
          :color="iconColor"
        >
          {{ icon }}
        </v-icon>
      </div>
      
      <h3 v-if="title" class="empty-state-title">
        {{ title }}
      </h3>
      
      <p v-if="description" class="empty-state-description">
        {{ description }}
      </p>
      
      <div v-if="$slots.actions || action" class="empty-state-actions">
        <slot name="actions">
          <v-btn
            v-if="action"
            :color="actionColor"
            :variant="actionVariant"
            :prepend-icon="actionIcon"
            @click="handleAction"
          >
            {{ actionLabel }}
          </v-btn>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-inbox'
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'error', 'search', 'no-data'].includes(value)
  },
  iconSize: {
    type: [Number, String],
    default: 64
  },
  iconColor: {
    type: String,
    default: 'grey-lighten-1'
  },
  action: {
    type: Function,
    default: null
  },
  actionLabel: {
    type: String,
    default: 'Acción'
  },
  actionIcon: {
    type: String,
    default: null
  },
  actionColor: {
    type: String,
    default: 'primary'
  },
  actionVariant: {
    type: String,
    default: 'flat'
  }
});

const emit = defineEmits(['action']);

const handleAction = () => {
  if (props.action) {
    props.action();
  }
  emit('action');
};
</script>

<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 300px;
}

.empty-state-content {
  text-align: center;
  max-width: 500px;
}

.empty-state-icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 12px;
}

.empty-state-description {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.5;
  margin-bottom: 24px;
}

.empty-state-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* Variants */
.empty-state.error .empty-state-icon {
  color: rgb(var(--v-theme-error));
}

.empty-state.error .empty-state-title {
  color: rgb(var(--v-theme-error));
}

.empty-state.search .empty-state-title {
  color: rgba(0, 0, 0, 0.6);
}

.empty-state.no-data .empty-state-icon {
  opacity: 0.5;
}
</style>

