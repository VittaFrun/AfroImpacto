import { computed } from 'vue';
import { 
  PROJECT_STATES, 
  TASK_STATES, 
  APPLICATION_STATES, 
  PHASE_STATES, 
  HOURS_STATES,
  StateUtils,
  COMMON_STATE_IDS
} from '@/constants/states';

/**
 * Composable para trabajar con estados del sistema
 * Proporciona una interfaz consistente para manejar estados
 */
export function useStates() {
  
  // Getters para diferentes tipos de estados
  const projectStates = computed(() => Object.values(PROJECT_STATES));
  const taskStates = computed(() => Object.values(TASK_STATES));
  const applicationStates = computed(() => Object.values(APPLICATION_STATES));
  const phaseStates = computed(() => Object.values(PHASE_STATES));
  const hoursStates = computed(() => Object.values(HOURS_STATES));

  // Funciones de utilidad
  const getState = (type, id) => StateUtils.getStateById(type, id);
  const getStateByName = (type, name) => StateUtils.getStateByName(type, name);
  const formatState = (type, id) => StateUtils.formatState(type, id);
  const isValidTransition = (type, from, to) => StateUtils.isValidTransition(type, from, to);
  const getValidTransitions = (type, from) => StateUtils.getValidTransitions(type, from);
  const getStatesForSelect = (type) => StateUtils.getStatesForSelect(type);

  // Funciones específicas para cada tipo de estado
  const getProjectState = (id) => getState('project', id);
  const getTaskState = (id) => getState('task', id);
  const getApplicationState = (id) => getState('application', id);
  const getPhaseState = (id) => getState('phase', id);

  // Funciones de validación específicas
  const canTransitionProject = (fromId, toId) => isValidTransition('project', fromId, toId);
  const canTransitionTask = (fromId, toId) => isValidTransition('task', fromId, toId);
  const canTransitionApplication = (fromId, toId) => isValidTransition('application', fromId, toId);

  // Funciones de formato específicas
  const formatProjectState = (id) => formatState('project', id);
  const formatTaskState = (id) => formatState('task', id);
  const formatApplicationState = (id) => formatState('application', id);
  const formatPhaseState = (id) => formatState('phase', id);

  // Helpers para estados comunes
  const isTaskCompleted = (taskStateId) => taskStateId === COMMON_STATE_IDS.TASK_COMPLETED;
  const isTaskInProgress = (taskStateId) => taskStateId === COMMON_STATE_IDS.TASK_IN_PROGRESS;
  const isTaskPending = (taskStateId) => taskStateId === COMMON_STATE_IDS.TASK_PENDING;
  
  const isProjectActive = (projectStateId) => projectStateId === COMMON_STATE_IDS.PROJECT_ACTIVE;
  const isProjectCompleted = (projectStateId) => projectStateId === COMMON_STATE_IDS.PROJECT_COMPLETED;
  
  const isApplicationApproved = (appStateId) => appStateId === COMMON_STATE_IDS.APPLICATION_APPROVED;
  const isApplicationPending = (appStateId) => appStateId === COMMON_STATE_IDS.APPLICATION_PENDING;
  const isApplicationRejected = (appStateId) => appStateId === COMMON_STATE_IDS.APPLICATION_REJECTED;

  return {
    // Estados disponibles
    projectStates,
    taskStates,
    applicationStates,
    phaseStates,
    hoursStates,
    
    // Constantes comunes
    COMMON_STATE_IDS,
    
    // Funciones generales
    getState,
    getStateByName,
    formatState,
    isValidTransition,
    getValidTransitions,
    getStatesForSelect,
    
    // Funciones específicas por tipo
    getProjectState,
    getTaskState,
    getApplicationState,
    getPhaseState,
    
    // Validaciones específicas
    canTransitionProject,
    canTransitionTask,
    canTransitionApplication,
    
    // Formato específico
    formatProjectState,
    formatTaskState,
    formatApplicationState,
    formatPhaseState,
    
    // Helpers comunes
    isTaskCompleted,
    isTaskInProgress,
    isTaskPending,
    isProjectActive,
    isProjectCompleted,
    isApplicationApproved,
    isApplicationPending,
    isApplicationRejected
  };
}

/**
 * Composable especializado para estados de tareas
 */
export function useTaskStates() {
  const { 
    taskStates, 
    getTaskState, 
    formatTaskState, 
    canTransitionTask, 
    getValidTransitions,
    isTaskCompleted,
    isTaskInProgress,
    isTaskPending,
    COMMON_STATE_IDS
  } = useStates();

  const getTaskStateColor = (stateId) => {
    const state = getTaskState(stateId);
    return state?.color || 'grey';
  };

  const getTaskStateIcon = (stateId) => {
    const state = getTaskState(stateId);
    return state?.icon || 'mdi-help-circle';
  };

  const getTaskStateLabel = (stateId) => {
    const state = getTaskState(stateId);
    return state?.label || 'Desconocido';
  };

  const getNextTaskStates = (currentStateId) => {
    return getValidTransitions('task', currentStateId);
  };

  const getTaskProgress = (stateId) => {
    switch (stateId) {
      case COMMON_STATE_IDS.TASK_PENDING: return 0;
      case COMMON_STATE_IDS.TASK_IN_PROGRESS: return 50;
      case COMMON_STATE_IDS.TASK_COMPLETED: return 100;
      default: return 0;
    }
  };

  return {
    taskStates,
    getTaskState,
    formatTaskState,
    canTransitionTask,
    getTaskStateColor,
    getTaskStateIcon,
    getTaskStateLabel,
    getNextTaskStates,
    getTaskProgress,
    isTaskCompleted,
    isTaskInProgress,
    isTaskPending,
    TASK_STATES,
    COMMON_STATE_IDS
  };
}

/**
 * Composable especializado para estados de aplicaciones
 */
export function useApplicationStates() {
  const { 
    applicationStates, 
    getApplicationState, 
    formatApplicationState, 
    canTransitionApplication,
    isApplicationApproved,
    isApplicationPending,
    isApplicationRejected
  } = useStates();

  const getApplicationStateColor = (stateId) => {
    const state = getApplicationState(stateId);
    return state?.color || 'grey';
  };

  const getApplicationStateIcon = (stateId) => {
    const state = getApplicationState(stateId);
    return state?.icon || 'mdi-help-circle';
  };

  const getApplicationStateLabel = (stateId) => {
    const state = getApplicationState(stateId);
    return state?.label || 'Desconocido';
  };

  const canApproveApplication = (currentState) => {
    return canTransitionApplication(currentState, COMMON_STATE_IDS.APPLICATION_APPROVED);
  };

  const canRejectApplication = (currentState) => {
    return canTransitionApplication(currentState, COMMON_STATE_IDS.APPLICATION_REJECTED);
  };

  return {
    applicationStates,
    getApplicationState,
    formatApplicationState,
    canTransitionApplication,
    getApplicationStateColor,
    getApplicationStateIcon,
    getApplicationStateLabel,
    canApproveApplication,
    canRejectApplication,
    isApplicationApproved,
    isApplicationPending,
    isApplicationRejected,
    APPLICATION_STATES
  };
}
