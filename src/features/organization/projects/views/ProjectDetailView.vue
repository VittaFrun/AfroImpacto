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

      <!-- Header con Banner - Estilo Voluntarios -->
      <div class="workspace-header-card mb-6">
        <div class="header-image-container">
          <v-img
            :src="projectImage"
            height="240"
            cover
            class="header-image"
            gradient="to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)"
          >
            <div class="header-overlay">
              <div class="header-content">
                <div class="d-flex align-center mb-3">
                  <v-btn
                    icon="mdi-arrow-left"
                    variant="text"
                    color="white"
                    @click="router.back()"
                    class="mr-4"
                  ></v-btn>
                  <v-breadcrumbs
                    :items="breadcrumbItems"
                    class="pa-0"
                    color="white"
                    density="compact"
                  >
                    <template v-slot:divider>
                      <v-icon size="small" color="white">mdi-chevron-right</v-icon>
                    </template>
                  </v-breadcrumbs>
                </div>
                <h1 class="text-h4 font-weight-bold text-white mb-3" style="color: white !important; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);">
                  {{ project.name }}
                </h1>
                <div class="d-flex align-center gap-3 flex-wrap mb-3">
                  <v-chip
                    :color="getStatusColor(project.id_estado)"
                    size="small"
                    variant="flat"
                    prepend-icon="mdi-circle"
                  >
                    {{ getStatusText(project.id_estado) }}
                  </v-chip>
                  <v-chip
                    :color="project.es_publico ? 'success' : 'grey'"
                    size="small"
                    variant="flat"
                    prepend-icon="mdi-eye"
                  >
                    {{ project.es_publico ? 'Público' : 'Privado' }}
                  </v-chip>
                  <v-chip
                    v-if="project.ubicacion"
                    color="white"
                    size="small"
                    variant="flat"
                    prepend-icon="mdi-map-marker"
                  >
                    {{ project.ubicacion }}
                  </v-chip>
                  <v-chip
                    v-if="project.fecha_inicio && project.fecha_fin"
                    color="white"
                    size="small"
                    variant="flat"
                    prepend-icon="mdi-calendar-range"
                  >
                    {{ formatDateRange(project.fecha_inicio, project.fecha_fin) }}
                  </v-chip>
                </div>
                <div class="d-flex align-center gap-2">
                  <v-tooltip text="Editar información del proyecto" location="bottom">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="white"
                        variant="flat"
                        prepend-icon="mdi-pencil"
                        size="small"
                        @click="openEditProjectDialog"
                      >
                        Editar
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </v-img>
        </div>
      </div>
      
      <!-- Información del Proyecto -->
      <v-card class="mb-4 elevation-2" rounded="xl" variant="flat">
        <v-card-text class="project-info-section pa-6">
          <div class="d-flex align-start gap-4 flex-wrap">
            <div class="project-description-modern">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                <v-icon start color="primary">mdi-information</v-icon>
                Descripción
              </h3>
              <p class="text-body-1 text-grey-darken-1 mb-0">
                {{ project.description || 'Sin descripción' }}
              </p>
            </div>
            <div class="project-meta-modern" v-if="project.objetivo">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">
                <v-icon start color="primary">mdi-target</v-icon>
                Objetivo
              </h3>
              <p class="text-body-1 text-grey-darken-1 mb-0">
                {{ project.objetivo }}
              </p>
            </div>
          </div>
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
            :get-phase-status="getPhaseStatus"
            :get-phase-status-color="getPhaseStatusColor"
            :get-phase-status-icon="getPhaseStatusIcon"
            :get-phase-tasks-count="getPhaseTasksCount"
            :get-phase-progress="getPhaseProgress"
            :get-completed-tasks-by-phase="getCompletedTasksByPhase"
            @open-beneficio-dialog="openBeneficioDialog"
            @open-hours-dialog="openHorasDialog"
            @open-reports="openProjectReports"
            @export-data="exportProjectData"
            @toggle-visibility="toggleProjectVisibility"
            @phase-click="handlePhaseClick"
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
            @open-bulk-assign-volunteers="openBulkAssignVolunteersDialog"
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
            @bulk-update-solicitudes="handleBulkUpdateSolicitudes"
            @bulk-delete-solicitudes="handleBulkDeleteSolicitudes"
          />
        </v-window-item>

        <!-- Tab 4: Fases y Tareas -->
        <v-window-item value="tasks">
          <TasksTab
            :project="project"
            :get-all-tasks="getAllTasks"
            :get-total-tasks="getTotalTasks"
            :get-completed-tasks-count="getCompletedTasksCount"
            :tasks-by-phase="tasksByPhase"
            :get-completed-tasks-by-phase="getCompletedTasksByPhase"
            :get-phase-status="getPhaseStatus"
            :get-phase-status-color="getPhaseStatusColor"
            :get-phase-status-icon="getPhaseStatusIcon"
            :get-phase-progress="getPhaseProgress"
            :get-phase-tasks-count="getPhaseTasksCount"
            :get-task-status-color="getTaskStatusColor"
            :get-task-status-icon="getTaskStatusIcon"
            :get-task-status="getTaskStatus"
            :get-priority-color="getPriorityColor"
            :get-phase-name="getPhaseName"
            :format-date-range="formatDateRange"
            @reorder-phases="handleReorderPhases"
            @open-add-phase="openAddPhaseDialog"
            @edit-phase="openEditPhaseDialog"
            @delete-phase="openDeletePhaseDialog"
            @open-add-task="openAddTaskDialog"
            @add-task-to-phase="handleAddTaskToPhase"
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
            :status-options="projectStatusOptions"
            @toggle-visibility="toggleProjectVisibility"
            @edit-project="openEditProjectDialog"
            @open-beneficio-dialog="openBeneficioDialog"
            @open-reports="openProjectReports"
            @export-data="exportProjectData"
            @delete-project="openDeleteProjectDialog"
            @update-status="handleStatusUpdate"
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
      :project-start-date="project?.startDate || project?.fecha_inicio"
      :project-end-date="project?.endDate || project?.fecha_fin"
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
      :project-start-date="project?.startDate || project?.fecha_inicio"
      :project-end-date="project?.endDate || project?.fecha_fin"
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

    <!-- Bulk Assign Volunteers Dialog -->
    <BulkAssignVolunteersDialog
      v-model="bulkAssignVolunteersDialog"
      :tasks="getAllTasks()"
      :available-volunteers="availableVolunteers"
      :available-project-roles="availableProjectRoles"
      :roles-loading="roleStore.loading"
      :loading="isLoading('bulkAssigningVolunteers')"
      :get-role-type-color="getRoleTypeColor"
      :get-role-type-label="getRoleTypeLabel"
      :get-task-status-color="getTaskStatusColor"
      :get-task-status="getTaskStatusText"
      :get-phase-name="getPhaseName"
      @save="handleBulkAssignVolunteers"
    />

    <!-- Assign After Approval Dialog -->
    <AssignAfterApprovalDialog
      v-model="assignAfterApprovalDialog"
      v-if="approvedVolunteer"
      :volunteer-id="approvedVolunteer.id"
      :volunteer-name="approvedVolunteer.name"
      :project-id="project?.id_proyecto || project?.id"
      :available-tasks="getAllTasks()"
      :available-project-roles="availableProjectRoles"
      :phases="project?.phases || []"
      :loading="isLoading('assigningVolunteer')"
      :tasks-loading="isLoading('loadingTasks')"
      :roles-loading="roleStore.loading"
      @assign="handleAssignAfterApproval"
      @skip="handleSkipAssignment"
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
      :project-id="project?.id_proyecto || project?.id || parseInt(route.params.id, 10)"
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
      :updating-id="updatingSolicitudId"
      :get-estado-color="getEstadoColor"
      :get-estado-text="getEstadoText"
      @update-estado="updateSolicitudEstado"
    />

    <!-- Volunteer Hours Dialog -->
    <HoursDialog
      v-model="horasDialog"
      :volunteer-hours="volunteerHours"
      :loading="loadingHoras"
      :verifying-hours="verifyingHoras"
      @verify-hours="(id) => verificarHoras(id, true)"
      @unverify-hours="(id) => verificarHoras(id, false)"
      @verify-multiple="verificarHorasMultiple"
    />

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
import { useNotifications } from '@/composables/useNotifications';
import { useAutoNotifications, useTaskDeadlineMonitor } from '@/composables/useAutoNotifications';
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
import BulkAssignVolunteersDialog from '../components/dialogs/BulkAssignVolunteersDialog.vue';
import AssignAfterApprovalDialog from '../components/dialogs/AssignAfterApprovalDialog.vue';
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
import defaultCoverImage from '@/assets/images/background_login.png';

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

