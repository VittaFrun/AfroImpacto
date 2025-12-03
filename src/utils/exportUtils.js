/**
 * Utilidades para exportar datos a diferentes formatos
 */

/**
 * Exporta datos a CSV
 * @param {Array} data - Datos a exportar
 * @param {Array} headers - Encabezados de las columnas
 * @param {string} filename - Nombre del archivo
 */
export function exportToCSV(data, headers, filename = 'export.csv') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Crear encabezados
  const headerRow = headers.map(h => h.label || h).join(',');
  
  // Crear filas de datos
  const rows = data.map(item => {
    return headers.map(header => {
      const value = header.field ? getNestedValue(item, header.field) : '';
      // Escapar comillas y envolver en comillas si contiene comas
      const stringValue = String(value || '').replace(/"/g, '""');
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
    }).join(',');
  });

  // Combinar todo
  const csvContent = [headerRow, ...rows].join('\n');
  
  // Crear blob y descargar
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporta datos a JSON
 * @param {Object|Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
export function exportToJSON(data, filename = 'export.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporta datos a Excel (formato CSV con extensión .xlsx o usando una librería)
 * @param {Array} data - Datos a exportar
 * @param {Array} headers - Encabezados
 * @param {string} filename - Nombre del archivo
 */
export function exportToExcel(data, headers, filename = 'export.xlsx') {
  // Por ahora, exportamos como CSV con extensión .xlsx
  // En el futuro se puede usar una librería como xlsx
  exportToCSV(data, headers, filename.replace('.xlsx', '.csv'));
}

/**
 * Genera un PDF usando jsPDF
 * @param {Array} data - Datos a exportar
 * @param {Array} headers - Encabezados
 * @param {string} title - Título del documento
 * @param {string} filename - Nombre del archivo
 */
export async function exportToPDF(data, headers, title = 'Reporte', filename = 'reporte.pdf') {
  try {
    const { PDFExportService } = await import('./pdfExportService.js');
    const service = new PDFExportService();
    service.initDocument({ title });
    
    // Convertir headers a formato de tabla
    const tableHeaders = headers.map(h => h.label || h);
    const tableData = data.map(item => 
      headers.map(header => {
        const field = header.field || header;
        return getNestedValue(item, field) || '';
      })
    );
    
    service.addTable(tableHeaders, tableData);
    service.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    // Fallback a CSV si falla
    exportToCSV(data, headers, filename.replace('.pdf', '.csv'));
  }
}

/**
 * Obtiene un valor anidado de un objeto usando notación de punto
 * @param {Object} obj - Objeto
 * @param {string} path - Ruta al valor (ej: 'user.name')
 * @returns {any} Valor encontrado
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, prop) => {
    return current && current[prop] !== undefined ? current[prop] : '';
  }, obj);
}

/**
 * Formatea datos de horas para exportación
 * @param {Array} hours - Array de horas
 * @returns {Array} Datos formateados
 */
export function formatHoursForExport(hours) {
  return hours.map(h => ({
    'Voluntario': h.voluntario?.usuario?.nombre || h.voluntario?.nombre || 'N/A',
    'Fecha': new Date(h.fecha).toLocaleDateString('es-ES'),
    'Horas Trabajadas': parseFloat(h.horas_trabajadas || 0).toFixed(2),
    'Tarea': h.tarea?.descripcion || 'N/A',
    'Descripción': h.descripcion || '',
    'Estado': h.verificada ? 'Verificada' : 'Pendiente',
    'Fecha de Registro': new Date(h.creado_en || h.fecha).toLocaleDateString('es-ES')
  }));
}

