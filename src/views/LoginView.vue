<template>
  <div class="login-page">
    <div class="login-form-container">
      <v-card
        elevation="2"
        class="pa-8"
        style="border-radius: 16px; min-width: 340px; max-width: 400px; width: 100%;"
      >
        <div class="text-left mb-4">
          <v-btn
            icon
            variant="text"
            size="small"
            color="grey-darken-2"
            @click="$router.push('/')"
            aria-label="Volver a la página de inicio"
            class="back-btn"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </div>

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
          <router-link to="/forgot-password" style="color:#4ec7a5; font-size:15px;">¿Olvidaste tu contraseña?</router-link>
        </div>
        <div class="mt-2 text-center" style="font-size:15px;">
          ¿No tienes cuenta?
          <router-link to="/register" style="color:#4ec7a5; font-weight:bold;">Regístrate aquí</router-link>
        </div>
      </v-card>
    </div>
    <div class="login-bg d-none d-md-flex">
      <v-img
        src="/src/components/icons/background_login.png"
        alt="Imagen de fondo"
        cover
        height="100vh"
        width="100%"
        style="box-shadow: 0 0px 9px rgba(119, 45, 0, 0.5)"
      />
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
  flex: 3; /* El fondo ocupa más espacio */
  min-width: 0;
  min-height: 100vh;
  background: #eafaf5;
}
.login-form-container {
  flex: 1; /* El formulario ocupa menos espacio pero tiene ancho fijo */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding-right: 20px;
  padding-left: 20px;
}
.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
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