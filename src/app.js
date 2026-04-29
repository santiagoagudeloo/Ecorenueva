const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
const usuarioRouter = require('./routes/usuario.routes');
app.use('/usuarios', usuarioRouter);

const productoRouter = require('./routes/producto.routes');
app.use('/productos', productoRouter);

const contactoRouter = require('./routes/contacto.routes');
app.use('/contacto', contactoRouter);

const canjeRouter = require('./routes/canje.routes');
app.use('/canjear-simple', canjeRouter);  

module.exports = app;