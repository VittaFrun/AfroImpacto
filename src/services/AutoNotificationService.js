/**
 * Servicio de Notificaciones Automáticas
 * Gestiona notificaciones automáticas para cambios de estado, recordatorios y alertas
 */
import { useNotificationStore } from '@/stores/notificationStore';
import { useNotifications } from '@/composables/useNotifications';

class AutoNotificationService {
  constructor() {
    this.notificationStore = useNotificationStore();
    this.notifications = useNotifications();
    this.checkIntervals = new Map();
    this.taskReminders = new Map();
  }

  /**
   * Inicializa el servicio de notificaciones automáticas
   */
  initialize() {
    // Verificar recordatorios cada 5 minutos
    this.startTaskReminderChecker();
    
    // Verificar fechas límite cada hora
    this.startDeadlineChecker();
  }

  /**
   * Notifica cambios de estado de proyecto
   */
  notifyProjectStatusChange(project, oldStatus, newStatus) {
    if (!this.notificationStore.settings.projectStatusChanges) return;

    const statusNames = {
      1: 'Pendiente',
      2: 'En Progreso',
      3: 'Completado',
      4: 'En Pausa',
      5: 'Cancelado'
    };

    const message = `El proyecto "${project.nombre || project.name}" cambió de estado: ${statusNames[oldStatus]} → ${statusNames[newStatus]}`;
    
    this.notificationStore.addNotification({
      type: 'info',
      title: 'Cambio de Estado del Proyecto',
      message,
      id_proyecto: project.id_proyecto || project.id,
      tipo_entidad: 'proyecto',
      id_entidad: project.id_proyecto || project.id,
      createdAt: new Date()
    });

    this.notifications.showInfo(message);
  }

  /**
   * Notifica cambios de estado de tarea
   */
  notifyTaskStatusChange(task, project, oldStatus, newStatus) {
    if (!this.notificationStore.settings.taskDeadlines) return;

    const statusNames = {
      1: 'Pendiente',
      2: 'En Progreso',
      3: 'Completada',
      4: 'En Pausa',
      5: 'Cancelada'
    };

    const message = `La tarea "${task.descripcion?.substring(0, 50)}..." cambió de estado: ${statusNames[oldStatus]} → ${statusNames[newStatus]}`;
    
    this.notificationStore.addNotification({
      type: 'info',
      title: 'Cambio de Estado de Tarea',
      message,
      id_proyecto: project.id_proyecto || project.id,
      tipo_entidad: 'tarea',
      id_entidad: task.id_tarea || task.id,
      createdAt: new Date()
    });
  }

  /**
   * Notifica nuevas asignaciones
   */
  notifyNewAssignment(assignment, task, project) {
    if (!this.notificationStore.settings.newAssignments) return;

    const volunteerName = assignment.voluntario?.usuario?.nombre || assignment.voluntario?.nombre || 'Voluntario';
    const message = `Has sido asignado a la tarea "${task.descripcion?.substring(0, 50)}..." en el proyecto "${project.nombre || project.name}"`;

    this.notificationStore.addNotification({
      type: 'success',
      title: 'Nueva Asignación',
      message,
      id_proyecto: project.id_proyecto || project.id,
      tipo_entidad: 'asignacion',
      id_entidad: assignment.id_asignacion || assignment.id,
      createdAt: new Date()
    });

    this.notifications.showSuccess(message);
  }

