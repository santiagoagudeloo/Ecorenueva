// src/components/UsuarioForm.jsx
import { useState } from 'react';
import { create } from '../services/usuario.service';
import { login } from '../services/usuario.service';
import { enviarContacto } from '../services/contacto.service';

export default function UsuarioForm({ onRegistroSuccess, onLoginSuccess }) {
  // Estado para saber qué formulario mostrar
  const [formularioActivo, setFormularioActivo] = useState('registro'); // 'registro', 'login', 'contacto'

  // Estados para el formulario de REGISTRO
  const [formRegistro, setFormRegistro] = useState({
    nombre: '',
    correo: '',
    contrasena: ''
  });
  const [errorRegistro, setErrorRegistro] = useState('');
  const [successRegistro, setSuccessRegistro] = useState('');
  const [loadingRegistro, setLoadingRegistro] = useState(false);

  // Estados para el formulario de LOGIN
  const [formLogin, setFormLogin] = useState({
    correo: '',
    contrasena: ''
  });
  const [errorLogin, setErrorLogin] = useState('');
  const [successLogin, setSuccessLogin] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Estados para el formulario de CONTACTO
  const [formContacto, setFormContacto] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [errorContacto, setErrorContacto] = useState('');
  const [successContacto, setSuccessContacto] = useState('');
  const [loadingContacto, setLoadingContacto] = useState(false);

  // ========== Estilo para inputs ==========
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

  // ========== HANDLERS REGISTRO ==========
  const handleChangeRegistro = (e) => {
    setFormRegistro({
      ...formRegistro,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitRegistro = async (e) => {
    e.preventDefault();
    setErrorRegistro('');
    setSuccessRegistro('');
    setLoadingRegistro(true);

    try {
      const respuesta = await create(formRegistro);
      
      if (respuesta.ok) {
        setSuccessRegistro('✅ ¡Usuario creado exitosamente! 🌿');
        setFormRegistro({ nombre: '', correo: '', contrasena: '' });
        
        setTimeout(() => {
          if (onRegistroSuccess) {
            onRegistroSuccess();
          }
        }, 2000);
      } else {
        setErrorRegistro(respuesta.msg || 'Error al registrarse');
      }
    } catch (err) {
      const mensajeError = err.response?.data?.msg || 'Error al registrarse';
      setErrorRegistro(mensajeError);
    } finally {
      setLoadingRegistro(false);
    }
  };

  // ========== HANDLERS LOGIN ==========
  const handleChangeLogin = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setErrorLogin('');
    setSuccessLogin('');
    setLoadingLogin(true);

    try {
      const respuesta = await login(formLogin.correo, formLogin.contrasena);
      
      if (respuesta.ok) {
        setSuccessLogin('✅ ¡Sesión iniciada correctamente! 🌿');
        setFormLogin({ correo: '', contrasena: '' });
        
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 2000);
      } else {
        setErrorLogin(respuesta.msg || 'Error al iniciar sesión');
      }
    } catch (err) {
      const mensajeError = err.response?.data?.msg || 'Error al iniciar sesión';
      setErrorLogin(mensajeError);
    } finally {
      setLoadingLogin(false);
    }
  };

  // ========== HANDLERS CONTACTO ==========
  const handleChangeContacto = (e) => {
    setFormContacto({
      ...formContacto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitContacto = async (e) => {
    e.preventDefault();
    setErrorContacto('');
    setSuccessContacto('');
    setLoadingContacto(true);

    // Validaciones
    if (!formContacto.nombre.trim()) {
      setErrorContacto('❌ El nombre es requerido');
      setLoadingContacto(false);
      return;
    }
    if (!formContacto.email.trim()) {
      setErrorContacto('❌ El email es requerido');
      setLoadingContacto(false);
      return;
    }
    if (!formContacto.mensaje.trim()) {
      setErrorContacto('❌ El mensaje es requerido');
      setLoadingContacto(false);
      return;
    }

    try {
      // Convertir email a correo (backend espera "correo")
      const datosParaBackend = {
        nombre: formContacto.nombre,
        correo: formContacto.email,
        mensaje: formContacto.mensaje
      };
      
      const respuesta = await enviarContacto(datosParaBackend);
      
      if (respuesta.ok) {
        setSuccessContacto('✅ ¡Mensaje enviado! Te contactaremos pronto. 🌿');
        setFormContacto({ nombre: '', email: '', mensaje: '' });
      } else {
        setErrorContacto(respuesta.msg || 'Error al enviar mensaje');
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorContacto(err.response?.data?.msg || 'Error al enviar mensaje');
    } finally {
      setLoadingContacto(false);
    }
  };

  // ========== RENDERIZAR FORMULARIO SEGÚN EL ACTIVO ==========
  const renderFormulario = () => {
    switch (formularioActivo) {
      case 'registro':
        return (
          <form onSubmit={handleSubmitRegistro}>
            <h3 style={{ color: '#2d5a2c', marginBottom: '20px' }}>📝 Crear Cuenta</h3>
            
            {errorRegistro && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
                ❌ {errorRegistro}
              </div>
            )}
            
            {successRegistro && (
              <div style={{ background: '#e8f5e9', color: '#2d5a2c', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
                {successRegistro}
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2d5a2c', fontWeight: '600' }}>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formRegistro.nombre}
                onChange={handleChangeRegistro}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
                onBlur={(e) => e.target.style.borderColor = '#d4a373'}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2d5a2c', fontWeight: '600' }}>Correo:</label>
              <input
                type="email"
                name="correo"
                value={formRegistro.correo}
                onChange={handleChangeRegistro}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
                onBlur={(e) => e.target.style.borderColor = '#d4a373'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2d5a2c', fontWeight: '600' }}>Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                value={formRegistro.contrasena}
                onChange={handleChangeRegistro}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
                onBlur={(e) => e.target.style.borderColor = '#d4a373'}
              />
            </div>

            <button
              type="submit"
              disabled={loadingRegistro}
              style={{
                width: '100%',
                padding: '12px',
                background: loadingRegistro ? '#b0b0b0' : 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
                color: '#f5e6d3',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loadingRegistro ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loadingRegistro) e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                if (!loadingRegistro) e.target.style.transform = 'scale(1)';
              }}
            >
              {loadingRegistro ? 'Registrando... 🌱' : 'Registrarse 🌿'}
            </button>
          </form>
        );

      case 'login':
        return (
          <form onSubmit={handleSubmitLogin}>
            <h3 style={{ color: '#2d5a2c', marginBottom: '20px' }}>🔑 Iniciar Sesión</h3>
            
            {errorLogin && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
                ❌ {errorLogin}
              </div>
            )}
            
            {successLogin && (
              <div style={{ background: '#e8f5e9', color: '#2d5a2c', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
                {successLogin}
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2d5a2c', fontWeight: '600' }}>Correo:</label>
              <input
                type="email"
                name="correo"
                value={formLogin.correo}
                onChange={handleChangeLogin}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
                onBlur={(e) => e.target.style.borderColor = '#d4a373'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2d5a2c', fontWeight: '600' }}>Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                value={formLogin.contrasena}
                onChange={handleChangeLogin}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
                onBlur={(e) => e.target.style.borderColor = '#d4a373'}
              />
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              style={{
                width: '100%',
                padding: '12px',
                background: loadingLogin ? '#b0b0b0' : 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
                color: '#f5e6d3',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loadingLogin ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loadingLogin) e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                if (!loadingLogin) e.target.style.transform = 'scale(1)';
              }}
            >
              {loadingLogin ? 'Iniciando sesión... 🌱' : 'Iniciar Sesión 🌿'}
            </button>
          </form>
        );

      case 'contacto':
        return (
          <form onSubmit={handleSubmitContacto}>
            <h3 style={{ color: '#2d5a2c', marginBottom: '20px' }}>📧 Contáctanos</h3>
            
            {errorContacto && (
              <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
                ❌ {errorContacto}
              </div>
            )}
            
            {successContacto && (
              <div style={{ background: '#e8f5e9', color: '#2d5a2c', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
                {successContacto}
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2d5a2c', fontWeight: '600' }}>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formContacto.nombre}
                onChange={handleChangeContacto}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
                onBlur={(e) => e.target.style.borderColor = '#d4a373'}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2d5a2c', fontWeight: '600' }}>Email:</label>
              <input
                type="email"
                name="email"
                value={formContacto.email}
                onChange={handleChangeContacto}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
                onBlur={(e) => e.target.style.borderColor = '#d4a373'}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2d5a2c', fontWeight: '600' }}>Mensaje:</label>
              <textarea
                name="mensaje"
                value={formContacto.mensaje}
                onChange={handleChangeContacto}
                required
                rows="4"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
                onBlur={(e) => e.target.style.borderColor = '#d4a373'}
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button
              type="submit"
              disabled={loadingContacto}
              style={{
                width: '100%',
                padding: '12px',
                background: loadingContacto ? '#b0b0b0' : 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
                color: '#f5e6d3',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loadingContacto ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loadingContacto) e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                if (!loadingContacto) e.target.style.transform = 'scale(1)';
              }}
            >
              {loadingContacto ? 'Enviando... 🌱' : 'Enviar Mensaje 🌿'}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #d4e6d4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', 'Roboto', sans-serif"
    }}>
      <div style={{
        maxWidth: '500px',
        width: '90%',
        margin: '20px auto',
        padding: '35px',
        backgroundColor: '#fefae0',
        borderRadius: '25px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid #d4a373'
      }}>
        {/* Botones para cambiar entre formularios */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '2px solid #d4a373',
          paddingBottom: '15px'
        }}>
          <button
            onClick={() => setFormularioActivo('registro')}
            style={{
              flex: 1,
              padding: '10px',
              background: formularioActivo === 'registro' ? '#2d5a2c' : 'transparent',
              color: formularioActivo === 'registro' ? '#f5e6d3' : '#2d5a2c',
              border: `2px solid #2d5a2c`,
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            📝 Registro
          </button>
          
          <button
            onClick={() => setFormularioActivo('login')}
            style={{
              flex: 1,
              padding: '10px',
              background: formularioActivo === 'login' ? '#2d5a2c' : 'transparent',
              color: formularioActivo === 'login' ? '#f5e6d3' : '#2d5a2c',
              border: `2px solid #2d5a2c`,
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            🔑 Login
          </button>
          
          <button
            onClick={() => setFormularioActivo('contacto')}
            style={{
              flex: 1,
              padding: '10px',
              background: formularioActivo === 'contacto' ? '#2d5a2c' : 'transparent',
              color: formularioActivo === 'contacto' ? '#f5e6d3' : '#2d5a2c',
              border: `2px solid #2d5a2c`,
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            📧 Contacto
          </button>
        </div>

        {/* Renderizar el formulario activo */}
        {renderFormulario()}

        {/* Enlace para volver al inicio */}
        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          paddingTop: '15px',
          borderTop: '1px solid #d4a373'
        }}>
          <a href="/" style={{ color: '#2d5a2c', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            ← Volver al inicio
          </a>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '15px',
          fontSize: '0.7rem',
          color: '#6b4c3a'
        }}>
          🌍 Juntos cuidamos el planeta
        </div>
      </div>
    </div>
  );
}