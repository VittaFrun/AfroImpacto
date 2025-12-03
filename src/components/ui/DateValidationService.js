/**
 * Servicio centralizado para validaciones de fechas en cascada
 * Maneja la jerarquía: Proyecto → Fase → Tarea
 */

export class DateValidationService {
  /**
   * Valida fechas de proyecto
   */
  static validateProjectDates(fechaInicio, fechaFin) {
    const errors = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Validar que las fechas sean válidas
    if (isNaN(inicio.getTime())) {
      errors.push('La fecha de inicio no es válida');
    }
    if (isNaN(fin.getTime())) {
      errors.push('La fecha de fin no es válida');
    }

    if (errors.length > 0) return { valid: false, errors };

    // Validar que la fecha de fin sea posterior a la de inicio
    if (fin <= inicio) {
      errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Validar que las fechas no sean muy en el pasado (más de 1 año)
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (inicio < oneYearAgo) {
      errors.push('La fecha de inicio no puede ser más de un año en el pasado');
    }

    // Validar que el proyecto no sea demasiado largo (más de 5 años)
    const maxDuration = new Date(inicio);
    maxDuration.setFullYear(maxDuration.getFullYear() + 5);
    
    if (fin > maxDuration) {
      errors.push('La duración del proyecto no puede exceder 5 años');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: this.generateProjectWarnings(inicio, fin, today)
    };
  }

  /**
   * Valida fechas de fase dentro de un proyecto
   */
  static validatePhaseDates(fechaInicio, fechaFin, projectStartDate, projectEndDate, existingPhases = []) {
    const errors = [];
    const warnings = [];

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const proyectoInicio = new Date(projectStartDate);
    const proyectoFin = new Date(projectEndDate);

    // Validaciones básicas
    const basicValidation = this.validateProjectDates(fechaInicio, fechaFin);
    if (!basicValidation.valid) {
      return basicValidation;
    }

    // Validar que la fase esté dentro del rango del proyecto
    if (inicio < proyectoInicio) {
      errors.push(`La fecha de inicio de la fase no puede ser anterior al inicio del proyecto (${this.formatDate(proyectoInicio)})`);
    }

    if (fin > proyectoFin) {
      errors.push(`La fecha de fin de la fase no puede ser posterior al fin del proyecto (${this.formatDate(proyectoFin)})`);
    }

    // Validar solapamientos con otras fases
    const overlaps = this.findPhaseOverlaps(inicio, fin, existingPhases);
    if (overlaps.length > 0) {
      warnings.push(`Esta fase se solapa con: ${overlaps.map(p => p.nombre).join(', ')}`);
    }

    // Validar secuencia lógica de fases
    const sequenceWarnings = this.validatePhaseSequence(inicio, fin, existingPhases);
    warnings.push(...sequenceWarnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      overlaps
    };
  }

  /**
   * Valida fechas de tarea dentro de una fase
   */
  static validateTaskDates(fechaInicio, fechaFin, phaseStartDate, phaseEndDate, existingTasks = []) {
    const errors = [];
    const warnings = [];

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const faseInicio = new Date(phaseStartDate);
    const faseFin = new Date(phaseEndDate);

    // Validaciones básicas
    const basicValidation = this.validateProjectDates(fechaInicio, fechaFin);
    if (!basicValidation.valid) {
      return basicValidation;
    }

    // Validar que la tarea esté dentro del rango de la fase
    if (inicio < faseInicio) {
      errors.push(`La fecha de inicio de la tarea no puede ser anterior al inicio de la fase (${this.formatDate(faseInicio)})`);
    }

    if (fin > faseFin) {
      errors.push(`La fecha de fin de la tarea no puede ser posterior al fin de la fase (${this.formatDate(faseFin)})`);
    }

    // Validar solapamientos con otras tareas
    const overlaps = this.findTaskOverlaps(inicio, fin, existingTasks);
    if (overlaps.length > 0) {
      warnings.push(`Esta tarea se solapa con: ${overlaps.map(t => t.descripcion).join(', ')}`);
    }

    // Validar duración razonable para una tarea
    const durationDays = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    if (durationDays > 90) {
      warnings.push('Esta tarea tiene una duración muy larga (más de 3 meses). Considera dividirla en tareas más pequeñas.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      overlaps,
      durationDays
    };
  }

  /**
   * Genera sugerencias de fechas automáticas
   */
  static generateDateSuggestions(type, parentStartDate, parentEndDate, existingItems = []) {
    const suggestions = {};
    const parentStart = new Date(parentStartDate);
    const parentEnd = new Date(parentEndDate);
    const totalDays = Math.ceil((parentEnd - parentStart) / (1000 * 60 * 60 * 24));

    switch (type) {
      case 'phase':
        suggestions = this.generatePhaseSuggestions(parentStart, parentEnd, totalDays, existingItems);
        break;
      case 'task':
        suggestions = this.generateTaskSuggestions(parentStart, parentEnd, totalDays, existingItems);
        break;
    }

    return suggestions;
  }

  /**
   * Métodos privados de utilidad
   */
  static generateProjectWarnings(inicio, fin, today) {
    const warnings = [];
    const durationDays = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    const daysUntilStart = Math.ceil((inicio - today) / (1000 * 60 * 60 * 24));

    if (daysUntilStart < 7 && daysUntilStart > 0) {
      warnings.push('El proyecto inicia en menos de una semana');
    }

    if (durationDays < 7) {
      warnings.push('El proyecto tiene una duración muy corta (menos de una semana)');
    }

    if (durationDays > 365) {
      warnings.push('El proyecto tiene una duración muy larga (más de un año)');
    }

    return warnings;
  }

  static findPhaseOverlaps(inicio, fin, existingPhases) {
    return existingPhases.filter(phase => {
      const phaseStart = new Date(phase.fecha_inicio);
      const phaseEnd = new Date(phase.fecha_fin);
      
      return (inicio <= phaseEnd && fin >= phaseStart);
    });
  }

  static findTaskOverlaps(inicio, fin, existingTasks) {
    return existingTasks.filter(task => {
      const taskStart = new Date(task.fecha_inicio);
      const taskEnd = new Date(task.fecha_fin);
      
      return (inicio <= taskEnd && fin >= taskStart);
    });
  }

  static validatePhaseSequence(inicio, fin, existingPhases) {
    const warnings = [];
    const sortedPhases = existingPhases
      .map(p => ({ ...p, fecha_inicio: new Date(p.fecha_inicio), fecha_fin: new Date(p.fecha_fin) }))
      .sort((a, b) => a.fecha_inicio - b.fecha_inicio);

    // Verificar si hay gaps grandes entre fases
    for (let i = 0; i < sortedPhases.length - 1; i++) {
      const currentPhaseEnd = sortedPhases[i].fecha_fin;
      const nextPhaseStart = sortedPhases[i + 1].fecha_inicio;
      const gapDays = Math.ceil((nextPhaseStart - currentPhaseEnd) / (1000 * 60 * 60 * 24));

      if (gapDays > 30) {
        warnings.push(`Hay un gap de ${gapDays} días entre las fases "${sortedPhases[i].nombre}" y "${sortedPhases[i + 1].nombre}"`);
      }
    }

    return warnings;
  }

  static generatePhaseSuggestions(parentStart, parentEnd, totalDays, existingPhases) {
    const suggestions = {};
    const phaseCount = existingPhases.length;
    
    if (phaseCount === 0) {
      // Primera fase: usar todo el rango del proyecto
      suggestions.inicio = this.formatDateForInput(parentStart);
      suggestions.fin = this.formatDateForInput(parentEnd);
    } else {
      // Buscar el siguiente slot disponible
      const lastPhase = existingPhases
        .sort((a, b) => new Date(b.fecha_fin) - new Date(a.fecha_fin))[0];
      
      const nextStart = new Date(lastPhase.fecha_fin);
      nextStart.setDate(nextStart.getDate() + 1);
      
      suggestions.inicio = this.formatDateForInput(nextStart);
      suggestions.fin = this.formatDateForInput(parentEnd);
    }

    return suggestions;
  }

  static generateTaskSuggestions(parentStart, parentEnd, totalDays, existingTasks) {
    const suggestions = {};
    const taskCount = existingTasks.length;
    
    if (taskCount === 0) {
      // Primera tarea: sugerir una duración de 1-2 semanas
      const suggestedDuration = Math.min(14, Math.floor(totalDays / 3));
      const suggestedEnd = new Date(parentStart);
      suggestedEnd.setDate(suggestedEnd.getDate() + suggestedDuration);
      
      suggestions.inicio = this.formatDateForInput(parentStart);
      suggestions.fin = this.formatDateForInput(suggestedEnd);
    } else {
      // Buscar el siguiente slot disponible
      const lastTask = existingTasks
        .sort((a, b) => new Date(b.fecha_fin) - new Date(a.fecha_fin))[0];
      
      const nextStart = new Date(lastTask.fecha_fin);
      nextStart.setDate(nextStart.getDate() + 1);
      
      // Sugerir una duración de 1 semana por defecto
      const suggestedEnd = new Date(nextStart);
      suggestedEnd.setDate(suggestedEnd.getDate() + 7);
      
      suggestions.inicio = this.formatDateForInput(nextStart);
      suggestions.fin = this.formatDateForInput(Math.min(suggestedEnd, parentEnd));
    }

    return suggestions;
  }

  static formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  static formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Reglas de validación para formularios
   */
  static createDateRules(minDate = null, maxDate = null, required = true) {
    const rules = [];

    if (required) {
      rules.push(v => !!v || 'La fecha es requerida');
    }

    rules.push(v => {
      if (!v) return true;
      const date = new Date(v);
      return !isNaN(date.getTime()) || 'Fecha inválida';
    });

    if (minDate) {
      rules.push(v => {
        if (!v) return true;
        const date = new Date(v);
        const min = new Date(minDate);
        return date >= min || `La fecha no puede ser anterior a ${this.formatDate(min)}`;
      });
    }

    if (maxDate) {
      rules.push(v => {
        if (!v) return true;
        const date = new Date(v);
        const max = new Date(maxDate);
        return date <= max || `La fecha no puede ser posterior a ${this.formatDate(max)}`;
      });
    }

    return rules;
  }

  static createStartDateRules(endDate, minDate = null, maxDate = null) {
    const rules = this.createDateRules(minDate, maxDate, true);
    
    rules.push(v => {
      if (!v || !endDate) return true;
      const start = new Date(v);
      const end = new Date(endDate);
      return start < end || 'La fecha de inicio debe ser anterior a la fecha de fin';
    });

    return rules;
  }

  static createEndDateRules(startDate, minDate = null, maxDate = null) {
    const rules = this.createDateRules(minDate, maxDate, true);
    
    rules.push(v => {
      if (!v || !startDate) return true;
      const end = new Date(v);
      const start = new Date(startDate);
      return end > start || 'La fecha de fin debe ser posterior a la fecha de inicio';
    });

    return rules;
  }
}

