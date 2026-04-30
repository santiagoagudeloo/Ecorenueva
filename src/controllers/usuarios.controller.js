const usuarioModel = require('../models/usuario.model');

// POST /api/usuarios
const create = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    
    // Validación de campos requeridos
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'nombre, correo y contraseña son requeridos' 
      });
    }
    
    // Validación de longitud mínima para nombre (ejemplo: mínimo 3 caracteres)
    if (nombre.length < 3) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'El nombre debe tener al menos 3 caracteres' 
      });
    }
    
    // Validación de longitud máxima opcional para nombre
    if (nombre.length > 50) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'El nombre no puede exceder los 50 caracteres' 
      });
    }
    
    // Validación de formato de correo electrónico usando expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'Formato de correo electrónico inválido' 
      });
    }
    
    // Validación de longitud mínima para contraseña (ejemplo: mínimo 6 caracteres)
    if (contrasena.length < 6) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Validación opcional: contraseña con requisitos adicionales
    // Al menos una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(contrasena)) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
      });
    }
    
    const data = await usuarioModel.create({ nombre, correo, contrasena });
    res.status(201).json({ ok: true, data });
    
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    // Validaciones básicas
    if (!correo || !contrasena) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'correo y contraseña requeridos' 
      });
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ 
        ok: false, 
        msg: 'Formato de correo electrónico inválido' 
      });
    }
    
    // Llamar al modelo
    const data = await usuarioModel.login({ correo, contrasena });
    
    // 200 OK en lugar de 201 Created
    res.status(200).json({ ok: true, data });
    
  } catch (err) {
    // Manejo específico de errores de autenticación
    let statusCode = 500;
    let message = err.message;
    
    if (err.message === 'Usuario no encontrado' || 
        err.message === 'Contraseña incorrecta') {
      statusCode = 401; // Unauthorized
      message = 'Credenciales inválidas';
    }
    
    res.status(statusCode).json({ ok: false, msg: message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await usuarioModel.getById(req.params.id);
    if (!data) return res.status(404)
      .json({ ok: false, msg: 'usuario no encontrado' });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
}

// PUT /api/act_perfil/:id
const update = async (req, res) => {
  try {
    const affected = await usuarioModel.update(req.params.id, req.body);
    if (!affected) return res.status(404)
      .json({ ok: false, msg: 'Registro no encontrado' });
    const data = await usuarioModel.getById(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { contrasena } = req.body;
    if (!contrasena) 
      return res.status(400).json({ ok: false, msg: 'Contraseña requerida' });
    
    const affected = await usuarioModel.updatePassword(req.params.id, { contrasena });
    if (!affected) return res.status(404)
      .json({ ok: false, msg: 'Usuario no encontrado' });
    
    res.json({ ok: true, msg: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

// DELETE /api/usuarios/:id
const remove = async (req, res) => {
  try {
    const affected = await usuarioModel.remove(req.params.id);
    if (!affected) return res.status(404)
      .json({ ok: false, msg: 'Usuario no encontrado' }); // Corregido: Producto → Usuario
    res.json({ ok: true, msg: 'Usuario eliminado' }); // Corregido: Producto → Usuario
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};





module.exports = {create, login, getById,update, updatePassword, remove}