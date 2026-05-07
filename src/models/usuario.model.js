const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Crear usuario (SOLO la consulta a la DB)
const create = async ({ nombre, correo, contrasena }) => {
    // 1. Verificar si ya existe
    const [rows] = await pool.query(
        'SELECT id FROM usuarios WHERE correo = ?', [correo]
    );
    
    if (rows.length > 0) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }
    
    // 2. Hashear la contraseña (saltRounds = 10)
    const hash = await bcrypt.hash(contrasena, 10);
    
    // 3. Guardar en la DB
    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
        [nombre, correo, hash]
    );
    
    // 4. Devolver el ID del usuario creado
    return { id: result.insertId, nombre, correo };
};

// Login - buscar usuario por correo y verificar contraseña
const login = async ({ correo, contrasena }) => {
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
    };
};

// Obtener usuario por ID
const getById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, nombre, correo FROM usuarios WHERE id = ?', 
        [id]
    );
    return rows[0]; // undefined si no existe
};

// Verificar contraseña actual
const verificarPassword = async (id, contrasena) => {
    // 1. Obtener la contraseña hasheada del usuario
    const [rows] = await pool.query(
        'SELECT contrasena FROM usuarios WHERE id = ?',
        [id]
    );
    
    // 2. Verificar si el usuario existe
    if (rows.length === 0) {
        return false;
    }
    
    // 3. Comparar la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(contrasena, rows[0].contrasena);
    
    return isPasswordValid;
};

// Actualizar perfil (nombre y correo)
const update = async (id, { nombre, correo }) => {
    const [result] = await pool.query(
        `UPDATE usuarios 
         SET nombre = COALESCE(?, nombre),
             correo = COALESCE(?, correo)
         WHERE id = ?`,
        [nombre, correo, id]
    );
    return result.affectedRows; // 0 si no existe o no hubo cambios
};

// Actualizar contraseña
const updatePassword = async (id, contrasena) => {
    // Hashear la nueva contraseña
    const hash = await bcrypt.hash(contrasena, 10);
    
    const [result] = await pool.query(
        `UPDATE usuarios 
         SET contrasena = ?
         WHERE id = ?`,
        [hash, id]
    );
    return result.affectedRows; // 0 si no existe
};

// Eliminar usuario por ID
const remove = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM usuarios WHERE id = ?', 
        [id]
    );
    return result.affectedRows; // 0 si no existía
};

module.exports = { create, login, getById, verificarPassword, update, updatePassword, remove 
};