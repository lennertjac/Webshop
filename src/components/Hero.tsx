import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section style={{
      position: 'relative',
      minHeight: '85vh',
      width: '100%',
      overflow: 'hidden',
      background: '#080A0F',
    }}>
      {/* Background architectural layers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 800px 600px at 70% 30%, rgba(111, 140, 255, 0.15), transparent 60%),
          radial-gradient(ellipse 600px 500px at 30% 80%, rgba(139, 92, 246, 0.1), transparent 60%),
          linear-gradient(180deg, transparent 0%, rgba(8, 10, 15, 0.3) 100%)
        `,
        pointerEvents: 'none',
      }}></div>

      {/* Subtle mist effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        pointerEvents: 'none',
      }}></div>

      {/* Decorative lines (ancient architecture) */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Arch frames */}
        <path d="M 200 100 Q 300 0 400 100" stroke="rgba(111, 140, 255, 0.3)" strokeWidth="2" fill="none" />
        <path d="M 1000 150 Q 1100 50 1200 150" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" fill="none" />
        {/* Vertical lines */}
        <line x1="100" y1="100" x2="100" y2="800" stroke="rgba(200, 169, 107, 0.2)" strokeWidth="1" />
        <line x1="1300" y1="100" x2="1300" y2="800" stroke="rgba(200, 169, 107, 0.2)" strokeWidth="1" />
      </svg>

      {/* Floating particles */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: `rgba(${111 + i * 5}, ${140 + i * 3}, ${255 - i * 10}, 0.6)`,
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animation: `floatParticle ${3 + i * 0.5}s ease-in-out infinite`,
            }}
          ></div>
        ))}
      </div>

      {/* Central glowing card silhouette */}
      <div style={{
        position: 'absolute',
        right: '10%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '300px',
        height: '420px',
        background: 'linear-gradient(135deg, rgba(111, 140, 255, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '2px solid rgba(111, 140, 255, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 0 60px rgba(111, 140, 255, 0.4), inset 0 0 60px rgba(111, 140, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        animation: 'glowPulse 4s ease-in-out infinite',
      }}>
        {/* Card shine effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}></div>

        {/* Centered card icon/placeholder */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '120px',
          opacity: 0.3,
        }}>
          🎴
        </div>
      </div>

      {/* Content - Left center */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '60px',
        maxWidth: '55%',
      }}>
        <div style={{ animation: 'slideInUp 0.8s ease-out forwards' }}>
          {/* Tagline */}
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#C8A96B',
            marginBottom: '24px',
            opacity: 0.8,
          }}>
            ✨ WELCOME TO THE ARCHIVES ✨
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 600,
            color: '#F5F7FA',
            marginBottom: '24px',
            lineHeight: 1.1,
            fontFamily: "'Georgia', serif",
            textShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}>
            DISCOVER THE<br />
            <span style={{
              background: 'linear-gradient(135deg, #6F8CFF 0%, #8B5CF6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              EXTRAORDINARY
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: '18px',
            color: '#9AA3B2',
            marginBottom: '40px',
            lineHeight: 1.6,
            maxWidth: '450px',
          }}>
            Explore rare cards, legendary collectibles and treasures from across the TCG world. Each artifact tells a story.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '14px 40px',
                background: 'linear-gradient(135deg, #6F8CFF 0%, #8B5CF6 100%)',
                color: '#F5F7FA',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(111, 140, 255, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(111, 140, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(111, 140, 255, 0.4)';
              }}
            >
              BEGIN EXPLORING
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                padding: '14px 40px',
                background: 'transparent',
                color: '#F5F7FA',
                border: '1.5px solid rgba(111, 140, 255, 0.4)',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(111, 140, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(111, 140, 255, 0.4)';
              }}
            >
              ENTER THE VAULT
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        opacity: 0.6,
        animation: 'bounce 2s ease-in-out infinite',
      }}>
        <div style={{
          fontSize: '24px',
          color: '#6F8CFF',
        }}>
          ↓
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(12px); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 60px rgba(111, 140, 255, 0.4), inset 0 0 60px rgba(111, 140, 255, 0.1); }
          50% { box-shadow: 0 0 80px rgba(111, 140, 255, 0.6), inset 0 0 80px rgba(111, 140, 255, 0.2); }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
