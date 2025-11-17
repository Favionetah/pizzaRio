/proyecto_pizzeria/
├── 📂 backend/         // Todo tu código de NodeJS (servidor, API)
│   ├── 📂 config/
│   │   └── db.js       // Configuración de la conexión a MySQL
│   │
│   ├── 📂 controllers/ // Lógica de negocio
│   │   ├── auth.controller.js    // Iniciar sesión, registrarse
│   │   ├── product.controller.js // Obtener pizzas, bebidas, etc.
│   │   └── order.controller.js   // Crear orden, ver órdenes
│   │
│   ├── 📂 middleware/
│   │   └── auth.js     // Verifica el token (JWT) y el ROL (si es 'cliente' o 'cajero')
│   │
│   ├── 📂 models/      // Lógica de la base de datos (consultas SQL)
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   └── order.model.js
│   │
│   ├── 📂 routes/      // Define las rutas de tu API
│   │   ├── auth.routes.js    // POST /api/auth/login
│   │   ├── client.routes.js  // GET /api/products, POST /api/orders
│   │   └── pos.routes.js     // GET /api/orders/pending, PUT /api/orders/complete/:id
│   │
│   ├── server.js       // El archivo principal que inicia el servidor (Express)
│   └── package.json
│
├── 📂 frontend/        // Todo tu HTML, CSS y JS del lado del cliente
│   │
│   ├── 📂 client-app/    // <-- Aplicación para el CLIENTE
│   │   ├── index.html    // Menú principal
│   │   ├── cart.html     // Carrito de compras y checkout
│   │   ├── my-orders.html// Historial de pedidos
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── main.js   // Lógica del menú
│   │       └── cart.js   // Lógica del carrito
│   │
│   ├── 📂 pos-app/       // <-- Aplicación para el CAJERO (Punto de Venta)
│   │   ├── index.html    // Dashboard para tomar órdenes
│   │   ├── queue.html    // Cola de pedidos pendientes
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── main.js   // Lógica para crear un nuevo pedido
│   │       └── queue.js  // Lógica para gestionar la cola
│   │
│   ├── 📂 common/        // Archivos compartidos por ambas apps (cliente y pos)
│   │   ├── img/
│   │   │   ├── logo.png
│   │   │   └── pizza_foto.jpg
│   │   └── js/
│   │       └── api.js    // (Opcional) Funciones para hacer 'fetch' al backend
│   │
│   ├── login.html        // La página de inicio de sesión (COMÚN para ambos)
│   ├── login.css
│   └── login.js          // JS que maneja el login y REDIRIGE
│
├── 📂 database/
│   └── schema.sql      // Script para crear tus tablas (users, products, orders)
│
└── README.md