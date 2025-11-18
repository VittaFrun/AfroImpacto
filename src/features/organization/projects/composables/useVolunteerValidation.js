import { ref } from 'vue';
import axios from '@/plugins/axios';

/**
 * Composable para validar asignaciones de voluntarios antes de eliminarlos
 */
export function useVolunteerValidation() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * Verifica si un voluntario tiene asignaciones activas en un proyecto
   * @param {number} idVoluntario - ID del voluntario
   * @param {number} idProyecto - ID del proyecto
   * @returns {Promise<Object>} Objeto con información de las asignaciones
   */
  const checkVolunteerAssignments = async (idVoluntario, idProyecto) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(
        `/asignacion/voluntario/${idVoluntario}/proyecto/${idProyecto}/verificar`
      );
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al verificar asignaciones';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Verifica si un voluntario tiene asignaciones activas (en todos los proyectos)
   * @param {number} idVoluntario - ID del voluntario
   * @returns {Promise<Array>} Array de asignaciones
   */
  const checkAllVolunteerAssignments = async (idVoluntario) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(
        `/asignacion/voluntario/${idVoluntario}/verificar`
      );
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al verificar asignaciones';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Valida si se puede eliminar un voluntario de un proyecto
   * @param {number} idVoluntario - ID del voluntario
   * @param {number} idProyecto - ID del proyecto
   * @returns {Promise<Object>} Objeto con canRemove y details
   */
  const validateVolunteerRemoval = async (idVoluntario, idProyecto) => {
    try {
      const result = await checkVolunteerAssignments(idVoluntario, idProyecto);
      
      return {
        canRemove: !result.hasAssignments,
        hasAssignments: result.hasAssignments,
        count: result.count || 0,
        assignments: result.assignments || [],
        message: result.hasAssignments
          ? `El voluntario tiene ${result.count} asignación(es) activa(s) en este proyecto. Debe eliminar primero todas las asignaciones antes de remover al voluntario.`
          : 'El voluntario no tiene asignaciones activas y puede ser removido del proyecto.'
      };
    } catch (err) {
      return {
        canRemove: false,
        hasAssignments: true,
        count: 0,
        assignments: [],
        message: error.value || 'Error al validar asignaciones'
      };
    }
  };

  return {
    loading,
    error,
    checkVolunteerAssignments,
    checkAllVolunteerAssignments,
    validateVolunteerRemoval
  };
}

