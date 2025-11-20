const Product = require('../models/product.model');

const ProductController = {};

// Obtener todos los productos disponibles (público)
ProductController.getAll = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener todos los productos incluyendo no disponibles (admin)
ProductController.getAllAdmin = async (req, res) => {
    try {
        const products = await Product.findAllAdmin();
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error al obtener productos (admin):', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener producto por ID
ProductController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error('Error al buscar producto:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener productos por categoría
ProductController.getByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.findByCategory(category);
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error al buscar productos por categoría:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear nuevo producto (admin)
ProductController.create = async (req, res) => {
    try {
        const { name, description, price, category, is_available, image_url } = req.body;

        // Validaciones
        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Nombre, precio y categoría son requeridos' });
        }

        if (!['PIZZA', 'DRINK', 'SIDE'].includes(category)) {
            return res.status(400).json({ message: 'Categoría inválida' });
        }

        const productId = await Product.create({
            name,
            description: description || null,
            price,
            category,
            is_available: is_available !== undefined ? is_available : 1,
            image_url: image_url || null
        });

        res.status(201).json({
            message: 'Producto creado exitosamente',
            productId
        });

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar producto (admin)
ProductController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, is_available, image_url } = req.body;

        // Validaciones
        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Nombre, precio y categoría son requeridos' });
        }

        if (!['PIZZA', 'DRINK', 'SIDE'].includes(category)) {
            return res.status(400).json({ message: 'Categoría inválida' });
        }

        const updated = await Product.update(id, {
            name,
            description,
            price,
            category,
            is_available,
            image_url
        });

        if (!updated) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente' });

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar producto (admin)
ProductController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.delete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar disponibilidad (admin)
ProductController.updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_available } = req.body;

        if (is_available === undefined) {
            return res.status(400).json({ message: 'El campo is_available es requerido' });
        }

        const updated = await Product.updateAvailability(id, is_available);

        if (!updated) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Disponibilidad actualizada exitosamente' });

    } catch (error) {
        console.error('Error al actualizar disponibilidad:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = ProductController;
