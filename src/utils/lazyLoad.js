/**
 * Utilidades para lazy loading de componentes
 */

import { defineAsyncComponent, h } from 'vue';
import LoadingState from '@/components/feedback/LoadingState.vue';
import ErrorState from '@/components/feedback/ErrorState.vue';

/**
 * Crea un componente lazy con loading y error states
 * @param {Function} loader - Función que retorna el import del componente
 * @param {Object} options - Opciones de configuración
 * @returns {Component}
 */
export function createLazyComponent(loader, options = {}) {
  const {
    loadingComponent = LoadingState,
    errorComponent = ErrorState,
    delay = 200,
    timeout = 30000,
    retry = true,
    retryDelay = 1000,
    maxRetries = 3,
    onError = null,
  } = options;

  return defineAsyncComponent({
    loader,
    loadingComponent: loadingComponent ? h(loadingComponent, { message: 'Cargando componente...' }) : undefined,
    errorComponent: errorComponent ? h(errorComponent, { 
      title: 'Error al cargar componente',
      message: 'No se pudo cargar el componente. Por favor, intenta recargar la página.',
      showRetry: retry,
    }) : undefined,
    delay,
    timeout,
    onError: onError || ((err, retry, fail, attempts) => {
      console.error('Error loading component:', err);
      if (retry && attempts < maxRetries) {
        setTimeout(() => {
          retry();
        }, retryDelay * attempts);
      } else {
        fail();
      }
    }),
  });
}

/**
 * Prefetch de componentes para mejorar performance
 * @param {Function} loader - Función que retorna el import del componente
 */
export function prefetchComponent(loader) {
  // Usar requestIdleCallback si está disponible, sino setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loader();
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      loader();
    }, 2000);
  }
}

/**
 * Preload de rutas para mejorar navegación
 * @param {Array<string>} routeNames - Nombres de rutas a preload
 */
export function prefetchRoutes(routeNames) {
  // Esta función se puede usar con el router para preload rutas
  // cuando el usuario está inactivo o cuando se detecta intención de navegar
  routeNames.forEach(routeName => {
    // El router de Vue ya maneja el prefetch automáticamente
    // pero podemos forzar el prefetch aquí si es necesario
  });
}

