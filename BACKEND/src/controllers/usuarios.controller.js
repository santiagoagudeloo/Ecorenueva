// 📁 controllers/usuarios.controller.js
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuario.model');

const create = async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;
        
        // Validaciones...
        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({ 
                ok: false, 
                msg: 'nombre, correo y contraseña son requeridos' 
            });
        }
        
        // ✅ Usar el método create() de tu modelo
        const nuevoUsuario = await usuarioModel.create({ nombre, correo, contrasena });
        
        const token = jwt.sign(
            { id: nuevoUsuario.id, correo: nuevoUsuario.correo },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
        
        res.status(201).json({ 
            ok: true, 
            token,
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo
            }
        });
        
    } catch (err) {
        if (err.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ ok: false, msg: 'El correo ya está registrado' });
        }
        console.error(err);
        res.status(500).json({ ok: false, msg: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        if (!correo || !contrasena) {
            return res.status(400).json({ 
                ok: false, 
                msg: 'Correo y contraseña son requeridos' 
            });
        }
        
        // ✅ Usar el método login() de tu modelo (NO findByCorreo)
        const usuario = await usuarioModel.login({ correo, contrasena });
        
        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
        
        res.json({ 
            ok: true,
            token, 
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });
        
    } catch (err) {
        console.error(err);
        
        if (err.message === 'Usuario no encontrado' || err.message === 'Contraseña incorrecta') {
            return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
        }
        
        res.status(500).json({ ok: false, msg: err.message });
    }
};

const getPerfil = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const usuario = await usuarioModel.getById(usuario_id);
    
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }
    
    // Asegurar que devuelve los puntos
    res.json({ 
      ok: true, 
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        puntos: usuario.puntos || 0  // ← Agregar puntos
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getById = async (req, res) => {
    try {
        // ✅ Usar getById() de tu modelo
        const usuario = await usuarioModel.getById(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }
        
        res.json({ ok: true, data: usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: err.message });
    }
};

const update = async (req, res) => {
    try {
        
        const usuario_id = req.usuario.id;
        const { nombre, correo } = req.body;
        
        if (!nombre && !correo) {
            return res.status(400).json({ 
                ok: false, 
                msg: 'Al menos nombre o correo son requeridos' 
            });
        }
        
        // ✅ Usar update() de tu modelo con el ID del token
        const affected = await usuarioModel.update(usuario_id, { nombre, correo });
        
        if (affected === 0) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }
        
        const usuarioActualizado = await usuarioModel.getById(usuario_id);
        delete usuarioActualizado.contrasena;
        
        res.json({ 
            ok: true, 
            msg: 'Perfil actualizado correctamente',
            data: usuarioActualizado
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: err.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        
        const usuario_id = req.usuario.id;
        const { contrasena_actual, contrasena_nueva } = req.body;
        
        if (!contrasena_actual || !contrasena_nueva) {
            return res.status(400).json({ 
                ok: false, 
                msg: 'Contraseña actual y nueva son requeridas' 
            });
        }
        
        // Verificar la contraseña actual
        const passwordValida = await usuarioModel.verificarPassword(usuario_id, contrasena_actual);
        
        if (!passwordValida) {
            return res.status(401).json({ ok: false, msg: 'Contraseña actual incorrecta' });
        }
        
        // ✅ Usar updatePassword() de tu modelo
        const affected = await usuarioModel.updatePassword(usuario_id, contrasena_nueva);
        
        if (affected === 0) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }
        
        res.json({ ok: true, msg: 'Contraseña actualizada correctamente' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: err.message });
    }
};


const remove = async (req, res) => {
    try {
        // ✅ El ID viene del token
        const usuario_id = req.usuario.id;
        
        // ✅ Usar remove() de tu modelo
        const affected = await usuarioModel.remove(usuario_id);
        
        if (affected === 0) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }
        
        res.json({ ok: true, msg: 'Usuario eliminado correctamente' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: err.message });
    }
};

module.exports = { create, login, getById, update, updatePassword, remove, getPerfil };