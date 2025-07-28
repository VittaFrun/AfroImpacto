
<template>
  <AuthLayout>
    <template #form>
        <div class="form-wrapper pa-4" style="width: 100%; max-width: 450px;" v-bind:class="{ 'fade-in': true }">
        <div class="text-center mb-10">
          <v-img src="/src/assets/images/logo_afroimpacto.png" max-height="81" contain class="mx-auto"></v-img>
          <h1 class="text-h4 font-weight-bold text-title-color">Crea tu Cuenta</h1>
          <p class="text-body-1 text-subtitle-color mt-2">Únete y empieza a generar un cambio.</p>
        </div>

        <v-form ref="registerForm" @submit.prevent="handleRegister">
          <div class="field-group mb-1">
            <label class="text-subtitle-2 font-weight-bold text-subtitle-color">Nombre Completo</label>
            <v-text-field
              v-model="fullName"
              placeholder="Nombre Completo"
              variant="plain"
              density="comfortable"
              :rules="[v => !!v || 'El nombre es requerido']"
              required
              class="transition-input"
            />
          </div>

          <div class="field-group mb-1">
            <label class="text-subtitle-2 font-weight-bold text-subtitle-color">Correo Electrónico</label>
            <v-text-field
              v-model="registerEmail"
              placeholder="Correo Electrónico"
              type="email"
              variant="plain"
              density="comfortable"
              :rules="emailRules"
              required
              class="transition-input"
            />
          </div>

          <div class="field-group mb-1">
            <label class="text-subtitle-2 font-weight-bold text-subtitle-color">Contraseña</label>
            <v-text-field
              v-model="registerPassword"
              placeholder="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="plain"
              density="comfortable"
              :rules="passwordRules"
              required
            />
          </div>
          <v-progress-linear
            :model-value="passwordStrength.value"
            :color="passwordStrength.color"
            height="6"
            class="mt-0 mb-2 rounded-pill"
          ></v-progress-linear>
          <div class="text-caption text-subtitle-color text-right mb-6">
            {{ passwordStrength.text }}
          </div>

          <div class="field-group mb-6">
            <label class="text-subtitle-2 font-weight-bold text-subtitle-color">Quiero registrarme como:</label>
            <v-radio-group
              v-model="registerRole"
              inline
              class="mt-2"
              :rules="[v => !!v || 'Debes seleccionar un tipo de cuenta']"
              required
            >
              <v-radio value="voluntario" label="Voluntario" color="primary" >
                <template v-slot:label>
                  <span style="color: #67748e;">Voluntario</span>
                </template>
              </v-radio>
              <v-radio value="organizacion" color="primary">
                <template v-slot:label>
                  <span style="color: #67748e;">Organización</span>
                </template>
              </v-radio>
            </v-radio-group>
          </div>

          <v-checkbox
            v-model="acceptedTerms"
            color="primary"
            class="mb-4"
            :rules="[v => !!v || 'Debes aceptar los términos']"
            required
          >
            <template v-slot:label>
              <div class="text-body-2 text-subtitle-color">Acepto los <router-link to="/terms" class="text-primary font-weight-bold text-decoration-none">términos y condiciones</router-link></div>
            </template>
          </v-checkbox>

          <v-btn
            type="submit"
            block
            :loading="loading"
            color="primary"
            class="auth-btn rounded-lg font-weight-bold text-subtitle-1 py-3"
            min-height="50"
          >
            Crear Cuenta
          </v-btn>
        </v-form>

        <div class="mt-8 text-center text-body-2">
          <span class="text-subtitle-color">¿Ya tienes cuenta?</span>
          <router-link to="/login" class="text-primary font-weight-bold text-decoration-none ml-2">Inicia Sesión</router-link>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import InfoCarousel from '@/features/auth/components/InfoCarousel.vue';

const router = useRouter();

const fullName = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const showPassword = ref(false);
const registerRole = ref(null);
const acceptedTerms = ref(false);
const loading = ref(false);
const registerForm = ref(null);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000,
});

const emailRules = [
  v => !!v || 'El correo es requerido',
  v => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
];

const passwordRules = [
  v => !!v || 'La contraseña es requerida',
  v => v.length >= 8 || 'Mínimo 8 caracteres',
];

const passwordStrength = computed(() => {
  const password = registerPassword.value;
  let score = 0;
  let text = 'Muy Débil';

  if (!password) return { value: 0, color: 'grey', text: '' };

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const value = (score / 6) * 100;
  let color = 'error';

  if (value > 80) {
    color = 'success';
    text = 'Fuerte';
  } else if (value > 60) {
    color = 'info';
    text = 'Moderada';
  } else if (value > 30) {
    color = 'warning';
    text = 'Débil';
  } else {
    color = 'error';
    text = 'Muy Débil';
  }

  return { value, color, text };
});

const handleRegister = async () => {
  const { valid } = await registerForm.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Registrando...', {
      fullName: fullName.value,
      email: registerEmail.value,
      role: registerRole.value,
    });
    snackbar.value = {
      show: true,
      message: '¡Usuario creado con éxito!',
      color: 'success',
      timeout: 2000,
    };
    // Opcional: Redirigir después de un breve retraso para que el usuario vea el snackbar
    setTimeout(() => {
      router.push('/login');
    }, snackbar.value.timeout);
  } catch (error) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: 'Error al crear usuario.',
      color: 'error',
      timeout: 1000,
    };
  } finally {
    loading.value = false;
  }
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
  color: #bbbbbb !important; /* Iconos gris más claro */
  transition: color 0.3s ease; /* Transición suave para el color del icono */
}

/* Reposicionar el icono del ojo */
:deep(.v-text-field .v-field__append-inner) {
  align-self: center; /* Centrar verticalmente */
  padding-right: 10px; /* Ajustar padding derecho */
  padding-top: 1.2px;
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
  color: #ffffff !important; /* Letra blanca */
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

.v-progress-linear {
  transition: background-color 0.5s ease-in-out;
}

.text-title-color {
  color: #344767 !important;
}

.text-subtitle-color {
  color: #67748e !important;
  font-style: bold;
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
