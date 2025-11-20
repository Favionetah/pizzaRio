const User = require('../models/user.model');
const Order = require('../models/order.model');

const AdminController = {};

// ===== GESTIÓN DE USUARIOS =====

// Obtener todos los usuarios
AdminController.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener usuario por ID
AdminController.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear nuevo usuario/empleado
AdminController.createUser = async (req, res) => {
    try {
        const { username, password, name, phone, role } = req.body;

        // Validaciones
        if (!username || !password || !name || !role) {
            return res.status(400).json({ message: 'Usuario, contraseña, nombre y rol son requeridos' });
        }

        if (!['ADMIN', 'CASHIER', 'CLIENT'].includes(role)) {
            return res.status(400).json({ message: 'Rol inválido' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        const userId = await User.create({
            username,
            password,
            name,
            phone: phone || null,
            role
        });

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            userId
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar usuario
AdminController.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, role } = req.body;

        if (!name || !role) {
            return res.status(400).json({ message: 'Nombre y rol son requeridos' });
        }

        if (!['ADMIN', 'CASHIER', 'CLIENT'].includes(role)) {
            return res.status(400).json({ message: 'Rol inválido' });
        }

        const updated = await User.update(id, {
            name,
            phone: phone || null,
            role
        });

        if (!updated) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente' });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar usuario
AdminController.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir eliminar al mismo usuario
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
        }

        const deleted = await User.delete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// ===== REPORTES DE VENTAS =====

// Obtener reporte completo de ventas
AdminController.getSalesReport = async (req, res) => {
    try {
        const { start_date, end_date, cashier_id } = req.query;

        const filters = {};
        if (start_date) filters.start_date = start_date;
        if (end_date) filters.end_date = end_date;
        if (cashier_id) filters.cashier_id = cashier_id;

        const orders = await Order.getSalesReport(filters);
        const summary = await Order.getSalesSummary(filters);

        res.status(200).json({
            summary,
            orders
        });

    } catch (error) {
        console.error('Error al obtener reporte de ventas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = AdminController;
