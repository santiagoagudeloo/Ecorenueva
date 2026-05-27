const router         = require('express').Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const ctrl            = require('../controllers/productos.Controller');

// Rutas PÚBLICAS — sin autenticación
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

module.exports = router;