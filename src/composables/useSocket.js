import { ref, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

const socket = ref(null);
const connected = ref(false);
const error = ref(null);

export function useSocket() {

  const conectar = () => {
    return new Promise((resolve, reject) => {
      if (socket.value && socket.value.connected) {
        connected.value = true;
        resolve(socket.value);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        error.value = 'No hay token de autenticación';
        reject(new Error('No hay token de autenticación'));
        return;
      }

      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      socket.value = io(`${apiUrl}/mensajes`, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.value.on('connect', () => {
        connected.value = true;
        error.value = null;
        console.log('Socket conectado');
        resolve(socket.value);
      });

      socket.value.on('disconnect', () => {
        connected.value = false;
        console.log('Socket desconectado');
      });

      socket.value.on('connect_error', (err) => {
        connected.value = false;
        error.value = err.message;
        console.error('Error de conexión Socket:', err);
        reject(err);
      });

      socket.value.on('error', (err) => {
        error.value = err.message;
        console.error('Error Socket:', err);
      });
    });
  };

  const desconectar = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
    }
  };

  const emitir = (evento, datos) => {
    if (socket.value && socket.value.connected) {
      socket.value.emit(evento, datos);
    } else {
      console.warn('Socket no conectado, intentando conectar...');
      conectar().then(() => {
        socket.value.emit(evento, datos);
      });
    }
  };

  const escuchar = (evento, callback) => {
    if (socket.value) {
      socket.value.on(evento, callback);
    }
  };

  const dejarDeEscuchar = (evento, callback) => {
    if (socket.value) {
      socket.value.off(evento, callback);
    }
  };

  // Desconectar al desmontar el componente
  onUnmounted(() => {
    // No desconectar aquí, dejar que el store maneje la conexión
  });

  return {
    socket,
    connected,
    error,
    conectar,
    desconectar,
    emitir,
    escuchar,
    dejarDeEscuchar,
  };
}

