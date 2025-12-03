<template>
  <v-container fluid class="pa-8">
    <!-- Header Section -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-2">Gestión de Equipo</h1>
        <p class="text-body-1 text-grey-darken-1">
          Administra los miembros de tu equipo, roles y permisos de la organización
        </p>
      </div>
      <ModernButton
        color="primary"
        size="large"
        prepend-icon="mdi-account-plus"
        @click="openInviteDialog"
      >
        Invitar Miembro
      </ModernButton>
    </div>

    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Miembros Activos"
          icon="mdi-account-group"
          iconColor="primary"
          :value="activeMembersCount"
          valueColor="primary"
        >
          <template #detail>
            <span class="text-primary">{{ activeMembersCount }} activos</span>
            <span class="text-grey">•</span>
            <span class="text-grey">{{ totalMembersCount }} total</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Solicitudes Pendientes"
          icon="mdi-account-clock"
          iconColor="warning"
          :value="pendingRequestsCount"
          valueColor="warning"
        >
          <template #detail>
            <span class="text-warning">{{ pendingRequestsCount }} pendientes</span>
            <span class="text-grey">•</span>
            <span class="text-grey">Por revisar</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Roles Definidos"
          icon="mdi-shield-account"
          iconColor="info"
          :value="organizationRolesCount"
          valueColor="info"
        >
          <template #detail>
            <span class="text-info">{{ organizationRolesCount }} roles</span>
            <span class="text-grey">•</span>
            <span class="text-grey">De organización</span>
          </template>
        </MetricStatCard>
      </v-col>
      <v-col cols="12" md="3">
        <MetricStatCard
          title="Invitaciones Enviadas"
          icon="mdi-email-send"
          iconColor="success"
          :value="sentInvitationsCount"
          valueColor="success"
        >
          <template #detail>
            <span class="text-success">{{ sentInvitationsCount }} enviadas</span>
            <span class="text-grey">•</span>
            <span class="text-grey">Este mes</span>
          </template>
        </MetricStatCard>
      </v-col>
    </v-row>

    <!-- Main Content Card with Tabs -->
    <v-card class="elevation-1" rounded="lg">
      <v-tabs
        v-model="activeTab"
        color="primary"
        class="enterprise-tabs"
        show-arrows
      >
        <v-tab value="members" class="tab-item">
          <v-icon start>mdi-account-multiple</v-icon>
          <span class="tab-text">Miembros del Equipo</span>
          <v-badge 
            v-if="activeMembersCount > 0"
            :content="activeMembersCount" 
            color="primary"
            inline
            class="ml-2"
          />
        </v-tab>
        
        <v-tab value="requests" class="tab-item">
          <v-icon start>mdi-account-clock</v-icon>
          <span class="tab-text">Solicitudes Pendientes</span>
          <v-badge 
            v-if="pendingRequestsCount > 0"
            :content="pendingRequestsCount" 
            color="warning"
            inline
            class="ml-2"
          />
        </v-tab>
        
        <v-tab value="roles" class="tab-item">
          <v-icon start>mdi-shield-account</v-icon>
          <span class="tab-text">Roles de Organización</span>
          <v-badge 
            v-if="organizationRolesCount > 0"
            :content="organizationRolesCount" 
            color="info"
            inline
            class="ml-2"
          />
        </v-tab>
        
        <v-tab value="invitations" class="tab-item">
          <v-icon start>mdi-email-send</v-icon>
          <span class="tab-text">Invitaciones</span>
          <v-badge 
            v-if="sentInvitationsCount > 0"
            :content="sentInvitationsCount" 
            color="success"
            inline
            class="ml-2"
          />
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <v-window v-model="activeTab">
        <!-- Tab 1: Miembros del Equipo -->
        <v-window-item value="members">
          <TeamMembersTab
            :members="activeMembers"
            :loading="teamStore.loading"
            @edit-member="handleEditMember"
            @remove-member="handleRemoveMember"
            @view-profile="handleViewProfile"
          />
        </v-window-item>

        <!-- Tab 2: Solicitudes Pendientes -->
        <v-window-item value="requests">
          <TeamRequestsTab
            :requests="pendingRequests"
            :organization-roles="organizationRoles"
            :loading="teamStore.loading"
            @approve-request="handleApproveRequest"
            @reject-request="handleRejectRequest"
            @view-request="handleViewRequest"
          />
        </v-window-item>

        <!-- Tab 3: Roles de Organización -->
        <v-window-item value="roles">
          <TeamRolesTab
            :roles="organizationRoles"
            :loading="roleStore.loading"
            @add-role="handleAddRole"
            @edit-role="handleEditRole"
            @delete-role="handleDeleteRole"
            @manage-permissions="handleManagePermissions"
          />
        </v-window-item>

        <!-- Tab 4: Invitaciones -->
        <v-window-item value="invitations">
          <TeamInvitationsTab
            :invitations="sentInvitations"
            :organization-roles="organizationRoles"
            :loading="teamStore.loading"
            @send-invitation="handleSendInvitation"
            @cancel-invitation="handleCancelInvitation"
          />
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Dialogs -->
    <InviteMemberDialog
      v-model="inviteDialog"
      :organization-roles="organizationRoles"
      :loading="teamStore.loading"
      @send="handleSendInvitation"
    />

    <TeamRoleDialog
      v-model="roleDialog"
      :role="currentRole"
      :loading="roleStore.loading"
      @save="handleSaveRole"
    />

    <PermissionManagerDialog
      v-model="permissionDialog"
      :role="selectedRoleForPermissions"
      :loading="roleStore.loading"
      @save="handleSavePermissions"
    />

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';
import { useNotifications } from '@/composables/useNotifications';
import ModernButton from '@/components/ui/ModernButton.vue';
import MetricStatCard from '@/components/ui/MetricStatCard.vue';
import TeamMembersTab from '../components/tabs/TeamMembersTab.vue';
import TeamRequestsTab from '../components/tabs/TeamRequestsTab.vue';
import TeamRolesTab from '../components/tabs/TeamRolesTab.vue';
import TeamInvitationsTab from '../components/tabs/TeamInvitationsTab.vue';
import InviteMemberDialog from '../components/InviteMemberDialog.vue';
import TeamRoleDialog from '../components/TeamRoleDialog.vue';
import PermissionManagerDialog from '../components/PermissionManagerDialog.vue';

