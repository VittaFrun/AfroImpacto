<template>
  <v-container fluid class="pa-8 project-detail-view">
    <!-- Header -->
    <v-row class="mb-4 align-center">
      <v-col cols="auto">
        <v-btn icon @click="router.back()" variant="text"><v-icon>mdi-arrow-left</v-icon></v-btn>
      </v-col>
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">Gestión del Proyecto</h1>
        <div class="d-flex align-center">
          <h2 v-if="project" class="text-h6 text-grey-darken-1 mr-2">{{ project.name }}</h2>
          <v-btn icon="mdi-pencil" variant="text" color="warning" size="small" @click="openEditProjectDialog"></v-btn>
        </div>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="saveProjectChanges" class="rounded-pill">
          <v-icon start>mdi-content-save</v-icon>Guardar Cambios
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="project">
      <!-- Main Content Column -->
      <v-col cols="12" md="8">
        <!-- Kanban Board -->
        <v-card class="pa-6 rounded-lg elevation-0 mb-6">
          <v-card-title class="text-h6 font-weight-bold">Tablero de Tareas</v-card-title>
          <v-divider class="mb-6"></v-divider>
          <kanban-board :tasks="project.tasks" :phases="project.phases" @update:taskStatus="updateTaskStatusFromKanban" @task-clicked="openEditTaskDialog"></kanban-board>
        </v-card>

        <!-- Structural Summary -->
        <v-card class="pa-6 rounded-lg elevation-0 mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Resumen Estructural</span>
            <v-btn color="primary" @click="openAddPhaseDialog">+ Añadir Fase</v-btn>
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="phase in project.phases" :key="phase.id">
              <v-expansion-panel-title>
                <div class="d-flex justify-space-between align-center w-100">
                  <span class="font-weight-bold">{{ phase.name }}</span>
                  <div>
                    <v-chip :color="phase.statusColor" size="small" class="mr-4">{{ phase.status }}</v-chip>
                    <v-btn icon="mdi-pencil" variant="text" color="warning" size="small" @click.stop="openEditPhaseDialog(phase)"></v-btn>
                    <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click.stop="confirmDeletePhase(phase.id)"></v-btn>
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="text-body-2 mb-4">{{ phase.description }}</p>
                <v-divider></v-divider>
                <v-list density="compact">
                  <div v-for="task in tasksByPhase(phase.id)" :key="task.id">
                    <v-list-item>
                      <v-list-item-title>{{ task.description }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip :color="task.statusColor" size="x-small" class="mr-2">{{ task.status }}</v-chip>
                        <span v-if="task.assignments.length">Asignado a: <span v-for="(assignment, idx) in task.assignments" :key="assignment.assignmentId">{{ assignment.volunteerName }} ({{ assignment.role }})<span v-if="idx < task.assignments.length - 1">, </span></span></span>
                      </v-list-item-subtitle>
                      <template v-slot:append>
                        <v-btn icon="mdi-pencil" variant="text" color="warning" size="x-small" @click.stop="openEditTaskDialog(task)"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" color="error" size="x-small" @click.stop="confirmDeleteTask(task.id)"></v-btn>
                      </template>
                    </v-list-item>
                  </div>
                  <v-card-text v-if="tasksByPhase(phase.id).length === 0" class="text-center grey--text">
                    No hay tareas para esta fase.
                  </v-card-text>
                  <v-list-item>
                    <v-btn block variant="tonal" color="primary" @click="openAddTaskDialog(null, phase.id)">+ Añadir Tarea a esta Fase</v-btn>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-card-text v-if="!project.phases || project.phases.length === 0" class="text-center grey--text">
              Este proyecto aún no tiene fases definidas.
            </v-card-text>
          </v-expansion-panels>
        </v-card>

        
      </v-col>

      <!-- Sidebar Column -->
      <v-col cols="12" md="4">
        <!-- Management Card -->
        <v-card class="pa-6 rounded-lg elevation-0 mb-6">
          <v-card-title class="text-h6 font-weight-bold">Gestión del Proyecto</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-btn color="info" block class="mb-3" @click="manageRolesDialog = true"><v-icon start>mdi-account-cog</v-icon>Gestionar Roles</v-btn>
          <v-btn color="success" block @click="openAssignVolunteerDialog"><v-icon start>mdi-account-plus</v-icon>Asignar Voluntario a Tarea</v-btn>
        </v-card>

        <!-- Other cards remain the same -->
        <!-- Activity Log -->
        <v-card class="pa-6 rounded-lg elevation-0 mt-6">
          <v-card-title class="text-h6 font-weight-bold">Actividad Reciente</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-timeline density="compact" side="end">
            <v-timeline-item v-for="(activity, index) in recentActivities" :key="index" :dot-color="activity.color" :icon="activity.icon" size="small">
              <div class="d-flex justify-space-between flex-grow-1">
                <div>{{ activity.description }}</div>
                <div class="text-caption text-grey">{{ formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: es }) }}</div>
              </div>
            </v-timeline-item>
            <v-card-text v-if="recentActivities.length === 0" class="text-center grey--text">No hay actividad reciente.</v-card-text>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogs -->
    <v-dialog v-model="assignVolunteerDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span>Asignar Voluntario a Tarea</span>
          <v-btn icon @click="assignVolunteerDialog = false" variant="text"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="assignVolunteerToTask">
            <v-select
              v-model="selectedTaskForAssignmentId"
              :items="project.tasks"
              item-title="description"
              item-value="id"
              label="Seleccionar Tarea"
              outlined
              dense
              class="mb-4"
            ></v-select>
            <v-select
              v-model="selectedVolunteerId"
              :items="availableVolunteers"
              item-title="name"
              item-value="id_voluntario"
              label="Seleccionar Voluntario"
              outlined
              dense
              class="mb-4"
            ></v-select>
            <v-select
              v-model="assignedRole"
              :items="roleStore.customRoles"
              item-title="name"
              item-value="name"
              label="Rol Asignado"
              outlined
              dense
              class="mb-4"
            ></v-select>
            <v-btn color="primary" type="submit" block>Asignar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    

    <v-dialog v-model="phaseDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span>{{ currentPhase ? 'Editar Fase' : 'Añadir Fase' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="savePhase">
            <v-text-field v-model="phaseForm.name" label="Nombre de la Fase" required></v-text-field>
            <v-textarea v-model="phaseForm.description" label="Descripción"></v-textarea>
            <v-btn color="primary" type="submit">{{ currentPhase ? 'Guardar Cambios' : 'Añadir Fase' }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editProjectDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span>Editar Proyecto</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveProjectChanges">
            <v-text-field v-model="projectForm.name" label="Nombre del Proyecto" required></v-text-field>
            <v-textarea v-model="projectForm.description" label="Descripción"></v-textarea>
            <v-btn color="primary" type="submit">Guardar Cambios</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="roleDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span>{{ currentRole ? 'Editar Rol' : 'Añadir Rol' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveRole">
            <v-text-field v-model="roleForm.name" label="Nombre del Rol" required></v-text-field>
            <v-color-picker v-model="roleForm.color" label="Color del Rol"></v-color-picker>
            <v-btn color="primary" type="submit">{{ currentRole ? 'Guardar Cambios' : 'Añadir Rol' }}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { useVolunteerStore } from '@/features/volunteers/stores/volunteerStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';
import KanbanBoard from '../components/KanbanBoard.vue';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const volunteerStore = useVolunteerStore();
const roleStore = useRoleStore();
const project = computed(() => projectStore.getProjectById(parseInt(route.params.id)));
const editProjectDialog = ref(false);
const projectForm = ref(null);

// Dialog states
const phaseDialog = ref(false);
const currentPhase = ref(null);
const phaseForm = ref({ name: '', description: '' });
const manageRolesDialog = ref(false);
const assignVolunteerDialog = ref(false);
const selectedVolunteerId = ref(null);
const assignedRole = ref('');
const selectedTaskForAssignmentId = ref(null);
const taskDialog = ref(false);
const currentTask = ref(null);
const taskForm = ref({
  description: '',
  startDate: '',
  endDate: '',
  status: 'Pendiente',
  phaseId: null,
});
const taskStatuses = ['Pendiente', 'En Progreso', 'Completado'];
const isViewingTask = ref(false);

// Snackbar state
const snackbar = ref({ show: false, text: '', color: '' });

function showSnackbar(text, color = 'success') {
  snackbar.value = { show: true, text, color };
}

// Computed property for tasks by phase for the structural view
const tasksByPhase = computed(() => {
  return (phaseId) => {
    if (!project.value || !project.value.tasks) return [];
    return project.value.tasks.filter(task => task.phaseId === phaseId);
  };
});

// Activity Log
const recentActivities = ref([]);
const logActivity = (description, icon = 'mdi-history', color = 'grey') => {
  recentActivities.value.unshift({ description, icon, color, timestamp: new Date() });
  if (recentActivities.value.length > 7) { // Increased size a bit
    recentActivities.value.pop();
  }
};

// Functions for phase management
function openAddPhaseDialog() {
  currentPhase.value = null;
  phaseForm.value = { name: '', description: '' };
  phaseDialog.value = true;
}

function openEditPhaseDialog(phase) {
  currentPhase.value = phase;
  phaseForm.value = { ...phase };
  phaseDialog.value = true;
}

function savePhase() {
  if (currentPhase.value) {
    projectStore.updateProjectPhase(project.value.id, phaseForm.value);
    showSnackbar('Fase actualizada correctamente');
  } else {
    projectStore.addProjectPhase(project.value.id, phaseForm.value);
    showSnackbar('Fase añadida correctamente');
  }
  phaseDialog.value = false;
}

function confirmDeletePhase(phaseId) {
  if (confirm('¿Estás seguro de que quieres eliminar esta fase? Se eliminarán todas las tareas asociadas.')) {
    projectStore.deleteProjectPhase(project.value.id, phaseId);
    showSnackbar('Fase eliminada correctamente', 'error');
  }
}


function confirmDeleteTask(taskId) {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    projectStore.deleteProjectTask(project.value.id, taskId);
    showSnackbar('Tarea eliminada correctamente', 'error');
  }
}

