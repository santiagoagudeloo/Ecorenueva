// src/services/canje.service.js
import api from '../api/axiosConfig';

export const canjearProducto = async (productoId) => {
  console.log('📤 Enviando canje - producto_id:', productoId);
  
  try {
    const res = await api.post('/canjear-simple/canjear', { 
      producto_id: productoId
    });
    console.log('📥 Respuesta COMPLETA:', res.data);
    console.log('📥 ¿Tiene error?', res.data.error || 'NO');
    return res.data;
  } catch (err) {
    console.log('❌ Error en petición:', err.response?.data);
    throw err;
  }
};

