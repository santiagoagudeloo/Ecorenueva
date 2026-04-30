const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productos.controller');

router.get('/todos', ctrl.getAll);                    // GET    /api/usuarios
router.get('/:id', ctrl.getById)            // GET    /api/usuarios/1

module.exports = router;