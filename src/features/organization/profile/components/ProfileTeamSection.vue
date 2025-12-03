<template>
  <v-card-text class="pa-6">
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="teamMembers.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-account-group-outline</v-icon>
      <p class="text-body-1 text-grey mt-4">
        {{ isOwnProfile ? 'Aún no hay miembros en tu equipo' : 'Esta organización aún no ha compartido información de su equipo' }}
      </p>
    </div>

    <v-row v-else>
      <v-col
        v-for="member in teamMembers"
        :key="member.id_miembro"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="team-member-card" elevation="2" rounded="lg">
          <v-card-text class="pa-4 text-center">
            <v-avatar
              :color="getAvatarColor(member.voluntario?.usuario?.nombre)"
              size="80"
              class="mb-3"
            >
              <span class="text-white text-h5">
                {{ getInitials(member.voluntario?.usuario?.nombre || 'U') }}
              </span>
            </v-avatar>
            <h4 class="text-subtitle-1 font-weight-bold mb-1">
              {{ member.voluntario?.usuario?.nombre || 'Sin nombre' }}
            </h4>
            <v-chip
              v-if="member.rol_organizacion"
              :color="getRoleColor(member.rol_organizacion?.nombre)"
              size="small"
              variant="tonal"
              class="mb-2"
            >
              {{ member.rol_organizacion.nombre }}
            </v-chip>
            <p class="text-caption text-grey mb-0">
              Miembro desde {{ formatDate(member.fecha_aprobacion || member.creado_en) }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useOrganizationProfileStore } from '../stores/organizationProfileStore';

const props = defineProps({
  organizationId: {
    type: Number,
    required: true
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const profileStore = useOrganizationProfileStore();

const teamMembers = ref([]);
const loadingTeam = ref(false);

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
    month: 'long'
  });
}

onMounted(async () => {
  if (props.organizationId) {
    loadingTeam.value = true;
    try {
      const data = await profileStore.fetchTeamMembers(props.organizationId);
      teamMembers.value = data;
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      loadingTeam.value = false;
    }
  }
});
</script>

<style scoped>
.team-member-card {
  transition: all 0.3s ease;
  height: 100%;
}

.team-member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
}
</style>

