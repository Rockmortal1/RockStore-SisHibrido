import { Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AdminOrders from './pages/AdminOrders';

//const Home = () => <h1 style={{color: 'white'}}>Pantalla de inicio</h1>;
//const Products = () => <h1 style={{color: 'white'}}>Catalogo de Productos</h1>
//const Cart = () => <h1 style={{color: 'white'}}>Tu carrito</h1>
//const AdminOrders = () => <h1 style={{color: 'white'}}>Pedidos Activos (Admin)</h1>

const titleStyle = {color: '#F9FAFB', marginTop: '20px'};

function App() {
  return (
    <div style={{backgroundColor: '#030712', minHeight: '100vh', fontFamily: 'system-ui, sans-serif'}}>
      {/*Aqui ira el Navbar*/}
      <Navbar />

      <main style={{ padding: '30px'}}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login/>} />
          <Route path="/productos" element={<Products />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;