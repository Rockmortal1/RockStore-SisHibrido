import { useState } from 'react';

const Cart = () => {
  // Estado para el checkbox del cashback
  const [useCashback, setUseCashback] = useState(false);

  const mockCartItems = [
    { id: 1, name: "Teclado Mecánico Redragon Kumara", price: 50000, discount_percentage: 10, quantity: 1 },
    { id: 2, name: "Mouse Logitech G203", price: 25000, discount_percentage: 0, quantity: 2 },
  ];
  const userCashbackAvailable = 3500; // Saldo de mentira del usuario

  // 1. Total original (sin descuentos)
  const originalTotal = mockCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // 2. Total con los descuentos
  const totalWithDiscounts = mockCartItems.reduce((acc, item) => {
    const finalPrice = item.price - (item.price * (item.discount_percentage / 100));
    return acc + (finalPrice * item.quantity);
  }, 0);

  // 3. Cuánto se ahorró en ofertas
  const savings = originalTotal - totalWithDiscounts;

  // 4. Total final a pagar 
  const finalPayable = useCashback 
    ? Math.max(0, totalWithDiscounts - userCashbackAvailable) 
    : totalWithDiscounts;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#F9FAFB', marginBottom: '30px' }}>Tu Carrito de Compras</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* LISTA DE PRODUCTOS */}
        <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '10px', border: '1px solid #374151' }}>
          {mockCartItems.map((item) => {
            const finalItemPrice = item.price - (item.price * (item.discount_percentage / 100));
            
            return (
              <div key={item.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '15px 0', borderBottom: '1px solid #1F2937' 
              }}>
                <div>
                  <h4 style={{ color: '#F9FAFB', margin: '0 0 5px 0' }}>{item.name}</h4>
                  <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Cantidad: {item.quantity}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {item.discount_percentage > 0 && (
                    <div style={{ color: '#9CA3AF', textDecoration: 'line-through', fontSize: '0.8rem' }}>
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </div>
                  )}
                  <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${(finalItemPrice * item.quantity).toLocaleString('es-AR')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RESUMEN Y CHECKOUT */}
        <div style={{ backgroundColor: '#1F2937', padding: '25px', borderRadius: '10px', border: '1px solid #374151' }}>
          <h3 style={{ color: '#F9FAFB', margin: '0 0 20px 0', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>
            Resumen de la Orden
          </h3>
          
          <div style={summaryRowStyle}>
            <span style={{ color: '#9CA3AF' }}>Subtotal:</span>
            <span style={{ color: '#F9FAFB' }}>${originalTotal.toLocaleString('es-AR')}</span>
          </div>

          {/* Muestra el ahorro si hay descuento */}
          {savings > 0 && (
            <div style={summaryRowStyle}>
              <span style={{ color: '#10B981' }}>Ahorro por ofertas:</span>
              <span style={{ color: '#10B981' }}>- ${savings.toLocaleString('es-AR')}</span>
            </div>
          )}

          {/* Sección Cashback */}
          <div style={{ 
            backgroundColor: '#111827', padding: '15px', borderRadius: '8px', 
            marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
          }}>
            <div>
              <label style={{ color: '#F9FAFB', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={useCashback} 
                  onChange={(e) => setUseCashback(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Usar saldo Cashback
              </label>
              <div style={{ color: '#d48c06', fontSize: '0.85rem', marginTop: '5px', marginLeft: '28px' }}>
                Disponible: ${userCashbackAvailable.toLocaleString('es-AR')}
              </div>
            </div>
            
            {useCashback && (
              <span style={{ color: '#d48c06', fontWeight: 'bold' }}>
                - ${Math.min(userCashbackAvailable, totalWithDiscounts).toLocaleString('es-AR')}
              </span>
            )}
          </div>

          {/* Total Final */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', marginTop: '25px', 
            paddingTop: '20px', borderTop: '1px solid #374151' 
          }}>
            <span style={{ color: '#F9FAFB', fontSize: '1.2rem', fontWeight: 'bold' }}>Total a pagar:</span>
            <span style={{ color: '#d48c06', fontSize: '1.5rem', fontWeight: 'bold' }}>
              ${finalPayable.toLocaleString('es-AR')}
            </span>
          </div>

          <button style={{
            width: '100%', backgroundColor: '#d48c06', color: '#ffffff', border: 'none',
            padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem',
            cursor: 'pointer', marginTop: '20px', transition: 'opacity 0.3s'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Confirmar Pedido
          </button>
        </div>

      </div>
    </div>
  );
};


const summaryRowStyle = {
  display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1.05rem'
};

export default Cart;