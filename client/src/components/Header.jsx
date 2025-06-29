import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import shardoLogo from '../assets/shardo_og_gemini_svg.svg';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Only show header buttons on landing, dashboard, signin, signup
  // Remove Sign Up from header on landing page
  return (
    <header
      style={{
        width: '100%',
        padding: '1.5rem 0',
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
        boxSizing: 'border-box',
        background: 'linear-gradient(90deg, #1a1a2e 0%, #6a0572 50%, #1f4068 100%)',
        boxShadow: '0 2px 16px #6a057288',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <img src={shardoLogo} alt="Shardo Logo" style={{ width: 36, height: 36, marginRight: 12, verticalAlign: 'middle', borderRadius: '0.5rem', background: 'transparent' }} />
        <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#fff', letterSpacing: '2px', display: 'inline' }}>
          Shardo
        </div>
      </Link>
      <div style={{ marginRight: '2rem', display: 'flex', gap: '1rem' }}>
        {isAuthenticated() ? (
          <button style={{ ...btnStyle, background: '#a259ff', color: '#fff' }} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            {location.pathname === '/' && (
              <Link to="/signin">
                <button style={btnStyle}>Sign In</button>
              </Link>
            )}
            {location.pathname !== '/' && location.pathname !== '/signup' && (
              <Link to="/signup">
                <button style={btnStyle}>Sign Up</button>
              </Link>
            )}
            {location.pathname !== '/' && location.pathname !== '/signin' && (
              <Link to="/signin">
                <button style={btnStyle}>Sign In</button>
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}

const btnStyle = {
  padding: '0.5rem 1.2rem',
  borderRadius: '8px',
  border: 'none',
  background: '#fff',
  color: '#6a0572',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
};

export default Header; 