import ProductCard from "../components/ProductCard";

const Products = () => {
    const mockCatalog = [
        { id: 1, name: "Teclado Mecánico Redragon Kumara", price: 50000, discount_percentage: 10, category: "Periféricos", stock: 5 },
        { id: 2, name: "Mouse Logitech G203", price: 25000, discount_percentage: 0, category: "Periféricos", stock: 12 },
        { id: 3, name: "Monitor 24'' 144Hz", price: 180000, discount_percentage: 15, category: "Monitores", stock: 3 },
    ];

    return (
        <div>
            <h2 style={{color: '#F9FAFB', marginBottom: '20px'}}>Catalogo Completo</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                {mockCatalog.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Products;