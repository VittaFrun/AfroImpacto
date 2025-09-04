<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Configuración de la Cuenta</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Gestiona la seguridad y las preferencias de tu cuenta de voluntario.
    </p>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-6 rounded-lg elevation-0">
          <v-card-title class="text-h6 font-weight-bold">Cambiar Contraseña</v-card-title>
          <v-divider class="my-4"></v-divider>
          <v-form>
            <v-text-field
              label="Contraseña Actual"
              type="password"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-text-field
              label="Nueva Contraseña"
              type="password"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-text-field
              label="Confirmar Nueva Contraseña"
              type="password"
              variant="outlined"
              class="mb-4"
            ></v-text-field>
            <v-btn color="primary" variant="flat">Actualizar Contraseña</v-btn>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-6 rounded-lg elevation-0">
          <v-card-title class="text-h6 font-weight-bold">Notificaciones</v-card-title>
          <v-divider class="my-4"></v-divider>
          <v-switch
            v-model="notifications.newTasks"
            color="primary"
            label="Nuevas tareas asignadas"
            inset
          ></v-switch>
          <v-switch
            v-model="notifications.projectUpdates"
            color="primary"
            label="Actualizaciones de mis proyectos"
            inset
          ></v-switch>
          <v-switch
            v-model="notifications.newsletter"
            color="primary"
            label="Boletín de AfroImpacto"
            inset
          ></v-switch>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const notifications = ref({
  newTasks: true,
  projectUpdates: true,
  newsletter: false,
});
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
