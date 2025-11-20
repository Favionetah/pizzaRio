/proyecto_pizzeria/
├── 📂 backend/
│   ├── 📂 config/
│   │   └── db.js
│   │
│   ├── 📂 controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   └── order.controller.js
│   │
│   ├── 📂 middleware/
│   │   └── auth.js       // Ahora verifica el token y el ROL (cliente, cajero, admin)
│   │
│   ├── 📂 models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   └── order.model.js
│   │
│   ├── 📂 routes/       // ¡Cambio clave: Rutas unificadas por recurso!
│   │   ├── auth.routes.js   // POST /api/auth/login
│   │   ├── product.routes.js  // GET /api/products (Cliente & POS)
│   │   └── order.routes.js    // POST /api/orders (Cliente), GET /api/orders/pending (POS)
│   │
│   ├── server.js
│   └── package.json
│
|---|
│
├── 📂 frontend/        // Ahora todo el frontend es UNA SOLA aplicación
│   │
│   ├── 📂 public/        // Archivos estáticos comunes (CSS, JS de bibliotecas)
│   │   ├── css/
│   │   │   └── main.css   // Estilos generales para toda la app
│   │   └── js/
│   │       └── api.js     // Funciones compartidas de llamada a la API
│   │
│   ├── 📂 pages/         // Las diferentes "vistas" de la aplicación
│   │   ├── login.html // Página de inicio de sesión (Común)
│   │   ├── client-dashboard.html // Menú principal, carrito, historial de pedidos (Rol Cliente)
│   │   └── pos-dashboard.html // Vista para tomar pedidos y ver cola (Rol Cajero/Admin)
│   │
│   ├── 📂 assets/        // Imágenes, fuentes, etc.
│   │   ├── img/
│   │   │   ├── logo.png
│   │   │   └── pizza_foto.jpg
│   │   │
│   │
│   └── 📂 js/           // Archivos de lógica principal de la aplicación
│       ├── app.js // Lógica principal: Maneja el inicio de sesión y la redirección
│       ├── client.js // Lógica para el menú, carrito y pedidos de cliente
│       └── pos.js // Lógica para la gestión de órdenes y TPV
│
|---|
│
├── 📂 database/
│   └── schema.sql
│
└── README.md