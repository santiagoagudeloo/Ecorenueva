const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');

router.post('/registro', ctrl.create);    
router.post('/login', ctrl.login); 
router.put('/actPerfil/:id', ctrl.update); 
router.put('/actContrasena/:id', ctrl.updatePassword); 
router.delete('eliminar/:id', ctrl.remove);
                 

module.exports = router;