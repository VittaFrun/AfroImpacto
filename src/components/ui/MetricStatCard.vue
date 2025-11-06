<template>
  <div class="afro-metric-card afro-card-elevated">
    <div class="metric-header">
      <div class="metric-icon" :class="iconColor">
        <v-icon color="white">{{ icon }}</v-icon>
      </div>
      <div v-if="trendText" class="metric-trend" :class="trendColor">
        <v-icon size="16">{{ trendIcon }}</v-icon>
        {{ trendText }}
      </div>
    </div>
    <div class="metric-content">
      <div class="afro-metric-value" :class="valueColor">{{ value }}</div>
      <div class="afro-metric-label">{{ title }}</div>
      <div v-if="detail || $slots.detail" class="metric-detail">
        <slot name="detail">
          <template v-if="detail">{{ detail }}</template>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'mdi-information' },
  iconColor: { type: String, default: 'primary' }, // success|info|warning|primary
  value: { type: [String, Number], required: true },
  valueColor: { type: String, default: '' }, // optional text color class
  detail: { type: String, default: '' },
  trendText: { type: String, default: '' },
  trendIcon: { type: String, default: 'mdi-trending-up' },
  trendColor: { type: String, default: 'success' }
});
</script>

<style scoped>
.afro-metric-card {
  padding: var(--afro-space-lg);
  position: relative;
  overflow: hidden;
  background: var(--afro-surface);
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-lg);
  transition: all var(--afro-transition-normal);
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Use the elevated card shadow from design system */
.afro-card-elevated {
  box-shadow: var(--afro-shadow-md);
}

.afro-card-elevated:hover {
  box-shadow: var(--afro-shadow-lg);
  transform: translateY(-2px);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-md);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--afro-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-icon.primary {
  background: var(--afro-primary);
}

.metric-icon.success {
  background: var(--afro-success);
}

.metric-icon.info {
  background: var(--afro-info);
}

.metric-icon.warning {
  background: var(--afro-warning);
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: var(--afro-space-xs);
  font-size: var(--afro-text-sm);
  font-weight: 600;
}

.metric-trend.success {
  color: var(--afro-success);
}

.metric-trend.error {
  color: var(--afro-error);
}

.metric-content {
  text-align: left;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.afro-metric-value {
  font-size: var(--afro-text-3xl);
  font-weight: 700;
  line-height: 1.2;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.afro-metric-value.primary {
  color: var(--afro-primary);
}

.afro-metric-value.success {
  color: var(--afro-success);
}

.afro-metric-value.info {
  color: var(--afro-info);
}

.afro-metric-value.warning {
  color: var(--afro-warning);
}

.afro-metric-label {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--afro-space-sm);
}

.metric-detail {
  margin-top: var(--afro-space-sm);
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .afro-metric-card {
    padding: var(--afro-space-md);
  }
  
  .afro-metric-value {
    font-size: var(--afro-text-2xl);
  }
  
  .metric-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
