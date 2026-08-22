import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <nav style={{
            backgroundColor: '#111827',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #374151',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            {/*Aqui va el logo o nombre del proyecto*/}
            <Link to="/" style={{textDecoration: 'none'}}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F9FAFB'}}>
                    Rock<span style={{color: '#06B6D4'}}>Store</span>
                </div>
            </Link>

            {/* Enlaces de navegacion */}
            <div style={{ display: 'flex', gap: '20px'}}>
                <Link to="/" style={linkStyle}>Inicio</Link>
                <Link to="/productos" style={linkStyle}>Catalogos</Link>
                <Link to="/admin/pedidos" style={linkStyle}>Panel Admin</Link>
            </div>

            {/* Carrito y perfil*/}
            <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                <Link to="/login" style={linkStyle}>
                    Ingresar
                </Link>

                <Link to="/carrito" style={{
                    backgroundColor: '#d48c06',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    transition: 'background 0.3s'
                }}>
                    Carrito
                </Link>
            </div>
        </nav>
    );
};

const linkStyle = {
    color: '#D1D5DB',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500'
};

export default Navbar;