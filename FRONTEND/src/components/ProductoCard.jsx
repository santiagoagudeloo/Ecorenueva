// src/components/ProductoCard.jsx
export default function ProductoCard({ producto, onCanjear }) {
  // Formatear número de puntos con separador de miles
  const formatearPuntos = (puntos) => {
    return puntos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div style={{
      background: '#fefae0',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      border: '1px solid #d4a373'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontSize: '3rem' }}>💳</span>
      </div>
      
      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontSize: '1.2rem',
          color: '#2d5a2c',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          {producto.nombre}
        </h3>
        
        <p style={{
          fontSize: '0.9rem',
          color: '#6b4c3a',
          marginBottom: '15px',
          lineHeight: '1.5'
        }}>
          {producto.descripcion || 'Tarjeta electrónica disponible para canje'}
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div>
            <span style={{
              fontSize: '0.7rem',
              color: '#6b4c3a',
              display: 'block',
              marginBottom: '3px'
            }}>
              Puntos requeridos
            </span>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#2d5a2c'
            }}>
              {formatearPuntos(producto.puntos_requeridos)} pts
            </span>
          </div>
          <span style={{
            fontSize: '0.8rem',
            color: '#6b4c3a',
            background: '#e8f5e9',
            padding: '4px 8px',
            borderRadius: '20px'
          }}>
            🎁 Disponible
          </span>
        </div>
        
        <button
          onClick={() => onCanjear(producto)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #2d5a2c 0%, #1b3a1a 100%)',
            color: '#f5e6d3',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          🎁 Canjear Ahora
        </button>
      </div>
    </div>
  );
}