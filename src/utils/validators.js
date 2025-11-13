/**
 * Utilidades de validación reutilizables
 */

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export function isValidEmail(email) {
  if (!email) return false;
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9\\-]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
}

/**
 * Valida un teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} true si es válido
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  // Formato: +57 300 123 4567 o 3001234567
  const pattern = /^(\+?57\s?)?[0-9]{10}$/;
  return pattern.test(phone.replace(/\s/g, ''));
}

/**
 * Valida una URL
 * @param {string} url - URL a validar
 * @returns {boolean} true si es válido
 */
export function isValidUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida que un campo no esté vacío
 * @param {any} value - Valor a validar
 * @returns {boolean} true si no está vacío
 */
export function isNotEmpty(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Valida que un número esté en un rango
 * @param {number} value - Valor a validar
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {boolean} true si está en el rango
 */
export function isInRange(value, min, max) {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
}

/**
 * Valida que un texto tenga una longitud mínima
 * @param {string} text - Texto a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} true si cumple
 */
export function hasMinLength(text, minLength) {
  if (!text) return false;
  return text.length >= minLength;
}

/**
 * Valida que un texto tenga una longitud máxima
 * @param {string} text - Texto a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} true si cumple
 */
export function hasMaxLength(text, maxLength) {
  if (!text) return true; // Opcional
  return text.length <= maxLength;
}

/**
 * Valida una contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
 * @param {string} password - Contraseña a validar
 * @returns {boolean} true si es válida
 */
export function isValidPassword(password) {
  if (!password) return false;
  if (password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * Valida una fecha
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} true si es válida
 */
export function isValidDate(date) {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
}

/**
 * Valida que una fecha sea futura
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} true si es futura
 */
export function isFutureDate(date) {
  if (!isValidDate(date)) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Valida que una fecha sea pasada
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} true si es pasada
 */
export function isPastDate(date) {
  if (!isValidDate(date)) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Valida que una fecha esté en un rango
 * @param {Date|string} date - Fecha a validar
 * @param {Date|string} startDate - Fecha de inicio
 * @param {Date|string} endDate - Fecha de fin
 * @returns {boolean} true si está en el rango
 */
export function isDateInRange(date, startDate, endDate) {
  if (!isValidDate(date) || !isValidDate(startDate) || !isValidDate(endDate)) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return dateObj >= start && dateObj <= end;
}

/**
 * Crea reglas de validación para Vuetify
 * @param {Object} rules - Objeto con reglas de validación
 * @returns {Array} Array de funciones de validación
 */
export function createValidationRules(rules) {
  const validationRules = [];
  
  if (rules.required) {
    validationRules.push((value) => isNotEmpty(value) || 'Este campo es requerido');
  }
  
  if (rules.email) {
    validationRules.push((value) => !value || isValidEmail(value) || 'Email inválido');
  }
  
  if (rules.phone) {
    validationRules.push((value) => !value || isValidPhone(value) || 'Teléfono inválido');
  }
  
  if (rules.url) {
    validationRules.push((value) => !value || isValidUrl(value) || 'URL inválida');
  }
  
  if (rules.minLength) {
    validationRules.push((value) => !value || hasMinLength(value, rules.minLength) || `Mínimo ${rules.minLength} caracteres`);
  }
  
  if (rules.maxLength) {
    validationRules.push((value) => !value || hasMaxLength(value, rules.maxLength) || `Máximo ${rules.maxLength} caracteres`);
  }
  
  if (rules.password) {
    validationRules.push((value) => isValidPassword(value) || 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
  }
  
  if (rules.min) {
    validationRules.push((value) => {
      const num = Number(value);
      return isNaN(num) || num >= rules.min || `El valor mínimo es ${rules.min}`;
    });
  }
  
  if (rules.max) {
    validationRules.push((value) => {
      const num = Number(value);
      return isNaN(num) || num <= rules.max || `El valor máximo es ${rules.max}`;
    });
  }
  
  return validationRules;
}

