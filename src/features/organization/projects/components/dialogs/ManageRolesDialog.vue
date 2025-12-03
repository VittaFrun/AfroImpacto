<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Gestión de Roles"
    icon="mdi-account-cog"
    max-width="1000px"
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
      
      <div v-else class="roles-grid-modern">
        <v-card
          v-for="role in projectRoles"
          :key="role.id_rol || role.id"
          class="role-card-modern"
          variant="flat"
          rounded="xl"
          elevation="2"
        >
          <!-- Color Banner -->
          <div 
            class="role-color-banner"
            :style="{
              background: `linear-gradient(135deg, ${role.color || '#2196F3'} 0%, ${adjustColorBrightness(role.color || '#2196F3', -20)} 100%)`,
              height: '80px'
            }"
          >
            <div class="color-badge">
              <div 
                class="color-circle"
                :style="{ backgroundColor: role.color || '#2196F3' }"
              ></div>
              <span class="color-hex">{{ role.color || '#2196F3' }}</span>
            </div>
          </div>
          
          <v-card-text class="pa-4">
            <div class="d-flex align-start gap-4">
              <!-- Avatar con color -->
              <v-avatar 
                :color="role.color || '#2196F3'" 
                size="64"
                class="role-avatar-modern"
              >
                <v-icon color="white" size="32">mdi-account-tie</v-icon>
              </v-avatar>
              
              <div class="flex-grow-1">
                <div class="d-flex align-center justify-space-between mb-2">
                  <h4 class="text-h6 font-weight-bold">
                    {{ role.nombre || role.name }}
                  </h4>
                  <div class="d-flex align-center gap-1">
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-pencil"
                          color="primary"
                          size="small"
                          variant="text"
                          @click="$emit('edit-role', role)"
                        ></v-btn>
                      </template>
                      <span>Editar rol</span>
                    </v-tooltip>
                    
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-delete"
                          color="error"
                          size="small"
                          variant="text"
                          @click="$emit('delete-role', role.id_rol || role.id)"
                        ></v-btn>
                      </template>
                      <span>Eliminar rol</span>
                    </v-tooltip>
                  </div>
                </div>
                
                <p class="text-body-2 text-grey-darken-1 mb-3">
                  {{ role.descripcion || role.description || 'Sin descripción' }}
                </p>
                
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    :color="role.activo ? 'success' : 'grey'"
                    size="small"
                    variant="flat"
                  >
                    <v-icon start size="14">
                      {{ role.activo ? 'mdi-check-circle' : 'mdi-close-circle' }}
                    </v-icon>
                    {{ role.activo ? 'Activo' : 'Inactivo' }}
                  </v-chip>
                  <v-chip
                    :color="getRoleTypeColor(role.tipo_rol)"
                    size="small"
                    variant="flat"
                  >
                    {{ getRoleTypeLabel(role.tipo_rol) }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
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

// Función para ajustar el brillo de un color
function adjustColorBrightness(hex, percent) {
  // Remover el # si existe
  hex = hex.replace('#', '');
  
  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Ajustar brillo
  const newR = Math.max(0, Math.min(255, r + percent));
  const newG = Math.max(0, Math.min(255, g + percent));
  const newB = Math.max(0, Math.min(255, b + percent));
  
  // Convertir de vuelta a hex
  const toHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}
</script>

<style scoped>
.roles-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.role-card-modern {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  overflow: hidden;
  cursor: default;
}

.role-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(33, 150, 243, 0.3);
}

.role-color-banner {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.color-hex {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  font-family: 'Courier New', monospace;
}

.role-avatar-modern {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
  transition: all 0.3s ease;
}

.role-card-modern:hover .role-avatar-modern {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 960px) {
  .roles-grid-modern {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .role-color-banner {
    height: 60px;
  }
  
  .color-badge {
    padding: 6px 12px;
  }
  
  .color-circle {
    width: 20px;
    height: 20px;
  }
  
  .color-hex {
    font-size: 0.7rem;
  }
}
</style>
