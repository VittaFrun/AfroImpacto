<template>
  <v-container fluid class="pa-4 pa-md-6 project-detail-view">
    <div v-if="projectLoading" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="projectError" class="d-flex justify-center align-center" style="height: 60vh;">
      <v-alert type="error" prominent>
        {{ projectError }}
      </v-alert>
    </div>

    <div v-else-if="project">
      <!-- Breadcrumbs -->
      <div class="mb-3">
        <v-breadcrumbs
          :items="breadcrumbItems"
          class="pa-0"
          density="compact"
        >
          <template v-slot:divider>
            <v-icon size="small">mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              :to="item.to"
              :disabled="item.disabled"
              class="text-caption"
            >
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </div>

      <!-- Header Compacto -->
      <v-card class="mb-4 project-header-card elevation-1" rounded="lg">
        <v-card-text class="pa-4">
          <v-row align="center" no-gutters>
            <v-col cols="12" md="8">
              <div class="d-flex align-center flex-wrap mb-2 gap-2">
                <h1 class="text-h5 font-weight-bold text-grey-darken-2 mr-3">
                  {{ project.name }}
                </h1>
                <v-chip 
                  :color="getStatusColor(project.id_estado)" 
                  size="small"
                  class="mr-2"
                >
                  <v-icon start size="16">{{ getStatusIcon(project.id_estado) }}</v-icon>
                  {{ getStatusText(project.id_estado) }}
                </v-chip>
                <v-chip 
                  :color="project.es_publico ? 'success' : 'grey'" 
                  variant="tonal"
                  size="small"
                >
                  <v-icon start size="14">{{ project.es_publico ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                  {{ project.es_publico ? 'Público' : 'Privado' }}
                </v-chip>
              </div>
              <p class="text-body-2 text-grey-darken-1 mb-0">
                {{ project.description }}
              </p>
            </v-col>
            
            <v-col cols="12" md="4" class="text-md-right mt-3 mt-md-0">
              <div class="d-flex flex-wrap justify-md-end gap-2">
                <ModernButton
                  color="grey"
                  variant="outlined"
                  prepend-icon="mdi-arrow-left"
                  @click="router.back()"
                  size="small"
                >
                  Volver
                </ModernButton>
                
                <ModernButton
                  color="warning"
                  variant="outlined"
                  prepend-icon="mdi-pencil"
                  @click="openEditProjectDialog"
                  size="small"
                >
                  Editar
                </ModernButton>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tabs Navigation - Estilo Empresarial -->
      <v-card class="mb-4 elevation-1" rounded="lg">
        <v-tabs
          v-model="activeTab"
          color="primary"
          class="enterprise-tabs"
          show-arrows
        >
          <v-tab value="overview" class="tab-item">
            <v-icon start>mdi-view-dashboard</v-icon>
            <span class="tab-text">Vista General</span>
          </v-tab>
          
          <v-tab value="team" class="tab-item">
            <v-icon start>mdi-account-group</v-icon>
            <span class="tab-text">Equipo</span>
            <v-badge 
              v-if="getUniqueVolunteersCount() > 0"
              :content="getUniqueVolunteersCount()" 
              color="primary"
              inline
              class="ml-2"
            />
          </v-tab>
          
          <v-tab value="applications" class="tab-item">
            <v-icon start>mdi-account-plus</v-icon>
            <span class="tab-text">Solicitudes</span>
            <v-badge 
              v-if="solicitudesPendientes.length > 0"
              :content="solicitudesPendientes.length" 
              color="warning"
              inline
              class="ml-2"
            />
          </v-tab>
          
          <v-tab value="tasks" class="tab-item">
            <v-icon start>mdi-format-list-checks</v-icon>
            <span class="tab-text">Fases y Tareas</span>
            <v-badge 
              v-if="getTotalTasks() > 0"
              :content="getTotalTasks()" 
              color="info"
              inline
              class="ml-2"
            />
          </v-tab>
          
          <v-tab value="history" class="tab-item">
            <v-icon start>mdi-history</v-icon>
            <span class="tab-text">Historial</span>
          </v-tab>
          
          <v-tab value="settings" class="tab-item">
            <v-icon start>mdi-cog</v-icon>
            <span class="tab-text">Configuración</span>
          </v-tab>
        </v-tabs>
      </v-card>

      <!-- Tabs Content -->
      <v-window v-model="activeTab" class="mt-4">
        <!-- Tab 1: Vista General -->
        <v-window-item value="overview">
          <OverviewTab
            :project="project"
            :volunteer-hours="volunteerHours"
            :loading-horas="loadingHoras"
            :get-total-tasks="getTotalTasks"
            :get-completed-tasks-count="getCompletedTasksCount"
            :get-completed-phases-count="getCompletedPhasesCount"
            :get-project-progress="getProjectProgress"
            :get-tasks-progress="getTasksProgress"
            :get-phases-progress="getPhasesProgress"
            :get-unique-volunteers-count="getUniqueVolunteersCount"
            :format-currency="formatCurrency"
            :get-tipo-pago-text="getTipoPagoText"
            :get-frecuencia-text="getFrecuenciaText"
            @open-beneficio-dialog="openBeneficioDialog"
            @open-hours-dialog="openHorasDialog"
            @open-reports="openProjectReports"
            @export-data="exportProjectData"
            @toggle-visibility="toggleProjectVisibility"
          />
        </v-window-item>

        <!-- Tab 2: Gestión de Equipo -->
        <v-window-item value="team">
          <TeamTab
            :project="project"
            :project-roles="projectRoles"
            :solicitudes-aprobadas="solicitudesAprobadas"
            :get-all-assignments="getAllAssignments"
            :get-unique-volunteers-count="getUniqueVolunteersCount"
            :get-role-type-color="getRoleTypeColor"
            :get-role-type-label="getRoleTypeLabel"
            :is-loading="isLoading"
            :assignment-to-remove="assignmentToRemove"
            @open-role-management="openRoleManagement"
            @open-assign-volunteer="openAssignVolunteerDialog"
            @view-member-details="viewMemberDetails"
            @remove-all-member-assignments="removeAllMemberAssignments"
            @add-role="handleAddRole"
            @edit-role="handleEditRole"
            @delete-role="confirmDeleteRole"
            @confirm-remove-assignment="confirmRemoveAssignment"
            @confirm-remove-all-assignments="confirmRemoveAllAssignments"
          />
        </v-window-item>

        <!-- Tab 3: Solicitudes de Inscripción -->
        <v-window-item value="applications">
          <ApplicationsTab
            :solicitudes="solicitudes"
            :solicitudes-pendientes="solicitudesPendientes"
            :solicitudes-aprobadas="solicitudesAprobadas"
            :solicitudes-rechazadas="solicitudesRechazadas"
            :get-estado-color="getEstadoColor"
            :get-estado-icon="getEstadoIcon"
            :get-estado-text="getEstadoText"
            :is-loading="isLoading"
            :solicitud-to-delete="solicitudToDelete"
            @refresh-solicitudes="openSolicitudesDialog"
            @update-solicitud-estado="updateSolicitudEstado"
            @confirm-delete-solicitud="confirmDeleteSolicitud"
            @confirm-reject-all-pending="confirmRejectAllPending"
            @confirm-delete-all-active="confirmDeleteAllActive"
            @approve-all-pending="approveAllPending"
          />
        </v-window-item>

        <!-- Tab 4: Fases y Tareas -->
        <v-window-item value="tasks">
          <TasksTab
            :project="project"
            :get-all-tasks="getAllTasks"
            :get-total-tasks="getTotalTasks"
            :tasks-by-phase="tasksByPhase"
            :get-completed-tasks-by-phase="getCompletedTasksByPhase"
            :get-phase-status="getPhaseStatus"
            :get-phase-status-color="getPhaseStatusColor"
            :get-task-status-color="getTaskStatusColor"
            :get-task-status-icon="getTaskStatusIcon"
            :get-task-status="getTaskStatus"
            :get-priority-color="getPriorityColor"
            @open-add-phase="openAddPhaseDialog"
            @edit-phase="openEditPhaseDialog"
            @delete-phase="openDeletePhaseDialog"
            @open-add-task="openAddTaskDialog"
            @add-task-to-phase="openAddTaskDialog"
            @edit-task="openEditTaskDialog"
            @delete-task="openDeleteTaskDialog"
            @update-task-status="updateTaskStatusFromKanban"
            @task-clicked="openEditTaskDialog"
          />
        </v-window-item>

        <!-- Tab 5: Historial -->
        <v-window-item value="history">
          <HistoryTab :project-id="project.id" />
        </v-window-item>

        <!-- Tab 6: Configuración -->
        <v-window-item value="settings">
          <SettingsTab
            :project="project"
            :can-delete-project="canDeleteProject"
            :delete-project-restriction-message="deleteProjectRestrictionMessage"
            :get-status-color="getStatusColor"
            :get-status-icon="getStatusIcon"
            :get-status-text="getStatusText"
            :get-tipo-pago-text="getTipoPagoText"
            :get-frecuencia-text="getFrecuenciaText"
            :format-currency="formatCurrency"
            :is-loading="isLoading"
            @toggle-visibility="toggleProjectVisibility"
            @edit-project="openEditProjectDialog"
            @open-beneficio-dialog="openBeneficioDialog"
            @open-reports="openProjectReports"
            @export-data="exportProjectData"
            @delete-project="openDeleteProjectDialog"
          />
        </v-window-item>
      </v-window>
    </div>

    <div v-else>
      <v-alert type="warning" prominent>
        No se pudo encontrar el proyecto.
      </v-alert>
    </div>

    <!-- Modern Dialogs -->
    
    <!-- Task Management Dialog -->
    <TaskDialog
      v-model="taskDialog"
      :task="currentTask"
      :phases="project?.phases || []"
      :priority-options="priorityOptions"
      :complexity-options="complexityOptions"
      :task-status-options="taskStatusOptions"
      :is-viewing-task="isViewingTask"
      :loading="isLoading('addingTask') || isLoading('updatingTask')"
      :errors="errors"
      :get-task-status-color="getTaskStatusColor"
      :get-task-status-icon="getTaskStatusIcon"
      :get-task-status="getTaskStatus"
      :get-priority-color="getPriorityColor"
      :format-date-range="formatDateRange"
      :get-phase-name="getPhaseName"
      @save="handleTaskSave"
      @switch-to-edit="switchToEditMode"
    />

    <!-- Phase Management Dialog -->
    <PhaseDialog
      v-model="phaseDialog"
      :phase="currentPhase"
      :loading="isLoading('addingPhase') || isLoading('updatingPhase')"
      :errors="errors"
      @save="handlePhaseSave"
    />

    <!-- Project Edit Dialog -->
    <ProjectEditDialog
      v-model="editProjectDialog"
      :project="project"
      :project-status-options="projectStatusOptions"
      :loading="isLoading('updatingProject')"
      :errors="errors"
      @save="handleProjectSave"
    />

    <!-- Volunteer Assignment Dialog -->
    <AssignVolunteerDialog
      v-model="assignVolunteerDialog"
      :tasks="getAllTasks()"
      :available-volunteers="availableVolunteers"
      :available-project-roles="availableProjectRoles"
      :roles-loading="roleStore.loading"
      :loading="isLoading('assigningVolunteer')"
      :get-role-type-color="getRoleTypeColor"
      :get-role-type-label="getRoleTypeLabel"
      @save="handleAssignVolunteer"
    />

    <!-- Manage Roles Dialog -->
    <ManageRolesDialog
      v-model="manageRolesDialog"
      :project-roles="projectRoles"
      :loading="roleStore.loading"
      :get-role-type-color="getRoleTypeColor"
      :get-role-type-label="getRoleTypeLabel"
      @add-role="handleAddRole"
      @edit-role="handleEditRole"
      @delete-role="confirmDeleteRole"
    />

    <!-- Role Management Dialog -->
    <RoleDialog
      v-model="roleDialog"
      :role="currentRole"
      :role-types="roleTypes"
      :loading="isLoading('savingRole')"
      @save="handleRoleSave"
      @role-type-change="onRoleTypeChange"
    />

    <!-- Confirm Delete Dialogs -->
    <DeleteConfirmDialog
      v-model="confirmDeleteProjectDialog"
      title="Confirmar Eliminación de Proyecto"
      :message="canDeleteProject ? '¿Estás seguro de que quieres eliminar este proyecto?' : 'No se puede eliminar el proyecto'"
      :sub-message="canDeleteProject ? 'Esta acción no se puede deshacer. Se eliminarán todas las fases y tareas asociadas.' : deleteProjectRestrictionMessage"
      confirm-text="Eliminar"
      :loading="isLoading('deletingProject')"
      :disabled="!canDeleteProject"
      @confirm="confirmDeleteProject"
    />

    <DeleteConfirmDialog
      v-model="confirmDeletePhaseDialog"
      title="Confirmar Eliminación de Fase"
      message="¿Estás seguro de que quieres eliminar esta fase?"
      sub-message="Se eliminarán todas las tareas asociadas a esta fase."
      confirm-text="Eliminar"
      :loading="isLoading('deletingPhase')"
      @confirm="confirmDeletePhase"
    />

    <DeleteConfirmDialog
      v-model="confirmDeleteTaskDialog"
      title="Confirmar Eliminación de Tarea"
      message="¿Estás seguro de que quieres eliminar esta tarea?"
      sub-message="Esta acción no se puede deshacer."
      confirm-text="Eliminar"
      :loading="isLoading('deletingTask')"
      @confirm="confirmDeleteTask"
    />

    <DeleteConfirmDialog
      v-model="confirmRemoveAssignmentDialog"
      title="Confirmar Eliminación de Asignación"
      :message="assignmentToRemove ? `¿Estás seguro de que quieres eliminar la asignación de ${assignmentToRemove.name}?` : '¿Estás seguro de que quieres eliminar esta asignación?'"
      sub-message="El voluntario será removido de la tarea asignada. Esta acción no se puede deshacer."
      confirm-text="Eliminar Asignación"
      :loading="isLoading('removingAssignment')"
      @confirm="removeAssignmentConfirmed"
    />

    <!-- Diálogo mejorado para eliminar múltiples asignaciones -->
    <MultipleAssignmentsRemovalDialog
      v-model="confirmRemoveAllAssignmentsDialog"
      :assignments="getAllAssignments()"
      :loading="isLoading('removingAllAssignments')"
      @confirm="removeAllAssignmentsConfirmed"
    />

    <DeleteConfirmDialog
      v-model="confirmDeleteSolicitudDialog"
      title="Confirmar Eliminación de Solicitud"
      :message="solicitudToDelete ? `¿Estás seguro de que quieres eliminar la solicitud de ${solicitudToDelete.voluntario?.usuario?.nombre || 'este voluntario'}?` : '¿Estás seguro de que quieres eliminar esta solicitud?'"
      sub-message="La solicitud será eliminada permanentemente. Esta acción no se puede deshacer."
      confirm-text="Eliminar Solicitud"
      :loading="isLoading('deletingSolicitud')"
      @confirm="deleteSolicitudConfirmed"
    />

    <DeleteConfirmDialog
      v-model="confirmRejectAllPendingDialog"
      :title="`Confirmar Rechazo de ${solicitudesPendientes.length} Solicitud(es) Pendiente(s)`"
      :message="`¿Estás seguro de que quieres rechazar todas las solicitudes pendientes (${solicitudesPendientes.length})?`"
      sub-message="Todas las solicitudes pendientes serán marcadas como rechazadas. Esta acción puede revertirse aprobándolas nuevamente."
      confirm-text="Rechazar Todas"
      :loading="isLoading('rejectingAllSolicitudes')"
      @confirm="rejectAllPendingConfirmed"
    />

    <DeleteConfirmDialog
      v-model="confirmDeleteAllActiveDialog"
      :title="`Confirmar Eliminación de ${solicitudesPendientes.length + solicitudesAprobadas.length} Solicitud(es) Activa(s)`"
      :message="`¿Estás seguro de que quieres eliminar todas las solicitudes activas (${solicitudesPendientes.length + solicitudesAprobadas.length})?`"
      sub-message="Se eliminarán todas las solicitudes pendientes y aprobadas. Esta acción no se puede deshacer."
      confirm-text="Eliminar Todas"
      :loading="isLoading('deletingAllSolicitudes')"
      @confirm="deleteAllActiveConfirmed"
    />

    <!-- Volunteer Removal Dialog with Validation -->
    <VolunteerRemovalDialog
      v-model="volunteerRemovalDialog"
      :volunteer="volunteerToRemove"
      :validation-result="volunteerValidationResult"
      :loading="validationLoading"
      :removing="isLoading('removingVolunteer')"
      @confirm="removeVolunteerConfirmed"
    />

    <!-- Beneficios Dialog -->
    <BeneficioDialog
      v-model="beneficioDialog"
      :beneficio="project?.beneficio"
      :loading="isLoading('savingBeneficio')"
      @save="handleBeneficioSave"
    />

    <!-- Solicitudes Dialog -->
    <SolicitudesDialog
      v-model="solicitudesDialog"
      :solicitudes="solicitudes"
      :loading="isLoading('updatingSolicitud')"
      :get-estado-color="getEstadoColor"
      :get-estado-text="getEstadoText"
      @update-estado="updateSolicitudEstado"
    />

    <!-- Volunteer Hours Dialog -->
    <HoursDialog
      v-model="horasDialog"
      :volunteer-hours="volunteerHours"
      :loading="loadingHoras"
      :verifying-hours="verifyingHours"
      :format-date="formatDate"
      @verify-hours="verificarHoras"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from '@/plugins/axios';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { useVolunteerStore } from '@/features/volunteer/stores/volunteerStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';
import { useEstadoStore } from '@/features/organization/stores/estadoStore';
import { useProyectoBeneficioStore } from '@/features/organization/projects/stores/proyectoBeneficioStore';
import { useSolicitudInscripcionStore } from '@/features/organization/projects/stores/solicitudInscripcionStore';
import { useFormValidation } from '@/features/organization/projects/composables/useFormValidation';
import { useProjectOperations } from '@/features/organization/projects/composables/useProjectOperations';
import {
  PROJECT_STATUS_OPTIONS,
  TASK_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  COMPLEXITY_OPTIONS,
  getStatusIcon,
  getStatusColor,
  getStatusText,
  getTaskStatusIcon,
  getTaskStatusColor,
  getTaskStatusText,
  getPriorityColor
} from '@/features/organization/projects/constants/projectConstants';

// Tab Components
import OverviewTab from '../components/tabs/OverviewTab.vue';
import TeamTab from '../components/tabs/TeamTab.vue';
import ApplicationsTab from '../components/tabs/ApplicationsTab.vue';
import TasksTab from '../components/tabs/TasksTab.vue';
import SettingsTab from '../components/tabs/SettingsTab.vue';
import HistoryTab from '../components/tabs/HistoryTab.vue';

// UI Components
import ModernButton from '@/components/ui/ModernButton.vue';

// Dialog Components
import TaskDialog from '../components/dialogs/TaskDialog.vue';
import PhaseDialog from '../components/dialogs/PhaseDialog.vue';
import ProjectEditDialog from '../components/dialogs/ProjectEditDialog.vue';
import AssignVolunteerDialog from '../components/dialogs/AssignVolunteerDialog.vue';
import RoleDialog from '../components/dialogs/RoleDialog.vue';
import ManageRolesDialog from '../components/dialogs/ManageRolesDialog.vue';
import BeneficioDialog from '../components/dialogs/BeneficioDialog.vue';
import SolicitudesDialog from '../components/dialogs/SolicitudesDialog.vue';
import HoursDialog from '../components/dialogs/HoursDialog.vue';
import DeleteConfirmDialog from '../components/dialogs/DeleteConfirmDialog.vue';
import VolunteerRemovalDialog from '../components/VolunteerRemovalDialog.vue';
import MultipleAssignmentsRemovalDialog from '../components/MultipleAssignmentsRemovalDialog.vue';

import { useVolunteerValidation } from '../composables/useVolunteerValidation';
import { formatDate, formatDateRange } from '@/utils/formatters';
import { ROUTES } from '@/constants/routes';

const route = useRoute();
const router = useRouter();

const projectStore = useProjectStore();
const volunteerStore = useVolunteerStore();
const roleStore = useRoleStore();
const estadoStore = useEstadoStore();
const beneficioStore = useProyectoBeneficioStore();
const solicitudStore = useSolicitudInscripcionStore();

// Composables
const { 
  errors: validationErrors, 
  validateProjectForm, 
  validatePhaseForm, 
  validateTaskForm,
  clearErrors
} = useFormValidation();

const errors = computed(() => validationErrors);

const { 
  handleOperation, 
  isLoading 
} = useProjectOperations();

const { 
  validateVolunteerRemoval,
  loading: validationLoading 
} = useVolunteerValidation();

const { loading: projectLoading, error: projectError } = storeToRefs(projectStore);
const { projectRoles } = storeToRefs(roleStore);
const { allEstados } = storeToRefs(estadoStore);

const project = computed(() => projectStore.getProjectById(parseInt(route.params.id, 10)));

// Tab state
const activeTab = ref('overview');

// Breadcrumbs
const breadcrumbItems = computed(() => [
  {
    title: 'Proyectos',
    to: ROUTES.ORGANIZATION.PROJECTS,
    disabled: false
  },
  {
    title: project.value?.name || 'Detalle',
    to: '#',
    disabled: true
  }
]);

onMounted(async () => {
  const projectId = parseInt(route.params.id, 10);
  if (projectId) {
    await projectStore.fetchProjectById(projectId);
    await roleStore.fetchProjectRoles(projectId);
    try {
      await solicitudStore.fetchByProject(projectId);
      solicitudes.value = solicitudStore.allSolicitudes || [];
    } catch (error) {
      console.error('Error loading solicitudes:', error);
      solicitudes.value = [];
    }
  }
  await estadoStore.fetchEstados();
  await loadVolunteerHours();
});

// Dialog states
const editProjectDialog = ref(false);
const phaseDialog = ref(false);
const currentPhase = ref(null);
const phaseForm = ref({ name: '', description: '', orden: 1 });
const manageRolesDialog = ref(false);
const assignVolunteerDialog = ref(false);
const selectedVolunteerId = ref(null);
const assignedRole = ref(null);
const selectedTaskForAssignmentId = ref(null);
const taskDialog = ref(false);
const currentTask = ref(null);
const taskForm = ref({
  description: '',
  startDate: '',
  endDate: '',
  prioridad: 'Media',
  complejidad: 'Media',
  id_estado: 1,
  phaseId: null
});
const isViewingTask = ref(false);

// Confirm dialogs
const confirmDeleteProjectDialog = ref(false);
const confirmDeletePhaseDialog = ref(false);
const confirmDeleteTaskDialog = ref(false);
const confirmRemoveAssignmentDialog = ref(false);
const confirmRemoveAllAssignmentsDialog = ref(false);
const confirmDeleteSolicitudDialog = ref(false);
const confirmRejectAllPendingDialog = ref(false);
const confirmDeleteAllActiveDialog = ref(false);
const phaseToDelete = ref(null);
const taskToDelete = ref(null);
const assignmentToRemove = ref(null);
const solicitudToDelete = ref(null);
const volunteerToRemove = ref(null);
const volunteerRemovalDialog = ref(false);
const volunteerValidationResult = ref(null);

// Beneficios y Solicitudes dialogs
const beneficioDialog = ref(false);
const beneficioForm = ref({
  tipo_pago: 'volunteer',
  monto: 0,
  frecuencia: 'none',
  descripcion_pago: '',
  incluye_transporte: false,
  incluye_alimentacion: false,
  incluye_materiales: false,
  incluye_seguro: false
});
const solicitudesDialog = ref(false);
const solicitudes = ref([]);

// Volunteer Hours
const loadingHoras = ref(false);
const volunteerHours = ref([]);
const horasDialog = ref(false);

// Options for selects
const priorityOptions = PRIORITY_OPTIONS;
const complexityOptions = COMPLEXITY_OPTIONS;
const taskStatusOptions = TASK_STATUS_OPTIONS;
const projectStatusOptions = computed(() => {
  if (allEstados.value && allEstados.value.length > 0) {
    return allEstados.value.map(estado => ({
      title: estado.nombre.charAt(0).toUpperCase() + estado.nombre.slice(1),
      value: estado.id_estado,
      icon: getStatusIcon(estado.id_estado),
      color: getStatusColor(estado.id_estado)
    }));
  }
  return PROJECT_STATUS_OPTIONS;
});

// Snackbar state
const snackbar = ref({ show: false, text: '', color: '' });

function showSnackbar(text, color = 'success') {
  snackbar.value = { show: true, text, color };
}

// Task management functions
const tasksByPhase = computed(() => {
  return (phaseId) => {
    if (!project.value || !project.value.phases) return [];
    const phase = project.value.phases.find(p => p.id === phaseId);
    return phase?.tareas || [];
  };
});

const logActivity = () => {
  // Activity logging disabled
};

// Phase functions
function openAddPhaseDialog() {
  currentPhase.value = null;
  phaseForm.value = { 
    name: '', 
    description: '', 
    orden: (project.value?.phases?.length || 0) + 1 
  };
  phaseDialog.value = true;
}

function openEditPhaseDialog(phase) {
  currentPhase.value = phase;
  phaseForm.value = { ...phase };
  phaseDialog.value = true;
}

async function savePhase() {
  if (!project.value) return;
  
  clearErrors();
  if (!validatePhaseForm(phaseForm.value)) {
    showSnackbar('Por favor corrige los errores en el formulario', 'error');
    return;
  }
  
  const phaseData = {
    nombre: phaseForm.value.name,
    descripcion: phaseForm.value.description,
    orden: phaseForm.value.orden || (project.value.phases?.length || 0) + 1
  };
  
  const operation = currentPhase.value
    ? () => projectStore.updateProjectPhase(project.value.id, currentPhase.value.id, phaseData)
    : () => projectStore.addProjectPhase(project.value.id, phaseData);
  
  const successMessage = currentPhase.value
    ? `Fase '${phaseForm.value.name}' actualizada correctamente`
    : `Fase '${phaseForm.value.name}' añadida correctamente`;
  
  await handleOperation(
    operation,
    currentPhase.value ? 'updatingPhase' : 'addingPhase',
    successMessage,
    'Error al guardar la fase',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      phaseDialog.value = false;
      phaseForm.value = { name: '', description: '', orden: 1 };
    }
  );
}

function openDeletePhaseDialog(phaseId) {
  phaseToDelete.value = phaseId;
  confirmDeletePhaseDialog.value = true;
}

async function confirmDeletePhase() {
  if (!phaseToDelete.value) return;
  
  await handleOperation(
    () => projectStore.deleteProjectPhase(project.value.id, phaseToDelete.value),
    'deletingPhase',
    'Fase eliminada correctamente',
    'Error al eliminar la fase',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      confirmDeletePhaseDialog.value = false;
      phaseToDelete.value = null;
    }
  );
}

