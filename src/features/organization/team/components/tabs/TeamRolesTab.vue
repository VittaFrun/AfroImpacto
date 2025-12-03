<template>
  <v-container fluid class="pa-6">
    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6 font-weight-bold">Roles de Organización</h3>
      <ModernButton
        color="primary"
        prepend-icon="mdi-plus"
        @click="$emit('add-role')"
      >
        Crear Rol
      </ModernButton>
    </div>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4 text-grey">Cargando roles...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="roles.length === 0">
      <v-col cols="12" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-shield-account-outline</v-icon>
        <p class="mt-4 text-grey">No hay roles definidos</p>
        <ModernButton
          color="primary"
          prepend-icon="mdi-plus"
          class="mt-4"
          @click="$emit('add-role')"
        >
          Crear Primer Rol
        </ModernButton>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="role in roles"
        :key="role.id_rol || role.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="role-card" elevation="2" rounded="lg">
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="d-flex align-center">
                <v-avatar
                  :color="role.color || '#2196F3'"
                  size="48"
                  class="mr-3"
                >
                  <v-icon color="white">mdi-shield-account</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h6 font-weight-bold">
                    {{ role.nombre || role.name }}
                  </h3>
                  <p class="text-caption text-grey">
                    {{ role.descripcion || role.description || 'Sin descripción' }}
                  </p>
                </div>
              </div>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="mb-2">
              <v-chip
                :color="role.activo ? 'success' : 'grey'"
                size="small"
                variant="tonal"
              >
                <v-icon start size="small">
                  {{ role.activo ? 'mdi-check-circle' : 'mdi-cancel' }}
                </v-icon>
                {{ role.activo ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </div>

            <div class="text-caption text-grey">
              <v-icon size="small" class="mr-1">mdi-account-multiple</v-icon>
              Permisos: {{ role.permisos?.length || 0 }} asignados
            </div>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-spacer></v-spacer>
            <ModernButton
              icon="mdi-shield-edit"
              variant="text"
              color="info"
              size="small"
              @click="$emit('manage-permissions', role)"
            >
              Permisos
            </ModernButton>
            <ModernButton
              icon="mdi-pencil"
              variant="text"
              color="warning"
              size="small"
              @click="$emit('edit-role', role)"
            >
              Editar
            </ModernButton>
            <ModernButton
              icon="mdi-delete"
              variant="text"
              color="error"
              size="small"
              @click="$emit('delete-role', role.id_rol || role.id)"
            >
              Eliminar
            </ModernButton>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  roles: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['add-role', 'edit-role', 'delete-role', 'manage-permissions']);
</script>

<style scoped>
.role-card {
  transition: all 0.3s ease;
  height: 100%;
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
}
</style>

