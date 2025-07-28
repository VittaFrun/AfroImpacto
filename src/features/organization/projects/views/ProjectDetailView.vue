<template>
  <v-container fluid class="pa-8">
    <v-row>
      <v-col cols="12">
        <v-btn icon @click="router.back()" class="mb-4">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="text-h4 font-weight-bold text-primary mb-4">Gestion del Proyecto: {{ project?.name }}</h1>
        <v-btn color="primary" @click="saveProjectChanges" class="mb-4">Guardar Cambios</v-btn>
      </v-col>
    </v-row>

    <v-row v-if="project">
      <v-col cols="12" md="8">
        <v-card class="pa-6 rounded-lg elevation-0 mb-6">
          <v-card-title class="text-h6 font-weight-bold mb-2">Información General</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-img
            v-if="project.coverImage"
            :src="project.coverImage"
            class="rounded-lg mb-4"
            height="250"
            cover
          ></v-img>
          <p class="text-body-1 mb-2"><strong>Descripción:</strong> {{ project.description }}</p>
          <p class="text-body-1 mb-2"><strong>Objetivo:</strong> {{ project.objective || 'N/A' }}</p>
          <p class="text-body-1 mb-2"><strong>Ubicación:</strong> {{ project.location }}</p>
          <p class="text-body-1 mb-2"><strong>Fecha de Inicio:</strong> {{ project.startDate }}</p>
          <p class="text-body-1 mb-2"><strong>Fecha de Fin:</strong> {{ project.endDate }}</p>
          <p class="text-body-1 mb-2"><strong>Estado:</strong> <v-chip :color="project.statusColor" size="small">{{ project.status }}</v-chip></p>
        </v-card>

        <!-- Sección de Fases y Tareas (Integrada) -->
        <v-card class="pa-6 rounded-lg elevation-0 mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Fases y Tareas del Proyecto</span>
            <v-btn color="primary" @click="openAddPhaseDialog" size="small" style="color: white;">Añadir Fase</v-btn>
          </v-card-title>
          <v-divider class="mb-4"></v-divider>

          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="phase in project.phases" :key="phase.id">
              <v-expansion-panel-title>
                <div class="d-flex justify-space-between align-center w-100">
                  <span class="font-weight-bold">{{ phase.name }}</span>
                  <v-chip :color="phase.statusColor" size="small">{{ phase.status }}</v-chip>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="text-body-2 mb-4">{{ phase.description }}</p>
                <v-divider></v-divider>
                <v-card-title class="d-flex justify-space-between align-center mt-4">
                  <span class="text-subtitle-1 font-weight-bold">Tareas de la Fase</span>
                  <v-btn color="secondary" size="small" @click="openAddTaskDialog(phase.id)">Añadir Tarea</v-btn>
                </v-card-title>
                <v-list density="compact">
                  <div v-for="task in tasksByPhase(phase.id)" :key="task.id">
                    <v-list-item>
                      <v-list-item-title>{{ task.description }}</v-list-item-title>
                      <v-list-item-subtitle>Fechas: {{ task.startDate }} - {{ task.endDate }}</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-select
                                                    :items="['Pendiente', 'En Progreso', 'Completado']"
                          v-model="task.status"
                          density="compact"
                          hide-details
                          single-line
                          class="mr-2"
                          style="width: 120px;"
                          @update:modelValue="updateTaskStatus(task, $event)"
                        ></v-select>
                        <v-btn icon="mdi-pencil" variant="text" color="warning" size="small" @click="openEditTaskDialog(task)"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="confirmDeleteTask(task.id)"></v-btn>
                        <v-btn icon="mdi-account-plus" variant="text" color="info" size="small" @click="openAssignmentDialog(task)"></v-btn>
                      </template>
                    </v-list-item>
                    <v-list-item v-if="task.assignments && task.assignments.length > 0" class="ml-4">
                        <v-chip v-for="assignment in task.assignments" :key="assignment.assignmentId" size="small" class="mr-2" closable @click:close="unassignVolunteer(task.id, assignment.assignmentId)" :color="assignment.roleColor">
                          <v-icon start>mdi-account-circle</v-icon>
                          {{ assignment.volunteerName }} ({{ assignment.role }})
                        </v-chip>
                    </v-list-item>
                  </div>
                  <v-card-text v-if="tasksByPhase(phase.id).length === 0" class="text-center grey--text">
                    No hay tareas para esta fase.
                  </v-card-text>
                </v-list>
                 <v-card-actions class="mt-4">
                  <v-spacer></v-spacer>
                  <v-btn variant="text" color="warning" @click.stop="openEditPhaseDialog(phase)">Editar Fase</v-btn>
                  <v-btn variant="text" color="error" @click.stop="confirmDeletePhase(phase.id)">Eliminar Fase</v-btn>
                </v-card-actions>
              </v-expansion-panel-text>
            </v-expansion-panel>
             <v-card-text v-if="!project.phases || project.phases.length === 0" class="text-center grey--text">
              Este proyecto aún no tiene fases definidas.
            </v-card-text>
          </v-expansion-panels>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- Sección de Donaciones (Dummy) -->
        <v-card class="pa-6 rounded-lg elevation-0 mb-6">
          <v-card-title class="text-h6 font-weight-bold mb-2">Donaciones Recibidas</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-list density="compact">
            <v-list-item v-for="donation in project.donations" :key="donation.id">
              <v-list-item-title>Monto: ${{ donation.amount }}</v-list-item-title>
              <v-list-item-subtitle>Fecha: {{ donation.date }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Sección de Voluntarios Asignados (Dummy) -->
        <v-card class="pa-6 rounded-lg elevation-0">
          <v-card-title class="text-h6 font-weight-bold mb-2">Voluntarios Asignados</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-list density="compact">
            <v-list-item v-for="volunteer in project.volunteers" :key="volunteer.id">
              <v-list-item-title>{{ volunteer.name }}</v-list-item-title>
              <v-list-item-subtitle>Rol: {{ volunteer.role }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Card for Role Management -->
        <v-card class="pa-6 rounded-lg elevation-0 mt-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Gestión de Roles</span>
            <v-btn color="primary" @click="openAddRoleDialog" size="small">Crear Rol</v-btn>
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-list density="compact">
            <v-list-item v-for="role in roleStore.customRoles" :key="role.id">
              <template v-slot:prepend>
                <v-chip :color="role.color" size="small" class="mr-4"></v-chip>
              </template>
              <v-list-item-title>{{ role.name }}</v-list-item-title>
              <template v-slot:append>
                <v-btn icon="mdi-pencil" variant="text" color="warning" size="small" @click="openEditRoleDialog(role)"></v-btn>
                <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="confirmDeleteRole(role.id)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card class="pa-6 rounded-lg elevation-0">
          <v-card-text class="text-center text-body-1 text-grey-darken-1">
            Cargando detalles del proyecto o proyecto no encontrado.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for Adding/Editing Phases -->
    <v-dialog v-model="phaseDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditingPhase ? 'Editar Fase' : 'Añadir Nueva Fase' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editablePhase.name"
            label="Nombre de la Fase"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          <v-textarea
            v-model="editablePhase.description"
            label="Descripción de la Fase"
            variant="outlined"
            rows="3"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closePhaseDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="savePhase">{{ isEditingPhase ? 'Guardar Cambios' : 'Añadir' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog for Deleting Phases -->
    <v-dialog v-model="deleteConfirmDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que quieres eliminar esta fase? Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteConfirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deletePhaseConfirmed">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for Adding/Editing Tasks -->
    <v-dialog v-model="taskDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditingTask ? 'Editar Tarea' : 'Añadir Nueva Tarea' }}</span>
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="editableTask.description"
            label="Descripción de la Tarea"
            variant="outlined"
            rows="3"
            class="mb-4"
          ></v-textarea>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editableTask.startDate"
                label="Fecha de Inicio"
                type="date"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editableTask.endDate"
                label="Fecha de Fin"
                type="date"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeTaskDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="saveTask">{{ isEditingTask ? 'Guardar Cambios' : 'Añadir' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

     <!-- Confirmation Dialog for Deleting Tasks -->
    <v-dialog v-model="deleteTaskConfirmDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteTaskConfirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteTaskConfirmed">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for Assigning Volunteers -->
    <v-dialog v-model="assignmentDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Asignar Voluntario</span>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedVolunteerId"
            :items="volunteerStore.volunteers"
            item-title="name"
            item-value="id"
            label="Seleccionar Voluntario"
            variant="outlined"
            class="mb-4"
          ></v-select>
          <v-select
            v-model="assignedRole"
            :items="roleStore.customRoles"
            item-title="name"
            item-value="name"
            label="Rol Asignado"
            variant="outlined"
            class="mb-4"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeAssignmentDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="saveAssignment">Asignar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for Adding/Editing Roles -->
    <v-dialog v-model="roleDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditingRole ? 'Editar Rol' : 'Crear Nuevo Rol' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editableRole.name"
            label="Nombre del Rol"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          <v-color-picker
            v-model="editableRole.color"
            show-swatches
            swatches-max-height="100"
          ></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeRoleDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="saveRole">{{ isEditingRole ? 'Guardar' : 'Crear' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog for Deleting Roles -->
    <v-dialog v-model="deleteRoleConfirmDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que quieres eliminar este rol? Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteRoleConfirmDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteRoleConfirmed">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { useVolunteerStore } from '@/features/volunteers/stores/volunteerStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const volunteerStore = useVolunteerStore();
const roleStore = useRoleStore();
const project = ref(null);

// Computed property to filter tasks by phase ID
const tasksByPhase = computed(() => {
  return (phaseId) => {
    if (!project.value || !project.value.tasks) return [];
    return project.value.tasks.filter(task => task.phaseId === phaseId);
  };
});

// State for phase management
const phaseDialog = ref(false);
const deleteConfirmDialog = ref(false);
const isEditingPhase = ref(false);
const editablePhase = ref({ id: null, name: '', description: '' });
const phaseToDeleteId = ref(null);

// State for task management
const taskDialog = ref(false);
const deleteTaskConfirmDialog = ref(false);
const isEditingTask = ref(false);
const editableTask = ref({ id: null, phaseId: null, description: '', startDate: '', endDate: '' });
const taskToDeleteId = ref(null);

// State for assignment management
const assignmentDialog = ref(false);
const selectedVolunteerId = ref(null);
const assignedRole = ref('');
const activeTask = ref(null);

// State for role management
const roleDialog = ref(false);
const isEditingRole = ref(false);
const editableRole = ref({ id: null, name: '', color: '#FFFFFF' });
const deleteRoleConfirmDialog = ref(false);
const roleToDeleteId = ref(null);

const fetchProjectDetails = (id) => {
  project.value = projectStore.getProjectById(parseInt(id));
};

// Functions for task management
function openAddTaskDialog(phaseId) {
  console.log("Opening add task dialog for phaseId:", phaseId);
  isEditingTask.value = false;
  editableTask.value = { id: null, phaseId: phaseId, description: '', startDate: '', endDate: '' };
  taskDialog.value = true;
}

function openEditTaskDialog(task) {
  isEditingTask.value = true;
  editableTask.value = { ...task };
  taskDialog.value = true;
}

function closeTaskDialog() {
  console.log("Closing task dialog.");
  taskDialog.value = false;
  editableTask.value = { id: null, phaseId: null, description: '', startDate: '', endDate: '' };
}

function saveTask() {
  console.log("Attempting to save task:", editableTask.value);
  try {
    if (isEditingTask.value) {
      projectStore.updateProjectTask(project.value.id, editableTask.value);
    } else {
      projectStore.addProjectTask(project.value.id, editableTask.value.phaseId, editableTask.value);
    }
    console.log("Task saved successfully.");
  } catch (error) {
    console.error("Error saving task:", error);
    alert("Hubo un error al guardar la tarea. Por favor, inténtalo de nuevo.");
  } finally {
    closeTaskDialog();
  }
}

function confirmDeleteTask(taskId) {
  taskToDeleteId.value = taskId;
  deleteTaskConfirmDialog.value = true;
}

function deleteTaskConfirmed() {
  projectStore.deleteProjectTask(project.value.id, taskToDeleteId.value);
  deleteTaskConfirmDialog.value = false;
}

// Functions for assignment management
function openAssignmentDialog(task) {
  activeTask.value = task;
  assignmentDialog.value = true;
}

function closeAssignmentDialog() {
  assignmentDialog.value = false;
  selectedVolunteerId.value = null;
  assignedRole.value = '';
  activeTask.value = null;
}

function saveAssignment() {
  if (selectedVolunteerId.value && assignedRole.value) {
    projectStore.assignVolunteerToTask(
      project.value.id,
      activeTask.value.id,
      selectedVolunteerId.value,
      assignedRole.value
    );
    closeAssignmentDialog();
  }
}

function updateTaskStatus(task, newStatus) {
  const statusColorMap = {
    'Pendiente': 'orange',
    'En Progreso': 'green',
    'Completado': 'blue',
  };
  const updatedTask = { ...task, status: newStatus, statusColor: statusColorMap[newStatus] };
  projectStore.updateProjectTask(project.value.id, updatedTask);
  projectStore.updatePhaseStatusBasedOnTasks(project.value.id, task.phaseId);
}

// Functions for assignment management
function openAddRoleDialog() {
  isEditingRole.value = false;
  editableRole.value = { id: null, name: '', color: '#FFFFFF' };
  roleDialog.value = true;
}

function openEditRoleDialog(role) {
  isEditingRole.value = true;
  editableRole.value = { ...role };
  roleDialog.value = true;
}

function closeRoleDialog() {
  roleDialog.value = false;
}

function saveRole() {
  if (isEditingRole.value) {
    roleStore.updateRole(editableRole.value);
  } else {
    roleStore.addRole(editableRole.value);
  }
  closeRoleDialog();
}

function confirmDeleteRole(roleId) {
  roleToDeleteId.value = roleId;
  deleteRoleConfirmDialog.value = true;
}

function deleteRoleConfirmed() {
  roleStore.deleteRole(roleToDeleteId.value);
  deleteRoleConfirmDialog.value = false;
}

// Functions for phase management
function openAddPhaseDialog() {
  isEditingPhase.value = false;
  editablePhase.value = { id: null, name: '', description: '' };
  phaseDialog.value = true;
}

function openEditPhaseDialog(phase) {
  isEditingPhase.value = true;
  editablePhase.value = { ...phase };
  phaseDialog.value = true;
}

function closePhaseDialog() {
  phaseDialog.value = false;
}

function savePhase() {
  if (isEditingPhase.value) {
    projectStore.updateProjectPhase(project.value.id, editablePhase.value);
  } else {
    projectStore.addProjectPhase(project.value.id, editablePhase.value);
  }
  closePhaseDialog();
}

function confirmDeletePhase(phaseId) {
  phaseToDeleteId.value = phaseId;
  deleteConfirmDialog.value = true;
}

function deletePhaseConfirmed() {
  projectStore.deleteProjectPhase(project.value.id, phaseToDeleteId.value);
  deleteConfirmDialog.value = false;
}

function updatePhaseStatus(phase, newStatus) {
  const statusColorMap = {
    'Pendiente': 'orange',
    'En Progreso': 'green',
    'Completado': 'blue',
  };
  const updatedPhase = { ...phase, status: newStatus, statusColor: statusColorMap[newStatus] };
  projectStore.updateProjectPhase(project.value.id, updatedPhase);
}

function saveProjectChanges() {
  if (project.value) {
    projectStore.updateProject(project.value);
    alert('Cambios guardados exitosamente!');
  }
}

onMounted(() => {
  if (route.params.id) {
    fetchProjectDetails(route.params.id);
  }
});

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProjectDetails(newId);
  }
});
</script>

<style scoped>
.highlight-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px -5px rgba(0,0,0,0.1) !important;
}
</style>