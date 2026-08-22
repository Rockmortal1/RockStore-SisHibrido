import ProductCard from "../components/ProductCard";

const Home = () => {
    const mockProducts = [
        { id: 1, name: "Teclado Mecánico Redragon Kumara", price: 50000, discount_percentage: 10, category: "Periféricos", stock: 5 },
        { id: 2, name: "Mouse Logitech G203", price: 25000, discount_percentage: 0, category: "Periféricos", stock: 12 },
        { id: 3, name: "Monitor 24'' 144Hz", price: 180000, discount_percentage: 15, category: "Monitores", stock: 3 },
    ];

    return (
        <div>
            {/* Cabecera de bienvenida */}
            <div style={{
                backgroundColor: '#111827',
                padding: '40px',
                borderRadius: '10px',
                textAlign: 'center',
                marginBottom: '40px',
                border: '1px solid # 374151'
            }}>
                <h1 style={{color: '#F9FAFB', fontSize: '2.5rem', margin: '0 0 10px 0'}}>
                    Bienvenido a Rockstore
                </h1>
                <p style={{color: '#9CA3AF', fontSize: '1.1rem', margin: 0}}>
                    Explora nuestro catalogo y arma tu setup ideal.
                </p>
            </div>

            {/* Titulo de la seccion */}
            <h2 style={{color: '#F9FAFB', marginBottom: '20px'}}>Productos Destacados</h2>

            {/*Grilla de productos*/}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px'}}>
                {mockProducts.map((product) => (
                    <ProductCard key = {product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Home;