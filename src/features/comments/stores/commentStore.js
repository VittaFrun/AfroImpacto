import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/plugins/axios';
import { useNotifications } from '@/composables/useNotifications';

export const useCommentStore = defineStore('comments', {
  state: () => ({
    comments: {},
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Obtiene los comentarios de una entidad (tarea, proyecto, fase)
     */
    async fetchComments(tipoEntidad, idEntidad) {
      const key = `${tipoEntidad}-${idEntidad}`;
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/comentario', {
          params: {
            tipo: tipoEntidad,
            entidad: idEntidad,
            includeRespuestas: true,
          },
        });

        this.comments[key] = response.data || [];
        return this.comments[key];
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar los comentarios';
        console.error('Error fetching comments:', error);
        this.comments[key] = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Crea un nuevo comentario
     */
    async createComment(commentData) {
      const { showSuccess, showError } = useNotifications();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/comentario', commentData);
        const key = `${commentData.tipo_entidad}-${commentData.id_entidad}`;

        // Recargar comentarios
        await this.fetchComments(commentData.tipo_entidad, commentData.id_entidad);

        showSuccess('Comentario agregado correctamente');
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear el comentario';
        showError(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Actualiza un comentario
     */
    async updateComment(id, updateData) {
      const { showSuccess, showError } = useNotifications();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.patch(`/comentario/${id}`, updateData);
        
        // Recargar comentarios
        const comment = await this.findOne(id);
        if (comment) {
          await this.fetchComments(comment.tipo_entidad, comment.id_entidad);
        }

        showSuccess('Comentario actualizado correctamente');
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar el comentario';
        showError(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Elimina un comentario
     */
    async deleteComment(id) {
      const { showSuccess, showError } = useNotifications();
      this.loading = true;
      this.error = null;

      try {
        const comment = await this.findOne(id);
        await axios.delete(`/comentario/${id}`);

        // Recargar comentarios
        if (comment) {
          await this.fetchComments(comment.tipo_entidad, comment.id_entidad);
        }

        showSuccess('Comentario eliminado correctamente');
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar el comentario';
        showError(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Obtiene un comentario por ID
     */
    async findOne(id) {
      try {
        const response = await axios.get(`/comentario/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching comment:', error);
        return null;
      }
    },

    /**
     * Obtiene los comentarios de una entidad desde el estado
     */
    getComments(tipoEntidad, idEntidad) {
      const key = `${tipoEntidad}-${idEntidad}`;
      return this.comments[key] || [];
    },

    /**
     * Limpia los comentarios de una entidad
     */
    clearComments(tipoEntidad, idEntidad) {
      const key = `${tipoEntidad}-${idEntidad}`;
      delete this.comments[key];
    },
  },
});

