<template>
  <v-row>
    <v-col cols="12">
      <!-- Header con acciones -->
      <v-card class="mb-4 elevation-1" rounded="lg">
        <v-card-text class="pa-4">
          <div class="d-flex align-center justify-space-between flex-wrap gap-3">
            <div>
              <h2 class="text-h6 font-weight-bold mb-1 team-title">
                <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
                Gestión de Equipo
              </h2>
              <p class="text-body-2 team-subtitle mb-0">
                Administra los voluntarios, asigna roles y gestiona tareas del equipo
              </p>
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <v-tooltip text="Gestionar roles del proyecto" location="bottom">
                <template #activator="{ props }">
                  <ModernButton
                    v-bind="props"
                    color="primary"
                    variant="outlined"
                    prepend-icon="mdi-account-cog"
                    @click="$emit('open-role-management')"
                    size="small"
                  >
                    Gestionar Roles
                  </ModernButton>
                </template>
              </v-tooltip>
              <v-tooltip :text="solicitudesAprobadas.length === 0 ? 'No hay voluntarios aprobados disponibles' : 'Asignar un voluntario a una tarea'" location="bottom">
                <template #activator="{ props }">
                  <ModernButton
                    v-bind="props"
                    color="success"
                    variant="flat"
                    prepend-icon="mdi-account-plus"
                    @click="$emit('open-assign-volunteer')"
                    size="small"
                    :disabled="solicitudesAprobadas.length === 0"
                  >
                    Asignar Voluntario
                  </ModernButton>
                </template>
              </v-tooltip>
              <v-tooltip :text="solicitudesAprobadas.length === 0 ? 'No hay voluntarios aprobados disponibles' : 'Asignar múltiples voluntarios a tareas'" location="bottom">
                <template #activator="{ props }">
                  <ModernButton
                    v-bind="props"
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-account-multiple-plus"
                    @click="$emit('open-bulk-assign-volunteers')"
                    size="small"
                    :disabled="solicitudesAprobadas.length === 0"
                  >
                    Asignación Masiva
                  </ModernButton>
                </template>
              </v-tooltip>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Estadísticas Rápidas del Equipo -->
    <v-col cols="12">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="48" class="mr-3">
                  <v-icon color="white">mdi-account-group</v-icon>
                </v-avatar>
                <div>
                  <div class="text-h5 font-weight-bold">{{ getUniqueVolunteersCount() }}</div>
                  <div class="text-caption text-grey">Miembros Activos</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="d-flex align-center">
                <v-avatar color="info" size="48" class="mr-3">
                  <v-icon color="white">mdi-clipboard-account</v-icon>
                </v-avatar>
                <div>
                  <div class="text-h5 font-weight-bold">{{ getAllAssignments().length }}</div>
                  <div class="text-caption text-grey">Asignaciones</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="d-flex align-center">
                <v-avatar color="success" size="48" class="mr-3">
                  <v-icon color="white">mdi-shield-account</v-icon>
                </v-avatar>
                <div>
                  <div class="text-h5 font-weight-bold">{{ projectRoles.length }}</div>
                  <div class="text-caption text-grey">Roles Definidos</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card" variant="outlined" rounded="lg">
            <v-card-text class="pa-4">
              <div class="d-flex align-center">
                <v-avatar color="warning" size="48" class="mr-3">
                  <v-icon color="white">mdi-account-check</v-icon>
                </v-avatar>
                <div>
                  <div class="text-h5 font-weight-bold">{{ solicitudesAprobadas.length }}</div>
                  <div class="text-caption text-grey">Disponibles</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <!-- Tabs Secundarias -->
    <v-col cols="12">
      <v-card class="elevation-1" rounded="lg">
        <v-tabs
          v-model="activeSubTab"
          color="primary"
          class="secondary-tabs"
          density="compact"
        >
          <v-tab value="members">
            <v-icon start size="small">mdi-account-multiple</v-icon>
            Miembros del Equipo
            <v-badge 
              v-if="getUniqueVolunteersCount() > 0"
              :content="getUniqueVolunteersCount()" 
              color="primary"
              inline
              class="ml-2"
            />
          </v-tab>
          <v-tab value="roles">
            <v-icon start size="small">mdi-shield-account</v-icon>
            Roles del Proyecto
            <v-badge 
              v-if="projectRoles.length > 0"
              :content="projectRoles.length" 
              color="info"
              inline
              class="ml-2"
            />
          </v-tab>
          <v-tab value="assignments">
            <v-icon start size="small">mdi-clipboard-account</v-icon>
            Asignaciones Detalladas
            <v-badge 
              v-if="getAllAssignments().length > 0"
              :content="getAllAssignments().length" 
              color="success"
              inline
              class="ml-2"
            />
          </v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <v-window v-model="activeSubTab">
          <!-- Miembros del Equipo -->
          <v-window-item value="members">
            <v-card-text class="pa-4">
              <div v-if="getUniqueVolunteersCount() === 0" class="text-center py-12">
                <v-icon size="100" color="grey-lighten-2">mdi-account-group-outline</v-icon>
                <h3 class="text-h6 text-grey mt-4">No hay miembros asignados</h3>
                <p class="text-body-2 text-grey mb-4">
                  Asigna voluntarios aprobados a tareas del proyecto
                </p>
                <div class="mb-3">
                  <v-chip 
                    color="info" 
                    variant="tonal" 
                    size="small"
                  >
                    {{ solicitudesAprobadas.length }} voluntario(s) aprobado(s) disponible(s)
                  </v-chip>
                </div>
                <ModernButton
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-account-plus"
                  @click="$emit('open-assign-volunteer')"
                  :disabled="solicitudesAprobadas.length === 0"
                >
                  Asignar Primer Voluntario
                </ModernButton>
                <p v-if="solicitudesAprobadas.length === 0" class="text-caption text-grey mt-2">
                  Primero aprueba solicitudes de inscripción
                </p>
              </div>

              <!-- Lista de miembros con cards profesionales -->
              <div v-else>
                <!-- Barra de búsqueda y filtros -->
                <div class="d-flex align-center mb-4 flex-wrap gap-2">
                  <v-text-field
                    v-model="searchMember"
                    placeholder="Buscar miembro..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="flex-grow-1"
                    style="max-width: 300px;"
                  ></v-text-field>
                  
                  <v-chip-group
                    v-model="roleFilter"
                    column
                    class="ml-auto"
                  >
                    <v-chip
                      v-for="role in uniqueRoles"
                      :key="role"
                      filter
                      variant="outlined"
                      size="small"
                    >
                      {{ role }}
                    </v-chip>
                  </v-chip-group>
                </div>

                <v-row>
                  <v-col 
                    v-for="member in filteredMembers" 
                    :key="member.id_voluntario"
                    cols="12" 
                    md="6" 
                    lg="4"
                  >
                    <v-card class="team-member-card" variant="outlined" rounded="lg">
                      <v-card-text class="pa-4">
                        <div class="d-flex align-center mb-3">
                          <v-avatar 
                            :color="getAvatarColor(member)" 
                            size="56"
                            class="mr-3"
                          >
                            <span class="text-white font-weight-bold text-h5">
                              {{ member.name?.charAt(0)?.toUpperCase() || 'V' }}
                            </span>
                          </v-avatar>
                          <div class="flex-grow-1">
                            <div class="text-body-1 font-weight-bold">
                              {{ member.name }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ member.email || 'Sin email' }}
                            </div>
                          </div>
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <v-btn
                                icon="mdi-dots-vertical"
                                variant="text"
                                size="small"
                                v-bind="props"
                              ></v-btn>
                            </template>
                            <v-list density="compact">
                              <v-list-item @click="$emit('view-member-details', member)">
                                <template v-slot:prepend>
                                  <v-icon size="small">mdi-eye</v-icon>
                                </template>
                                <v-list-item-title>Ver Detalles</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="$emit('remove-all-member-assignments', member)">
                                <template v-slot:prepend>
                                  <v-icon size="small" color="error">mdi-account-remove</v-icon>
                                </template>
                                <v-list-item-title class="text-error">
                                  Eliminar del Proyecto
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                        
                        <!-- Estadísticas del miembro -->
                        <v-row dense class="mb-3">
                          <v-col cols="6">
                            <v-tooltip text="Total de tareas asignadas">
                              <template v-slot:activator="{ props }">
                                <div class="stat-box" v-bind="props">
                                  <div class="stat-value text-primary">{{ member.tasksCount }}</div>
                                  <div class="stat-label">Tareas</div>
                                </div>
                              </template>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="6">
                            <v-tooltip text="Tareas completadas">
                              <template v-slot:activator="{ props }">
                                <div class="stat-box" v-bind="props">
                                  <div class="stat-value text-success">{{ member.completedTasks || 0 }}</div>
                                  <div class="stat-label">Completadas</div>
                                </div>
                              </template>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        
                        <!-- Progreso visual -->
                        <div v-if="member.tasksCount > 0" class="mb-3">
                          <v-progress-linear
                            :model-value="getMemberProgress(member)"
                            color="success"
                            height="8"
                            rounded
                            class="mb-1"
                          ></v-progress-linear>
                          <div class="text-caption text-grey text-center">
                            {{ getMemberProgress(member) }}% completado
                          </div>
                        </div>
                        
                        <!-- Roles asignados -->
                        <div class="mb-2">
                          <div class="text-caption text-grey mb-1">Roles:</div>
                          <div class="d-flex flex-wrap gap-1">
                            <v-chip 
                              v-for="role in member.roles" 
                              :key="role"
                              size="x-small"
                              color="primary"
                              variant="tonal"
                            >
                              {{ role }}
                            </v-chip>
                          </div>
                        </div>

                        <!-- Tareas asignadas -->
                        <div>
                          <div class="text-caption text-grey mb-1">Tareas asignadas:</div>
                          <div class="task-list">
                            <div 
                              v-for="assignment in member.assignments.slice(0, 3)" 
                              :key="assignment.id_asignacion"
                              class="task-item text-caption"
                            >
                              <v-icon size="12" class="mr-1">mdi-checkbox-marked-circle</v-icon>
                              {{ assignment.taskDescription?.substring(0, 30) }}{{ assignment.taskDescription?.length > 30 ? '...' : '' }}
                            </div>
                            <div v-if="member.assignments.length > 3" class="text-caption text-grey mt-1">
                              +{{ member.assignments.length - 3 }} más
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Acción masiva -->
                <div v-if="getAllAssignments().length > 0" class="mt-4">
                  <v-divider class="mb-4"></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <div class="text-body-2 text-grey">
                      Total de {{ getAllAssignments().length }} asignación(es) en {{ getUniqueVolunteersCount() }} voluntario(s)
                    </div>
                    <ModernButton
                      color="error"
                      variant="outlined"
                      prepend-icon="mdi-account-multiple-remove"
                      @click="$emit('confirm-remove-all-assignments')"
                      size="small"
                      :loading="isLoading('removingAllAssignments')"
                    >
                      Eliminar Todas las Asignaciones
                    </ModernButton>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-window-item>

          <!-- Roles del Proyecto -->
          <v-window-item value="roles">
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold mb-1">Roles del Proyecto</h3>
                  <p class="text-caption text-grey mb-0">
                    Gestiona los roles específicos para este proyecto
                  </p>
                </div>
                <ModernButton
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-plus"
                  @click="$emit('add-role')"
                  size="small"
                >
                  Nuevo Rol
                </ModernButton>
              </div>

              <div v-if="projectRoles.length === 0" class="text-center py-12">
                <v-icon size="100" color="grey-lighten-2">mdi-shield-account-outline</v-icon>
                <h3 class="text-h6 text-grey mt-4">No hay roles personalizados</h3>
                <p class="text-body-2 text-grey mb-4">
                  Crea roles específicos para este proyecto
                </p>
                <ModernButton
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-plus"
                  @click="$emit('add-role')"
                >
                  Crear Primer Rol
                </ModernButton>
              </div>

              <v-row v-else>
                <v-col 
                  v-for="role in projectRoles" 
                  :key="role.id_rol"
                  cols="12" 
                  md="6"
                  lg="4"
                >
                  <v-card class="role-card" variant="outlined" rounded="lg">
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center justify-space-between mb-3">
                        <v-chip 
                          :color="getRoleTypeColor(role.tipo_rol)" 
                          size="small"
                          variant="tonal"
                        >
                          {{ getRoleTypeLabel(role.tipo_rol) }}
                        </v-chip>
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon="mdi-dots-vertical"
                              variant="text"
                              size="small"
                              v-bind="props"
                            ></v-btn>
                          </template>
                          <v-list density="compact">
                            <v-list-item @click="$emit('edit-role', role)">
                              <template v-slot:prepend>
                                <v-icon size="small">mdi-pencil</v-icon>
                              </template>
                              <v-list-item-title>Editar</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="$emit('delete-role', role.id_rol)">
                              <template v-slot:prepend>
                                <v-icon size="small" color="error">mdi-delete</v-icon>
                              </template>
                              <v-list-item-title class="text-error">Eliminar</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>

                      <h3 class="text-h6 font-weight-bold mb-2">
                        {{ role.nombre }}
                      </h3>
                      <p class="text-body-2 text-grey mb-3">
                        {{ role.descripcion || 'Sin descripción' }}
                      </p>

                      <div class="d-flex align-center gap-2">
                        <v-chip 
                          size="x-small"
                          :color="role.activo ? 'success' : 'grey'"
                          variant="tonal"
                        >
                          {{ role.activo ? 'Activo' : 'Inactivo' }}
                        </v-chip>
                        <v-chip 
                          v-if="role.color"
                          size="x-small"
                          :color="role.color"
                          variant="flat"
                        >
                          Color
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-window-item>

          <!-- Asignaciones Detalladas -->
          <v-window-item value="assignments">
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold mb-1">Todas las Asignaciones</h3>
                  <p class="text-caption text-grey mb-0">
                    Lista detallada de voluntarios asignados a tareas
                  </p>
                </div>
              </div>

              <div v-if="getAllAssignments().length === 0" class="text-center py-12">
                <v-icon size="100" color="grey-lighten-2">mdi-clipboard-account-outline</v-icon>
                <h3 class="text-h6 text-grey mt-4">No hay asignaciones</h3>
                <p class="text-body-2 text-grey mb-4">
                  Los voluntarios aún no han sido asignados a tareas específicas
                </p>
              </div>

              <div v-else>
                <!-- Lista de asignaciones -->
                <v-card
                  v-for="assignment in getAllAssignments()"
                  :key="assignment.id_asignacion"
                  class="assignment-card mb-3"
                  variant="outlined"
                  rounded="lg"
                >
                  <v-card-text class="pa-4">
                    <v-row align="center" no-gutters>
                      <v-col cols="12" sm="auto" class="d-flex align-center mb-3 mb-sm-0">
                        <v-avatar 
                          :color="getAvatarColor(assignment)" 
                          size="48" 
                          class="mr-3"
                        >
                          <span class="text-white font-weight-bold">
                            {{ assignment.name?.charAt(0)?.toUpperCase() || 'V' }}
                          </span>
                        </v-avatar>
                        <div>
                          <div class="text-body-1 font-weight-bold">
                            {{ assignment.name }}
                          </div>
                          <div class="text-caption text-grey">
                            {{ assignment.role || 'Voluntario' }}
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="auto" class="ml-sm-auto">
                        <div class="d-flex align-center flex-wrap gap-2">
                          <v-chip size="small" color="info" variant="tonal">
                            <v-icon start size="14">mdi-view-list</v-icon>
                            {{ assignment.phaseName }}
                          </v-chip>
                          
                          <v-btn
                            icon="mdi-delete"
                            color="error"
                            size="small"
                            variant="text"
                            @click="$emit('confirm-remove-assignment', assignment)"
                            :loading="isLoading('removingAssignment') && assignmentToRemove?.id_asignacion === assignment.id_asignacion"
                          ></v-btn>
                        </div>
                      </v-col>
                    </v-row>

                    <!-- Descripción de la tarea -->
                    <div class="mt-3 pa-3 rounded" style="background: #fafafa;">
                      <div class="text-caption text-grey mb-1">Tarea asignada:</div>
                      <div class="text-body-2">
                        <v-icon size="16" class="mr-1">mdi-format-list-checks</v-icon>
                        {{ assignment.taskDescription }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  projectRoles: {
    type: Array,
    default: () => []
  },
  solicitudesAprobadas: {
    type: Array,
    default: () => []
  },
  getAllAssignments: {
    type: Function,
    required: true
  },
  getUniqueVolunteersCount: {
    type: Function,
    required: true
  },
  getRoleTypeColor: {
    type: Function,
    required: true
  },
  getRoleTypeLabel: {
    type: Function,
    required: true
  },
  isLoading: {
    type: Function,
    required: true
  },
  assignmentToRemove: {
    type: Object,
    default: null
  }
});

