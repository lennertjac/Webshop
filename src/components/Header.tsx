import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header style={{ backgroundColor: '#1F6FAF', color: 'white', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '24px', fontWeight: 700, fontFamily: 'Georgia, serif' }}>
          Explorer Cards
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 12px' }}>
            <Search size={18} style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search cards..."
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                outline: 'none',
                width: '200px',
              }}
              onFocus={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onBlur={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            />
          </div>
          <button
            onClick={() => navigate('/cart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#D96C2C',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <ShoppingCart size={20} />
            Cart
          </button>
        </div>
      </div>
    </header>
  );
}
