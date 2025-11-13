/**
 * Composable para manejar estados de carga
 */
import { ref, computed } from 'vue';

export function useLoading(initialState = false) {
  const loading = ref(initialState);
  const loadingCount = ref(0);

  /**
   * Inicia el estado de carga
   */
  const startLoading = () => {
    loadingCount.value++;
    loading.value = true;
  };

  /**
   * Detiene el estado de carga
   */
  const stopLoading = () => {
    loadingCount.value = Math.max(0, loadingCount.value - 1);
    if (loadingCount.value === 0) {
      loading.value = false;
    }
  };

  /**
   * Ejecuta una función asíncrona con manejo automático de loading
   * @param {Function} asyncFn - Función asíncrona a ejecutar
   * @returns {Promise} - Promesa de la función
   */
  const withLoading = async (asyncFn) => {
    startLoading();
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  };

  /**
   * Resetea el estado de carga
   */
  const reset = () => {
    loading.value = false;
    loadingCount.value = 0;
  };

  /**
   * Indica si hay múltiples operaciones en curso
   */
  const hasMultipleLoadings = computed(() => loadingCount.value > 1);

  return {
    loading,
    loadingCount,
    startLoading,
    stopLoading,
    withLoading,
    reset,
    hasMultipleLoadings,
  };
}

