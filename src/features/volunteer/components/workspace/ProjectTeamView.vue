<template>
  <v-card class="team-view-card" variant="outlined" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
        <span class="text-h6 font-weight-bold">Equipo del Proyecto</span>
      </div>
      <v-chip size="small" variant="tonal" color="info">
        {{ teamMembers.length }} miembros
      </v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <div v-if="loading" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="teamMembers.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-account-group-outline</v-icon>
        <p class="text-grey mt-4">No hay miembros en el equipo</p>
      </div>
      <div v-else>
        <div
          v-for="member in teamMembers"
          :key="member.id_voluntario || member.id"
          class="team-member-item mb-3"
        >
          <v-card variant="outlined" class="pa-3">
            <div class="d-flex align-center">
              <v-avatar
                :color="getAvatarColor(member.nombre)"
                size="48"
                class="mr-3"
              >
                {{ getInitials(member.nombre) }}
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-body-1 font-weight-medium mb-1">
                  {{ member.nombre }}
                </div>
                <div class="d-flex align-center flex-wrap gap-2">
                  <v-chip
                    v-for="rol in member.roles"
                    :key="rol.id_rol"
                    size="small"
                    variant="tonal"
                    color="info"
                  >
                    {{ rol.nombre }}
                  </v-chip>
                </div>
                <div v-if="member.email" class="text-caption text-grey mt-1">
                  <v-icon size="14" class="mr-1">mdi-email</v-icon>
                  {{ member.email }}
                </div>
              </div>
              <v-btn
                icon="mdi-email-outline"
                variant="text"
                size="small"
                @click="contactMember(member)"
                v-if="member.email"
              ></v-btn>
            </div>
          </v-card>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  teamMembers: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['contact']);

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const getAvatarColor = (name) => {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
  if (!name) return colors[0];
  const index = name.length % colors.length;
  return colors[index];
};

const contactMember = (member) => {
  emit('contact', member);
};
</script>

<style scoped>
.team-member-item {
  transition: transform 0.2s;
}

.team-member-item:hover {
  transform: translateX(4px);
}
</style>

