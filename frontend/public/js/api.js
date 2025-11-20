// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Utilidad para obtener el token JWT del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Utilidad para obtener el usuario del localStorage
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Utilidad para guardar sesión
function saveSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Utilidad para cerrar sesión
function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('orderType');
}

// Función genérica para hacer peticiones fetch
async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token && !options.noAuth) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la petición');
        }

        return data;
    } catch (error) {
        console.error('Error en API:', error);
        throw error;
    }
}

// ===== AUTENTICACIÓN =====

async function login(username, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        noAuth: true
    });
}

async function register(username, password, name, phone) {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, name, phone }),
        noAuth: true
    });
}

async function verifyToken() {
    return apiFetch('/auth/verify', {
        method: 'GET'
    });
}

async function getProfile() {
    return apiFetch('/auth/profile', {
        method: 'GET'
    });
}

// ===== PRODUCTOS =====

async function getProducts() {
    return apiFetch('/products', {
        method: 'GET',
        noAuth: true
    });
}

async function getProductsByCategory(category) {
    return apiFetch(`/products/category/${category}`, {
        method: 'GET',
        noAuth: true
    });
}

async function getAllProductsAdmin() {
    return apiFetch('/products/admin/all', {
        method: 'GET'
    });
}

async function createProduct(productData) {
    return apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    });
}

async function updateProduct(id, productData) {
    return apiFetch(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    });
}

async function deleteProduct(id) {
    return apiFetch(`/products/${id}`, {
        method: 'DELETE'
    });
}

// ===== PEDIDOS =====

async function createOrder(orderData) {
    return apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        noAuth: !getToken() // Si no hay token, es invitado
    });
}

async function getOrderHistory() {
    return apiFetch('/orders/history', {
        method: 'GET'
    });
}

async function getPendingOrders() {
    return apiFetch('/orders/pending', {
        method: 'GET'
    });
}

async function getOrderById(id) {
    return apiFetch(`/orders/${id}`, {
        method: 'GET'
    });
}

async function updateOrderStatus(id, status) {
    return apiFetch(`/orders/status/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });
}

// ===== ADMIN - USUARIOS =====

async function getAllUsers() {
    return apiFetch('/admin/users', {
        method: 'GET'
    });
}

async function createUser(userData) {
    return apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

async function updateUser(id, userData) {
    return apiFetch(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
}

async function deleteUser(id) {
    return apiFetch(`/admin/users/${id}`, {
        method: 'DELETE'
    });
}

// ===== REPORTES =====

async function getSalesReport(filters = {}) {
    const params = new URLSearchParams(filters);
    return apiFetch(`/admin/reports/sales?${params}`, {
        method: 'GET'
    });
}

async function getShiftReport() {
    return apiFetch('/pos/reports/shift', {
        method: 'GET'
    });
}

// ===== CARRITO (localStorage) =====

function getCart() {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity
        });
    }

    saveCart(cart);
    return cart;
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        saveCart(cart);
    }
    
    return cart;
}

function clearCart() {
    localStorage.removeItem('cart');
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ===== TIPO DE PEDIDO =====

function setOrderType(type) {
    localStorage.setItem('orderType', type);
}

function getOrderType() {
    return localStorage.getItem('orderType') || 'EAT_IN';
}
