<template>
  <v-container fluid class="pa-8">
    <div>
      <v-row class="mb-6">
        <v-col cols="12"><WelcomeCard /></v-col>
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
  sparklineGradient 
} = storeToRefs(dashboardStore);

onMounted(() => {
  dashboardStore.fetchDashboardData();
});
</script>


