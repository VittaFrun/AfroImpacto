<template>
  <ModernDialog
    v-model="dialogModel"
    title="Nuevo Mensaje"
    icon="mdi-message-plus"
    :show-cancel-button="true"
    :show-confirm-button="false"
    @update:model-value="handleDialogChange"
  >
    <template #content>
      <v-text-field
        v-model="searchQuery"
        placeholder="Buscar usuario..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        hide-details
        clearable
      ></v-text-field>

      <v-list v-if="usuariosFiltrados.length > 0" density="comfortable">
        <v-list-item
          v-for="usuario in usuariosFiltrados"
          :key="usuario.id_usuario"
          @click="seleccionarUsuario(usuario)"
          class="cursor-pointer"
        >
          <template v-slot:prepend>
            <v-avatar color="primary" size="40">
              <span class="text-white">
                {{ getIniciales(usuario.nombre) }}
              </span>
            </v-avatar>
          </template>

          <v-list-item-title>{{ usuario.nombre }}</v-list-item-title>
          <v-list-item-subtitle>{{ usuario.email }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <div v-else class="text-center pa-8">
        <v-icon size="64" color="grey-lighten-1">mdi-account-search-outline</v-icon>
        <p class="text-body-1 text-grey mt-4">No se encontraron usuarios</p>
      </div>
    </template>
  </ModernDialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ModernDialog from '@/components/ui/ModernDialog.vue';
import apiClient from '@/plugins/axios';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'seleccionar-usuario']);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const searchQuery = ref('');
const usuarios = ref([]);
const loading = ref(false);

const usuariosFiltrados = computed(() => {
  if (!searchQuery.value) {
    return usuarios.value.slice(0, 20); // Mostrar solo los primeros 20
  }

  const query = searchQuery.value.toLowerCase();
  return usuarios.value.filter(
    (u) =>
      u.nombre.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
  );
});

const getIniciales = (nombre) => {
  if (!nombre) return '?';
  const partes = nombre.split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

const seleccionarUsuario = (usuario) => {
  emit('seleccionar-usuario', usuario);
  dialogModel.value = false;
};

const cargarUsuarios = async () => {
  loading.value = true;
  try {
    // Endpoint para obtener usuarios (ajusta según tu API)
    // Opción 1: Si tienes un endpoint de usuarios
    const response = await apiClient.get('/users');
    usuarios.value = response.data || [];
    
    // Opción 2: Si no existe, puedes usar voluntarios u organizaciones
    // const response = await apiClient.get('/voluntarios');
    // usuarios.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    // Si el endpoint no existe, dejar vacío (el usuario puede crear conversación directamente)
    usuarios.value = [];
  } finally {
    loading.value = false;
  }
};

const handleDialogChange = (value) => {
  if (value && usuarios.value.length === 0) {
    cargarUsuarios();
  }
};

watch(() => props.modelValue, (newValue) => {
  if (newValue && usuarios.value.length === 0) {
    cargarUsuarios();
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

