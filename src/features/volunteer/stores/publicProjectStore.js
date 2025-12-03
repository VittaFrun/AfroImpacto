import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/plugins/axios';
import { useNotificationStore } from '@/stores/notificationStore';
import defaultCoverImage from '@/assets/images/background_login.png';

export const usePublicProjectStore = defineStore('publicProject', () => {
  const notificationStore = useNotificationStore();
  const loading = ref(false);
  const error = ref(null);
  const publicProjects = ref([]);
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });
  const availableFilters = ref({
    categories: [],
    locations: [],
  });

  // Mapear datos del backend al formato del frontend
  function mapProjectData(project) {
    return {
      id: project.id_proyecto,
      name: project.nombre,
      description: project.descripcion,
      objective: project.objetivo,
      organization: project.organizacion?.nombre || 'Organización',
      location: project.ubicacion,
      category: project.categoria || 'General',
      startDate: project.fecha_inicio,
      endDate: project.fecha_fin,
      budget: project.presupuesto_total || 0,
      volunteersCount: project.solicitudes?.filter(s => s.estado === 'aprobada').length || 0,
      image: (project.imagen_principal && project.imagen_principal !== '/assets/images/background_login.png') 
        ? project.imagen_principal 
        : defaultCoverImage,
      coverImage: (project.imagen_principal && project.imagen_principal !== '/assets/images/background_login.png') 
        ? project.imagen_principal 
        : defaultCoverImage,
      // Beneficios (objeto completo para compatibilidad)
      beneficio: project.beneficio ? {
        id: project.beneficio.id_proyecto_beneficio,
        tipo_pago: project.beneficio.tipo_pago,
        monto: project.beneficio.monto,
        frecuencia: project.beneficio.frecuencia,
        descripcion_pago: project.beneficio.descripcion_pago,
        incluye_transporte: project.beneficio.incluye_transporte,
        incluye_alimentacion: project.beneficio.incluye_alimentacion,
        incluye_materiales: project.beneficio.incluye_materiales,
        incluye_seguro: project.beneficio.incluye_seguro
      } : null,
      // Beneficios (campos individuales para compatibilidad con el componente)
      paymentType: project.beneficio?.tipo_pago || 'volunteer',
      paymentAmount: project.beneficio?.monto || 0,
      paymentFrequency: project.beneficio?.frecuencia || 'none',
      paymentDescription: project.beneficio?.descripcion_pago || '',
      includesTransport: project.beneficio?.incluye_transporte || false,
      includesMeals: project.beneficio?.incluye_alimentacion || false,
      includesMaterials: project.beneficio?.incluye_materiales || false,
      includesInsurance: project.beneficio?.incluye_seguro || false,
      // Requisitos
      requisitos: project.requisitos || null,
      // Estado
      es_publico: project.es_publico,
      estado: project.estado,
      estadoId: project.id_estado,
      // Organización completa
      organizacion: project.organizacion
    };
  }

  async function fetchPublicProjects(params = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get('/projects/public', { params });
      const payload = response.data || {};
      const projects = Array.isArray(payload.data) ? payload.data : payload;
      const metadata = payload.meta || {};

      publicProjects.value = projects.map(mapProjectData);

      pagination.value = {
        total: metadata.total ?? publicProjects.value.length,
        page: metadata.page ?? params.page ?? 1,
        limit: metadata.limit ?? params.limit ?? 9,
        totalPages: metadata.totalPages ?? 1,
      };

      availableFilters.value = {
        categories: metadata.availableCategories ?? [],
        locations: metadata.availableLocations ?? [],
      };

      if (publicProjects.value.length === 0) {
        console.info('No public projects found. Make sure projects tienen es_publico=true y estado activo.');
      }

      return publicProjects.value;
    } catch (err) {
      console.error('Error fetching public projects:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar los proyectos públicos';
      error.value = errorMessage;
      
      // Solo mostrar snackbar si es un error del servidor, no si es simplemente que no hay proyectos
      if (err.response?.status !== 404) {
        notificationStore.showSnackbar(errorMessage, 'error');
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getProjectById(projectId) {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return mapProjectData(response.data);
    } catch (err) {
      console.error('Error fetching project:', err);
      const errorMessage = err.response?.data?.message || 'Error al cargar el proyecto';
      error.value = errorMessage;
      notificationStore.showSnackbar(errorMessage, 'error');
      throw err;
    }
  }

  return {
    loading,
    error,
    publicProjects,
    pagination,
    availableFilters,
    fetchPublicProjects,
    getProjectById
  };
});

