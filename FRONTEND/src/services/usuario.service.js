// src/services/usuario.service.js
import api from '../api/axiosConfig';

// ========== USUARIOS ==========

// Registro
export const create = async (data) => {
  const res = await api.post('/usuarios/registro', data);
  if (res.data.ok && res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
  }
  return res.data;
};

// Login
export const login = async (correo, contrasena) => {
  const res = await api.post('/usuarios/login', { correo, contrasena });
  if (res.data.ok && res.data.token) {
    localStorage.setItem('token', res.data.token);
    // ✅ Asegurar que los puntos se guardan
    const usuario = {
      id: res.data.usuario.id,
      nombre: res.data.usuario.nombre,
      correo: res.data.usuario.correo,
      puntos: res.data.usuario.puntos || 0  // ← Agregar puntos
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }
  return res.data;
};

// Obtener perfil del usuario logueado
export const getPerfil = async () => {
  const res = await api.get('/usuarios/perfil');
  return res.data;
};

// Actualizar perfil (nombre y correo)
export const updatePerfil = async (data) => {
  const res = await api.put('/usuarios/actPerfil', data);
  if (res.data.ok && res.data.data) {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
    const usuarioActualizado = { ...usuarioActual, ...res.data.data };
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
  }
  return res.data;
};

// Actualizar contraseña
export const updatePassword = async (contrasena_actual, contrasena_nueva) => {
  const res = await api.put('/usuarios/actContrasena', { 
    contrasena_actual, 
    contrasena_nueva 
  });
  return res.data;
};

// Eliminar cuenta
export const deleteAccount = async () => {
  const res = await api.delete('/usuarios/eliminar');
  if (res.data.ok) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
  return res.data;
};

// Obtener usuario actual de localStorage
export const getUsuarioActual = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

// Verificar si está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

