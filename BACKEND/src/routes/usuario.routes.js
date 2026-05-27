const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/usuarios.controller');

router.post('/registro', ctrl.create);    
router.post('/login', ctrl.login); 


router.get('/perfil', verificarToken, ctrl.getPerfil);           // Obtener mi perfil
router.put('/actPerfil', verificarToken, ctrl.update); 
router.put('/actContrasena', verificarToken, ctrl.updatePassword); 
router.delete('/eliminar', verificarToken, ctrl.remove);
                 

module.exports = router;