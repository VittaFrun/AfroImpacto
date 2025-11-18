<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="700"
    persistent
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center pa-4 bg-error">
        <v-icon color="white" class="mr-2">mdi-alert-circle</v-icon>
        <span class="text-white font-weight-bold">
          Confirmar Eliminación de {{ assignments.length }} Asignación(es)
        </span>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Resumen -->
        <v-alert
          type="warning"
          variant="tonal"
          class="mb-4"
          prominent
        >
          <v-alert-title class="mb-2">
            <v-icon start>mdi-alert</v-icon>
            Atención: Esta acción no se puede deshacer
          </v-alert-title>
          <p class="mb-0">
            Se eliminarán <strong>{{ assignments.length }}</strong> asignación(es) de voluntarios.
            Todos los voluntarios serán removidos de sus tareas asignadas.
          </p>
        </v-alert>

        <!-- Lista detallada de asignaciones -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 font-weight-bold mb-3">
            <v-icon start size="small">mdi-clipboard-list</v-icon>
            Asignaciones a Eliminar:
          </h4>
          
          <v-list density="compact" class="bg-grey-lighten-5 rounded-lg" max-height="400">
            <template v-for="(assignment, index) in assignments" :key="index">
              <v-list-item class="mb-2">
                <template v-slot:prepend>
                  <v-avatar size="40" color="primary" class="mr-3">
                    <v-icon color="white" size="20">mdi-account</v-icon>
                  </v-avatar>
                </template>
                
                <v-list-item-title class="font-weight-medium mb-1">
                  {{ getVolunteerName(assignment) }}
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  <div class="d-flex flex-column gap-1 mt-1">
                    <div class="d-flex align-center flex-wrap gap-2">
                      <v-chip size="x-small" color="info" variant="tonal">
                        <v-icon start size="12">mdi-clipboard-text</v-icon>
                        {{ getTaskName(assignment) }}
                      </v-chip>
                      <v-chip size="x-small" color="primary" variant="tonal">
                        <v-icon start size="12">mdi-shield-account</v-icon>
                        {{ getRoleName(assignment) }}
                      </v-chip>
                    </div>
                    <div v-if="getTaskStatus(assignment)" class="text-caption text-grey">
                      Estado de la tarea: 
                      <v-chip size="x-small" :color="getStatusColor(getTaskStatus(assignment))" variant="flat">
                        {{ getTaskStatus(assignment) }}
                      </v-chip>
                    </div>
                  </div>
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-divider v-if="index < assignments.length - 1" class="my-2"></v-divider>
            </template>
          </v-list>
        </div>

        <!-- Estadísticas resumidas -->
        <v-row dense class="mt-4">
          <v-col cols="12" md="4">
            <v-card variant="outlined" class="text-center pa-3">
              <div class="text-h6 font-weight-bold text-primary">{{ uniqueVolunteersCount }}</div>
              <div class="text-caption text-grey">Voluntario(s) Único(s)</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="outlined" class="text-center pa-3">
              <div class="text-h6 font-weight-bold text-info">{{ uniqueTasksCount }}</div>
              <div class="text-caption text-grey">Tarea(s) Única(s)</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="outlined" class="text-center pa-3">
              <div class="text-h6 font-weight-bold text-success">{{ uniqueRolesCount }}</div>
              <div class="text-caption text-grey">Rol(es) Único(s)</div>
            </v-card>
          </v-col>
        </v-row>

        <v-alert
          type="info"
          variant="tonal"
          class="mt-4 mb-0"
        >
          <v-icon start size="small">mdi-information</v-icon>
          <span class="text-body-2">
            Los voluntarios seguirán siendo miembros del proyecto, pero perderán sus asignaciones específicas a estas tareas.
          </span>
        </v-alert>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="$emit('confirm')"
          :loading="loading"
        >
          <v-icon start>mdi-delete</v-icon>
          Eliminar {{ assignments.length }} Asignación(es)
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  assignments: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue', 'confirm']);

// Helpers para obtener información de las asignaciones
const getVolunteerName = (assignment) => {
  return assignment.voluntario?.usuario?.nombre || 
         assignment.voluntario?.nombre || 
         assignment.name || 
         'Voluntario desconocido';
};

const getTaskName = (assignment) => {
  return assignment.tarea?.descripcion || 
         assignment.tarea?.nombre || 
         assignment.taskName || 
         'Tarea desconocida';
};

const getRoleName = (assignment) => {
  return assignment.rol?.nombre || 
         assignment.roleName || 
         'Rol desconocido';
};

const getTaskStatus = (assignment) => {
  return assignment.tarea?.estado?.nombre || 
         assignment.tarea?.estado_nombre || 
         assignment.taskStatus || 
         null;
};

const getStatusColor = (status) => {
  if (!status) return 'grey';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('completado') || statusLower.includes('finalizado')) return 'success';
  if (statusLower.includes('en progreso') || statusLower.includes('proceso')) return 'info';
  if (statusLower.includes('pendiente')) return 'warning';
  if (statusLower.includes('cancelado') || statusLower.includes('rechazado')) return 'error';
  return 'grey';
};

// Estadísticas computadas
const uniqueVolunteersCount = computed(() => {
  const volunteers = new Set();
  props.assignments.forEach(assignment => {
    const volunteerId = assignment.id_voluntario || 
                       assignment.voluntario?.id_voluntario || 
                       assignment.volunteerId;
    if (volunteerId) {
      volunteers.add(volunteerId);
    }
  });
  return volunteers.size;
});

const uniqueTasksCount = computed(() => {
  const tasks = new Set();
  props.assignments.forEach(assignment => {
    const taskId = assignment.id_tarea || 
                   assignment.tarea?.id_tarea || 
                   assignment.taskId;
    if (taskId) {
      tasks.add(taskId);
    }
  });
  return tasks.size;
});

const uniqueRolesCount = computed(() => {
  const roles = new Set();
  props.assignments.forEach(assignment => {
    const roleId = assignment.id_rol || 
                   assignment.rol?.id_rol || 
                   assignment.roleId;
    if (roleId) {
      roles.add(roleId);
    }
  });
  return roles.size;
});
</script>

<style scoped>
.v-card-title.bg-error {
  background-color: rgb(var(--v-theme-error)) !important;
}
</style>

