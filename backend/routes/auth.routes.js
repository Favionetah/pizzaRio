const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');//ruta de la autentificacion del login

router.post('/login', AuthController.login);
//se puede añadir mas rutas de autentificacion como: register

module.exports = router;
