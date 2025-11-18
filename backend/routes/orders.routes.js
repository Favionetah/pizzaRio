const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Crear pedido (cliente)
router.post('/', authMiddleware.optionalAuth, OrderController.createOrder);

// Historial del cliente
router.get('/my-history', authMiddleware.optionalAuth, OrderController.getMyOrders);

module.exports = router;
