<template>
  <div class="recent-activity">
    <div v-if="loading" class="loading-state">
      <v-skeleton-loader type="list-item@4"></v-skeleton-loader>
    </div>
    
    <div v-else-if="!activities || activities.length === 0" class="empty-state">
      <v-icon size="48" color="grey-lighten-1">mdi-history</v-icon>
      <p class="text-body-2 text-grey-darken-1 mt-2">No hay actividad reciente</p>
    </div>
    
    <div v-else class="activity-list">
      <div
        v-for="(activity, index) in limitedActivities"
        :key="index"
        class="activity-item"
        :class="{ 'activity-item--recent': isRecent(activity.timestamp) }"
      >
        <div class="activity-icon">
          <v-avatar
            :color="getActivityColor(activity.type)"
            size="40"
            variant="tonal"
          >
            <v-icon :icon="getActivityIcon(activity.type)" size="20"></v-icon>
          </v-avatar>
        </div>
        
        <div class="activity-content">
          <div class="activity-header">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-time">{{ formatRelativeTime(activity.timestamp) }}</span>
          </div>
          
          <p class="activity-description">{{ activity.description }}</p>
          
          <div v-if="activity.metadata" class="activity-metadata">
            <v-chip
              v-for="(value, key) in activity.metadata"
              :key="key"
              size="x-small"
              variant="outlined"
              class="mr-1"
            >
              {{ key }}: {{ value }}
            </v-chip>
          </div>
        </div>
        
        <div class="activity-actions">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-dots-vertical"
                size="small"
                variant="text"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetails(activity)">
                <template #prepend>
                  <v-icon>mdi-eye</v-icon>
                </template>
                <v-list-item-title>Ver Detalles</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navigateToSource(activity)" v-if="activity.link">
                <template #prepend>
                  <v-icon>mdi-open-in-new</v-icon>
                </template>
                <v-list-item-title>Ir al Origen</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      
      <!-- Show More Button -->
      <div v-if="activities.length > displayLimit" class="show-more-section">
        <v-btn
          variant="outlined"
          size="small"
          @click="showAll = !showAll"
          block
        >
          {{ showAll ? 'Mostrar Menos' : `Ver ${activities.length - displayLimit} Más` }}
          <v-icon :icon="showAll ? 'mdi-chevron-up' : 'mdi-chevron-down'" end></v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  maxItems: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['view-details', 'navigate']);

// Reactive data
const showAll = ref(false);
const displayLimit = ref(5);

// Computed
const limitedActivities = computed(() => {
  if (showAll.value) return props.activities.slice(0, props.maxItems);
  return props.activities.slice(0, displayLimit.value);
});

// Methods
const getActivityIcon = (type) => {
  const icons = {
    'project_created': 'mdi-folder-plus',
    'project_completed': 'mdi-check-circle',
    'task_assigned': 'mdi-account-plus',
    'task_completed': 'mdi-check',
    'volunteer_joined': 'mdi-account-heart',
    'volunteer_left': 'mdi-account-minus',
    'hours_logged': 'mdi-clock-plus',
    'report_generated': 'mdi-file-chart',
    'comment_added': 'mdi-comment-plus',
    'phase_completed': 'mdi-flag-checkered',
    'deadline_missed': 'mdi-alert-circle',
    'milestone_reached': 'mdi-trophy',
    'default': 'mdi-information'
  };
  return icons[type] || icons.default;
};

const getActivityColor = (type) => {
  const colors = {
    'project_created': 'primary',
    'project_completed': 'success',
    'task_assigned': 'info',
    'task_completed': 'success',
    'volunteer_joined': 'success',
    'volunteer_left': 'warning',
    'hours_logged': 'info',
    'report_generated': 'primary',
    'comment_added': 'secondary',
    'phase_completed': 'success',
    'deadline_missed': 'error',
    'milestone_reached': 'warning',
    'default': 'grey'
  };
  return colors[type] || colors.default;
};

const formatRelativeTime = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: es 
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

const isRecent = (timestamp) => {
  const now = new Date();
  const activityDate = new Date(timestamp);
  const diffInHours = (now - activityDate) / (1000 * 60 * 60);
  return diffInHours <= 24; // Consider recent if within 24 hours
};

const viewDetails = (activity) => {
  emit('view-details', activity);
};

const navigateToSource = (activity) => {
  if (activity.link) {
    emit('navigate', activity.link);
  }
};

// Generate mock activities for demonstration
const generateMockActivities = () => {
  const mockTypes = [
    {
      type: 'project_created',
      title: 'Nuevo proyecto creado',
      description: 'Se creó el proyecto "Campaña de Vacunación"',
      metadata: { proyecto: 'Campaña de Vacunación' }
    },
    {
      type: 'volunteer_joined',
      title: 'Voluntario se unió',
      description: 'María González se unió al proyecto',
      metadata: { voluntario: 'María González' }
    },
    {
      type: 'task_completed',
      title: 'Tarea completada',
      description: 'Se completó la tarea "Preparar materiales"',
      metadata: { tarea: 'Preparar materiales' }
    },
    {
      type: 'hours_logged',
      title: 'Horas registradas',
      description: 'Juan Pérez registró 4 horas de trabajo',
      metadata: { horas: '4h', voluntario: 'Juan Pérez' }
    },
    {
      type: 'phase_completed',
      title: 'Fase completada',
      description: 'Se completó la fase "Planificación"',
      metadata: { fase: 'Planificación' }
    }
  ];

  return mockTypes.map((activity, index) => ({
    ...activity,
    timestamp: new Date(Date.now() - (index * 2 * 60 * 60 * 1000)), // 2 hours apart
    id: `activity_${index}`,
    link: `/projects/1` // Example link
  }));
};

// If no activities provided, use mock data for demonstration
const finalActivities = computed(() => {
  return props.activities.length > 0 ? props.activities : generateMockActivities();
});
</script>

<style scoped>
.recent-activity {
  width: 100%;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: rgba(0, 0, 0, 0.6);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.activity-item:hover {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.1);
}

.activity-item--recent {
  background: rgba(33, 150, 243, 0.05);
  border-color: rgba(33, 150, 243, 0.2);
}

.activity-icon {
  flex-shrink: 0;
}

.activity-content {
  flex-grow: 1;
  min-width: 0;
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.activity-title {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.875rem;
}

.activity-time {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  white-space: nowrap;
}

.activity-description {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.activity-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.activity-actions {
  flex-shrink: 0;
}

.show-more-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.v-chip {
  font-size: 0.7rem;
}
</style>
