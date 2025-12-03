import { ref, computed, watch } from 'vue';
import { DateValidationService } from '@/components/ui/DateValidationService';

/**
 * Composable para validaciones de fechas con jerarquía
 */
export function useDateValidation() {
  // Estado reactivo
  const validationResults = ref({});
  const suggestions = ref({});
  const conflicts = ref([]);

  /**
   * Valida fechas de proyecto
   */
  const validateProject = (fechaInicio, fechaFin) => {
    const result = DateValidationService.validateProjectDates(fechaInicio, fechaFin);
    validationResults.value.project = result;
    return result;
  };

  /**
   * Valida fechas de fase
   */
  const validatePhase = (fechaInicio, fechaFin, projectStartDate, projectEndDate, existingPhases = []) => {
    const result = DateValidationService.validatePhaseDates(
      fechaInicio, 
      fechaFin, 
      projectStartDate, 
      projectEndDate, 
      existingPhases
    );
    validationResults.value.phase = result;
    if (result.overlaps) {
      conflicts.value = result.overlaps;
    }
    return result;
  };

  /**
   * Valida fechas de tarea
   */
  const validateTask = (fechaInicio, fechaFin, phaseStartDate, phaseEndDate, existingTasks = []) => {
    const result = DateValidationService.validateTaskDates(
      fechaInicio, 
      fechaFin, 
      phaseStartDate, 
      phaseEndDate, 
      existingTasks
    );
    validationResults.value.task = result;
    if (result.overlaps) {
      conflicts.value = result.overlaps;
    }
    return result;
  };

  /**
   * Genera sugerencias de fechas
   */
  const generateSuggestions = (type, parentStartDate, parentEndDate, existingItems = []) => {
    const newSuggestions = DateValidationService.generateDateSuggestions(
      type, 
      parentStartDate, 
      parentEndDate, 
      existingItems
    );
    suggestions.value[type] = newSuggestions;
    return newSuggestions;
  };

  /**
   * Crea reglas de validación para formularios
   */
  const createDateRules = (minDate, maxDate, required = true) => {
    return DateValidationService.createDateRules(minDate, maxDate, required);
  };

  const createStartDateRules = (endDate, minDate, maxDate) => {
    return DateValidationService.createStartDateRules(endDate, minDate, maxDate);
  };

  const createEndDateRules = (startDate, minDate, maxDate) => {
    return DateValidationService.createEndDateRules(startDate, minDate, maxDate);
  };

  /**
   * Limpia los resultados de validación
   */
  const clearValidation = (type = null) => {
    if (type) {
      delete validationResults.value[type];
    } else {
      validationResults.value = {};
    }
    conflicts.value = [];
  };

  /**
   * Computed para obtener todos los errores
   */
  const allErrors = computed(() => {
    const errors = [];
    Object.values(validationResults.value).forEach(result => {
      if (result.errors) {
        errors.push(...result.errors);
      }
    });
    return errors;
  });

  /**
   * Computed para obtener todas las advertencias
   */
  const allWarnings = computed(() => {
    const warnings = [];
    Object.values(validationResults.value).forEach(result => {
      if (result.warnings) {
        warnings.push(...result.warnings);
      }
    });
    return warnings;
  });

  /**
   * Computed para verificar si hay errores
   */
  const hasErrors = computed(() => {
    return Object.values(validationResults.value).some(result => 
      result.errors && result.errors.length > 0
    );
  });

  /**
   * Computed para verificar si hay advertencias
   */
  const hasWarnings = computed(() => {
    return Object.values(validationResults.value).some(result => 
      result.warnings && result.warnings.length > 0
    );
  });

  return {
    // Estado
    validationResults: computed(() => validationResults.value),
    suggestions: computed(() => suggestions.value),
    conflicts: computed(() => conflicts.value),
    
    // Métodos de validación
    validateProject,
    validatePhase,
    validateTask,
    generateSuggestions,
    
    // Reglas para formularios
    createDateRules,
    createStartDateRules,
    createEndDateRules,
    
    // Utilidades
    clearValidation,
    
    // Computed
    allErrors,
    allWarnings,
    hasErrors,
    hasWarnings
  };
}

/**
 * Composable especializado para validación de proyectos
 */
