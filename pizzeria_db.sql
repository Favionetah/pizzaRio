-- Base de datos para sistema de pizzería
CREATE DATABASE IF NOT EXISTS pizzeria_db;
USE pizzeria_db;

-- Tabla de Roles
CREATE TABLE TRoles (
    idRol INT PRIMARY KEY AUTO_INCREMENT,
    nombreRol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de Usuarios
CREATE TABLE TUsuarios (
    idUsuario VARCHAR(50) PRIMARY KEY, 
    idRol INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idRol) REFERENCES TRoles(idRol)
);

-- Tabla de Departamentos
CREATE TABLE TDepartamentos (
    idDepartamento VARCHAR(5) PRIMARY KEY,
    nombreDepartamento VARCHAR(25) NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de Ciudades
CREATE TABLE TCiudades (
    idCiudad VARCHAR(10) PRIMARY KEY,
    idDepartamento VARCHAR(5) NOT NULL,
    nombreCiudad VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idDepartamento) REFERENCES TDepartamentos(idDepartamento)
);

-- Tabla de Sucursales
CREATE TABLE TSucursales (
    idSucursal VARCHAR(10) PRIMARY KEY,
    idCiudad VARCHAR(10) NOT NULL,
    nombreSucursal VARCHAR(50) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idCiudad) REFERENCES TCiudades(idCiudad)
);

-- Tabla de Empleados
CREATE TABLE TEmpleados (
    CIEmpleado VARCHAR(20) PRIMARY KEY,
    idUsuario VARCHAR(50) NOT NULL,
    idSucursal VARCHAR(10) NOT NULL,
    nombre1 VARCHAR(50) NOT NULL,
    nombre2 VARCHAR(50),
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    fechaNacimiento DATE,
    fechaContratacion DATE,
    salario DECIMAL(10,2),
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idUsuario) REFERENCES TUsuarios(idUsuario),
    FOREIGN KEY (idSucursal) REFERENCES TSucursales(idSucursal)
);

-- Tabla de Horarios
CREATE TABLE THorarios (
    idHorario INT PRIMARY KEY AUTO_INCREMENT,
    nombreHorario VARCHAR(50) NOT NULL,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de Horarios de Empleados (relación muchos a muchos)
CREATE TABLE THorariosEmpleados (
    idHorarioEmpleado INT PRIMARY KEY AUTO_INCREMENT,
    CIEmpleado VARCHAR(20) NOT NULL,
    idHorario INT NOT NULL,
    diaSemana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (CIEmpleado) REFERENCES TEmpleados(CIEmpleado),
    FOREIGN KEY (idHorario) REFERENCES THorarios(idHorario)
);

-- Tabla de Clientes
CREATE TABLE TClientes (
    CICliente VARCHAR(20) PRIMARY KEY,
    nombre1 VARCHAR(50) NOT NULL,
    nombre2 VARCHAR(50),
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion VARCHAR(255),
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de Categorías de Pizza
CREATE TABLE TCategoriasPizza (
    idCategoria INT PRIMARY KEY AUTO_INCREMENT,
    nombreCategoria ENUM('Normal', 'Bordes Rellenos', 'Mitad-Mitad') NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de Pizzas
CREATE TABLE TPizza (
    idPizza VARCHAR(10) PRIMARY KEY,
    idCategoria INT NOT NULL,
    nombrePizza VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2),
    imagen VARCHAR(255),
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idCategoria) REFERENCES TCategoriasPizza(idCategoria)
);

-- Tabla de Ingredientes
CREATE TABLE TIngredientes (
    idIngrediente INT PRIMARY KEY AUTO_INCREMENT,
    nombreIngrediente VARCHAR(100) NOT NULL,
    unidadMedida VARCHAR(20),
    precioUnitario DECIMAL(10,2),
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de relación Pizza-Ingredientes (muchos a muchos)
CREATE TABLE TPizzaIngredientes (
    idPizzaIngrediente INT PRIMARY KEY AUTO_INCREMENT,
    idPizza VARCHAR(10) NOT NULL,
    idIngrediente INT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idPizza) REFERENCES TPizza(idPizza),
    FOREIGN KEY (idIngrediente) REFERENCES TIngredientes(idIngrediente)
);

-- Tabla de Productos (bebidas, complementos, etc.)
CREATE TABLE TProductos (
    idProducto VARCHAR(10) PRIMARY KEY,
    nombreProducto VARCHAR(100) NOT NULL,
    tipoProducto ENUM('Bebida', 'Complemento', 'Postre', 'Otros') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de Inventario
CREATE TABLE TInventario (
    idInventario INT PRIMARY KEY AUTO_INCREMENT,
    idSucursal VARCHAR(10) NOT NULL,
    idIngrediente INT,
    idProducto VARCHAR(10),
    cantidadDisponible DECIMAL(10,2) NOT NULL,
    stockMinimo DECIMAL(10,2),
    stockMaximo DECIMAL(10,2),
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idSucursal) REFERENCES TSucursales(idSucursal),
    FOREIGN KEY (idIngrediente) REFERENCES TIngredientes(idIngrediente),
    FOREIGN KEY (idProducto) REFERENCES TProductos(idProducto),
    CHECK ((idIngrediente IS NOT NULL AND idProducto IS NULL) OR 
           (idIngrediente IS NULL AND idProducto IS NOT NULL))
);

-- Tabla de Métodos de Pago
CREATE TABLE TMetodosPago (
    idMetodoPago INT PRIMARY KEY AUTO_INCREMENT,
    nombreMetodo ENUM('Tarjeta', 'QR', 'Efectivo') NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de Promociones
CREATE TABLE TPromociones (
    idPromocion VARCHAR(10) PRIMARY KEY,
    nombrePromocion VARCHAR(100) NOT NULL,
    descuentoPorcentaje DECIMAL(5,2),
    descuentoMonto DECIMAL(10,2),
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50)
);

-- Tabla de Pedidos
CREATE TABLE TPedidos (
    idPedido INT PRIMARY KEY AUTO_INCREMENT,
    CICliente VARCHAR(20) NOT NULL,
    idSucursal VARCHAR(10) NOT NULL,
    CIEmpleado VARCHAR(20) NOT NULL,
    idPromocion VARCHAR(10),
    fechaPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipoPedido ENUM('Local', 'Para llevar') NOT NULL,
    estadoPedido ENUM('Pendiente', 'En preparación', 'En camino', 'Entregado', 'Cancelado') DEFAULT 'Pendiente',
    totalPedido DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (CICliente) REFERENCES TClientes(CICliente),
    FOREIGN KEY (idSucursal) REFERENCES TSucursales(idSucursal),
    FOREIGN KEY (CIEmpleado) REFERENCES TEmpleados(CIEmpleado),
    FOREIGN KEY (idPromocion) REFERENCES TPromociones(idPromocion)
);

-- Tabla de Detalle de Pedidos
CREATE TABLE TDetallePedidos (
    idDetallePedido INT PRIMARY KEY AUTO_INCREMENT,
    idPedido INT NOT NULL,
    idPizza VARCHAR(10),
    idProducto VARCHAR(10),
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idPedido) REFERENCES TPedidos(idPedido),
    FOREIGN KEY (idPizza) REFERENCES TPizza(idPizza),
    FOREIGN KEY (idProducto) REFERENCES TProductos(idProducto),
    CHECK ((idPizza IS NOT NULL AND idProducto IS NULL) OR 
           (idPizza IS NULL AND idProducto IS NOT NULL))
);