// Task functions
function openDeleteTaskDialog(taskId) {
  taskToDelete.value = taskId;
  confirmDeleteTaskDialog.value = true;
}

async function confirmDeleteTask() {
  if (!taskToDelete.value) return;
  
  await handleOperation(
    () => projectStore.deleteProjectTask(project.value.id, taskToDelete.value),
    'deletingTask',
    'Tarea eliminada correctamente',
    'Error al eliminar la tarea',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      confirmDeleteTaskDialog.value = false;
      taskToDelete.value = null;
    }
  );
}

const saveTask = async () => {
  if (!project.value) return;

  clearErrors();
  if (!validateTaskForm(taskForm.value)) {
    showSnackbar('Por favor corrige los errores en el formulario', 'error');
    return;
  }

  const taskData = {
    descripcion: taskForm.value.description,
    fecha_inicio: taskForm.value.startDate,
    fecha_fin: taskForm.value.endDate,
    prioridad: taskForm.value.prioridad || 'Media',
    complejidad: taskForm.value.complejidad || 'Media',
    id_estado: taskForm.value.id_estado || 1,
    id_fase: taskForm.value.phaseId
  };

  const operation = currentTask.value
    ? () => projectStore.updateProjectTask(project.value.id, currentTask.value.id, taskData)
    : () => projectStore.addProjectTask(project.value.id, taskData);

  const successMessage = currentTask.value
    ? `Tarea '${taskForm.value.description}' actualizada correctamente`
    : `Tarea '${taskForm.value.description}' añadida correctamente`;

  await handleOperation(
    operation,
    currentTask.value ? 'updatingTask' : 'addingTask',
    successMessage,
    'Error al guardar la tarea',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      taskDialog.value = false;
      currentTask.value = null;
      isViewingTask.value = false;
      taskForm.value = {
        description: '',
        startDate: '',
        endDate: '',
        prioridad: 'Media',
        complejidad: 'Media',
        id_estado: 1,
        phaseId: null
      };
    }
  );
};

