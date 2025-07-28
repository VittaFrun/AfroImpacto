import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useVolunteerStore = defineStore('volunteer', () => {
  // State
  const allVolunteers = ref([
    { id: 1, name: 'Ana Martínez', skills: ['Construcción', 'Educación'] },
    { id: 2, name: 'Carlos Rodríguez', skills: ['Salud', 'Logística'] },
    { id: 3, name: 'Beatriz Gómez', skills: ['Recaudación de fondos', 'Comunicación'] },
    { id: 4, name: 'David Fernández', skills: ['Tecnología', 'Capacitación'] },
    { id: 5, name: 'Elena Castillo', skills: ['Agricultura', 'Medio ambiente'] },
  ]);

  // Getters
  const volunteers = computed(() => allVolunteers.value);
  const getVolunteerById = computed(() => (id) => allVolunteers.value.find(v => v.id === id));

  // Actions
  // Placeholder for future API calls
  function fetchVolunteers() {
    // In a real app, this would fetch data from an API
    console.log('Fetching volunteers...');
  }

  return {
    allVolunteers,
    volunteers,
    getVolunteerById,
    fetchVolunteers,
  };
});
