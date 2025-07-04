import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authentication state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedPublicKey = localStorage.getItem('publicKey');
    
    if (storedToken && storedPublicKey) {
      setToken(storedToken);
      setUser({ publicKey: storedPublicKey });
    }
    
    setLoading(false);
  }, []);

  const signup = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/signup', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      // Check for Zod validation error details
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        // Find the first password-related error if present
        const passwordError = error.response.data.details.find(
          (err) => err.path && err.path.includes('password') && err.message
        );
        if (passwordError) {
          throw new Error(passwordError.message);
        }
        // Otherwise, show the first validation error
        if (error.response.data.details[0]?.message) {
          throw new Error(error.response.data.details[0].message);
        }
      }
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const signin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/signin', {
        username,
        password,
      });
      
      const { token, publicKey } = response.data;
      setToken(token);
      setUser({ publicKey });
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('publicKey', publicKey);
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Signin failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('publicKey');
  };

  const isAuthenticated = () => {
    return !!token;
  };

  // Don't render children until we've checked localStorage
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, signup, signin, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};