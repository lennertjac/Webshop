import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useCart } from '../store/useCart';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#F7F2E8', minHeight: 'calc(100vh - 70px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', paddingTop: '80px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#18212F', fontFamily: 'Georgia, serif', marginBottom: '16px' }}>
            Your cart is empty
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>
            Start adding some rare cards to your collection
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#D96C2C',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Continue Shopping
          </button>
        </div>
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
          Continue Shopping
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Items */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#18212F', fontFamily: 'Georgia, serif', marginBottom: '24px' }}>
              Shopping Cart ({cartItems.length} items)
            </h1>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #DDD2C2', overflow: 'hidden' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: '1px solid #F0E8DC',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#18212F', margin: 0 }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0' }}>
                      PSA {item.grade} • {item.condition}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Qty: {item.quantity}</p>
                      <p style={{ fontSize: '18px', fontWeight: 700, color: '#18212F', margin: '4px 0 0' }}>
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ height: 'fit-content' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #DDD2C2', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#18212F', margin: '0 0 16px' }}>Order Summary</h3>

              <div style={{ borderBottom: '1px solid #F0E8DC', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6B7280' }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#18212F' }}>€{total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6B7280' }}>Shipping</span>
                  <span style={{ fontWeight: 600, color: '#2E9B5F' }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Tax</span>
                  <span style={{ fontWeight: 600, color: '#18212F' }}>€{(total * 0.21).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px' }}>
                <span style={{ fontWeight: 700, color: '#18212F' }}>Total</span>
                <span style={{ fontWeight: 700, color: '#D96C2C' }}>€{(total * 1.21).toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                style={{
                  width: '100%',
                  backgroundColor: '#D96C2C',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '16px',
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