const projectImage = computed(() => {
  if (!project.value) return defaultCoverImage;
  const img = project.value.imagen_principal || project.value.banner || project.value.image;
  if (img && img !== '/assets/images/background_login.png') {
    return img;
  }
  return defaultCoverImage;
});

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

// Monitoreo de tareas para notificaciones automáticas
const allTasksForMonitoring = computed(() => getAllTasks());
useTaskDeadlineMonitor(allTasksForMonitoring, project);

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
const bulkAssignVolunteersDialog = ref(false);
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

// Notifications
const { showSuccess, showError, showWarning, showInfo } = useNotifications();

function showSnackbar(text, color = 'success') {
  switch (color) {
    case 'error':
      showError(text);
      break;
    case 'warning':
      showWarning(text);
      break;
    case 'info':
      showInfo(text);
      break;
    default:
      showSuccess(text);
  }
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
  
  // Validar phaseId antes de continuar
  if (!taskForm.value.phaseId) {
    showSnackbar('Error: Debes seleccionar una fase para la tarea', 'error');
    return;
  }

  // Validar que phaseId sea un número válido
  const phaseId = typeof taskForm.value.phaseId === 'number' 
    ? taskForm.value.phaseId 
    : parseInt(taskForm.value.phaseId);

  if (isNaN(phaseId)) {
    showSnackbar('Error: La fase seleccionada no es válida. Por favor, recarga la página.', 'error');
    console.error('Invalid phaseId:', taskForm.value.phaseId, 'Available phases:', project.value.phases);
    return;
  }

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
    id_fase: phaseId // Usar el phaseId validado
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

// Función wrapper para manejar el evento add-task-to-phase
const handleAddTaskToPhase = (phaseId) => {
  // Asegurar que phaseId sea un número válido
  let validPhaseId = null;
  if (phaseId !== null && phaseId !== undefined) {
    validPhaseId = typeof phaseId === 'number' ? phaseId : parseInt(phaseId);
    if (isNaN(validPhaseId)) {
      console.warn('Invalid phaseId provided:', phaseId);
      validPhaseId = null;
    }
  }
  
  // Si no hay phaseId válido, intentar obtener de la primera fase
  if (!validPhaseId && project.value?.phases?.length > 0) {
    const firstPhase = project.value.phases[0];
    validPhaseId = firstPhase.id_fase || firstPhase.id || null;
  }
  
  // Abrir diálogo en modo creación con el phaseId
  openAddTaskDialog(null, validPhaseId);
};

const openAddTaskDialog = (task = null, phaseId = null) => {
  // Limpiar completamente el estado anterior
  currentTask.value = null;
  isViewingTask.value = false;
  
  // Validar que task sea realmente una tarea válida (tiene id)
  const isValidTask = task && (task.id_tarea || task.id);
  
  if (isValidTask) {
    // MODO EDICIÓN: Se pasó una tarea existente válida
    console.log('Opening in EDIT mode for task:', task.id_tarea || task.id);
    currentTask.value = task;
    isViewingTask.value = false; // Por defecto en modo edición, no visualización
    taskForm.value = { 
      description: task.descripcion || '',
      startDate: formatDateForInput(task.fecha_inicio),
      endDate: formatDateForInput(task.fecha_fin),
      prioridad: task.prioridad || 'Media',
      complejidad: task.complejidad || 'Media',
      id_estado: task.id_estado || 1,
      phaseId: task.id_fase || null
    };
  } else {
    // MODO CREACIÓN: No se pasó tarea válida, es una nueva tarea
    console.log('Opening in CREATE mode with phaseId:', phaseId);
    // Asegurar que currentTask esté completamente limpio
    currentTask.value = null;
    isViewingTask.value = false;
    
    // Asegurar que phaseId sea un número válido
    let validPhaseId = null;
    if (phaseId !== null && phaseId !== undefined) {
      validPhaseId = typeof phaseId === 'number' ? phaseId : parseInt(phaseId);
      if (isNaN(validPhaseId)) {
        console.warn('Invalid phaseId provided:', phaseId);
        validPhaseId = null;
      }
    }
    
    // Si no hay phaseId válido, intentar obtener de la primera fase
    if (!validPhaseId && project.value?.phases?.length > 0) {
      const firstPhase = project.value.phases[0];
      validPhaseId = firstPhase.id_fase || firstPhase.id || null;
    }
    
    // Resetear formulario completamente para modo creación
    taskForm.value = {
      description: '',
      startDate: '',
      endDate: '',
      prioridad: 'Media',
      complejidad: 'Media',
      id_estado: 1,
      phaseId: validPhaseId
    };
  }
  
  // Abrir el diálogo
  taskDialog.value = true;
};

// Helper para formatear fechas para input type="date"
function formatDateForInput(date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

const openEditTaskDialog = (task) => {
  // Modo edición explícito
  if (!task) {
    console.error('openEditTaskDialog called without task');
    return;
  }
  openAddTaskDialog(task, null);
};

// Función para cambiar a modo visualización
const switchToViewMode = () => {
  if (currentTask.value) {
    isViewingTask.value = true;
  }
};

// Función para cambiar a modo edición desde visualización
const switchToEditMode = () => {
  if (currentTask.value) {
    isViewingTask.value = false;
  }
};

const roleDialog = ref(false);
const currentRole = ref(null);
const roleForm = ref({
  name: '',
  description: '',
  tipo_rol: 'proyecto',
  id_proyecto: null,
  id_organizacion: null,
  activo: true,
  color: '#2196F3'
});

// Para roles de proyecto, solo permitir tipo 'proyecto'
const roleTypes = [
  { label: 'Rol de Proyecto', value: 'proyecto' }
];

const onRoleTypeChange = () => {
  if (roleForm.value.tipo_rol === 'organizacion') {
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
  // Obtener el ID del proyecto de diferentes formas posibles
  const projectId = project.value?.id_proyecto || project.value?.id || parseInt(route.params.id, 10);
  
  if (!projectId) {
    showError('No se pudo obtener el ID del proyecto. Por favor, recarga la página.');
    return;
  }
  
  roleForm.value = { 
    name: '', 
    description: '',
    tipo_rol: 'proyecto',
    id_organizacion: undefined,
    id_proyecto: projectId,
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
    tipo_rol: role.tipo_rol || 'organizacion',
    id_organizacion: role.id_organizacion || null,
    id_proyecto: role.id_proyecto || null,
    activo: role.activo !== undefined ? role.activo : true,
    color: role.color || '#2196F3'
  };
  roleDialog.value = true;
};

const saveRole = async () => {
  if (!roleForm.value.name?.trim()) {
    showError('El nombre del rol es requerido');
    return;
  }

  if (!roleForm.value.tipo_rol) {
    showError('El tipo de rol es requerido');
    return;
  }

  if (roleForm.value.tipo_rol === 'organizacion' && !roleForm.value.id_organizacion) {
    showError('La organización es requerida para roles de organización');
    return;
  }

  // Obtener el projectId de múltiples fuentes posibles
  const projectId = roleForm.value.id_proyecto || project.value?.id_proyecto || project.value?.id || parseInt(route.params.id, 10);
  
  if (roleForm.value.tipo_rol === 'proyecto' && !projectId) {
    showError('El proyecto es requerido para roles de proyecto. Por favor, recarga la página e intenta nuevamente.');
    return;
  }

  // Asegurar que el projectId esté en el formulario
  if (roleForm.value.tipo_rol === 'proyecto' && projectId) {
    roleForm.value.id_proyecto = projectId;
  }

  // Normalizar color
  let color = roleForm.value.color || '#2196F3';
  if (color && !color.startsWith('#')) {
    color = '#' + color;
  }
  color = color.toUpperCase();

  try {
    if (currentRole.value) {
      const roleToUpdate = {
        ...roleForm.value,
        id_rol: currentRole.value.id_rol || currentRole.value.id,
        id_proyecto: projectId, // Asegurar que id_proyecto esté presente
        color: color
      };
      await roleStore.updateRole(roleToUpdate);
      showSuccess('Rol actualizado correctamente');
    } else {
      const roleToCreate = {
        ...roleForm.value,
        id_proyecto: projectId, // Asegurar que id_proyecto esté presente explícitamente
        color: color
      };
      console.log('Creando rol con datos:', roleToCreate); // Debug
      await roleStore.addRole(roleToCreate);
      showSuccess('Rol creado correctamente');
    }
    roleDialog.value = false;
    currentRole.value = null;
    // Reutilizar projectId que ya se definió arriba
    if (projectId) {
      await roleStore.fetchProjectRoles(projectId);
    }
  } catch (error) {
    console.error('Error saving role:', error);
    showError(error.response?.data?.message || error.message || 'Error al guardar el rol');
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
  // Validar que phaseId esté presente
  if (!formData.phaseId) {
    showSnackbar('Error: Debes seleccionar una fase para la tarea', 'error');
    return;
  }

  // Asegurar que phaseId sea un número
  const phaseId = typeof formData.phaseId === 'number' 
    ? formData.phaseId 
    : parseInt(formData.phaseId);

  if (isNaN(phaseId)) {
    showSnackbar('Error: La fase seleccionada no es válida', 'error');
    console.error('Invalid phaseId:', formData.phaseId, 'Available phases:', project.value?.phases);
    return;
  }

  // Actualizar taskForm con los datos validados
  taskForm.value = {
    ...formData,
    phaseId: phaseId
  };
  
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

const handleBulkAssignVolunteers = async ({ assignments }) => {
  if (!project.value || !assignments || assignments.length === 0) return;
  
  await handleOperation(
    async () => {
      // Procesar todas las asignaciones
      const promises = assignments.map(async (assignment) => {
        selectedTaskForAssignmentId.value = assignment.taskId;
        selectedVolunteerId.value = assignment.volunteerId;
        assignedRole.value = assignment.roleId;
        assignmentNotes.value = assignment.notes || '';
        return await assignVolunteerToTask();
      });
      
      await Promise.all(promises);
    },
    'bulkAssigningVolunteers',
    `Se asignaron ${assignments.length} voluntario(s) correctamente`,
    'Error al realizar la asignación masiva',
    async () => {
      await projectStore.fetchProjectById(project.value.id);
      bulkAssignVolunteersDialog.value = false;
    }
  );
};

const handleReorderPhases = async (newOrder) => {
  if (!project.value || !newOrder || newOrder.length === 0) return;
  
  await handleOperation(
    async () => {
      await projectStore.reorderProjectPhases(project.value.id, newOrder);
    },
    'reorderingPhases',
    'Fases reordenadas correctamente',
    'Error al reordenar las fases',
    async () => {
      // Refrescar el proyecto para obtener las fases actualizadas
      await projectStore.fetchProjectById(project.value.id);
    }
  );
};

const getPhaseName = (phaseId) => {
  if (!project.value?.phases) return 'N/A';
  const phase = project.value.phases.find(p => (p.id_fase || p.id) === phaseId);
  return phase?.nombre || phase?.name || 'N/A';
};

const handleAddRole = () => {
  manageRolesDialog.value = false;
  openAddRoleDialog();
};

const handleEditRole = (role) => {
  manageRolesDialog.value = false;
  openEditRoleDialog(role);
};

const verifyingHoras = ref(null);

const updateTaskStatusFromKanban = async ({ taskId, newStatus }) => {
  if (!project.value) return;
  try {
    const taskToUpdate = getAllTasks().find(task => task.id === parseInt(taskId, 10));
  if (taskToUpdate) {
      const oldStatus = taskToUpdate.id_estado;
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
      
      // Notificar cambio de estado
      if (oldStatus !== newStatus) {
        const { notifyTaskStatusChange } = useAutoNotifications();
        notifyTaskStatusChange(taskToUpdate, project.value, oldStatus, newStatus);
      }
      
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
      tipo_rol: rol.tipo_rol || 'organizacion',
      ...rol
  }));
});

const getRoleTypeLabel = (tipo) => {
  const labels = {
    'organizacion': 'Organización',
    'proyecto': 'Proyecto'
  };
  return labels[tipo] || 'Organización';
};

const getRoleTypeColor = (tipo) => {
  const colors = {
    'organizacion': 'info',
    'proyecto': 'success'
  };
  return colors[tipo] || 'info';
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
    showWarning('No hay voluntarios aprobados disponibles para asignar. Primero aprueba las solicitudes de inscripción.');
    return;
  }
  
  assignVolunteerDialog.value = true;
};

const openBulkAssignVolunteersDialog = async () => {
  if (project.value?.id_proyecto) {
    await solicitudStore.fetchByProject(project.value.id_proyecto);
    solicitudes.value = solicitudStore.allSolicitudes;
  }
  
  if (project.value?.id_proyecto) {
    await roleStore.fetchProjectRoles(project.value.id_proyecto);
  }
  
  if (availableVolunteers.value.length === 0) {
    showWarning('No hay voluntarios aprobados disponibles para asignar. Primero aprueba las solicitudes de inscripción.');
    return;
  }
  
  if (getAllTasks().length === 0) {
    showWarning('No hay tareas disponibles para asignar. Primero crea tareas en el proyecto.');
    return;
  }
  
  bulkAssignVolunteersDialog.value = true;
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

function getPhaseStatusIcon(phase) {
  const status = getPhaseStatus(phase);
  if (status.includes('Completada')) return 'mdi-check-circle';
  if (status.includes('progreso')) return 'mdi-progress-clock';
  return 'mdi-clock-outline';
}

function getPhaseTasksCount(phase) {
  return phase?.tareas?.length || 0;
}

function getPhaseProgress(phase) {
  if (!phase?.tareas || phase.tareas.length === 0) return 0;
  const completed = phase.tareas.filter(t => t.id_estado === 3).length;
  return Math.round((completed / phase.tareas.length) * 100);
}

function handlePhaseClick(phase) {
  // Navegar a la pestaña de tareas y hacer scroll a la fase
  activeTab.value = 'tasks';
  // El componente TasksTab puede manejar el scroll a la fase específica
  showSnackbar(`Navegando a la fase: ${phase.name || phase.nombre}`, 'info');
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
    'honorarium': 'Honorario',
    'commission': 'Comisión',
    'bonus': 'Bono'
  };
  return tipos[tipo] || tipo;
}

function getFrecuenciaText(frecuencia) {
  const frecuencias = {
    'none': 'Sin frecuencia',
    'hourly': 'Por hora',
    'daily': 'Diario',
    'weekly': 'Semanal',
    'monthly': 'Mensual',
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

const updatingSolicitudId = ref(null);

// Estado para auto-asignación después de aprobar
const assignAfterApprovalDialog = ref(false);
const approvedVolunteer = ref(null);

async function updateSolicitudEstado(solicitudId, nuevoEstado) {
  updatingSolicitudId.value = solicitudId;
  
  // Obtener información de la solicitud antes de actualizar
  const solicitud = solicitudes.value.find(s => s.id_solicitud === solicitudId);
  
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
      
      if (nuevoEstado === 'aprobada' && solicitud) {
        // Preparar datos para auto-asignación
        approvedVolunteer.value = {
          id: solicitud.id_voluntario,
          name: solicitud.voluntario?.usuario?.nombre || solicitud.voluntario?.nombre || 'Voluntario',
          solicitudId: solicitudId
        };
        
        // Mostrar diálogo de auto-asignación
        assignAfterApprovalDialog.value = true;
        
        if (volunteerStore.fetchVolunteers) {
          await volunteerStore.fetchVolunteers();
        }
      }
      
      if (project.value?.id) {
        await projectStore.fetchProjectById(project.value.id);
      }
      
      updatingSolicitudId.value = null;
    }
  );
}

// Manejar asignación después de aprobar
async function handleAssignAfterApproval(formData) {
  if (!approvedVolunteer.value || !formData.taskId) return;
  
  await handleOperation(
    async () => {
      // Usar el método del store para asignar
      const taskId = typeof formData.taskId === 'number' ? formData.taskId : parseInt(formData.taskId);
      const volunteerId = approvedVolunteer.value.id;
      const roleId = formData.roleId || null;
      
      // Obtener el nombre del rol si existe
      let roleName = null;
      if (roleId) {
        const role = availableProjectRoles.value.find(r => r.value === roleId);
        roleName = role?.label || null;
      }
      
      await projectStore.assignVolunteerToTask(
        project.value.id,
        taskId,
        volunteerId,
        roleName
      );
    },
    'assigningVolunteer',
    `Voluntario asignado a la tarea correctamente`,
    'Error al asignar el voluntario',
    async () => {
      assignAfterApprovalDialog.value = false;
      approvedVolunteer.value = null;
      
      // Refrescar datos
      if (project.value?.id) {
        await projectStore.fetchProjectById(project.value.id);
      }
      
      const projectId = project.value?.id_proyecto || project.value?.id;
      if (projectId) {
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
      }
    }
  );
}

function handleSkipAssignment() {
  assignAfterApprovalDialog.value = false;
  approvedVolunteer.value = null;
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

// Manejar actualización masiva de solicitudes
async function handleBulkUpdateSolicitudes({ ids, estado }) {
  if (!ids || ids.length === 0) return;
  
  const estadoText = estado === 'aprobada' ? 'aprobadas' : estado === 'rechazada' ? 'rechazadas' : 'actualizadas';
  
  await handleOperation(
    async () => {
      await Promise.all(
        ids.map(id => solicitudStore.updateSolicitud(id, { estado }))
      );
    },
    'updatingSelectedSolicitudes',
    `Se ${estadoText} ${ids.length} solicitud(es) correctamente`,
    `Error al ${estadoText} las solicitudes`,
    async () => {
      const projectId = project.value?.id_proyecto || project.value?.id;
      if (projectId) {
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
      }
      
      // Si se aprobaron, refrescar voluntarios
      if (estado === 'aprobada' && volunteerStore.fetchVolunteers) {
        await volunteerStore.fetchVolunteers();
      }
      
      if (project.value?.id) {
        await projectStore.fetchProjectById(project.value.id);
      }
    }
  );
}

// Manejar eliminación masiva de solicitudes
async function handleBulkDeleteSolicitudes(ids) {
  if (!ids || ids.length === 0) return;
  
  await handleOperation(
    async () => {
      await Promise.all(
        ids.map(id => solicitudStore.deleteSolicitud(id))
      );
    },
    'deletingSelectedSolicitudes',
    `Se eliminaron ${ids.length} solicitud(es) correctamente`,
    'Error al eliminar las solicitudes',
    async () => {
      const projectId = project.value?.id_proyecto || project.value?.id;
      if (projectId) {
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
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

async function handleStatusUpdate(newStatus) {
  if (!project.value) return;
  
  const projectId = project.value.id_proyecto || project.value.id;
  if (!projectId) {
    showSnackbar('Error: No se pudo identificar el proyecto', 'error');
    return;
  }
  
  await handleOperation(
    () => projectStore.updateProject(projectId, { 
      id_estado: newStatus,
      nombre: project.value.name || project.value.nombre,
      descripcion: project.value.description || project.value.descripcion,
      objetivo: project.value.objective || project.value.objetivo,
      ubicacion: project.value.location || project.value.ubicacion,
      fecha_inicio: project.value.startDate || project.value.fecha_inicio,
      fecha_fin: project.value.endDate || project.value.fecha_fin,
      presupuesto_total: project.value.budget || project.value.presupuesto_total,
      es_publico: project.value.es_publico,
      requisitos: project.value.requisitos || null
    }),
    'updatingStates',
    `Estado del proyecto actualizado a: ${getStatusText(newStatus)}`,
    'Error al actualizar el estado del proyecto',
    async () => {
      // Refrescar el proyecto completo para obtener el estado actualizado
      const updatedProject = await projectStore.fetchProjectById(projectId);
      if (updatedProject) {
        // Actualizar el proyecto reactivo
        project.value = updatedProject;
        // Forzar reactividad
        project.value = { ...updatedProject };
      }
    }
  );
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

// Función eliminada - duplicada, usar la versión de arriba (línea 1306)

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

async function verificarHorasMultiple(ids, verificada) {
  verifyingHoras.value = 'multiple';
  try {
    await Promise.all(
      ids.map(id => axios.patch(`/horas-voluntariadas/${id}/verificar`, { verificada }))
    );
    showSnackbar(`${ids.length} hora(s) ${verificada ? 'verificadas' : 'desverificadas'} correctamente`, 'success');
    await loadVolunteerHours();
  } catch (error) {
    console.error('Error verifying multiple hours:', error);
    showSnackbar('Error al verificar las horas', 'error');
  } finally {
    verifyingHoras.value = null;
  }
}

async function exportProjectData(format = 'json') {
  if (format === 'pdf') {
    try {
      showSnackbar('Generando PDF...', 'info');
      
      // Obtener imágenes de gráficos si están disponibles
      const chartImages = [];
      // Aquí se pueden agregar gráficos capturados de los componentes
      
      const { exportProjectToPDF } = await import('@/utils/pdfExportService.js');
      await exportProjectToPDF(project.value, {
        includePhases: true,
        includeTasks: true,
        includeVolunteers: true,
        includeHours: false, // Las horas se exportan por separado
        includeCharts: chartImages.length > 0,
        chartImages
      });
      
      showSnackbar('PDF exportado correctamente', 'success');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showSnackbar('Error al exportar PDF', 'error');
    }
  } else {
    // Exportación JSON (comportamiento original)
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
    
    const { exportToJSON } = await import('@/utils/exportUtils.js');
    exportToJSON(
      projectData,
      `proyecto-${project.value?.name || 'sin-nombre'}-${new Date().toISOString().split('T')[0]}.json`
    );
    
    showSnackbar('Datos exportados correctamente', 'success');
  }
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

.workspace-header-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-image-container {
  position: relative;
}

.header-image {
  border-radius: 16px;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  display: flex;
  align-items: flex-end;
  padding: 32px;
}

.header-content {
  width: 100%;
  color: white;
}

.project-info-section {
  background: white;
}

.project-description-modern {
  flex: 1;
  min-width: 300px;
}

.project-meta-modern {
  flex: 1;
  min-width: 300px;
}

@media (max-width: 960px) {
  .header-overlay {
    padding: 24px;
  }
  
  .project-description-modern,
  .project-meta-modern {
    width: 100%;
  }
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

/* Responsive Design */
@media (max-width: 1024px) {
  .project-detail-view {
    padding: 16px;
  }
  
  .project-header-card {
    padding: 16px !important;
  }
}

@media (max-width: 960px) {
  .tab-text {
    display: none;
  }
  
  .enterprise-tabs .v-tab {
    padding: 0 12px;
    min-height: 48px;
  }
  
  .project-detail-view {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .project-detail-view {
    padding: 8px;
  }
  
  .enterprise-tabs {
    overflow-x: auto;
  }
  
  .enterprise-tabs .v-tab {
    padding: 0 8px;
    min-height: 44px;
    font-size: 0.875rem;
  }
  
  /* Make tables scrollable on mobile */
  .v-table {
    overflow-x: auto;
    display: block;
  }
  
  /* Stack cards vertically on mobile */
  .v-row {
    flex-direction: column;
  }
  
  .v-col {
    width: 100% !important;
    max-width: 100% !important;
  }
}

@media (max-width: 480px) {
  .project-detail-view {
    padding: 4px;
  }
  
  .enterprise-tabs .v-tab {
    padding: 0 4px;
    min-height: 40px;
  }
}
</style>
