const pool = require('../config/db');

// ? = placeholder seguro (evita SQL Injection)

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM productos ORDER BY id DESC'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM productos WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async ({ nombre, precio, stock }) => {
  const [result] = await pool.query(
    'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
    [nombre, precio, stock ?? 0]
  );
  return { id: result.insertId, nombre, precio, stock };
};

// UPDATE — actualizar campos
const update = async (id, { nombre, precio, stock }) => {
  const [result] = await pool.query(
    `UPDATE productos
     SET nombre = COALESCE(?, nombre),
         precio = COALESCE(?, precio),
         stock  = COALESCE(?, stock)
     WHERE id = ?`,
    [nombre, precio, stock, id]
  );
  return result.affectedRows; // 0 si no existe
};

// DELETE — eliminar por ID
const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM productos WHERE id = ?', [id]
  );
  return result.affectedRows; // 0 si no existía
};

module.exports = { getAll, getById, create, update, remove };