const emit = defineEmits([
  'open-role-management',
  'open-assign-volunteer',
  'view-member-details',
  'remove-all-member-assignments',
  'add-role',
  'edit-role',
  'delete-role',
  'confirm-remove-assignment'
]);

const activeSubTab = ref('members');
const searchMember = ref('');
const roleFilter = ref(null);

// Obtener miembros únicos del equipo
const teamMembers = computed(() => {
  const assignments = props.getAllAssignments();
  const membersMap = new Map();
  
  assignments.forEach(assignment => {
    const memberId = assignment.id_voluntario;
    if (!membersMap.has(memberId)) {
      membersMap.set(memberId, {
        id_voluntario: memberId,
        name: assignment.name,
        email: assignment.email || '',
        roles: new Set([assignment.role]),
        tasksCount: 1,
        completedTasks: 0,
        assignments: [assignment]
      });
    } else {
      const member = membersMap.get(memberId);
      member.roles.add(assignment.role);
      member.tasksCount++;
      member.assignments.push(assignment);
    }
  });
  
  return Array.from(membersMap.values()).map(member => ({
    ...member,
    roles: Array.from(member.roles)
  }));
});

const filteredMembers = computed(() => {
  let filtered = teamMembers.value;
  
  // Filtrar por búsqueda
  if (searchMember.value) {
    const search = searchMember.value.toLowerCase();
    filtered = filtered.filter(m => m.name.toLowerCase().includes(search));
  }
  
  // Filtrar por rol
  if (roleFilter.value !== null && roleFilter.value !== undefined) {
    const selectedRole = uniqueRoles.value[roleFilter.value];
    filtered = filtered.filter(m => m.roles.includes(selectedRole));
  }
  
  return filtered;
});

