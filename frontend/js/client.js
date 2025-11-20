const { createApp } = Vue;

createApp({
    data() {
        return {
            user: null,
            currentView: 'menu',
            products: [],
            orders: [],
            cart: [],
            selectedCategory: '',
            loading: false,
            loadingOrders: false,
            showCartModal: false,
            orderType: 'EAT_IN',
            guestName: '',
            guestPhone: '',
            orderMessage: '',
            orderMessageType: '',
            processingOrder: false
        };
    },
    computed: {
        filteredProducts() {
            if (this.selectedCategory === '') {
                return this.products.filter(p => p.available);
            }
            return this.products.filter(p => p.category === this.selectedCategory && p.available);
        },
        cartCount() {
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        cartTotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
    },
    methods: {
        async loadProducts() {
            this.loading = true;
            try {
                const response = await getProducts();
                this.products = response.products || response;
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                this.loading = false;
            }
        },
        async loadOrders() {
            if (!this.user) return;
            
            this.loadingOrders = true;
            try {
                const response = await getOrderHistory();
                this.orders = response.orders || [];
            } catch (error) {
                console.error('Error al cargar pedidos:', error);
            } finally {
                this.loadingOrders = false;
            }
        },
        loadCart() {
            this.cart = getCart();
            this.orderType = getOrderType();
        },
        addToCart(product) {
            addToCart(product, 1);
            this.loadCart();
        },
        removeItem(productId) {
            removeFromCart(productId);
            this.loadCart();
        },
        increaseQuantity(productId) {
            const item = this.cart.find(i => i.id === productId);
            if (item) {
                updateCartItemQuantity(productId, item.quantity + 1);
                this.loadCart();
            }
        },
        decreaseQuantity(productId) {
            const item = this.cart.find(i => i.id === productId);
            if (item && item.quantity > 1) {
                updateCartItemQuantity(productId, item.quantity - 1);
                this.loadCart();
            } else if (item && item.quantity === 1) {
                this.removeItem(productId);
            }
        },
        openCart() {
            this.loadCart();
            this.showCartModal = true;
        },
        closeCart() {
            this.showCartModal = false;
            this.orderMessage = '';
        },
        async placeOrder() {
            // Validaciones
            if (this.cart.length === 0) {
                this.showMessage('El carrito está vacío', 'error');
                return;
            }

            if (!this.user && (!this.guestName || !this.guestPhone)) {
                this.showMessage('Debes ingresar tu nombre y teléfono', 'error');
                return;
            }

            this.processingOrder = true;
            this.orderMessage = '';

            try {
                const items = this.cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price_at_sale: item.price
                }));

                const orderData = {
                    items: items,
                    order_type: this.orderType
                };

                if (!this.user) {
                    orderData.guest_name = this.guestName;
                    orderData.guest_phone = this.guestPhone;
                }

                setOrderType(this.orderType);
                const response = await createOrder(orderData);

                this.showMessage('¡Pedido realizado exitosamente! #' + response.orderId, 'success');
                
                clearCart();
                this.loadCart();
                this.guestName = '';
                this.guestPhone = '';

                setTimeout(() => {
                    this.closeCart();
                    if (this.user) {
                        this.currentView = 'orders';
                        this.loadOrders();
                    }
                }, 2000);

            } catch (error) {
                this.showMessage(error.message || 'Error al realizar el pedido', 'error');
            } finally {
                this.processingOrder = false;
            }
        },
        showMessage(msg, type) {
            this.orderMessage = msg;
            this.orderMessageType = type;
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
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        logout() {
            clearSession();
            window.location.href = '../login.html';
        }
    },
    mounted() {
        this.user = getUser();
        this.loadProducts();
        this.loadCart();
        
        if (this.user) {
            this.loadOrders();
        }
    }
}).mount('#app');
