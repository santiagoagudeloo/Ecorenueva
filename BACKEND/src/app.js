const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173'
}));

// Middlewares de terceros
app.use(require('morgan')('dev'));   // Logging
app.use(express.json());        

// Middleware personalizado global
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pasar al siguiente middleware
});

// Rutas

const canjeRouter = require('./routes/canje.routes');
app.use('/api/canjear-simple', canjeRouter); 

const contactoRouter = require('./routes/contacto.routes');
app.use('/api/contacto', contactoRouter);

const productosRouter = require('./routes/productos.routes');
app.use('/api/productos', productosRouter);

const usuarioRouter = require('./routes/usuario.routes');
app.use('/api/usuarios', usuarioRouter);


// ─── Middleware de errores global ───
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});

module.exports = app;