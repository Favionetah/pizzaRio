const express = require('express');
const router = express.Router();
const PosController = require('../controllers/pos.controller');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Todas las rutas requieren autenticación y rol CASHIER o ADMIN
router.use(authMiddleware);
router.use(checkRole(['CASHIER', 'ADMIN']));

// Reporte de turno del cajero
router.get('/reports/shift', PosController.getShiftReport);

module.exports = router;
