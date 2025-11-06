import { ref } from 'vue';

export function useFormValidation() {
  const errors = ref({});

  const validateProjectForm = (form) => {
    errors.value = {};
    
    if (!form.name?.trim()) {
      errors.value.name = 'El nombre es requerido';
    } else if (form.name.trim().length < 3) {
      errors.value.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (form.name.trim().length > 100) {
      errors.value.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (!form.description?.trim()) {
      errors.value.description = 'La descripción es requerida';
    } else if (form.description.trim().length < 10) {
      errors.value.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (form.description.trim().length > 1000) {
      errors.value.description = 'La descripción no puede exceder 1000 caracteres';
    }

    if (!form.objective?.trim()) {
      errors.value.objective = 'El objetivo es requerido';
    } else if (form.objective.trim().length < 10) {
      errors.value.objective = 'El objetivo debe tener al menos 10 caracteres';
    } else if (form.objective.trim().length > 1000) {
      errors.value.objective = 'El objetivo no puede exceder 1000 caracteres';
    }

    if (!form.location?.trim()) {
      errors.value.location = 'La ubicación es requerida';
    } else if (form.location.trim().length < 3) {
      errors.value.location = 'La ubicación debe tener al menos 3 caracteres';
    }

    if (!form.startDate) {
      errors.value.startDate = 'La fecha de inicio es requerida';
    }

    if (!form.endDate) {
      errors.value.endDate = 'La fecha de fin es requerida';
    }

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      
      if (end < start) {
        errors.value.dates = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (form.budget !== undefined && form.budget < 0) {
      errors.value.budget = 'El presupuesto no puede ser negativo';
    }

    return Object.keys(errors.value).length === 0;
  };

  const validatePhaseForm = (form) => {
    errors.value = {};
    
    if (!form.name?.trim()) {
      errors.value.name = 'El nombre de la fase es requerido';
    } else if (form.name.trim().length < 3) {
      errors.value.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (form.name.trim().length > 100) {
      errors.value.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (form.description?.trim() && form.description.trim().length > 1000) {
      errors.value.description = 'La descripción no puede exceder 1000 caracteres';
    }

    if (form.orden !== undefined && form.orden < 1) {
      errors.value.orden = 'El orden debe ser mayor a 0';
    }

    return Object.keys(errors.value).length === 0;
  };

  const validateTaskForm = (form) => {
    errors.value = {};
    
    if (!form.description?.trim()) {
      errors.value.description = 'La descripción de la tarea es requerida';
    } else if (form.description.trim().length < 10) {
      errors.value.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (form.description.trim().length > 1000) {
      errors.value.description = 'La descripción no puede exceder 1000 caracteres';
    }

    if (!form.startDate) {
      errors.value.startDate = 'La fecha de inicio es requerida';
    }

    if (!form.endDate) {
      errors.value.endDate = 'La fecha de fin es requerida';
    }

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      
      if (end < start) {
        errors.value.dates = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (!form.prioridad) {
      errors.value.prioridad = 'La prioridad es requerida';
    }

    if (!form.complejidad) {
      errors.value.complejidad = 'La complejidad es requerida';
    }

    if (!form.phaseId) {
      errors.value.phaseId = 'Debes seleccionar una fase';
    }

    return Object.keys(errors.value).length === 0;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  const getError = (field) => {
    return errors.value[field] || '';
  };

  return {
    errors,
    validateProjectForm,
    validatePhaseForm,
    validateTaskForm,
    clearErrors,
    getError
  };
}

