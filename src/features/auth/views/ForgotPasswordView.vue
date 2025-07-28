<template>
  <AuthLayout>
    <template #form>
      <div class="form-wrapper pa-4" style="width: 100%; max-width: 450px;" v-bind:class="{ 'fade-in': true }">
        <div class="text-center mb-10">
          <v-img src="/src/assets/images/logo_afroimpacto.png" max-height="150" contain class="mx-auto"></v-img>
          <h1 class="text-h4 font-weight-bold text-title-color">Recuperar Contraseña</h1>
          <p class="text-body-1 text-subtitle-color mt-2">Ingresa tu correo y te enviaremos un enlace para recuperarla.</p>
        </div>

        <v-form ref="forgotPasswordForm" @submit.prevent="handleForgotPassword">
          <div class="field-group mb-8">
            <label class="text-subtitle-2 font-weight-medium text-subtitle-color">Correo Electrónico</label>
            <v-text-field
              v-model="email"
              placeholder="correo electronico"
              type="email"
              variant="plain"
              density="comfortable"
              :rules="emailRules"
              required
            />
          </div>

          <v-btn
            type="submit"
            block
            :loading="loading"
            color="primary"
            class="auth-btn rounded-lg font-weight-bold text-subtitle-1 py-3"
            min-height="50"
          >
            Enviar Enlace
          </v-btn>
        </v-form>

        <div class="mt-8 text-center text-body-2">
          <router-link to="/login" class="text-primary font-weight-bold text-decoration-none">Volver a Iniciar Sesión</router-link>
        </div>
      </div>
    </template>
    <template #info>
      <InfoCarousel />
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import InfoCarousel from '@/features/auth/components/InfoCarousel.vue';

const router = useRouter();

const email = ref('');
const loading = ref(false);
const forgotPasswordForm = ref(null);

const emailRules = [
  v => !!v || 'El correo es requerido',
  v => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
];

const handleForgotPassword = async () => {
  const { valid } = await forgotPasswordForm.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Enviando enlace de recuperación a...', email.value);
    router.push('/login'); // Idealmente, a una página de confirmación
  } catch (error) {
    console.error(error);
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
  color: #a0a0a0 !important; /* Iconos gris más claro */
  transition: color 0.3s ease; /* Transición suave para el color del icono */
}

/* Reposicionar el icono del ojo */
:deep(.v-text-field .v-field__append-inner) {
  align-self: center; /* Centrar verticalmente */
  margin-top: 0 !important; /* Eliminar cualquier margen superior por defecto */
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
