import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, saveSession, clearSession, isAuthenticated } from '../lib/auth';
import { clearCart } from '../lib/cart';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);

  const checkAuth = () => {
    const session = getSession();
    if (session) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password, remember = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      saveSession(data.user, data.token, remember);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Default to remember=true for new registrations
      saveSession(data.user, data.token, true);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    clearSession();
    clearCart(); // Clear cart when user logs out
    setUser(null);
    // Trigger cart update event so header/cart badge updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      // Update local user state and preserve remember setting
      const updatedUser = { ...user, ...updates };
      const session = getSession();
      saveSession(updatedUser, session.token, session.remember || false);
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
