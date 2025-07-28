<template>
  <v-container fluid class="pa-8">
    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold text-primary">Gestión de Proyectos</h1>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn color="primary" @click="goToCreateProject" class="rounded-pill new-project-btn">
          <v-icon start>mdi-plus</v-icon>
          Crear Nuevo Proyecto
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <!-- Card 1: Último Proyecto Activo -->
      <v-col cols="12" md="6">
        <v-card class="pa-6 rounded-lg elevation-0 highlight-card h-100">
          <v-card-title class="text-h6 font-weight-bold mb-2">Último Proyecto Activo</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <div v-if="lastActiveProject">
            <v-row>
              <v-col cols="12" md="4">
                <v-img
                  :src="lastActiveProject.coverImage"
                  class="rounded-lg"
                  height="150"
                  cover
                ></v-img>
              </v-col>
              <v-col cols="12" md="8">
                <h3 class="text-h5 font-weight-bold text-primary mb-2">{{ lastActiveProject.name }}</h3>
                <v-chip :color="lastActiveProject.statusColor" size="small" class="mb-3">{{ lastActiveProject.status }}</v-chip>
                <p class="text-body-2 text-grey-darken-1 mb-2">{{ lastActiveProject.description }}</p>
                <p class="text-body-2 mb-1"><strong>Ubicación:</strong> {{ lastActiveProject.location }}</p>
                <p class="text-body-2 mb-1"><strong>Inicio:</strong> {{ lastActiveProject.startDate }}</p>
                <p class="text-body-2"><strong>Fin:</strong> {{ lastActiveProject.endDate }}</p>
                <v-card-actions class="pa-0 mt-4">
                  <v-btn variant="text" color="primary" @click="viewProjectDetails(lastActiveProject.id)">Ver Detalles</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <p class="text-body-1 text-grey-darken-1">No hay proyectos activos recientemente.</p>
          </div>
        </v-card>
      </v-col>

      <!-- Card 2: Cronograma de Actividades -->
      <v-col cols="12" md="6">
        <v-card class="pa-6 rounded-lg elevation-0 highlight-card h-100">
          <v-card-title class="text-h6 font-weight-bold mb-2">Cronograma de Actividades</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <div v-if="lastActiveProject && lastActiveProject.tasks.length > 0">
            <v-timeline density="compact" side="end" class="timeline-custom">
              <v-timeline-item
                v-for="task in lastActiveProject.tasks"
                :key="task.id"
                :dot-color="task.statusColor"
                size="small"
              >
                <div class="d-flex justify-space-between flex-grow-1">
                  <div>
                    <h4 class="text-subtitle-2 font-weight-bold">{{ task.description }}</h4>
                    <p class="text-caption text-grey-darken-1">{{ task.startDate }} - {{ task.endDate }}</p>
                  </div>
                  <v-chip :color="task.statusColor" size="x-small">{{ task.status }}</v-chip>
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
          <div v-else>
            <p class="text-body-1 text-grey-darken-1">No hay tareas definidas para este proyecto.</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content: Projects Table and Progress Timeline -->
    <v-row>
      <!-- Projects Table -->
      <v-col cols="12" md="8">
        <v-card class="pa-6 rounded-lg elevation-0">
          <v-card-title class="text-h6 font-weight-bold mb-4">Todos los Proyectos</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-data-table
            :headers="headers"
            :items="otherProjects"
            item-value="id"
            class="elevation-0 projects-table"
          >
            <template v-slot:item.status="{ item }">
              <v-chip :color="item.statusColor" size="small">{{ item.status }}</v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon size="small" variant="text" color="info" @click="viewProjectDetails(item.id)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="text" color="warning" @click="editProject(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="text" color="error" @click="deactivateProject(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Progress Timeline -->
      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-lg elevation-0 highlight-card">
          <v-card-title class="text-h6 font-weight-bold mb-2">Progreso del Proyecto</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <div v-if="lastActiveProject && projectProgress.phases.length > 0">
            <h3 class="text-h6 font-weight-bold text-primary mb-4">{{ lastActiveProject.name }}</h3>
            <v-timeline density="compact" side="end" class="timeline-custom">
              <v-timeline-item
                v-for="(phase, index) in projectProgress.phases"
                :key="phase.id"
                :dot-color="phase.statusColor"
                size="small"
              >
                <div class="d-flex justify-space-between flex-grow-1">
                  <div>
                    <h4 class="text-subtitle-2 font-weight-bold">{{ phase.name }}</h4>
                    <p class="text-caption text-grey-darken-1">{{ phase.description }}</p>
                  </div>
                  <v-chip :color="phase.statusColor" size="x-small">{{ phase.status }}</v-chip>
                </div>
              </v-timeline-item>
            </v-timeline>
            <v-card-actions class="pa-0 mt-4">
              <v-btn variant="text" color="primary" @click="viewProjectDetails(lastActiveProject.id)">Gestionar proyecto</v-btn>
            </v-card-actions>
          </div>
          <div v-else>
            <p class="text-body-1 text-grey-darken-1">No hay fases para mostrar.</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';

const router = useRouter();
const projectStore = useProjectStore();

// Computed property for the last active project
const lastActiveProject = computed(() => {
  const activeProjects = projectStore.allProjects.filter(p => p.status === 'Activo' || p.status === 'Pendiente');
  if (activeProjects.length === 0) return null;

  return activeProjects.sort((a, b) => {
    const dateA = new Date(a.endDate || a.startDate);
    const dateB = new Date(b.endDate || b.startDate);
    return dateB.getTime() - dateA.getTime();
  })[0];
});

// Computed property for other projects (excluding the last active one)
const otherProjects = computed(() => {
  if (!lastActiveProject.value) return projectStore.allProjects;
  return projectStore.allProjects.filter(p => p.id !== lastActiveProject.value.id);
});

// Computed property for project progress (now includes phases for timeline)
const projectProgress = computed(() => {
  if (!lastActiveProject.value) return null;
  const phases = lastActiveProject.value.phases || [];
  const totalPhases = phases.length;
  const completedPhases = phases.filter(p => p.status === 'Completado').length;
  const currentPhase = phases.find(p => p.status === 'Activo') || null;

  return {
    phases,
    totalPhases,
    completedPhases,
    currentPhase,
  };
});

// Table headers
const headers = ref([
  { title: 'Nombre del Proyecto', key: 'name', align: 'center' },
  { title: 'Estado', key: 'status', align: 'center' },
  { title: 'Inicio', key: 'startDate', align: 'center' },
  { title: 'Fin', key: 'endDate', align: 'center' },
  { title: 'Ubicación', key: 'location', align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
]);

function goToCreateProject() {
  router.push('/organization/dashboard/projects/create');
}

function viewProjectDetails(projectId) {
  router.push(`/organization/dashboard/projects/${projectId}`);
}

function editProject(projectId) {
  router.push(`/organization/dashboard/projects/create?id=${projectId}`);
}

function deactivateProject(projectId) {
  if (confirm(`¿Estás seguro de que quieres dar de baja el proyecto con ID: ${projectId}?`)) {
    projectStore.deleteProject(projectId);
    alert(`Proyecto ${projectId} dado de baja.`);
  }
}
</script>

<style scoped>
.project-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px -5px rgba(0,0,0,0.1) !important;
}

.new-project-btn {
  font-weight: 600;
  color: white !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.new-project-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 184, 148, 0.3);
}

.timeline-custom .v-timeline-item__body {
  padding-inline-start: 16px !important;
}

.timeline-custom .v-timeline-item__opposite {
  display: none;
}

/* Styles for Projects Table */
.projects-table .v-data-table__thead th {
  color: #8392ab !important;
}

.projects-table .v-data-table__tbody td {
  color: #67748e !important;
}

/* Ensure specific alignment for header and data cells */
/* Centering is handled by the 'align' property in headers */
</style>