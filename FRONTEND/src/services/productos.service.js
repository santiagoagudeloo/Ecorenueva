import api from '../api/axiosConfig';

// GET /api/productos
export const getProductos = async () => {
  const res = await api.get('/productos');
  return res.data.data;
};