const saveProjectChanges = async () => {
  if (!project.value) return;
  
  clearErrors();
  if (!validateProjectForm(projectForm.value)) {
    showSnackbar('Por favor corrige los errores en el formulario', 'error');
    return;
  }
  
  const projectData = {
    nombre: projectForm.value.name,
    descripcion: projectForm.value.description,
    objetivo: projectForm.value.objective,
    ubicacion: projectForm.value.location,
    fecha_inicio: projectForm.value.startDate,
    fecha_fin: projectForm.value.endDate,
    presupuesto_total: projectForm.value.budget,
    id_estado: projectForm.value.id_estado,
    es_publico: projectForm.value.es_publico,
    requisitos: projectForm.value.requisitos || null
  };
  
  await handleOperation(
    () => projectStore.updateProject(project.value.id, projectData),
    'savingProject',
    'Proyecto actualizado correctamente',
    'Error al actualizar el proyecto',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      editProjectDialog.value = false;
    }
  );
};

const projectForm = ref({
  name: '',
  description: '',
  objective: '',
  location: '',
  startDate: '',
  endDate: '',
  budget: 0,
  id_estado: 2,
  es_publico: false,
  requisitos: ''
});

const openEditProjectDialog = () => {
  if (project.value) {
    projectForm.value = { 
      name: project.value.name || '',
      description: project.value.description || '',
      objective: project.value.objective || '',
      location: project.value.location || '',
      startDate: project.value.startDate || '',
      endDate: project.value.endDate || '',
      budget: project.value.budget || 0,
      id_estado: project.value.id_estado || 2,
      es_publico: project.value.es_publico !== undefined ? project.value.es_publico : false,
      requisitos: project.value.requisitos || ''
    };
  }
  editProjectDialog.value = true;
};

