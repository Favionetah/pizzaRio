const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Todas las rutas requieren autenticación y rol ADMIN
router.use(authMiddleware);
router.use(checkRole(['ADMIN']));

// Gestión de usuarios
router.get('/users', AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserById);
router.post('/users', AdminController.createUser);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// Reportes de ventas
router.get('/reports/sales', AdminController.getSalesReport);

module.exports = router;
