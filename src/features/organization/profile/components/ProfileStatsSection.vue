<template>
  <v-card-text class="pa-6">
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" variant="outlined" rounded="lg">
          <v-card-text class="pa-4 text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-folder-multiple</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.projectsCount }}</div>
            <div class="text-caption text-grey">Proyectos</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" variant="outlined" rounded="lg">
          <v-card-text class="pa-4 text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.teamMembersCount }}</div>
            <div class="text-caption text-grey">Miembros</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" variant="outlined" rounded="lg">
          <v-card-text class="pa-4 text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-account-multiple</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalVolunteers }}</div>
            <div class="text-caption text-grey">Voluntarios</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" variant="outlined" rounded="lg">
          <v-card-text class="pa-4 text-center">
            <v-icon size="48" color="warning" class="mb-2">mdi-clock-outline</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalHours }}</div>
            <div class="text-caption text-grey">Horas</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup>
defineProps({
  organizationId: {
    type: Number,
    required: true
  },
  stats: {
    type: Object,
    default: () => ({
      projectsCount: 0,
      teamMembersCount: 0,
      totalVolunteers: 0,
      totalHours: 0
    })
  }
});
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>

