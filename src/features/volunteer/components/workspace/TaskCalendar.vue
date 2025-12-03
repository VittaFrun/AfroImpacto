<template>
  <v-card class="task-calendar-card" variant="outlined" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-calendar-month</v-icon>
        <span class="text-h6 font-weight-bold">Calendario de Tareas</span>
      </div>
      <div class="d-flex align-center gap-2">
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          size="small"
          @click="previousMonth"
        ></v-btn>
        <span class="text-body-1 font-weight-medium">{{ currentMonthLabel }}</span>
        <v-btn
          icon="mdi-chevron-right"
          variant="text"
          size="small"
          @click="nextMonth"
        ></v-btn>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <div v-if="loading" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else class="calendar-container">
        <div class="calendar-header mb-4">
          <div class="calendar-month-label text-h6 font-weight-bold">
            {{ currentMonthLabel }}
          </div>
        </div>
        <div class="calendar-grid">
          <div class="calendar-weekdays">
            <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="calendar-days">
            <div
              v-for="day in calendarDays"
              :key="day.key"
              class="calendar-day"
              :class="{ 'other-month': day.otherMonth, 'has-events': day.events.length > 0, 'today': day.isToday }"
              @click="handleDateClick(day)"
            >
              <div class="day-number">{{ day.day }}</div>
              <div v-if="day.events.length > 0" class="day-events">
                <v-chip
                  v-for="(event, index) in day.events.slice(0, 2)"
                  :key="index"
                  size="x-small"
                  :color="getEventColor(event)"
                  variant="tonal"
                  class="event-chip"
                >
                  {{ event.name }}
                </v-chip>
                <v-chip
                  v-if="day.events.length > 2"
                  size="x-small"
                  color="grey"
                  variant="tonal"
                  class="event-chip"
                >
                  +{{ day.events.length - 2 }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['date-click']);

const currentDate = ref(new Date());

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const currentMonthLabel = computed(() => {
  return currentDate.value.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
});

const calendarEvents = computed(() => {
  if (!props.tasks || props.tasks.length === 0) return [];

  const eventsMap = new Map();
  
  props.tasks
    .filter(task => task.fecha_fin || task.fecha_inicio)
    .forEach(task => {
      const fecha = task.fecha_fin || task.fecha_inicio;
      const fechaStr = new Date(fecha).toISOString().split('T')[0];
      
      if (!eventsMap.has(fechaStr)) {
        eventsMap.set(fechaStr, []);
      }
      
      eventsMap.get(fechaStr).push({
        name: task.descripcion?.substring(0, 15) || 'Tarea',
        color: getTaskColor(task),
        task: task
      });
    });
  
  return eventsMap;
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
  
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      key: `prev-${day}`,
      day,
      date,
      dateStr,
      otherMonth: true,
      isToday: false,
      events: calendarEvents.value.get(dateStr) || []
    });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const dateForCompare = new Date(date);
    dateForCompare.setHours(0, 0, 0, 0);
    
    days.push({
      key: `curr-${day}`,
      day,
      date,
      dateStr,
      otherMonth: false,
      isToday: dateForCompare.getTime() === today.getTime(),
      events: calendarEvents.value.get(dateStr) || []
    });
  }
  
  // Next month days to fill the grid
  const totalCells = 42; // 6 weeks * 7 days
  const remainingDays = totalCells - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      key: `next-${day}`,
      day,
      date,
      dateStr,
      otherMonth: true,
      isToday: false,
      events: calendarEvents.value.get(dateStr) || []
    });
  }
  
  return days;
});

const getTaskColor = (task) => {
  const estadoId = task.estado?.id_estado || task.id_estado;
  if (estadoId === 3) return 'success';
  if (estadoId === 2) return 'info';
  
  const prioridad = task.prioridad;
  if (prioridad === 'Alta') return 'error';
  if (prioridad === 'Media') return 'warning';
  return 'info';
};

const getEventColor = (event) => {
  return event.color || 'primary';
};

const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
};

const handleDateClick = (day) => {
  if (!day.otherMonth) {
    emit('date-click', { date: day.date });
  }
};

watch(() => props.tasks, () => {
  // Refresh calendar when tasks change
}, { deep: true });
</script>

<style scoped>
.task-calendar-card {
  min-height: 500px;
}

.calendar-container {
  padding: 8px;
}

.calendar-header {
  text-align: center;
  text-transform: capitalize;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: #666;
  padding: 8px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  min-height: 80px;
  padding: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.calendar-day.other-month {
  opacity: 0.4;
  background: #f5f5f5;
}

.calendar-day.today {
  border: 2px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
}

.calendar-day.has-events {
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.day-number {
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 14px;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-grow: 1;
  justify-content: flex-start;
}

.event-chip {
  font-size: 9px;
  height: 14px;
  margin: 0;
  padding: 0 4px;
}
</style>