const openAddTaskDialog = (task = null, phaseId = null) => {
  currentTask.value = task;
  isViewingTask.value = !!task;
  if (task) {
    taskForm.value = { 
      description: task.descripcion,
      startDate: task.fecha_inicio,
      endDate: task.fecha_fin,
      prioridad: task.prioridad,
      complejidad: task.complejidad,
      id_estado: task.id_estado,
      phaseId: task.id_fase
    };
  } else {
    taskForm.value = {
      description: '',
      startDate: '',
      endDate: '',
      prioridad: 'Media',
      complejidad: 'Media',
      id_estado: 1,
      phaseId: phaseId || (project.value?.phases?.length > 0 ? project.value.phases[0].id : null)
    };
  }
  taskDialog.value = true;
};

const openEditTaskDialog = (task) => {
  openAddTaskDialog(task);
};

const roleDialog = ref(false);
const currentRole = ref(null);
const roleForm = ref({ 
  name: '', 
  description: '',
  tipo_rol: 'proyecto',
  id_organizacion: null,
  id_proyecto: null,
  activo: true,
  color: '#2196F3' 
});

const roleTypes = [
  { label: 'Rol del Sistema (Global)', value: 'sistema', disabled: true },
  { label: 'Rol de Organización (Reutilizable)', value: 'organizacion' },
  { label: 'Rol de Proyecto (Específico)', value: 'proyecto' }
];

