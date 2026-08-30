import { useState } from 'react';

const AdminOrders = () => {
  // Datos simulados de pedidos que entran a la tienda
  const [orders, setOrders] = useState([
    { id: "ORD-00146", customer: "juan@email.com", date: "29/08/2026", total: 45000, status: "Pendiente de Pago" },
    { id: "ORD-00147", customer: "maria@email.com", date: "29/08/2026", total: 180000, status: "Pago Confirmado" },
    { id: "ORD-00148", customer: "carlos@email.com", date: "28/08/2026", total: 25000, status: "En preparación" },
  ]);

  // Función para simular el cambio de estado de un pedido
  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    // Aquí en el futuro ira un Axios.put() hacia C# para guardar el cambio
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#F9FAFB', marginBottom: '20px' }}>Panel de Control - Pedidos Activos</h2>
      
      <div style={{ overflowX: 'auto', backgroundColor: '#111827', borderRadius: '10px', border: '1px solid #374151' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          
          <thead style={{ backgroundColor: '#1F2937' }}>
            <tr>
              <th style={thStyle}>ID Pedido</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #374151' }}>
                <td style={tdStyle}>
                  <span style={{ color: '#d48c06', fontWeight: 'bold' }}>{order.id}</span>
                </td>
                <td style={tdStyle}>{order.customer}</td>
                <td style={tdStyle}>{order.date}</td>
                <td style={tdStyle}>${order.total.toLocaleString('es-AR')}</td>
                
                {/* Selector de estado interactivo */}
                <td style={tdStyle}>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ 
                      backgroundColor: '#374151', color: 'white', border: '1px solid #4B5563', 
                      padding: '6px', borderRadius: '4px', outline: 'none', cursor: 'pointer' 
                    }}
                  >
                    <option value="Pendiente de Pago">Pendiente de Pago</option>
                    <option value="Pago Confirmado">Pago Confirmado</option>
                    <option value="En preparación">En preparación</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </td>
                
                {/* Botón para ver comprobante (Abre modal en el futuro) */}
                <td style={tdStyle}>
                  <button style={{ 
                    backgroundColor: 'transparent', color: '#06B6D4', border: '1px solid #06B6D4', 
                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s' 
                  }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#06B6D4'; e.target.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#06B6D4'; }}
                  >
                    Ver Comprobante
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Estilos reutilizables
const thStyle = { color: '#9CA3AF', padding: '15px', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' };
const tdStyle = { color: '#F9FAFB', padding: '15px', verticalAlign: 'middle' };

export default AdminOrders;