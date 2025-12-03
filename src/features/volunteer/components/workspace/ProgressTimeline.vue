<template>
  <v-card class="progress-timeline-card" variant="outlined" rounded="lg">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2" color="primary">mdi-timeline</v-icon>
      <span class="text-h6 font-weight-bold">Línea de Tiempo</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <div v-if="loading" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="activities.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-timeline-outline</v-icon>
        <p class="text-grey mt-4">No hay actividades registradas</p>
      </div>
      <div v-else class="timeline-container">
        <div
          v-for="(activity, index) in activities"
          :key="activity.id"
          class="timeline-item"
        >
          <div class="timeline-marker">
            <v-icon :color="getActivityColor(activity.type)" size="20">
              {{ getActivityIcon(activity.type) }}
            </v-icon>
          </div>
          <div class="timeline-content">
            <div class="timeline-date text-caption text-grey mb-1">
              {{ formatDate(activity.fecha) }}
            </div>
            <div class="timeline-title text-body-2 font-weight-medium mb-1">
              {{ activity.titulo }}
            </div>
            <div v-if="activity.descripcion" class="timeline-description text-body-2 text-grey">
              {{ activity.descripcion }}
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const getActivityIcon = (type) => {
  const icons = {
    'task_completed': 'mdi-check-circle',
    'hours_registered': 'mdi-clock-check',
    'milestone': 'mdi-flag',
    'comment': 'mdi-comment',
    'status_change': 'mdi-update'
  };
  return icons[type] || 'mdi-circle';
};

const getActivityColor = (type) => {
  const colors = {
    'task_completed': 'success',
    'hours_registered': 'info',
    'milestone': 'primary',
    'comment': 'grey',
    'status_change': 'warning'
  };
  return colors[type] || 'grey';
};
</script>

<style scoped>
.timeline-container {
  position: relative;
  padding-left: 32px;
}

.timeline-item {
  position: relative;
  padding-bottom: 24px;
  padding-left: 24px;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 32px;
  bottom: -8px;
  width: 2px;
  background: linear-gradient(to bottom, #e0e0e0, transparent);
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 4px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  z-index: 1;
}

.timeline-content {
  background: rgba(0, 0, 0, 0.02);
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.timeline-item:hover .timeline-content {
  background: rgba(0, 0, 0, 0.04);
}

.timeline-date {
  font-weight: 500;
}

.timeline-title {
  color: #1976d2;
}

.timeline-description {
  margin-top: 4px;
}
</style>

