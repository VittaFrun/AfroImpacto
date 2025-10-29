<template>
  <div class="availability-view">
    <!-- Header Section -->
    <div class="page-header">
      <div class="d-flex align-center justify-space-between">
        <div>
          <h1 class="afro-heading-2 mb-2">Mi Disponibilidad</h1>
          <p class="afro-body-small">
            Gestiona tu disponibilidad para proyectos y actividades
          </p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-content-save"
            class="professional-save-btn"
            @click="saveAvailability"
            :loading="saving"
          >
            Guardar Cambios
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="afro-grid afro-grid-4 mb-6">
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ totalAvailableHours }}</div>
          <div class="afro-metric-label">Horas Disponibles</div>
          <div class="metric-icon">
            <v-icon size="32" color="success">mdi-clock-check</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ availableDays }}</div>
          <div class="afro-metric-label">Días Disponibles</div>
          <div class="metric-icon">
            <v-icon size="32" color="info">mdi-calendar-check</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ scheduledHours }}</div>
          <div class="afro-metric-label">Horas Programadas</div>
          <div class="metric-icon">
            <v-icon size="32" color="warning">mdi-calendar-clock</v-icon>
          </div>
        </div>
      </div>
      
      <div class="afro-metric-card afro-card-elevated">
        <div class="metric-content">
          <div class="afro-metric-value">{{ freeHours }}</div>
          <div class="afro-metric-label">Horas Libres</div>
          <div class="metric-icon">
            <v-icon size="32" color="primary">mdi-clock-outline</v-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="afro-grid afro-grid-3">
      <!-- Calendar View -->
      <div class="afro-card afro-card-elevated calendar-section">
        <div class="card-header">
          <h3 class="afro-heading-4">Calendario de Disponibilidad</h3>
          <div class="calendar-controls">
            <v-btn
              icon
              variant="text"
              @click="previousWeek"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span class="current-week">{{ currentWeekLabel }}</span>
            <v-btn
              icon
              variant="text"
              @click="nextWeek"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
        
        <div class="card-content">
          <div class="calendar-grid">
            <div class="calendar-header">
              <div class="time-header">Hora</div>
              <div
                v-for="day in weekDays"
                :key="day.date"
                class="day-header"
              >
                <div class="day-name">{{ day.name }}</div>
                <div class="day-date">{{ formatDay(day.date) }}</div>
              </div>
            </div>
            
            <div class="calendar-body">
              <div
                v-for="timeSlot in timeSlots"
                :key="timeSlot.time"
                class="time-row"
              >
                <div class="time-label">{{ timeSlot.time }}</div>
                <div
                  v-for="day in weekDays"
                  :key="`${day.date}-${timeSlot.time}`"
                  class="time-cell"
                  :class="getTimeCellClass(day.date, timeSlot.time)"
                  @click="toggleTimeSlot(day.date, timeSlot.time)"
                >
                  <v-icon
                    v-if="isTimeSlotAvailable(day.date, timeSlot.time)"
                    size="16"
                    color="white"
                  >
                    mdi-check
                  </v-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Settings -->
      <div class="afro-card afro-card-elevated">
        <div class="card-header">
          <h3 class="afro-heading-4">Configuración Rápida</h3>
        </div>
        
        <div class="card-content">
          <!-- Default Schedule -->
          <div class="setting-section">
            <h4 class="setting-title">Horario por Defecto</h4>
            <div class="schedule-presets">
              <v-btn
                v-for="preset in schedulePresets"
                :key="preset.name"
                :color="selectedPreset === preset.name ? 'primary' : 'grey'"
                :variant="selectedPreset === preset.name ? 'flat' : 'outlined'"
                size="small"
                @click="applyPreset(preset)"
                class="preset-btn"
              >
                {{ preset.name }}
              </v-btn>
            </div>
          </div>

          <!-- Time Blocks -->
          <div class="setting-section">
            <h4 class="setting-title">Bloques de Tiempo</h4>
            <div class="time-blocks">
              <v-checkbox
                v-for="block in timeBlocks"
                :key="block.value"
                v-model="selectedTimeBlocks"
                :value="block.value"
                :label="block.label"
                color="primary"
                density="compact"
              ></v-checkbox>
            </div>
          </div>

          <!-- Days of Week -->
          <div class="setting-section">
            <h4 class="setting-title">Días de la Semana</h4>
            <div class="week-days">
              <v-checkbox
                v-for="day in weekDayOptions"
                :key="day.value"
                v-model="selectedWeekDays"
                :value="day.value"
                :label="day.label"
                color="primary"
                density="compact"
              ></v-checkbox>
            </div>
          </div>

          <!-- Apply to All -->
          <div class="setting-actions">
            <v-btn
              color="success"
              variant="outlined"
              block
              @click="applyToAll"
            >
              <v-icon start>mdi-check-all</v-icon>
              Aplicar a Todos
            </v-btn>
            <v-btn
              color="error"
              variant="outlined"
              block
              @click="clearAll"
            >
              <v-icon start>mdi-close</v-icon>
              Limpiar Todo
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Scheduled Activities -->
      <div class="afro-card afro-card-elevated">
        <div class="card-header">
          <h3 class="afro-heading-4">Actividades Programadas</h3>
          <v-btn
            variant="text"
            size="small"
            @click="viewAllActivities"
          >
            Ver todas
          </v-btn>
        </div>
        
        <div class="card-content">
          <div v-if="scheduledActivities.length === 0" class="afro-empty-state">
            <div class="afro-empty-state-icon">
              <v-icon size="48" color="grey-lighten-1">mdi-calendar-outline</v-icon>
            </div>
            <div class="afro-empty-state-title">Sin actividades programadas</div>
            <div class="afro-empty-state-description">
              Las actividades aparecerán aquí cuando te asignen tareas
            </div>
          </div>
          
          <div v-else class="activities-list">
            <div
              v-for="activity in scheduledActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-time">
                <div class="time-start">{{ formatTime(activity.startTime) }}</div>
                <div class="time-end">{{ formatTime(activity.endTime) }}</div>
              </div>
              <div class="activity-content">
                <h4 class="activity-title">{{ activity.title }}</h4>
                <p class="activity-project">{{ activity.project }}</p>
                <div class="activity-status">
                        <v-chip
                    :color="getActivityStatusColor(activity.status)"
                    size="small"
                    variant="tonal"
                  >
                    {{ activity.status }}
                        </v-chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="afro-card afro-card-elevated mt-6">
      <div class="card-content">
        <h3 class="afro-heading-4 mb-4">Leyenda</h3>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-color available"></div>
            <span>Disponible</span>
          </div>
          <div class="legend-item">
            <div class="legend-color scheduled"></div>
            <span>Programado</span>
          </div>
          <div class="legend-item">
            <div class="legend-color unavailable"></div>
            <span>No Disponible</span>
          </div>
          <div class="legend-item">
            <div class="legend-color conflict"></div>
            <span>Conflicto</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive data
