# Pizza Rio - Frontend

Sistema de pedidos en línea con arquitectura SPA (Single Page Application).

## Estructura de Archivos

```
frontend/
├── index.html                      # Redirección a login
├── pages/                          # Vistas principales
│   ├── login.html                  # Inicio de sesión
│   ├── register.html               # Registro de clientes
│   ├── client-dashboard.html       # Dashboard de cliente/invitado
│   └── pos-dashboard.html          # Dashboard POS (Cajero/Admin)
├── js/                             # Lógica de aplicación
│   ├── app.js                      # Login/Registro
│   ├── client.js                   # Lógica del cliente
│   └── pos.js                      # Lógica POS/Admin
├── public/                         # Archivos estáticos
│   ├── css/
│   │   └── main.css                # Estilos generales
│   └── js/
│       └── api.js                  # Funciones de API compartidas
└── assets/                         # Recursos multimedia
    └── img/
```

## Tecnologías

- **Vue 3** (CDN) - Framework reactivo
- **Vanilla CSS** - Estilos sin frameworks
- **HTML5** - Estructura semántica

## Características

### Roles de Usuario

1. **Invitado**
   - Ver menú
   - Agregar al carrito
   - Realizar pedidos (requiere nombre y teléfono)

2. **Cliente**
   - Todas las funciones de invitado
   - Historial de pedidos
   - Datos precargados en checkout

3. **Cajero (POS)**
   - Ver cola de pedidos
   - Actualizar estado de pedidos
   - Reportes de turno

4. **Administrador**
   - Todas las funciones de cajero
   - Gestión de productos (CRUD)
   - Gestión de usuarios (CRUD)
   - Reportes completos

### Flujo de Navegación

```
index.html → pages/login.html
                ↓
         ¿Autenticado?
         ↙          ↘
    CLIENT      ADMIN/CASHIER
       ↓              ↓
client-dashboard  pos-dashboard
```

## Uso

1. Abrir `index.html` o navegar a `pages/login.html`
2. Iniciar sesión, registrarse o continuar como invitado
3. El sistema redirige automáticamente según el rol

## Tipos de Pedido

- **Eat-In** (Para comer aquí)
- **Takeout** (Para llevar)

*No se ofrece servicio de delivery*

## API Endpoints

El frontend consume la API REST del backend en `http://localhost:3000/api/`:

- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro de clientes
- `/products` - Catálogo de productos
- `/orders` - Gestión de pedidos
- `/admin/*` - Funciones administrativas
- `/pos/*` - Funciones de cajero

## Notas de Desarrollo

- El estado del carrito se almacena en `localStorage`
- El token JWT se guarda en `localStorage` tras login
- Las páginas verifican autenticación en `mounted()`
- El dashboard POS actualiza pedidos cada 30 segundos
