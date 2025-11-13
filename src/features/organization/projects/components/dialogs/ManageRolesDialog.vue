<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Gestión de Roles"
    icon="mdi-account-cog"
    max-width="900px"
  >
    <template #content>
      <div class="d-flex justify-space-between align-center mb-4">
        <h3 class="text-h6">Roles del Proyecto</h3>
        <ModernButton
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="$emit('add-role')"
        >
          Nuevo Rol
        </ModernButton>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="text-body-2 text-grey mt-2">Cargando roles...</p>
      </div>
      
      <div v-else-if="!projectRoles || projectRoles.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-account-off</v-icon>
        <p class="text-body-1 text-grey mt-4">No hay roles creados aún</p>
        <ModernButton
          color="primary"
          variant="outlined"
          prepend-icon="mdi-plus"
          @click="$emit('add-role')"
          class="mt-4"
        >
          Crear Primer Rol
        </ModernButton>
      </div>
      
      <v-list v-else class="pa-0">
        <v-list-item
          v-for="role in projectRoles"
          :key="role.id_rol || role.id"
          class="mb-2 border rounded-lg"
        >
          <template #prepend>
            <v-avatar :color="role.color || '#2196F3'" size="40">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
          </template>
          
          <v-list-item-title class="font-weight-medium">
            {{ role.nombre || role.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ role.descripcion || role.description || 'Sin descripción' }}
          </v-list-item-subtitle>
          
          <template #append>
            <div class="d-flex align-center gap-2">
              <v-chip
                :color="getRoleTypeColor(role.tipo_rol)"
                size="small"
                variant="tonal"
              >
                {{ getRoleTypeLabel(role.tipo_rol) }}
              </v-chip>
              
              <v-chip
                :color="role.activo ? 'success' : 'error'"
                size="small"
                variant="tonal"
              >
                {{ role.activo ? 'Activo' : 'Inactivo' }}
              </v-chip>
              
              <v-btn
                icon="mdi-pencil"
                color="primary"
                size="small"
                variant="text"
                @click="$emit('edit-role', role)"
              ></v-btn>
              
              <v-btn
                icon="mdi-delete"
                color="error"
                size="small"
                variant="text"
                @click="$emit('delete-role', role.id_rol || role.id)"
                :disabled="role.tipo_rol === 'sistema'"
              ></v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </template>
    
    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cerrar
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  projectRoles: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  getRoleTypeColor: {
    type: Function,
    required: true
  },
  getRoleTypeLabel: {
    type: Function,
    required: true
  }
});

defineEmits(['update:modelValue', 'add-role', 'edit-role', 'delete-role']);
</script>

<style scoped>
.border {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

