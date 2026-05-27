// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { 
  getUsuarioActual, 
  logout, 
  getPerfil,
  updatePerfil,
  updatePassword,
  deleteAccount
} from '../services/usuario.service';

export default function DashboardPage({ onLogout }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seccion, setSeccion] = useState('perfil');

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const respuesta = await getPerfil();
      if (respuesta.ok && respuesta.data) {
        setUsuario(respuesta.data);
      } else {
        setUsuario(getUsuarioActual());
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setUsuario(getUsuarioActual());
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  const handlePerfilActualizado = (nuevosDatos) => {
    setUsuario(nuevosDatos);
    setSeccion('perfil');
  };

  const handleDeleteAccount = async () => {
    const confirmar = window.confirm('⚠️ ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.');
    
    if (!confirmar) return;
    
    try {
      const respuesta = await deleteAccount();
      if (respuesta.ok) {
        alert('✅ Cuenta eliminada exitosamente');
        logout();
        if (onLogout) onLogout();
        window.location.href = '/';
      } else {
        alert('❌ Error al eliminar cuenta: ' + (respuesta.msg || 'Intenta de nuevo'));
      }
    } catch (err) {
      alert('❌ Error al eliminar cuenta: ' + (err.response?.data?.msg || err.message));
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #d4e6d4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #d4e6d4 100%)',
      fontFamily: "'Segoe UI', 'Roboto', sans-serif"
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
        color: '#f5e6d3',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🌿</span>
          <h1 style={{ fontSize: '1.3rem', margin: 0 }}>Mi Cuenta</h1>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>👤 {usuario?.nombre}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              background: '#f5e6d3',
              color: '#2d5a2c',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Cerrar Sesión 🔒
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: '1',
          minWidth: '200px',
          backgroundColor: '#fefae0',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid #d4a373',
          height: 'fit-content'
        }}>
          <h3 style={{ color: '#2d5a2c', marginBottom: '20px' }}>Opciones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setSeccion('perfil')}
              style={{
                padding: '10px 15px',
                background: seccion === 'perfil' ? '#2d5a2c' : 'transparent',
                color: seccion === 'perfil' ? '#f5e6d3' : '#2d5a2c',
                border: `1px solid #2d5a2c`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              👤 Ver Perfil
            </button>
            <button
              onClick={() => setSeccion('editar')}
              style={{
                padding: '10px 15px',
                background: seccion === 'editar' ? '#2d5a2c' : 'transparent',
                color: seccion === 'editar' ? '#f5e6d3' : '#2d5a2c',
                border: `1px solid #2d5a2c`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              ✏️ Editar Perfil
            </button>
            <button
              onClick={() => setSeccion('password')}
              style={{
                padding: '10px 15px',
                background: seccion === 'password' ? '#2d5a2c' : 'transparent',
                color: seccion === 'password' ? '#f5e6d3' : '#2d5a2c',
                border: `1px solid #2d5a2c`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🔑 Cambiar Contraseña
            </button>
            <button
              onClick={() => setSeccion('eliminar')}
              style={{
                padding: '10px 15px',
                background: seccion === 'eliminar' ? '#c62828' : 'transparent',
                color: seccion === 'eliminar' ? '#ffffff' : '#c62828',
                border: `1px solid #c62828`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🗑️ Eliminar Cuenta
            </button>
          </div>
        </div>

        <div style={{
          flex: '3',
          backgroundColor: '#fefae0',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid #d4a373'
        }}>
          {seccion === 'perfil' && (
            <div>
              <h2 style={{ color: '#2d5a2c', marginBottom: '20px' }}>Mi Perfil</h2>
              <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '15px' }}>
                <p><strong>ID:</strong> {usuario?.id}</p>
                <p><strong>Nombre:</strong> {usuario?.nombre}</p>
                <p><strong>Correo:</strong> {usuario?.correo}</p>
              </div>
            </div>
          )}

          {seccion === 'editar' && (
            <div>
              <h2 style={{ color: '#2d5a2c', marginBottom: '20px' }}>Editar Perfil</h2>
              <PerfilForm usuario={usuario} onUpdate={handlePerfilActualizado} />
            </div>
          )}

          {seccion === 'password' && (
            <div>
              <h2 style={{ color: '#2d5a2c', marginBottom: '20px' }}>Cambiar Contraseña</h2>
              <CambiarPasswordForm />
            </div>
          )}

          {seccion === 'eliminar' && (
            <div>
              <h2 style={{ color: '#c62828', marginBottom: '20px' }}>Eliminar Cuenta</h2>
              <div style={{ background: '#ffebee', padding: '20px', borderRadius: '15px', border: '1px solid #c62828' }}>
                <p style={{ color: '#c62828', marginBottom: '20px' }}>
                  ⚠️ <strong>¡Advertencia!</strong> Esta acción es irreversible.
                </p>
                <p style={{ marginBottom: '20px', color: '#333' }}>
                  Se eliminarán permanentemente:
                </p>
                <ul style={{ marginBottom: '20px', marginLeft: '20px', color: '#333' }}>
                  <li>Tu información personal</li>
                  <li>Tus datos de perfil</li>
                  <li>Todo el historial asociado a tu cuenta</li>
                </ul>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    padding: '12px 24px',
                    background: '#c62828',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#b71c1c'}
                  onMouseLeave={(e) => e.target.style.background = '#c62828'}
                >
                  🗑️ Eliminar mi cuenta permanentemente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer style={{
        backgroundColor: '#2d5a2c',
        color: '#f5e6d3',
        textAlign: 'center',
        padding: '20px',
        marginTop: '20px'
      }}>
        <p>🌿 Cuidando el planeta, un canje a la vez 🌿</p>
      </footer>
    </div>
  );
}

// Componente PerfilForm
function PerfilForm({ usuario, onUpdate }) {
  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    correo: usuario?.correo || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #d4a373',
    backgroundColor: '#ffffff',
    fontSize: '1rem',
    color: '#333333',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const respuesta = await updatePerfil(form);
      if (respuesta.ok) {
        setSuccess('✅ Perfil actualizado exitosamente');
        if (onUpdate && respuesta.data) {
          onUpdate(respuesta.data);
        }
      } else {
        setError(respuesta.msg || 'Error al actualizar');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '10px', marginBottom: '15px' }}>❌ {error}</div>}
      {success && <div style={{ background: '#e8f5e9', color: '#2d5a2c', padding: '10px', borderRadius: '10px', marginBottom: '15px' }}>{success}</div>}
      
      <div style={{ marginBottom: '15px' }}>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Correo:</label>
        <input type="email" name="correo" value={form.correo} onChange={handleChange} style={inputStyle} />
      </div>
      <button type="submit" disabled={loading} style={{
        width: '100%',
        padding: '12px',
        background: loading ? '#b0b0b0' : 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
        color: '#f5e6d3',
        border: 'none',
        borderRadius: '30px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}>
        {loading ? 'Guardando... 🌱' : 'Guardar Cambios 🌿'}
      </button>
    </form>
  );
}

// Componente CambiarPasswordForm
function CambiarPasswordForm() {
  const [form, setForm] = useState({ contrasena_actual: '', contrasena_nueva: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #d4a373',
    backgroundColor: '#ffffff',
    fontSize: '1rem',
    color: '#333333',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (form.contrasena_nueva.length < 6) {
      setError('❌ La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);

    try {
      const respuesta = await updatePassword(form.contrasena_actual, form.contrasena_nueva);
      if (respuesta.ok) {
        setSuccess('✅ Contraseña actualizada exitosamente');
        setForm({ contrasena_actual: '', contrasena_nueva: '' });
      } else {
        setError(respuesta.msg || 'Error al cambiar contraseña');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '10px', marginBottom: '15px' }}>❌ {error}</div>}
      {success && <div style={{ background: '#e8f5e9', color: '#2d5a2c', padding: '10px', borderRadius: '10px', marginBottom: '15px' }}>{success}</div>}
      
      <div style={{ marginBottom: '15px' }}>
        <label>Contraseña actual:</label>
        <input type="password" name="contrasena_actual" value={form.contrasena_actual} onChange={handleChange} required style={inputStyle} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Nueva contraseña:</label>
        <input type="password" name="contrasena_nueva" value={form.contrasena_nueva} onChange={handleChange} required style={inputStyle} />
        <p style={{ fontSize: '0.7rem', color: '#6b4c3a' }}>Mínimo 6 caracteres</p>
      </div>
      <button type="submit" disabled={loading} style={{
        width: '100%',
        padding: '12px',
        background: loading ? '#b0b0b0' : 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
        color: '#f5e6d3',
        border: 'none',
        borderRadius: '30px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}>
        {loading ? 'Actualizando... 🌱' : 'Cambiar Contraseña 🔑'}
      </button>
    </form>
  );
}