// Functions for task management (with logging)
const saveTask = () => {
  if (!project.value) return;

  if (currentTask.value) {
    // Update existing task
    projectStore.updateProjectTask(project.value.id, {
      ...currentTask.value,
      ...taskForm.value,
    });
    logActivity(`Tarea '${taskForm.value.description}' actualizada.`, 'mdi-check-circle', 'success');
    showSnackbar('Tarea actualizada correctamente');
  } else {
    // Add new task
    projectStore.addProjectTask(project.value.id, taskForm.value.phaseId, taskForm.value);
    logActivity(`Nueva tarea '${taskForm.value.description}' añadida.`, 'mdi-plus-circle', 'primary');
    showSnackbar('Tarea añadida correctamente');
  }
  taskDialog.value = false;
  currentTask.value = null;
  // Reset form
  taskForm.value = {
    description: '',
    startDate: '',
    endDate: '',
    status: 'Pendiente',
    phaseId: null,
  };
};

// ... other functions with logging ...

// Fetch project details on mount and route change


// Placeholder for other functions that need to be defined
const saveProjectChanges = () => {
  if (projectForm.value) {
    projectStore.updateProject(projectForm.value);
    showSnackbar('Proyecto actualizado correctamente');
    editProjectDialog.value = false;
  }
};

