<template>
  <div class="register-page">
    <div class="register-form-container">
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
          <span class="font-weight-bold" style="font-size:24px;">Crear una Cuenta</span>
        </div>
        <v-form ref="registerForm" @submit.prevent="handleRegister">
          <v-text-field
            v-model="registerUser"
            label="Nombre de Usuario"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :rules="[v => !!v || 'El nombre de usuario es requerido']"
            required
            style="font-size:16px;"
          />
          <v-text-field
            v-model="registerEmail"
            label="Correo Electrónico"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :rules="emailRules"
            required
            style="font-size:16px;"
          />
          <v-text-field
            v-model="registerPassword"
            label="Contraseña"
            type="password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            density="comfortable"
            class="mb-0"
            :rules="passwordRules"
            required
            style="font-size:16px;"
          />
          <v-progress-linear
            :model-value="passwordStrength.value"
            :color="passwordStrength.color"
            height="5"
            class="mt-2 mb-4"
            rounded
          ></v-progress-linear>
          <p v-if="registerPassword.length > 0 && passwordStrength.message"
             :class="['text-caption', `text-${passwordStrength.color}`, 'mb-4']">
            {{ passwordStrength.message }}
          </p>

          <v-text-field
            v-model="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            prepend-inner-icon="mdi-lock-check-outline"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="[v => v === registerPassword || 'Las contraseñas no coinciden']"
            required
            style="font-size:16px;"
          />

          <v-radio-group
            v-model="registerRole"
            label="Tipo de Cuenta"
            inline
            color="primary"
            class="mb-3"
            hide-details
            :rules="[v => !!v || 'Debes seleccionar un tipo de cuenta']"
            required
          >
            <v-radio value="voluntario" label="Voluntario" class="mr-4" prepend-icon="mdi-account-group-outline"></v-radio>
            <v-radio value="organizacion" label="Organización" prepend-icon="mdi-domain"></v-radio>
          </v-radio-group>
          <p v-if="registerRoleError" class="text-caption text-error mb-4">{{ registerRoleError }}</p>

          <v-checkbox
            v-model="acceptedTerms"
            color="#4ec7a5"
            hide-details
            class="mb-4"
            :rules="[v => !!v || 'Debes aceptar los términos y condiciones']"
            required
          >
            <template v-slot:label>
              <span style="font-size:15px;">Acepto los <router-link to="/terms" style="color:#4ec7a5;">términos y condiciones</router-link></span>
            </template>
          </v-checkbox>

          <v-btn
            type="submit"
            block
            depressed
            :loading="loading"
            style="background-color: #4ec7a5; color: #fff; border-radius: 8px; font-weight: bold; font-size: 18px; min-height: 44px;"
          >
            Registrarse
          </v-btn>
        </v-form>

        <div class="mt-4 text-center" style="font-size:15px;">
          ¿Ya tienes cuenta?
          <router-link to="/login" style="color:#4ec7a5; font-weight:bold;">Inicia Sesión</router-link>
        </div>
      </v-card>
    </div>
    <div class="register-bg d-none d-md-flex">
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
      location="top right"
      top
      right
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      registerUser: '',
      registerEmail: '',
      registerPassword: '',
      confirmPassword: '',
      registerRole: '',
      acceptedTerms: false,
      registerRoleError: '',
      loading: false,
      emailRules: [
        v => !!v || 'El correo electrónico es requerido',
        v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido',
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => v.length >= 8 || 'Mínimo 8 caracteres',
        v => /[A-Z]/.test(v) || 'Debe contener mayúsculas',
        v => /[a-z]/.test(v) || 'Debe contener minúsculas',
        v => /[0-9]/.test(v) || 'Debe contener números',
        v => /[^A-Za-z0-9]/.test(v) || 'Debe contener símbolos (ej. !@#$)',
      ],
      snackbar: {
        show: false,
        message: '',
        color: '',
        timeout: 3000,
      },
    };
  },
  computed: {
    passwordStrength() {
      const password = this.registerPassword;
      let score = 0;
      let message = '';
      let color = 'error';

      if (!password) {
        return { value: 0, color: 'grey', message: '' };
      }

      // Longitud
      if (password.length >= 8) score += 20;
      if (password.length >= 12) score += 20;

      // Combinaciones de caracteres
      if (/[A-Z]/.test(password)) score += 15; // Mayúsculas
      if (/[a-z]/.test(password)) score += 15; // Minúsculas
      if (/[0-9]/.test(password)) score += 15; // Números
      if (/[^A-Za-z0-9]/.test(password)) score += 15; // Símbolos

      // Limitar el score a 100
      score = Math.min(score, 100);

      if (score < 40) {
        color = 'error';
        message = 'Contraseña débil. Intenta combinar mayúsculas, minúsculas, números y símbolos.';
      } else if (score < 70) {
        color = 'warning';
        message = 'Contraseña moderada. ¡Puedes hacerla más fuerte!';
      } else {
        color = 'success';
        message = 'Contraseña fuerte. ¡Bien hecho!';
      }

      return { value: score, color, message };
    },
  },
  mounted() {
    if (this.$route.query.role) {
      this.registerRole = this.$route.query.role;
    }
  },
  methods: {
    async handleRegister() {
      // Validar el formulario usando la referencia del ref
      const { valid } = await this.$refs.registerForm.validate();

      if (!valid) {
        this.registerRoleError = !this.registerRole ? 'Debes seleccionar un tipo de cuenta' : '';
        this.showSnackbar('Por favor, completa todos los campos requeridos y asegúrate de que la contraseña sea segura.', 'error');
        return; // Detener el proceso si la validación falla
      }

      // Asegurarse de que la contraseña sea considerada "fuerte" o al menos "moderada"
      // antes de permitir el registro, o ajustar el mensaje de error.
      if (this.passwordStrength.value < 70) { // Por ejemplo, exigimos al menos una contraseña moderada
        this.showSnackbar('Tu contraseña no es lo suficientemente fuerte. Por favor, mejórala.', 'warning');
        return;
      }


      this.registerRoleError = ''; // Limpiar errores si todo está bien

      this.loading = true;
      try {
        // Simulación de una llamada a la API de registro
        // Aquí iría tu lógica real de API, por ejemplo:
        // await api.registerUser({
        //   username: this.registerUser,
        //   email: this.registerEmail,
        //   password: this.registerPassword,
        //   role: this.registerRole
        // });

        this.showSnackbar('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
        setTimeout(() => {
          this.$router.push('/login'); // Redirige al login después de un registro exitoso y que el snackbar sea visible por un momento
        }, this.snackbar.timeout); // Espera el tiempo del snackbar antes de redirigir

      } catch (error) {
        console.error('Error durante el registro:', error);
        // Puedes personalizar el mensaje de error según el tipo de error recibido de la API
        this.showSnackbar('Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.', 'error');
      } finally {
        this.loading = false;
      }
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
}
.register-bg {
  flex: 3;
  min-width: 0;
  min-height: 100vh;
  background: #eafaf5;
}
.register-form-container {
  flex: 1;
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
  .register-page {
    flex-direction: column;
  }
  .register-bg {
    display: none !important;
  }
  .register-form-container {
    justify-content: center;
    padding-right: 0;
    padding-left: 0;
  }
}
</style>