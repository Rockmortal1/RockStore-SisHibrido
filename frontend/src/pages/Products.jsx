import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const {addToCart} = useContext(CartContext);

  useEffect(() => {
    // Función para pedir los datos a Python
    const obtenerProductos = async () => {
      try {
        // Aseguramos de que '/productos' coincida con la ruta real en tu main.py de Python
        const response = await axios.get(`${import.meta.env.VITE_CORE_API_URL}/api/products`); 
        setProductos(response.data);
        setCargando(false);
      } catch (err) {
        console.error("Error al cargar el catálogo:", err);
        setError('No se pudieron cargar los productos del servidor.');
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []); // Los corchetes vacíos indican que esto se ejecuta solo una vez al cargar la página

  if (cargando) return <h2 style={{ color: '#F9FAFB', textAlign: 'center', marginTop: '50px' }}>Cargando catálogo... ⏳</h2>;
  
  if (error) return <h2 style={{ color: '#ef4444', textAlign: 'center', marginTop: '50px' }}>{error}</h2>;

  return (
    <div style={{ color: '#F9FAFB', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>Catálogo de RockStore</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
        {productos.map((producto) => (
          <div key={producto.id} style={{ 
            backgroundColor: '#1F2937', 
            borderRadius: '12px', 
            overflow: 'hidden',
            border: '1px solid #374151',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Si hay imágenes en BD, cambiar la URL falsa por producto.imagen */}
            <div style={{ height: '200px', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#9CA3AF' }}>📷 Imagen del Producto</span>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                {producto.nombre || producto.name} {/* Soporta nombre en ES o EN */}
              </h3>
              
              <p style={{ margin: '0 0 20px 0', color: '#9CA3AF', fontSize: '0.9rem', flexGrow: 1 }}>
                {producto.descripcion || producto.description || 'Sin descripción detallada.'}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10B981' }}>
                  ${producto.precio || producto.price}
                </span>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#374151', padding: '4px 8px', borderRadius: '4px' }}>
                  Stock: {producto.stock}
                </span>
              </div>

              <button 
              onClick={() => {
                addToCart(producto);
                alert(`¡${producto.nombre || producto.name} agregado al carrito! 🎸`);
              }}
              style={{ 
                backgroundColor: '#d48c06', color: '#ffffff', border: 'none', 
                padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%'
              }}>
                🛒 Añadir al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;