  /**
   * Verifica y notifica tareas próximas a vencer
   */
  checkUpcomingTaskDeadlines(tasks, project) {
    if (!this.notificationStore.settings.taskReminders) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const upcomingTasks = tasks.filter(task => {
      if (!task.fecha_fin) return false;
      const deadline = new Date(task.fecha_fin);
      return deadline >= now && deadline <= tomorrow && task.id_estado !== 3; // No completadas
    });

    upcomingTasks.forEach(task => {
      const taskId = task.id_tarea || task.id;
      const reminderKey = `task-${taskId}`;
      
      // Evitar notificaciones duplicadas
      if (this.taskReminders.has(reminderKey)) return;

      const deadline = new Date(task.fecha_fin);
      const hoursUntilDeadline = Math.round((deadline - now) / (1000 * 60 * 60));
      
      let message = '';
      if (hoursUntilDeadline < 24) {
        message = `La tarea "${task.descripcion?.substring(0, 50)}..." vence en ${hoursUntilDeadline} hora(s)`;
      } else {
        message = `La tarea "${task.descripcion?.substring(0, 50)}..." vence mañana`;
      }

      this.notificationStore.addNotification({
        type: 'warning',
        title: 'Tarea Próxima a Vencer',
        message,
        id_proyecto: project.id_proyecto || project.id,
        tipo_entidad: 'tarea',
        id_entidad: taskId,
        createdAt: new Date()
      });

      this.notifications.showWarning(message);
      this.taskReminders.set(reminderKey, true);
    });
  }

  /**
   * Verifica y notifica tareas vencidas
   */
  checkOverdueTasks(tasks, project) {
    if (!this.notificationStore.settings.taskDeadlines) return;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const overdueTasks = tasks.filter(task => {
      if (!task.fecha_fin) return false;
      const deadline = new Date(task.fecha_fin);
      deadline.setHours(0, 0, 0, 0);
      return deadline < now && task.id_estado !== 3; // No completadas
    });

    overdueTasks.forEach(task => {
      const taskId = task.id_tarea || task.id;
      const reminderKey = `overdue-${taskId}`;
      
      // Evitar notificaciones duplicadas
      if (this.taskReminders.has(reminderKey)) return;

      const message = `La tarea "${task.descripcion?.substring(0, 50)}..." está vencida`;

      this.notificationStore.addNotification({
        type: 'error',
        title: 'Tarea Vencida',
        message,
        id_proyecto: project.id_proyecto || project.id,
        tipo_entidad: 'tarea',
        id_entidad: taskId,
        createdAt: new Date()
      });

      this.notifications.showError(message);
      this.taskReminders.set(reminderKey, true);
    });
  }

  /**
   * Inicia el verificador de recordatorios de tareas
   */
  startTaskReminderChecker() {
    // Limpiar intervalos anteriores
    if (this.checkIntervals.has('taskReminders')) {
      clearInterval(this.checkIntervals.get('taskReminders'));
    }

    // Verificar cada 5 minutos
    const interval = setInterval(() => {
      // Esta función será llamada desde los componentes que tienen acceso a las tareas
      // Por ahora solo configuramos el intervalo
    }, 5 * 60 * 1000);

    this.checkIntervals.set('taskReminders', interval);
  }

  /**
   * Inicia el verificador de fechas límite
   */
  startDeadlineChecker() {
    if (this.checkIntervals.has('deadlines')) {
      clearInterval(this.checkIntervals.get('deadlines'));
    }

    // Verificar cada hora
    const interval = setInterval(() => {
      // Esta función será llamada desde los componentes que tienen acceso a las tareas
    }, 60 * 60 * 1000);

    this.checkIntervals.set('deadlines', interval);
  }

  /**
   * Limpia los recordatorios de una tarea específica
   */
  clearTaskReminder(taskId) {
    this.taskReminders.delete(`task-${taskId}`);
    this.taskReminders.delete(`overdue-${taskId}`);
  }

  /**
   * Limpia todos los recordatorios
   */
  clearAllReminders() {
    this.taskReminders.clear();
  }

  /**
   * Detiene todos los verificadores
   */
  stop() {
    this.checkIntervals.forEach(interval => clearInterval(interval));
    this.checkIntervals.clear();
    this.clearAllReminders();
  }
}

// Singleton instance
let instance = null;

export function getAutoNotificationService() {
  if (!instance) {
    instance = new AutoNotificationService();
  }
  return instance;
}

export default getAutoNotificationService();

