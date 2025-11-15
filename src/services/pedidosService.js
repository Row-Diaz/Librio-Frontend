import api from './api';

export const pedidosService = {
  /**
   * Crear un nuevo pedido
   */
  async crearPedido(carrito) {
    try {
      // Enviar solo los datos esenciales (sin url_img base64)
      const carritoSimplificado = carrito.map(item => ({
        id: item.id,
        precio: item.precio,
        count: item.count
      }));

      console.log('Enviando pedido con datos:', carritoSimplificado);
      console.log('Token presente:', !!localStorage.getItem('token'));
      
      const response = await api.post('/pedidos', { carrito: carritoSimplificado });
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
      const response = await api.get('/pedidos/usuario');
      return { success: true, pedidos: response.data.pedidos };
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      const message = error.response?.data?.error || 'Error al obtener los pedidos';
      return { success: false, error: message };
    }
  },

  /**
   * Obtener detalle de un pedido específico
   */
  async obtenerDetallePedido(pedidoId) {
    try {
      const response = await api.get(`/pedidos/${pedidoId}`);
      return { success: true, detalle: response.data };
    } catch (error) {
      console.error('Error al obtener detalle del pedido:', error);
      const message = error.response?.data?.error || 'Error al obtener el detalle del pedido';
      return { success: false, error: message };
    }
  }
};
