<template>
  <v-footer class="app-footer py-8 py-md-12">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="4" class="text-center text-md-left mb-8 mb-md-0">
          <h3 class="footer-slogan text-h6 text-md-h5 font-weight-bold mb-4">
            Empoderando comunidades afro a través de proyectos, voluntariado y alianzas.
          </h3>
          <div class="contact-info">
            <div class="d-flex align-center justify-center justify-md-start mb-3 text-medium-contrast">
              <v-icon size="24" color="primary" class="mr-3">mdi-email-outline</v-icon>
              <a href="mailto:contacto@afroimpacto.org" class="contact-link">contacto@afroimpacto.org</a>
            </div>
            <div class="d-flex align-center justify-center justify-md-start mb-3 text-medium-contrast">
              <v-icon size="24" color="primary" class="mr-3">mdi-phone-outline</v-icon>
              <a href="tel:+573001234567" class="contact-link">+57 300 123 4567</a>
            </div>
            <div class="d-flex align-center justify-center justify-md-start text-medium-contrast">
              <v-icon size="24" color="primary" class="mr-3">mdi-map-marker-outline</v-icon>
              <a href="https://www.google.com/maps/search/Monter%C3%ADa,+C%C3%B3rdoba,+Colombia" target="_blank" class="contact-link">Montería, Córdoba, Colombia</a>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="3" class="text-center text-md-left mb-8 mb-md-0">
          <h4 class="footer-heading text-h6 font-weight-bold mb-5">Enlaces Rápidos</h4>
          <ul class="list-unstyled">
            <li><a @click="scrollToSection('about-us')" class="footer-link">Sobre Nosotros</a></li>
            <li><a @click="scrollToSection('our-projects')" class="footer-link">Nuestros Proyectos</a></li>
            <li><a @click="scrollToSection('get-involved')" class="footer-link">Hazte Voluntario</a></li>
            <li><a @click="scrollToSection('get-involved')" class="footer-link">Donar</a></li>
            <li><a @click="scrollToSection('news-updates')" class="footer-link">Noticias</a></li>
          </ul>
        </v-col>

        <v-col cols="12" md="4" class="text-center text-md-right">
          <h4 class="footer-heading text-h6 font-weight-bold mb-5">Mantente Conectado</h4>
          <p class="text-body-2 text-medium-contrast mb-4">
            Suscríbete a nuestro boletín para recibir las últimas novedades y oportunidades.
          </p>
          <div class="newsletter-form d-flex flex-column flex-md-row align-center justify-center justify-md-end mb-6">
            <v-text-field
              label="Tu email"
              variant="solo-filled"
              density="comfortable"
              flat
              hide-details
              class="email-input rounded-lg"
              bg-color="#f5f5f5" 
              color="primary"
              base-color="#a0a0a0"
              :rules="[rules.required, rules.email]"
              v-model="email"
            ></v-text-field>
            <v-btn
              class="subscribe-btn footer-action-btn font-weight-bold ml-md-3 mt-3 mt-md-0"
              flat
              rounded="lg"
              @click="subscribe"
              :loading="loading"
              :disabled="loading"
            >
              Suscribirse
              <v-icon size="20" class="ml-2">mdi-send</v-icon>
            </v-btn>
          </div>
          <div class="social-icons">
            <v-btn icon class="social-icon-btn mx-2" href="https://www.facebook.com/AfroImpacto" target="_blank" size="small">
              <v-icon size="24">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon class="social-icon-btn mx-2" href="https://www.twitter.com/AfroImpacto" target="_blank" size="small">
              <v-icon size="24">mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon class="social-icon-btn mx-2" href="https://www.instagram.com/AfroImpacto" target="_blank" size="small">
              <v-icon size="24">mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon class="social-icon-btn mx-2" href="https://www.linkedin.com/company/AfroImpacto" target="_blank" size="small">
              <v-icon size="24">mdi-linkedin</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-8" color="rgba(0,0,0,0.1)"></v-divider>

      <v-row>
        <v-col cols="12" class="text-center text-body-2 text-medium-contrast">
          &copy; {{ new Date().getFullYear() }} Afro Impacto. Todos los derechos reservados.
        </v-col>
      </v-row>

      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        bottom
        right
      >
        {{ snackbar.message }}
        <template v-slot:actions>
          <v-btn
            text
            @click="snackbar.show = false"
            class="text-white"
          >
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      email: '',
      loading: false,
      rules: {
        required: value => !!value || 'El email es requerido.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Email inválido.';
        },
      },
      snackbar: {
        show: false,
        message: '',
        color: '', // 'success', 'error', 'warning', 'info'
        timeout: 3000,
      },
    };
  },
  methods: {
    scrollToSection(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    showSnackbar(message, color = 'info', timeout = 3000) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.timeout = timeout;
      this.snackbar.show = true;
    },
    async subscribe() {
      // Usamos el validador interno de v-text-field
      const emailValid = this.rules.required(this.email) === true && this.rules.email(this.email) === true;

      if (!emailValid) {
        this.showSnackbar('Por favor, introduce un email válido.', 'warning');
        return;
      }

      this.loading = true;
      try {
        // Simular una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.showSnackbar(`¡Gracias por suscribirte con ${this.email}!`, 'success');
        this.email = ''; // Limpiar el campo
      } catch (error) {
        console.error('Error al suscribirse:', error);
        this.showSnackbar('Hubo un error al intentar suscribirte. Inténtalo de nuevo.', 'error');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Colores de la paleta (referencia):
    primary: #18b97e (Verde principal)
    secondary: #4EC7A5 (Verde secundario, más claro)
    accent: #3f51b5 (Azul para acentos)
*/

.app-footer {
  background: linear-gradient(to top, #ffffff 20%, #fcfae9 100%);
  color: #333;
  border-top: 1px solid rgb(228, 228, 228);
  padding-top: 64px; /* Espacio superior para el contenido */
  padding-bottom: 64px; /* Espacio inferior para el contenido */
}

/* Estilos de Tipografía */
.footer-slogan {
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 24px;
}

.footer-heading {
  color: #18b97e;
  margin-bottom: 20px;
}

.text-high-contrast {
  color: #2c3e50 !important;
}

.text-medium-contrast {
  color: #555 !important;
}

/* Información de Contacto */
.contact-info .v-icon {
  color: var(--v-theme-primary) !important;
}

.contact-link {
  color: #555 !important;
  text-decoration: none; /* Eliminar subrayado por defecto */
  font-weight: 400;
  transition: color 0.2s ease-in-out, transform 0.2s ease-out;
  display: inline-block; /* Para transform */
}

.contact-link:hover {
  background-color: transparent; /* Fondo sutil al pasar el ratón */
  border-radius: 5px;
  color: var(--v-theme-primary) !important; /* Verde principal al pasar el ratón */
  text-decoration: underline; /* Subrayar en hover */
  transform: translateX(3px);
  font-weight: 500;
}


/* Enlaces Rápidos */
.list-unstyled {
  list-style: none;
  padding: 0;
}

.list-unstyled li {
  margin-bottom: 12px;
}

.footer-link {
  color: #555 !important;
  text-decoration: none;
  font-weight: 400;
  transition: color 0.2s ease-in-out, transform 0.2s ease-out;
  display: inline-block;
  cursor: pointer;
}

.footer-link:hover {
  background-color: transparent;
  color: var(--v-theme-primary) !important;
  transform: translateX(5px);
  font-weight: 600;
  text-decoration: underline; /* Subrayar en hover */
  transition: color 0.2s ease-in-out, transform 0.2s ease-out, text-decoration 0.2s ease-in-out;
}

/* Formulario de Newsletter */
.newsletter-form {
  gap: 15px; /* Aumentar el gap para que el input no se vea tan pegado al botón */
}

.email-input {
  max-width: 300px;
  flex-grow: 1;
}

/* Claridad del Input de Email */
.email-input :deep(.v-field__input) {
  color: #333 !important; /* Color de texto del input en oscuro */
  font-size: 0.95rem;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  background-color: #f5f5f5; /* Fondo del input para mejor contraste */
}

.email-input :deep(.v-field__outline) {
  display: none !important;
}

.email-input :deep(.v-field) {
  border-radius: 8px !important;
  box-shadow: none !important;
  background-color: #f5f5f5; /* Asegura el fondo del campo completo */
}

.email-input :deep(.v-label) {
  color: #777 !important; /* Color de la etiqueta más oscuro */
}

.email-input :deep(.v-label--active) {
  color: #333 !important; /* Color de la etiqueta cuando está activa/enfocada */
}

.footer-action-btn {
  background-color: #4ec7a5 !important; /* Verde secundario más claro */
  color: #fff !important;
  border-radius: 12px !important;
  min-width: 120px;
  min-height: 44px;
  font-size: 1.05rem !important;
  font-weight: bold;
  text-transform: none !important;
  box-shadow: 0 4px 10px rgba(78, 199, 165, 0.4) !important;
  letter-spacing: 0.5px;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.footer-action-btn:hover {
  background: #fff !important; /* Fondo blanco en hover */
  color: #4ec7a5 !important; /* Texto verde en hover */
  box-shadow: 0 6px 14px rgba(78, 199, 165, 0.6) !important;
  transform: translateY(-2px); /* Pequeño lift en hover */
}


/* Íconos Sociales */
.social-icons .social-icon-btn {
  background-color: #4ec7a5 !important;
  color: white !important; /* Usar el verde secundario para los íconos por defecto */
  border-radius: 50%;
  transition: all 0.3s ease;
  width: 40px !important;
  height: 40px !important;
}

.social-icons .social-icon-btn:hover {
  background-color: white !important;
  color: #4ec7a5 !important;
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
}

/* Responsive Adjustments */
@media (max-width: 959px) { /* md breakpoint y abajo */
  .footer-slogan {
    font-size: 1.25rem !important;
  }
  .footer-heading {
    font-size: 1.25rem !important;
  }
  .contact-info .d-flex,
  .list-unstyled li,
  .newsletter-form {
    justify-content: center !important;
  }
  .newsletter-form {
    flex-direction: column;
    width: 80%;
    margin: 0 auto 24px auto;
  }
  .email-input {
    max-width: 100%;
  }
  .footer-action-btn { /* Aplica a Suscribirse */
    width: 100%;
    margin-left: 0 !important;
    margin-top: 15px !important;
  }
  .social-icons .social-icon-btn {
    margin: 0 8px !important;
  }
}

@media (max-width: 599px) { /* sm breakpoint (incluye xs) */
  .app-footer {
    padding-top: 48px;
    padding-bottom: 48px;
  }
  .footer-slogan {
    font-size: 1.1rem !important;
    margin-bottom: 16px;
  }
  .footer-heading {
    font-size: 1.1rem !important;
    margin-bottom: 16px;
  }
  .contact-info .d-flex,
  .list-unstyled li {
    font-size: 0.9rem !important;
  }
  .email-input :deep(.v-field__input),
  .email-input :deep(.v-label) {
    font-size: 0.85rem !important;
  }
}
</style>