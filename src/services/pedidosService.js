import api from './api';

// Despertar el backend con un health check
const wakeUpBackend = async () => {
  try {
    await fetch('https://backup-librio-backend.onrender.com/health', { 
      method: 'GET',
      mode: 'cors'
    });
    console.log('âœ… Backend despierto');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
  } catch (e) {
    console.log('â³ Backend despertando...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 3 segundos si falla
  }
};

// Helper function para reintentar requests con delay
const retryRequest = async (requestFn, retries = 3, delay = 3000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      const isNetworkError = error.code === 'ERR_NETWORK' || 
                            error.code === 'ERR_CONNECTION_RESET' ||
                            error.message === 'Network Error';
      
      if (i < retries && isNetworkError) {
        console.log(`í´„ Reintento ${i + 1}/${retries}... esperando ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Intentar despertar el backend antes de cada reintento
        if (i === 0) {
          await wakeUpBackend();
        }
      } else {
        throw error;
      }
    }
  }
};

export const pedidosService = {
  /**
   * Crear un nuevo pedido
   */
  async crearPedido(carrito) {
    try {
      // Despertar el backend ANTES del primer intento
      await wakeUpBackend();
      
      // Enviar solo los datos esenciales (sin url_img base64)
      const carritoSimplificado = carrito.map(item => ({
        id: item.id,
        precio: item.precio,
        count: item.count
      }));

      console.log('Enviando pedido con datos:', carritoSimplificado);
      console.log('Token presente:', !!localStorage.getItem('token'));

      const response = await retryRequest(() => 
        api.post('/pedidos', { carrito: carritoSimplificado })
      );
      
      return { success: true, pedido: response.data.pedido };
    } catch (error) {
      console.error('Error completo al crear pedido:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });

      const message = error.response?.data?.error || error.message || 'Error al crear el pedido';
      return { success: false, error: message };
    }
  },

  /**
   * Obtener pedidos del usuario autenticado
   */
  async obtenerPedidosUsuario() {
    try {
      const response = await retryRequest(() => api.get('/pedidos/usuario'));
      return { success: true, pedidos: response.data.pedidos };
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      const message = error.response?.data?.error || 'Error al obtener los pedidos';
      return { success: false, error: message };
    }
  },

  /**
   * Obtener detalle de un pedido especÃ­fico
   */
  async obtenerDetallePedido(pedidoId) {
    try {
      const response = await retryRequest(() => api.get(`/pedidos/${pedidoId}`));
      return { success: true, detalle: response.data };
    } catch (error) {
      console.error('Error al obtener detalle del pedido:', error);
      const message = error.response?.data?.error || 'Error al obtener el detalle del pedido';
      return { success: false, error: message };
    }
  }
};