const onRoleTypeChange = () => {
  if (roleForm.value.tipo_rol === 'sistema') {
    roleForm.value.id_organizacion = undefined;
    roleForm.value.id_proyecto = undefined;
  } else if (roleForm.value.tipo_rol === 'organizacion') {
    roleForm.value.id_proyecto = undefined;
    if (project.value?.id_organizacion) {
      roleForm.value.id_organizacion = project.value.id_organizacion;
    } else {
      roleForm.value.id_organizacion = undefined;
    }
  } else if (roleForm.value.tipo_rol === 'proyecto') {
    roleForm.value.id_organizacion = undefined;
    if (project.value?.id_proyecto) {
      roleForm.value.id_proyecto = project.value.id_proyecto;
    } else {
      roleForm.value.id_proyecto = undefined;
    }
  }
};

const openAddRoleDialog = () => {
  currentRole.value = null;
  const projectId = project.value?.id_proyecto;
  roleForm.value = { 
    name: '', 
    description: '',
    tipo_rol: 'proyecto',
    id_organizacion: undefined,
    id_proyecto: projectId || undefined,
    activo: true,
    color: '#2196F3' 
  };
  roleDialog.value = true;
};

const openEditRoleDialog = (role) => {
  currentRole.value = role;
  roleForm.value = { 
    id: role.id || role.id_rol,
    id_rol: role.id_rol || role.id,
    name: role.name || role.nombre || '',
    nombre: role.nombre || role.name || '',
    description: role.description || role.descripcion || '',
    descripcion: role.descripcion || role.description || '',
    tipo_rol: role.tipo_rol || 'sistema',
    id_organizacion: role.id_organizacion || null,
    id_proyecto: role.id_proyecto || null,
    activo: role.activo !== undefined ? role.activo : true,
    color: role.color || '#2196F3'
  };
  roleDialog.value = true;
};

const saveRole = async () => {
  if (!roleForm.value.name?.trim()) {
    showSnackbar('El nombre del rol es requerido', 'warning');
    return;
  }

  if (!roleForm.value.tipo_rol) {
    showSnackbar('El tipo de rol es requerido', 'warning');
    return;
  }

  if (roleForm.value.tipo_rol === 'organizacion' && !roleForm.value.id_organizacion) {
    showSnackbar('La organización es requerida para roles de organización', 'warning');
    return;
  }

  if (roleForm.value.tipo_rol === 'proyecto' && !roleForm.value.id_proyecto) {
    showSnackbar('El proyecto es requerido para roles de proyecto', 'warning');
    return;
  }

  try {
    if (currentRole.value) {
      const roleToUpdate = {
        ...roleForm.value,
        id_rol: currentRole.value.id_rol || currentRole.value.id
      };
      await roleStore.updateRole(roleToUpdate);
    } else {
      await roleStore.addRole(roleForm.value);
    }
    roleDialog.value = false;
    if (project.value?.id_proyecto) {
      await roleStore.fetchProjectRoles(project.value.id_proyecto);
    }
  } catch (error) {
    console.error('Error saving role:', error);
  }
};

const confirmDeleteRole = async (roleId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
    try {
      await roleStore.deleteRole(roleId);
      showSnackbar('Rol eliminado correctamente', 'success');
      if (project.value?.id_proyecto) {
        await roleStore.fetchProjectRoles(project.value.id_proyecto);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      showSnackbar('Error al eliminar el rol', 'error');
    }
  }
};

// Handler functions for dialog components
const handleTaskSave = async (formData) => {
  taskForm.value = { ...formData };
  await saveTask();
};

const handlePhaseSave = async (formData) => {
  phaseForm.value = { ...formData };
  await savePhase();
};

const handleProjectSave = async (formData) => {
  projectForm.value = { ...formData };
  await saveProjectChanges();
};

const handleRoleSave = async (formData) => {
  roleForm.value = { ...formData };
  await saveRole();
};

const handleBeneficioSave = async (formData) => {
  beneficioForm.value = { ...formData };
  await saveBeneficio();
};

const handleAssignVolunteer = async (formData) => {
  selectedTaskForAssignmentId.value = formData.selectedTaskId;
  selectedVolunteerId.value = formData.selectedVolunteerId;
  assignedRole.value = formData.assignedRole;
  assignmentNotes.value = formData.assignmentNotes || '';
  await assignVolunteerToTask();
};

const handleAddRole = () => {
  manageRolesDialog.value = false;
  openAddRoleDialog();
};

const handleEditRole = (role) => {
  manageRolesDialog.value = false;
  openEditRoleDialog(role);
};

const verifyingHours = ref(null);

