const pool = require('../config/db');

// Obtener usuario por ID
const getUsuarioById = async (usuario_id) => {
  const [rows] = await pool.query(
    'SELECT puntos FROM usuarios WHERE id = ?',
    [usuario_id]
  );
  return rows[0];
};

// Obtener producto por ID
const getProductoById = async (producto_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM productos WHERE id = ?',
    [producto_id]
  );
  return rows[0];
};

// Actualizar puntos del usuario
const updatePuntos = async (usuario_id, nuevos_puntos) => {
  const [result] = await pool.query(
    'UPDATE usuarios SET puntos = ? WHERE id = ?',
    [nuevos_puntos, usuario_id]
  );
  return result.affectedRows;
};

// Registrar el canje
const registrarCanje = async (usuario_id, producto_id) => {
  const [result] = await pool.query(
    'INSERT INTO canjes (usuario_id, producto_id) VALUES (?, ?)',
    [usuario_id, producto_id]
  );
  return result.insertId;
};

module.exports = {getUsuarioById,getProductoById,updatePuntos,registrarCanje};