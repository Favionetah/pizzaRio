const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'PARALELEPIPEDO_FELIPE_NEDURO_SECRETO_JWT';

const AuthController = {};

// Login
AuthController.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }

        // Buscar usuario
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Comparar contraseña
        const isPasswordCorrect = bcrypt.compareSync(password, user.password_hash);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Crear token JWT
        const token = jwt.sign(
            { 
                id: user.id,
                role: user.role,
                username: user.username
            }, 
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Responder con token y datos del usuario
        res.status(200).json({
            message: 'Login exitoso',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Registro de nuevos clientes
AuthController.register = async (req, res) => {
    try {
        const { username, password, name, phone } = req.body;

        // Validaciones
        if (!username || !password || !name) {
            return res.status(400).json({ message: 'Usuario, contraseña y nombre son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        // Crear usuario
        const userId = await User.create({
            username,
            password,
            name,
            phone: phone || null,
            role: 'CLIENT'
        });

        // Crear token JWT
        const token = jwt.sign(
            { 
                id: userId,
                role: 'CLIENT',
                username: username
            }, 
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token: token,
            user: {
                id: userId,
                username: username,
                name: name,
                role: 'CLIENT'
            }
        });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Verificar token JWT
AuthController.verify = async (req, res) => {
    try {
        // El middleware de autenticación ya verificó el token
        // req.user contiene los datos del token
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener perfil del usuario autenticado
AuthController.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = AuthController;
