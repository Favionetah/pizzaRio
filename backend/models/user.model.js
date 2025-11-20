const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {};

// Buscar usuario por username (para login)
User.findByUsername = async (username) => {
    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.query(query, [username]);
        return rows[0];
    } catch (error) {
        console.error('Error al buscar usuario por username:', error);
        throw error;
    }
};

// Buscar usuario por ID
User.findById = async (id) => {
    try {
        const query = 'SELECT id, username, name, phone, role, created_at FROM users WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
        throw error;
    }
};

// Obtener todos los usuarios
User.findAll = async () => {
    try {
        const query = 'SELECT id, username, name, phone, role, created_at FROM users ORDER BY created_at DESC';
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

// Crear nuevo usuario
User.create = async (userData) => {
    try {
        const { username, password, name, phone, role } = userData;
        const password_hash = bcrypt.hashSync(password, 10);
        
        const query = 'INSERT INTO users (username, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [username, password_hash, name, phone, role || 'CLIENT']);
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

// Actualizar usuario
User.update = async (id, userData) => {
    try {
        const { name, phone, role } = userData;
        const query = 'UPDATE users SET name = ?, phone = ?, role = ? WHERE id = ?';
        const [result] = await db.query(query, [name, phone, role, id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

// Actualizar contraseña
User.updatePassword = async (id, newPassword) => {
    try {
        const password_hash = bcrypt.hashSync(newPassword, 10);
        const query = 'UPDATE users SET password_hash = ? WHERE id = ?';
        const [result] = await db.query(query, [password_hash, id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        throw error;
    }
};

// Eliminar usuario
User.delete = async (id) => {
    try {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
};

module.exports = User;
