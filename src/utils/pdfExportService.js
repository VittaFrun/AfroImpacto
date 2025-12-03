/**
 * Servicio de Exportación PDF Mejorado
 * Usa jsPDF y jsPDF-AutoTable para generar PDFs profesionales
 */
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFExportService {
  constructor() {
    this.doc = null;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.currentY = 0;
  }

  /**
   * Inicializa un nuevo documento PDF
   * @param {Object} options - Opciones del documento
   */
  initDocument(options = {}) {
    const {
      title = 'Reporte',
      orientation = 'portrait',
      unit = 'mm',
      format = 'a4'
    } = options;

    this.doc = new jsPDF({
      orientation,
      unit,
      format
    });

    this.pageWidth = orientation === 'landscape' ? 297 : 210;
    this.pageHeight = orientation === 'landscape' ? 210 : 297;
    this.currentY = this.margin;

    // Agregar header
    this.addHeader(title);
    
    return this.doc;
  }

  /**
   * Agrega un header al documento
   */
  addHeader(title) {
    // Logo (si está disponible)
    // this.doc.addImage(logoData, 'PNG', this.margin, 10, 30, 10);
    
    // Título
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, 20);
    
    // Fecha
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.doc.text(`Generado el: ${date}`, this.pageWidth - this.margin, 20, {
      align: 'right'
    });
    
    this.currentY = 30;
  }

  /**
   * Agrega una sección con título
   */
  addSection(title, fontSize = 14) {
    // Nueva página si es necesario
    if (this.currentY > this.pageHeight - 40) {
      this.addPage();
    }

    this.currentY += 10;
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 5;
  }

  /**
   * Agrega una tabla al documento
   */
  addTable(headers, data, options = {}) {
    const {
      title = null,
      startY = null,
      styles = {},
      columnStyles = {}
    } = options;

    if (title) {
      this.addSection(title, 12);
    }

    const tableStartY = startY || this.currentY;

    this.doc.autoTable({
      head: [headers],
      body: data,
      startY: tableStartY,
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        ...styles
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        ...columnStyles
      },
      didDrawPage: (data) => {
        // Agregar número de página
        this.doc.setFontSize(8);
        this.doc.text(
          `Página ${this.doc.internal.getNumberOfPages()}`,
          this.pageWidth / 2,
          this.pageHeight - 10,
          { align: 'center' }
        );
      }
    });

    this.currentY = this.doc.lastAutoTable.finalY + 10;
  }

  /**
   * Agrega texto al documento
   */
  addText(text, options = {}) {
    const {
      fontSize = 10,
      fontStyle = 'normal',
      align = 'left',
      x = this.margin,
      y = null
    } = options;

    if (y !== null) {
      this.currentY = y;
    }

    // Nueva página si es necesario
    if (this.currentY > this.pageHeight - 20) {
      this.addPage();
    }

    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', fontStyle);
    
    const lines = this.doc.splitTextToSize(text, this.pageWidth - (2 * this.margin));
    this.doc.text(lines, x, this.currentY, { align });
    
    this.currentY += (lines.length * (fontSize * 0.4)) + 5;
  }

  /**
   * Agrega una imagen (gráfico) al documento
   */
  addImage(imageDataUrl, options = {}) {
    const {
      width = 170,
      height = null,
      align = 'center',
      title = null
    } = options;

    // Nueva página si es necesario
    if (this.currentY > this.pageHeight - (height || 100)) {
      this.addPage();
    }

    if (title) {
      this.addText(title, { fontSize: 12, fontStyle: 'bold' });
    }

    const x = align === 'center' 
      ? (this.pageWidth - width) / 2
      : align === 'right'
      ? this.pageWidth - width - this.margin
      : this.margin;

    const imgHeight = height || (width * 0.75); // Mantener proporción si no se especifica altura

    this.doc.addImage(imageDataUrl, 'PNG', x, this.currentY, width, imgHeight);
    this.currentY += imgHeight + 10;
  }

  /**
   * Agrega una nueva página
   */
  addPage() {
    this.doc.addPage();
    this.currentY = this.margin;
    // Agregar header en nueva página
    this.addHeader(this.doc.getText(0, 0, 0, 0).split('\n')[0] || 'Reporte');
  }

  /**
   * Guarda el documento
   */
  save(filename) {
    if (!this.doc) {
      throw new Error('Documento no inicializado');
    }
    this.doc.save(filename);
  }

  /**
   * Obtiene el documento como blob
   */
  getBlob() {
    if (!this.doc) {
      throw new Error('Documento no inicializado');
    }
    return this.doc.output('blob');
  }

  /**
   * Obtiene el documento como data URL
   */
  getDataUrl() {
    if (!this.doc) {
      throw new Error('Documento no inicializado');
    }
    return this.doc.output('dataurlstring');
  }
}

