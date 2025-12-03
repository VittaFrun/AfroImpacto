/**
 * Constantes y helpers para reglas de validación comunes
 * Usa createValidationRules de validators.js para generar reglas consistentes
 */
import { createValidationRules } from './validators';

/**
 * Reglas de validación predefinidas para campos comunes
 */
export const VALIDATION_RULES = {
  // Nombre de proyecto/organización
  projectName: createValidationRules({
    required: true,
    minLength: 3,
    maxLength: 100
  }),

  // Descripción
  description: createValidationRules({
    required: true,
    minLength: 10,
    maxLength: 1000
  }),

  // Objetivo
  objective: createValidationRules({
    required: true,
    minLength: 10,
    maxLength: 500
  }),

  // Ubicación
  location: createValidationRules({
    required: true,
    minLength: 3,
    maxLength: 100
  }),

  // Email
  email: createValidationRules({
    required: true,
    email: true
  }),

  // Contraseña
  password: createValidationRules({
    required: true,
    password: true
  }),

  // Confirmar contraseña
  confirmPassword: (password) => [
    ...createValidationRules({ required: true }),
    (value) => value === password || 'Las contraseñas no coinciden'
  ],

  // Presupuesto (número positivo)
  budget: [
    (v) => !!v || 'El presupuesto es requerido',
    (v) => {
      const numericValue = parseFloat(v?.toString().replace(/[^\d.]/g, '') || '0');
      return numericValue > 0 || 'El presupuesto debe ser mayor a 0';
    }
  ],

  // Fecha requerida
  requiredDate: [
    (v) => !!v || 'La fecha es requerida'
  ],

  // Nombre de fase
  phaseName: createValidationRules({
    required: true,
    minLength: 1,
    maxLength: 100
  }),

  // Nombre de tarea
  taskName: createValidationRules({
    required: true,
    minLength: 3,
    maxLength: 200
  }),

  // Nombre de rol
  roleName: createValidationRules({
    required: true,
    minLength: 2,
    maxLength: 100
  }),

  // Descripción de rol
  roleDescription: createValidationRules({
    required: false,
    maxLength: 500
  }),

  // Texto requerido genérico
  requiredText: createValidationRules({
    required: true
  }),

  // Texto opcional con límite
  optionalText: (maxLength = 500) => createValidationRules({
    required: false,
    maxLength
  }),

  // URL opcional
  optionalUrl: createValidationRules({
    required: false,
    url: true
  }),

  // Teléfono opcional
  optionalPhone: createValidationRules({
    required: false,
    phone: true
  })
};

/**
 * Helper para crear reglas de validación personalizadas
 * @param {Object} config - Configuración de validación
 * @returns {Array} Array de reglas de validación
 */
export function createCustomRules(config) {
  const rules = [];

  // Required
  if (config.required) {
    rules.push((v) => {
      if (config.required === true) {
        return !!v || config.requiredMessage || 'Este campo es requerido';
      }
      return true;
    });
  }

  // Min length
  if (config.minLength) {
    rules.push((v) => {
      if (!v) return true; // Skip if empty (unless required)
      return v.length >= config.minLength || 
        config.minLengthMessage || 
        `Mínimo ${config.minLength} caracteres`;
    });
  }

  // Max length
  if (config.maxLength) {
    rules.push((v) => {
      if (!v) return true;
      return v.length <= config.maxLength || 
        config.maxLengthMessage || 
        `Máximo ${config.maxLength} caracteres`;
    });
  }

  // Min value (for numbers)
  if (config.min !== undefined) {
    rules.push((v) => {
      if (v === null || v === undefined || v === '') return true;
      const num = Number(v);
      return !isNaN(num) && num >= config.min || 
        config.minMessage || 
        `El valor mínimo es ${config.min}`;
    });
  }

  // Max value (for numbers)
  if (config.max !== undefined) {
    rules.push((v) => {
      if (v === null || v === undefined || v === '') return true;
      const num = Number(v);
      return !isNaN(num) && num <= config.max || 
        config.maxMessage || 
        `El valor máximo es ${config.max}`;
    });
  }

  // Custom validator function
  if (config.validator && typeof config.validator === 'function') {
    rules.push(config.validator);
  }

  return rules;
}

/**
 * Valida que una fecha de fin sea posterior a la fecha de inicio
 * @param {Ref|ComputedRef|Function} startDateRef - Referencia reactiva a la fecha de inicio
 */
export function createDateRangeRules(startDateRef) {
  return [
    (v) => !!v || 'La fecha de fin es requerida',
    (v) => {
      if (!v) return true;
      const startDate = typeof startDateRef === 'function' 
        ? startDateRef() 
        : (startDateRef?.value ?? startDateRef);
      if (!startDate) return true;
      const start = new Date(startDate);
      const end = new Date(v);
      return end >= start || 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
  ];
}

/**
 * Valida que una fecha de inicio sea anterior a la fecha de fin
 * @param {Ref|ComputedRef|Function} endDateRef - Referencia reactiva a la fecha de fin
 */
export function createStartDateRules(endDateRef) {
  return [
    (v) => !!v || 'La fecha de inicio es requerida',
    (v) => {
      if (!v) return true;
      const endDate = typeof endDateRef === 'function' 
        ? endDateRef() 
        : (endDateRef?.value ?? endDateRef);
      if (!endDate) return true;
      const start = new Date(v);
      const end = new Date(endDate);
      return start <= end || 'La fecha de inicio debe ser anterior a la fecha de fin';
    }
  ];
}

