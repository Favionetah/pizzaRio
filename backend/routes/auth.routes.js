const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

// Rutas públicas
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Rutas protegidas
router.get('/verify', authMiddleware, AuthController.verify);
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;
