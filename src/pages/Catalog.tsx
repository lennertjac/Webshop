import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, RefreshCw, Star, Zap } from 'lucide-react';
import { useCart } from '../store/useCart';
import { fetchPublicProducts } from '../lib/supabase';
import Hero from '../components/Hero';

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
  const { addToCart: addToCartFn } = useCart();
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

  const addToCart = (product: Partial<Product>) => {
    addToCartFn({ ...product, quantity: 1 } as any);
  };

  const featuredProducts = products.filter((p) => p.isFeatured);
  const regularProducts = products.filter((p) => !p.isFeatured);

  return (
    <main style={{ background: '#080A0F', color: '#F5F7FA' }}>
      {/* Hero Section */}
      <Hero />

      {/* Main Catalog Section */}
      <section style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '80px 40px',
      }}>
        {/* Section Header with Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '60px',
          gap: '40px',
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#C8A96B',
              marginBottom: '12px',
            }}>
              COLLECTION
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 600,
              color: '#F5F7FA',
              margin: 0,
              fontFamily: "'Georgia', serif",
            }}>
              {products.length} {products.length === 1 ? 'Artifact' : 'Artifacts'} Available
            </h2>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              background: refreshing
                ? 'rgba(111, 140, 255, 0.2)'
                : 'linear-gradient(135deg, #6F8CFF 0%, #8B5CF6 100%)',
              color: '#F5F7FA',
              border: 'none',
              borderRadius: '8px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '14px',
              boxShadow: '0 8px 24px rgba(111, 140, 255, 0.3)',
              transition: 'all 0.3s ease',
              opacity: refreshing ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!refreshing) {
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(111, 140, 255, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!refreshing) {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(111, 140, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Syncing...' : 'Refresh Inventory'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#FCA5A5',
            marginBottom: '40px',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Featured Graded Treasures */}
        {featuredProducts.length > 0 && (
          <div style={{ marginBottom: '100px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}>
              <div style={{
                width: '6px',
                height: '40px',
                background: 'linear-gradient(180deg, #C8A96B 0%, #6F8CFF 100%)',
                borderRadius: '3px',
              }}></div>
              <div>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#C8A96B',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Star size={16} fill="currentColor" />
                  FEATURED GRADED TREASURES
                </h3>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '28px',
              marginBottom: '40px',
            }}>
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} navigate={navigate} addToCart={addToCart} />
              ))}
            </div>

            <hr style={{
              border: 'none',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
              margin: '60px 0',
            }} />
          </div>
        )}

        {/* All Cards Collection */}
        {regularProducts.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}>
              <div style={{
                width: '6px',
                height: '40px',
                background: 'linear-gradient(180deg, #8B5CF6 0%, #6F8CFF 100%)',
                borderRadius: '3px',
              }}></div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#6F8CFF',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Zap size={16} fill="currentColor" />
                ALL TREASURES IN VAULT
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {regularProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
            color: '#9AA3B2',
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📭</div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#F5F7FA' }}>Vault Appears Empty</h3>
            <p style={{ fontSize: '16px' }}>No artifacts available at this moment. Check back soon for new discoveries.</p>
          </div>
        )}

        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
          }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid rgba(111, 140, 255, 0.2)',
              borderTopColor: '#6F8CFF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
            <p style={{ marginTop: '20px', color: '#9AA3B2' }}>Accessing the vault...</p>
          </div>
        )}
      </section>
    </main>
  );
}

