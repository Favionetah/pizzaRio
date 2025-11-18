const OrderModel = require('../models/order.model');

const OrderController = {};

OrderController.createOrder = async (req, res) => {
  try {
    const payload = req.body;

    // Basic validation
    if (!payload.CICliente || !payload.idSucursal || !payload.CIEmpleado || !payload.tipoPedido || !Array.isArray(payload.items) || payload.items.length === 0) {
      return res.status(400).json({ message: 'Faltan campos requeridos en el pedido' });
    }

    // Validate totals
    const sumSubtotal = payload.items.reduce((s, it) => s + (Number(it.subtotal) || 0), 0);
    if (Math.abs(sumSubtotal - Number(payload.totalPedido || 0)) > 0.01) {
      return res.status(400).json({ message: 'Total del pedido no coincide con la suma de subtotales' });
    }

    const idPedido = await OrderModel.createOrder(payload);
    const order = await OrderModel.getOrderById(idPedido);
    return res.status(201).json({ message: 'Pedido creado', idPedido, order });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error al crear el pedido' });
  }
};

OrderController.getMyOrders = async (req, res) => {
  try {
    // Prefer query param ci, fallback to req.user.id if role indicates cliente
    const ci = req.query.ci || (req.user && req.user.role === 'Cliente' ? req.user.id : null);
    if (!ci) return res.status(400).json({ message: 'CI de cliente requerido (query ?ci=) o autenticar como Cliente' });

    const orders = await OrderModel.getOrdersByClient(ci);
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error getMyOrders:', error);
    return res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

OrderController.getPendingOrders = async (req, res) => {
  try {
    const orders = await OrderModel.getPendingOrders();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error getPendingOrders:', error);
    return res.status(500).json({ message: 'Error al obtener pedidos pendientes' });
  }
};

OrderController.getDeliveredOrders = async (req, res) => {
  try {
    const orders = await OrderModel.getDeliveredOrders();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error getDeliveredOrders:', error);
    return res.status(500).json({ message: 'Error al obtener pedidos entregados' });
  }
};

OrderController.updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { estadoPedido } = req.body;
    const allowed = ['Pendiente', 'En preparación', 'En camino', 'Entregado', 'Cancelado'];
    if (!allowed.includes(estadoPedido)) return res.status(400).json({ message: 'Estado no permitido' });

    const ok = await OrderModel.updateOrderStatus(id, estadoPedido);
    if (!ok) return res.status(404).json({ message: 'Pedido no encontrado' });
    return res.status(200).json({ message: 'Estado actualizado' });
  } catch (error) {
    console.error('Error updateOrderStatus:', error);
    return res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

module.exports = OrderController;