/**
 * Exporta un proyecto completo a PDF
 */
export async function exportProjectToPDF(project, options = {}) {
  const {
    includePhases = true,
    includeTasks = true,
    includeVolunteers = true,
    includeHours = true,
    includeCharts = false,
    chartImages = []
  } = options;

  const service = new PDFExportService();
  service.initDocument({
    title: `Proyecto: ${project.nombre || project.name || 'Sin nombre'}`
  });

  // Información general del proyecto
  service.addSection('Información General', 16);
  
  const projectInfo = [
    ['Nombre', project.nombre || project.name || 'N/A'],
    ['Descripción', project.descripcion || 'N/A'],
    ['Objetivo', project.objetivo || 'N/A'],
    ['Ubicación', project.ubicacion || 'N/A'],
    ['Presupuesto', project.presupuesto_total ? `$${project.presupuesto_total.toLocaleString()}` : 'N/A'],
    ['Fecha Inicio', project.fecha_inicio ? new Date(project.fecha_inicio).toLocaleDateString('es-ES') : 'N/A'],
    ['Fecha Fin', project.fecha_fin ? new Date(project.fecha_fin).toLocaleDateString('es-ES') : 'N/A'],
    ['Estado', project.estado?.nombre || 'N/A']
  ];

  service.addTable(
    ['Campo', 'Valor'],
    projectInfo,
    { styles: { cellPadding: 4 } }
  );

  // Fases
  if (includePhases && project.phases && project.phases.length > 0) {
    service.addSection('Fases del Proyecto', 16);
    
    const phasesData = project.phases.map(phase => [
      phase.orden || '-',
      phase.nombre || phase.name || 'Sin nombre',
      phase.descripcion?.substring(0, 50) || 'Sin descripción',
      phase.fecha_inicio ? new Date(phase.fecha_inicio).toLocaleDateString('es-ES') : 'N/A',
      phase.fecha_fin ? new Date(phase.fecha_fin).toLocaleDateString('es-ES') : 'N/A',
      `${calculatePhaseProgress(phase)}%`
    ]);

    service.addTable(
      ['Orden', 'Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Progreso'],
      phasesData
    );
  }

  // Tareas
  if (includeTasks && project.phases) {
    const allTasks = project.phases.flatMap(phase => 
      (phase.tareas || []).map(task => ({
        ...task,
        phaseName: phase.nombre || phase.name
      }))
    );

    if (allTasks.length > 0) {
      service.addSection('Tareas del Proyecto', 16);
      
      const tasksData = allTasks.map(task => [
        task.phaseName || 'N/A',
        task.descripcion?.substring(0, 60) || 'Sin descripción',
        task.prioridad || 'N/A',
        task.complejidad || 'N/A',
        task.fecha_inicio ? new Date(task.fecha_inicio).toLocaleDateString('es-ES') : 'N/A',
        task.fecha_fin ? new Date(task.fecha_fin).toLocaleDateString('es-ES') : 'N/A',
        task.id_estado === 3 ? 'Completada' : task.id_estado === 2 ? 'En Progreso' : 'Pendiente'
      ]);

      service.addTable(
        ['Fase', 'Descripción', 'Prioridad', 'Complejidad', 'Fecha Inicio', 'Fecha Fin', 'Estado'],
        tasksData
      );
    }
  }

  // Voluntarios
  if (includeVolunteers && project.phases) {
    const assignments = project.phases.flatMap(phase =>
      (phase.tareas || []).flatMap(task =>
        (task.asignaciones || []).map(assignment => ({
          volunteer: assignment.voluntario?.usuario?.nombre || assignment.voluntario?.nombre || 'N/A',
          role: assignment.rol?.nombre || 'N/A',
          task: task.descripcion?.substring(0, 40) || 'N/A',
          phase: phase.nombre || phase.name || 'N/A'
        }))
      )
    );

    if (assignments.length > 0) {
      service.addSection('Asignaciones de Voluntarios', 16);
      
      const uniqueVolunteers = Array.from(
        new Map(assignments.map(a => [a.volunteer, a])).values()
      );

      const volunteersData = uniqueVolunteers.map(v => [
        v.volunteer,
        v.role,
        v.phase,
        v.task
      ]);

      service.addTable(
        ['Voluntario', 'Rol', 'Fase', 'Tarea'],
        volunteersData
      );
    }
  }

  // Gráficos
  if (includeCharts && chartImages.length > 0) {
    service.addSection('Gráficos y Visualizaciones', 16);
    chartImages.forEach((imageDataUrl, index) => {
      service.addImage(imageDataUrl, {
        title: `Gráfico ${index + 1}`,
        width: 170,
        align: 'center'
      });
    });
  }

  // Guardar
  const filename = `proyecto-${(project.nombre || project.name || 'sin-nombre').replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  service.save(filename);
  
  return service;
}

/**
 * Exporta horas voluntariadas a PDF
 */
export async function exportHoursToPDF(hours, projectName = 'Proyecto', options = {}) {
  const {
    groupBy = null, // 'volunteer', 'date', 'task'
    includeSummary = true
  } = options;

  const service = new PDFExportService();
  service.initDocument({
    title: `Horas Voluntariadas: ${projectName}`
  });

  // Resumen
  if (includeSummary) {
    service.addSection('Resumen', 16);
    
    const totalHours = hours.reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0);
    const verifiedHours = hours.filter(h => h.verificada).reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0);
    const pendingHours = totalHours - verifiedHours;
    const uniqueVolunteers = new Set(hours.map(h => h.id_voluntario || h.voluntario?.id_voluntario)).size;

    const summaryData = [
      ['Total de Horas', totalHours.toFixed(2)],
      ['Horas Verificadas', verifiedHours.toFixed(2)],
      ['Horas Pendientes', pendingHours.toFixed(2)],
      ['Voluntarios Únicos', uniqueVolunteers.toString()],
      ['Registros Totales', hours.length.toString()]
    ];

    service.addTable(
      ['Métrica', 'Valor'],
      summaryData
    );
  }

  // Datos detallados
  service.addSection('Registro Detallado de Horas', 16);

  const hoursData = hours.map(h => [
    h.voluntario?.usuario?.nombre || h.voluntario?.nombre || 'N/A',
    new Date(h.fecha).toLocaleDateString('es-ES'),
    parseFloat(h.horas_trabajadas || 0).toFixed(2),
    h.tarea?.descripcion?.substring(0, 40) || 'N/A',
    h.descripcion?.substring(0, 30) || 'N/A',
    h.verificada ? 'Verificada' : 'Pendiente'
  ]);

  service.addTable(
    ['Voluntario', 'Fecha', 'Horas', 'Tarea', 'Descripción', 'Estado'],
    hoursData,
    {
      columnStyles: {
        2: { halign: 'right' } // Alinear horas a la derecha
      }
    }
  );

  // Guardar
  const filename = `horas-voluntariadas-${projectName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  service.save(filename);
  
  return service;
}

/**
 * Calcula el progreso de una fase
 */
function calculatePhaseProgress(phase) {
  if (!phase.tareas || phase.tareas.length === 0) return 0;
  const completed = phase.tareas.filter(t => t.id_estado === 3).length;
  return Math.round((completed / phase.tareas.length) * 100);
}

/**
 * Exporta un reporte ejecutivo a PDF
 */
export async function exportExecutiveReportToPDF(data, options = {}) {
  const {
    title = 'Reporte Ejecutivo',
    organizationName = '',
    includeCharts = false,
    chartImages = []
  } = options;

  const service = new PDFExportService();
  service.initDocument({
    title,
    orientation: 'portrait'
  });

  // Agregar nombre de organización si está disponible
  if (organizationName) {
    service.addText(`Organización: ${organizationName}`, {
      fontSize: 12,
      fontStyle: 'bold',
      y: 25
    });
  }

  // Resumen ejecutivo
  if (data.summary) {
    service.addSection('Resumen Ejecutivo', 16);
    service.addText(data.summary, { fontSize: 10 });
  }

  // Métricas clave
  if (data.metrics) {
    service.addSection('Métricas Clave', 16);
    
    const metricsData = Object.entries(data.metrics).map(([key, value]) => [
      key,
      typeof value === 'number' ? value.toLocaleString() : String(value)
    ]);

    service.addTable(
      ['Métrica', 'Valor'],
      metricsData
    );
  }

  // Gráficos
  if (includeCharts && chartImages.length > 0) {
    service.addSection('Análisis Visual', 16);
    chartImages.forEach((imageDataUrl, index) => {
      service.addImage(imageDataUrl, {
        title: `Análisis ${index + 1}`,
        width: 170,
        align: 'center'
      });
    });
  }

  // Conclusiones
  if (data.conclusions) {
    service.addSection('Conclusiones', 16);
    service.addText(data.conclusions, { fontSize: 10 });
  }

  // Guardar
  const filename = `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  service.save(filename);
  
  return service;
}

// Exportar instancia del servicio para uso directo
export default PDFExportService;

