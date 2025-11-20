const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Middleware opcional - permite rutas con o sin autenticación
const optionalAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authMiddleware(req, res, next);
    }
    next();
};

// Ruta pública/semi-pública (invitados y clientes)
router.post('/', optionalAuth, OrderController.create);

// Rutas protegidas - Cliente
router.get('/history', authMiddleware, checkRole(['CLIENT', 'CASHIER', 'ADMIN']), OrderController.getHistory);

// Rutas protegidas - Cajero/Admin
router.get('/pending', authMiddleware, checkRole(['CASHIER', 'ADMIN']), OrderController.getPending);
router.get('/:id', authMiddleware, checkRole(['CASHIER', 'ADMIN', 'CLIENT']), OrderController.getById);
router.put('/status/:id', authMiddleware, checkRole(['CASHIER', 'ADMIN']), OrderController.updateStatus);

module.exports = router;
