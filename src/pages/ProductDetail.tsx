import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../store/useCart';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  // Mock product data
  const product = {
    id,
    name: 'Charizard Holographic',
    price: 250,
    condition: 'Near Mint',
    grade: 'PSA 8',
    quantity: 1,
    description: 'A beautiful holographic Charizard from the Base Set. This card is in near mint condition with excellent centering and minimal wear.',
    specs: {
      set: 'Base Set',
      year: '1999',
      rarity: 'Holo Rare',
      type: 'Fire/Flying',
    },
  };

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
            }}
          >
            🎴
          </div>

          {/* Details */}
          <div>
            <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 8px' }}>
              {product.specs.set} • {product.specs.year}
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#18212F', fontFamily: 'Georgia, serif', margin: '0 0 16px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Grade</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#D96C2C', margin: '4px 0 0' }}>{product.grade}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Condition</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#2E9B5F', margin: '4px 0 0' }}>{product.condition}</p>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Specs */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #DDD2C2', padding: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#18212F', margin: '0 0 12px' }}>Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', margin: 0 }}>{key}</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#18212F', margin: '4px 0 0' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

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
