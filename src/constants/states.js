/**
 * Estados centralizados del sistema
 * Proporciona consistencia y facilita el mantenimiento
 */

// Estados de Proyecto
export const PROJECT_STATES = {
  DRAFT: { id: 1, name: 'draft', label: 'Borrador', color: 'grey', icon: 'mdi-file-document-outline' },
  ACTIVE: { id: 2, name: 'active', label: 'Activo', color: 'success', icon: 'mdi-play-circle' },
  COMPLETED: { id: 3, name: 'completed', label: 'Completado', color: 'primary', icon: 'mdi-check-circle' },
  PAUSED: { id: 4, name: 'paused', label: 'Pausado', color: 'warning', icon: 'mdi-pause-circle' },
  CANCELLED: { id: 5, name: 'cancelled', label: 'Cancelado', color: 'error', icon: 'mdi-close-circle' }
};

// Estados de Tarea
export const TASK_STATES = {
  PENDING: { id: 1, name: 'pending', label: 'Pendiente', color: 'grey', icon: 'mdi-clock-outline' },
  IN_PROGRESS: { id: 2, name: 'in_progress', label: 'En Progreso', color: 'info', icon: 'mdi-progress-clock' },
  COMPLETED: { id: 3, name: 'completed', label: 'Completada', color: 'success', icon: 'mdi-check-circle' },
  PAUSED: { id: 4, name: 'paused', label: 'Pausada', color: 'warning', icon: 'mdi-pause-circle' },
  CANCELLED: { id: 5, name: 'cancelled', label: 'Cancelada', color: 'error', icon: 'mdi-close-circle' }
};

// Estados de Solicitud de Inscripción
export const APPLICATION_STATES = {
  PENDING: { id: 'pendiente', name: 'pending', label: 'Pendiente', color: 'warning', icon: 'mdi-clock-outline' },
  APPROVED: { id: 'aprobada', name: 'approved', label: 'Aprobada', color: 'success', icon: 'mdi-check-circle' },
  REJECTED: { id: 'rechazada', name: 'rejected', label: 'Rechazada', color: 'error', icon: 'mdi-close-circle' }
};

// Estados de Fase
export const PHASE_STATES = {
  PENDING: { id: 1, name: 'pending', label: 'Pendiente', color: 'grey', icon: 'mdi-clock-outline' },
  ACTIVE: { id: 2, name: 'active', label: 'Activa', color: 'info', icon: 'mdi-play-circle' },
  COMPLETED: { id: 3, name: 'completed', label: 'Completada', color: 'success', icon: 'mdi-check-circle' }
};

// Estados de Horas Voluntariadas
export const HOURS_STATES = {
  PENDING: { name: 'pending', label: 'Pendiente', color: 'warning', icon: 'mdi-clock-outline' },
  VERIFIED: { name: 'verified', label: 'Verificada', color: 'success', icon: 'mdi-check-circle' },
  REJECTED: { name: 'rejected', label: 'Rechazada', color: 'error', icon: 'mdi-close-circle' }
};

// Transiciones válidas de estados
export const STATE_TRANSITIONS = {
  PROJECT: {
    [PROJECT_STATES.DRAFT.id]: [PROJECT_STATES.ACTIVE.id, PROJECT_STATES.CANCELLED.id],
    [PROJECT_STATES.ACTIVE.id]: [PROJECT_STATES.COMPLETED.id, PROJECT_STATES.PAUSED.id, PROJECT_STATES.CANCELLED.id],
    [PROJECT_STATES.PAUSED.id]: [PROJECT_STATES.ACTIVE.id, PROJECT_STATES.CANCELLED.id],
    [PROJECT_STATES.COMPLETED.id]: [], // No se puede cambiar desde completado
    [PROJECT_STATES.CANCELLED.id]: [] // No se puede cambiar desde cancelado
  },
  
  TASK: {
    [TASK_STATES.PENDING.id]: [TASK_STATES.IN_PROGRESS.id, TASK_STATES.CANCELLED.id],
    [TASK_STATES.IN_PROGRESS.id]: [TASK_STATES.COMPLETED.id, TASK_STATES.PAUSED.id, TASK_STATES.CANCELLED.id],
    [TASK_STATES.PAUSED.id]: [TASK_STATES.IN_PROGRESS.id, TASK_STATES.CANCELLED.id],
    [TASK_STATES.COMPLETED.id]: [TASK_STATES.IN_PROGRESS.id], // Permitir reabrir tareas completadas
    [TASK_STATES.CANCELLED.id]: [TASK_STATES.PENDING.id] // Permitir reactivar tareas canceladas
  },
  
  APPLICATION: {
    [APPLICATION_STATES.PENDING.id]: [APPLICATION_STATES.APPROVED.id, APPLICATION_STATES.REJECTED.id],
    [APPLICATION_STATES.APPROVED.id]: [], // No se puede cambiar una vez aprobada
    [APPLICATION_STATES.REJECTED.id]: [APPLICATION_STATES.PENDING.id] // Permitir reconsiderar
  }
};