-- Tabla de Facturas
CREATE TABLE TFacturas (
    idFactura INT PRIMARY KEY AUTO_INCREMENT,
    idPedido INT NOT NULL UNIQUE,
    numeroFactura VARCHAR(50) NOT NULL UNIQUE,
    nit VARCHAR(20),
    razonSocial VARCHAR(200),
    fechaEmision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    totalFactura DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idPedido) REFERENCES TPedidos(idPedido)
);

-- Tabla de Ventas
CREATE TABLE TVentas (
    idVenta INT PRIMARY KEY AUTO_INCREMENT,
    idFactura INT NOT NULL,
    idMetodoPago INT NOT NULL,
    montoPagado DECIMAL(10,2) NOT NULL,
    montoCambio DECIMAL(10,2),
    fechaVenta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idFactura) REFERENCES TFacturas(idFactura),
    FOREIGN KEY (idMetodoPago) REFERENCES TMetodosPago(idMetodoPago)
);

-- Tabla de Detalle de Ventas (para múltiples métodos de pago)
CREATE TABLE TDetalleVentas (
    idDetalleVenta INT PRIMARY KEY AUTO_INCREMENT,
    idVenta INT NOT NULL,
    idMetodoPago INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estadoA BOOLEAN DEFAULT 1,
    fechaA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuarioA VARCHAR(50),
    FOREIGN KEY (idVenta) REFERENCES TVentas(idVenta),
    FOREIGN KEY (idMetodoPago) REFERENCES TMetodosPago(idMetodoPago)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_rol ON TUsuarios(idRol);
CREATE INDEX idx_ciudades_depto ON TCiudades(idDepartamento);
CREATE INDEX idx_sucursales_ciudad ON TSucursales(idCiudad);
CREATE INDEX idx_empleados_sucursal ON TEmpleados(idSucursal);
CREATE INDEX idx_pedidos_cliente ON TPedidos(CICliente);
CREATE INDEX idx_pedidos_sucursal ON TPedidos(idSucursal);
CREATE INDEX idx_pedidos_fecha ON TPedidos(fechaPedido);
CREATE INDEX idx_facturas_pedido ON TFacturas(idPedido);
CREATE INDEX idx_ventas_fecha ON TVentas(fechaVenta);