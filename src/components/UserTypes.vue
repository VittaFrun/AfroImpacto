<template>
  <v-container fluid class="py-12">
    <v-row align="stretch" justify="center">
      <!-- Voluntariado -->
      <v-col cols="12" md="5" class="d-flex">
        <v-card
          class="pa-8 w-100"
          elevation="2"
          style="background: #eafaf5; border-radius: 16px; min-height: 330px;"
        >
          <div class="d-flex flex-column align-center">
            <v-icon size="48" color="#4ec7a5" class="mb-4">mdi-handshake</v-icon>
            <div class="font-weight-bold mb-2" style="font-size: 1.4rem; color: #222;">Voluntariado</div>
            <div class="text-center mb-5" style="color: #5b5b5b; font-size: 1.07rem;">
              Únete a nuestra comunidad de voluntarios y ayuda a empoderar comunidades afro.<br>
              <span style="color:#4ec7a5; font-weight:600;">¿Qué puedes hacer?</span><br>
              Participa en proyectos educativos, talleres, mentorías y actividades de impacto social.<br>
              <span style="color:#4ec7a5; font-weight:600;">¿Qué obtienes?</span><br>
              Crecimiento personal, formación, nuevas amistades y la satisfacción de transformar vidas.
            </div>
            <v-btn
              block
              depressed
              class="user-btn"
              style="font-weight: bold; font-size: 1rem;"
            >
              Regístrate como voluntario
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Divider vertical -->
      <v-col cols="0" md="1" class="d-none d-md-flex justify-center align-center">
        <v-divider vertical style="height: 85%; border-color: #c6f1df; width:2px;"></v-divider>
      </v-col>

      <!-- Organización -->
      <v-col cols="12" md="5" class="d-flex">
        <v-card
          class="pa-8 w-100"
          elevation="2"
          style="background: #eafaf5; border-radius: 16px; min-height: 330px;"
        >
          <div class="d-flex flex-column align-center">
            <v-icon size="48" color="#4ec7a5" class="mb-4">mdi-domain</v-icon>
            <div class="font-weight-bold mb-2" style="font-size: 1.4rem; color: #222;">Organización</div>
            <div class="text-center mb-5" style="color: #5b5b5b; font-size: 1.07rem;">
              Colabora con nosotros para impulsar el desarrollo sostenible en comunidades afro.<br>
              <span style="color:#4ec7a5; font-weight:600;">¿Cómo puedes participar?</span><br>
              Presenta proyectos, accede a voluntarios, comparte recursos y fortalece tu red.<br>
              <span style="color:#4ec7a5; font-weight:600;">¿Beneficios?</span><br>
              Visibilidad, alianzas, acceso a talento y apoyo para lograr mayor impacto social.
            </div>
            <v-btn
              block
              depressed
              class="user-btn"
              style="font-weight: bold; font-size: 1rem;"
            >
              Regístrate como organización
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'UserTypes'
}
</script>

<style scoped>

.user-btn:hover {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  box-shadow: 0 4px 10px #4ec7a5 !important;
}
.user-btn {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  text-transform: none;
  margin-top: 12px;
}
</style>
