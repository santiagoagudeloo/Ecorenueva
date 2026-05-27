const ProductoModel = require('../models/producto.model');

let productos = [
  { id: 1, nombre: 'Laptop', precio: 1200 }
];

// GET /api/productos
const getAll = async (req, res) => {
  try {
    const data = await ProductoModel.getAll();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

// GET /api/productos/:id
const getById = async (req, res) => {
  try {
    const data = await ProductoModel.getById(req.params.id);
    if (!data) return res.status(404)
      .json({ ok: false, msg: 'Producto no encontrado' });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

// POST /api/productos
const create = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    if (!nombre || !precio)
      return res.status(400).json({ ok: false, msg: 'nombre y precio requeridos' });
    const data = await ProductoModel.create({ nombre, precio, stock });
    res.status(201).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

// PUT /api/productos/:id
const update = async (req, res) => {
  try {
    const affected = await ProductoModel.update(
      req.params.id, req.body
    );
    if (!affected) return res.status(404)
      .json({ ok: false, msg: 'No encontrado' });
    const data = await ProductoModel.getById(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

// DELETE /api/productos/:id
const remove = async (req, res) => {
  try {
    const affected = await ProductoModel.remove(req.params.id);
    if (!affected) return res.status(404)
      .json({ ok: false, msg: 'No encontrado' });
    res.json({ ok: true, msg: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };