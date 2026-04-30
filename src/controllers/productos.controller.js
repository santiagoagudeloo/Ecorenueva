const productoModel = require('../models/producto.model'); // Corregido: ProductoModel → usuarioModel

// GET /api/usuarios
const getAll = async (req, res) => {
  try {
    const data = await productoModel.getAll();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

// GET /api/usuarios/:id
const getById = async (req, res) => {
  try {
    const data = await productoModel.getById(req.params.id);
    if (!data) return res.status(404)
      .json({ ok: false, msg: 'Producto no encontrado' });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
}

module.exports = { getAll, getById}