const express = require('express');
const app = express();

// Middlewares de terceros
app.use(require('cors')());           // CORS
app.use(require('morgan')('dev'));   // Logging

// Middleware para parsear JSON
app.use(express.json());

// Middleware personalizado global
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pasar al siguiente middleware
});

// Rutas
const usuarioRouter = require('./routes/usuario.routes');
app.use('/usuarios', usuarioRouter);

const productoRouter = require('./routes/producto.routes');
app.use('/productos', productoRouter);

const contactoRouter = require('./routes/contacto.routes');
app.use('/contacto', contactoRouter);

const canjeRouter = require('./routes/canje.routes');
app.use('/canjear-simple', canjeRouter);  

// ─── Middleware de errores global ───
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});

module.exports = app;