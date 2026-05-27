// src/pages/ContactoPage.jsx
import { useState } from 'react';
import { enviarContacto } from '../services/contacto.service';

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
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
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!form.nombre.trim()) {
      setError('❌ El nombre es requerido');
      setLoading(false);
      return;
    }
    if (!form.correo.trim()) {
      setError('❌ El correo es requerido');
      setLoading(false);
      return;
    }
    if (!form.mensaje.trim()) {
      setError('❌ El mensaje es requerido');
      setLoading(false);
      return;
    }

    try {
      const respuesta = await enviarContacto(form);
      
      if (respuesta.ok) {
        setSuccess('✅ ¡Mensaje enviado exitosamente! Te contactaremos pronto. 🌿');
        setForm({ nombre: '', correo: '', mensaje: '' });
      } else {
        setError(respuesta.msg || 'Error al enviar mensaje');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.msg || 'Error al enviar mensaje');
    } finally {
      setLoading(false);
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
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ fontSize: '3rem' }}>📧</span>
          <h2 style={{
            color: '#2d5a2c',
            fontSize: '1.8rem',
            marginTop: '10px',
            marginBottom: '5px'
          }}>
            Contáctanos
          </h2>
          <p style={{ color: '#6b4c3a', fontSize: '0.9rem' }}>
            ¿Dudas o sugerencias? Escríbenos
          </p>
        </div>

        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>
            ❌ {error}
          </div>
        )}
        
        {success && (
          <div style={{ background: '#e8f5e9', color: '#2d5a2c', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2d5a2c',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Nombre completo:
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
              onBlur={(e) => e.target.style.borderColor = '#d4a373'}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2d5a2c',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Correo electrónico:
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#2d5a2c'}
              onBlur={(e) => e.target.style.borderColor = '#d4a373'}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2d5a2c',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Mensaje:
            </label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
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
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#b0b0b0' : 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
              color: '#f5e6d3',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.transform = 'scale(1)';
            }}
          >
            {loading ? 'Enviando... 🌱' : 'Enviar Mensaje 🌿'}
          </button>
        </form>

        <div style={{
          marginTop: '25px',
          textAlign: 'center',
          paddingTop: '15px',
          borderTop: '1px solid #d4a373'
        }}>
          <a href="/" style={{
            color: '#2d5a2c',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            ← Volver al inicio
          </a>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '15px',
          fontSize: '0.7rem',
          color: '#6b4c3a'
        }}>
          🌱 "Pequeñas acciones, grandes cambios"
        </div>
      </div>
    </div>
  );
}