<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Mi Perfil de Voluntario</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Mantén tu información actualizada para que las organizaciones puedan conocerte mejor.
    </p>

    <v-card class="rounded-lg elevation-0">
      <v-tabs v-model="tab" bg-color="transparent" color="primary">
        <v-tab value="info">Información Personal</v-tab>
        <v-tab value="skills">Habilidades</v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <v-window v-model="tab">
        <v-window-item value="info">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="Nombre Completo" variant="outlined" v-model="profile.nombre"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Correo Electrónico" variant="outlined" v-model="profile.email" readonly disabled></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  label="Jornada Preferida"
                  :items="['Completa', 'Media Jornada', 'Flexible', 'Fines de Semana']"
                  variant="outlined"
                  v-model="profile.jornada"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  label="Estado Actual"
                  :items="['Activo', 'Inactivo']"
                  variant="outlined"
                  v-model="profile.estado"
                ></v-select>
              </v-col>
            </v-row>
            <v-btn color="primary" variant="flat">Guardar Información</v-btn>
          </v-card-text>
        </v-window-item>
        <v-window-item value="skills">
          <v-card-text class="pa-6">
            <v-row align="center">
              <v-col cols="12" md="5">
                <v-text-field label="Añadir nueva habilidad" variant="outlined" v-model="newSkill.name"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  label="Nivel"
                  :items="['Básico', 'Intermedio', 'Avanzado']"
                  variant="outlined"
                  v-model="newSkill.level"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn color="primary" block @click="addSkill">Añadir Habilidad</v-btn>
              </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <h3 class="text-h6 mb-4">Mis Habilidades</h3>
            <v-chip v-for="(skill, i) in profile.skills" :key="i" class="ma-2" closable @click:close="removeSkill(i)" color="primary" size="large">
              {{ skill.name }} ({{ skill.level }})
            </v-chip>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const tab = ref('info');

const profile = ref({
  nombre: 'Ana García',
  email: 'ana.garcia@email.com',
  jornada: 'Flexible',
  estado: 'Activo',
  skills: [
    { name: 'Diseño Gráfico', level: 'Avanzado' },
    { name: 'Marketing Digital', level: 'Intermedio' },
  ]
});

const newSkill = ref({ name: '', level: 'Básico' });

function addSkill() {
  if (newSkill.value.name) {
    profile.value.skills.push({ ...newSkill.value });
    newSkill.value = { name: '', level: 'Básico' };
  }
}

function removeSkill(index) {
  profile.value.skills.splice(index, 1);
}
</script>

<style scoped>
/* Estilos específicos si son necesarios */
</style>
