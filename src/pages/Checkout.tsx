import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '../store/useCart';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Integrate with Shopify Storefront API
      // For now, mock the checkout process
      setTimeout(() => {
        alert('Redirecting to Shopify checkout...');
        clearCart();
        navigate('/');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/cart')}
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
          Back to Cart
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Checkout Form */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#18212F', fontFamily: 'Georgia, serif', marginBottom: '24px' }}>
              Checkout
            </h1>

            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Contact Info */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #DDD2C2', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#18212F', margin: '0 0 16px' }}>
                  Contact Information
                </h3>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #DDD2C2',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Shipping Info */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #DDD2C2', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#18212F', margin: '0 0 16px' }}>
                  Shipping Address
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="First name" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #DDD2C2', fontSize: '14px' }} />
                  <input type="text" placeholder="Last name" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #DDD2C2', fontSize: '14px' }} />
                  <input type="text" placeholder="Street address" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #DDD2C2', fontSize: '14px', gridColumn: '1 / -1' }} />
                  <input type="text" placeholder="City" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #DDD2C2', fontSize: '14px' }} />
                  <input type="text" placeholder="Postal code" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #DDD2C2', fontSize: '14px' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#D96C2C',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '16px',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', margin: 0 }}>
                You will be redirected to our secure payment processor
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ height: 'fit-content' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #DDD2C2', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#18212F', margin: '0 0 16px' }}>
                Order Review
              </h3>

              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #F0E8DC' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ marginBottom: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#18212F' }}>{item.name}</span>
                      <span style={{ color: '#18212F' }}>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
                      Qty: {item.quantity} × €{item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6B7280' }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#18212F' }}>€{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6B7280' }}>Shipping</span>
                <span style={{ fontWeight: 600, color: '#2E9B5F' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #F0E8DC' }}>
                <span style={{ color: '#6B7280' }}>Tax (21%)</span>
                <span style={{ fontWeight: 600, color: '#18212F' }}>€{(total * 0.21).toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                <span style={{ fontWeight: 700, color: '#18212F' }}>Total</span>
                <span style={{ fontWeight: 700, color: '#D96C2C' }}>€{(total * 1.21).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
