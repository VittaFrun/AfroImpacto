<template>
  <v-card
    :class="cardClasses"
    :elevation="computedElevation"
    :variant="variant"
    :color="color"
    :rounded="rounded"
    v-bind="$attrs"
  >
    <!-- Header Slot -->
    <div v-if="$slots.header || title || subtitle" class="card-header">
      <slot name="header">
        <v-card-title v-if="title" :class="titleClasses">
          <div class="d-flex align-center">
            <v-icon
              v-if="headerIcon"
              :color="headerIconColor"
              :size="headerIconSize"
              class="mr-3"
            >
              {{ headerIcon }}
            </v-icon>
            <div class="flex-grow-1">
              <h3 class="card-title">{{ title }}</h3>
              <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
            </div>
            <div v-if="$slots.headerActions" class="header-actions">
              <slot name="headerActions" />
            </div>
          </div>
        </v-card-title>
      </slot>
    </div>

    <!-- Content -->
    <v-card-text v-if="$slots.default" :class="contentClasses">
      <slot />
    </v-card-text>

    <!-- Actions -->
    <v-card-actions v-if="$slots.actions" :class="actionsClasses">
      <slot name="actions" />
    </v-card-actions>

    <!-- Loading Overlay -->
    <v-overlay
      v-if="loading"
      :model-value="loading"
      contained
      persistent
      class="loading-overlay"
    >
      <div class="loading-content">
        <v-progress-circular
          :color="loadingColor"
          :size="loadingSize"
          indeterminate
        />
        <p v-if="loadingText" class="loading-text">{{ loadingText }}</p>
      </div>
    </v-overlay>

    <!-- Error State -->
    <div v-if="error && !loading" class="error-state">
      <v-alert
        type="error"
        variant="tonal"
        :text="error"
        class="ma-4"
      >
        <template #prepend>
          <v-icon>mdi-alert-circle</v-icon>
        </template>
        <template #append v-if="$slots.errorActions">
          <slot name="errorActions" />
        </template>
      </v-alert>
    </div>

    <!-- Empty State -->
    <div v-if="empty && !loading && !error" class="empty-state">
      <div class="empty-content">
        <v-icon
          :color="emptyIconColor"
          :size="emptyIconSize"
          class="empty-icon"
        >
          {{ emptyIcon }}
        </v-icon>
        <h4 class="empty-title">{{ emptyTitle }}</h4>
        <p v-if="emptyText" class="empty-text">{{ emptyText }}</p>
        <div v-if="$slots.emptyActions" class="empty-actions">
          <slot name="emptyActions" />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Card Appearance
  variant: {
    type: String,
    default: 'elevated',
    validator: (value) => ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'].includes(value)
  },
  elevation: {
    type: [String, Number],
    default: null
  },
  color: {
    type: String,
    default: null
  },
  rounded: {
    type: [String, Boolean],
    default: 'lg'
  },
  
  // Header
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  headerIcon: {
    type: String,
    default: ''
  },
  headerIconColor: {
    type: String,
    default: 'primary'
  },
  headerIconSize: {
    type: [String, Number],
    default: 'default'
  },
  
  // States
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  },
  loadingColor: {
    type: String,
    default: 'primary'
  },
  loadingSize: {
    type: [String, Number],
    default: 40
  },
  
  error: {
    type: String,
    default: ''
  },
  
  empty: {
    type: Boolean,
    default: false
  },
  emptyTitle: {
    type: String,
    default: 'Sin datos'
  },
  emptyText: {
    type: String,
    default: 'No hay información para mostrar'
  },
  emptyIcon: {
    type: String,
    default: 'mdi-inbox'
  },
  emptyIconColor: {
    type: String,
    default: 'grey'
  },
  emptyIconSize: {
    type: [String, Number],
    default: 64
  },
  
  // Layout
  interactive: {
    type: Boolean,
    default: false
  },
  hover: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  
  // Custom Classes
  cardClass: {
    type: [String, Array, Object],
    default: ''
  },
  headerClass: {
    type: [String, Array, Object],
    default: ''
  },
  contentClass: {
    type: [String, Array, Object],
    default: ''
  },
  actionsClass: {
    type: [String, Array, Object],
    default: ''
  }
});

// Computed Properties
const computedElevation = computed(() => {
  if (props.elevation !== null) return props.elevation;
  if (props.variant === 'elevated') return props.hover ? 8 : 2;
  return 0;
});

