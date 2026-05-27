// src/pages/ProductosPage.jsx
import { useState, useEffect } from 'react';
import { getProductos } from '../services/productos.service';
import { canjearProducto } from '../services/canjear.service';
import ProductosGrid from '../components/ProductosGrid';
import { isAuthenticated, getUsuarioActual, getPerfil } from '../services/usuario.service';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [puntosUsuario, setPuntosUsuario] = useState(null);
  const [cargandoPuntos, setCargandoPuntos] = useState(true);

  useEffect(() => {
    cargarProductos();
    cargarPuntosUsuario();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar productos' });
      setTimeout(() => setMensaje(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const cargarPuntosUsuario = async () => {
    try {
      setCargandoPuntos(true);
      if (isAuthenticated()) {
        // Obtener puntos directamente del perfil
        const respuesta = await getPerfil();
        if (respuesta.ok && respuesta.data) {
          setPuntosUsuario(respuesta.data.puntos || 0);
        } else {
          const usuario = getUsuarioActual();
          setPuntosUsuario(usuario?.puntos || 0);
        }
      }
    } catch (error) {
      console.error('Error al cargar puntos:', error);
      const usuario = getUsuarioActual();
      setPuntosUsuario(usuario?.puntos || 0);
    } finally {
      setCargandoPuntos(false);
    }
  };

  const handleCanjear = async (producto) => {
    if (!isAuthenticated()) {
      setMensaje({ 
        tipo: 'error', 
        texto: '❌ Debes iniciar sesión para canjear productos' 
      });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    if (puntosUsuario < producto.puntos_requeridos) {
      setMensaje({ 
        tipo: 'error', 
        texto: `❌ No tienes suficientes puntos. Necesitas ${producto.puntos_requeridos} puntos y tienes ${puntosUsuario}.` 
      });
      setTimeout(() => setMensaje(null), 4000);
      return;
    }

    try {
      const respuesta = await canjearProducto(producto.id);
      
      if (respuesta.error) {
        setMensaje({ 
          tipo: 'error', 
          texto: `❌ ${respuesta.error}` 
        });
      } else {
        const nuevosPuntos = respuesta.puntos_restantes;
        setPuntosUsuario(nuevosPuntos);
        
        const usuario = getUsuarioActual();
        if (usuario) {
          usuario.puntos = nuevosPuntos;
          localStorage.setItem('usuario', JSON.stringify(usuario));
        }
        
        setMensaje({ 
          tipo: 'success', 
          texto: `✅ ${respuesta.mensaje || `¡Canjeaste ${producto.nombre}!`} Te quedan ${nuevosPuntos} puntos. 🌿` 
        });
        cargarProductos();
      }
    } catch (err) {
      const mensajeError = err.response?.data?.error || err.response?.data?.msg || 'Error al canjear el producto';
      setMensaje({ 
        tipo: 'error', 
        texto: `❌ ${mensajeError}` 
      });
    } finally {
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #d4e6d4 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #d4a373',
            borderTop: '4px solid #2d5a2c',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '15px', color: '#6b4c3a' }}>Cargando productos...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #d4e6d4 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
        color: '#f5e6d3',
        padding: '40px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <span style={{ fontSize: '3rem' }}>🎁</span>
        <h1 style={{
          fontSize: '2.2rem',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Productos para Canje
        </h1>
        <p style={{
          fontSize: '1rem',
          opacity: 0.9
        }}>
          Canjea tus puntos por productos ecológicos 🌿
        </p>
      </div>

      {/* Tarjeta de puntos del usuario */}
      {isAuthenticated() && (
        <div style={{
          maxWidth: '1200px',
          margin: '20px auto 0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            backgroundColor: '#fefae0',
            borderRadius: '20px',
            padding: '15px 25px',
            border: '1px solid #d4a373',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '2rem' }}>⭐</span>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#6b4c3a', margin: 0 }}>Tus puntos disponibles</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d5a2c', margin: 0 }}>
                  {cargandoPuntos ? '...' : (puntosUsuario?.toLocaleString() || 0)} pts
                </p>
              </div>
            </div>
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '8px 15px',
              borderRadius: '20px'
            }}>
              <span style={{ color: '#2d5a2c', fontSize: '0.8rem' }}>
                💡 ¡Sigue acumulando puntos para más beneficios!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de notificación */}
      {mensaje && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 20px',
          background: mensaje.tipo === 'success' ? '#2d5a2c' : '#c62828',
          color: '#f5e6d3',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease'
        }}>
          {mensaje.texto}
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* Grid de productos */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <ProductosGrid 
          productos={productos} 
          onCanjear={handleCanjear}
        />
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#6b4c3a',
        fontSize: '0.8rem'
      }}>
        <a href="/" style={{ color: '#2d5a2c', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver al inicio
        </a>
        <p style={{ marginTop: '10px', fontSize: '0.7rem' }}>
          🌱 Acumula puntos y canjea por grandes beneficios
        </p>
      </div>
    </div>
  );
}