import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, setToken, getToken, removeToken, setUser, getUser, removeUser } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      const savedUser = getUser();
      if (token && savedUser) {
        setUserState(savedUser);
        try {
          // Verify token is still valid
          const res = await authAPI.me();
          setUserState(res.data);
          setUser(res.data);
        } catch {
          // Token invalid, clear session
          removeToken();
          removeUser();
          setUserState(null);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      setToken(res.data.access_token);
      setUser(res.data.user);
      setUserState(res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (data) => {
    setError(null);
    try {
      const res = await authAPI.register(data);
      setToken(res.data.access_token);
      setUser(res.data.user);
      setUserState(res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = useCallback(() => {
    authAPI.logout().catch(() => {});
    removeToken();
    removeUser();
    setUserState(null);
  }, []);

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;