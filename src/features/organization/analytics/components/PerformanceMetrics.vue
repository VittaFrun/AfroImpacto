<template>
  <div class="performance-metrics">
    <div v-if="loading" class="loading-state">
      <v-skeleton-loader type="list-item@3"></v-skeleton-loader>
    </div>
    
    <div v-else-if="!data" class="empty-state">
      <v-icon size="48" color="grey-lighten-1">mdi-speedometer</v-icon>
      <p class="text-body-2 text-grey-darken-1 mt-2">No hay datos de rendimiento</p>
    </div>
    
    <div v-else class="metrics-content">
      <!-- Efficiency Score -->
      <div class="metric-item">
        <div class="metric-header">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="success">mdi-chart-line</v-icon>
            <span class="metric-title">Eficiencia de Proyectos</span>
          </div>
          <v-chip
            :color="getEfficiencyColor(data.eficienciaProyectos)"
            size="small"
            variant="tonal"
          >
            {{ data.eficienciaProyectos || 0 }}%
          </v-chip>
        </div>
        <div class="metric-progress mt-2">
          <v-progress-linear
            :model-value="data.eficienciaProyectos || 0"
            :color="getEfficiencyColor(data.eficienciaProyectos)"
            height="8"
            rounded
          ></v-progress-linear>
        </div>
        <p class="metric-description text-caption text-grey-darken-1 mt-1">
          Porcentaje de proyectos completados exitosamente
        </p>
      </div>

      <!-- Tasks On Time -->
      <div class="metric-item">
        <div class="metric-header">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="info">mdi-clock-check</v-icon>
            <span class="metric-title">Tareas a Tiempo</span>
          </div>
          <v-chip
            :color="getTimelinessColor(data.tareasCompletadasATiempo)"
            size="small"
            variant="tonal"
          >
            {{ data.tareasCompletadasATiempo || 0 }}%
          </v-chip>
        </div>
        <div class="metric-progress mt-2">
          <v-progress-linear
            :model-value="data.tareasCompletadasATiempo || 0"
            :color="getTimelinessColor(data.tareasCompletadasATiempo)"
            height="8"
            rounded
          ></v-progress-linear>
        </div>
        <p class="metric-description text-caption text-grey-darken-1 mt-1">
          Tareas completadas dentro del plazo establecido
        </p>
      </div>

      <!-- Volunteer Satisfaction -->
      <div class="metric-item">
        <div class="metric-header">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="warning">mdi-heart</v-icon>
            <span class="metric-title">Satisfacción de Voluntarios</span>
          </div>
          <div class="d-flex align-center">
            <div class="rating-stars mr-2">
              <v-icon
                v-for="star in 5"
                :key="star"
                :color="star <= getSatisfactionStars(data.satisfaccionVoluntarios) ? 'warning' : 'grey-lighten-1'"
                size="small"
              >
                mdi-star
              </v-icon>
            </div>
            <v-chip
              color="warning"
              size="small"
              variant="tonal"
            >
              {{ data.satisfaccionVoluntarios || 0 }}%
            </v-chip>
          </div>
        </div>
        <div class="metric-progress mt-2">
          <v-progress-linear
            :model-value="data.satisfaccionVoluntarios || 0"
            color="warning"
            height="8"
            rounded
          ></v-progress-linear>
        </div>
        <p class="metric-description text-caption text-grey-darken-1 mt-1">
          Nivel de satisfacción promedio de los voluntarios
        </p>
      </div>

      <!-- Performance Summary -->
      <div class="performance-summary mt-4">
        <v-card variant="tonal" color="primary" class="pa-4">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="48" class="mr-4">
              <v-icon color="white">mdi-trophy</v-icon>
            </v-avatar>
            <div>
              <h4 class="text-h6 font-weight-bold">
                Puntuación General: {{ getOverallScore() }}/100
              </h4>
              <p class="text-body-2 mb-0">
                {{ getPerformanceMessage() }}
              </p>
            </div>
          </div>
        </v-card>
      </div>

      <!-- Recommendations -->
      <div class="recommendations mt-4">
        <h5 class="text-subtitle-1 font-weight-medium mb-3">
          <v-icon class="mr-2" size="small">mdi-lightbulb</v-icon>
          Recomendaciones
        </h5>
        <div class="recommendation-list">
          <v-alert
            v-for="(recommendation, index) in getRecommendations()"
            :key="index"
            :type="recommendation.type"
            variant="tonal"
            density="compact"
            class="mb-2"
          >
            <template #prepend>
              <v-icon :icon="recommendation.icon"></v-icon>
            </template>
            {{ recommendation.message }}
          </v-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Methods
const getEfficiencyColor = (efficiency) => {
  if (efficiency >= 80) return 'success';
  if (efficiency >= 60) return 'warning';
  return 'error';
};

const getTimelinessColor = (timeliness) => {
  if (timeliness >= 85) return 'success';
  if (timeliness >= 70) return 'info';
  if (timeliness >= 50) return 'warning';
  return 'error';
};

const getSatisfactionStars = (satisfaction) => {
  return Math.round((satisfaction / 100) * 5);
};

const getOverallScore = () => {
  if (!props.data) return 0;
  
  const efficiency = props.data.eficienciaProyectos || 0;
  const timeliness = props.data.tareasCompletadasATiempo || 0;
  const satisfaction = props.data.satisfaccionVoluntarios || 0;
  
  return Math.round((efficiency + timeliness + satisfaction) / 3);
};

const getPerformanceMessage = () => {
  const score = getOverallScore();
  
  if (score >= 85) return 'Excelente rendimiento general';
  if (score >= 70) return 'Buen rendimiento con oportunidades de mejora';
  if (score >= 50) return 'Rendimiento promedio, se requiere atención';
  return 'Rendimiento bajo, se necesita mejora urgente';
};

const getRecommendations = () => {
  if (!props.data) return [];
  
  const recommendations = [];
  const efficiency = props.data.eficienciaProyectos || 0;
  const timeliness = props.data.tareasCompletadasATiempo || 0;
  const satisfaction = props.data.satisfaccionVoluntarios || 0;
  
  if (efficiency < 70) {
    recommendations.push({
      type: 'warning',
      icon: 'mdi-chart-line',
      message: 'Considera revisar la planificación de proyectos para mejorar la tasa de finalización.'
    });
  }
  
  if (timeliness < 75) {
    recommendations.push({
      type: 'info',
      icon: 'mdi-clock-alert',
      message: 'Implementa recordatorios automáticos para mejorar el cumplimiento de plazos.'
    });
  }
  
  if (satisfaction < 80) {
    recommendations.push({
      type: 'error',
      icon: 'mdi-account-heart',
      message: 'Realiza encuestas de satisfacción para identificar áreas de mejora en la experiencia del voluntario.'
    });
  }
  
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      icon: 'mdi-check-circle',
      message: '¡Excelente trabajo! Mantén estos niveles de rendimiento.'
    });
  }
  
  return recommendations;
};
</script>

<style scoped>
.performance-metrics {
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

.metrics-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.metric-item {
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.metric-title {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

.metric-progress {
  margin: 8px 0;
}

.metric-description {
  margin-top: 4px;
  line-height: 1.4;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.performance-summary {
  margin-top: 24px;
}

.recommendations {
  margin-top: 24px;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.v-progress-linear {
  border-radius: 4px;
}

.v-chip {
  font-weight: 600;
}
</style>
