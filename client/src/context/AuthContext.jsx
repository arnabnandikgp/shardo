import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Set default authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/signin', {
        username,
        password
      });
      setToken(response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'An error occurred during login' };
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/signup', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
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