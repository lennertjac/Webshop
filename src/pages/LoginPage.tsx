import { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(authError || (err instanceof Error ? err.message : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F2E8', padding: '24px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#1F6FAF',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            marginBottom: '48px',
            padding: 0,
          }}
        >
          <ArrowLeft size={18} />
          Back to shop
        </button>

        {/* Form Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid #EDE8DC',
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#18212F', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 28px' }}>
            Login to your account to access your cart and orders
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1.5px solid #DDD2C2',
                  fontSize: '14px',
                  color: '#18212F',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#FAFAF8',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1.5px solid #DDD2C2',
                  fontSize: '14px',
                  color: '#18212F',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#FAFAF8',
                }}
              />
            </div>

            {/* Errors */}
            {error && (
              <div style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                backgroundColor: '#FEE2E2',
                borderRadius: '8px',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: '13px',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px',
                backgroundColor: '#1F6FAF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s',
                marginTop: '8px',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#164f8a')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1F6FAF')}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>

            {/* Register Link */}
            <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', margin: '16px 0 0' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#D96C2C',
                  cursor: 'pointer',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
