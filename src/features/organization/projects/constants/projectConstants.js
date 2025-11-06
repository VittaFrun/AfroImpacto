// Constantes para proyectos
export const PROJECT_STATUS = {
  INACTIVE: 1,
  ACTIVE: 2
};

export const PROJECT_STATUS_OPTIONS = [
  { title: 'Inactivo', value: PROJECT_STATUS.INACTIVE, icon: 'mdi-pause-circle', color: 'warning' },
  { title: 'Activo', value: PROJECT_STATUS.ACTIVE, icon: 'mdi-check-circle', color: 'success' }
];

export const TASK_STATUS = {
  PENDING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3
};

export const TASK_STATUS_OPTIONS = [
  { title: 'Pendiente', value: TASK_STATUS.PENDING, icon: 'mdi-clock-outline', color: 'warning' },
  { title: 'En Progreso', value: TASK_STATUS.IN_PROGRESS, icon: 'mdi-progress-clock', color: 'info' },
  { title: 'Completada', value: TASK_STATUS.COMPLETED, icon: 'mdi-check-circle', color: 'success' }
];

export const PRIORITY_OPTIONS = [
  { title: 'Alta', value: 'Alta', color: 'error' },
  { title: 'Media', value: 'Media', color: 'warning' },
  { title: 'Baja', value: 'Baja', color: 'success' }
];

export const COMPLEXITY_OPTIONS = [
  { title: 'Alta', value: 'Alta' },
  { title: 'Media', value: 'Media' },
  { title: 'Baja', value: 'Baja' }
];

// Helper functions
export function getStatusIcon(statusId) {
  const status = PROJECT_STATUS_OPTIONS.find(s => s.value === statusId);
  return status?.icon || 'mdi-help-circle';
}

export function getStatusColor(statusId) {
  const status = PROJECT_STATUS_OPTIONS.find(s => s.value === statusId);
  return status?.color || 'grey';
}

export function getStatusText(statusId) {
  const status = PROJECT_STATUS_OPTIONS.find(s => s.value === statusId);
  return status?.title || 'Desconocido';
}

export function getTaskStatusIcon(statusId) {
  const status = TASK_STATUS_OPTIONS.find(s => s.value === statusId);
  return status?.icon || 'mdi-help-circle';
}

export function getTaskStatusColor(statusId) {
  const status = TASK_STATUS_OPTIONS.find(s => s.value === statusId);
  return status?.color || 'grey';
}

export function getTaskStatusText(statusId) {
  const status = TASK_STATUS_OPTIONS.find(s => s.value === statusId);
  return status?.title || 'Desconocido';
}

export function getPriorityColor(priority) {
  const priorityOption = PRIORITY_OPTIONS.find(p => p.value === priority);
  return priorityOption?.color || 'grey';
}

