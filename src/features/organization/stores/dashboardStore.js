import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/plugins/axios';

export const useDashboardStore = defineStore('organizationDashboard', () => {
  
  const metrics = ref([]);
  const recentActivities = ref([]);
  const upcomingTasks = ref([]);
  const projectStatusData = ref([]);
  const donationTrendData = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const sparklineGradient = ref(['#00B894', '#55efc4']);

  const fetchDashboardData = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Fetch dashboard data from the backend
      const response = await axios.get('/dashboard');
      
      // Update all dashboard data
      metrics.value = response.data.metrics || [];
      recentActivities.value = response.data.recentActivities || [];
      upcomingTasks.value = response.data.upcomingTasks || [];
      projectStatusData.value = response.data.projectStatusData || [];
      donationTrendData.value = response.data.donationTrendData || [];
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      error.value = 'Failed to fetch dashboard data. Please try again later.';
      // Set default empty values on error
      metrics.value = [];
      recentActivities.value = [];
      upcomingTasks.value = [];
      projectStatusData.value = [];
      donationTrendData.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    metrics,
    recentActivities,
    upcomingTasks,
    projectStatusData,
    donationTrendData,
    sparklineGradient,
    loading,
    error,
    fetchDashboardData,
  };
});