const cardClasses = computed(() => {
  const classes = ['professional-card'];
  
  if (props.interactive) classes.push('professional-card--interactive');
  if (props.hover) classes.push('professional-card--hover');
  if (props.dense) classes.push('professional-card--dense');
  if (props.loading) classes.push('professional-card--loading');
  if (props.error) classes.push('professional-card--error');
  if (props.empty) classes.push('professional-card--empty');
  
  // Add custom classes
  if (props.cardClass) {
    if (typeof props.cardClass === 'string') {
      classes.push(props.cardClass);
    } else if (Array.isArray(props.cardClass)) {
      classes.push(...props.cardClass);
    } else {
      Object.keys(props.cardClass).forEach(key => {
        if (props.cardClass[key]) classes.push(key);
      });
    }
  }
  
  return classes;
});

const titleClasses = computed(() => {
  const classes = ['professional-card__title'];
  if (props.dense) classes.push('professional-card__title--dense');
  return classes;
});

const contentClasses = computed(() => {
  const classes = ['professional-card__content'];
  if (props.dense) classes.push('professional-card__content--dense');
  
  if (props.contentClass) {
    if (typeof props.contentClass === 'string') {
      classes.push(props.contentClass);
    } else if (Array.isArray(props.contentClass)) {
      classes.push(...props.contentClass);
    }
  }
  
  return classes;
});

const actionsClasses = computed(() => {
  const classes = ['professional-card__actions'];
  if (props.dense) classes.push('professional-card__actions--dense');
  
  if (props.actionsClass) {
    if (typeof props.actionsClass === 'string') {
      classes.push(props.actionsClass);
    } else if (Array.isArray(props.actionsClass)) {
      classes.push(...props.actionsClass);
    }
  }
  
  return classes;
});
</script>

<style scoped>
.professional-card {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.professional-card--interactive {
  cursor: pointer;
}

.professional-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.professional-card--dense {
  .card-header {
    padding: 12px 16px;
  }
  
  .professional-card__content--dense {
    padding: 12px 16px;
  }
  
  .professional-card__actions--dense {
    padding: 8px 16px;
  }
}

.professional-card--loading {
  pointer-events: none;
}

/* Header Styles */
.card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
  line-height: 1.4;
}

.card-subtitle {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 4px 0 0 0;
  line-height: 1.3;
}

.professional-card__title--dense .card-title {
  font-size: 1.125rem;
}

.professional-card__title--dense .card-subtitle {
  font-size: 0.8125rem;
}

.header-actions {
  margin-left: auto;
}

/* Content Styles */
.professional-card__content {
  color: rgb(var(--v-theme-on-surface));
}

.professional-card__content--dense {
  font-size: 0.875rem;
}

/* Actions Styles */
.professional-card__actions {
  border-top: 1px solid rgba(var(--v-border-color), 0.1);
  background: rgba(var(--v-theme-surface), 0.5);
}

/* Loading Overlay */
.loading-overlay {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(2px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-text {
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}

/* Error State */
.error-state {
  min-height: 120px;
  display: flex;
  align-items: center;
}

/* Empty State */
.empty-state {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.empty-content {
  text-align: center;
  max-width: 300px;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 8px 0;
}

.empty-text {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.empty-actions {
  margin-top: 16px;
}

/* Responsive Design */
@media (max-width: 600px) {
  .professional-card {
    margin: 8px;
  }
  
  .card-header {
    padding: 16px;
  }
  
  .professional-card__content {
    padding: 16px;
  }
  
  .professional-card__actions {
    padding: 12px 16px;
  }
  
  .card-title {
    font-size: 1.125rem;
  }
  
  .card-subtitle {
    font-size: 0.8125rem;
  }
}

/* Dark Theme Support */
@media (prefers-color-scheme: dark) {
  .professional-card {
    background: rgb(var(--v-theme-surface));
    border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  }
  
  .card-header {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
    border-bottom-color: rgba(var(--v-border-color), 0.2);
  }
}

/* Animation Classes */
.professional-card.fade-enter-active,
.professional-card.fade-leave-active {
  transition: opacity 0.3s ease;
}

.professional-card.fade-enter-from,
.professional-card.fade-leave-to {
  opacity: 0;
}

.professional-card.slide-enter-active,
.professional-card.slide-leave-active {
  transition: transform 0.3s ease;
}

.professional-card.slide-enter-from {
  transform: translateY(20px);
}

.professional-card.slide-leave-to {
  transform: translateY(-20px);
}
</style>