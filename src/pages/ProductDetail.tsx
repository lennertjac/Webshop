import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Loader } from 'lucide-react';
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
  category: string;
  productType: string;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchPublicProducts();
        const found = products.find((p: Product) => p.id === id);
        if (found) {
          setProduct(found);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size={32} style={{ color: '#1F6FAF', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: '#DC2626' }}>{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#1F6FAF',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '24px',
          }}
        >
          <ChevronLeft size={18} />
          Back to Catalog
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Image */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #DDD2C2',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              overflow: 'hidden',
            }}
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              '🎴'
            )}
          </div>

          {/* Details */}
          <div>
            <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 8px' }}>
              {product.category} • {product.productType}
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#18212F', fontFamily: 'Georgia, serif', margin: '0 0 16px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Grade</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#D96C2C', margin: '4px 0 0' }}>
                  {product.gradingCompany ? `${product.gradingCompany} ${product.grade}` : product.grade !== 'Ungraded' ? product.grade : 'Not Graded'}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Condition</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#2E9B5F', margin: '4px 0 0' }}>{product.condition}</p>
              </div>
            </div>

            {/* Specs */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #DDD2C2', padding: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#18212F', margin: '0 0 12px' }}>Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', margin: 0 }}>Category</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#18212F', margin: '4px 0 0' }}>{product.category}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', margin: 0 }}>Type</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#18212F', margin: '4px 0 0' }}>{product.productType}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', margin: 0 }}>Quantity</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#18212F', margin: '4px 0 0' }}>{product.quantity} in stock</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', margin: 0 }}>Condition</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#18212F', margin: '4px 0 0' }}>{product.condition}</p>
                </div>
              </div>
            </div>

            {/* Additional images gallery */}
            {product.images && product.images.length > 1 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#18212F', margin: '0 0 12px' }}>More Photos</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                  {product.images.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} ${idx + 2}`}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #DDD2C2', cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Price and Add to Cart */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Price</p>
                <p style={{ fontSize: '36px', fontWeight: 700, color: '#18212F', margin: '4px 0 0', fontFamily: 'Georgia, serif' }}>
                  €{product.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => {
                  addToCart({
                    id: product.id!,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    grade: product.grade,
                    condition: product.condition,
                  });
                  navigate('/cart');
                }}
                style={{
                  backgroundColor: '#D96C2C',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