// Utilidades para trabajar con estados
export const StateUtils = {
  /**
   * Obtiene un estado por ID
   */
  getStateById(stateType, id) {
    const states = this.getStatesByType(stateType);
    return Object.values(states).find(state => state.id === id) || null;
  },

  /**
   * Obtiene un estado por nombre
   */
  getStateByName(stateType, name) {
    const states = this.getStatesByType(stateType);
    return Object.values(states).find(state => state.name === name) || null;
  },

  /**
   * Obtiene todos los estados de un tipo
   */
  getStatesByType(stateType) {
    switch (stateType.toLowerCase()) {
      case 'project': return PROJECT_STATES;
      case 'task': return TASK_STATES;
      case 'application': return APPLICATION_STATES;
      case 'phase': return PHASE_STATES;
      case 'hours': return HOURS_STATES;
      default: throw new Error(`Tipo de estado desconocido: ${stateType}`);
    }
  },

  /**
   * Verifica si una transición de estado es válida
   */
  isValidTransition(stateType, fromStateId, toStateId) {
    const transitions = STATE_TRANSITIONS[stateType.toUpperCase()];
    if (!transitions || !transitions[fromStateId]) {
      return false;
    }
    return transitions[fromStateId].includes(toStateId);
  },

  /**
   * Obtiene las transiciones válidas desde un estado
   */
  getValidTransitions(stateType, fromStateId) {
    const transitions = STATE_TRANSITIONS[stateType.toUpperCase()];
    if (!transitions || !transitions[fromStateId]) {
      return [];
    }
    
    const validStateIds = transitions[fromStateId];
    const states = this.getStatesByType(stateType);
    
    return validStateIds.map(id => 
      Object.values(states).find(state => state.id === id)
    ).filter(Boolean);
  },

  /**
   * Formatea un estado para mostrar en UI
   */
  formatState(stateType, stateId) {
    const state = this.getStateById(stateType, stateId);
    if (!state) return { label: 'Desconocido', color: 'grey', icon: 'mdi-help-circle' };
    
    return {
      label: state.label,
      color: state.color,
      icon: state.icon,
      name: state.name
    };
  },

  /**
   * Obtiene todos los estados como array para selects
   */
  getStatesForSelect(stateType) {
    const states = this.getStatesByType(stateType);
    return Object.values(states).map(state => ({
      value: state.id,
      title: state.label,
      subtitle: state.name,
      color: state.color,
      icon: state.icon
    }));
  }
};

// Constantes para IDs de estados más comunes (para compatibilidad)
export const COMMON_STATE_IDS = {
  // Estados de tarea más usados
  TASK_PENDING: TASK_STATES.PENDING.id,
  TASK_IN_PROGRESS: TASK_STATES.IN_PROGRESS.id,
  TASK_COMPLETED: TASK_STATES.COMPLETED.id,
  
  // Estados de proyecto más usados
  PROJECT_ACTIVE: PROJECT_STATES.ACTIVE.id,
  PROJECT_COMPLETED: PROJECT_STATES.COMPLETED.id,
  
  // Estados de aplicación
  APPLICATION_PENDING: APPLICATION_STATES.PENDING.id,
  APPLICATION_APPROVED: APPLICATION_STATES.APPROVED.id,
  APPLICATION_REJECTED: APPLICATION_STATES.REJECTED.id
};
