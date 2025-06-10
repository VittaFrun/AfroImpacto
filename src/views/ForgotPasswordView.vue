<template>
  <div class="forgot-password-page">
    <div class="forgot-password-bg d-none d-md-flex">
      <v-img
        src="/src/components/icons/background_login.png"
        alt="Imagen de fondo"
        cover
        height="100vh"
        width="100%"
        style="box-shadow: 0 0px 9px rgba(119, 45, 0, 0.5)"
      />
    </div>
    <div class="forgot-password-form-container">
      <v-card
        elevation="2"
        class="pa-8"
        style="border-radius: 16px; min-width: 340px; max-width: 400px; width: 100%;"
      >
        <div class="text-center mb-6">
          <span style="color:#4ec7a5; font-size:32px; font-weight:bold;">Afro Impacto</span>
        </div>
        <div class="text-center mb-4">
          <span class="font-weight-bold" style="font-size:24px;">¿Olvidaste tu Contraseña?</span>
        </div>
        <p class="text-center mb-6 text-grey-darken-1" style="font-size:15px;">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <v-form @submit.prevent="handleForgotPassword">
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
            style="font-size:16px;"
          />
          <v-btn
            type="submit"
            block
            depressed
            :loading="loading"
            style="background-color: #4ec7a5; color: #fff; border-radius: 8px; font-weight: bold; font-size: 18px; min-height: 44px;"
          >
            Enviar enlace de recuperación
          </v-btn>
        </v-form>
        <div class="mt-4 text-center" style="font-size:15px;">
          <router-link to="/login" style="color:#4ec7a5; font-weight:bold;">Volver a Iniciar Sesión</router-link>
        </div>
      </v-card>
    </div>
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
    };
  },
  methods: {
    async handleForgotPassword() {
      this.loading = true;
      try {
        alert('Si tu correo está registrado, recibirás un enlace de recuperación.');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al enviar correo de recuperación:', error);
        alert('Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-page {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
}
.forgot-password-bg {
  flex: 3;
  min-width: 0;
  min-height: 100vh;
  background: #eafaf5;
}
.forgot-password-form-container {
  flex: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding-right: 20px;
  padding-left: 20px;
}
@media (max-width: 960px) {
  .forgot-password-page {
    flex-direction: column;
  }
  .forgot-password-bg {
    display: none !important;
  }
  .forgot-password-form-container {
    justify-content: center;
    padding-right: 0;
    padding-left: 0;
  }
}
</style>