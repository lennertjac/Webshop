import { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export function RegisterPage() {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Belgium',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First and last name are required');
      return false;
    }
    if (!formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setError('Address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(authError || (err instanceof Error ? err.message : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F2E8', padding: '24px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
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
            marginBottom: '32px',
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
            Create Account
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 28px' }}>
            Register to get started and enjoy 15-minute holds on items
          </p>

          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={48} style={{ color: '#2E9B5F', marginBottom: '16px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#18212F', margin: '0 0 8px' }}>
                Account Created!
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                Redirecting to homepage...
              </p>
            </div>
          ) : (
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
                  placeholder="At least 8 characters"
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

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
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

              {/* Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
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
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
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
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
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

              {/* City & Postal Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Antwerp"
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
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="2000"
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
              </div>

              {/* Country & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
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
                      cursor: 'pointer',
                    }}
                  >
                    <option>Belgium</option>
                    <option>Netherlands</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Luxembourg</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+32 XXX XX XX XX"
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
                  backgroundColor: '#D96C2C',
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
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#c95a1f')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#D96C2C')}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Login Link */}
              <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', margin: '16px 0 0' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#1F6FAF',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  Login here
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
