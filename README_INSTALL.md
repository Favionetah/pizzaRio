# Pizza Rio - Sistema de Pedidos y TPV

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Node.js v14+ 
- MySQL 8.0+
- npm o yarn

### 2. Configuración de la Base de Datos

```bash
# Iniciar MySQL
mysql -u root -p

# Crear la base de datos y tablas
source database/schema.sql

# Insertar datos de prueba
source database/seed.sql
```

### 3. Configuración del Backend

```bash
cd backend

# Instalar dependencias
npm install

# Paquetes necesarios:
npm install express cors mysql2 bcryptjs jsonwebtoken

# Configurar conexión a BD en backend/config/db.js
# Ajustar: host, user, password, database

# Iniciar servidor
node server.js
```

El servidor estará disponible en: `http://localhost:3000`

### 4. Configuración del Frontend

```bash
cd frontend

# Abrir con Live Server o servidor estático
# Por ejemplo con VS Code Live Server o:
npx serve .
```

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | password123 | ADMIN |
| cajero1 | password123 | CASHIER |
| cliente1 | password123 | CLIENT |

**NOTA**: Los hashes en seed.sql son de ejemplo. Para crear usuarios reales, usar el endpoint de registro o generar hashes con bcrypt.

## 📁 Estructura del Proyecto

```
pizzaRio/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── admin.controller.js
│   │   └── pos.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   └── order.model.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   ├── admin.routes.js
│   │   └── pos.routes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── client-dashboard.html
│   │   └── pos-dashboard.html
│   ├── js/
│   │   ├── app.js
│   │   ├── client.js
│   │   └── pos.js
│   └── public/
│       ├── css/
│       │   └── main.css
│       └── js/
│           └── api.js
└── database/
    ├── schema.sql
    └── seed.sql
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar cliente
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/profile` - Obtener perfil

### Productos
- `GET /api/products` - Listar productos (público)
- `GET /api/products/category/:category` - Por categoría
- `POST /api/products` - Crear producto (ADMIN)
- `PUT /api/products/:id` - Actualizar producto (ADMIN)
- `DELETE /api/products/:id` - Eliminar producto (ADMIN)

### Pedidos
- `POST /api/orders` - Crear pedido (público/cliente)
- `GET /api/orders/history` - Historial del cliente
- `GET /api/orders/pending` - Pedidos pendientes (CASHIER/ADMIN)
- `PUT /api/orders/status/:id` - Actualizar estado (CASHIER/ADMIN)

### Administración
- `GET /api/admin/users` - Listar usuarios
- `POST /api/admin/users` - Crear usuario/empleado
- `PUT /api/admin/users/:id` - Actualizar usuario
- `DELETE /api/admin/users/:id` - Eliminar usuario
- `GET /api/admin/reports/sales` - Reporte de ventas

### POS
- `GET /api/pos/reports/shift` - Reporte de turno del cajero

## 🎯 Flujo de Uso

### Cliente/Invitado:
1. Acceder a la página principal
2. Seleccionar tipo de pedido (Comer aquí / Para llevar)
3. Navegar por el menú y agregar productos al carrito
4. Realizar checkout
   - Invitado: proporcionar nombre y teléfono
   - Cliente registrado: datos precargados
5. Confirmar pedido

### Cajero:
1. Iniciar sesión
2. Ver cola de pedidos pendientes
3. Marcar pedidos como:
   - En preparación
   - Listo
   - Completado
4. Ver reporte de turno (sus ventas del día)

### Administrador:
1. Iniciar sesión
2. Gestión de productos (CRUD)
3. Gestión de usuarios/empleados (CRUD)
4. Ver reportes completos de ventas
5. Todas las funciones del cajero

## ⚙️ Configuración Adicional

### Variables de Entorno (opcional)
Crear archivo `.env` en backend/:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=pizzeria_db
JWT_SECRET=PARALELEPIPEDO_FELIPE_NEDURO_SECRETO_JWT
```

### Cambiar URL de API
En `frontend/public/js/api.js`, modificar:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🐛 Solución de Problemas

### Error de conexión a BD
- Verificar que MySQL esté corriendo
- Verificar credenciales en `backend/config/db.js`
- Asegurar que la base de datos `pizzeria_db` existe

### Error CORS
- Verificar que el backend tenga configurado `cors()`
- Verificar la URL del API en `api.js`

### Token inválido
- Cerrar sesión y volver a iniciar
- Limpiar localStorage del navegador

## 📝 Notas Importantes

- El sistema NO usa Bootstrap según especificación
- Solo permite pedidos EAT_IN (Comer aquí) o TAKEOUT (Para llevar)
- No hay servicio de delivery
- Los pedidos de invitados se guardan pero no tienen historial
- Los clientes registrados pueden ver su historial completo

## 🔐 Seguridad

- Las contraseñas se hashean con bcrypt
- JWT para autenticación
- Middleware de roles para proteger rutas
- Validaciones en backend y frontend

## 📞 Soporte

Para problemas o dudas, revisar:
1. Logs del servidor backend
2. Consola del navegador (F12)
3. Estado de MySQL

---

**Desarrollado para Pizza Rio** 🍕
