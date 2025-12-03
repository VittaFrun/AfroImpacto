import axios from 'axios';
import { useNotificationStore } from '@/stores/notificationStore';
import { classifyError, getErrorMessage, ERROR_TYPES } from '@/utils/errorMessages';

// Caché simple para requests GET
const requestCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Limpia caché expirado periódicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, { timestamp }] of requestCache.entries()) {
    if (now - timestamp > CACHE_TTL) {
      requestCache.delete(key);
    }
  }
}, 60000); // Cada minuto

// Crea una instancia de Axios con configuración centralizada.
const apiClient = axios.create({
  // Lee la URL base de la API desde las variables de entorno de Vite.
  // Esto te permite tener diferentes URLs para desarrollo y producción.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Caché para requests GET (solo si no se especifica no-cache)
    if (config.method === 'get' && !config.headers['Cache-Control']?.includes('no-cache') && !config.__skipCache) {
      const cacheKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
      const cached = requestCache.get(cacheKey);
      
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        // Retornar desde caché usando un adapter personalizado
        const originalAdapter = config.adapter || axios.defaults.adapter;
        config.adapter = () => {
          return Promise.resolve({
            data: cached.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            __fromCache: true,
          });
        };
        return config;
      }
      
      // Marcar para almacenar en caché después de la respuesta
      config.__cacheKey = cacheKey;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor para manejo automático de errores
apiClient.interceptors.response.use(
  response => {
    // Almacenar en caché si es GET y tiene cacheKey (y no viene del caché)
    if (response.config?.__cacheKey && response.config.method === 'get' && !response.__fromCache) {
      requestCache.set(response.config.__cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  error => {
    const errorType = classifyError(error);
    const errorInfo = getErrorMessage(error);

    // Log del error
    console.error('API Error:', {
      type: errorType,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorInfo.message,
      error
    });

    // Manejo automático de errores de autenticación
    if (errorType === ERROR_TYPES.AUTH && error.response?.status === 401) {
      // Limpiar token y redirigir al login
      localStorage.removeItem('token');
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }

    // Retornar error con información mejorada
    return Promise.reject({
      ...error,
      errorType,
      errorInfo,
      friendlyMessage: errorInfo.message
    });
  }
);

export default apiClient;