const openEditProjectDialog = () => {
  projectForm.value = { ...project.value };
  editProjectDialog.value = true;
};

const openAddTaskDialog = (task = null, phaseId = null) => {
  currentTask.value = task;
  isViewingTask.value = !!task; // Set to true if task exists, false otherwise
  if (task) {
    taskForm.value = {
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
      phaseId: task.phaseId,
    };
    logActivity(`Abriendo diálogo para ${isViewingTask.value ? 'ver' : 'editar'} tarea: ${task.description}.`, 'mdi-playlist-edit', 'warning');
  } else {
    taskForm.value = {
      description: '',
      startDate: '',
      endDate: '',
      status: 'Pendiente',
      phaseId: phaseId || (project.value.phases.length > 0 ? project.value.phases[0].id : null),
    };
    logActivity('Abriendo diálogo para añadir nueva tarea.', 'mdi-playlist-plus', 'info');
  }
  taskDialog.value = true;
};

const openEditTaskDialog = (task) => {
  // This function is called from KanbanBoard when a task is clicked
  openAddTaskDialog(task);
};

const roleDialog = ref(false);
const currentRole = ref(null);
const roleForm = ref({ name: '', color: '' });

const openAddRoleDialog = () => {
  currentRole.value = null;
  roleForm.value = { name: '', color: '#FFFFFF' };
  roleDialog.value = true;
};

