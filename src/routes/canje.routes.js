const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/canje.controller');

// POST /api/canjear-simple
router.post('/canjear', ctrl.canjearSimple);

module.exports = router;