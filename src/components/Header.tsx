import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: scrolled ? 'rgba(8, 10, 15, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px 40px',
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 600,
            fontFamily: "'Georgia', serif",
            color: '#F5F7FA',
            letterSpacing: '-0.5px',
          }}
        >
          ATLAS
        </div>

        {/* Center Navigation */}
        <nav style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
        }}>
          {['Explore', 'Cards', 'Sealed', 'Graded', 'The Vault', 'New Discoveries'].map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              style={{
                color: '#9AA3B2',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#6F8CFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9AA3B2')}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(111, 140, 255, 0.1)',
            border: '1px solid rgba(111, 140, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px 12px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(111, 140, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(111, 140, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.2)';
          }}>
            <Search size={18} style={{ color: '#6F8CFF' }} />
            <input
              type="text"
              placeholder="Search..."
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F5F7FA',
                outline: 'none',
                width: '150px',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9AA3B2',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#6F8CFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9AA3B2')}
          >
            <ShoppingCart size={20} />
          </button>

          {/* Auth */}
          {!user ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent',
                  color: '#9AA3B2',
                  border: '1px solid rgba(111, 140, 255, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#6F8CFF';
                  e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.6)';
                  e.currentTarget.style.background = 'rgba(111, 140, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9AA3B2';
                  e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'linear-gradient(135deg, #6F8CFF 0%, #8B5CF6 100%)',
                  color: '#F5F7FA',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(111, 140, 255, 0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
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
                  background: 'transparent',
                  color: '#9AA3B2',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#6F8CFF')}
                onMouseLeave={(e) => !showUserMenu && (e.currentTarget.style.color = '#9AA3B2')}
              >
                <User size={20} />
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'rgba(13, 17, 24, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
                  minWidth: '200px',
                  marginTop: '12px',
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
                      color: '#9AA3B2',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(111, 140, 255, 0.1)';
                      e.currentTarget.style.color = '#6F8CFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9AA3B2';
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
                      color: '#9AA3B2',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(111, 140, 255, 0.1)';
                      e.currentTarget.style.color = '#6F8CFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9AA3B2';
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
                      color: '#EF4444',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
