<template>
  <v-footer color="transparent" padless>
    <v-container fluid class="py-10 px-4 px-md-12">
      <v-row class="footer-row" align="start" justify="center">
        <!-- Logo y misión -->
        <v-col cols="12" md="3" class="mb-8 mb-md-0 d-flex flex-column align-center align-md-start">
          <div class="d-flex align-center mb-3">
            <v-img
              src="@/components/icons/logo_afroimpacto.png"
              alt="Logo Afro Impacto"
              width="54"
              height="54"
              class="mr-2"
              style="border-radius: 12px;"
            />
            <span class="font-weight-bold" style="color:white; font-size: 1.5rem; letter-spacing: 1px;">
              Afro Impacto
            </span>
          </div>
          <div style="color:#4ec7a5; font-size:1.05rem; line-height:1.5; max-width:260px;">
            Empoderando comunidades afro a través de proyectos, voluntariado y alianzas.
          </div>
        </v-col>

        <!-- Enlaces rápidos -->
        <v-col cols="6" md="2" class="mb-6 mb-md-0">
          <h4 class="footer-title" style="color:white;">Enlaces</h4>
          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item link class="footer-link">Inicio</v-list-item>
            <v-list-item link class="footer-link">Proyecto</v-list-item>
            <v-list-item link class="footer-link">Voluntariado</v-list-item>
            <v-list-item link class="footer-link">Contacto</v-list-item>
          </v-list>
        </v-col>

        <!-- Contacto -->
        <v-col cols="6" md="3" class="mb-6 mb-md-0">
          <h4 class="footer-title" style="color:white;">Contacto</h4>
          <div class="footer-contact">
            <v-icon left color="#4ec7a5" size="22">mdi-email-outline</v-icon>
            <a href="mailto:contacto@afroimpacto.org">contacto@afroimpacto.org</a>
          </div>
          <div class="footer-contact">
            <v-icon left color="#4ec7a5" size="22">mdi-phone-outline</v-icon>
            +57 1234567890
          </div>
          <div class="footer-contact">
            <v-icon left color="#4ec7a5" size="22">mdi-map-marker</v-icon>
            Colombia, Latinoamérica
          </div>
        </v-col>

        <!-- Redes y suscripción -->
        <v-col cols="12" md="4" class="d-flex flex-column align-center align-md-end">
          <div class="d-flex align-center mb-4">
            <v-btn icon class="footer-social" href="#" aria-label="Facebook">
              <v-icon size="28">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon class="footer-social" href="#" aria-label="Twitter">
              <v-icon size="28">mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon class="footer-social" href="#" aria-label="Instagram">
              <v-icon size="28">mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon class="footer-social" href="#" aria-label="LinkedIn">
              <v-icon size="28">mdi-linkedin</v-icon>
            </v-btn>
          </div>
          <div class="footer-subscribe-card pa-4 mb-4">
            <div class="font-weight-bold mb-2" style="color:#1a3a2a; font-size:1.1rem;">
              ¿Quieres recibir novedades?
            </div>
            <v-form @submit.prevent="suscribir" class="d-flex flex-row align-center">
              <v-text-field
                v-model="email"
                placeholder="Tu correo electrónico"
                dense
                hide-details
                variant="solo"
                class="footer-input"
                style="background: #fff; border-radius: 8px; max-width: 200px;"
              />
              <v-btn class="suscribete-b ml-2" type="submit">
                Suscribirse
              </v-btn>
            </v-form>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-6" color="#4ec7a5"></v-divider>
      <div class="text-center" style="color:white; font-size: 0.97rem;">
        © {{ new Date().getFullYear() }} Afro Impacto. Todos los derechos reservados.
      </div>
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
.footer-row {
  row-gap: 32px;
}
.footer-title {
  color: #1a3a2a;
  font-weight: 700;
  font-size: 1.15rem;
  margin-bottom: 18px;
  letter-spacing: 1px;
}
.footer-link {
  color: #ffffff !important;
  font-size: 1rem;
  padding-left: 0 !important;
  transition: color 0.2s;
}
.footer-link:hover {
  color: #4ec7a5 !important;
  text-decoration: underline;
}
.footer-contact {
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.footer-social {
  color: #4ec7a5 !important;
  margin-right: 10px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 8px #c6f1df;
}
.footer-social:hover {
  background: #4ec7a5 !important;
  color: #fff !important;
  box-shadow: 0 4px 16px #4ec7a5 !important;
}
.footer-subscribe-card {
  background-color: #4ec7a5;
  border-radius: 10px;
  box-shadow: 0 4px 24px 0 rgba(76,199,165,0.10);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.suscribete-b {
  background-color: #4ec7a5 !important;
  color: #fff !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 16px #4ec7a5 !important;
  text-transform: none;
  font-weight: bold;
  min-width: 110px;
  min-height: 38px;
  font-size: 1rem;
}
.suscribete-b:hover {
  background-color: #ffffff !important;
  color: #4ec7a5 !important;
  box-shadow: 0 0px 5px #ffffff !important;
}
.footer-input input {
  color: #1a3a2a !important;
}
@media (max-width: 960px) {
  .footer-row {
    row-gap: 16px;
  }
  .footer-subscribe-card {
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
  }
}
</style>
