/**
 * Composable para manejo de caché en memoria
 * Útil para almacenar datos de API y evitar requests innecesarios
 */

import { ref, computed } from 'vue';

const cache = new Map();
const cacheTimestamps = new Map();

/**
 * Configuración de caché por defecto
 */
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
const MAX_CACHE_SIZE = 100; // Máximo de entradas en caché

/**
 * Limpia entradas expiradas del caché
 */
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, timestamp] of cacheTimestamps.entries()) {
    if (now - timestamp > DEFAULT_TTL) {
      cache.delete(key);
      cacheTimestamps.delete(key);
    }
  }
}

/**
 * Limita el tamaño del caché eliminando las entradas más antiguas
 */
function limitCacheSize() {
  if (cache.size > MAX_CACHE_SIZE) {
    // Ordenar por timestamp y eliminar las más antiguas
    const entries = Array.from(cacheTimestamps.entries())
      .sort((a, b) => a[1] - b[1]);
    
    const toRemove = entries.slice(0, cache.size - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => {
      cache.delete(key);
      cacheTimestamps.delete(key);
    });
  }
}

/**
 * Composable para usar caché
 * @param {string} key - Clave única para el caché
 * @param {number} ttl - Tiempo de vida en milisegundos (opcional)
 * @returns {Object} - Objeto con funciones de caché
 */
export function useCache(key, ttl = DEFAULT_TTL) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const lastFetch = ref(null);

  /**
   * Obtiene datos del caché o ejecuta la función fetch
   * @param {Function} fetchFn - Función que retorna una Promise con los datos
   * @param {boolean} forceRefresh - Si es true, ignora el caché
   * @returns {Promise} - Promise con los datos
   */
  const get = async (fetchFn, forceRefresh = false) => {
    // Limpiar caché expirado
    cleanExpiredCache();

    const cacheKey = key;
    const cached = cache.get(cacheKey);
    const timestamp = cacheTimestamps.get(cacheKey);
    const now = Date.now();

    // Verificar si hay datos en caché válidos
    if (!forceRefresh && cached && timestamp && (now - timestamp) < ttl) {
      data.value = cached;
      lastFetch.value = new Date(timestamp);
      return cached;
    }

    // Si no hay caché válido, hacer fetch
    loading.value = true;
    error.value = null;

    try {
      const result = await fetchFn();
      
      // Almacenar en caché
      cache.set(cacheKey, result);
      cacheTimestamps.set(cacheKey, now);
      limitCacheSize();

      data.value = result;
      lastFetch.value = new Date(now);
      loading.value = false;

      return result;
    } catch (err) {
      error.value = err;
      loading.value = false;
      throw err;
    }
  };

  /**
   * Establece datos en el caché manualmente
   * @param {any} value - Valor a almacenar
   */
  const set = (value) => {
    const cacheKey = key;
    const now = Date.now();
    cache.set(cacheKey, value);
    cacheTimestamps.set(cacheKey, now);
    data.value = value;
    lastFetch.value = new Date(now);
    limitCacheSize();
  };

  /**
   * Limpia el caché para esta clave
   */
  const clear = () => {
    const cacheKey = key;
    cache.delete(cacheKey);
    cacheTimestamps.delete(cacheKey);
    data.value = null;
    lastFetch.value = null;
  };

  /**
   * Verifica si hay datos en caché válidos
   * @returns {boolean}
   */
  const hasValidCache = computed(() => {
    const cacheKey = key;
    const cached = cache.get(cacheKey);
    const timestamp = cacheTimestamps.get(cacheKey);
    if (!cached || !timestamp) return false;
    const now = Date.now();
    return (now - timestamp) < ttl;
  });

  /**
   * Obtiene el tiempo restante del caché en milisegundos
   * @returns {number}
   */
  const timeRemaining = computed(() => {
    const cacheKey = key;
    const timestamp = cacheTimestamps.get(cacheKey);
    if (!timestamp) return 0;
    const now = Date.now();
    const remaining = ttl - (now - timestamp);
    return remaining > 0 ? remaining : 0;
  });

  return {
    data,
    loading,
    error,
    lastFetch,
    get,
    set,
    clear,
    hasValidCache,
    timeRemaining,
  };
}

/**
 * Limpia todo el caché
 */
export function clearAllCache() {
  cache.clear();
  cacheTimestamps.clear();
}

/**
 * Limpia caché expirado (útil para llamar periódicamente)
 */
export function cleanCache() {
  cleanExpiredCache();
}

/**
 * Obtiene estadísticas del caché
 */
export function getCacheStats() {
  return {
    size: cache.size,
    maxSize: MAX_CACHE_SIZE,
    entries: Array.from(cache.keys()),
  };
}

