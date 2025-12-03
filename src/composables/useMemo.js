/**
 * Composable para memoización de funciones y computed values
 * Útil para evitar recálculos innecesarios
 */

import { computed, ref, watch } from 'vue';

/**
 * Memoiza el resultado de una función
 * @param {Function} fn - Función a memoizar
 * @param {Function} getKey - Función que genera la clave de caché
 * @param {number} maxSize - Tamaño máximo del caché
 * @returns {Function} - Función memoizada
 */
export function useMemoizedFunction(fn, getKey = (...args) => JSON.stringify(args), maxSize = 50) {
  const cache = new Map();
  const accessOrder = [];

  return function memoized(...args) {
    const key = getKey(...args);

    // Verificar caché
    if (cache.has(key)) {
      // Mover al final (LRU)
      const index = accessOrder.indexOf(key);
      if (index > -1) {
        accessOrder.splice(index, 1);
      }
      accessOrder.push(key);
      return cache.get(key);
    }

    // Calcular y almacenar
    const result = fn(...args);
    
    // Limitar tamaño del caché (LRU)
    if (cache.size >= maxSize) {
      const oldestKey = accessOrder.shift();
      cache.delete(oldestKey);
    }

    cache.set(key, result);
    accessOrder.push(key);

    return result;
  };
}

/**
 * Crea un computed memoizado que solo se recalcula cuando cambian las dependencias
 * @param {Function} getter - Función getter
 * @param {Array} dependencies - Array de dependencias reactivas
 * @returns {ComputedRef} - Computed memoizado
 */
export function useMemoizedComputed(getter, dependencies = []) {
  const lastValues = ref([]);
  const cachedValue = ref(null);

  return computed(() => {
    const currentValues = dependencies.map(dep => 
      typeof dep === 'object' && dep !== null ? JSON.stringify(dep) : dep
    );
    
    const valuesChanged = currentValues.some((val, index) => 
      val !== lastValues.value[index]
    );

    if (valuesChanged || cachedValue.value === null) {
      cachedValue.value = getter();
      lastValues.value = currentValues;
    }

    return cachedValue.value;
  });
}

/**
 * Debounce para funciones
 * @param {Function} fn - Función a debounce
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} - Función con debounce
 */
export function useDebounce(fn, delay = 300) {
  let timeoutId = null;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Throttle para funciones
 * @param {Function} fn - Función a throttle
 * @param {number} limit - Límite en milisegundos
 * @returns {Function} - Función con throttle
 */
export function useThrottle(fn, limit = 300) {
  let inThrottle = false;

  return function throttled(...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

