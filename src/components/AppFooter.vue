<template>
  <v-footer color="#c6f1df" padless>
    <v-container fluid class="py-6">
      <v-row>
        <v-col cols="12" md="3">
          <h4 class="font-weight-bold mb-2">Enlaces rápidos</h4>
          <v-list density="compact" class="bg-transparent">
            <v-list-item link>Inicio</v-list-item>
            <v-list-item link>Proyecto</v-list-item>
            <v-list-item link>Voluntariado</v-list-item>
            <v-list-item link>Contacto</v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="3">
          <h4 class="font-weight-bold mb-2">Contáctenos</h4>
          <p class="mb-1">Correo: <a href="mailto:contacto@afroimpacto.org">contacto@afroimpacto.org</a></p>
          <p>Teléfono: +57 1234567890</p>
        </v-col>
        <v-col cols="12" md="3">
          <h4 class="font-weight-bold mb-2">Síguenos</h4>
          <v-btn icon variant="text" class="mr-2"><v-icon>mdi-facebook</v-icon></v-btn>
          <v-btn icon variant="text" class="mr-2"><v-icon>mdi-twitter</v-icon></v-btn>
          <v-btn icon variant="text"><v-icon>mdi-instagram</v-icon></v-btn>
        </v-col>
        <v-col cols="12" md="3">
          <h4 class="font-weight-bold mb-2">Suscríbete</h4>
          <v-form @submit.prevent="suscribir">
            <v-text-field
              v-model="email"
              label="Tu correo electrónico"
              dense
              hide-details
              variant="outlined"
              class="mb-2"
            />
            <v-btn class="suscribete-b" color="success" rounded type="submit" block>Suscribirse</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return { email: '' }
  },
  methods: {
    suscribir() { this.email = '' }
  }
}
</script>

<style scoped>
.suscribete-b:hover {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  box-shadow: 0 4px 10px #000000 !important;
}

.suscribete-b {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  text-transform: none;
}
</style>

