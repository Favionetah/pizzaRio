const Order = require('../models/order.model');

const OrderController = {};

// Crear nuevo pedido (público - invitado o cliente)
OrderController.create = async (req, res) => {
    try {
        const { items, order_type, guest_name, guest_phone } = req.body;

        // Validaciones
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'El pedido debe contener al menos un producto' });
        }

        if (!order_type || !['EAT_IN', 'TAKEOUT'].includes(order_type)) {
            return res.status(400).json({ message: 'Tipo de pedido inválido' });
        }

        // Si no hay usuario autenticado, debe proporcionar nombre y teléfono
        if (!req.user && (!guest_name || !guest_phone)) {
            return res.status(400).json({ message: 'Debes proporcionar nombre y teléfono' });
        }

        // Calcular total
        let total_amount = 0;
        const orderItems = items.map(item => {
            const subtotal = item.quantity * item.unit_price_at_sale;
            total_amount += subtotal;
            return {
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price_at_sale: item.unit_price_at_sale,
                subtotal: subtotal
            };
        });

        // Crear pedido
        const orderId = await Order.create({
            user_id: req.user ? req.user.id : null,
            guest_name: guest_name || null,
            guest_phone: guest_phone || null,
            total_amount: total_amount,
            order_type: order_type,
            cashier_id: null, // Se asigna después por el cajero si es necesario
            items: orderItems
        });

        res.status(201).json({
            message: 'Pedido creado exitosamente',
            orderId: orderId,
            total: total_amount
        });

    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener historial de pedidos del usuario autenticado
OrderController.getHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Debes estar autenticado' });
        }

        const orders = await Order.findByUserId(req.user.id);
        res.status(200).json({ orders });

    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener pedidos pendientes (TPV - Cajero/Admin)
OrderController.getPending = async (req, res) => {
    try {
        const orders = await Order.findPending();
        res.status(200).json({ orders });

    } catch (error) {
        console.error('Error al obtener pedidos pendientes:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener detalles de un pedido específico
OrderController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json({ order });

    } catch (error) {
        console.error('Error al obtener pedido:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar estado del pedido (Cajero/Admin)
OrderController.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        const updated = await Order.updateStatus(id, status);

        if (!updated) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Estado del pedido actualizado exitosamente' });

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = OrderController;