const uniqueRoles = computed(() => {
  const roles = new Set();
  teamMembers.value.forEach(member => {
    member.roles.forEach(role => roles.add(role));
  });
  return Array.from(roles);
});

function getAvatarColor(member) {
  const colors = ['primary', 'success', 'info', 'warning', 'purple', 'indigo', 'teal'];
  const index = (member.id_voluntario || member.id || 0) % colors.length;
  return colors[index];
}

function getMemberProgress(member) {
  if (!member.tasksCount || member.tasksCount === 0) return 0;
  const completed = member.completedTasks || 0;
  return Math.round((completed / member.tasksCount) * 100);
}
</script>

<style scoped>
.secondary-tabs {
  background: #fafafa;
}

.secondary-tabs .v-tab {
  text-transform: none;
  font-size: 0.875rem;
  min-height: 48px;
}

/* Cards de miembros profesionales */
.team-member-card {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  border-radius: 12px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  height: 100%;
}

.team-member-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
}

/* Asegurar contraste en textos de cards de miembros */
.team-member-card .text-body-1,
.team-member-card .font-weight-bold {
  color: rgba(0, 0, 0, 0.87) !important;
}

.team-member-card .text-caption,
.team-member-card .text-grey {
  color: rgba(0, 0, 0, 0.6) !important;
}

