import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('localfix_user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('localfix_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Token verification check:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('localfix_user');
            setUser(null);
          }
        }
      } else {
        localStorage.removeItem('localfix_user');
        setUser(null);
      }
      setLoading(false);
    };
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('localfix_user', JSON.stringify(userData));
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      throw err;
    }
  };

  const registerCustomer = async (data) => {
    try {
      const res = await api.post('/auth/register/customer', data);
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('localfix_user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Registration successful! Welcome to LocalFix.');
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Customer registration failed.';
      toast.error(msg);
      throw err;
    }
  };

  const registerVendor = async (data) => {
    try {
      const res = await api.post('/auth/register/vendor', data);
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('localfix_user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Vendor registration successful!');
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Vendor registration failed.';
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('localfix_user');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerCustomer, registerVendor, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
