// src/services/usuario.service.js
import api from '../api/axiosConfig';

// Enviar mensaje de contacto
export const enviarContacto = async (data) => {
  // Tu ruta es /contacto/contactar
  const res = await api.post('/contacto/contactar', data);
  return res.data;
};