export function useProjectDateValidation(projectData) {
  const { validateProject, createStartDateRules, createEndDateRules } = useDateValidation();
  
  const startDate = ref(projectData?.fecha_inicio || '');
  const endDate = ref(projectData?.fecha_fin || '');
  
  // Reglas reactivas
  const startDateRules = computed(() => 
    createStartDateRules(endDate.value, null, null)
  );
  
  const endDateRules = computed(() => 
    createEndDateRules(startDate.value, null, null)
  );
  
  // Validación automática cuando cambian las fechas
  const validation = ref({});
  
  watch([startDate, endDate], ([newStart, newEnd]) => {
    if (newStart && newEnd) {
      validation.value = validateProject(newStart, newEnd);
    }
  }, { immediate: true });
  
  return {
    startDate,
    endDate,
    startDateRules,
    endDateRules,
    validation: computed(() => validation.value),
    isValid: computed(() => validation.value.valid !== false)
  };
}

/**
 * Composable especializado para validación de fases
 */
export function usePhaseeDateValidation(phaseData, projectData, existingPhases = []) {
  const { validatePhase, generateSuggestions, createStartDateRules, createEndDateRules } = useDateValidation();
  
  const startDate = ref(phaseData?.fecha_inicio || '');
  const endDate = ref(phaseData?.fecha_fin || '');
  
  // Límites basados en el proyecto
  const minDate = projectData?.fecha_inicio;
  const maxDate = projectData?.fecha_fin;
  
  // Reglas reactivas
  const startDateRules = computed(() => 
    createStartDateRules(endDate.value, minDate, maxDate)
  );
  
  const endDateRules = computed(() => 
    createEndDateRules(startDate.value, minDate, maxDate)
  );
  
  // Validación automática
  const validation = ref({});
  
  watch([startDate, endDate], ([newStart, newEnd]) => {
    if (newStart && newEnd && minDate && maxDate) {
      validation.value = validatePhase(newStart, newEnd, minDate, maxDate, existingPhases);
    }
  }, { immediate: true });
  
  // Sugerencias automáticas
  const autoSuggestions = computed(() => {
    if (minDate && maxDate) {
      return generateSuggestions('phase', minDate, maxDate, existingPhases);
    }
    return {};
  });
  
  return {
    startDate,
    endDate,
    startDateRules,
    endDateRules,
    validation: computed(() => validation.value),
    suggestions: autoSuggestions,
    isValid: computed(() => validation.value.valid !== false),
    conflicts: computed(() => validation.value.overlaps || [])
  };
}

/**
 * Composable especializado para validación de tareas
 */
export function useTaskDateValidation(taskData, phaseData, existingTasks = []) {
  const { validateTask, generateSuggestions, createStartDateRules, createEndDateRules } = useDateValidation();
  
  const startDate = ref(taskData?.fecha_inicio || '');
  const endDate = ref(taskData?.fecha_fin || '');
  
  // Límites basados en la fase
  const minDate = phaseData?.fecha_inicio;
  const maxDate = phaseData?.fecha_fin;
  
  // Reglas reactivas
  const startDateRules = computed(() => 
    createStartDateRules(endDate.value, minDate, maxDate)
  );
  
  const endDateRules = computed(() => 
    createEndDateRules(startDate.value, minDate, maxDate)
  );
  
  // Validación automática
  const validation = ref({});
  
  watch([startDate, endDate], ([newStart, newEnd]) => {
    if (newStart && newEnd && minDate && maxDate) {
      validation.value = validateTask(newStart, newEnd, minDate, maxDate, existingTasks);
    }
  }, { immediate: true });
  
  // Sugerencias automáticas
  const autoSuggestions = computed(() => {
    if (minDate && maxDate) {
      return generateSuggestions('task', minDate, maxDate, existingTasks);
    }
    return {};
  });
  
  return {
    startDate,
    endDate,
    startDateRules,
    endDateRules,
    validation: computed(() => validation.value),
    suggestions: autoSuggestions,
    isValid: computed(() => validation.value.valid !== false),
    conflicts: computed(() => validation.value.overlaps || []),
    duration: computed(() => validation.value.durationDays || 0)
  };
}