const saving = ref(false);
const currentWeek = ref(new Date());
const selectedPreset = ref('');
const selectedTimeBlocks = ref(['morning', 'afternoon']);
const selectedWeekDays = ref(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);

// Availability data
const availability = ref({});
const scheduledActivities = ref([
  {
    id: 1,
    title: 'Reunión de coordinación',
    project: 'Educación Comunitaria',
    startTime: '09:00',
    endTime: '10:00',
    status: 'Confirmado',
    date: '2024-02-20'
  },
  {
    id: 2,
    title: 'Sesión de capacitación',
    project: 'Salud Preventiva',
    startTime: '14:00',
    endTime: '16:00',
    status: 'Pendiente',
    date: '2024-02-21'
  },
  {
    id: 3,
    title: 'Evaluación de participantes',
    project: 'Desarrollo Económico',
    startTime: '10:00',
    endTime: '12:00',
    status: 'Confirmado',
    date: '2024-02-22'
  }
]);

// Options
const schedulePresets = [
  { name: 'Mañana', blocks: ['morning'] },
  { name: 'Tarde', blocks: ['afternoon'] },
  { name: 'Noche', blocks: ['evening'] },
  { name: 'Completo', blocks: ['morning', 'afternoon', 'evening'] },
  { name: 'Flexible', blocks: ['morning', 'afternoon'] }
];

const timeBlocks = [
  { label: 'Mañana (9:00 - 12:00)', value: 'morning' },
  { label: 'Tarde (12:00 - 17:00)', value: 'afternoon' },
  { label: 'Noche (17:00 - 21:00)', value: 'evening' }
];

const weekDayOptions = [
  { label: 'Lunes', value: 'monday' },
  { label: 'Martes', value: 'tuesday' },
  { label: 'Miércoles', value: 'wednesday' },
  { label: 'Jueves', value: 'thursday' },
  { label: 'Viernes', value: 'friday' },
  { label: 'Sábado', value: 'saturday' },
  { label: 'Domingo', value: 'sunday' }
];

const timeSlots = [
  { time: '09:00', block: 'morning' },
  { time: '10:00', block: 'morning' },
  { time: '11:00', block: 'morning' },
  { time: '12:00', block: 'afternoon' },
  { time: '13:00', block: 'afternoon' },
  { time: '14:00', block: 'afternoon' },
  { time: '15:00', block: 'afternoon' },
  { time: '16:00', block: 'afternoon' },
  { time: '17:00', block: 'evening' },
  { time: '18:00', block: 'evening' },
  { time: '19:00', block: 'evening' },
  { time: '20:00', block: 'evening' }
];

