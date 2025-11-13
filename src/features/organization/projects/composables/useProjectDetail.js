/**
 * Composable para la lógica del detalle de proyecto
 * Extrae la lógica principal de ProjectDetailView
 */
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/features/organization/projects/stores/projectStore';
import { useRoleStore } from '@/features/organization/stores/roleStore';
import { useEstadoStore } from '@/features/organization/stores/estadoStore';
import { useSolicitudInscripcionStore } from '@/features/organization/projects/stores/solicitudInscripcionStore';
import { useProjectOperations } from './useProjectOperations';
import { useApi } from '@/composables/useApi';
import { API_ENDPOINTS } from '@/constants/api';

export function useProjectDetail() {
  const route = useRoute();
  const projectStore = useProjectStore();
  const roleStore = useRoleStore();
  const estadoStore = useEstadoStore();
  const solicitudStore = useSolicitudInscripcionStore();
  const { handleOperation, isLoading } = useProjectOperations();
  
  // API para horas voluntariadas
  const { loading: loadingHoras, data: volunteerHoursData, get: getHoras } = useApi(API_ENDPOINTS.VOLUNTEER_HOURS.BASE);

  // Refs
  const project = computed(() => {
    const projectId = parseInt(route.params.id, 10);
    return projectStore.getProjectById(projectId);
  });

  const { loading: projectLoading, error: projectError } = storeToRefs(projectStore);
  const { customRoles, projectRoles } = storeToRefs(roleStore);
  const { allEstados } = storeToRefs(estadoStore);

  // Estado de horas voluntariadas
  const volunteerHours = ref([]);
  const horasSummary = ref({
    total: 0,
    verificadas: 0,
    pendientes: 0,
    totalRegistros: 0
  });

  // Estado de solicitudes
  const solicitudes = ref([]);

  /**
   * Carga los datos iniciales del proyecto
   */
  const loadProjectData = async () => {
    const projectId = parseInt(route.params.id, 10);
    if (!projectId) return;

    await Promise.all([
      projectStore.fetchProjectById(projectId),
      roleStore.fetchProjectRoles(projectId),
      solicitudStore.fetchByProject(projectId),
      estadoStore.fetchEstados(),
      loadVolunteerHours()
    ]);

    solicitudes.value = solicitudStore.allSolicitudes;
  };

  /**
   * Carga las horas voluntariadas del proyecto
   */
  const loadVolunteerHours = async () => {
    const projectId = parseInt(route.params.id, 10);
    if (!projectId) return;

    try {
      const horas = await getHoras(`/proyecto/${projectId}/todas`);
      volunteerHours.value = horas || [];
      
      // Calcular resumen
      const total = volunteerHours.value.reduce((sum, h) => 
        sum + parseFloat(h.horas_trabajadas || 0), 0
      );
      const verificadas = volunteerHours.value
        .filter(h => h.verificada)
        .reduce((sum, h) => sum + parseFloat(h.horas_trabajadas || 0), 0);

      horasSummary.value = {
        total: parseFloat(total.toFixed(2)),
        verificadas: parseFloat(verificadas.toFixed(2)),
        pendientes: parseFloat((total - verificadas).toFixed(2)),
        totalRegistros: volunteerHours.value.length
      };
    } catch (error) {
      console.error('Error loading volunteer hours:', error);
      volunteerHours.value = [];
    }
  };

  /**
   * Verifica o desverifica horas
   */
  const verificarHoras = async (idHoras, verificada) => {
    const projectId = parseInt(route.params.id, 10);
    if (!projectId) return;

    await handleOperation(
      async () => {
        const { patch } = useApi(API_ENDPOINTS.VOLUNTEER_HOURS.BASE);
        return await patch(`/${idHoras}/verificar`, { verificada });
      },
      'verificandoHoras',
      verificada ? 'Horas verificadas correctamente' : 'Verificación removida',
      'Error al verificar las horas',
      async () => {
        await loadVolunteerHours();
        await projectStore.fetchProjectById(projectId);
      }
    );
  };

  /**
   * Actualiza el estado de una solicitud
   */
  const updateSolicitudEstado = async (solicitudId, nuevoEstado) => {
    await handleOperation(
      () => solicitudStore.updateSolicitud(solicitudId, { estado: nuevoEstado }),
      'updatingSolicitud',
      `Solicitud ${nuevoEstado === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente`,
      'Error al actualizar la solicitud',
      async () => {
        const projectId = parseInt(route.params.id, 10);
        await solicitudStore.fetchByProject(projectId);
        solicitudes.value = solicitudStore.allSolicitudes;
        await projectStore.fetchProjectById(projectId);
      }
    );
  };

  /**
   * Carga las solicitudes del proyecto
   */
  const loadSolicitudes = async () => {
    const projectId = parseInt(route.params.id, 10);
    if (!projectId) return;

    await handleOperation(
      () => solicitudStore.fetchByProject(projectId),
      'loadingSolicitudes',
      '',
      'Error al cargar las solicitudes',
      () => {
        solicitudes.value = solicitudStore.allSolicitudes;
      }
    );
  };

  // Cargar datos al montar
  onMounted(() => {
    loadProjectData();
  });

  return {
    // State
    project,
    projectLoading,
    projectError,
    customRoles,
    projectRoles,
    allEstados,
    volunteerHours,
    horasSummary,
    loadingHoras,
    solicitudes,
    
    // Methods
    loadProjectData,
    loadVolunteerHours,
    verificarHoras,
    updateSolicitudEstado,
    loadSolicitudes,
    isLoading,
  };
}

