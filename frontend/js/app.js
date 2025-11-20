const { createApp } = Vue;

// ===== LOGIN =====
if (document.getElementById('login-app')) {
    createApp({
        data() {
            return {
                username: '',
                password: '',
                message: '',
                messageType: 'error',
                loading: false
            };
        },
        methods: {
            async handleLogin() {
                if (!this.username || !this.password) {
                    this.showMessage('Usuario y contraseña son requeridos', 'error');
                    return;
                }

                this.loading = true;
                this.message = '';

                try {
                    const response = await login(this.username, this.password);
                    
                    saveSession(response.token, response.user);
                    this.showMessage('Ingresando...', 'success');

                    setTimeout(() => {
                        if (response.user.role === 'ADMIN' || response.user.role === 'CASHIER') {
                            window.location.href = 'pos-dashboard.html';
                        } else if (response.user.role === 'CLIENT') {
                            window.location.href = 'client-dashboard.html';
                        } else {
                            this.showMessage('Rol no reconocido', 'error');
                        }
                    }, 500);

                } catch (error) {
                    this.showMessage(error.message || 'Error al iniciar sesión', 'error');
                } finally {
                    this.loading = false;
                }
            },
            continueAsGuest() {
                window.location.href = 'client-dashboard.html';
            },
            showMessage(msg, type) {
                this.message = msg;
                this.messageType = type;
            }
        },
        mounted() {
            const user = getUser();
            if (user) {
                if (user.role === 'ADMIN' || user.role === 'CASHIER') {
                    window.location.href = 'pos-dashboard.html';
                } else {
                    window.location.href = 'client-dashboard.html';
                }
            }
        }
    }).mount('#login-app');
}

// ===== REGISTER =====
if (document.getElementById('register-app')) {
    createApp({
        data() {
            return {
                form: {
                    username: '',
                    name: '',
                    phone: '',
                    password: '',
                    confirmPassword: ''
                },
                message: '',
                messageType: 'error',
                loading: false
            };
        },
        methods: {
            async handleRegister() {
                if (this.form.password !== this.form.confirmPassword) {
                    this.showMessage('Las contraseñas no coinciden', 'error');
                    return;
                }

                if (this.form.password.length < 6) {
                    this.showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
                    return;
                }

                this.loading = true;
                this.message = '';

                try {
                    const response = await register(
                        this.form.username,
                        this.form.password,
                        this.form.name,
                        this.form.phone
                    );

                    saveSession(response.token, response.user);
                    this.showMessage('¡Registro exitoso! Redirigiendo...', 'success');

                    setTimeout(() => {
                        window.location.href = 'client-dashboard.html';
                    }, 1500);

                } catch (error) {
                    this.showMessage(error.message || 'Error al registrarse', 'error');
                } finally {
                    this.loading = false;
                }
            },
            showMessage(msg, type) {
                this.message = msg;
                this.messageType = type;
            }
        },
        mounted() {
            const user = getUser();
            if (user) {
                window.location.href = 'client-dashboard.html';
            }
        }
    }).mount('#register-app');
}
