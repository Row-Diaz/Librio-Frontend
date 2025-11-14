import api from './api';

export const pedidosService = {
  /**
   * Crear un nuevo pedido
   */
  async crearPedido(carrito) {
    try {
      const response = await api.post('/pedidos', { carrito });
      return { success: true, pedido: response.data.pedido };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      const message = error.response?.data?.error || 'Error al crear el pedido';
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
