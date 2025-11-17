const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {};

AuthController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        // 3. Buscar al usuario (¡esto ahora usa el modelo actualizado!)
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas USUARIO' });
        }

        // 4. Comparar la contraseña (esto no cambia)
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenciales incorrectas CONTRASEÑA' });
        }

        // 5. ¡ÉXITO! Creamos el Token
        //    ¡Actualizamos los campos a 'user.idUsuario' y 'user.nombreRol' !
        const token = jwt.sign(
            { 
                id: user.idUsuario, // CAMBIO AQUÍ
                role: user.nombreRol // CAMBIO AQUÍ
            }, 
            'PARALELEPIPEDO_FELIPE_NEDURO_SECRETO_JWT',
            { expiresIn: '1h' }
        );

        // 6. Enviar la respuesta
        //    ¡Actualizamos el campo a 'user.nombreRol' !
        res.status(200).json({
            message: 'Login exitoso',
            token: token,
            role: user.nombreRol // CAMBIO AQUÍ
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = AuthController;