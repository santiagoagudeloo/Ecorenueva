const pool = require('../config/db');

const create = async ({ nombre, correo, mensaje }) => {
  const [result] = await pool.query(
    'INSERT INTO contacto (nombre, correo, mensaje) VALUES (?, ?, ?)',
    [nombre, correo, mensaje]
  );
  return { id: result.insertId, nombre, correo, mensaje };
};

module.exports = {create} 