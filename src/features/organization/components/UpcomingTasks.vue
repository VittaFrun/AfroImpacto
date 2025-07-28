
<template>
  <v-card class="pa-4 rounded-lg h-100 elevation-0">
    <v-card-title class="text-h6 font-weight-bold">Próximos Hitos y Tareas</v-card-title>
    <v-card-text>
      <v-list lines="two">
        <v-list-item v-for="(task, i) in tasks" :key="i">
          <v-list-item-title class="font-weight-bold">{{ task.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ task.project }} - {{ task.dueDate }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-chip :color="task.statusColor" size="small">{{ task.status }}</v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="text" class="rounded-pill px-3 text-capitalize">Ver Calendario Completo</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});
</script>


