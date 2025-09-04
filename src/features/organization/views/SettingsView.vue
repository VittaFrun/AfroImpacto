<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-4">Configuración</h1>
    <p class="text-body-1 text-grey-darken-1 mb-6">
      Ajusta la información de tu organización y las preferencias de tu cuenta.
    </p>

    <v-card class="rounded-lg elevation-0">
      <v-tabs v-model="tab" bg-color="transparent" color="primary">
        <v-tab value="profile">Perfil de la Organización</v-tab>
        <v-tab value="account">Cuenta</v-tab>
      </v-tabs>
      <v-divider></v-divider>
      <v-window v-model="tab">
        <v-window-item value="profile">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="Nombre de la Organización" variant="outlined" v-model="profile.nombre"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Tipo de Organización" variant="outlined" v-model="profile.tipo"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Sitio Web" variant="outlined" v-model="profile.sitio_web"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="País" variant="outlined" v-model="profile.pais"></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="Ciudad" variant="outlined" v-model="profile.ciudad"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="Áreas de Enfoque" variant="outlined" v-model="profile.areas_enfoque" rows="3"></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea label="Misión y Visión" variant="outlined" v-model="profile.mision_vision" rows="5"></v-textarea>
              </v-col>
            </v-row>
            <v-btn color="primary" variant="flat">Guardar Cambios del Perfil</v-btn>
          </v-card-text>
        </v-window-item>
        <v-window-item value="account">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="Correo Electrónico" type="email" variant="outlined" v-model="account.email"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Cambiar Contraseña" type="password" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="primary" variant="flat">Actualizar Cuenta</v-btn>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const tab = ref('profile');

const profile = ref({
  nombre: 'Fundación Semillas del Saber',
  tipo: 'ONG Educativa',
  sitio_web: 'https://semillasdelsaber.org',
  pais: 'Colombia',
  ciudad: 'Medellín',
  areas_enfoque: 'Educación, Tecnología, Desarrollo Comunitario',
  mision_vision: 'Nuestra misión es cerrar la brecha educativa en comunidades rurales a través de la tecnología y el voluntariado. Aspiramos a un futuro donde cada niño tenga acceso a una educación de calidad.'
});

const account = ref({
  email: 'contacto@semillasdelsaber.org'
});
</script>

<style scoped>
/* Puedes añadir estilos específicos si es necesario */
</style>
