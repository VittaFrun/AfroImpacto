
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDashboardStore = defineStore('organizationDashboard', () => {
  
  const metrics = ref([]);
  const recentActivities = ref([]);
  const upcomingTasks = ref([]);
  const projectStatusData = ref([]);
  const donationTrendData = ref([]);

  const sparklineGradient = ref(['#00B894', '#55efc4']);

  const fetchDashboardData = async () => {
    
    

    metrics.value = [
      { title: 'Proyectos Activos', value: '12', icon: 'mdi-folder-multiple', color: 'primary' },
      { title: 'Donaciones Recibidas', value: '$2,550', icon: 'mdi-cash-multiple', color: 'success' },
      { title: 'Voluntarios Activos', value: '85', icon: 'mdi-account-group', color: 'info' },
      { title: 'Tareas Pendientes', value: '23', icon: 'mdi-clipboard-list', color: 'warning' },
    ];

    recentActivities.value = [
      { text: 'Nueva donación de $500 para Proyecto Esperanza.', time: 'Hace 1 hora', icon: 'mdi-cash-plus', color: 'green' },
      { text: 'Voluntario Juan Pérez se unió a Proyecto Sonrisas.', time: 'Hace 3 horas', icon: 'mdi-account-plus', color: 'blue' },
      { text: 'Tarea "Preparar materiales" completada en Proyecto Futuro.', time: 'Ayer', icon: 'mdi-check-circle', color: 'orange' },
      { text: 'Proyecto "Educación para Todos" ha iniciado.', time: 'Hace 2 días', icon: 'mdi-calendar-check', color: 'purple' },
    ];

    upcomingTasks.value = [
      { title: 'Reunión de planificación - Fase 2', project: 'Proyecto Esperanza', dueDate: '18 de Julio, 2025', status: 'Próximo', statusColor: 'primary' },
      { title: 'Entrega de materiales a comunidad X', project: 'Proyecto Futuro', dueDate: '20 de Julio, 2025', status: 'Pendiente', statusColor: 'warning' },
      { title: 'Revisión de informes de voluntarios', project: 'General', dueDate: '22 de Julio, 2025', status: 'Pendiente', statusColor: 'warning' },
    ];

    projectStatusData.value = [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0];
    donationTrendData.value = [10, 12, 8, 15, 11, 18, 14, 20, 16, 22, 19, 25];

    
  };

  return {
    
    metrics,
    recentActivities,
    upcomingTasks,
    projectStatusData,
    donationTrendData,
    sparklineGradient,
    fetchDashboardData,
  };
});
