-- Datos de prueba para Pizza Rio
USE pizzeriario_db;

-- Usuarios de prueba
-- Contraseña para todos: "password123" (hash bcrypt)
INSERT INTO users (username, password_hash, name, phone, role) VALUES
('admin', '$2a$10$X3lHQ/0YJZ8gDX1x7W0Rq.5fzJ8cU9KQN8xGx5j5Qd0Z0p5e0z0Y0', 'Administrador', '70000001', 'ADMIN'),
('cajero1', '$2a$10$X3lHQ/0YJZ8gDX1x7W0Rq.5fzJ8cU9KQN8xGx5j5Qd0Z0p5e0z0Y0', 'Juan Pérez', '70000002', 'CASHIER'),
('cajero2', '$2a$10$X3lHQ/0YJZ8gDX1x7W0Rq.5fzJ8cU9KQN8xGx5j5Qd0Z0p5e0z0Y0', 'María González', '70000003', 'CASHIER'),
('cliente1', '$2a$10$X3lHQ/0YJZ8gDX1x7W0Rq.5fzJ8cU9KQN8xGx5j5Qd0Z0p5e0z0Y0', 'Carlos Rodríguez', '70000004', 'CLIENT'),
('cliente2', '$2a$10$X3lHQ/0YJZ8gDX1x7W0Rq.5fzJ8cU9KQN8xGx5j5Qd0Z0p5e0z0Y0', 'Ana López', '70000005', 'CLIENT');

-- Productos de prueba - PIZZAS
INSERT INTO products (name, description, price, category, is_available, image_url) VALUES
('Pizza Margherita', 'Salsa de tomate, mozzarella, albahaca fresca', 45.00, 'PIZZA', 1, '/images/pizza-margherita.jpg'),
('Pizza Pepperoni', 'Salsa de tomate, mozzarella, pepperoni', 50.00, 'PIZZA', 1, '/images/pizza-pepperoni.jpg'),
('Pizza Hawaiana', 'Salsa de tomate, mozzarella, jamón, piña', 48.00, 'PIZZA', 1, '/images/pizza-hawaiana.jpg'),
('Pizza Vegetariana', 'Salsa de tomate, mozzarella, pimientos, champiñones, cebolla', 47.00, 'PIZZA', 1, '/images/pizza-vegetariana.jpg'),
('Pizza 4 Quesos', 'Mozzarella, parmesano, gorgonzola, provolone', 55.00, 'PIZZA', 1, '/images/pizza-4quesos.jpg'),
('Pizza Carnívora', 'Salsa de tomate, mozzarella, pepperoni, salchicha, tocino, jamón', 58.00, 'PIZZA', 1, '/images/pizza-carnivora.jpg');

-- Productos de prueba - BEBIDAS
INSERT INTO products (name, description, price, category, is_available, image_url) VALUES
('Coca Cola 500ml', 'Refresco de cola', 8.00, 'DRINK', 1, '/images/coca-cola.jpg'),
('Sprite 500ml', 'Refresco de lima-limón', 8.00, 'DRINK', 1, '/images/sprite.jpg'),
('Fanta 500ml', 'Refresco de naranja', 8.00, 'DRINK', 1, '/images/fanta.jpg'),
('Agua Mineral 500ml', 'Agua mineral natural', 5.00, 'DRINK', 1, '/images/agua.jpg'),
('Jugo Naranja Natural', 'Jugo natural de naranja', 12.00, 'DRINK', 1, '/images/jugo-naranja.jpg');

-- Productos de prueba - COMPLEMENTOS
INSERT INTO products (name, description, price, category, is_available, image_url) VALUES
('Alitas de Pollo (6 pzs)', 'Alitas de pollo picantes', 35.00, 'SIDE', 1, '/images/alitas.jpg'),
('Palitos de Ajo', 'Pan con mantequilla de ajo', 20.00, 'SIDE', 1, '/images/palitos-ajo.jpg'),
('Ensalada Caesar', 'Lechuga, crutones, parmesano, aderezo caesar', 25.00, 'SIDE', 1, '/images/ensalada.jpg'),
('Papas Fritas', 'Porción de papas fritas', 18.00, 'SIDE', 1, '/images/papas.jpg');

-- Pedidos de ejemplo
INSERT INTO orders (user_id, guest_name, guest_phone, total_amount, status, order_type, cashier_id, created_at) VALUES
(4, NULL, NULL, 103.00, 'COMPLETED', 'EAT_IN', 2, '2025-11-19 10:30:00'),
(5, NULL, NULL, 56.00, 'COMPLETED', 'TAKEOUT', 2, '2025-11-19 11:15:00'),
(NULL, 'José Martínez', '70123456', 85.00, 'READY', 'EAT_IN', 2, '2025-11-20 01:00:00'),
(4, NULL, NULL, 60.00, 'PREPARING', 'TAKEOUT', 3, '2025-11-20 02:30:00');

-- Detalles de pedidos
-- Pedido 1: Pizza Pepperoni + Pizza 4 Quesos
INSERT INTO order_details (order_id, product_id, quantity, unit_price_at_sale, subtotal) VALUES
(1, 2, 1, 50.00, 50.00),
(1, 5, 1, 55.00, 55.00);

-- Pedido 2: Pizza Hawaiana + Coca Cola
INSERT INTO order_details (order_id, product_id, quantity, unit_price_at_sale, subtotal) VALUES
(2, 3, 1, 48.00, 48.00),
(2, 7, 1, 8.00, 8.00);

-- Pedido 3: Pizza Carnívora + Alitas + Sprite
INSERT INTO order_details (order_id, product_id, quantity, unit_price_at_sale, subtotal) VALUES
(3, 6, 1, 58.00, 58.00),
(3, 12, 1, 20.00, 20.00),
(3, 8, 1, 8.00, 8.00);

-- Pedido 4: Pizza Margherita + Agua
INSERT INTO order_details (order_id, product_id, quantity, unit_price_at_sale, subtotal) VALUES
(4, 1, 1, 45.00, 45.00),
(4, 10, 2, 5.00, 10.00);
