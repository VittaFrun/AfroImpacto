import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from '@/plugins/axios';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('user')));
  const token = ref(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.tipo_usuario || null);

  // Actions
  async function login(credentials) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post('/auth/login', credentials);
      const { access_token } = response.data;

      if (!access_token) {
        throw new Error("El token de acceso no se encontró en la respuesta del servidor.");
      }

      // Decodificar el JWT para obtener los datos del usuario
      const base64Url = access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const userData = JSON.parse(jsonPayload);

      // Almacenar el token y los datos del usuario decodificados
      token.value = access_token;
      user.value = userData;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      return true;
    } catch (err) {
      console.error('Login failed:', err);
      error.value = err.response?.data?.message || 'Error al iniciar sesión.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function checkAuth() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      token.value = storedToken;
    } else {
        logout();
    }
  }

  async function register(userData) {
    loading.value = true;
    error.value = null;
    try {
      await axios.post('/auth/register', userData);
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      error.value = err.response?.data?.message || 'Error al registrarse.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    login,
    logout,
    checkAuth,
    register,
  };
});