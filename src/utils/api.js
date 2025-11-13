/**
 * Utilidades para llamadas API
 * Wrapper alrededor de axios con helpers comunes
 */

import axios from '@/plugins/axios';
import { API_ENDPOINTS } from '@/constants/api';
import { useErrorHandler } from '@/composables/useErrorHandler';

/**
 * Construye una URL de API completa
 * @param {string|Function} endpoint - Endpoint o función que retorna endpoint
 * @param {Object} params - Parámetros para la función
 * @returns {string} URL completa
 */
export function buildApiUrl(endpoint, params = {}) {
  if (typeof endpoint === 'function') {
    return endpoint(params);
  }
  return endpoint;
}

/**
 * Realiza una petición GET con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} config - Configuración de axios
 * @returns {Promise} Promesa con los datos
 */
export async function apiGet(endpoint, config = {}) {
  try {
    const response = await axios.get(buildApiUrl(endpoint), config);
    return response.data;
  } catch (error) {
    const { handleError } = useErrorHandler();
    handleError(error);
    throw error;
  }
}

/**
 * Realiza una petición POST con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración de axios
 * @returns {Promise} Promesa con los datos
 */
export async function apiPost(endpoint, data = {}, config = {}) {
  try {
    const response = await axios.post(buildApiUrl(endpoint), data, config);
    return response.data;
  } catch (error) {
    const { handleError } = useErrorHandler();
    handleError(error);
    throw error;
  }
}

/**
 * Realiza una petición PUT con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración de axios
 * @returns {Promise} Promesa con los datos
 */
export async function apiPut(endpoint, data = {}, config = {}) {
  try {
    const response = await axios.put(buildApiUrl(endpoint), data, config);
    return response.data;
  } catch (error) {
    const { handleError } = useErrorHandler();
    handleError(error);
    throw error;
  }
}

/**
 * Realiza una petición PATCH con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración de axios
 * @returns {Promise} Promesa con los datos
 */
export async function apiPatch(endpoint, data = {}, config = {}) {
  try {
    const response = await axios.patch(buildApiUrl(endpoint), data, config);
    return response.data;
  } catch (error) {
    const { handleError } = useErrorHandler();
    handleError(error);
    throw error;
  }
}

/**
 * Realiza una petición DELETE con manejo de errores
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} config - Configuración de axios
 * @returns {Promise} Promesa con los datos
 */
export async function apiDelete(endpoint, config = {}) {
  try {
    const response = await axios.delete(buildApiUrl(endpoint), config);
    return response.data;
  } catch (error) {
    const { handleError } = useErrorHandler();
    handleError(error);
    throw error;
  }
}

/**
 * Exporta los endpoints para uso directo
 */
export { API_ENDPOINTS };

