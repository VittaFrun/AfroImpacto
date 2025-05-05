<template>
  <div class="login-page">
    <!-- Imagen de fondo a la izquierda (solo en desktop) -->
    <div class="login-bg d-none d-md-flex">
      <v-img
        src="/src/components/icons/background_login.png"
        alt="Imagen de fondo"
        cover
        height="100vh"
        width="100%"
      />
    </div>
    <!-- Formulario a la derecha -->
    <div class="login-form-container">
      <v-card
        elevation="2"
        class="pa-8"
        style="border-radius: 16px; min-width: 340px; max-width: 400px; width: 100%;"
      >
        <div class="text-center mb-6">
          <span style="color:#4ec7a5; font-size:32px; font-weight:bold;">Afro Impacto</span>
        </div>
        <div class="text-center mb-4">
          <span class="font-weight-bold" style="font-size:24px;">Iniciar Sesión</span>
        </div>
        <v-form>
          <v-text-field
            label="Correo Electrónico"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            style="font-size:16px;"
          />
          <v-text-field
            label="Contraseña"
            type="password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            density="comfortable"
            class="mb-2"
            style="font-size:16px;"
          />
          <v-checkbox
            label="Recordarme"
            class="mb-4"
            color="#4ec7a5"
            hide-details
            style="font-size:15px;"
          />
          <v-btn
            block
            depressed
            style="background-color: #4ec7a5; color: #fff; border-radius: 8px; font-weight: bold; font-size: 18px; min-height: 44px;"
          >
            Iniciar sesión
          </v-btn>
        </v-form>
        <div class="mt-4 text-center">
          <a href="#" style="color:#4ec7a5; font-size:15px;">¿Olvidaste tu contraseña?</a>
        </div>
        <div class="mt-2 text-center" style="font-size:15px;">
          ¿No tienes cuenta?
          <a href="#" style="color:#4ec7a5; font-weight:bold;">Regístrate aquí</a>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView'
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
}
.login-bg {
  flex: 3; /* Cambiado de 1.5 a 3 para que ocupe el 75% */
  min-width: 0;
  min-height: 100vh;
  background: #eafaf5;
}
.login-form-container {
  flex: 1; /* Esto ahora representa el 25% */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center; /* Centrado en lugar de flex-end */
  background: #fff;
  padding-right: 20px; /* Reducido de 64px */
  padding-left: 20px;
}
@media (max-width: 960px) {
  .login-page {
    flex-direction: column;
  }
  .login-bg {
    display: none !important;
  }
  .login-form-container {
    justify-content: center;
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
