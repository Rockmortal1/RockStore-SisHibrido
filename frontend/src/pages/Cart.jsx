import { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const Cart = () => {
  const [useCashback, setUseCashback] = useState(false);

  // Traemos los productos reales de la nube
  const { cartItems } = useContext(CartContext);

  const [userCashbackAvailable, setUserCashbackAvailable] = useState(0);

  useEffect(() => {
    const obtenerSaldo = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        const response = await axios.get('http://localhost:8000/api/profile/me', {
          headers: {Authorization: `Bearer ${token}`}
        });

        setUserCashbackAvailable(response.data.cashback_points || 0);
      } catch (error) {
        console.error("Error al obtener el saldo cashback:", error);
      }
    };

    obtenerSaldo();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: '#F9FAFB' }}>
        <h2>Tu carrito está vacío 🛒</h2>
        <p style={{ color: '#9CA3AF' }}>¡Ve al catálogo para agregar algunos productos!</p>
      </div>
    );
  }

  const originalTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const totalWithDiscounts = cartItems.reduce((acc, item) => {
    const descuento = item.discount_percentage || 0; 
    const finalPrice = item.price - (item.price * (descuento / 100));
    return acc + (finalPrice * item.quantity);
  }, 0);

  // 3. Cuánto se ahorró en ofertas
  const savings = originalTotal - totalWithDiscounts;

  // 4. Total final a pagar 
  const finalPayable = useCashback 
    ? Math.max(0, totalWithDiscounts - userCashbackAvailable) 
    : totalWithDiscounts;

  const handleWhatsAppCheckout = async () => {
    try {
      // 1. Buscamos la llave de seguridad
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        alert("Por favor, inicia sesión para confirmar tu compra.");
        return;
      }

      // 2. Armamos el paquete de datos tal como lo espera tu backend en Python
      const orderPayload = {
        // Mapeamos el carrito para enviar solo lo que la base de datos necesita
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        use_cashback: useCashback,
        total_amount: finalPayable
      };

      // 3. Disparamos la petición POST a Python para registrar la orden
      await axios.post('http://localhost:8000/api/checkout', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 4. Si la base de datos responde OK, armamos el ticket de WhatsApp
      const phoneNumber = "5493364282905"; 
      let message = `¡Hola RockStore! 🎸 Quiero confirmar mi pedido:\n\n`;
      
      cartItems.forEach(item => {
        const finalItemPrice = item.price - (item.price * ((item.discount_percentage || 0) / 100));
        message += `- ${item.quantity}x ${item.name} ($${(finalItemPrice * item.quantity).toLocaleString('es-AR')})\n`;
      });
      
      message += `\n*Subtotal:* $${originalTotal.toLocaleString('es-AR')}\n`;
      
      if (savings > 0) {
        message += `*Ahorro por ofertas:* -$${savings.toLocaleString('es-AR')}\n`;
      }

      if (useCashback) {
        const cashbackUsed = Math.min(userCashbackAvailable, totalWithDiscounts);
        message += `*Cashback utilizado:* -$${cashbackUsed.toLocaleString('es-AR')}\n`;
      }

      message += `\n*Total final a pagar: $${finalPayable.toLocaleString('es-AR')}*\n\n`;
      message += `¿Me pasas el alias o el link de pago?`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      // 5. Abrimos WhatsApp y le avisamos al usuario
      window.open(whatsappUrl, '_blank');
      alert("¡Pedido registrado con éxito! 🚀 Puedes verlo en tu Perfil.");

    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      alert("Hubo un problema al registrar la orden en el servidor. Intenta nuevamente.");
    }
  };

  const handleMercadoPagoCheckout = () => {
    // Aquí luego llamaremos a la API de Python para generar el link real de pago.
    // Por ahora, simulamos la redirección:
    alert(`Redirigiendo a Mercado Pago para abonar un total de $${finalPayable.toLocaleString('es-AR')}... 🚀`);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#F9FAFB', marginBottom: '30px' }}>Tu Carrito de Compras</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* LISTA DE PRODUCTOS */}
        <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '10px', border: '1px solid #374151' }}>
          {cartItems.map((item) => {
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

          {/* BOTONES DE PAGO DUALES */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '25px', flexDirection: 'column' }}>
            
            <button style={{
              width: '100%', backgroundColor: '#009EE3', color: '#ffffff', border: 'none',
              padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem',
              cursor: 'pointer', transition: 'opacity 0.3s'
            }}
            onClick={handleMercadoPagoCheckout}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              💳 Pagar con Mercado Pago
            </button>

            <button style={{
              width: '100%', backgroundColor: '#25D366', color: '#ffffff', border: 'none',
              padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem',
              cursor: 'pointer', transition: 'opacity 0.3s'
            }}
            onClick={handleWhatsAppCheckout}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              💬 Acordar pago por WhatsApp
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
};


const summaryRowStyle = {
  display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1.05rem'
};

export default Cart;