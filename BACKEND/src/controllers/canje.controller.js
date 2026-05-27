const jwt = require('jsonwebtoken'); 
const canjeModel = require('../models/canje.model');

const canjearSimple = async (req, res) => {
  // ✅ Obtener usuario_id del token (del middleware verificarToken)
  const usuario_id = req.usuario.id;
  const { producto_id } = req.body;
  
  // Validar que llegó producto_id
  if (!producto_id) {
    return res.status(400).json({ 
      error: 'producto_id es requerido' 
    });
  }
  
  try {
    // 2. Obtener usuario y producto
    const usuario = await canjeModel.getUsuarioById(usuario_id);
    const producto = await canjeModel.getProductoById(producto_id);
    
    // 3. Verificar que existan
    if (!usuario || !producto) {
      return res.status(404).json({ 
        error: 'Usuario o producto no encontrado' 
      });
    }
    
    // 4. Verificar puntos suficientes
    if (usuario.puntos < producto.puntos_requeridos) {
      return res.status(400).json({ 
        error: 'Puntos insuficientes',
        puntos_actuales: usuario.puntos,
        puntos_necesarios: producto.puntos_requeridos
      });
    }
    
    // 5. Realizar canje
    const nuevos_puntos = usuario.puntos - producto.puntos_requeridos;
    
    // Actualizar puntos del usuario
    await canjeModel.updatePuntos(usuario_id, nuevos_puntos);
    
    // Registrar el canje
    await canjeModel.registrarCanje(usuario_id, producto_id);
    
    // 6. Respuesta exitosa
    res.json({
      mensaje: 'Canje exitoso',
      producto: producto.nombre,
      puntos_restantes: nuevos_puntos
    });
    
  } catch (error) {
    // Si algo sale mal, enviar error
    console.error('Error en canjearSimple:', error);
    res.status(500).json({ 
      error: error.message 
    });
  }
};

module.exports = { canjearSimple };