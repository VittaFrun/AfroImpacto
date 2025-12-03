<template>
  <div class="loading-wrapper">
    <!-- Skeleton Loader -->
    <div v-if="loading && skeleton && !error" class="skeleton-container">
      <slot name="skeleton">
        <v-row>
          <v-col 
            v-for="n in skeletonCount" 
            :key="n" 
            :cols="skeletonCols"
            :md="skeletonMd"
            :lg="skeletonLg"
          >
            <v-skeleton-loader 
              :type="skeletonType" 
              class="mb-4"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </slot>
    </div>

    <!-- Full Loading Overlay -->
    <div v-else-if="loading && !error && !skeleton" class="loading-overlay">
      <div class="loading-content">
        <v-progress-circular
          :size="size"
          :width="width"
          :color="color"
          indeterminate
          class="mb-4"
        />
        <p v-if="message" class="loading-message">{{ message }}</p>
        <p v-else class="loading-message">{{ defaultMessage }}</p>
      </div>
    </div>

    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      :error="error"
      :message="errorMessage"
      :title="errorTitle"
      :show-retry="showRetry"
      @retry="$emit('retry')"
    />

    <!-- Content -->
    <div v-else class="content-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup>
import ErrorState from './ErrorState.vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [Error, Object, String, null],
    default: null
  },
  message: {
    type: String,
    default: ''
  },
  defaultMessage: {
    type: String,
    default: 'Cargando...'
  },
  size: {
    type: [Number, String],
    default: 64
  },
  width: {
    type: [Number, String],
    default: 4
  },
  color: {
    type: String,
    default: 'primary'
  },
  skeleton: {
    type: Boolean,
    default: false
  },
  skeletonType: {
    type: String,
    default: 'card'
  },
  skeletonCount: {
    type: Number,
    default: 4
  },
  skeletonCols: {
    type: [Number, String],
    default: 12
  },
  skeletonMd: {
    type: [Number, String],
    default: 6
  },
  skeletonLg: {
    type: [Number, String],
    default: 3
  },
  errorMessage: {
    type: String,
    default: null
  },
  errorTitle: {
    type: String,
    default: null
  },
  showRetry: {
    type: Boolean,
    default: true
  }
});

defineEmits(['retry']);
</script>

<style scoped>
.loading-wrapper {
  position: relative;
  min-height: 200px;
}

.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: var(--afro-space-2xl);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--afro-space-md);
}

.loading-message {
  color: var(--afro-text-secondary);
  font-size: var(--afro-text-base);
  margin: 0;
  text-align: center;
}

.skeleton-container {
  padding: var(--afro-space-lg);
}

.content-wrapper {
  width: 100%;
}
</style>

