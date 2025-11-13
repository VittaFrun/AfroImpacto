/**
 * Utilidades de formateo para la aplicación
 */

import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha a formato legible
 * @param {Date|string} date - Fecha a formatear
 * @param {string} formatStr - Formato deseado (opcional)
 * @returns {string} Fecha formateada
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Formatea una fecha a formato relativo (hace X tiempo)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha relativa
 */
export function formatRelativeDate(date) {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return '';
  }
}

/**
 * Formatea un rango de fechas
 * @param {Date|string} startDate - Fecha de inicio
 * @param {Date|string} endDate - Fecha de fin
 * @returns {string} Rango de fechas formateado
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Fechas no especificadas';
  try {
    const start = formatDate(startDate, 'dd/MM/yyyy');
    const end = formatDate(endDate, 'dd/MM/yyyy');
    return `${start} - ${end}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return 'Fechas no especificadas';
  }
}

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (default: 'COP')
 * @param {number} decimals - Decimales (default: 2)
 * @returns {string} Cantidad formateada
 */
export function formatCurrency(amount, currency = 'COP', decimals = 2) {
  if (amount === null || amount === undefined) return '';
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toString();
  }
}

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @param {number} decimals - Decimales (default: 0)
 * @returns {string} Número formateado
 */
export function formatNumber(number, decimals = 0) {
  if (number === null || number === undefined) return '';
  try {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
}

/**
 * Formatea un porcentaje
 * @param {number} value - Valor a formatear (0-100)
 * @param {number} decimals - Decimales (default: 0)
 * @returns {string} Porcentaje formateado
 */
export function formatPercentage(value, decimals = 0) {
  if (value === null || value === undefined) return '';
  try {
    return `${formatNumber(value, decimals)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}%`;
  }
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo para texto truncado (default: '...')
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 50, suffix = '...') {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
}

/**
 * Capitaliza la primera letra de un texto
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formatea un nombre completo desde partes
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido
 * @returns {string} Nombre completo
 */
export function formatFullName(firstName = '', lastName = '') {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ') || 'Sin nombre';
}

/**
 * Formatea duración en horas
 * @param {number} hours - Horas
 * @returns {string} Duración formateada
 */
export function formatDuration(hours) {
  if (!hours && hours !== 0) return '';
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }
  if (hours < 24) {
    return `${formatNumber(hours, 1)}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) {
    return `${days} día${days !== 1 ? 's' : ''}`;
  }
  return `${days}d ${formatNumber(remainingHours, 1)}h`;
}

