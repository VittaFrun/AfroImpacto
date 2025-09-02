import axios from 'axios';

// Crea una instancia de Axios con configuración centralizada.
const apiClient = axios.create({
  // Lee la URL base de la API desde las variables de entorno de Vite.
  // Esto te permite tener diferentes URLs para desarrollo y producción.
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;