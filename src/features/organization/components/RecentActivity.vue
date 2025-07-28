
<template>
  <v-card class="pa-4 rounded-lg h-100 elevation-0">
    <v-card-title class="text-h6 font-weight-bold">Actividad Reciente</v-card-title>
    <v-card-text>
      <v-list density="compact">
        <v-list-item v-for="(activity, i) in activities" :key="i">
          <template v-slot:prepend>
            <v-icon :color="activity.color" class="mr-3">{{ activity.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ activity.text }}</v-list-item-title>
          <v-list-item-subtitle>{{ activity.time }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="text" class="rounded-pill px-3 text-capitalize">Ver Todo el Registro</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  activities: {
    type: Array,
    required: true,
  },
});
</script>


