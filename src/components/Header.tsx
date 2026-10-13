import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
  };

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

          {/* Auth Buttons */}
          {!user ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1.5px solid white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  backgroundColor: '#D96C2C',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c95a1f')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D96C2C')}
              >
                Register
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <User size={18} />
                {user.firstName}
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '180px',
                  marginTop: '8px',
                  zIndex: 100,
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#18212F',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderBottom: '1px solid #EDE8DC',
                    }}
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/orders');
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#18212F',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderBottom: '1px solid #EDE8DC',
                    }}
                  >
                    Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#DC2626',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c95a1f')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D96C2C')}
          >
            <ShoppingCart size={20} />
            Cart
          </button>
        </div>
      </div>
    </header>
  );
}
