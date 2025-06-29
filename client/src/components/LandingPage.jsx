import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import learnHowItWorksContent from '../content/learnHowItWorks';

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', height: '100%', background: 'radial-gradient(circle at 60% 40%, #2d0036 0%, #18181b 100%)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100%' }}>
        <div style={{
          background: 'rgba(24, 24, 27, 0.95)',
          boxShadow: '0 0 40px #a259ff55',
          borderRadius: '2rem',
          padding: '3rem 2.5rem',
          width: '100%',
          maxWidth: '480px',
          textAlign: 'center',
          marginTop: '6.5rem',
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', color: '#a259ff' }}>
            Welcome to Shardo!
          </h1>
          <ul style={{ textAlign: 'left', margin: '1.5rem 0', fontSize: '1.15rem', lineHeight: 1.7 }}>
            <li>🔒 Secure your private key with <b>Threshold Signature Scheme (TSS)</b></li>
            <li>🤝 Multi-party computation (MPC) for transaction signing</li>
            <li>🛡️  Non-custodial, privacy-first wallet experience</li>
            <li>💸 Request airdrops and send transactions easily</li>
            <li>⚡ Fast, modern, and open-source</li>
          </ul>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            {!isAuthenticated() ? (
              <Link to="/signup"><button style={ctaBtnStyle}>Get Started</button></Link>
            ) : (
              <button style={ctaBtnStyle} onClick={() => navigate('/dashboard')}>Start Trading</button>
            )}
          </div>
        </div>
      </main>
      {/* Learn How It Works Section */}
      <section style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ color: '#a259ff', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '1px' }}>Learn How It Works</h2>
        <div style={{
          background: 'rgba(24, 24, 27, 0.97)',
          boxShadow: '0 0 60px 10px #a259ff44',
          borderRadius: '2rem',
          padding: '2.5rem 2.5rem',
          width: '100%',
          maxWidth: '900px',
          minHeight: '160px',
          color: '#eee',
          fontSize: '1.15rem',
          textAlign: 'left',
        }}>
          {learnHowItWorksContent.split(/\n+/).map((para, idx) => para.trim() && (
            <p key={idx} style={{ marginBottom: '1.2em', lineHeight: 1.7 }}>{para}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

const ctaBtnStyle = {
  padding: '0.8rem 2rem',
  borderRadius: '8px',
  border: 'none',
  background: '#a259ff',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.1rem',
  cursor: 'pointer',
  boxShadow: '0 2px 16px #a259ff44',
  transition: 'background 0.2s, color 0.2s',
};

export default LandingPage; 