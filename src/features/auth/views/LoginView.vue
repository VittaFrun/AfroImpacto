<template>
  <AuthLayout>
    <template #form>
        <div class="form-wrapper pa-4" style="width: 100%; max-width: 450px;" v-bind:class="{ 'fade-in': true }">
        <div class="text-center mb-10">
          <v-img src="/src/assets/images/logo_afroimpacto.png" max-height="150" contain class="mx-auto"></v-img>
          <h1 class="text-h4 font-weight-bold text-title-color">Iniciar sesión</h1>
          <p class="text-body-1 text-subtitle-color mt-2">Inicia sesión para continuar.</p>
        </div>

        <v-form ref="loginForm" @submit.prevent="handleLogin">
          <div class="field-group mb-4">
            <label class="text-subtitle-2 font-weight-medium text-subtitle-color">Correo Electrónico</label>
            <v-text-field
              v-model="email"
              placeholder="Correo Electrónico"
              type="email"
              variant="plain"
              density="comfortable"
              :rules="emailRules"
              required
              class="transition-input"
            />
          </div>

          <div class="field-group mb-2">
            <label class="text-subtitle-2 font-weight-medium text-subtitle-color">Contraseña</label>
            <v-text-field
              v-model="password"
              placeholder="Ingresa tu contraseña"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="plain"
              density="comfortable"
              :rules="passwordRules"
              required
            />
          </div>

          <div class="d-flex justify-space-between align-center mb-8">
            <v-checkbox
              v-model="rememberMe"
                label="Recordarme"
                class="text-subtitle-color"
              color="primary"
              hide-details
            />
            <router-link to="/auth/forgot-password" class="text-body-2 text-primary font-weight-bold text-decoration-none">¿Olvidaste tu contraseña?</router-link>
          </div>

          <v-btn
            type="submit"
            block
            :loading="loading"
            color="primary"
            class="auth-btn rounded-lg font-weight-bold text-subtitle-1 py-3"
            min-height="50"
          >
            Iniciar Sesión
          </v-btn>
        </v-form>

        <div class="mt-8 text-center text-body-2">
          <span class="text-subtitle-color">¿No tienes cuenta?</span>
          <router-link to="/auth/register" class="text-primary font-weight-bold text-decoration-none ml-2">Regístrate aquí</router-link>
        </div>
      </div>
    </template>
    <template #info>
      <InfoCarousel />
    </template>
  </AuthLayout>

  <v-snackbar
    v-model="snackbar.show"
    :timeout="snackbar.timeout"
    :color="snackbar.color"
    location="bottom right"
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
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import InfoCarousel from '@/features/auth/components/InfoCarousel.vue';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ROUTES } from '@/constants/routes';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const loginForm = ref(null);

const snackbar = ref({
  show: false,
  message: '',
  color: 'error',
  timeout: 3000,
});

const emailRules = [
  v => !!v || 'El correo es requerido',
  v => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
];

const passwordRules = [
  v => !!v || 'La contraseña es requerida',
];

const handleLogin = async () => {
  const { valid } = await loginForm.value.validate();
  if (!valid) return;

  loading.value = true;
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (success) {
    // Espera a que Vue actualice las propiedades computadas como userRole
    await nextTick();
    
    if (authStore.userRole === 'organizacion') {
      router.push({ name: 'organization-dashboard' });
    } else if (authStore.userRole === 'voluntario') {
      router.push({ name: 'volunteer-dashboard' });
    } else {
      router.push(ROUTES.HOME); // Fallback por si no hay rol
    }
  } else {
    snackbar.value = {
      show: true,
      message: authStore.error || 'Email o contraseña incorrectos.',
      color: 'error',
      timeout: 3000,
    };
  }

  loading.value = false;
};
</script>

<style scoped>
.text-primary {
  color: #4ec7a5 !important;
}

:deep(.v-text-field .v-field) {
  border-radius: 12px !important;
  border: 1px solid #e4e4e4; /* Borde gris más claro por defecto */
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Transición suave para los cambios */
}

/* Ajustar el padding del input para centrar el texto */
:deep(.v-text-field .v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  padding-left: 12px !important; /* Ajustar padding izquierdo */
}

/* Estilos para los iconos dentro del campo de texto */
:deep(.v-text-field .v-icon) {
  color: #a0a0a0 !important; /* Iconos gris más claro */
  transition: color 0.3s ease; /* Transición suave para el color del icono */
}

/* Reposicionar el icono del ojo */
:deep(.v-text-field .v-field__append-inner) {
  align-self: center; /* Centrar verticalmente */
  padding-top: 1.2px;
  padding-right: 8px; /* Ajustar padding derecho */
}

/* Estado HOVER: Cuando el cursor pasa por encima del campo */
:deep(.v-text-field:hover .v-field) {
  border-color: #18b97e !important; /* Tonalidad verde al pasar el cursor */
  box-shadow: 0 0 5px #acffe0 !important; /* Sombra verde al pasar el cursor */
}

/* Estado ACTIVO/FOCUS: Cuando el campo está activo (seleccionado para escribir) */
:deep(.v-text-field .v-field--active) {
  border-color: #18b97e !important; /* Tonalidad verde al enfocar */
  box-shadow: 0 0 5px #acffe0 !important; /* Sombra verde al enfocar */
}

/* Estado ACTIVO/FOCUS para los iconos: Cambia el color del icono cuando el campo está enfocado */
:deep(.v-text-field .v-field--active .v-icon) {
  color: #707070 !important; /* Icono más oscuro al enfocar */
}

.auth-btn {
  color: #ffffff !important;
  transition: all 0.3s ease-in-out;
  letter-spacing: 0.5px;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 199, 165, 0.6);
}

.text-decoration-none {
  text-decoration: none;
  transition: text-decoration 0.3s ease, color 0.3s ease; /* Transición suave */
}

.text-decoration-none:hover {
  text-decoration: underline !important;
  color: #18b97e !important; /* Un color que combine con tu tema */
}

.text-title-color {
  color: #344767 !important;
}

.text-subtitle-color {
  color: #67748e !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>