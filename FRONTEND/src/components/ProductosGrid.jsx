// src/components/ProductosGrid.jsx
import ProductoCard from './ProductoCard';

export default function ProductosGrid({ productos, onCanjear }) {
  if (productos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px',
        color: '#888'
      }}>
        <span style={{ fontSize: '3rem' }}>📦</span>
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '25px',
      padding: '20px'
    }}>
      {productos.map(producto => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          onCanjear={onCanjear}
        />
      ))}
    </div>
  );
}