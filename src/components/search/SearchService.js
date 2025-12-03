/**
 * Servicio de Búsqueda Global
 * Proporciona funcionalidad de búsqueda unificada en toda la aplicación
 */
import axios from '@/plugins/axios';

class SearchService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Busca en múltiples entidades
   * @param {string} query - Término de búsqueda
   * @param {Object} options - Opciones de búsqueda
   * @returns {Promise<Object>} Resultados de búsqueda
   */
  async search(query, options = {}) {
    if (!query || query.trim().length < 2) {
      return {
        proyectos: [],
        tareas: [],
        voluntarios: [],
        fases: [],
        roles: []
      };
    }

    const cacheKey = `${query}-${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const searchTerm = query.trim().toLowerCase();
    const results = {
      proyectos: [],
      tareas: [],
      voluntarios: [],
      fases: [],
      roles: []
    };

    try {
      // Búsqueda en paralelo
      const [proyectos, tareas, voluntarios, roles] = await Promise.all([
        this.searchProyectos(searchTerm, options),
        this.searchTareas(searchTerm, options),
        this.searchVoluntarios(searchTerm, options),
        this.searchRoles(searchTerm, options)
      ]);

      results.proyectos = proyectos;
      results.tareas = tareas;
      results.voluntarios = voluntarios;
      results.roles = roles;

      // Las fases se obtienen de los proyectos
      results.fases = this.extractFasesFromProyectos(proyectos, searchTerm);

      // Cachear resultados
      this.cache.set(cacheKey, {
        data: results,
        timestamp: Date.now()
      });

      return results;
    } catch (error) {
      console.error('Error en búsqueda global:', error);
      return results;
    }
  }

  /**
   * Busca proyectos
   */
  async searchProyectos(query, options) {
    try {
      const response = await axios.get('/projects', {
        params: {
          limit: options.limit || 50
        }
      });
      
      const proyectos = Array.isArray(response.data) ? response.data : [];
      // Filtrar en el cliente ya que el backend no tiene búsqueda por query
      return proyectos.filter(p => 
        (p.nombre?.toLowerCase().includes(query) ||
         p.descripcion?.toLowerCase().includes(query) ||
         p.objetivo?.toLowerCase().includes(query) ||
         p.ubicacion?.toLowerCase().includes(query))
      ).slice(0, options.limit || 10);
    } catch (error) {
      console.error('Error buscando proyectos:', error);
      return [];
    }
  }

  /**
   * Busca tareas
   */
  async searchTareas(query, options) {
    try {
      // Buscar tareas a través de proyectos
      const proyectos = await this.searchProyectos(query, { limit: 50 });
      const tareas = [];
      
      for (const proyecto of proyectos) {
        if (proyecto.fases) {
          proyecto.fases.forEach(fase => {
            if (fase.tareas) {
              fase.tareas.forEach(tarea => {
                if (tarea.descripcion?.toLowerCase().includes(query)) {
                  tareas.push({
                    ...tarea,
                    proyecto: {
                      id: proyecto.id_proyecto,
                      nombre: proyecto.nombre
                    },
                    fase: {
                      id: fase.id_fase,
                      nombre: fase.nombre
                    }
                  });
                }
              });
            }
          });
        }
      }
      
      return tareas.slice(0, options.limit || 10);
    } catch (error) {
      console.error('Error buscando tareas:', error);
      return [];
    }
  }

  /**
   * Busca voluntarios
   */
  async searchVoluntarios(query, options) {
    try {
      // El endpoint de voluntarios puede variar, usar uno genérico o buscar a través de usuarios
      const response = await axios.get('/users', {
        params: {
          tipo_usuario: 'voluntario',
          limit: options.limit || 50
        }
      });
      
      const usuarios = Array.isArray(response.data) ? response.data : [];
      // Filtrar voluntarios
      return usuarios
        .filter(u => u.tipo_usuario === 'voluntario')
        .filter(v =>
          (v.nombre?.toLowerCase().includes(query) ||
           v.email?.toLowerCase().includes(query))
        )
        .map(v => ({
          id_voluntario: v.id_voluntario || v.id,
          usuario: {
            nombre: v.nombre,
            email: v.email
          },
          nombre: v.nombre,
          email: v.email
        }))
        .slice(0, options.limit || 10);
    } catch (error) {
      console.error('Error buscando voluntarios:', error);
      // Si falla, retornar array vacío
      return [];
    }
  }

  /**
   * Busca roles
   */
  async searchRoles(query, options) {
    try {
      // Buscar roles a través de proyectos o directamente
      // Por ahora, buscar en proyectos y extraer roles
      const proyectos = await this.searchProyectos(query, { limit: 20 });
      const roles = [];
      const seenRoles = new Set();
      
      proyectos.forEach(proyecto => {
        // Si el proyecto tiene roles asociados
        if (proyecto.roles) {
          proyecto.roles.forEach(rol => {
            const rolKey = `${rol.id_rol}-${rol.id_proyecto || 'org'}`;
            if (!seenRoles.has(rolKey) &&
                (rol.nombre?.toLowerCase().includes(query) ||
                 rol.descripcion?.toLowerCase().includes(query))) {
              roles.push({
                ...rol,
                id_proyecto: proyecto.id_proyecto || proyecto.id
              });
              seenRoles.add(rolKey);
            }
          });
        }
      });
      
      return roles.slice(0, options.limit || 10);
    } catch (error) {
      console.error('Error buscando roles:', error);
      return [];
    }
  }

  /**
   * Extrae fases de proyectos que coincidan con la búsqueda
   */
  extractFasesFromProyectos(proyectos, query) {
    const fases = [];
    proyectos.forEach(proyecto => {
      if (proyecto.fases) {
        proyecto.fases.forEach(fase => {
          if (fase.nombre?.toLowerCase().includes(query) ||
              fase.descripcion?.toLowerCase().includes(query)) {
            fases.push({
              ...fase,
              proyecto: {
                id: proyecto.id_proyecto,
                nombre: proyecto.nombre
              }
            });
          }
        });
      }
    });
    return fases;
  }

  /**
   * Limpia la caché
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Obtiene sugerencias de búsqueda basadas en historial
   */
  getSearchSuggestions(query, history = []) {
    if (!query || query.length < 2) return [];
    
    const suggestions = history
      .filter(item => item.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
    
    return suggestions;
  }
}

// Singleton instance
let instance = null;

export function getSearchService() {
  if (!instance) {
    instance = new SearchService();
  }
  return instance;
}

export default getSearchService();

