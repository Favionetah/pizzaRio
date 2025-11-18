const db = require('../config/db');

const OrderModel = {
  async createOrder(orderData) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const {
        CICliente,
        idSucursal,
        CIEmpleado,
        idPromocion = null,
        tipoPedido,
        totalPedido,
        descripcion = null,
        usuarioA = null,
        items = []
      } = orderData;

      const [resPedido] = await conn.query(
        `INSERT INTO TPedidos (CICliente, idSucursal, CIEmpleado, idPromocion, tipoPedido, estadoPedido, totalPedido, descripcion, usuarioA)
         VALUES (?, ?, ?, ?, ?, 'Pendiente', ?, ?, ?)`,
        [CICliente, idSucursal, CIEmpleado, idPromocion, tipoPedido, totalPedido, descripcion, usuarioA]
      );

      const idPedido = resPedido.insertId;

      // Insertar detalles
      for (const item of items) {
        const { idPizza = null, idProducto = null, cantidad, precioUnitario, subtotal, descripcion: descItem = null } = item;
        await conn.query(
          `INSERT INTO TDetallePedidos (idPedido, idPizza, idProducto, cantidad, precioUnitario, subtotal, descripcion, usuarioA)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [idPedido, idPizza, idProducto, cantidad, precioUnitario, subtotal, descItem, usuarioA]
        );
      }

      await conn.commit();

      return idPedido;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async getOrderById(idPedido) {
    const [rows] = await db.query('SELECT * FROM TPedidos WHERE idPedido = ?', [idPedido]);
    if (!rows || rows.length === 0) return null;
    const order = rows[0];
    const [details] = await db.query('SELECT * FROM TDetallePedidos WHERE idPedido = ?', [idPedido]);
    order.items = details || [];
    return order;
  },

  async getOrdersByClient(CICliente) {
    const [orders] = await db.query('SELECT * FROM TPedidos WHERE CICliente = ? ORDER BY fechaPedido DESC', [CICliente]);
    if (!orders || orders.length === 0) return [];
    // Attach items for each order
    for (const o of orders) {
      const [details] = await db.query('SELECT * FROM TDetallePedidos WHERE idPedido = ?', [o.idPedido]);
      o.items = details || [];
    }
    return orders;
  },

  async getPendingOrders() {
    const [orders] = await db.query("SELECT * FROM TPedidos WHERE estadoPedido = 'Pendiente' ORDER BY fechaPedido ASC");
    for (const o of orders) {
      const [details] = await db.query('SELECT * FROM TDetallePedidos WHERE idPedido = ?', [o.idPedido]);
      o.items = details || [];
    }
    return orders;
  },

  async getDeliveredOrders() {
    const [orders] = await db.query("SELECT * FROM TPedidos WHERE estadoPedido = 'Entregado' ORDER BY fechaPedido DESC");
    for (const o of orders) {
      const [details] = await db.query('SELECT * FROM TDetallePedidos WHERE idPedido = ?', [o.idPedido]);
      o.items = details || [];
    }
    return orders;
  },

  async updateOrderStatus(idPedido, newStatus) {
    const [res] = await db.query('UPDATE TPedidos SET estadoPedido = ? WHERE idPedido = ?', [newStatus, idPedido]);
    return res.affectedRows > 0;
  }
};

module.exports = OrderModel;
