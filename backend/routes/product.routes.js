const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Rutas públicas
router.get('/', ProductController.getAll); // Obtener productos disponibles
router.get('/category/:category', ProductController.getByCategory); // Por categoría

// Rutas protegidas - Admin solamente
router.get('/admin/all', authMiddleware, checkRole(['ADMIN']), ProductController.getAllAdmin);
router.get('/:id', authMiddleware, checkRole(['ADMIN']), ProductController.getById);
router.post('/', authMiddleware, checkRole(['ADMIN']), ProductController.create);
router.put('/:id', authMiddleware, checkRole(['ADMIN']), ProductController.update);
router.delete('/:id', authMiddleware, checkRole(['ADMIN']), ProductController.delete);
router.patch('/:id/availability', authMiddleware, checkRole(['ADMIN']), ProductController.updateAvailability);

module.exports = router;