function FeaturedProductCard({ product, navigate, addToCart }: { product: Product; navigate: any; addToCart: any }) {
  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        background: 'linear-gradient(135deg, rgba(17, 21, 31, 0.8) 0%, rgba(17, 21, 31, 0.6) 100%)',
        border: '1px solid rgba(111, 140, 255, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px)';
        e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.5)';
        e.currentTarget.style.boxShadow = '0 24px 48px rgba(111, 140, 255, 0.2)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(17, 21, 31, 0.95) 0%, rgba(17, 21, 31, 0.8) 100%)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.2)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(17, 21, 31, 0.8) 0%, rgba(17, 21, 31, 0.6) 100%)';
      }}
    >
      {/* Premium Badge */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'linear-gradient(135deg, #C8A96B 0%, #E8C47E 100%)',
        color: '#080A0F',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 700,
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(200, 169, 107, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        ★ Premium
      </div>

      {/* Image Container */}
      <div style={{
        width: '100%',
        height: '300px',
        background: 'linear-gradient(135deg, rgba(111, 140, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : product.cardImage ? (
          <img src={product.cardImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '100px', opacity: 0.3 }}>🎴</span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Category */}
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#C8A96B',
          marginBottom: '12px',
        }}>
          {product.category}
        </div>

        {/* Name */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#F5F7FA',
          margin: '0 0 16px',
          minHeight: '50px',
          lineHeight: 1.3,
          fontFamily: "'Georgia', serif",
        }}>
          {product.name}
        </h3>

        {/* Grade Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(111, 140, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(111, 140, 255, 0.3)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#9AA3B2',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '4px',
          }}>
            Grade
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#6F8CFF',
          }}>
            {product.gradingCompany ? `${product.gradingCompany} ${product.grade}` : product.grade}
          </div>
        </div>

        {/* Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{
            background: 'rgba(111, 140, 255, 0.08)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#9AA3B2',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}>
              Condition
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#6F8CFF',
            }}>
              {product.condition}
            </div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.08)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#9AA3B2',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '4px',
            }}>
              Type
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#8B5CF6',
            }}>
              {product.productType}
            </div>
          </div>
        </div>

        {/* Price and Add Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '12px',
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#9AA3B2',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}>
              Asking Price
            </div>
            <div style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#F5F7FA',
            }}>
              €{product.price.toFixed(2)}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              navigate('/cart');
            }}
            style={{
              background: 'linear-gradient(135deg, #6F8CFF 0%, #8B5CF6 100%)',
              color: '#F5F7FA',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(111, 140, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(111, 140, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(111, 140, 255, 0.3)';
            }}
          >
            <ShoppingCart size={16} />
            Claim
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, navigate, addToCart }: { product: Product; navigate: any; addToCart: any }) {
  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        background: 'rgba(17, 21, 31, 0.5)',
        border: '1px solid rgba(111, 140, 255, 0.15)',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.4)';
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(111, 140, 255, 0.15)';
        e.currentTarget.style.background = 'rgba(17, 21, 31, 0.7)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.15)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.background = 'rgba(17, 21, 31, 0.5)';
      }}
    >
      {/* Image */}
      <div style={{
        width: '100%',
        height: '240px',
        background: 'linear-gradient(135deg, rgba(111, 140, 255, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : product.cardImage ? (
          <img src={product.cardImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '80px', opacity: 0.2 }}>🎴</span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px' }}>
        {/* Category */}
        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: '#9AA3B2',
          marginBottom: '10px',
        }}>
          {product.category}
        </div>

        {/* Name */}
        <h4 style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#F5F7FA',
          margin: '0 0 12px',
          minHeight: '36px',
          lineHeight: 1.3,
        }}>
          {product.name}
        </h4>

        {/* Grade & Condition */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '12px',
        }}>
          <div>
            <span style={{ color: '#9AA3B2', fontSize: '9px', display: 'block', marginBottom: '2px', fontWeight: 700 }}>
              GRADE
            </span>
            <span style={{ color: '#6F8CFF', fontWeight: 700 }}>
              {product.grade}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#9AA3B2', fontSize: '9px', display: 'block', marginBottom: '2px', fontWeight: 700 }}>
              CONDITION
            </span>
            <span style={{ color: '#8B5CF6', fontWeight: 700 }}>
              {product.condition}
            </span>
          </div>
        </div>

        {/* Price and Action */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '10px',
        }}>
          <div>
            <div style={{
              fontSize: '9px',
              fontWeight: 700,
              color: '#9AA3B2',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '3px',
            }}>
              Price
            </div>
            <div style={{
              fontSize: '19px',
              fontWeight: 700,
              color: '#F5F7FA',
            }}>
              €{product.price.toFixed(2)}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            style={{
              background: 'rgba(111, 140, 255, 0.15)',
              color: '#6F8CFF',
              border: '1px solid rgba(111, 140, 255, 0.3)',
              padding: '10px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(111, 140, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(111, 140, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
