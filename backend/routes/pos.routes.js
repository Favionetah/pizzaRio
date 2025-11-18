const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/checkRole');

// Rutas POS protegidas: sólo Administrador o Cajero
router.get('/orders/pending', authMiddleware.requireAuth, checkRole('Administrador','Cajero'), OrderController.getPendingOrders);
router.put('/orders/:id/status', authMiddleware.requireAuth, checkRole('Administrador','Cajero'), OrderController.updateOrderStatus);

module.exports = router;