/* Iconos siempre visibles en botones de miembros */
.team-member-card .v-btn .v-icon {
  opacity: 1 !important;
  visibility: visible !important;
  display: inline-flex !important;
}

.stat-card {
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.stat-box {
  text-align: center;
  padding: 8px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-box:hover {
  background: #f5f5f5;
  transform: scale(1.05);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: #757575;
  margin-top: 4px;
}

.task-list {
  max-height: 120px;
  overflow-y: auto;
}

.task-item {
  padding: 4px 0;
  color: #616161;
}

.role-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  height: 100%;
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
}

.assignment-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.assignment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.professional-card-header {
  padding: 16px 20px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  background: #fafafa !important;
}

.professional-card-header h3,
.professional-card-header .text-subtitle-1 {
  color: rgba(0, 0, 0, 0.87) !important; /* Color oscuro para contraste */
}

.professional-card-header .text-grey,
.professional-card-header .text-caption {
  color: rgba(0, 0, 0, 0.6) !important; /* Color gris oscuro para mejor legibilidad */
}

.professional-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.professional-card-icon.success {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.professional-card-icon.info {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
}

/* Asegurar contraste en títulos */
.team-title {
  color: rgba(0, 0, 0, 0.87) !important;
}

.team-subtitle {
  color: rgba(0, 0, 0, 0.6) !important;
}

/* Asegurar que todos los textos en cards sean visibles */
.v-card-text h2,
.v-card-text h3,
.v-card-text .text-h6 {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>

