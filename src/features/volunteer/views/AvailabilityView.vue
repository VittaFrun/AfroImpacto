<template>
  <v-container fluid class="pa-8">
    <!-- Header -->
    <h1 class="text-h4 font-weight-bold text-primary mb-2">Mi Disponibilidad</h1>
    <p class="text-body-1 text-grey-darken-1 mb-8">
      Haz clic en los bloques de tiempo para marcar cuándo estás disponible para ayudar.
    </p>

    <!-- Availability Matrix -->
    <v-card class="pa-6 rounded-lg elevation-0">
        <v-table class="availability-table">
            <thead>
                <tr>
                    <th class="text-left text-subtitle-1 font-weight-bold">Día</th>
                    <th class="text-center text-subtitle-1 font-weight-bold">Mañana (9am - 1pm)</th>
                    <th class="text-center text-subtitle-1 font-weight-bold">Tarde (1pm - 5pm)</th>
                    <th class="text-center text-subtitle-1 font-weight-bold">Noche (5pm - 9pm)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="day in schedule" :key="day.day">
                    <td class="font-weight-bold">{{ day.day }}</td>
                    <td class="text-center">
                        <v-chip
                            :color="day.morning ? 'success' : 'grey-lighten-2'"
                            :variant="day.morning ? 'flat' : 'outlined'"
                            class="time-slot-chip"
                            @click="toggleSlot(day, 'morning')"
                        >
                            <v-icon start>{{ day.morning ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                            Disponible
                        </v-chip>
                    </td>
                    <td class="text-center">
                        <v-chip
                            :color="day.afternoon ? 'success' : 'grey-lighten-2'"
                            :variant="day.afternoon ? 'flat' : 'outlined'"
                            class="time-slot-chip"
                            @click="toggleSlot(day, 'afternoon')"
                        >
                            <v-icon start>{{ day.afternoon ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                            Disponible
                        </v-chip>
                    </td>
                    <td class="text-center">
                        <v-chip
                            :color="day.night ? 'success' : 'grey-lighten-2'"
                            :variant="day.night ? 'flat' : 'outlined'"
                            class="time-slot-chip"
                            @click="toggleSlot(day, 'night')"
                        >
                            <v-icon start>{{ day.night ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                            Disponible
                        </v-chip>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-divider class="mt-6"></v-divider>
        <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" size="large" variant="flat" @click="saveAvailability">
                <v-icon start>mdi-content-save</v-icon>
                Guardar Cambios
            </v-btn>
        </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

// Data model for the weekly schedule
const schedule = ref([
  { day: 'Lunes', morning: true, afternoon: false, night: false },
  { day: 'Martes', morning: false, afternoon: false, night: false },
  { day: 'Miércoles', morning: false, afternoon: true, night: true },
  { day: 'Jueves', morning: false, afternoon: false, night: false },
  { day: 'Viernes', morning: true, afternoon: true, night: true },
  { day: 'Sábado', morning: true, afternoon: true, night: true },
  { day: 'Domingo', morning: false, afternoon: false, night: false },
]);

// Snackbar state
const snackbar = ref({ show: false, text: '', color: '' });

// Function to toggle the availability of a time slot
function toggleSlot(day, slot) {
  day[slot] = !day[slot];
}

// Function to save the changes
function saveAvailability() {
  console.log('Guardando disponibilidad:', JSON.parse(JSON.stringify(schedule.value)));
  // Here you would typically make an API call to save the data
  snackbar.value = { show: true, text: 'Disponibilidad actualizada correctamente', color: 'success' };
}
</script>

<style scoped>
.availability-table {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.availability-table th {
    background-color: #fafafa;
}

.time-slot-chip {
    cursor: pointer;
    min-width: 140px;
    justify-content: center;
    transition: all 0.2s ease-in-out;
}

.time-slot-chip:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>