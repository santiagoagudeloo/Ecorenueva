// 📁 models/usuario.model.js (versión correcta)
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const create = async ({ nombre, correo, contrasena }) => {
  // 1. Verificar si el correo ya existe (control de BD)
  const [existingUser] = await pool.query(
    'SELECT id FROM usuarios WHERE correo = ?',
    [correo]
  );
  
  if (existingUser.length > 0) {
    throw new Error('El correo ya está registrado');
  }
  
  // 2. Encriptar contraseña (seguridad)
  const hashedPassword = await bcrypt.hash(contrasena, 10);
  
  // 3. Guardar en BD
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
    [nombre, correo, hashedPassword]
  );
  
  // 4. Devolver usuario sin contraseña
  return { id: result.insertId, nombre, correo };
};

const login = async ({ correo, contrasena }) => {
  try {
    // 1. Buscar el usuario por correo
    const [users] = await pool.query(
      'SELECT id, nombre, correo, contrasena FROM usuarios WHERE correo = ?',
      [correo]
    );
    
    // 2. Verificar si el usuario existe
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }
    
    const user = users[0];
    
    // 3. Comparar la contraseña (texto plano vs encriptada)
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }
    
    // 4. Devolver datos del usuario (sin la contraseña)
    return {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo
      // Podrías agregar un token JWT aquí
    };
    
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
}


const update = async (id, { nombre, correo }) => {
  const [result] = await pool.query(
    `UPDATE usuarios
     SET nombre = COALESCE(?, nombre),
         correo = COALESCE(?, correo)
     WHERE id = ?`,
    [nombre, correo, id]
  );
  return result.affectedRows;
};

// UPDATE — actualizar solo contraseña
const updatePassword = async (id, { contrasena }) => {  // Cambiado: updatepassword → updatePassword
  const [result] = await pool.query(
    `UPDATE usuarios
     SET contrasena = COALESCE(?, contrasena)
     WHERE id = ?`,  // Corregido: eliminada la coma después de contrasena
    [contrasena, id]
  );
  return result.affectedRows; // 0 si no existe
};

// DELETE — eliminar por ID
const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM usuarios WHERE id = ?', [id]
  );
  return result.affectedRows; // 0 si no existía
};



module.exports = { create, login, getById, update, updatePassword, remove };