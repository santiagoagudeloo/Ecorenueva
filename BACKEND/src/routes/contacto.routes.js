const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactos.controller');

router.post('/contactar', ctrl.create);                  // POST   /api/usuarios

module.exports = router;