const openEditRoleDialog = (role) => {
  currentRole.value = role;
  roleForm.value = { ...role };
  roleDialog.value = true;
};

const saveRole = () => {
  if (currentRole.value) {
    roleStore.updateRole(roleForm.value);
    showSnackbar('Rol actualizado correctamente');
  } else {
    roleStore.addRole(roleForm.value);
    showSnackbar('Rol añadido correctamente');
  }
  roleDialog.value = false;
};

const confirmDeleteRole = (roleId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
    roleStore.deleteRole(roleId);
    showSnackbar('Rol eliminado correctamente', 'error');
  }
};

const updateTaskStatusFromKanban = ({ taskId, newStatus }) => {
  if (!project.value) return;
  const taskToUpdate = project.value.tasks.find(task => task.id === parseInt(taskId, 10));
  if (taskToUpdate) {
    projectStore.updateProjectTask(project.value.id, { ...taskToUpdate, status: newStatus });
    logActivity(`Estado de la tarea '${taskToUpdate.description}' actualizado a: ${newStatus}.`, 'mdi-check-circle', 'success');
  }
};

const projectProgress = computed(() => {
  if (!project.value || !project.value.tasks) {
    return { percentage: 0, completedTasks: 0, totalTasks: 0 };
  }
  const totalTasks = project.value.tasks.length;
  const completedTasks = project.value.tasks.filter(t => t.status === 'Completado').length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return { percentage, completedTasks, totalTasks };
});

const availableVolunteers = computed(() => {
  return volunteerStore.volunteers.map(v => ({
    id_voluntario: v.id,
    name: v.name,
  }));
});

const openAssignVolunteerDialog = () => {
  assignVolunteerDialog.value = true;
};

const assignVolunteerToTask = () => {
  if (selectedTaskForAssignmentId.value && selectedVolunteerId.value) {
    projectStore.assignVolunteerToTask(
      project.value.id,
      selectedTaskForAssignmentId.value,
      selectedVolunteerId.value,
      assignedRole.value || 'Voluntario' // Default role if not specified
    );
    logActivity(`Voluntario ${availableVolunteers.value.find(v => v.id_voluntario === selectedVolunteerId.value)?.name || 'desconocido'} asignado a la tarea ${project.value.tasks.find(t => t.id === selectedTaskForAssignmentId.value)?.description || 'desconocida'}`, 'mdi-account-check', 'success');
    assignVolunteerDialog.value = false;
    selectedVolunteerId.value = null;
    assignedRole.value = '';
    selectedTaskForAssignmentId.value = null;
  }
};

</script>

<style scoped>
.project-detail-view {
  background-color: #f8f9fa;
}
</style>