<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Mis Proyectos y Tareas</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Aquí puedes ver los proyectos en los que participas y las tareas que tienes asignadas.
    </p>

    <v-expansion-panels variant="accordion">
      <v-expansion-panel v-for="project in myProjects" :key="project.id">
        <v-expansion-panel-title>
          <div class="d-flex justify-space-between align-center w-100">
            <span class="font-weight-bold">{{ project.name }}</span>
            <v-chip color="primary" size="small">{{ project.organization }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list lines="two">
            <v-list-item v-for="task in project.tasks" :key="task.id">
              <v-list-item-title>{{ task.description }}</v-list-item-title>
              <v-list-item-subtitle>Rol: {{ task.role }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-select
                  v-model="task.status"
                  :items="['Pendiente', 'En Progreso', 'Completado']"
                  dense
                  hide-details
                  variant="outlined"
                  style="max-width: 180px;"
                  @update:model-value="updateTaskStatus(task)"
                ></v-select>
              </template>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const myProjects = ref([]);

onMounted(() => {
  myProjects.value = [
    {
      id: 1,
      name: 'Empoderamiento Educativo para Niños Afro',
      organization: 'Fundación Semillas del Saber',
      tasks: [
        { id: 101, description: 'Diseñar material didáctico para taller de lectura', role: 'Diseñador Gráfico', status: 'En Progreso' },
        { id: 102, description: 'Impartir clase de matemáticas básicas', role: 'Tutor Académico', status: 'Pendiente' },
      ]
    },
    {
      id: 2,
      name: 'Reforestación y Conservación del Manglar',
      organization: 'Guardianes del Ecosistema',
      tasks: [
        { id: 201, description: 'Coordinar logística para jornada de siembra', role: 'Coordinador de Campo', status: 'Completado' },
      ]
    }
  ];
});

function updateTaskStatus(task) {
  console.log(`Actualizando estado de la tarea ${task.id} a ${task.status}`);
  // Lógica para llamar a la API y actualizar el estado
}
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
