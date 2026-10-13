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
      <div style={{
        background: 'linear-gradient(135deg, #1F6FAF 0%, #7C3AED 50%, #2E9B5F 100%)',
        color: 'white',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '6px solid #D96C2C',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 20% 50%, #D96C2C 0%, transparent 50%), radial-gradient(circle at 80% 80%, #D8A23A 0%, transparent 50%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 16px', color: '#D8A23A' }}>✨ Welcome to Explorer Cards ✨</p>
          <h1 style={{ fontSize: '56px', fontWeight: 700, margin: '0 0 16px', fontFamily: 'Georgia, serif', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>Rare Trading Cards</h1>
          <p style={{ fontSize: '20px', opacity: 0.95, maxWidth: '700px', margin: '0 auto' }}>Discover hand-picked graded cards, premium collections, and legendary finds</p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 24px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Collection Size</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: '#1F6FAF', margin: 0 }}>{products.length} Cards Available</p>
          </div>
          <button onClick={handleRefresh} disabled={refreshing} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px',
            background: 'linear-gradient(135deg, #1F6FAF 0%, #2E9B5F 100%)',
            color: 'white', border: '2px solid #D96C2C', borderRadius: '12px', cursor: refreshing ? 'not-allowed' : 'pointer',
            fontWeight: 700, fontSize: '15px', opacity: refreshing ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(31,111,175,0.3)', transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => !refreshing && (e.currentTarget.style.boxShadow = '0 8px 24px rgba(31,111,175,0.5)')}
          onMouseLeave={(e) => !refreshing && (e.currentTarget.style.boxShadow = '0 4px 16px rgba(31,111,175,0.3)')}>
            <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh Inventory'}
          </button>
        </div>

        {/* Featured Section */}
        {featuredProducts.length > 0 && (
          <div style={{ marginBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '8px', height: '40px', background: 'linear-gradient(180deg, #D96C2C 0%, #D8A23A 100%)', borderRadius: '4px' }}></div>
              <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#18212F', margin: 0, fontFamily: 'Georgia, serif' }}>
                <Sparkles size={32} style={{ display: 'inline-block', marginRight: '12px', color: '#D8A23A' }} />
                Featured Graded Treasures
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px', marginBottom: '60px' }}>
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} navigate={navigate} addToCart={addToCart} />
              ))}
            </div>
            <hr style={{ border: 'none', height: '2px', background: 'linear-gradient(90deg, transparent, #D96C2C, transparent)', margin: '60px 0' }} />
          </div>
        )}

        {/* All Cards */}
        {regularProducts.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '8px', height: '40px', background: 'linear-gradient(180deg, #1F6FAF 0%, #7C3AED 100%)', borderRadius: '4px' }}></div>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#18212F', margin: 0, fontFamily: 'Georgia, serif' }}>All Cards in Stock</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {regularProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && <div style={{ textAlign: 'center', padding: '80px 24px' }}><p style={{ fontSize: '20px', color: '#6B7280' }}>No cards available</p></div>}
      </div>
    </div>
  );
}

