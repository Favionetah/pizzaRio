const db = require('../config/db');

const Product = {};

// Obtener todos los productos disponibles
Product.findAll = async () => {
    try {
        const query = 'SELECT * FROM products WHERE is_available = 1 ORDER BY category, name';
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
};

// Obtener todos los productos (incluyendo no disponibles) - Admin
Product.findAllAdmin = async () => {
    try {
        const query = 'SELECT * FROM products ORDER BY category, name';
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener productos (admin):', error);
        throw error;
    }
};

// Obtener producto por ID
Product.findById = async (id) => {
    try {
        const query = 'SELECT * FROM products WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error al buscar producto por ID:', error);
        throw error;
    }
};

// Obtener productos por categoría
Product.findByCategory = async (category) => {
    try {
        const query = 'SELECT * FROM products WHERE category = ? AND is_available = 1 ORDER BY name';
        const [rows] = await db.query(query, [category]);
        return rows;
    } catch (error) {
        console.error('Error al buscar productos por categoría:', error);
        throw error;
    }
};

// Crear nuevo producto
Product.create = async (productData) => {
    try {
        const { name, description, price, category, is_available, image_url } = productData;
        const query = 'INSERT INTO products (name, description, price, category, is_available, image_url) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [name, description, price, category, is_available !== undefined ? is_available : 1, image_url]);
        return result.insertId;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
    }
};

// Actualizar producto
Product.update = async (id, productData) => {
    try {
        const { name, description, price, category, is_available, image_url } = productData;
        const query = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, is_available = ?, image_url = ? WHERE id = ?';
        const [result] = await db.query(query, [name, description, price, category, is_available, image_url, id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw error;
    }
};

// Eliminar producto
Product.delete = async (id) => {
    try {
        const query = 'DELETE FROM products WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw error;
    }
};

// Actualizar disponibilidad
Product.updateAvailability = async (id, is_available) => {
    try {
        const query = 'UPDATE products SET is_available = ? WHERE id = ?';
        const [result] = await db.query(query, [is_available, id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar disponibilidad:', error);
        throw error;
    }
};

module.exports = Product;