const teamStore = useTeamStore();
const roleStore = useRoleStore();
const { showSuccess, showError, showWarning, showInfo } = useNotifications();

const activeTab = ref('members');
const inviteDialog = ref(false);
const roleDialog = ref(false);
const permissionDialog = ref(false);
const currentRole = ref(null);
const selectedRoleForPermissions = ref(null);

// Computed properties
const activeMembers = computed(() => {
  return teamStore.members.filter(m => m.estado === 'activo');
});

const pendingRequests = computed(() => {
  return teamStore.members.filter(m => m.estado === 'pendiente');
});

const organizationRoles = computed(() => {
  return roleStore.organizationRoles || [];
});

const sentInvitations = computed(() => {
  return teamStore.invitations || [];
});

const activeMembersCount = computed(() => activeMembers.value.length);
const totalMembersCount = computed(() => teamStore.members.length);
const pendingRequestsCount = computed(() => pendingRequests.value.length);
const organizationRolesCount = computed(() => organizationRoles.value.length);
const sentInvitationsCount = computed(() => sentInvitations.value.length);

// Methods
function openInviteDialog() {
  inviteDialog.value = true;
}

function handleEditMember(member) {
  // TODO: Implementar edición de miembro
  showSnackbar('Funcionalidad en desarrollo', 'info');
}

function handleRemoveMember(member) {
  // TODO: Implementar remoción de miembro
  showSnackbar('Funcionalidad en desarrollo', 'info');
}

function handleViewProfile(member) {
  // TODO: Implementar vista de perfil
  showSnackbar('Funcionalidad en desarrollo', 'info');
}

function handleApproveRequest(request, roleId) {
  teamStore.approveRequest(request.id_miembro, roleId);
  showSnackbar('Solicitud aprobada correctamente', 'success');
}

function handleRejectRequest(request) {
  teamStore.rejectRequest(request.id_miembro);
  showSnackbar('Solicitud rechazada', 'info');
}

function handleViewRequest(request) {
  // TODO: Implementar vista de solicitud
  showSnackbar('Funcionalidad en desarrollo', 'info');
}

function handleAddRole() {
  currentRole.value = null;
  roleDialog.value = true;
}

function handleEditRole(role) {
  currentRole.value = role;
  roleDialog.value = true;
}

function handleDeleteRole(roleId) {
  roleStore.deleteRole(roleId);
  showSnackbar('Rol eliminado correctamente', 'success');
}

function handleManagePermissions(role) {
  selectedRoleForPermissions.value = role;
  permissionDialog.value = true;
}

function handleSaveRole(roleData) {
  if (currentRole.value) {
    roleStore.updateRole({ ...currentRole.value, ...roleData });
    showSnackbar('Rol actualizado correctamente', 'success');
  } else {
    roleStore.addRole(roleData);
    showSnackbar('Rol creado correctamente', 'success');
  }
  roleDialog.value = false;
  currentRole.value = null;
}

function handleSavePermissions(permissions) {
  // TODO: Implementar guardado de permisos
  showSnackbar('Permisos actualizados correctamente', 'success');
  permissionDialog.value = false;
  selectedRoleForPermissions.value = null;
}

function handleSendInvitation(invitationData) {
  teamStore.sendInvitation(invitationData);
  showSnackbar('Invitación enviada correctamente', 'success');
  inviteDialog.value = false;
}

function handleCancelInvitation(invitationId) {
  teamStore.cancelInvitation(invitationId);
  showSnackbar('Invitación cancelada', 'info');
}

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

onMounted(async () => {
  const orgId = await teamStore.getOrganizationId();
  if (orgId) {
    await teamStore.fetchTeamMembers(orgId);
    await roleStore.fetchOrganizationRoles(orgId);
  }
});
</script>

<style scoped>
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

.tab-text {
  margin-left: 8px;
}

@media (max-width: 960px) {
  .tab-text {
    display: none;
  }
}
</style>