function FeaturedProductCard({ product, navigate, addToCart }: { product: Product; navigate: any; addToCart: any }) {
  return (
    <div onClick={() => navigate(`/product/${product.id}`)} style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '2.5px solid #D8A23A',
      boxShadow: '0 0 24px rgba(216,162,58,0.25), inset 0 1px 0 rgba(255,255,255,0.8)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      position: 'relative',
      background: 'linear-gradient(135deg, white 0%, #FAFAF8 100%)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 0 40px rgba(216,162,58,0.4), inset 0 1px 0 rgba(255,255,255,0.8)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 0 24px rgba(216,162,58,0.25), inset 0 1px 0 rgba(255,255,255,0.8)';
    }}>
      <div style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#D8A23A', color: 'white', padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, zIndex: 10, boxShadow: '0 4px 12px rgba(216,162,58,0.3)' }}>⭐ Premium</div>
      
      <div style={{ width: '100%', height: '300px', backgroundColor: '#F7F2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 0%, rgba(216,162,58,0.1) 100%)', pointerEvents: 'none' }}></div>
        {product.images && product.images[0] ? 
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
          : product.cardImage ? 
          <img src={product.cardImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
          : <span style={{ fontSize: '80px' }}>🎴</span>}
      </div>
      
      <div style={{ padding: '24px' }}>
        <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', margin: '0 0 8px' }}>
          {product.category}
        </p>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#18212F', margin: '0 0 16px', minHeight: '48px', lineHeight: '1.4' }}>
          {product.name}
        </h3>
        
        <div style={{ background: 'linear-gradient(135deg, rgba(31,111,175,0.1) 0%, rgba(216,162,58,0.1) 100%)', border: '1.5px solid #1F6FAF', borderRadius: '10px', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: '#6B7280', margin: '0 0 4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grade</p>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#D96C2C', margin: 0 }}>
            {product.gradingCompany ? `${product.gradingCompany} ${product.grade}` : product.grade}
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(46,155,95,0.1) 0%, rgba(46,155,95,0.05) 100%)', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid rgba(46,155,95,0.3)' }}>
            <p style={{ fontSize: '9px', color: '#6B7280', margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 700 }}>Condition</p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#2E9B5F', margin: 0 }}>{product.condition}</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(124,58,237,0.05) 100%)', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid rgba(124,58,237,0.3)' }}>
            <p style={{ fontSize: '9px', color: '#6B7280', margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 700 }}>Type</p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED', margin: 0 }}>{product.productType}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '2px solid #F0E8DC' }}>
          <div>
            <p style={{ fontSize: '10px', color: '#6B7280', margin: '0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#D96C2C', margin: '4px 0 0' }}>€{product.price.toFixed(2)}</p>
          </div>
          <button onClick={(e) => {
            e.stopPropagation();
            addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, grade: product.grade, condition: product.condition });
            navigate('/cart');
          }}
          style={{
            background: 'linear-gradient(135deg, #D96C2C 0%, #c95a1f 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s',
            boxShadow: '0 4px 12px rgba(217,108,44,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(217,108,44,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(217,108,44,0.3)';
          }}>
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, navigate, addToCart }: { product: Product; navigate: any; addToCart: any }) {
  return (
    <div onClick={() => navigate(`/product/${product.id}`)} style={{
      backgroundColor: 'white',
      borderRadius: '14px',
      border: '1.5px solid #DDD2C2',
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      background: 'linear-gradient(135deg, white 0%, #FAFAF8 100%)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
      e.currentTarget.style.borderColor = '#1F6FAF';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      e.currentTarget.style.borderColor = '#DDD2C2';
    }}>
      <div style={{ width: '100%', height: '240px', backgroundColor: '#F7F2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 0%, rgba(31,111,175,0.05) 100%)', pointerEvents: 'none' }}></div>
        {product.images && product.images[0] ? 
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
          : product.cardImage ? 
          <img src={product.cardImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
          : <span style={{ fontSize: '60px' }}>🎴</span>}
      </div>
      
      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', margin: '0 0 6px' }}>
          {product.category}
        </p>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#18212F', margin: '0 0 12px', minHeight: '36px', lineHeight: '1.3' }}>
          {product.name}
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F0E8DC' }}>
          <div>
            <span style={{ fontSize: '8px', color: '#6B7280', display: 'block', marginBottom: '2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grade</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#D96C2C' }}>
              {product.gradingCompany ? `${product.gradingCompany.slice(0, 3)} ${product.grade}` : product.grade}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '8px', color: '#6B7280', display: 'block', marginBottom: '2px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Condition</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#2E9B5F' }}>{product.condition}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '10px' }}>
          <div>
            <p style={{ fontSize: '9px', color: '#6B7280', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#18212F', margin: '3px 0 0' }}>€{product.price.toFixed(2)}</p>
          </div>
          <button onClick={(e) => {
            e.stopPropagation();
            addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, grade: product.grade, condition: product.condition });
          }}
          style={{
            background: 'linear-gradient(135deg, #1F6FAF 0%, #164f8a 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(31,111,175,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(31,111,175,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(31,111,175,0.2)';
          }}>
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
