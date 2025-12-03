/**
 * Composable para usar notificaciones automáticas
 */
import { getAutoNotificationService } from '@/services/AutoNotificationService';
import { computed, watch, onMounted, onBeforeUnmount } from 'vue';

export function useAutoNotifications() {
  const service = getAutoNotificationService();

  /**
   * Notifica cambio de estado de proyecto
   */
  const notifyProjectStatusChange = (project, oldStatus, newStatus) => {
    service.notifyProjectStatusChange(project, oldStatus, newStatus);
  };

  /**
   * Notifica cambio de estado de tarea
   */
  const notifyTaskStatusChange = (task, project, oldStatus, newStatus) => {
    service.notifyTaskStatusChange(task, project, oldStatus, newStatus);
  };

  /**
   * Notifica nueva asignación
   */
  const notifyNewAssignment = (assignment, task, project) => {
    service.notifyNewAssignment(assignment, task, project);
  };

  /**
   * Verifica y notifica tareas próximas a vencer
   */
  const checkUpcomingTaskDeadlines = (tasks, project) => {
    service.checkUpcomingTaskDeadlines(tasks, project);
  };

  /**
   * Verifica y notifica tareas vencidas
   */
  const checkOverdueTasks = (tasks, project) => {
    service.checkOverdueTasks(tasks, project);
  };

  /**
   * Limpia recordatorios de una tarea
   */
  const clearTaskReminder = (taskId) => {
    service.clearTaskReminder(taskId);
  };

  return {
    notifyProjectStatusChange,
    notifyTaskStatusChange,
    notifyNewAssignment,
    checkUpcomingTaskDeadlines,
    checkOverdueTasks,
    clearTaskReminder,
    service
  };
}

/**
 * Composable para monitorear tareas y enviar notificaciones automáticas
 */
export function useTaskDeadlineMonitor(tasks, project) {
  const { checkUpcomingTaskDeadlines, checkOverdueTasks } = useAutoNotifications();

  // Verificar al montar
  onMounted(() => {
    if (tasks.value && project.value) {
      checkUpcomingTaskDeadlines(tasks.value, project.value);
      checkOverdueTasks(tasks.value, project.value);
    }
  });

  // Verificar cuando cambian las tareas
  watch([tasks, project], ([newTasks, newProject]) => {
    if (newTasks && newProject) {
      checkUpcomingTaskDeadlines(newTasks, newProject);
      checkOverdueTasks(newTasks, newProject);
    }
  }, { deep: true });

  // Verificar periódicamente (cada 5 minutos)
  let intervalId = null;
  onMounted(() => {
    intervalId = setInterval(() => {
      if (tasks.value && project.value) {
        checkUpcomingTaskDeadlines(tasks.value, project.value);
        checkOverdueTasks(tasks.value, project.value);
      }
    }, 5 * 60 * 1000); // 5 minutos
  });

  onBeforeUnmount(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return {
    checkUpcomingTaskDeadlines: () => checkUpcomingTaskDeadlines(tasks.value, project.value),
    checkOverdueTasks: () => checkOverdueTasks(tasks.value, project.value)
  };
}

