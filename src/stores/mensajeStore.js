import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/plugins/axios';
import { useSocket } from '@/composables/useSocket';
import { useAuthStore } from '@/features/auth/stores/authStore';

export const useMensajeStore = defineStore('mensaje', {
  state: () => ({
    conversaciones: [],
    mensajes: {}, // { [idConversacion]: [mensajes] }
    conversacionActual: null,
    usuariosOnline: [], // Array de IDs de usuarios en línea
    usuariosEscribiendo: {},
    loading: false,
    error: null,
  }),

  getters: {
    conversacionesOrdenadas: (state) => {
      return [...state.conversaciones].sort((a, b) => {
        const fechaA = new Date(a.fecha_ultimo_mensaje || a.creado_en);
        const fechaB = new Date(b.fecha_ultimo_mensaje || b.creado_en);
        return fechaB - fechaA;
      });
    },

    mensajesConversacionActual: (state) => {
      if (!state.conversacionActual) return [];
      return state.mensajes[state.conversacionActual.id_conversacion] || [];
    },

    totalMensajesNoLeidos: (state) => {
      return state.conversaciones.reduce((total, conv) => {
        return total + (conv.mensajes_no_leidos || 0);
      }, 0);
    },

    conversacionPorUsuario: (state) => (idUsuario) => {
      return state.conversaciones.find(
        (conv) =>
          (conv.id_usuario1 === idUsuario || conv.id_usuario2 === idUsuario) &&
          conv.otro_usuario?.id_usuario === idUsuario
      );
    },
  },

  actions: {
    async inicializarSocket() {
      try {
        const { socket, conectar } = useSocket();
        
        if (!socket.value || !socket.value.connected) {
          await conectar();
        }

        if (!socket.value) {
          console.error('No se pudo conectar el socket');
          return;
        }

        // Escuchar eventos del socket
        socket.value.on('nuevo-mensaje', (mensaje) => {
          this.agregarMensaje(mensaje);
          this.actualizarConversacion(mensaje);
        });

        socket.value.on('mensaje-enviado', (mensaje) => {
          this.agregarMensaje(mensaje);
        });

        socket.value.on('mensaje-leido', (data) => {
          this.marcarMensajeComoLeido(data.id_mensaje);
        });

        socket.value.on('conversacion-actualizada', (data) => {
          this.cargarConversaciones();
        });

        socket.value.on('usuario-online', (data) => {
          if (data.userId && !this.usuariosOnline.includes(data.userId)) {
            this.usuariosOnline.push(data.userId);
          }
        });

        socket.value.on('usuario-offline', (data) => {
          if (data.userId) {
            const index = this.usuariosOnline.indexOf(data.userId);
            if (index > -1) {
              this.usuariosOnline.splice(index, 1);
            }
          }
        });

        socket.value.on('usuario-escribiendo', (data) => {
          if (data.id_usuario) {
            if (data.escribiendo) {
              this.usuariosEscribiendo[data.id_usuario] = true;
            } else {
              delete this.usuariosEscribiendo[data.id_usuario];
            }
          }
        });
      } catch (error) {
        console.error('Error al inicializar socket:', error);
        this.error = 'Error al conectar con el servidor de mensajería';
      }
    },

    async cargarConversaciones() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get('/mensajes/conversaciones');
        this.conversaciones = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar conversaciones';
        console.error('Error al cargar conversaciones:', error);
      } finally {
        this.loading = false;
      }
    },

    async cargarMensajes(idConversacion, limit = 50, before = null) {
      this.loading = true;
      this.error = null;
      try {
        const params = { limit };
        if (before) params.before = before.toISOString();
        
        const response = await apiClient.get(`/mensajes/conversaciones/${idConversacion}`, { params });
        const mensajes = response.data;

        if (this.mensajes[idConversacion]) {
          this.mensajes[idConversacion] = [...mensajes, ...this.mensajes[idConversacion]];
        } else {
          this.mensajes[idConversacion] = mensajes;
        }

        return mensajes;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar mensajes';
        console.error('Error al cargar mensajes:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async enviarMensaje(contenido, idDestinatario, tipo = 'texto', archivo = null) {
      this.error = null;
      try {
        const { socket } = useSocket();
        
        if (!socket.value || !socket.value.connected) {
          throw new Error('Socket no conectado');
        }

        const mensajeData = {
          id_destinatario: idDestinatario,
          contenido,
          tipo,
        };

        if (archivo) {
          mensajeData.archivo_url = archivo.url;
          mensajeData.archivo_nombre = archivo.nombre;
          mensajeData.archivo_tipo = archivo.tipo;
          mensajeData.archivo_tamaño = archivo.tamaño;
        }

        // Enviar por WebSocket
        socket.value.emit('enviar-mensaje', mensajeData);

        // También enviar por REST como respaldo
        const response = await apiClient.post('/mensajes', mensajeData);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al enviar mensaje';
        console.error('Error al enviar mensaje:', error);
        throw error;
      }
    },

    async marcarComoLeido(idMensaje) {
      try {
        const { socket } = useSocket();
        
        if (socket.value && socket.value.connected) {
          socket.value.emit('marcar-leido', { id_mensaje: idMensaje });
        }

        await apiClient.patch(`/mensajes/${idMensaje}/leido`);
        this.marcarMensajeComoLeido(idMensaje);
      } catch (error) {
        console.error('Error al marcar como leído:', error);
      }
    },

    async eliminarMensaje(idMensaje) {
      try {
        await apiClient.delete(`/mensajes/${idMensaje}`);
        this.eliminarMensajeLocal(idMensaje);
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar mensaje';
        throw error;
      }
    },

    async iniciarConversacion(idDestinatario) {
      // Buscar conversación existente
      const conversacion = this.conversaciones.find(
        (conv) =>
          (conv.id_usuario1 === idDestinatario || conv.id_usuario2 === idDestinatario) &&
          (conv.id_usuario1 !== idDestinatario || conv.id_usuario2 !== idDestinatario)
      );

      if (conversacion) {
        this.seleccionarConversacion(conversacion);
        return conversacion;
      }

      // Si no existe, se creará automáticamente al enviar el primer mensaje
      return null;
    },

    seleccionarConversacion(conversacion) {
      this.conversacionActual = conversacion;
      
      // Cargar mensajes si no están cargados
      if (!this.mensajes[conversacion.id_conversacion]) {
        this.cargarMensajes(conversacion.id_conversacion);
      }

      // Marcar mensajes como leídos
      const mensajesNoLeidos = this.mensajes[conversacion.id_conversacion]?.filter(
        (m) => !m.leido && m.id_destinatario === this.getCurrentUserId()
      );

      if (mensajesNoLeidos && mensajesNoLeidos.length > 0) {
        mensajesNoLeidos.forEach((m) => this.marcarComoLeido(m.id_mensaje));
      }
    },

    notificarEscribiendo(idDestinatario, escribiendo) {
      const { socket } = useSocket();
      if (socket.value && socket.value.connected) {
        socket.value.emit('escribiendo', { id_destinatario: idDestinatario, escribiendo });
      }
    },

    // Métodos auxiliares
    agregarMensaje(mensaje) {
      const idConversacion = mensaje.id_conversacion;
      if (!this.mensajes[idConversacion]) {
        this.mensajes[idConversacion] = [];
      }
      
      // Evitar duplicados
      if (!this.mensajes[idConversacion].find((m) => m.id_mensaje === mensaje.id_mensaje)) {
        this.mensajes[idConversacion].push(mensaje);
        // Ordenar por fecha
        this.mensajes[idConversacion].sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
      }
    },

    actualizarConversacion(mensaje) {
      const conversacion = this.conversaciones.find(
        (c) => c.id_conversacion === mensaje.id_conversacion
      );

      if (conversacion) {
        conversacion.ultimo_mensaje = mensaje.contenido.substring(0, 100);
        conversacion.fecha_ultimo_mensaje = mensaje.creado_en;
        
        if (mensaje.id_destinatario === this.getCurrentUserId()) {
          conversacion.mensajes_no_leidos = (conversacion.mensajes_no_leidos || 0) + 1;
        }
      } else {
        // Si no existe, recargar conversaciones
        this.cargarConversaciones();
      }
    },

    marcarMensajeComoLeido(idMensaje) {
      Object.keys(this.mensajes).forEach((idConv) => {
        const mensaje = this.mensajes[idConv].find((m) => m.id_mensaje === idMensaje);
        if (mensaje) {
          mensaje.leido = true;
          mensaje.fecha_leido = new Date();
        }
      });
    },

    eliminarMensajeLocal(idMensaje) {
      Object.keys(this.mensajes).forEach((idConv) => {
        this.mensajes[idConv] = this.mensajes[idConv].filter((m) => m.id_mensaje !== idMensaje);
      });
    },

    getCurrentUserId() {
      // Obtener ID del usuario actual desde el store de auth
      const authStore = useAuthStore();
      return authStore.user?.id_usuario;
    },

    limpiar() {
      this.conversaciones = [];
      this.mensajes = {};
      this.conversacionActual = null;
      this.usuariosOnline = [];
      this.usuariosEscribiendo = {};
    },
  },
});

