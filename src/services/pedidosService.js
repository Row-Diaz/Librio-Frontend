// SOLUCIÓN SIMPLE: Guardar pedidos en localStorage (NO requiere backend)
export const pedidosService = {
  /**
   * Crear un nuevo pedido - Guardado LOCAL
   */
  async crearPedido(carrito) {
    try {
      const usuario = JSON.parse(localStorage.getItem("user") || "{}");

      const pedido = {
        id_pedido: Date.now(), // ID único basado en timestamp
        fecha_pedido: new Date().toISOString(),
        estado: true,
        monto_total: carrito.reduce(
          (total, item) => total + item.precio * item.count,
          0
        ),
        usuario_id: usuario.id_usuarios,
        items: carrito.map((item) => ({
          libro_id: item.id,
          titulo: item.titulo,
          cantidad: item.count,
          precio_unitario: item.precio,
        })),
      };

      // Obtener pedidos existentes
      const pedidosGuardados = JSON.parse(
        localStorage.getItem("pedidos") || "[]"
      );

      // Agregar nuevo pedido
      pedidosGuardados.push(pedido);

      // Guardar en localStorage
      localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));

      // ...

      return { success: true, pedido };
    } catch (error) {
      console.error("Error al crear pedido local:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener pedidos del usuario autenticado
   */
  async obtenerPedidosUsuario() {
    try {
      const usuario = JSON.parse(localStorage.getItem("user") || "{}");
      const todosPedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");

      // Filtrar solo pedidos del usuario actual
      const pedidosUsuario = todosPedidos.filter(
        (p) => p.usuario_id === usuario.id_usuarios
      );

      // ...

      return { success: true, pedidos: pedidosUsuario };
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener detalle de un pedido específico
   */
  async obtenerDetallePedido(pedidoId) {
    try {
      const todosPedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
      const pedido = todosPedidos.find(
        (p) => p.id_pedido === parseInt(pedidoId)
      );

      if (!pedido) {
        return { success: false, error: "Pedido no encontrado" };
      }

      return { success: true, detalle: pedido };
    } catch (error) {
      console.error("Error al obtener detalle del pedido:", error);
      return { success: false, error: error.message };
    }
  },
};
