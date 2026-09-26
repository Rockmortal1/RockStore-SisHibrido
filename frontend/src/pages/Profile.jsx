import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [perfil, setPerfil] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerDatosPerfil = async () => {
      try {
        // 1. Buscamos la llave que guardamos al hacer login en C#
        const token = localStorage.getItem('jwt_token');

        if (!token) {
          setError('No hay sesión activa.');
          setCargando(false);
          return;
        }

        // 2. Le pedimos a Python los datos, mostrándole la llave en la cabecera
        const responsePerfil = await axios.get(`${import.meta.env.VITE_CORE_API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPerfil(responsePerfil.data);

        const responsePedidos = await axios.get(`${import.meta.env.VITE_CORE_API_URL}/api/orders/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPedidos(responsePedidos.data);

        setCargando(false);

      } catch (err) {
        console.error("Error al obtener perfil:", err);
        setError('No se pudo cargar la información del perfil.');
        setCargando(false);
      }
    };

    obtenerDatosPerfil();
  }, []);

  if (cargando) return <h2 style={{ color: '#F9FAFB', textAlign: 'center', marginTop: '50px' }}>Cargando tu perfil... ⏳</h2>;
  if (error) return <h2 style={{ color: '#ef4444', textAlign: 'center', marginTop: '50px' }}>{error}</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', color: '#F9FAFB' }}>
      <h2 style={{ borderBottom: '2px solid #374151', paddingBottom: '15px' }}>Mi Perfil</h2>
      
      {perfil && (
        <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', border: '1px solid #374151', marginTop: '25px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ color: '#9CA3AF', margin: '0 0 5px 0' }}>ID de Usuario</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{perfil.user_id}</p>
            </div>
            
            <div>
              <p style={{ color: '#9CA3AF', margin: '0 0 5px 0' }}>Teléfono Registrado</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{perfil.phone_number || 'No registrado'}</p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#1F2937', padding: '20px', borderRadius: '8px', 
            marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#d48c06' }}>Saldo Cashback Disponible</h3>
              <p style={{ color: '#9CA3AF', margin: 0, fontSize: '0.9rem' }}>Puntos acumulados para tu próxima compra</p>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>
              ${perfil.cashback_points || 0}
            </div>
          </div>
        </div>
      )}
      {/* SECCIÓN DEL HISTORIAL DE COMPRAS */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ borderBottom: '1px solid #374151', paddingBottom: '10px', marginBottom: '20px' }}>
          Historial de Pedidos
        </h3>

        {pedidos.length === 0 ? (
          <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#9CA3AF' }}>
            Aún no has realizado ninguna compra.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {pedidos.map((pedido) => (
              <div key={pedido.id} style={{ 
                backgroundColor: '#111827', border: '1px solid #374151', 
                borderRadius: '8px', padding: '20px', display: 'flex', 
                justifyContent: 'space-between', alignItems: 'center' 
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#F9FAFB' }}>Pedido #{pedido.id}</h4>
                  <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.9rem' }}>
                    {new Date(pedido.order_date + 'Z').toLocaleDateString('es-AR', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                    })}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#F9FAFB' }}>
                    ${pedido.total_amount.toLocaleString('es-AR')}
                  </div>
                  <span style={{ 
                    display: 'inline-block', marginTop: '5px', padding: '4px 8px', 
                    borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                    backgroundColor: pedido.status === 'Pendiente' ? '#d48c06' : 
                                     pedido.status === 'Cancelado' ? '#ef4444' : '#10B981',
                    color: '#fff'
                  }}>
                    {pedido.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;