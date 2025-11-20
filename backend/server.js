const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth.routes');
<<<<<<< Updated upstream
=======
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const posRoutes = require('./routes/pos.routes');
>>>>>>> Stashed changes

// Registrar rutas
app.use('/api/auth', authRoutes);
<<<<<<< Updated upstream
//app.use('/api/products', productRoutes); //aqui van las rutas de productos cuando se creen
=======
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pos', posRoutes);
>>>>>>> Stashed changes

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Pizza Rio funcionando correctamente');
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
