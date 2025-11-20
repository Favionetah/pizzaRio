const db = require('../config/db');

const Order = {};

// Crear nuevo pedido con sus detalles
Order.create = async (orderData) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { user_id, guest_name, guest_phone, total_amount, order_type, cashier_id, items } = orderData;

        // Insertar el pedido
        const orderQuery = 'INSERT INTO orders (user_id, guest_name, guest_phone, total_amount, order_type, cashier_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [orderResult] = await connection.query(orderQuery, [
            user_id || null,
            guest_name || null,
            guest_phone || null,
            total_amount,
            order_type,
            cashier_id || null,
            'PENDING'
        ]);

        const orderId = orderResult.insertId;

        // Insertar detalles del pedido
        const detailQuery = 'INSERT INTO order_details (order_id, product_id, quantity, unit_price_at_sale, subtotal) VALUES (?, ?, ?, ?, ?)';
        
        for (const item of items) {
            await connection.query(detailQuery, [
                orderId,
                item.product_id,
                item.quantity,
                item.unit_price_at_sale,
                item.subtotal
            ]);
        }

        await connection.commit();
        return orderId;

    } catch (error) {
        await connection.rollback();
        console.error('Error al crear pedido:', error);
        throw error;
    } finally {
        connection.release();
    }
};

// Obtener pedido por ID con sus detalles
Order.findById = async (id) => {
    try {
        // Obtener información del pedido
        const orderQuery = `
            SELECT o.*, 
                   u.name as client_name, u.phone as client_phone,
                   c.name as cashier_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN users c ON o.cashier_id = c.id
            WHERE o.id = ?
        `;
        const [orderRows] = await db.query(orderQuery, [id]);
        
        if (orderRows.length === 0) {
            return null;
        }

        const order = orderRows[0];

        // Obtener detalles del pedido
        const detailsQuery = `
            SELECT od.*, p.name as product_name, p.category
            FROM order_details od
            JOIN products p ON od.product_id = p.id
            WHERE od.order_id = ?
        `;
        const [detailsRows] = await db.query(detailsQuery, [id]);

        order.items = detailsRows;
        return order;

    } catch (error) {
        console.error('Error al buscar pedido por ID:', error);
        throw error;
    }
};

// Obtener historial de pedidos de un usuario
Order.findByUserId = async (userId) => {
    try {
        const query = `
            SELECT o.*, 
                   COUNT(od.id) as item_count
            FROM orders o
            LEFT JOIN order_details od ON o.id = od.order_id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error al buscar pedidos por usuario:', error);
        throw error;
    }
};

// Obtener pedidos pendientes (para TPV)
Order.findPending = async () => {
    try {
        const query = `
            SELECT o.*, 
                   u.name as client_name,
                   COUNT(od.id) as item_count
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN order_details od ON o.id = od.order_id
            WHERE o.status IN ('PENDING', 'PREPARING', 'READY')
            GROUP BY o.id
            ORDER BY o.created_at ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error al buscar pedidos pendientes:', error);
        throw error;
    }
};

// Actualizar estado del pedido
Order.updateStatus = async (id, status) => {
    try {
        const query = 'UPDATE orders SET status = ? WHERE id = ?';
        const [result] = await db.query(query, [status, id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        throw error;
    }
};

// Obtener reportes de ventas con filtros
Order.getSalesReport = async (filters = {}) => {
    try {
        let query = `
            SELECT 
                o.id,
                o.created_at,
                o.total_amount,
                o.status,
                o.order_type,
                COALESCE(u.name, o.guest_name) as client_name,
                c.name as cashier_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN users c ON o.cashier_id = c.id
            WHERE o.status IN ('COMPLETED', 'READY')
        `;

        const params = [];

        if (filters.start_date) {
            query += ' AND o.created_at >= ?';
            params.push(filters.start_date);
        }

        if (filters.end_date) {
            query += ' AND o.created_at <= ?';
            params.push(filters.end_date);
        }

        if (filters.cashier_id) {
            query += ' AND o.cashier_id = ?';
            params.push(filters.cashier_id);
        }

        query += ' ORDER BY o.created_at DESC';

        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error al obtener reporte de ventas:', error);
        throw error;
    }
};

// Obtener resumen de ventas
Order.getSalesSummary = async (filters = {}) => {
    try {
        let query = `
            SELECT 
                COUNT(*) as total_orders,
                SUM(total_amount) as total_sales,
                AVG(total_amount) as average_sale
            FROM orders
            WHERE status IN ('COMPLETED', 'READY')
        `;

        const params = [];

        if (filters.start_date) {
            query += ' AND created_at >= ?';
            params.push(filters.start_date);
        }

        if (filters.end_date) {
            query += ' AND created_at <= ?';
            params.push(filters.end_date);
        }

        if (filters.cashier_id) {
            query += ' AND cashier_id = ?';
            params.push(filters.cashier_id);
        }

        const [rows] = await db.query(query, params);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener resumen de ventas:', error);
        throw error;
    }
};

module.exports = Order;
