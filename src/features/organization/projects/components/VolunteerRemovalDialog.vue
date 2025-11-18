<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center pa-4 bg-error">
        <v-icon color="white" class="mr-2">mdi-alert-circle</v-icon>
        <span class="text-white font-weight-bold">Confirmar Eliminación de Voluntario</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Información del voluntario -->
        <div v-if="volunteer" class="mb-4">
          <div class="d-flex align-center mb-3">
            <v-avatar size="48" class="mr-3">
              <v-icon size="32">mdi-account</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold mb-1">{{ volunteer.name }}</h3>
              <p class="text-body-2 text-grey mb-0">{{ volunteer.email }}</p>
            </div>
          </div>
        </div>

        <!-- Estado de validación -->
        <div v-if="loading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
          <p class="text-body-2 text-grey mt-2">Verificando asignaciones...</p>
        </div>

        <!-- Si tiene asignaciones -->
        <div v-else-if="validationResult?.hasAssignments" class="mb-4">
          <v-alert
            type="warning"
            variant="tonal"
            class="mb-4"
            prominent
          >
            <v-alert-title class="mb-2">
              <v-icon start>mdi-alert</v-icon>
              No se puede eliminar el voluntario
            </v-alert-title>
            <p class="mb-0">
              El voluntario tiene <strong>{{ validationResult.count }}</strong> asignación(es) activa(s) en este proyecto.
              Debe eliminar primero todas las asignaciones antes de remover al voluntario.
            </p>
          </v-alert>

          <!-- Lista de asignaciones -->
          <div class="mb-4">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">
              <v-icon start size="small">mdi-clipboard-list</v-icon>
              Asignaciones Activas:
            </h4>
            <v-list density="compact" class="bg-grey-lighten-5 rounded-lg">
              <v-list-item
                v-for="(assignment, index) in validationResult.assignments"
                :key="index"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="font-weight-medium">
                  {{ assignment.tarea.nombre }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip size="x-small" class="mr-2">
                    {{ assignment.rol.nombre }}
                  </v-chip>
                  <span class="text-caption text-grey">
                    Estado: {{ assignment.tarea.estado }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>

          <v-alert
            type="info"
            variant="tonal"
            class="mb-0"
          >
            <v-icon start size="small">mdi-information</v-icon>
            <span class="text-body-2">
              Para eliminar al voluntario, primero debe eliminar todas sus asignaciones desde la pestaña "Asignaciones Detalladas".
            </span>
          </v-alert>
        </div>

        <!-- Si no tiene asignaciones -->
        <div v-else class="mb-4">
          <v-alert
            type="success"
            variant="tonal"
            class="mb-4"
          >
            <v-icon start>mdi-check-circle</v-icon>
            <span>
              El voluntario no tiene asignaciones activas y puede ser removido del proyecto.
            </span>
          </v-alert>

          <p class="text-body-1 mb-0">
            ¿Estás seguro de que quieres eliminar a <strong>{{ volunteer?.name }}</strong> del proyecto?
            Esta acción eliminará todas las relaciones del voluntario con este proyecto.
          </p>
        </div>
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
          v-if="!validationResult?.hasAssignments"
          color="error"
          variant="flat"
          @click="$emit('confirm')"
          :loading="removing"
          :disabled="loading || validationResult?.hasAssignments"
        >
          <v-icon start>mdi-delete</v-icon>
          Eliminar Voluntario
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  volunteer: {
    type: Object,
    default: null
  },
  validationResult: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  removing: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue', 'confirm']);
</script>

<style scoped>
.v-card-title.bg-error {
  background-color: rgb(var(--v-theme-error)) !important;
}
</style>

