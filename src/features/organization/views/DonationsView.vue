<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Gestión de Donaciones</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Registra, visualiza y gestiona todas las donaciones recibidas para tus proyectos.
    </p>

    <v-card class="pa-6 rounded-lg elevation-0">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Historial de Donaciones</span>
        <v-btn color="primary" variant="flat">
          <v-icon start>mdi-plus-box</v-icon>
          Registrar Donación
        </v-btn>
      </v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-data-table
        :headers="headers"
        :items="donations"
        class="elevation-0 projects-table"
        :loading="loading"
        loading-text="Cargando donaciones..."
        no-data-text="No hay donaciones registradas"
      >
        <template v-slot:item.monto="{ item }">
          <span class="font-weight-bold text-success">${{ item.monto.toLocaleString() }}</span>
        </template>
        <template v-slot:item.verificado="{ item }">
          <v-chip :color="item.verificado ? 'success' : 'warning'" size="small">
            <v-icon start>{{ item.verificado ? 'mdi-check-circle' : 'mdi-clock-outline' }}</v-icon>
            {{ item.verificado ? 'Verificado' : 'Pendiente' }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-receipt-text" variant="text" color="info" size="small" @click="viewDonation(item.id)"></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);

const headers = ref([
  { title: 'ID Donación', key: 'id', align: 'start' },
  { title: 'Proyecto Asociado', key: 'proyecto', sortable: true },
  { title: 'Monto', key: 'monto', align: 'end', sortable: true },
  { title: 'Fecha', key: 'fecha', align: 'center', sortable: true },
  { title: 'Método de Pago', key: 'metodo', align: 'center', sortable: true },
  { title: 'Estado', key: 'verificado', align: 'center', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
]);

const donations = ref([]);

onMounted(() => {
  setTimeout(() => {
    donations.value = [
      { id: 'DON-001', proyecto: 'Empoderamiento Educativo', monto: 500, fecha: '2025-08-15', metodo: 'Transferencia Bancaria', verificado: true },
      { id: 'DON-002', proyecto: 'Salud y Bienestar', monto: 1200, fecha: '2025-08-12', metodo: 'Tarjeta de Crédito', verificado: true },
      { id: 'DON-003', proyecto: 'Fomento al Emprendimiento', monto: 750, fecha: '2025-08-10', metodo: 'PayPal', verificado: false },
    ];
    loading.value = false;
  }, 1500);
});

function viewDonation(id) {
  console.log(`Viendo detalle de la donación ${id}`);
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
