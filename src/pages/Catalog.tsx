import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, RefreshCw, Sparkles } from 'lucide-react';
import { useCart } from '../store/useCart';
import { fetchPublicProducts } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  condition: string;
  grade: string;
  gradingCompany?: string;
  quantity: number;
  images?: string[] | null;
  cardImage?: string | null;
  category: string;
  productType: string;
  isFeatured?: boolean;
  isGraded?: boolean;
}

export default function Catalog() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPublicProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const regularProducts = products.filter(p => !p.isFeatured);

  if (loading) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: '#DC2626' }}>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: '#6B7280' }}>No products available</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1F6FAF 0%, #2E9B5F 100%)', color: 'white', padding: '60px 24px', textAlign: 'center', borderBottom: '4px solid #D96C2C' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 16px', fontFamily: 'Georgia, serif' }}>Rare Trading Cards</h1>
        <p style={{ fontSize: '18px', margin: '0', opacity: 0.95 }}>Hand-picked graded cards and premium collections</p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{products.length} cards available</p>
          <button onClick={handleRefresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#1F6FAF', color: 'white', border: 'none', borderRadius: '8px', cursor: refreshing ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '14px', opacity: refreshing ? 0.7 : 1 }}>
            <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Featured Section */}
        {featuredProducts.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Sparkles size={24} style={{ color: '#D8A23A' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#18212F', margin: 0 }}>⭐ Featured Graded Cards</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} navigate={navigate} addToCart={addToCart} />
              ))}
            </div>
            <hr style={{ border: 'none', height: '1px', background: 'linear-gradient(90deg, transparent, #DDD2C2, transparent)', margin: '40px 0' }} />
          </div>
        )}

        {/* All Cards */}
        {regularProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#18212F', marginBottom: '24px' }}>All Cards</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {regularProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && <div style={{ textAlign: 'center', padding: '60px 24px' }}><p style={{ fontSize: '18px', color: '#6B7280' }}>No cards available</p></div>}
      </div>
    </div>
  );
}

function FeaturedProductCard({ product, navigate, addToCart }: { product: Product; navigate: any; addToCart: any }) {
  return (
    <div onClick={() => navigate(`/product/${product.id}`)} style={{ backgroundColor: 'white', borderRadius: '16px', border: '2px solid #D8A23A', boxShadow: '0 8px 24px rgba(216,162,58,0.15)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(216,162,58,0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(216,162,58,0.15)'; }}>
      <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#D8A23A', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, zIndex: 10 }}>⭐ Featured</div>
      <div style={{ width: '100%', height: '280px', backgroundColor: '#F7F2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{product.images && product.images[0] ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : product.cardImage ? <img src={product.cardImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '80px' }}>🎴</span>}</div>
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 8px' }}>{product.category}</p>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#18212F', margin: '0 0 14px', minHeight: '44px' }}>{product.name}</h3>
        <div style={{ backgroundColor: '#1F6FAF15', border: '1px solid #1F6FAF', borderRadius: '8px', padding: '10px', marginBottom: '14px', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: '#6B7280', margin: 0, marginBottom: '4px' }}>GRADE</p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#D96C2C', margin: 0 }}>{product.gradingCompany ? `${product.gradingCompany} ${product.grade}` : product.grade}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
          <div style={{ backgroundColor: '#2E9B5F15', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><p style={{ fontSize: '9px', color: '#6B7280', margin: 0, marginBottom: '2px', textTransform: 'uppercase' }}>Condition</p><p style={{ fontSize: '12px', fontWeight: 700, color: '#2E9B5F', margin: 0 }}>{product.condition}</p></div>
          <div style={{ backgroundColor: '#7C3AED15', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><p style={{ fontSize: '9px', color: '#6B7280', margin: 0, marginBottom: '2px', textTransform: 'uppercase' }}>Type</p><p style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', margin: 0 }}>{product.productType}</p></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', paddingTop: '14px', borderTop: '1px solid #F0E8DC' }}>
          <div><p style={{ fontSize: '11px', color: '#6B7280', margin: 0, marginBottom: '4px' }}>Price</p><p style={{ fontSize: '22px', fontWeight: 700, color: '#D96C2C', margin: 0 }}>€{product.price.toFixed(2)}</p></div>
          <button onClick={(e) => { e.stopPropagation(); addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, grade: product.grade, condition: product.condition }); navigate('/cart'); }} style={{ backgroundColor: '#D96C2C', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c95a1f')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D96C2C')}><ShoppingCart size={16} /> Add</button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, navigate, addToCart }: { product: Product; navigate: any; addToCart: any }) {
  return (
    <div onClick={() => navigate(`/product/${product.id}`)} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #DDD2C2', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
      <div style={{ width: '100%', height: '220px', backgroundColor: '#F7F2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{product.images && product.images[0] ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : product.cardImage ? <img src={product.cardImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '70px' }}>🎴</span>}</div>
      <div style={{ padding: '14px' }}>
        <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 6px' }}>{product.category}</p>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#18212F', margin: '0 0 10px', minHeight: '36px' }}>{product.name}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div><span style={{ fontSize: '9px', color: '#6B7280', display: 'block', marginBottom: '2px' }}>Grade</span><span style={{ fontSize: '12px', fontWeight: 700, color: '#D96C2C' }}>{product.gradingCompany ? `${product.gradingCompany.slice(0, 3)} ${product.grade}` : product.grade}</span></div>
          <div style={{ textAlign: 'right' }}><span style={{ fontSize: '9px', color: '#6B7280', display: 'block', marginBottom: '2px' }}>Condition</span><span style={{ fontSize: '12px', fontWeight: 600, color: '#2E9B5F' }}>{product.condition}</span></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F0E8DC' }}>
          <div><p style={{ fontSize: '10px', color: '#6B7280', margin: 0 }}>Price</p><p style={{ fontSize: '18px', fontWeight: 700, color: '#18212F', margin: '2px 0 0' }}>€{product.price.toFixed(2)}</p></div>
          <button onClick={(e) => { e.stopPropagation(); addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, grade: product.grade, condition: product.condition }); }} style={{ backgroundColor: '#1F6FAF', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#164f8a')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1F6FAF')}><ShoppingCart size={14} /></button>
        </div>
      </div>
    </div>
  );
}
