<template>
  <v-container fluid class="pa-8">
    <!-- Header -->
    <h1 class="text-h4 font-weight-bold text-primary mb-2">Mis Proyectos</h1>
    <p class="text-body-1 text-grey-darken-1 mb-8">Un vistazo a los proyectos donde estás dejando tu huella.</p>

    <!-- Loading and Error States -->
    <div v-if="loadingProjects" class="d-flex justify-center align-center" style="height: 50vh;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
    <div v-else-if="errorProjects" class="d-flex justify-center align-center" style="height: 50vh;">
      <v-alert type="error" prominent>{{ errorProjects }}</v-alert>
    </div>

    <!-- Projects Grid -->
    <v-row v-else>
      <v-col v-for="project in myProjects" :key="project.id" cols="12" md="6" lg="4">
        <v-card class="d-flex flex-column fill-height rounded-lg project-card">
          <v-img
            :src="project.image"
            height="200px"
            cover
            class="align-end text-white"
          >
            <v-card-title class="project-title">{{ project.name }}</v-card-title>
          </v-img>

          <v-card-text class="flex-grow-1">
            <div class="d-flex justify-space-between align-center mb-4">
                <v-chip size="small" variant="tonal" color="info">
                    <v-icon start>mdi-account-tie</v-icon>
                    {{ project.role }}
                </v-chip>
                <v-chip :color="project.statusColor" size="small" variant="flat">
                    {{ project.status }}
                </v-chip>
            </div>
            
            <div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption font-weight-bold">Progreso</span>
                <span class="text-caption font-weight-bold text-primary">{{ project.progress }}%</span>
              </div>
              <v-progress-linear
                :model-value="project.progress"
                :color="project.status === 'Completado' ? 'success' : 'primary'"
                height="8"
                rounded
              ></v-progress-linear>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text">Ver Tareas</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
       <v-col v-if="!myProjects.length" cols="12">
          <v-card class="pa-8 rounded-lg text-center" variant="tonal">
            <v-icon size="x-large" color="grey" class="mb-4">mdi-folder-open-outline</v-icon>
            <h3 class="text-h6">Aún no participas en ningún proyecto.</h3>
            <p class="text-body-1 mt-2">¡Explora las oportunidades y únete a una causa!</p>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';

const volunteerStore = useVolunteerStore();
const { myProjects, loadingProjects, errorProjects } = storeToRefs(volunteerStore);

onMounted(() => {
  volunteerStore.fetchMyProjects();
});
</script>

<style scoped>
.project-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px -5px rgba(0,0,0,0.15) !important;
}

.project-title {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
}
</style>