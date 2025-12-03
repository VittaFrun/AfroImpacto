<template>
  <v-card-text class="pa-6">
    <div class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-history</v-icon>
      <p class="text-body-1 text-grey mt-4">
        Historial de actividad próximamente
      </p>
      <p class="text-caption text-grey">
        Aquí se mostrará el historial de acciones y eventos recientes de la organización
      </p>
    </div>
  </v-card-text>
</template>

<script setup>
defineProps({
  organizationId: {
    type: Number,
    required: true
  }
});
</script>

