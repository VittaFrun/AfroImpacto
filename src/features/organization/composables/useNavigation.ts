import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/**
 * Composable para manejar la lógica de navegación y detección de rutas activas
 * Centraliza la lógica de navegación para mejor mantenibilidad
 */
export function useNavigation() {
  const router = useRouter()
  const route = useRoute()

  /**
   * Determina si una ruta está activa basándose en la ruta actual
   * @param routePath - La ruta a verificar
   * @param exact - Si debe ser una coincidencia exacta
   * @returns true si la ruta está activa
   */
  const isActive = (routePath: string, exact: boolean = false): boolean => {
    const currentPath = route.path
    
    // Caso especial para dashboard - solo exacto
    if (routePath === '/organization/dashboard') {
      return currentPath === routePath
    }
    
    // Para rutas de proyectos
    if (routePath === '/organization/dashboard/projects') {
      const isProjectsList = currentPath === routePath || currentPath === routePath + '/'
      const isProjectDetail = /^\/organization\/dashboard\/projects\/\d+/.test(currentPath)
      const isNotCreate = !currentPath.includes('/create')
      return (isProjectsList || isProjectDetail) && isNotCreate
    }
    
    if (routePath === '/organization/dashboard/projects/create') {
      return currentPath.includes('/projects/create')
    }
    
    // Para configuración con subcampos
    if (routePath.startsWith('/organization/dashboard/settings')) {
      if (exact) {
        return currentPath === routePath
      }
      return currentPath.startsWith(routePath)
    }
    
    // Para otras rutas, match exacto o prefijo según el parámetro exact
    if (exact) {
      return currentPath === routePath
    }
    return currentPath === routePath || currentPath.startsWith(routePath + '/')
  }

  /**
   * Navega a una ruta específica
   * @param path - La ruta a la que navegar
   */
  const navigateTo = (path: string) => {
    router.push(path)
  }

  return {
    isActive,
    navigateTo,
    currentRoute: computed(() => route),
    router
  }
}