const updateTaskStatusFromKanban = async ({ taskId, newStatus }) => {
  if (!project.value) return;
  try {
    const taskToUpdate = getAllTasks().find(task => task.id === parseInt(taskId, 10));
    if (taskToUpdate) {
      const taskData = { 
        descripcion: taskToUpdate.descripcion,
        fecha_inicio: taskToUpdate.fecha_inicio,
        fecha_fin: taskToUpdate.fecha_fin,
        prioridad: taskToUpdate.prioridad,
        complejidad: taskToUpdate.complejidad,
        id_estado: newStatus,
        id_fase: taskToUpdate.id_fase
      };
      await projectStore.updateProjectTask(project.value.id, taskToUpdate.id, taskData);
      
      if (project.value.phases) {
        project.value.phases.forEach(phase => {
          if (phase.tareas) {
            phase.tareas.forEach(task => {
              if (task.id === parseInt(taskId, 10)) {
                task.id_estado = newStatus;
              }
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    showSnackbar(error.message || 'Error al actualizar el estado de la tarea', 'error');
    if (project.value?.id) {
      await projectStore.fetchProjectById(project.value.id);
    }
  }
};

const availableProjectRoles = computed(() => {
  if (!projectRoles.value || !Array.isArray(projectRoles.value)) {
    return [];
  }
  return projectRoles.value
    .filter(rol => rol.activo !== false)
    .map(rol => ({
      value: rol.id_rol,
      label: `${rol.nombre}${rol.tipo_rol ? ` (${getRoleTypeLabel(rol.tipo_rol)})` : ''}`,
      tipo_rol: rol.tipo_rol || 'sistema',
      ...rol
    }));
});

const getRoleTypeLabel = (tipo) => {
  const labels = {
    'sistema': 'Sistema',
    'organizacion': 'Organización',
    'proyecto': 'Proyecto'
  };
  return labels[tipo] || 'Sistema';
};

const getRoleTypeColor = (tipo) => {
  const colors = {
    'sistema': 'primary',
    'organizacion': 'info',
    'proyecto': 'success'
  };
  return colors[tipo] || 'primary';
};

const availableVolunteers = computed(() => {
  const solicitudesAprobadas = solicitudes.value.filter(s => s.estado === 'aprobada');
  
  if (solicitudesAprobadas.length === 0) {
    return [];
  }

  return solicitudesAprobadas.map(solicitud => {
    const voluntario = solicitud.voluntario;
    const usuario = voluntario?.usuario;
    
    return {
      id_voluntario: solicitud.id_voluntario || voluntario?.id_voluntario,
      name: usuario?.nombre || voluntario?.nombre || 'Voluntario sin nombre',
      email: usuario?.email || voluntario?.email || '',
      voluntario: voluntario,
      usuario: usuario
    };
  });
});

const openAssignVolunteerDialog = async () => {
  if (project.value?.id_proyecto) {
    await solicitudStore.fetchByProject(project.value.id_proyecto);
    solicitudes.value = solicitudStore.allSolicitudes;
  }
  
  if (project.value?.id_proyecto) {
    await roleStore.fetchProjectRoles(project.value.id_proyecto);
  }
  
  if (availableVolunteers.value.length === 0) {
    showSnackbar('No hay voluntarios aprobados disponibles para asignar. Primero aprueba las solicitudes de inscripción.', 'warning');
    return;
  }
  
  assignVolunteerDialog.value = true;
};

const assignVolunteerToTask = async () => {
  if (!selectedTaskForAssignmentId.value || !selectedVolunteerId.value) {
    showSnackbar('Por favor selecciona una tarea y un voluntario', 'warning');
    return;
  }

  if (!assignedRole.value) {
    showSnackbar('Por favor selecciona un rol', 'warning');
    return;
  }

  try {
    await axios.post('/asignacion', {
      id_tarea: selectedTaskForAssignmentId.value,
      id_voluntario: selectedVolunteerId.value,
      id_rol: assignedRole.value
    });
    
    showSnackbar('Voluntario asignado correctamente');
    await projectStore.fetchProjectById(project.value.id);
    
    assignVolunteerDialog.value = false;
    selectedVolunteerId.value = null;
    assignedRole.value = null;
    selectedTaskForAssignmentId.value = null;
    assignmentNotes.value = '';
  } catch (error) {
    console.error('Error assigning volunteer:', error);
    showSnackbar(error.response?.data?.message || error.message || 'Error al asignar voluntario', 'error');
  }
};

// Helper functions
function getAllTasks() {
  if (!project.value || !project.value.phases) return [];
  return project.value.phases.flatMap(phase => phase.tareas || []);
}

function getTotalTasks() {
  return getAllTasks().length;
}

function getCompletedTasksByPhase(phaseId) {
  if (!project.value || !project.value.phases) return 0;
  const phase = project.value.phases.find(p => p.id === phaseId);
  if (!phase || !phase.tareas) return 0;
  return phase.tareas.filter(task => task.id_estado === 3).length;
}

function getPhaseStatus(phase) {
  if (!phase.tareas || phase.tareas.length === 0) return 'Sin tareas';
  const completed = phase.tareas.filter(task => task.id_estado === 3).length;
  const total = phase.tareas.length;
  if (completed === total) return 'Completada';
  if (completed > 0) return 'En progreso';
  return 'Pendiente';
}

function getPhaseStatusColor(phase) {
  if (!phase.tareas || phase.tareas.length === 0) return 'grey';
  const completed = phase.tareas.filter(task => task.id_estado === 3).length;
  const total = phase.tareas.length;
  if (completed === total) return 'success';
  if (completed > 0) return 'info';
  return 'warning';
}

function getTaskStatus(taskStatusId) {
  return getTaskStatusText(taskStatusId);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('COP', '').trim();
}

function getTipoPagoText(tipo) {
  const tipos = {
    'volunteer': 'Voluntariado',
    'stipend': 'Estipendio',
    'salary': 'Salario',
    'honorarium': 'Honorarios'
  };
  return tipos[tipo] || tipo;
}

function getFrecuenciaText(frecuencia) {
  const frecuencias = {
    'none': 'Sin frecuencia',
    'monthly': 'Mensual',
    'weekly': 'Semanal',
    'project': 'Por proyecto'
  };
  return frecuencias[frecuencia] || frecuencia;
}

async function openBeneficioDialog() {
  if (project.value?.beneficio) {
    beneficioForm.value = {
      tipo_pago: project.value.beneficio.tipo_pago || 'volunteer',
      monto: project.value.beneficio.monto || 0,
      frecuencia: project.value.beneficio.frecuencia || 'none',
      descripcion_pago: project.value.beneficio.descripcion_pago || '',
      incluye_transporte: project.value.beneficio.incluye_transporte || false,
      incluye_alimentacion: project.value.beneficio.incluye_alimentacion || false,
      incluye_materiales: project.value.beneficio.incluye_materiales || false,
      incluye_seguro: project.value.beneficio.incluye_seguro || false
    };
  } else {
    beneficioForm.value = {
      tipo_pago: 'volunteer',
      monto: 0,
      frecuencia: 'none',
      descripcion_pago: '',
      incluye_transporte: false,
      incluye_alimentacion: false,
      incluye_materiales: false,
      incluye_seguro: false
    };
  }
  beneficioDialog.value = true;
}

async function saveBeneficio() {
  const projectId = project.value?.id;
  if (!projectId) return;

  await handleOperation(
    async () => {
      const beneficioData = {
        id_proyecto: projectId,
        ...beneficioForm.value
      };

      const existing = await beneficioStore.getBeneficioByProject(projectId);
      
      if (existing) {
        return await beneficioStore.updateBeneficio(projectId, beneficioData);
      } else {
        return await beneficioStore.createBeneficio(beneficioData);
      }
    },
    'savingBeneficio',
    'Beneficios guardados correctamente',
    'Error al guardar los beneficios',
    async () => {
      await projectStore.fetchProjectById(projectId);
      beneficioDialog.value = false;
    }
  );
}

async function openSolicitudesDialog() {
  const projectId = project.value?.id_proyecto || project.value?.id;
  if (!projectId) return;

  await handleOperation(
    () => solicitudStore.fetchByProject(projectId),
    'loadingSolicitudes',
    '',
    'Error al cargar las solicitudes',
    () => {
      solicitudes.value = solicitudStore.allSolicitudes;
      solicitudesDialog.value = true;
    }
  );
}

async function updateSolicitudEstado(solicitudId, nuevoEstado) {
  await handleOperation(
    () => solicitudStore.updateSolicitud(solicitudId, { estado: nuevoEstado }),
    'updatingSolicitud',
    `Solicitud ${nuevoEstado === 'aprobada' ? 'aprobada' : nuevoEstado === 'rechazada' ? 'rechazada' : 'actualizada'} correctamente`,
    'Error al actualizar la solicitud',
    async () => {
      const projectId = project.value?.id_proyecto || project.value?.id;
      if (projectId) {
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
      }
      
      if (nuevoEstado === 'aprobada') {
        if (volunteerStore.fetchVolunteers) {
          await volunteerStore.fetchVolunteers();
        }
      }
      
      if (project.value?.id) {
        await projectStore.fetchProjectById(project.value.id);
      }
    }
  );
}

// Funciones para gestionar solicitudes
function confirmDeleteSolicitud(solicitud) {
  solicitudToDelete.value = solicitud;
  confirmDeleteSolicitudDialog.value = true;
}

async function deleteSolicitudConfirmed() {
  if (!solicitudToDelete.value) return;
  
  await handleOperation(
    () => solicitudStore.deleteSolicitud(solicitudToDelete.value.id_solicitud),
    'deletingSolicitud',
    'Solicitud eliminada correctamente',
    'Error al eliminar la solicitud',
    async () => {
      const projectId = project.value?.id_proyecto || project.value?.id;
      if (projectId) {
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
      }
      confirmDeleteSolicitudDialog.value = false;
      solicitudToDelete.value = null;
    }
  );
}

function confirmRejectAllPending() {
  if (solicitudesPendientes.value.length === 0) {
    showSnackbar('No hay solicitudes pendientes para rechazar', 'info');
    return;
  }
  confirmRejectAllPendingDialog.value = true;
}

async function rejectAllPendingConfirmed() {
  const pendientes = solicitudesPendientes.value;
  if (pendientes.length === 0) {
    showSnackbar('No hay solicitudes pendientes para rechazar', 'info');
    confirmRejectAllPendingDialog.value = false;
    return;
  }

  await handleOperation(
    async () => {
      await Promise.all(
        pendientes.map(solicitud => 
          solicitudStore.updateSolicitud(solicitud.id_solicitud, { estado: 'rechazada' })
        )
      );
    },
    'rejectingAllSolicitudes',
    `Se rechazaron ${pendientes.length} solicitud(es) pendiente(s) correctamente`,
    'Error al rechazar las solicitudes',
    async () => {
      const projectId = project.value?.id_proyecto || project.value?.id;
      if (projectId) {
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
      }
      confirmRejectAllPendingDialog.value = false;
    }
  );
}

async function approveAllPending() {
  const pendientes = solicitudesPendientes.value;
  if (pendientes.length === 0) {
    showSnackbar('No hay solicitudes pendientes para aprobar', 'info');
    return;
  }

  await handleOperation(
    async () => {
      await Promise.all(
        pendientes.map(solicitud => 
          solicitudStore.updateSolicitud(solicitud.id_solicitud, { estado: 'aprobada' })
        )
      );
    },
    'approvingAllSolicitudes',
    `Se aprobaron ${pendientes.length} solicitud(es) correctamente`,
    'Error al aprobar las solicitudes',
    async () => {
      const projectId = project.value?.id_proyecto || project.value?.id;
      if (projectId) {
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
      }
      if (volunteerStore.fetchVolunteers) {
        await volunteerStore.fetchVolunteers();
      }
      if (project.value?.id) {
        await projectStore.fetchProjectById(project.value.id);
      }
    }
  );
}

function confirmDeleteAllActive() {
  const activas = solicitudes.value.filter(
    s => s.estado === 'pendiente' || s.estado === 'aprobada'
  );
  
  if (activas.length === 0) {
    showSnackbar('No hay solicitudes activas para eliminar', 'info');
    return;
  }
  confirmDeleteAllActiveDialog.value = true;
}

async function deleteAllActiveConfirmed() {
  const activas = solicitudes.value.filter(
    s => s.estado === 'pendiente' || s.estado === 'aprobada'
  );
  
  if (activas.length === 0) {
    showSnackbar('No hay solicitudes activas para eliminar', 'info');
    confirmDeleteAllActiveDialog.value = false;
    return;
  }

  await handleOperation(
    async () => {
      await Promise.all(
        activas.map(solicitud => 
          solicitudStore.deleteSolicitud(solicitud.id_solicitud)
        )
      );
    },
    'deletingAllSolicitudes',
    `Se eliminaron ${activas.length} solicitud(es) activa(s) correctamente`,
    'Error al eliminar las solicitudes',
    async () => {
      const projectId = project.value?.id_proyecto || project.value?.id;
      if (projectId) {
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
      }
      confirmDeleteAllActiveDialog.value = false;
    }
  );
}

// Computed properties para filtrar y contar solicitudes
const solicitudesPendientes = computed(() => 
  solicitudes.value.filter(s => s.estado === 'pendiente')
);

const solicitudesAprobadas = computed(() => 
  solicitudes.value.filter(s => s.estado === 'aprobada')
);

const solicitudesRechazadas = computed(() => 
  solicitudes.value.filter(s => s.estado === 'rechazada')
);

// Funciones helper para estados de solicitudes
function getEstadoColor(estado) {
  const colors = {
    'pendiente': 'warning',
    'aprobada': 'success',
    'rechazada': 'error'
  };
  return colors[estado] || 'grey';
}

function getEstadoIcon(estado) {
  const icons = {
    'pendiente': 'mdi-clock-outline',
    'aprobada': 'mdi-check-circle',
    'rechazada': 'mdi-close-circle'
  };
  return icons[estado] || 'mdi-help-circle';
}

function getEstadoText(estado) {
  const texts = {
    'pendiente': 'Pendiente',
    'aprobada': 'Aprobada',
    'rechazada': 'Rechazada'
  };
  return texts[estado] || estado;
}

async function toggleProjectVisibility() {
  if (!project.value) return;
  try {
    const newVisibility = !project.value.es_publico;
    await projectStore.updateProject(project.value.id, { 
      es_publico: newVisibility,
      nombre: project.value.name,
      descripcion: project.value.description,
      objetivo: project.value.objective,
      ubicacion: project.value.location,
      fecha_inicio: project.value.startDate,
      fecha_fin: project.value.endDate,
      presupuesto_total: project.value.budget,
      id_estado: project.value.id_estado
    });
    await projectStore.fetchProjectById(project.value.id);
    showSnackbar(`Proyecto ${newVisibility ? 'visible' : 'oculto'} en el catálogo de voluntarios`);
  } catch (error) {
    console.error('Error toggling project visibility:', error);
    showSnackbar(error.message || 'Error al cambiar la visibilidad del proyecto', 'error');
  }
}

function switchToEditMode() {
  isViewingTask.value = false;
}

function getPhaseName(phaseId) {
  if (!project.value?.phases) return 'Sin fase';
  const phase = project.value.phases.find(p => p.id === phaseId);
  return phase?.name || 'Sin fase';
}

function getProjectProgress() {
  if (!project.value?.phases) return 0;
  const totalTasks = getTotalTasks();
  const completedTasks = getCompletedTasksCount();
  return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
}

function getTasksProgress() {
  return getProjectProgress();
}

function getPhasesProgress() {
  if (!project.value?.phases || project.value.phases.length === 0) return 0;
  const completedPhases = getCompletedPhasesCount();
  return (completedPhases / project.value.phases.length) * 100;
}

function getCompletedPhasesCount() {
  if (!project.value?.phases) return 0;
  return project.value.phases.filter(phase => {
    if (!phase.tareas || phase.tareas.length === 0) return false;
    return phase.tareas.every(task => task.id_estado === 3);
  }).length;
}

function getCompletedTasksCount() {
  return getAllTasks().filter(task => task.id_estado === 3).length;
}

function getAllAssignments() {
  if (!project.value || !project.value.phases) return [];
  
  const asignaciones = [];
  
  project.value.phases.forEach(phase => {
    if (phase.tareas) {
      phase.tareas.forEach(tarea => {
        if (tarea.asignaciones) {
          tarea.asignaciones.forEach(asignacion => {
            asignaciones.push({
              id_asignacion: asignacion.id_asignacion,
              id: asignacion.id_asignacion,
              id_voluntario: asignacion.id_voluntario || asignacion.voluntario?.id_voluntario,
              name: asignacion.voluntario?.usuario?.nombre || asignacion.voluntario?.nombre || 'Voluntario',
              email: asignacion.voluntario?.usuario?.email || '',
              role: asignacion.rol?.nombre || asignacion.rol_asignado || 'Voluntario',
              taskId: tarea.id,
              taskDescription: tarea.descripcion,
              phaseName: phase.name
            });
          });
        }
      });
    }
  });

  return asignaciones;
}

function getUniqueVolunteersCount() {
  const asignaciones = getAllAssignments();
  const uniqueVolunteers = new Set(asignaciones.map(a => a.id_voluntario));
  return uniqueVolunteers.size;
}

async function openRoleManagement() {
  if (project.value?.id_proyecto) {
    await roleStore.fetchProjectRoles(project.value.id_proyecto);
  }
  manageRolesDialog.value = true;
}

function openProjectReports() {
  showSnackbar('Funcionalidad de reportes en desarrollo', 'info');
}

// Volunteer Hours Functions
async function loadVolunteerHours() {
  if (!project.value?.id_proyecto) return;
  
  loadingHoras.value = true;
  try {
    const response = await axios.get(`/horas-voluntariadas/proyecto/${project.value.id_proyecto}/todas`);
    volunteerHours.value = response.data || [];
  } catch (error) {
    console.error('Error loading volunteer hours:', error);
    volunteerHours.value = [];
  } finally {
    loadingHoras.value = false;
  }
}

function openHorasDialog() {
  horasDialog.value = true;
}

async function verificarHoras(horasId, verificada) {
  verifyingHoras.value = horasId;
  try {
    await axios.patch(`/horas-voluntariadas/${horasId}/verificar`, { verificada });
    showSnackbar(verificada ? 'Horas verificadas correctamente' : 'Verificación removida', 'success');
    await loadVolunteerHours();
  } catch (error) {
    console.error('Error verifying hours:', error);
    showSnackbar('Error al verificar las horas', 'error');
  } finally {
    verifyingHoras.value = null;
  }
}

function exportProjectData() {
  const projectData = {
    project: project.value,
    phases: project.value?.phases || [],
    tasks: project.value?.phases?.flatMap(phase => phase.tareas || []) || [],
    volunteers: getAllAssignments(),
    progress: {
      phases: getCompletedPhasesCount(),
      tasks: getCompletedTasksCount(),
      total: getTotalTasks()
    }
  };
  
  const dataStr = JSON.stringify(projectData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `proyecto-${project.value?.name || 'sin-nombre'}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  showSnackbar('Datos exportados correctamente');
}

// Computed para verificar si el proyecto puede ser eliminado
const canDeleteProject = computed(() => {
  if (!project.value) return false;
  
  const hasActiveSolicitudes = solicitudes.value.some(
    s => s.estado === 'pendiente' || s.estado === 'aprobada'
  );
  
  const hasAssignments = getAllAssignments().length > 0;
  
  return !hasActiveSolicitudes && !hasAssignments;
});

const deleteProjectRestrictionMessage = computed(() => {
  if (!project.value) return '';
  
  const restrictions = [];
  
  const solicitudesPendientesCount = solicitudes.value.filter(s => s.estado === 'pendiente').length;
  const solicitudesAprobadasCount = solicitudes.value.filter(s => s.estado === 'aprobada').length;
  
  if (solicitudesPendientesCount > 0) {
    restrictions.push(`${solicitudesPendientesCount} solicitud(es) pendiente(s)`);
  }
  if (solicitudesAprobadasCount > 0) {
    restrictions.push(`${solicitudesAprobadasCount} solicitud(es) aprobada(s)`);
  }
  
  const assignmentCount = getAllAssignments().length;
  if (assignmentCount > 0) {
    restrictions.push(`${assignmentCount} asignación(es) de voluntarios a tareas`);
  }
  
  if (restrictions.length === 0) {
    return '';
  }
  
  return `No se puede eliminar el proyecto porque tiene: ${restrictions.join(', ')}. Por favor, gestiona estas situaciones antes de eliminar el proyecto.`;
});

function openDeleteProjectDialog() {
  const allAssignments = getAllAssignments();
  const hasActiveSolicitudes = solicitudes.value.some(
    s => s.estado === 'pendiente' || s.estado === 'aprobada'
  );
  
  if (hasActiveSolicitudes || allAssignments.length > 0) {
    const messages = [];
    
    if (hasActiveSolicitudes) {
      const pendientes = solicitudes.value.filter(s => s.estado === 'pendiente').length;
      const aprobadas = solicitudes.value.filter(s => s.estado === 'aprobada').length;
      if (pendientes > 0) {
        messages.push(`${pendientes} solicitud(es) pendiente(s)`);
      }
      if (aprobadas > 0) {
        messages.push(`${aprobadas} solicitud(es) aprobada(s)`);
      }
    }
    if (allAssignments.length > 0) {
      messages.push(`${allAssignments.length} asignación(es) de voluntarios`);
    }
    
    showSnackbar(
      `Antes de eliminar el proyecto, debes gestionar: ${messages.join(', ')}. Usa las pestañas "Equipo" y "Solicitudes" para gestionar esto.`,
      'warning'
    );
    return;
  }
  
  confirmDeleteProjectDialog.value = true;
}

async function confirmDeleteProject() {
  if (!canDeleteProject.value) {
    showSnackbar(deleteProjectRestrictionMessage.value, 'error');
    confirmDeleteProjectDialog.value = false;
    return;
  }
  
  await handleOperation(
    () => projectStore.deleteProject(project.value.id),
    'deletingProject',
    'Proyecto eliminado correctamente',
    'Error al eliminar el proyecto',
    () => {
      router.push(ROUTES.ORGANIZATION.PROJECTS);
    }
  );
}

// Funciones para gestionar asignaciones
function confirmRemoveAssignment(asignacion) {
  assignmentToRemove.value = asignacion;
  confirmRemoveAssignmentDialog.value = true;
}

async function removeAssignmentConfirmed() {
  if (!assignmentToRemove.value) return;
  
  await handleOperation(
    () => axios.delete(`/asignacion/${assignmentToRemove.value.id_asignacion}`),
    'removingAssignment',
    'Asignación eliminada correctamente',
    'Error al eliminar la asignación',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      confirmRemoveAssignmentDialog.value = false;
      assignmentToRemove.value = null;
    }
  );
}

function confirmRemoveAllAssignments() {
  const allAssignments = getAllAssignments();
  if (allAssignments.length === 0) {
    showSnackbar('No hay asignaciones para eliminar', 'info');
    return;
  }
  confirmRemoveAllAssignmentsDialog.value = true;
}

async function removeAllAssignmentsConfirmed() {
  const allAssignments = getAllAssignments();
  if (allAssignments.length === 0) {
    showSnackbar('No hay asignaciones para eliminar', 'info');
    confirmRemoveAllAssignmentsDialog.value = false;
    return;
  }
  
  await handleOperation(
    async () => {
      await Promise.all(
        allAssignments.map(asignacion => 
          axios.delete(`/asignacion/${asignacion.id_asignacion}`)
        )
      );
    },
    'removingAllAssignments',
    `Se eliminaron ${allAssignments.length} asignación(es) correctamente`,
    'Error al eliminar las asignaciones',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      confirmRemoveAllAssignmentsDialog.value = false;
    }
  );
}

function viewMemberDetails(member) {
  showSnackbar(`Detalles de ${member.name} - Funcionalidad en desarrollo`, 'info');
}

async function removeAllMemberAssignments(member) {
  volunteerToRemove.value = member;
  volunteerRemovalDialog.value = true;
  volunteerValidationResult.value = null;

  // Validar asignaciones antes de mostrar el diálogo
  try {
    const validation = await validateVolunteerRemoval(
      member.id_voluntario || member.id,
      project.value.id
    );
    volunteerValidationResult.value = validation;
  } catch (error) {
    console.error('Error al validar asignaciones:', error);
    volunteerValidationResult.value = {
      canRemove: false,
      hasAssignments: true,
      count: 0,
      assignments: [],
      message: 'Error al verificar asignaciones. Por favor, intente nuevamente.'
    };
  }
}

async function removeVolunteerConfirmed() {
  if (!volunteerToRemove.value) return;

  const member = volunteerToRemove.value;
  const allAssignments = getAllAssignments().filter(
    a => (a.id_voluntario || a.voluntario?.id_voluntario) === (member.id_voluntario || member.id)
  );

  if (allAssignments.length === 0) {
    showSnackbar('El voluntario no tiene asignaciones para eliminar', 'info');
    volunteerRemovalDialog.value = false;
    volunteerToRemove.value = null;
    return;
  }

  await handleOperation(
    async () => {
      await Promise.all(
        allAssignments.map(asignacion => 
          axios.delete(`/asignacion/${asignacion.id_asignacion}`)
        )
      );
    },
    'removingVolunteer',
    `Se eliminaron todas las asignaciones de ${member.name} correctamente`,
    'Error al eliminar las asignaciones',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      volunteerRemovalDialog.value = false;
      volunteerToRemove.value = null;
      volunteerValidationResult.value = null;
    }
  );
}

// Additional variables
const assignmentNotes = ref('');

</script>

<style scoped>
.project-detail-view {
  background-color: transparent;
  max-width: 1600px;
  margin: 0 auto;
}

.project-header-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
}

/* Enterprise Tabs */
.enterprise-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.enterprise-tabs .v-tab {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
  min-height: 56px;
  padding: 0 24px;
  transition: all 0.3s ease;
}

.enterprise-tabs .v-tab--selected {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  background: rgba(var(--v-theme-primary), 0.05);
}

.enterprise-tabs .v-tab:hover {
  background: rgba(var(--v-theme-primary), 0.03);
}

.tab-text {
  margin-left: 8px;
}

/* Responsive - Hide text on mobile */
@media (max-width: 960px) {
  .tab-text {
    display: none;
  }
  
  .enterprise-tabs .v-tab {
    padding: 0 12px;
    min-height: 48px;
  }
}
</style>
