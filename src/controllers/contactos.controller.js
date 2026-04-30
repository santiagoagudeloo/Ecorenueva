const contactoModel = require('../models/contacto.model');

// POST /api/usuarios
const create = async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;
    if (!nombre || !correo || !mensaje)
      return res.status(400).json({ ok: false, msg: 'nombre, correo y mensaje requeridos' });
    const data = await contactoModel.create({ nombre, correo, mensaje });
    res.status(201).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
}

module.exports = {create} 