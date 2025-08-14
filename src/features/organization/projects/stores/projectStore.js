import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import defaultCoverImage from '@/assets/images/background_login.png';
import { useVolunteerStore } from '@/features/volunteers/stores/volunteerStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';

export const useProjectStore = defineStore('project', () => {
  // State
  const allProjects = ref([
    {
      id: 1,
      name: 'Proyecto Esperanza',
      description: 'Iniciativa para llevar educación a niños en comunidades rurales.',
      objective: 'Mejorar el acceso a la educación de calidad para 500 niños.',
      location: 'Chocó, Colombia',
      startDate: '2023-01-15',
      endDate: '2024-12-31',
      status: 'En Progreso',
      statusColor: 'green',
      coverImage: defaultCoverImage,
      progress: { percentage: 75, completedPhases: 3, totalPhases: 4 },
      phases: [
        { id: 1, name: 'Fase 1: Planificación', description: 'Definición de objetivos y recursos.', status: 'Completado', statusColor: 'blue' },
        { id: 2, name: 'Fase 2: Implementación', description: 'Construcción de aulas y contratación de docentes.', status: 'Activo', statusColor: 'green' },
        { id: 3, name: 'Fase 3: Seguimiento', description: 'Evaluación de impacto y ajustes.', status: 'Pendiente', statusColor: 'orange' },
        { id: 4, name: 'Fase 4: Cierre', description: 'Entrega final y documentación.', status: 'Pendiente', statusColor: 'orange' },
      ],
      tasks: [
        { id: 1, phaseId: 1, description: 'Comprar materiales de construcción', startDate: '2023-02-01', endDate: '2023-02-28', status: 'Completado', statusColor: 'blue', assignments: [{ assignmentId: 1, volunteerId: 1, volunteerName: 'Ana Martínez', role: 'Coordinadora de Compras', roleColor: '#4CAF50' }] },
        { id: 2, phaseId: 2, description: 'Contratar 5 docentes', startDate: '2023-03-01', endDate: '2023-03-31', status: 'En Progreso', statusColor: 'green', assignments: [{ assignmentId: 2, volunteerId: 2, volunteerName: 'Carlos Rodríguez', role: 'Entrevistador', roleColor: '#2196F3' }] },
        { id: 3, phaseId: 2, description: 'Construir 2 aulas nuevas', startDate: '2023-04-01', endDate: '2023-06-30', status: 'En Progreso', statusColor: 'green', assignments: [{ assignmentId: 3, volunteerId: 1, volunteerName: 'Ana Martínez', role: 'Supervisora de obra', roleColor: '#FFC107' }] },
        { id: 4, phaseId: 3, description: 'Realizar encuestas de satisfacción', startDate: '2023-07-01', endDate: '2023-07-31', status: 'Pendiente', statusColor: 'orange', assignments: [] },
      ],
      donations: [
        { id: 1, amount: 10000, date: '2023-01-20' },
        { id: 2, amount: 5000, date: '2023-03-10' },
      ],
      volunteers: [
        { id: 1, name: 'Juan Pérez', role: 'Coordinador' },
        { id: 2, name: 'María García', role: 'Docente' },
      ],
    },
    {
      id: 2,
      name: 'Salud para Todos',
      description: 'Campaña de vacunación y atención médica en zonas de difícil acceso.',
      objective: 'Proveer atención médica a 1000 personas en zonas rurales.',
      location: 'Valle del Cauca, Colombia',
      startDate: '2023-03-01',
      endDate: '2023-09-30',
      status: 'Completado',
      statusColor: 'blue',
      coverImage: defaultCoverImage,
      progress: { percentage: 100, completedPhases: 5, totalPhases: 5 },
      phases: [
        { id: 1, name: 'Fase 1: Preparación', description: 'Logística y permisos.', status: 'Completado', statusColor: 'blue' },
        { id: 2, name: 'Fase 2: Ejecución', description: 'Jornadas de atención.', status: 'Completado', statusColor: 'blue' },
      ],
      tasks: [],
      donations: [],
      volunteers: [],
    },
    {
      id: 3,
      name: 'Empoderamiento Femenino',
      description: 'Talleres de capacitación y microcréditos para mujeres emprendedoras.',
      objective: 'Capacitar a 200 mujeres en habilidades empresariales.',
      location: 'Cartagena, Colombia',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      status: 'En Progreso',
      statusColor: 'green',
      coverImage: defaultCoverImage,
      progress: { percentage: 50, completedPhases: 2, totalPhases: 4 },
      phases: [
        { id: 1, name: 'Fase 1: Convocatoria', description: 'Selección de participantes.', status: 'Completado', statusColor: 'blue' },
        { id: 2, name: 'Fase 2: Talleres', description: 'Capacitación en habilidades.', status: 'Activo', statusColor: 'green' },
        { id: 3, name: 'Fase 3: Microcréditos', description: 'Acceso a financiación.', status: 'Pendiente', statusColor: 'orange' },
      ],
      tasks: [],
      donations: [],
      volunteers: [],
    },
    {
      id: 4,
      name: 'Agua Pura',
      description: 'Instalación de sistemas de potabilización de agua en comunidades.',
      objective: 'Garantizar acceso a agua potable a 5 comunidades.',
      location: 'La Guajira, Colombia',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Pendiente',
      statusColor: 'orange',
      coverImage: defaultCoverImage,
      progress: { percentage: 10, completedPhases: 0, totalPhases: 3 },
      phases: [
        { id: 1, name: 'Fase 1: Estudio de Viabilidad', description: 'Análisis de necesidades.', status: 'Pendiente', statusColor: 'orange' },
        { id: 2, name: 'Fase 2: Instalación', description: 'Montaje de sistemas.', status: 'Pendiente', statusColor: 'orange' },
      ],
      tasks: [],
      donations: [],
      volunteers: [],
    },
    {
      id: 5,
      name: 'Sembrando Futuro',
      description: 'Proyecto de reforestación y educación ambiental.',
      objective: 'Reforestar 10 hectáreas y educar a 300 estudiantes.',
      location: 'Amazonas, Colombia',
      startDate: '2024-02-10',
      endDate: '2025-02-10',
      status: 'En Progreso',
      statusColor: 'green',
      coverImage: defaultCoverImage,
      progress: { percentage: 20, completedPhases: 1, totalPhases: 5 },
      phases: [
        { id: 1, name: 'Fase 1: Preparación de Terreno', description: 'Limpieza y adecuación.', status: 'Completado', statusColor: 'blue' },
        { id: 2, name: 'Fase 2: Siembra', description: 'Plantación de árboles.', status: 'Activo', statusColor: 'green' },
      ],
      tasks: [],
      donations: [],
      volunteers: [],
    },
  ]);
  const mainProjectId = ref(1);

  // Getters
  const projects = computed(() => allProjects.value);
  const getProjectById = computed(() => (id) => allProjects.value.find(p => p.id === id));
  const mainProject = computed(() => {
    if (!mainProjectId.value) {
      return allProjects.value.length > 0 ? allProjects.value[0] : null;
    }
    return allProjects.value.find(p => p.id === mainProjectId.value);
  });

  // Actions
  function setMainProject(projectId) {
    mainProjectId.value = projectId;
  }

  function addProject(newProject) {
    const newId = Math.max(...allProjects.value.map(p => p.id)) + 1;
    allProjects.value.push({ ...newProject, id: newId });
  }

  function updateProject(updatedProject) {
    const index = allProjects.value.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      allProjects.value[index] = { ...allProjects.value[index], ...updatedProject };
    }
  }

  function deleteProject(projectId) {
    allProjects.value = allProjects.value.filter(p => p.id !== projectId);
  }

  // Actions for phases
  function addProjectPhase(projectId, phaseData) {
    const project = allProjects.value.find(p => p.id === projectId);
    if (project) {
      const maxId = project.phases.reduce((max, phase) => Math.max(max, phase.id), 0);
      const newPhase = {
        ...phaseData,
        id: maxId + 1, // Ensure unique ID
        status: 'Pendiente',
        statusColor: 'orange',
      };
      project.phases.push(newPhase);
    }
  }

  function updateProjectPhase(projectId, updatedPhase) {
    const project = allProjects.value.find(p => p.id === projectId);
    if (project) {
      const index = project.phases.findIndex(ph => ph.id === updatedPhase.id);
      if (index !== -1) {
        // Use splice for reactive update
        project.phases.splice(index, 1, { ...project.phases[index], ...updatedPhase });
      }
    }
  }

  function deleteProjectPhase(projectId, phaseId) {
    const project = allProjects.value.find(p => p.id === projectId);
    if (project) {
      const index = project.phases.findIndex(ph => ph.id === phaseId);
      if (index !== -1) {
        // Use splice for reactive removal
        project.phases.splice(index, 1);
      }
    }
  }

  // Actions for tasks
  function addProjectTask(projectId, phaseId, taskData) {
    const project = allProjects.value.find(p => p.id === projectId);
    if (project) {
      const maxId = project.tasks.reduce((max, task) => Math.max(max, task.id), 0);
      const newTask = {
        ...taskData,
        id: maxId + 1,
        phaseId: phaseId,
        status: 'Pendiente',
        statusColor: 'orange',
        assignments: [],
      };
      project.tasks.push(newTask);
      updatePhaseStatusBasedOnTasks(projectId, phaseId);
    }
  }

  function updateProjectTask(projectId, updatedTask) {
    const project = allProjects.value.find(p => p.id === projectId);
    if (project) {
      const index = project.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        project.tasks.splice(index, 1, { ...project.tasks[index], ...updatedTask });
        updatePhaseStatusBasedOnTasks(projectId, updatedTask.phaseId);
      }
    }
  }

  function deleteProjectTask(projectId, taskId) {
    const project = allProjects.value.find(p => p.id === projectId);
    if (project) {
      const taskToDelete = project.tasks.find(t => t.id === taskId);
      const index = project.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        project.tasks.splice(index, 1);
        if (taskToDelete) {
          updatePhaseStatusBasedOnTasks(projectId, taskToDelete.phaseId);
        }
      }
    }
  }

  function updatePhaseStatusBasedOnTasks(projectId, phaseId) {
    const project = allProjects.value.find(p => p.id === projectId);
    if (!project) return;

    const phase = project.phases.find(ph => ph.id === phaseId);
    if (!phase) return;

    const tasksInPhase = project.tasks.filter(task => task.phaseId === phaseId);

    if (tasksInPhase.length === 0) {
      phase.status = 'Pendiente';
      phase.statusColor = 'orange';
      return;
    }

    const allCompleted = tasksInPhase.every(task => task.status === 'Completado');
    const anyInProgress = tasksInPhase.some(task => task.status === 'En Progreso');

    if (allCompleted) {
      phase.status = 'Completado';
      phase.statusColor = 'blue';
    } else if (anyInProgress) {
      phase.status = 'En Progreso';
      phase.statusColor = 'green';
    } else {
      phase.status = 'Pendiente';
      phase.statusColor = 'orange';
    }
  }

  // Actions for assignments
  function assignVolunteerToTask(projectId, taskId, volunteerId, roleName) {
    const project = allProjects.value.find(p => p.id === projectId);
    const volunteerStore = useVolunteerStore();
    const roleStore = useRoleStore();
    const volunteer = volunteerStore.getVolunteerById(volunteerId);
    const role = roleStore.customRoles.find(r => r.name === roleName);

    if (project && volunteer && role) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
        const maxAssignmentId = task.assignments.reduce((max, a) => Math.max(max, a.assignmentId), 0);
        const newAssignment = {
          assignmentId: maxAssignmentId + 1,
          volunteerId: volunteerId,
          volunteerName: volunteer.name,
          role: role.name,
          roleColor: role.color,
        };
        task.assignments.push(newAssignment);
      }
    }
  }

  function unassignVolunteerFromTask(projectId, taskId, assignmentId) {
    const project = allProjects.value.find(p => p.id === projectId);
    if (project) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
        const index = task.assignments.findIndex(a => a.assignmentId === assignmentId);
        if (index !== -1) {
          task.assignments.splice(index, 1);
        }
      }
    }
  }

  return {
    allProjects,
    projects,
    getProjectById,
    mainProject,
    setMainProject,
    addProject,
    updateProject,
    deleteProject,
    addProjectPhase,
    updateProjectPhase,
    deleteProjectPhase,
    addProjectTask,
    updateProjectTask,
    deleteProjectTask,
    assignVolunteerToTask,
    unassignVolunteerFromTask,
    updatePhaseStatusBasedOnTasks,
  };
});
""
