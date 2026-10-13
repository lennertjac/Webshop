import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, RefreshCw } from 'lucide-react';
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
    <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#18212F', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
              Catalog
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
              Browse our collection of rare trading cards ({products.length} available)
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: '#1F6FAF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              opacity: refreshing ? 0.7 : 1,
            }}
          >
            <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #DDD2C2',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, boxShadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              {/* Image */}
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#F7F2E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '80px',
                overflow: 'hidden',
              }}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : product.cardImage ? (
                  <img
                    src={product.cardImage}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  '🎴'
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 8px' }}>
                  {product.category}
                </p>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#18212F', margin: '0 0 12px', minHeight: '40px' }}>
                  {product.name}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#6B7280', display: 'block', marginBottom: '2px' }}>Grade</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#D96C2C' }}>
                      {product.gradingCompany ? `${product.gradingCompany} ${product.grade}` : product.grade !== 'Ungraded' ? product.grade : 'Not Graded'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: '#6B7280', display: 'block', marginBottom: '2px' }}>Condition</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#2E9B5F' }}>{product.condition}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F0E8DC' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Price</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#18212F', margin: '4px 0 0' }}>
                      €{product.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        grade: product.grade,
                        condition: product.condition,
                      });
                      alert('Added to cart!');
                    }}
                    style={{
                      backgroundColor: '#D96C2C',
                      color: 'white',
                      border: 'none',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