// Computed properties
const weekDays = computed(() => {
  const startOfWeek = new Date(currentWeek.value);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      date: date.toISOString().split('T')[0],
      name: date.toLocaleDateString('es-CO', { weekday: 'long' })
    });
  }
  return days;
});

const currentWeekLabel = computed(() => {
  const start = weekDays.value[0];
  const end = weekDays.value[6];
  return `${formatDate(start.date)} - ${formatDate(end.date)}`;
});

const totalAvailableHours = computed(() => {
  let count = 0;
  Object.values(availability.value).forEach(daySlots => {
    Object.values(daySlots).forEach(slot => {
      if (slot === 'available') count++;
    });
  });
  return count;
});

const availableDays = computed(() => {
  return weekDays.value.filter(day => {
    const daySlots = availability.value[day.date];
    return daySlots && Object.values(daySlots).some(slot => slot === 'available');
  }).length;
});

const scheduledHours = computed(() => {
  return scheduledActivities.value.length * 2; // Assuming 2 hours per activity
});

const freeHours = computed(() => {
  return totalAvailableHours.value - scheduledHours.value;
});

// Methods
const toggleTimeSlot = (date, time) => {
  if (!availability.value[date]) {
    availability.value[date] = {};
  }
  
  const currentStatus = availability.value[date][time];
  if (currentStatus === 'available') {
    availability.value[date][time] = 'unavailable';
  } else {
    availability.value[date][time] = 'available';
  }
};

const isTimeSlotAvailable = (date, time) => {
  return availability.value[date]?.[time] === 'available';
};

const getTimeCellClass = (date, time) => {
  const status = availability.value[date]?.[time] || 'unavailable';
  const hasConflict = checkConflict(date, time);
  
  return {
    'time-cell': true,
    [`time-cell-${status}`]: true,
    'time-cell-conflict': hasConflict
  };
};

const checkConflict = (date, time) => {
  return scheduledActivities.value.some(activity => 
    activity.date === date && 
    activity.startTime <= time && 
    activity.endTime > time
  );
};

const applyPreset = (preset) => {
  selectedPreset.value = preset.name;
  selectedTimeBlocks.value = [...preset.blocks];
};

const applyToAll = () => {
  weekDays.value.forEach(day => {
    timeSlots.forEach(slot => {
      if (selectedTimeBlocks.value.includes(slot.block)) {
        if (!availability.value[day.date]) {
          availability.value[day.date] = {};
        }
        availability.value[day.date][slot.time] = 'available';
      }
    });
  });
};

const clearAll = () => {
  availability.value = {};
};

const previousWeek = () => {
  currentWeek.value = new Date(currentWeek.value.getTime() - 7 * 24 * 60 * 60 * 1000);
};

const nextWeek = () => {
  currentWeek.value = new Date(currentWeek.value.getTime() + 7 * 24 * 60 * 60 * 1000);
};

const saveAvailability = async () => {
  saving.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Disponibilidad guardada:', availability.value);
  } catch (error) {
    console.error('Error al guardar disponibilidad:', error);
  } finally {
    saving.value = false;
  }
};

const viewAllActivities = () => {
  router.push('/volunteer/calendar');
};

const getActivityStatusColor = (status) => {
  const colorMap = {
    'Confirmado': 'success',
    'Pendiente': 'warning',
    'Cancelado': 'error'
  };
  return colorMap[status] || 'grey';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
};

const formatDay = (date) => {
  return new Date(date).toLocaleDateString('es-CO', { day: 'numeric' });
};

const formatTime = (time) => {
  return time;
};

onMounted(() => {
  // Initialize availability data
  weekDays.value.forEach(day => {
    availability.value[day.date] = {};
    timeSlots.forEach(slot => {
      availability.value[day.date][slot.time] = 'unavailable';
    });
  });
});
</script>

<style scoped>
.availability-view {
  padding: var(--afro-space-lg);
  background: var(--afro-background);
  min-height: 100vh;
}

/* Page Header */
.page-header {
  margin-bottom: var(--afro-space-xl);
}

.header-actions {
  display: flex;
  gap: var(--afro-space-md);
}

/* Metrics Cards */
.afro-metric-card {
  padding: var(--afro-space-lg);
  text-align: center;
  position: relative;
}

.metric-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--afro-space-sm);
}

.metric-icon {
  position: absolute;
  top: var(--afro-space-md);
  right: var(--afro-space-md);
  opacity: 0.1;
}

