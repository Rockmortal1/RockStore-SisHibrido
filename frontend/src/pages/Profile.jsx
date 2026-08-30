const Profile = () => {
  // Datos simulados del historial de compras del usuario
  const mockOrders = [
    {
      id: "ORD-00123",
      date: "15/08/2026",
      status: "Entregado",
      total: 67500, // Total que pago en ese momento
      items: [
        { name: "Teclado Mecánico Redragon Kumara", price_bought: 45000 }, // Precio con el 10% OFF ya aplicado
        { name: "Mouse Logitech G203", price_bought: 22500 }
      ]
    },
    {
      id: "ORD-00145",
      date: "28/08/2026",
      status: "En preparación",
      total: 153000,
      items: [
        { name: "Monitor 24'' 144Hz", price_bought: 153000 } // Precio con el 15% OFF ya aplicado
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '20px' }}>
        <div style={{ 
          width: '60px', height: '60px', backgroundColor: '#d48c06', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' 
        }}>
          U
        </div>
        <div>
          <h2 style={{ color: '#F9FAFB', margin: '0 0 5px 0' }}>Mi Perfil</h2>
          <span style={{ color: '#9CA3AF' }}>usuario@email.com</span>
        </div>
      </div>

      <h3 style={{ color: '#F9FAFB', marginBottom: '20px', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>
        Historial de Pedidos
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {mockOrders.map((order) => (
          <div key={order.id} style={{ 
            backgroundColor: '#111827', padding: '20px', borderRadius: '10px', 
            border: '1px solid #374151', display: 'flex', flexDirection: 'column', gap: '15px' 
          }}>
            
            {/* Encabezado del pedido */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1F2937', paddingBottom: '10px' }}>
              <div>
                <span style={{ color: '#d48c06', fontWeight: 'bold', marginRight: '15px' }}>{order.id}</span>
                <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{order.date}</span>
              </div>
              <div style={{ 
                backgroundColor: order.status === 'Entregado' ? '#065f46' : '#92400e',
                color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'
              }}>
                {order.status}
              </div>
            </div>

            {/* Lista de Productos Comprados (Precios Históricos) */}
            <div>
              {order.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#D1D5DB' }}>• {item.name}</span>
                  <span style={{ color: '#F9FAFB' }}>${item.price_bought.toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>

            {/* Total y boton PDF */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #1F2937' }}>
              <div style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 'bold' }}>
                Total Pagado: ${order.total.toLocaleString('es-AR')}
              </div>
              
              <button style={{
                backgroundColor: 'transparent', color: '#06B6D4', border: '1px solid #06B6D4',
                padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = '#06B6D4'; e.target.style.color = '#fff'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#06B6D4'; }}
              >
                📄 Descargar Factura
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;