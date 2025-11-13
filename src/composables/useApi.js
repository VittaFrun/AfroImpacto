/**
 * Composable para manejar llamadas API de forma reutilizable
 * @param {string} endpoint - Endpoint base para las operaciones
 * @returns {Object} - Objeto con loading, error, data y métodos CRUD
 */
import { ref } from 'vue';
import axios from '@/plugins/axios';
import { useErrorHandler } from './useErrorHandler';

export function useApi(endpoint) {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const { handleError } = useErrorHandler();

  /**
   * Realiza una petición GET
   * @param {string} path - Ruta adicional al endpoint base
   * @param {Object} config - Configuración adicional de axios
   * @returns {Promise} - Promesa con los datos
   */
  const get = async (path = '', config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${endpoint}${path}`, config);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err;
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Realiza una petición POST
   * @param {string} path - Ruta adicional al endpoint base
   * @param {Object} payload - Datos a enviar
   * @param {Object} config - Configuración adicional de axios
   * @returns {Promise} - Promesa con los datos
   */
  const post = async (path = '', payload = {}, config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${endpoint}${path}`, payload, config);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err;
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Realiza una petición PUT
   * @param {string} path - Ruta adicional al endpoint base
   * @param {Object} payload - Datos a enviar
   * @param {Object} config - Configuración adicional de axios
   * @returns {Promise} - Promesa con los datos
   */
  const put = async (path = '', payload = {}, config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${endpoint}${path}`, payload, config);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err;
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Realiza una petición PATCH
   * @param {string} path - Ruta adicional al endpoint base
   * @param {Object} payload - Datos a enviar
   * @param {Object} config - Configuración adicional de axios
   * @returns {Promise} - Promesa con los datos
   */
  const patch = async (path = '', payload = {}, config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.patch(`${endpoint}${path}`, payload, config);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err;
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Realiza una petición DELETE
   * @param {string} path - Ruta adicional al endpoint base
   * @param {Object} config - Configuración adicional de axios
   * @returns {Promise} - Promesa con los datos
   */
  const remove = async (path = '', config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.delete(`${endpoint}${path}`, config);
      return response.data;
    } catch (err) {
      error.value = err;
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Resetea el estado del composable
   */
  const reset = () => {
    loading.value = false;
    error.value = null;
    data.value = null;
  };

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    patch,
    remove,
    reset,
  };
}

