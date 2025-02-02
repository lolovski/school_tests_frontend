import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const isAuthenticated = await authService.checkAuth();
      if (isAuthenticated) {
        const profile = await authService.getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (values) => {
    try {
      await authService.login(values);
      await checkAuth();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (values) => {
    try {
      await authService.register(values);
      await checkAuth();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
      <AuthContext.Provider value={{ user, login, logout, register, checkAuth, loading }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);