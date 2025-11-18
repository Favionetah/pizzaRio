const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); //conecta con el Frontend
app.use(express.json()); //para que entienda json que envia el Frontend (ej: el Login)

const authRoutes = require('./routes/auth.routes');
const ordersRoutes = require('./routes/orders.routes');
const posRoutes = require('./routes/pos.routes');

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/pos', posRoutes);
//app.use('/api/products', productRoutes); //aqui van las rutas de productos cuando se creen



//ruta de prueba para verificar si funciona xd
app.get('/', (req, res) => {
    res.send('El API de PIZZA RIO Funcionaaaaaaa');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


