import Header from './Header';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(username, password);
      navigate('/signin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', height: '100%', background: 'radial-gradient(circle at 60% 40%, #2d0036 0%, #18181b 100%)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100%' }}>
        <div className="relative px-8 py-14" style={{ background: 'rgba(24,24,27,0.97)', boxShadow: '0 0 80px 10px #a259ff77', borderRadius: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="max-w-lg mx-auto" style={{ width: '100%' }}>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-8 text-gray-200 sm:text-xl sm:leading-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 className="text-4xl font-extrabold mb-10 text-center" style={{ color: '#fff' }}>Sign Up</h2>
                {error && (
                  <div className="bg-red-50 p-4 rounded-md mb-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6" style={{ width: '100%', maxWidth: '440px', margin: '0 auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1.1rem 1.2rem',
                      border: 'none',
                      borderRadius: '1rem',
                      fontSize: '1.25rem',
                      background: '#18181b',
                      color: '#fff',
                      boxShadow: '0 0 0 2px #a259ff33',
                      marginBottom: '1.2rem',
                      outline: 'none',
                      transition: 'box-shadow 0.2s',
                      boxSizing: 'border-box',
                    }}
                    required
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_]+"
                  />
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1.1rem 1.2rem',
                        border: 'none',
                        borderRadius: '1rem',
                        fontSize: '1.25rem',
                        background: '#18181b',
                        color: '#fff',
                        boxShadow: '0 0 0 2px #a259ff33',
                        marginBottom: '1.2rem',
                        outline: 'none',
                        transition: 'box-shadow 0.2s',
                        boxSizing: 'border-box',
                      }}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        position: 'absolute',
                        right: '1.2rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: '#a259ff',
                        fontSize: '1.3rem',
                      }}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        // Eye-off SVG
                        <svg width="22" height="22" fill="none" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.21-2.73 3.43-5 6.06-6.32M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.38 0 2.63-.83 3.16-2.03"/></svg>
                      ) : (
                        // Eye SVG
                        <svg width="22" height="22" fill="none" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', width: '100%' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '0.9rem 2.5rem',
                        borderRadius: '1rem',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        background: '#a259ff',
                        color: '#fff',
                        boxShadow: '0 2px 16px #a259ff44',
                        cursor: 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        minWidth: '140px',
                      }}
                    >
                      {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/signin')}
                      style={{
                        padding: '0.9rem 2.5rem',
                        borderRadius: '1rem',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        background: '#18181b',
                        color: '#fff',
                        boxShadow: '0 2px 16px #a259ff44',
                        cursor: 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        minWidth: '260px',
                      }}
                    >
                      Already have an account? Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;