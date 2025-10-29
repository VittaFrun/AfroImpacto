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
  const userId = computed(() => user.value?.sub || user.value?.id_usuario || null);
  const userEmail = computed(() => user.value?.email || null);
  const userName = computed(() => user.value?.nombre || user.value?.username || null);
  
  // Role-based permissions
  const isAdmin = computed(() => userRole.value === 'admin');
  const isOrganization = computed(() => userRole.value === 'organizacion');
  const isVolunteer = computed(() => userRole.value === 'voluntario');
  
  // Permission checks
  const canManageProjects = computed(() => isAdmin.value || isOrganization.value);
  const canViewProjects = computed(() => isAuthenticated.value);
  const canJoinProjects = computed(() => isVolunteer.value || isOrganization.value);
  const canCreateProjects = computed(() => isAdmin.value || isOrganization.value);
  const canManageUsers = computed(() => isAdmin.value);
  const canViewDashboard = computed(() => isAuthenticated.value);

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

  // Additional auth functions
  async function refreshUserData() {
    if (!isAuthenticated.value) return false;
    
    try {
      const response = await axios.get('/auth/profile');
      user.value = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      return true;
    } catch (err) {
      console.error('Error refreshing user data:', err);
      // If token is invalid, logout
      if (err.response?.status === 401) {
        logout();
      }
      return false;
    }
  }
  
  async function updateProfile(profileData) {
    if (!isAuthenticated.value) return false;
    
    try {
      const response = await axios.patch('/auth/profile', profileData);
      user.value = { ...user.value, ...response.data };
      localStorage.setItem('user', JSON.stringify(user.value));
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      error.value = err.response?.data?.message || 'Error al actualizar el perfil';
      return false;
    }
  }
  
  async function changePassword(passwordData) {
    if (!isAuthenticated.value) return false;
    
    try {
      await axios.patch('/auth/change-password', passwordData);
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      error.value = err.response?.data?.message || 'Error al cambiar la contraseña';
      return false;
    }
  }
  
  // Permission helper functions
  function hasPermission(permission) {
    if (!isAuthenticated.value) return false;
    
    const permissions = {
      'manage.projects': canManageProjects.value,
      'view.projects': canViewProjects.value,
      'join.projects': canJoinProjects.value,
      'create.projects': canCreateProjects.value,
      'manage.users': canManageUsers.value,
      'view.dashboard': canViewDashboard.value,
    };
    
    return permissions[permission] || false;
  }
  
  function hasRole(role) {
    return userRole.value === role;
  }
  
  function hasAnyRole(roles) {
    return roles.includes(userRole.value);
  }
  
  // Session management
  function checkTokenExpiry() {
    if (!token.value) return false;
    
    try {
      const base64Url = token.value.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const tokenData = JSON.parse(jsonPayload);
      
      const now = Math.floor(Date.now() / 1000);
      return tokenData.exp > now;
    } catch (err) {
      console.error('Error checking token expiry:', err);
      return false;
    }
  }
  
  function isTokenExpired() {
    return !checkTokenExpiry();
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
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    userId,
    userEmail,
    userName,
    isAdmin,
    isOrganization,
    isVolunteer,
    canManageProjects,
    canViewProjects,
    canJoinProjects,
    canCreateProjects,
    canManageUsers,
    canViewDashboard,
    // Actions
    login,
    logout,
    register,
    checkAuth,
    refreshUserData,
    updateProfile,
    changePassword,
    hasPermission,
    hasRole,
    hasAnyRole,
    checkTokenExpiry,
    isTokenExpired,
  };
});