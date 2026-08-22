const ProductCard = ({ product }) => {
  const hasDiscount = product.discount_percentage > 0;
  const finalPrice = product.price - (product.price * ((product.discount_percentage || 0) / 100));

  return (
    <div style={{
      backgroundColor: '#1F2937', padding: '20px', borderRadius: '8px',
      border: '1px solid #374151', display: 'flex', flexDirection: 'column', position: 'relative'
    }}>
      {hasDiscount && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', backgroundColor: '#ef4444',
          color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
        }}>
          -{product.discount_percentage}% OFF
        </div>
      )}

      <div style={{
        backgroundColor: '#374151', height: '150px', borderRadius: '6px',
        marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF'
      }}>
        📷 Imagen
      </div>
      
      <span style={{ color: '#d48c06', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {product.category}
      </span>
      <h3 style={{ color: '#F9FAFB', fontSize: '1.2rem', margin: '10px 0' }}>
        {product.name}
      </h3>
      
      <div style={{ margin: '0 0 15px 0' }}>
        {hasDiscount ? (
          <>
            <span style={{ color: '#9CA3AF', textDecoration: 'line-through', fontSize: '0.9rem', marginRight: '10px' }}>
              ${product.price.toLocaleString('es-AR')}
            </span>
            <span style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 'bold' }}>
              ${finalPrice.toLocaleString('es-AR')}
            </span>
          </>
        ) : (
          <span style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: 'bold' }}>
            ${product.price.toLocaleString('es-AR')}
          </span>
        )}
      </div>
      
      <button style={{
        marginTop: 'auto', backgroundColor: '#d48c06', color: '#ffffff',
        border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
      }}>
        Ver / Agregar
      </button>
    </div>
  );
};

export default ProductCard;