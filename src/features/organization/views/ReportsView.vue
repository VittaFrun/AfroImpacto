<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Centro de Reportes</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Genera y descarga reportes detallados sobre el impacto y la gestión de tus proyectos.
    </p>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-lg elevation-0 h-100">
          <v-card-title class="text-h6 font-weight-bold">Generar Nuevo Reporte</v-card-title>
          <v-divider class="my-4"></v-divider>
          <v-form>
            <v-select
              label="Tipo de Reporte"
              :items="['Financiero por Proyecto', 'Horas de Voluntariado', 'Impacto de Donaciones', 'General de Actividades']"
              variant="outlined"
              dense
              class="mb-4"
            ></v-select>
            <v-select
              label="Seleccionar Proyecto (Opcional)"
              :items="['Todos los Proyectos', 'Empoderamiento Educativo', 'Salud y Bienestar']"
              variant="outlined"
              dense
              class="mb-4"
            ></v-select>
            <v-text-field
              label="Rango de Fechas"
              type="date"
              variant="outlined"
              dense
              class="mb-4"
            ></v-text-field>
            <v-btn color="primary" block variant="flat">Generar Reporte</v-btn>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="pa-6 rounded-lg elevation-0 h-100">
          <v-card-title class="text-h6 font-weight-bold">Reportes Generados</v-card-title>
          <v-divider class="my-4"></v-divider>
          <v-list lines="two">
            <v-list-item v-for="report in reports" :key="report.id">
              <template v-slot:prepend>
                <v-icon color="primary">{{ report.icon }}</v-icon>
              </template>
              <v-list-item-title class="font-weight-bold">{{ report.tipo }}</v-list-item-title>
              <v-list-item-subtitle>Generado el {{ report.fecha }} - {{ report.proyecto }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn icon="mdi-download" variant="text" color="success" @click="downloadReport(report.id)"></v-btn>
                <v-btn icon="mdi-delete" variant="text" color="error" @click="deleteReport(report.id)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const reports = ref([
  { id: 1, tipo: 'Financiero por Proyecto', fecha: '2025-08-01', proyecto: 'Empoderamiento Educativo', icon: 'mdi-file-chart' },
  { id: 2, tipo: 'Horas de Voluntariado', fecha: '2025-07-30', proyecto: 'Todos los Proyectos', icon: 'mdi-file-clock' },
  { id: 3, tipo: 'Impacto de Donaciones', fecha: '2025-07-25', proyecto: 'Salud y Bienestar', icon: 'mdi-file-check' },
]);

function downloadReport(id) {
  console.log(`Descargando reporte ${id}`);
}

function deleteReport(id) {
  console.log(`Eliminando reporte ${id}`);
  reports.value = reports.value.filter(r => r.id !== id);
}
</script>

<style scoped>
/* Puedes añadir estilos específicos si es necesario */
</style>