/* Calendar Section */
.calendar-section {
  grid-column: span 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--afro-space-lg);
  padding-bottom: var(--afro-space-md);
  border-bottom: 1px solid var(--afro-border);
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: var(--afro-space-md);
}

.current-week {
  font-weight: 600;
  color: var(--afro-text-primary);
  min-width: 200px;
  text-align: center;
}

/* Calendar Grid */
.calendar-grid {
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-md);
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  background: var(--afro-secondary-50);
  border-bottom: 1px solid var(--afro-border);
}

.time-header {
  padding: var(--afro-space-md);
  font-weight: 600;
  color: var(--afro-text-primary);
  border-right: 1px solid var(--afro-border);
}

.day-header {
  padding: var(--afro-space-md);
  text-align: center;
  border-right: 1px solid var(--afro-border);
}

.day-header:last-child {
  border-right: none;
}

.day-name {
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.day-date {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
}

.calendar-body {
  display: flex;
  flex-direction: column;
}

.time-row {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 1px solid var(--afro-border);
}

.time-row:last-child {
  border-bottom: none;
}

.time-label {
  padding: var(--afro-space-sm) var(--afro-space-md);
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  border-right: 1px solid var(--afro-border);
  display: flex;
  align-items: center;
}

.time-cell {
  padding: var(--afro-space-sm);
  border-right: 1px solid var(--afro-border);
    cursor: pointer;
  transition: all var(--afro-transition-fast);
  display: flex;
  align-items: center;
    justify-content: center;
  min-height: 40px;
}

.time-cell:last-child {
  border-right: none;
}

.time-cell:hover {
  background: var(--afro-primary-50);
}

.time-cell-available {
  background: var(--afro-success);
  color: white;
}

.time-cell-scheduled {
  background: var(--afro-info);
  color: white;
}

.time-cell-unavailable {
  background: var(--afro-secondary-100);
}

.time-cell-conflict {
  background: var(--afro-error);
  color: white;
}

/* Settings Section */
.setting-section {
  margin-bottom: var(--afro-space-xl);
  padding: var(--afro-space-lg);
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-md);
  background: var(--afro-surface);
}

.card-content {
  padding: var(--afro-space-lg);
}

.setting-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-md);
}

.schedule-presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--afro-space-sm);
}

.preset-btn {
  flex: 1;
  min-width: 80px;
}

.time-blocks,
.week-days {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-xs);
}

.setting-actions {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-sm);
  margin-top: var(--afro-space-xl);
  padding-top: var(--afro-space-lg);
  border-top: 1px solid var(--afro-border);
}

/* Activities List */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: var(--afro-space-md);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--afro-space-md);
  padding: var(--afro-space-lg);
  border: 1px solid var(--afro-border);
  border-radius: var(--afro-radius-md);
}

.activity-time {
  text-align: center;
  flex-shrink: 0;
}

.time-start,
.time-end {
  font-size: var(--afro-text-sm);
  font-weight: 600;
  color: var(--afro-text-primary);
}

.time-end {
  color: var(--afro-text-secondary);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: var(--afro-text-base);
  font-weight: 600;
  color: var(--afro-text-primary);
  margin-bottom: var(--afro-space-xs);
}

.activity-project {
  font-size: var(--afro-text-sm);
  color: var(--afro-text-secondary);
  margin-bottom: var(--afro-space-sm);
}

/* Legend */
.legend-items {
  display: flex;
  gap: var(--afro-space-xl);
  flex-wrap: wrap;
  padding: var(--afro-space-lg);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--afro-space-sm);
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.available {
  background: var(--afro-success);
}

.legend-color.scheduled {
  background: var(--afro-info);
}

.legend-color.unavailable {
  background: var(--afro-secondary-100);
}

.legend-color.conflict {
  background: var(--afro-error);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .calendar-section {
    grid-column: span 3;
  }
  
  .afro-grid-3 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .availability-view {
    padding: var(--afro-space-md);
  }
  
  .calendar-header,
  .time-row {
    grid-template-columns: 60px repeat(7, 1fr);
  }
  
  .time-header,
  .time-label {
    font-size: var(--afro-text-xs);
    padding: var(--afro-space-xs);
  }
  
  .day-header {
    padding: var(--afro-space-sm);
  }
  
  .time-cell {
    min-height: 30px;
  }
  
  .legend-items {
    flex-direction: column;
    gap: var(--afro-space-md);
  }
  
  .schedule-presets {
    flex-direction: column;
  }
  
  .preset-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .calendar-header,
  .time-row {
    grid-template-columns: 50px repeat(7, 1fr);
  }
  
  .day-name {
    font-size: var(--afro-text-xs);
  }
  
  .day-date {
    font-size: var(--afro-text-xs);
  }
}
</style>