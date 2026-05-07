const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/canje.controller');

// POST /api/canjear-simple
router.post('/canjear', verificarToken, ctrl.canjearSimple);

module.exports = router;