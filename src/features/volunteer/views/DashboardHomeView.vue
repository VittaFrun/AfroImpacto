<template>
  <v-container fluid class="pa-8">
    <!-- Loading and Error States -->
    <div v-if="loadingDashboard" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
    <div v-else-if="errorDashboard" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-alert type="error" prominent>{{ errorDashboard }}</v-alert>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Welcome Card -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-8 rounded-lg" variant="tonal" color="primary">
            <div class="d-flex align-center">
              <v-avatar color="white" size="64" class="mr-6">
                <v-icon size="x-large" color="primary">mdi-account-heart</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold">¡Hola, {{ authStore.user?.nombre || 'Voluntario' }}!</h1>
                <p class="text-body-1 mt-2">Gracias por tu increíble trabajo. Aquí tienes un resumen de tu impacto y tus próximas tareas.</p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Dashboard Sections -->
      <v-row class="mt-6">
        <!-- Left Column: Tasks and Availability -->
        <v-col cols="12" md="7">
          <!-- Pending Tasks -->
          <v-card class="pa-6 rounded-lg fill-height">
            <v-card-title class="text-h6 font-weight-bold">Mis Tareas Pendientes</v-card-title>
            <v-divider class="mb-2"></v-divider>
            <v-list lines="two">
              <v-list-item v-for="task in pendingTasks" :key="task.id">
                <template v-slot:prepend>
                  <v-chip :color="priorityConfig(task.priority).color" class="mr-4" variant="flat" size="small"></v-chip>
                </template>
                <v-list-item-title class="font-weight-bold">{{ task.description }}</v-list-item-title>
                <v-list-item-subtitle>{{ task.project }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn size="small" variant="text" icon="mdi-arrow-right"></v-btn>
                </template>
              </v-list-item>
            </v-list>
             <v-card-text v-if="!pendingTasks.length" class="text-center text-grey-darken-1">
              ¡Felicidades! No tienes tareas pendientes.
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column: Impact and Availability -->
        <v-col cols="12" md="5">
          <!-- Impact Stats -->
          <v-card class="pa-6 rounded-lg mb-6">
            <v-card-title class="text-h6 font-weight-bold mb-4">Mi Impacto</v-card-title>
            <div class="d-flex justify-space-around text-center">
              <div>
                <p class="text-h3 font-weight-bold text-primary">
                  {{ stats.hours || 0 }}
                </p>
                <span class="text-body-1">Horas</span>
              </div>
              <div>
                <p class="text-h3 font-weight-bold text-success">
                  {{ stats.tasksCompleted || 0 }}
                </p>
                <span class="text-body-1">Tareas</span>
              </div>
              <div>
                <p class="text-h3 font-weight-bold text-info">
                  {{ stats.projects || 0 }}
                </p>
                <span class="text-body-1">Proyectos</span>
              </div>
            </div>
          </v-card>

          <!-- Availability -->
          <v-card class="pa-6 rounded-lg" variant="outlined" color="grey-lighten-1">
             <v-card-title class="text-h6 font-weight-bold d-flex align-center">
                <v-icon color="info" class="mr-2">mdi-calendar-clock</v-icon>
                Mi Disponibilidad
            </v-card-title>
            <v-card-text class="text-body-1">
              {{ availabilitySummary || 'No has definido tu disponibilidad.' }}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="info" variant="text" to="/volunteer/availability">Actualizar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>



<script setup>
import { computed, onMounted } from 'vue';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { storeToRefs } from 'pinia';

// Stores
const volunteerStore = useVolunteerStore();
const authStore = useAuthStore();

const { 
  stats, 
  pendingTasks, 
  availabilitySummary, 
  loadingDashboard, 
  errorDashboard 
} = storeToRefs(volunteerStore);

// Fetch data on component mount
onMounted(() => {
  volunteerStore.fetchVolunteerDashboard();
});

// Priority configuration for task chips
const priorityConfig = computed(() => {
  return (priority) => {
    switch (priority) {
      case 'Alta':
        return { color: 'error' };
      case 'Media':
        return { color: 'warning' };
      case 'Baja':
        return { color: 'info' };
      default:
        return { color: 'grey' };
    }
  };
});
</script>
