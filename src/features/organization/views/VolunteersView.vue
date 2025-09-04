<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Gestión de Voluntarios</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Busca, filtra y gestiona los voluntarios que colaboran con tu organización.
    </p>

    <v-card class="pa-6 rounded-lg elevation-0">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Listado de Voluntarios</span>
        <v-btn color="primary" variant="flat">
          <v-icon start>mdi-filter-variant</v-icon>
          Filtros Avanzados
        </v-btn>
      </v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-text-field
        v-model="search"
        label="Buscar por nombre, habilidad o proyecto..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        dense
        class="mb-4"
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="volunteers"
        :search="search"
        class="elevation-0 projects-table"
        :loading="loading"
        loading-text="Cargando voluntarios..."
        no-data-text="No se encontraron voluntarios"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="40" class="mr-4">
              <v-img :src="item.avatar" :alt="item.name"></v-img>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.name }}</div>
              <div class="text-caption text-grey">{{ item.email }}</div>
            </div>
          </div>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="item.statusColor" size="small">{{ item.status }}</v-chip>
        </template>
        <template v-slot:item.skills="{ item }">
          <v-chip v-for="skill in item.skills" :key="skill" class="ma-1" color="blue-grey" variant="tonal" size="small">
            {{ skill }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" color="info" size="small" @click="viewVolunteer(item.id)"></v-btn>
          <v-btn icon="mdi-account-plus" variant="text" color="success" size="small" @click="assignToProject(item.id)"></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const search = ref('');
const loading = ref(true);

const headers = ref([
  { title: 'Nombre', key: 'name', align: 'start', sortable: true },
  { title: 'Estado', key: 'status', align: 'center', sortable: true },
  { title: 'Jornada', key: 'jornada', align: 'center', sortable: true },
  { title: 'Habilidades Principales', key: 'skills', sortable: false, align: 'center' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
]);

const volunteers = ref([]);

// Simulación de carga de datos
onMounted(() => {
  setTimeout(() => {
    volunteers.value = [
      { id: 1, name: 'Ana García', email: 'ana.garcia@email.com', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'Activo', statusColor: 'success', jornada: 'Completa', skills: ['Diseño Gráfico', 'Marketing'] },
      { id: 2, name: 'Luis Pérez', email: 'luis.perez@email.com', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'Inactivo', statusColor: 'error', jornada: 'Media Jornada', skills: ['Desarrollo Web', 'Bases de Datos'] },
      { id: 3, name: 'Sofía Martínez', email: 'sofia.martinez@email.com', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', status: 'Activo', statusColor: 'success', jornada: 'Flexible', skills: ['Redacción', 'Redes Sociales'] },
    ];
    loading.value = false;
  }, 1500);
});

function viewVolunteer(id) {
  console.log(`Viendo perfil del voluntario ${id}`);
  // Lógica para navegar al perfil del voluntario
}

function assignToProject(id) {
  console.log(`Asignando voluntario ${id} a un proyecto`);
  // Lógica para abrir diálogo de asignación
}
</script>

<style scoped>
.projects-table .v-data-table__thead th {
  color: #8392ab !important;
  font-weight: bold;
}

.projects-table .v-data-table__tbody td {
  color: #67748e !important;
}
</style>
