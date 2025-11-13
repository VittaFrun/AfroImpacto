<template>
  <div class="loading-state">
    <div v-if="loading" class="loading-content">
      <v-progress-circular
        :size="size"
        :width="width"
        :color="color"
        indeterminate
      />
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: 'Cargando...',
  },
  size: {
    type: [Number, String],
    default: 64,
  },
  width: {
    type: [Number, String],
    default: 4,
  },
  color: {
    type: String,
    default: 'primary',
  },
});
</script>

<style scoped>
.loading-state {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--afro-space-md);
}

.loading-message {
  color: var(--afro-text-secondary);
  font-size: var(--afro-text-sm);
  margin: 0;
}
</style>

