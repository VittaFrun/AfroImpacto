<template>
  <ModernDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Gestionar Permisos del Rol"
    icon="mdi-shield-edit"
    max-width="700px"
  >
    <template #content>
      <div v-if="role">
        <h3 class="text-h6 mb-4">
          Permisos para: <strong>{{ role.nombre || role.name }}</strong>
        </h3>

        <v-divider class="mb-4"></v-divider>

        <div v-if="loadingPermissions">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2 text-grey">Cargando permisos...</p>
        </div>

        <div v-else>
          <v-checkbox
            v-for="permiso in availablePermissions"
            :key="permiso.id_permiso || permiso.id"
            v-model="selectedPermissions"
            :value="permiso.id_permiso || permiso.id"
            :label="permiso.nombre || permiso.name"
            :hint="permiso.descripcion || permiso.description"
            persistent-hint
            class="mb-2"
          >
            <template #label>
              <div>
                <div class="font-weight-medium">{{ permiso.nombre || permiso.name }}</div>
                <div class="text-caption text-grey">{{ permiso.descripcion || permiso.description }}</div>
              </div>
            </template>
          </v-checkbox>

          <v-alert
            v-if="availablePermissions.length === 0"
            type="info"
            variant="tonal"
            class="mt-4"
          >
            No hay permisos disponibles. Contacta al administrador para crear permisos.
          </v-alert>
        </div>
      </div>
    </template>

    <template #actions>
      <ModernButton
        color="grey"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cancelar
      </ModernButton>
      <ModernButton
        color="primary"
        variant="flat"
        :loading="loading"
        @click="handleSave"
      >
        Guardar Permisos
      </ModernButton>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import ModernButton from '@/components/ui/ModernButton.vue';
import apiClient from '@/plugins/axios';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  role: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const availablePermissions = ref([]);
const selectedPermissions = ref([]);
const loadingPermissions = ref(false);

const permissionList = [
  { id: 1, nombre: 'ver_proyectos', descripcion: 'Ver proyectos de la organización' },
  { id: 2, nombre: 'crear_proyectos', descripcion: 'Crear nuevos proyectos' },
  { id: 3, nombre: 'editar_proyectos', descripcion: 'Editar proyectos existentes' },
  { id: 4, nombre: 'eliminar_proyectos', descripcion: 'Eliminar proyectos' },
  { id: 5, nombre: 'gestionar_voluntarios', descripcion: 'Gestionar voluntarios en proyectos' },
  { id: 6, nombre: 'gestionar_donaciones', descripcion: 'Gestionar donaciones' },
  { id: 7, nombre: 'ver_reportes', descripcion: 'Ver reportes y estadísticas' },
  { id: 8, nombre: 'gestionar_equipo', descripcion: 'Gestionar miembros del equipo' },
  { id: 9, nombre: 'gestionar_roles', descripcion: 'Gestionar roles de la organización' }
];

watch(() => props.role, async (newRole) => {
  if (newRole && props.modelValue) {
    await loadPermissions();
    await loadRolePermissions();
  }
}, { immediate: true });

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && props.role) {
    await loadPermissions();
    await loadRolePermissions();
  }
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    // Intentar cargar desde API
    const response = await apiClient.get('/permisos');
    availablePermissions.value = response.data || permissionList;
  } catch (error) {
    console.error('Error loading permissions:', error);
    // Usar lista por defecto si falla
    availablePermissions.value = permissionList;
  } finally {
    loadingPermissions.value = false;
  }
}

async function loadRolePermissions() {
  if (!props.role?.id_rol && !props.role?.id) return;
  
  try {
    const roleId = props.role.id_rol || props.role.id;
    const response = await apiClient.get(`/roles/${roleId}/permisos`);
    selectedPermissions.value = (response.data || []).map(p => p.id_permiso || p.id);
  } catch (error) {
    console.error('Error loading role permissions:', error);
    selectedPermissions.value = [];
  }
}

function handleSave() {
  emit('save', selectedPermissions.value);
  emit('update:modelValue', false);
}
</script>

