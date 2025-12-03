<template>
  <v-container fluid class="pa-6">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-text-field
        v-model="search"
        label="Buscar miembros..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        style="max-width: 300px;"
      ></v-text-field>
      
      <v-select
        v-model="roleFilter"
        :items="roleOptions"
        label="Filtrar por rol"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        style="max-width: 250px;"
      ></v-select>
    </div>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4 text-grey">Cargando miembros...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="filteredMembers.length === 0">
      <v-col cols="12" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-account-group-outline</v-icon>
        <p class="mt-4 text-grey">No hay miembros activos en el equipo</p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="member in filteredMembers"
        :key="member.id_miembro"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="member-card" elevation="2" rounded="lg">
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-avatar :color="getAvatarColor(member.voluntario?.usuario?.nombre)" size="56">
                <span class="text-white text-h6">
                  {{ getInitials(member.voluntario?.usuario?.nombre || 'U') }}
                </span>
              </v-avatar>
              <div class="ml-4 flex-grow-1">
                <h3 class="text-h6 font-weight-bold">
                  {{ member.voluntario?.usuario?.nombre || 'Sin nombre' }}
                </h3>
                <p class="text-caption text-grey">
                  {{ member.voluntario?.usuario?.email || '' }}
                </p>
              </div>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="mb-2">
              <v-chip
                :color="getRoleColor(member.rol_organizacion?.nombre)"
                size="small"
                variant="tonal"
              >
                <v-icon start size="small">mdi-shield-account</v-icon>
                {{ member.rol_organizacion?.nombre || 'Sin rol asignado' }}
              </v-chip>
            </div>

            <div class="text-caption text-grey mb-3">
              <v-icon size="small" class="mr-1">mdi-calendar-check</v-icon>
              Miembro desde: {{ formatDate(member.fecha_aprobacion || member.creado_en) }}
            </div>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-spacer></v-spacer>
            <ModernButton
              icon="mdi-eye"
              variant="text"
              color="info"
              size="small"
              @click="$emit('view-profile', member)"
            >
              Ver Perfil
            </ModernButton>
            <ModernButton
              icon="mdi-pencil"
              variant="text"
              color="warning"
              size="small"
              @click="$emit('edit-member', member)"
            >
              Editar
            </ModernButton>
            <ModernButton
              icon="mdi-delete"
              variant="text"
              color="error"
              size="small"
              @click="$emit('remove-member', member)"
            >
              Remover
            </ModernButton>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModernButton from '@/components/ui/ModernButton.vue';

const props = defineProps({
  members: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit-member', 'remove-member', 'view-profile']);

const search = ref('');
const roleFilter = ref(null);

const roleOptions = computed(() => {
  const roles = new Set();
  props.members.forEach(m => {
    if (m.rol_organizacion?.nombre) {
      roles.add(m.rol_organizacion.nombre);
    }
  });
  return Array.from(roles).map(r => ({ title: r, value: r }));
});

const filteredMembers = computed(() => {
  let filtered = props.members;

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(m => {
      const name = m.voluntario?.usuario?.nombre || '';
      const email = m.voluntario?.usuario?.email || '';
      return name.toLowerCase().includes(searchLower) ||
             email.toLowerCase().includes(searchLower);
    });
  }

  if (roleFilter.value) {
    filtered = filtered.filter(m => 
      m.rol_organizacion?.nombre === roleFilter.value
    );
  }

  return filtered;
});

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
  const index = (name?.length || 0) % colors.length;
  return colors[index];
}

function getRoleColor(roleName) {
  const colors = {
    'Administrador': 'error',
    'Coordinador': 'warning',
    'Editor': 'info',
    'Visualizador': 'success'
  };
  return colors[roleName] || 'grey';
}

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<style scoped>
.member-card {
  transition: all 0.3s ease;
  height: 100%;
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
}
</style>

