<template>
  <div class="forgot-password-page d-flex flex-column flex-md-row">
    <div class="form-section d-flex align-center justify-center order-2 order-md-1 pa-4 pa-md-12">
      <v-card
        elevation="8"
        class="pa-8 pa-sm-12 rounded-xl forgot-password-card"
        max-width="450"
        width="100%"
      >
        <div class="text-center mb-6">
          <span class="app-title font-weight-bold">Afro Impacto</span>
        </div>
        <div class="text-center mb-4">
          <span class="form-title font-weight-bold">¿Olvidaste tu Contraseña?</span>
        </div>
        <p class="text-center mb-6 text-body-2 text-medium-contrast">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <v-form @submit.prevent="handleForgotPassword" ref="form">
          <v-text-field
            v-model="email"
            label="Correo Electrónico"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="emailRules"
            required
            color="primary"
          />
          <v-btn
            type="submit"
            block
            depressed
            :loading="loading"
            class="forgot-password-button"
            rounded="lg"
            size="large"
          >
            Enviar enlace de recuperación
          </v-btn>
        </v-form>

        <div class="mt-6 text-center">
          <router-link to="/login" class="back-to-login-link font-weight-bold">Volver a Iniciar Sesión</router-link>
        </div>
      </v-card>
    </div>

    <div class="image-section d-none d-md-flex align-center justify-center order-1 order-md-2">
      <v-img
        src="/src/components/icons/background_login.png"
        alt="Imagen de fondo"
        cover
        height="100vh"
        width="100%"
        style="box-shadow: 0 0px 9px rgba(119, 45, 0, 0.5)"
      />
    </div>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      bottom
      right
      elevation="6"
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
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      email: '',
      loading: false,
      emailRules: [
        v => !!v || 'El correo electrónico es requerido',
        v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido',
      ],
      snackbar: {
        show: false,
        message: '',
        color: '', // 'success', 'error', 'warning', 'info'
        timeout: 4000,
      },
    };
  },
  methods: {
    showSnackbar(message, color = 'info', timeout = 4000) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.timeout = timeout;
      this.snackbar.show = true;
    },
    async handleForgotPassword() {
      // Validar el formulario con Vuetify
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        this.showSnackbar('Por favor, corrige los errores en el formulario.', 'warning');
        return;
      }

      this.loading = true;
      try {
        // Simulación de una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Aquí iría la lógica real para enviar el correo de recuperación
        // Por ejemplo: await api.sendPasswordResetEmail(this.email);

        this.showSnackbar('Si tu correo está registrado, recibirás un enlace de recuperación en breve.', 'success');
        this.email = ''; // Limpiar el campo
        // Redirigir al login después de un breve delay para que el usuario lea el mensaje
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);
      } catch (error) {
        console.error('Error al enviar correo de recuperación:', error);
        // Puedes dar un mensaje más específico si el error viene de la API
        this.showSnackbar('Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.', 'error');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Contenedor principal de la página */
.forgot-password-page {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(to bottom, #f0f8ff 0%, #ffffff 100%); /* Degradado suave */
  display: flex;
}

/* Sección del formulario (izquierda en desktop) */
.form-section {
  flex: 1; /* El formulario ocupa menos espacio pero tiene ancho fijo */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding-right: 20px;
  padding-left: 20px;
}

.forgot-password-card {
  width: 100%;
  border-radius: 8px;
}

.app-title {
  color: #18b97e; /* Usar el color primary de tu paleta */
  font-size: 38px; /* Tamaño de fuente más grande */
  letter-spacing: -0.5px;
}

.form-title {
  color: #333; /* Color oscuro para el título del formulario */
  font-size: 28px; /* Ajuste de tamaño */
}

.text-medium-contrast {
  color: #666 !important; /* Un gris un poco más oscuro para mejor legibilidad */
}

/* Estilos para el campo de texto (v-text-field) */
.v-text-field :deep(.v-field__overlay) {
  background-color: transparent !important;
}

.v-text-field :deep(.v-input__control) {
  border-color: #e0e0e0 !important; /* Borde más claro */
}

.v-text-field :deep(.v-field__outline) {
  border-color: #e0e0e0 !important;
}

.v-text-field :deep(.v-field__outline__leading),
.v-text-field :deep(.v-field__outline__notch),
.v-text-field :deep(.v-field__outline__trailing) {
  border-color: #e0e0e0 !important;
}

.v-text-field.v-input--is-focused :deep(.v-field__outline) {
  border-color: #18b97e !important; /* Borde verde en foco */
}

.v-text-field :deep(.v-label) {
  color: #888 !important; /* Color del label por defecto */
}

.v-text-field.v-input--is-focused :deep(.v-label) {
  color: #18b97e !important; /* Color del label en foco */
}

.v-text-field .v-icon {
  color: #999 !important; /* Color del ícono por defecto */
}

.v-text-field.v-input--is-focused .v-icon {
  color: #18b97e !important; /* Color del ícono en foco */
}

/* Estilos para el botón */
.forgot-password-button {
  background-color: #4ec7a5 !important; /* Verde secundario más claro */
  color: #fff !important;
  font-weight: bold;
  font-size: 1.15rem; /* Tamaño de fuente más grande */
  min-height: 50px; /* Altura mínima */
  box-shadow: 0 4px 15px rgba(78, 199, 165, 0.4); /* Sombra más pronunciada */
  transition: all 0.3s ease;
}

.forgot-password-button:hover {
  background-color: #18b97e !important; /* Verde principal en hover */
  box-shadow: 0 6px 20px rgba(24, 185, 126, 0.5); /* Sombra más intensa en hover */
  transform: translateY(-2px); /* Pequeño levantamiento */
}

/* Estilo para el enlace "Volver a Iniciar Sesión" */
.back-to-login-link {
  color: #18b97e !important; /* Verde principal */
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-to-login-link:hover {
  text-decoration: underline;
  color: #0e8a5b !important; /* Un tono más oscuro de verde al pasar el ratón */
}

/* Sección de la imagen (derecha en desktop) */
.image-section {
  flex: 3; /* El fondo ocupa más espacio */
  min-width: 0;
  min-height: 100vh;
  background: #eafaf5;
}

.login-image-shadow {
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.1), 0 0 9px rgba(119, 45, 0, 0.2); /* Sombra suave para la imagen */
}

/* Media Queries para Responsividad */
@media (max-width: 959px) { /* Tablet y mobile */
  .forgot-password-page {
    flex-direction: column !important; /* Pila en columnas */
  }
  .form-section {
    order: 1 !important; /* Formulario arriba */
    flex: 1 1 auto; /* Ajuste automático */
    padding: 30px 20px; /* Menos padding */
  }
  .image-section {
    display: none !important; /* Oculta la imagen en mobile */
  }
  .forgot-password-card {
    max-width: 400px; /* Ajuste de ancho */
  }
  .app-title {
    font-size: 32px;
  }
  .form-title {
    font-size: 24px;
  }
}

@media (max-width: 599px) { /* Solo mobile */
  .forgot-password-card {
    border-radius: 12px;
    padding: 30px; /* Más compacto */
  }
  .app-title {
    font-size: 28px;
  }
  .form-title {
    font-size: 22px;
  }
}
</style>