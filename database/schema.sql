-- Base de datos Pizza Rio - Schema Simplificado
CREATE DATABASE IF NOT EXISTS pizzeriario_db;
USE pizzeriario_db;

-- Tabla de Usuarios (unifica clientes y empleados)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('ADMIN', 'CASHIER', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Productos (Pizzas, Bebidas, Complementos)
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category ENUM('PIZZA', 'DRINK', 'SIDE') NOT NULL,
    is_available BOOLEAN DEFAULT 1,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL, -- NULL si es pedido de invitado
    guest_name VARCHAR(100),
    guest_phone VARCHAR(20),
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    order_type ENUM('EAT_IN', 'TAKEOUT') NOT NULL,
    cashier_id INT, -- Empleado que atendió el pedido
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de Detalle de Pedidos
CREATE TABLE IF NOT EXISTS order_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price_at_sale DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_cashier ON orders(cashier_id);
CREATE INDEX idx_order_details_order ON order_details(order_id);
CREATE INDEX idx_order_details_product ON order_details(product_id);
