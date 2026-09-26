import { useState } from 'react';
import axios from 'axios'; // Importación para hacer peticiones HTTP
import { useNavigate, Link } from 'react-router-dom'; // Para cambiar de página

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para manejar errores
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos al intentar de nuevo

    try {
      // ¡Aquí está el puente hacia tu API en C#!
      // Asegúrate de que '/api/auth/login' sea la ruta correcta de tu controlador
      const response = await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/api/auth/login`, {
        email: email,
        password: password
      });

      // Si C# responde con éxito, guardamos el token JWT en el navegador
      const token = response.data.token;
      localStorage.setItem('jwt_token', token);
      
      console.log("¡Login exitoso! Token guardado.");
      
      // Enviamos al usuario directamente al catálogo
      navigate('/productos');

    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError('Credenciales incorrectas o problema de conexión con el servidor.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{
        backgroundColor: '#111827',
        padding: '40px',
        borderRadius: '10px',
        border: '1px solid #374151',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#F9FAFB', textAlign: 'center', marginBottom: '30px' }}>
          Iniciar Sesión
        </h2>

        {/* Muestra un cartel rojo si hay un error de login */}
        {error && (
          <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>
              Correo Electrónico
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>
              Contraseña
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Entrar
          </button>
        </form>
        <div style={{marginTop: '20px', textAlign: 'center'}}>
            <span style={{color: '#9CA3AF', fontSize: '0.9rem'}}>¿No tienes cuenta? </span>
            <Link to="/register" style={{color: '#d48c06', textDecoration: 'none', fontWeight: 'bold'}}>
                Registrate aqui
            </Link>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #374151',
  backgroundColor: '#1F2937', color: '#F9FAFB', boxSizing: 'border-box', outline: 'none'
};

const buttonStyle = {
  backgroundColor: '#d48c06', color: '#ffffff', padding: '12px', border: 'none',
  borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px'
};

export default Login;