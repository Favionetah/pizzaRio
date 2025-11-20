const Order = require('../models/order.model');

const PosController = {};

// Obtener reporte de turno del cajero
PosController.getShiftReport = async (req, res) => {
    try {
        // El cajero solo puede ver sus propias ventas
        const cashier_id = req.user.id;
        
        // Obtener fecha de hoy (desde las 00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start_date = today.toISOString();

        const filters = {
            cashier_id: cashier_id,
            start_date: start_date
        };

        const orders = await Order.getSalesReport(filters);
        const summary = await Order.getSalesSummary(filters);

        res.status(200).json({
            cashier: {
                id: req.user.id,
                name: req.user.username
            },
            date: today.toLocaleDateString(),
            summary,
            orders
        });

    } catch (error) {
        console.error('Error al obtener reporte de turno:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = PosController;
