<template>
  <v-container fluid class="pa-8">
    <div v-if="loading" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
    
    <div v-else-if="error" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-alert type="error" prominent>
        {{ error }}
        <v-btn @click="retryFetch" class="mt-4" color="white" variant="outlined">
          Reintentar
        </v-btn>
      </v-alert>
    </div>
    
    <div v-else>
      <v-row class="mb-6">
        <v-col cols="12"><WelcomeCard /></v-col>
      </v-row>

      <!-- Quick Actions Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <h2 class="text-h6 font-weight-bold mb-4">Acciones Rápidas</h2>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="text-center pa-4 fill-height d-flex flex-column justify-center" hover to="/organization/dashboard/projects/create">
            <v-btn icon="mdi-plus-box-outline" color="primary" size="x-large" variant="tonal" class="mx-auto mb-3"></v-btn>
            <span class="font-weight-bold">Crear Proyecto</span>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="text-center pa-4 fill-height d-flex flex-column justify-center" hover to="/organization/dashboard/volunteers">
            <v-btn icon="mdi-account-plus-outline" color="info" size="x-large" variant="tonal" class="mx-auto mb-3"></v-btn>
            <span class="font-weight-bold">Invitar Voluntario</span>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="text-center pa-4 fill-height d-flex flex-column justify-center" hover to="/organization/dashboard/donations">
            <v-btn icon="mdi-gift-outline" color="success" size="x-large" variant="tonal" class="mx-auto mb-3"></v-btn>
            <span class="font-weight-bold">Registrar Donación</span>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="text-center pa-4 fill-height d-flex flex-column justify-center" hover to="/organization/dashboard/reports">
            <v-btn icon="mdi-chart-line" color="warning" size="x-large" variant="tonal" class="mx-auto mb-3"></v-btn>
            <span class="font-weight-bold">Generar Reporte</span>
          </v-card>
        </v-col>
      </v-row>

      <MetricCards :metrics="metrics" />
      <v-row class="mt-4">
        <v-col cols="12" md="6"><RecentActivity :activities="recentActivities" /></v-col>
        <v-col cols="12" md="6"><UpcomingTasks :tasks="upcomingTasks" /></v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="12" md="6"><ProjectStatusChart :projectStatusData="projectStatusData" :sparklineGradient="sparklineGradient" /></v-col>
        <v-col cols="12" md="6"><DonationTrendChart :donationTrendData="donationTrendData" /></v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDashboardStore } from '@/features/organization/stores/dashboardStore';
import { storeToRefs } from 'pinia';

import WelcomeCard from '@/features/organization/components/WelcomeCard.vue';
import MetricCards from '@/features/organization/components/MetricCards.vue';
import RecentActivity from '@/features/organization/components/RecentActivity.vue';
import UpcomingTasks from '@/features/organization/components/UpcomingTasks.vue';
import ProjectStatusChart from '@/features/organization/components/ProjectStatusChart.vue';
import DonationTrendChart from '@/features/organization/components/DonationTrendChart.vue';

const dashboardStore = useDashboardStore();
const { 
  metrics, 
  recentActivities, 
  upcomingTasks, 
  projectStatusData, 
  donationTrendData, 
  sparklineGradient,
  loading,
  error
} = storeToRefs(dashboardStore);

const retryFetch = () => {
  dashboardStore.fetchDashboardData();
};

onMounted(() => {
  dashboardStore.fetchDashboardData();
});
</script>


