const { createApp } = Vue;

createApp({
    data() {
        return {
            email: '',
            password: '',
            message: '',
            messageColor: 'red'

        }
    },
    methods: {
        async handleLogin() {
            try {
                //Llammada a la API con FETCH (usamos http por que no es https xD)
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                   },
                   //Se convierte la informacion recibida a JSON
                   body: JSON.stringify({
                        email: this.email,
                        password: this.password
                   })
                });

                const data = await response.json();
                if (!response.ok) {
                    this.message = data.message;
                    this.messageColor = 'red';
                } else {
                    this.message = 'Ingresando';
                    this.messageColor = 'green';

                    localStorage.setItem('token', data.token);

                    if (data.role === 'Administrador' || data.role === 'Cajero') {
                        window.location.href = 'pos-app/index.html';
                    } else if (data.role === 'Cliente') {
                        windows.location.href = 'client-app/index.html';
                    } else {
                        this.message = 'Rol no  reconocido';
                        this.messageColor = 'red';
                    }
                }
            } catch (error) {
                console.error('Error en el login: ', error);
                this.message = 'Error al conectar con el servidor xd';
                this.messageColro = 'red';
            }
        }
    }
}).mount('#app');