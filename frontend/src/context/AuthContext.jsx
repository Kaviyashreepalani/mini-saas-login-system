import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await api.getProfile();
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      showToast(`Welcome back, ${response.user.name}! 👋`, 'success');
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.signup({ name, email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      showToast(`Account created successfully! Welcome, ${response.user.name}! 🎉`, 'success');
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      const userName = user?.name || 'User';
      setUser(null);
      showToast(`Goodbye, ${userName}! See you soon! 👋`, 'success');
    } catch (error) {
      showToast('Logout failed. Please try again.', 'error');
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};