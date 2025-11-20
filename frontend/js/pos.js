const { createApp } = Vue;

createApp({
    data() {
        return {
            user: null,
            isAdmin: false,
            currentView: 'orders',
            
            // Orders
            orders: [],
            orderFilter: 'all',
            loadingOrders: false,
            
            // Products
            products: [],
            loadingProducts: false,
            showProductModal: false,
            editingProduct: null,
            productForm: {
                name: '',
                description: '',
                category: 'PIZZA',
                price: 0,
                available: true
            },
            productMessage: '',
            productMessageType: '',
            savingProduct: false,
            
            // Users
            users: [],
            loadingUsers: false,
            showUserModal: false,
            editingUser: null,
            userForm: {
                username: '',
                name: '',
                phone: '',
                role: 'CLIENT',
                password: ''
            },
            userMessage: '',
            userMessageType: '',
            savingUser: false
        };
    },
    computed: {
        filteredOrders() {
            if (this.orderFilter === 'all') {
                return this.orders;
            }
            return this.orders.filter(order => order.status === this.orderFilter);
        }
    },
    methods: {
        // ===== ORDERS =====
        async loadOrders() {
            this.loadingOrders = true;
            try {
                const response = await getPendingOrders();
                this.orders = response.orders || [];
            } catch (error) {
                console.error('Error al cargar pedidos:', error);
            } finally {
                this.loadingOrders = false;
            }
        },
        async updateOrderStatus(orderId, newStatus) {
            try {
                await updateOrderStatus(orderId, newStatus);
                await this.loadOrders();
            } catch (error) {
                console.error('Error al actualizar estado:', error);
                alert('Error al actualizar el estado del pedido');
            }
        },
        getBadgeClass(status) {
            const classes = {
                'PENDING': 'badge-pending',
                'PREPARING': 'badge-preparing',
                'READY': 'badge-ready',
                'COMPLETED': 'badge-completed',
                'CANCELLED': 'badge-cancelled'
            };
            return classes[status] || 'badge-pending';
        },
        getStatusText(status) {
            const texts = {
                'PENDING': 'Pendiente',
                'PREPARING': 'Preparando',
                'READY': 'Listo',
                'COMPLETED': 'Completado',
                'CANCELLED': 'Cancelado'
            };
            return texts[status] || status;
        },
        formatTime(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('es-ES', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        // ===== PRODUCTS =====
        async loadProducts() {
            this.loadingProducts = true;
            try {
                const response = await getAllProductsAdmin();
                this.products = response.products || response;
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                this.loadingProducts = false;
            }
        },
        openProductModal(product = null) {
            this.editingProduct = product;
            if (product) {
                this.productForm = {
                    name: product.name,
                    description: product.description || '',
                    category: product.category,
                    price: parseFloat(product.price),
                    available: product.available
                };
            } else {
                this.productForm = {
                    name: '',
                    description: '',
                    category: 'PIZZA',
                    price: 0,
                    available: true
                };
            }
            this.productMessage = '';
            this.showProductModal = true;
        },
        closeProductModal() {
            this.showProductModal = false;
            this.editingProduct = null;
            this.productMessage = '';
        },
        async saveProduct() {
            this.savingProduct = true;
            this.productMessage = '';

            try {
                if (this.editingProduct) {
                    await updateProduct(this.editingProduct.id, this.productForm);
                    this.productMessage = 'Producto actualizado exitosamente';
                } else {
                    await createProduct(this.productForm);
                    this.productMessage = 'Producto creado exitosamente';
                }
                this.productMessageType = 'success';
                
                setTimeout(() => {
                    this.closeProductModal();
                    this.loadProducts();
                }, 1000);

            } catch (error) {
                this.productMessage = error.message || 'Error al guardar el producto';
                this.productMessageType = 'error';
            } finally {
                this.savingProduct = false;
            }
        },
        async deleteProductConfirm(product) {
            if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
                try {
                    await deleteProduct(product.id);
                    await this.loadProducts();
                } catch (error) {
                    alert('Error al eliminar el producto');
                }
            }
        },
        getCategoryText(category) {
            const texts = {
                'PIZZA': 'Pizza',
                'DRINK': 'Bebida',
                'DESSERT': 'Postre'
            };
            return texts[category] || category;
        },
        
        // ===== USERS =====
        async loadUsers() {
            this.loadingUsers = true;
            try {
                const response = await getAllUsers();
                this.users = response.users || response;
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            } finally {
                this.loadingUsers = false;
            }
        },
        openUserModal(user = null) {
            this.editingUser = user;
            if (user) {
                this.userForm = {
                    username: user.username,
                    name: user.name,
                    phone: user.phone || '',
                    role: user.role,
                    password: ''
                };
            } else {
                this.userForm = {
                    username: '',
                    name: '',
                    phone: '',
                    role: 'CLIENT',
                    password: ''
                };
            }
            this.userMessage = '';
            this.showUserModal = true;
        },
        closeUserModal() {
            this.showUserModal = false;
            this.editingUser = null;
            this.userMessage = '';
        },
        async saveUser() {
            this.savingUser = true;
            this.userMessage = '';

            try {
                if (this.editingUser) {
                    await updateUser(this.editingUser.id, {
                        name: this.userForm.name,
                        phone: this.userForm.phone,
                        role: this.userForm.role
                    });
                    this.userMessage = 'Usuario actualizado exitosamente';
                } else {
                    await createUser(this.userForm);
                    this.userMessage = 'Usuario creado exitosamente';
                }
                this.userMessageType = 'success';
                
                setTimeout(() => {
                    this.closeUserModal();
                    this.loadUsers();
                }, 1000);

            } catch (error) {
                this.userMessage = error.message || 'Error al guardar el usuario';
                this.userMessageType = 'error';
            } finally {
                this.savingUser = false;
            }
        },
        async deleteUserConfirm(user) {
            if (confirm(`¿Estás seguro de eliminar el usuario "${user.username}"?`)) {
                try {
                    await deleteUser(user.id);
                    await this.loadUsers();
                } catch (error) {
                    alert('Error al eliminar el usuario');
                }
            }
        },
        
        // ===== GENERAL =====
        logout() {
            clearSession();
            window.location.href = 'login.html';
        }
    },
    watch: {
        currentView(newView) {
            if (newView === 'products' && this.products.length === 0) {
                this.loadProducts();
            } else if (newView === 'users' && this.users.length === 0) {
                this.loadUsers();
            }
        }
    },
    mounted() {
        this.user = getUser();
        
        if (!this.user) {
            window.location.href = 'login.html';
            return;
        }

        if (this.user.role !== 'ADMIN' && this.user.role !== 'CASHIER') {
            window.location.href = 'client-dashboard.html';
            return;
        }

        this.isAdmin = this.user.role === 'ADMIN';
        this.loadOrders();

        setInterval(() => {
            if (this.currentView === 'orders') {
                this.loadOrders();
            }
        }, 30000);
    }
}).mount('#app');
